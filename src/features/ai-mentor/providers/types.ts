import type { ChatMessageInput, LearningContext } from "@/features/ai-mentor/types";

export type StreamChatInput = {
  messages: ChatMessageInput[];
  system: string;
  temperature?: number;
  model?: string;
  signal?: AbortSignal;
};

export type LlmProviderId = "gemini" | "openai" | "anthropic";

export interface LlmProvider {
  id: LlmProviderId;
  model: string;
  streamChat(input: StreamChatInput): AsyncIterable<string>;
}

export function buildMentorSystemPrompt(
  learningContext?: LearningContext | null,
  systemExtra?: string
): string {
  const base = `You are SupraBase AI Mentor — a premium software engineering mentor comparable to ChatGPT, Claude, Gemini, and Copilot.

You help with ANY technology question, not only SupraBase curriculum:
- Programming languages and frameworks
- Web, backend, databases, cloud, DevOps
- AI/ML, system design, algorithms
- Debugging, code review, architecture, optimization
- Interview prep, career guidance, resumes, study plans
- Generating quizzes, flashcards, notes, and project ideas

Style:
- Be clear, practical, and senior-engineer calm.
- Use markdown (headings, lists, tables, fenced code with language tags).
- When reviewing code, cite issues and suggest concrete fixes.
- Ask a brief clarifying question only when required.
- Never invent APIs or library behavior; say when you are unsure.
- For simple greetings (hi/hello/hey), reply in at most two short lines like: "Hi! 👋" then "How can I help you today?" Do not list capabilities unless the user asks what you can do.`;

  const parts = [base];

  if (learningContext) {
    const lines = [
      learningContext.moduleTitle && `Module: ${learningContext.moduleTitle}`,
      learningContext.topicTitle && `Topic: ${learningContext.topicTitle}`,
      learningContext.lessonTitle && `Lesson: ${learningContext.lessonTitle}`,
      learningContext.assignmentTitle &&
        `Assignment: ${learningContext.assignmentTitle}`,
      learningContext.projectTitle && `Project: ${learningContext.projectTitle}`,
      learningContext.progressSummary &&
        `Progress: ${learningContext.progressSummary}`,
    ].filter(Boolean);
    if (lines.length) {
      parts.push(
        `The student is currently in SupraBase with this context (use naturally when relevant; do not force it):\n- ${lines.join("\n- ")}`
      );
    }
  }

  if (systemExtra?.trim()) {
    parts.push(`Additional user preferences:\n${systemExtra.trim()}`);
  }

  return parts.join("\n\n");
}

/** Map provider/SDK errors into short student-friendly copy. */
export function friendlyLlmError(error: unknown): string {
  const raw =
    error instanceof Error
      ? `${error.message} ${error.name}`
      : String(error ?? "");
  const lower = raw.toLowerCase();

  if (
    lower.includes("api key") ||
    lower.includes("api_key") ||
    lower.includes("unauthorized") ||
    lower.includes("401") ||
    lower.includes("invalid x-goog-api-key") ||
    lower.includes("permission denied")
  ) {
    return "AI Mentor couldn’t authenticate. Check GOOGLE_GENERATIVE_AI_API_KEY in .env.local and restart the server.";
  }
  if (
    lower.includes("quota") ||
    lower.includes("resource_exhausted") ||
    lower.includes("429") ||
    lower.includes("rate limit") ||
    lower.includes("too many requests")
  ) {
    return "Gemini rate limit or quota hit. Wait a moment and try again.";
  }
  if (
    lower.includes("timeout") ||
    lower.includes("timed out") ||
    lower.includes("network") ||
    lower.includes("fetch failed") ||
    lower.includes("econnreset")
  ) {
    return "Network issue talking to Gemini. Check your connection and retry.";
  }
  if (lower.includes("abort") || lower.includes("cancelled")) {
    return "Stopped.";
  }
  if (lower.includes("missing google_generative_ai_api_key")) {
    return "Gemini API key is missing. Add GOOGLE_GENERATIVE_AI_API_KEY to .env.local and restart.";
  }

  // Keep message short if it looks technical
  const short = (error instanceof Error ? error.message : raw).trim();
  if (short.length > 180) {
    return "Something went wrong generating a reply. Please try again.";
  }
  return short || "Something went wrong generating a reply. Please try again.";
}
