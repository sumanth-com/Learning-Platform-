import type { ChatMessageInput, LearningContext } from "@/features/ai-mentor/types";
import {
  buildMentorSystemPrompt,
  friendlyLlmError,
} from "@/features/ai-mentor/providers/types";
import { chatRequestSchema } from "@/features/ai-mentor/schemas/mentor-schemas";
import {
  createLlmProvider,
  getEnvProviderConfig,
} from "@/features/ai-mentor/providers/create-provider";
import { MentorService } from "@/features/ai-mentor/services/mentor.service";
import { createClient } from "@/lib/supabase/server";
import { ensureProfile, formatDbError } from "@/lib/supabase/ensure-profile";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "User session missing. Sign in again." }, { status: 401 });
  }

  try {
    await ensureProfile(supabase, user);
  } catch (error) {
    console.error("[ai-mentor/chat] ensureProfile failed", error);
    return Response.json(
      { error: formatDbError(error, "Failed to ensure user profile.") },
      { status: 500 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request." },
      { status: 400 }
    );
  }

  const envConfig = getEnvProviderConfig();
  if (!envConfig.keyPresent) {
    return Response.json(
      {
        error:
          "Gemini API key is missing. Add GOOGLE_GENERATIVE_AI_API_KEY to .env.local and restart the server.",
      },
      { status: 503 }
    );
  }

  const { conversationId, content, learningContext, mode, messageId } =
    parsed.data;
  const service = new MentorService(supabase);

  const conversation = await service.getConversation(conversationId, user.id);
  if (!conversation) {
    return Response.json({ error: "Conversation not found." }, { status: 404 });
  }

  // Prefer env provider; allow per-user model/temperature/system extras from settings
  const settings = await service.getSettings(user.id);
  const provider = createLlmProvider({
    provider: envConfig.provider,
    model: settings?.preferred_model || envConfig.model,
  });

  const history = await service.listMessages(conversationId, user.id);
  const chatHistory: ChatMessageInput[] = history
    .filter((m) => m.role === "user" || m.role === "assistant")
    .filter((m) => m.status === "complete" || m.role === "user")
    .filter((m) => m.content.trim().length > 0)
    .map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

  let userMessageId: string | null = null;
  let autoTitle: string | null = null;

  if (mode === "send") {
    const userMessage = await service.createUserMessage(
      conversationId,
      user.id,
      content
    );
    userMessageId = userMessage.id;
    chatHistory.push({ role: "user", content });
    const titled = await service.maybeAutoTitle(conversation, user.id, content);
    if (titled.title !== conversation.title) autoTitle = titled.title;
  } else if (mode === "regenerate") {
    const targetId =
      messageId ?? history.filter((m) => m.role === "assistant").at(-1)?.id;
    if (targetId) {
      await service.deleteMessage(targetId, user.id);
    }
    const refreshed = await service.listMessages(conversationId, user.id);
    chatHistory.length = 0;
    chatHistory.push(
      ...refreshed
        .filter((m) => m.role === "user" || m.role === "assistant")
        .filter((m) => m.status === "complete" || m.role === "user")
        .filter((m) => m.content.trim().length > 0)
        .map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        }))
    );
  } else if (mode === "continue") {
    const continueText = "Please continue from where you left off.";
    chatHistory.push({ role: "user", content: continueText });
    const continueMsg = await service.createUserMessage(
      conversationId,
      user.id,
      continueText
    );
    userMessageId = continueMsg.id;
  }

  if (chatHistory.length === 0) {
    return Response.json(
      { error: "No messages to send. Start a new chat first." },
      { status: 400 }
    );
  }

  const assistant = await service.createAssistantPlaceholder(
    conversationId,
    user.id,
    provider.model
  );

  await service.touchConversation(conversationId, user.id);

  const system = buildMentorSystemPrompt(
    (learningContext as LearningContext | undefined) ?? null,
    settings?.system_extra ?? ""
  );

  const encoder = new TextEncoder();
  let fullText = "";
  const temperature = settings?.temperature ?? 0.4;

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        try {
          controller.enqueue(
            encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
          );
        } catch {
          // controller already closed
        }
      };

      send("meta", {
        conversationId,
        assistantMessageId: assistant.id,
        userMessageId,
        model: provider.model,
        provider: provider.id,
      });

      try {
        for await (const chunk of provider.streamChat({
          messages: chatHistory,
          system,
          temperature,
          signal: request.signal,
        })) {
          if (request.signal.aborted) break;
          fullText += chunk;
          send("token", { text: chunk });
        }

        if (request.signal.aborted) {
          await service.finalizeAssistant(
            assistant.id,
            user.id,
            fullText,
            "cancelled"
          );
          send("cancelled", {
            message: "Stopped.",
            content: fullText,
            assistantMessageId: assistant.id,
          });
          controller.close();
          return;
        }

        if (!fullText.trim()) {
          const message =
            "The model returned an empty reply. Try again or rephrase your question.";
          await service.finalizeAssistant(
            assistant.id,
            user.id,
            fullText,
            "error",
            message
          );
          send("error", {
            message,
            content: fullText,
            assistantMessageId: assistant.id,
          });
          controller.close();
          return;
        }

        await service.finalizeAssistant(
          assistant.id,
          user.id,
          fullText,
          "complete"
        );
        await service.touchConversation(conversationId, user.id);
        send("done", {
          assistantMessageId: assistant.id,
          content: fullText,
          title: autoTitle ?? undefined,
        });
        controller.close();
      } catch (error) {
        const cancelled = request.signal.aborted;
        const message = cancelled ? "Stopped." : friendlyLlmError(error);
        await service.finalizeAssistant(
          assistant.id,
          user.id,
          fullText,
          cancelled ? "cancelled" : "error",
          cancelled ? undefined : message
        );
        send(cancelled ? "cancelled" : "error", {
          message,
          content: fullText,
          assistantMessageId: assistant.id,
        });
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
