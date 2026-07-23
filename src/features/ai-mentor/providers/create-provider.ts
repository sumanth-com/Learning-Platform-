import { streamText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import type {
  LlmProvider,
  LlmProviderId,
  StreamChatInput,
} from "@/features/ai-mentor/providers/types";

function resolveProviderId(
  override?: LlmProviderId | string | null
): LlmProviderId {
  const raw = (
    override ||
    process.env.AI_MENTOR_PROVIDER ||
    "gemini"
  ).toLowerCase();
  if (raw === "openai" || raw === "anthropic" || raw === "gemini") return raw;
  return "gemini";
}

async function* streamFromAiSdk(
  result: ReturnType<typeof streamText>
): AsyncGenerator<string> {
  for await (const part of result.textStream) {
    if (part) yield part;
  }
}

function toCoreMessages(input: StreamChatInput) {
  return input.messages
    .filter((m) => m.role === "user" || m.role === "assistant")
    .filter((m) => m.content.trim().length > 0)
    .map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));
}

class GeminiProvider implements LlmProvider {
  id = "gemini" as const;
  model: string;

  constructor(model?: string) {
    this.model = model || process.env.AI_MENTOR_MODEL || "gemini-flash-latest";
  }

  async *streamChat(input: StreamChatInput) {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim();
    if (!apiKey) {
      throw new Error(
        "Missing GOOGLE_GENERATIVE_AI_API_KEY. Add it to .env.local to enable AI Mentor."
      );
    }
    const messages = toCoreMessages(input);
    if (messages.length === 0) {
      throw new Error("Nothing to send to the model.");
    }
    const google = createGoogleGenerativeAI({ apiKey });
    const result = streamText({
      model: google(this.model),
      system: input.system,
      messages,
      temperature: input.temperature ?? 0.4,
      abortSignal: input.signal,
    });
    yield* streamFromAiSdk(result);
  }
}

class OpenAIProvider implements LlmProvider {
  id = "openai" as const;
  model: string;

  constructor(model?: string) {
    this.model = model || process.env.AI_MENTOR_MODEL || "gpt-4o-mini";
  }

  async *streamChat(input: StreamChatInput) {
    const apiKey = process.env.OPENAI_API_KEY?.trim();
    if (!apiKey) {
      throw new Error(
        "Missing OPENAI_API_KEY. Add it to .env.local to enable AI Mentor."
      );
    }
    const messages = toCoreMessages(input);
    if (messages.length === 0) {
      throw new Error("Nothing to send to the model.");
    }
    const openai = createOpenAI({ apiKey });
    const result = streamText({
      model: openai(this.model),
      system: input.system,
      messages,
      temperature: input.temperature ?? 0.4,
      abortSignal: input.signal,
    });
    yield* streamFromAiSdk(result);
  }
}

class AnthropicProvider implements LlmProvider {
  id = "anthropic" as const;
  model: string;

  constructor(model?: string) {
    this.model =
      model || process.env.AI_MENTOR_MODEL || "claude-3-5-haiku-latest";
  }

  async *streamChat(input: StreamChatInput) {
    const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
    if (!apiKey) {
      throw new Error(
        "Missing ANTHROPIC_API_KEY. Add it to .env.local to enable AI Mentor."
      );
    }
    const messages = toCoreMessages(input);
    if (messages.length === 0) {
      throw new Error("Nothing to send to the model.");
    }
    const anthropic = createAnthropic({ apiKey });
    const result = streamText({
      model: anthropic(this.model),
      system: input.system,
      messages,
      temperature: input.temperature ?? 0.4,
      abortSignal: input.signal,
    });
    yield* streamFromAiSdk(result);
  }
}

export function createLlmProvider(options?: {
  provider?: LlmProviderId | string | null;
  model?: string | null;
}): LlmProvider {
  const id = resolveProviderId(options?.provider);
  const model = options?.model?.trim() || undefined;
  if (id === "openai") return new OpenAIProvider(model);
  if (id === "anthropic") return new AnthropicProvider(model);
  return new GeminiProvider(model);
}

export function getEnvProviderConfig() {
  const provider = resolveProviderId();
  const keyPresent =
    provider === "gemini"
      ? Boolean(process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim())
      : provider === "openai"
        ? Boolean(process.env.OPENAI_API_KEY?.trim())
        : Boolean(process.env.ANTHROPIC_API_KEY?.trim());
  return {
    provider,
    model: process.env.AI_MENTOR_MODEL || null,
    keyPresent,
  };
}
