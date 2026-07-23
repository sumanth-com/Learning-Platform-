"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { AiMessageRow } from "@/types/database";
import type { LearningContext } from "@/features/ai-mentor/types";
import { AI_MENTOR_ROUTES } from "@/features/ai-mentor/types";
import { listMessagesAction } from "@/features/ai-mentor/actions/mentor-actions";
import { friendlyLlmError } from "@/features/ai-mentor/providers/types";

type StreamMode = "send" | "regenerate" | "continue";

type StreamMeta = {
  title?: string;
};

export function useMentorChat(conversationId: string | null) {
  const [messages, setMessages] = useState<AiMessageRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const requestSeq = useRef(0);

  const loadMessages = useCallback(async (id: string) => {
    const seq = ++requestSeq.current;
    setIsLoading(true);
    setError(null);
    const result = await listMessagesAction(id);
    if (seq !== requestSeq.current) return;
    setIsLoading(false);
    if (!result.success) {
      setError(result.error);
      setMessages([]);
      return;
    }
    setMessages(result.data?.messages ?? []);
  }, []);

  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      return;
    }
    void loadMessages(conversationId);
  }, [conversationId, loadMessages]);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsStreaming(false);
  }, []);

  const runStream = useCallback(
    async (
      mode: StreamMode,
      content: string,
      learningContext?: LearningContext | null,
      messageId?: string
    ): Promise<StreamMeta | null> => {
      if (!conversationId) return null;
      setError(null);
      setIsStreaming(true);
      const controller = new AbortController();
      abortRef.current = controller;

      let assistantId: string | null = null;
      let meta: StreamMeta | null = null;

      // Optimistic user bubble before network round-trip
      if (mode === "send" || mode === "continue") {
        const optimisticContent =
          mode === "continue"
            ? "Please continue from where you left off."
            : content;
        setMessages((prev) => [
          ...prev,
          {
            id: `temp-user-${Date.now()}`,
            conversation_id: conversationId,
            profile_id: "",
            role: "user",
            content: optimisticContent,
            status: "complete",
            model: null,
            error: null,
            token_input: null,
            token_output: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);
      }

      if (mode === "regenerate" && messageId) {
        setMessages((prev) => prev.filter((m) => m.id !== messageId));
      }

      try {
        const res = await fetch(AI_MENTOR_ROUTES.chatApi, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            conversationId,
            content,
            learningContext: learningContext ?? undefined,
            mode,
            messageId,
          }),
          signal: controller.signal,
        });

        if (!res.ok || !res.body) {
          const payload = await res.json().catch(() => null);
          throw new Error(
            payload?.error ?? `Request failed (${res.status})`
          );
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split("\n\n");
          buffer = parts.pop() ?? "";

          for (const part of parts) {
            const lines = part.split("\n");
            let event = "message";
            let dataLine = "";
            for (const line of lines) {
              if (line.startsWith("event:")) event = line.slice(6).trim();
              if (line.startsWith("data:")) dataLine += line.slice(5).trim();
            }
            if (!dataLine) continue;

            let data: Record<string, unknown>;
            try {
              data = JSON.parse(dataLine) as Record<string, unknown>;
            } catch {
              continue;
            }

            if (event === "meta") {
              assistantId = String(data.assistantMessageId ?? "");
              const id = assistantId;
              if (!id) continue;
              setMessages((prev) => [
                ...prev.filter((m) => m.id !== id && !m.id.startsWith("temp-assistant")),
                {
                  id,
                  conversation_id: conversationId,
                  profile_id: "",
                  role: "assistant",
                  content: "",
                  status: "streaming",
                  model: (data.model as string) ?? null,
                  error: null,
                  token_input: null,
                  token_output: null,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                },
              ]);
            }

            if (event === "token" && assistantId) {
              const text = String(data.text ?? "");
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId
                    ? { ...m, content: m.content + text, status: "streaming" }
                    : m
                )
              );
            }

            if (event === "done" && assistantId) {
              const finalContent = String(data.content ?? "");
              if (typeof data.title === "string" && data.title.trim()) {
                meta = { title: data.title.trim() };
              }
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId
                    ? { ...m, content: finalContent, status: "complete" }
                    : m
                )
              );
            }

            if (event === "error" || event === "cancelled") {
              const finalContent = String(data.content ?? "");
              const msg = String(data.message ?? "Error");
              if (assistantId) {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId
                      ? {
                          ...m,
                          content: finalContent,
                          status:
                            event === "cancelled" ? "cancelled" : "error",
                          error: msg,
                        }
                      : m
                  )
                );
              }
              if (event === "error") setError(msg);
            }
          }
        }

        // Sync from server once (replaces temp ids) without blocking UI feel
        void loadMessages(conversationId);
        return meta;
      } catch (err) {
        if ((err as Error).name === "AbortError") {
          setMessages((prev) =>
            prev.map((m) =>
              m.status === "streaming"
                ? { ...m, status: "cancelled" as const }
                : m
            )
          );
          return null;
        }
        const message = friendlyLlmError(err);
        setError(message);
        return null;
      } finally {
        setIsStreaming(false);
        abortRef.current = null;
      }
    },
    [conversationId, loadMessages]
  );

  const send = useCallback(
    (content: string, learningContext?: LearningContext | null) =>
      runStream("send", content, learningContext),
    [runStream]
  );

  const regenerate = useCallback(
    (messageId?: string, learningContext?: LearningContext | null) =>
      runStream("regenerate", "regenerate", learningContext, messageId),
    [runStream]
  );

  const continueResponse = useCallback(
    (learningContext?: LearningContext | null) =>
      runStream("continue", "continue", learningContext),
    [runStream]
  );

  return {
    messages,
    setMessages,
    isLoading,
    isStreaming,
    error,
    setError,
    send,
    stop,
    regenerate,
    continueResponse,
    reload: () =>
      conversationId ? loadMessages(conversationId) : Promise.resolve(),
  };
}
