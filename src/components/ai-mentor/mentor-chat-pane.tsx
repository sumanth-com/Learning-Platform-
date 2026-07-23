"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowUp,
  Bookmark,
  Loader2,
  RefreshCw,
  Square,
  CornerDownLeft,
} from "lucide-react";
import type { AiMessageRow } from "@/types/database";
import { MentorMarkdown } from "@/components/ai-mentor/mentor-markdown";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { bookmarkMessageAction } from "@/features/ai-mentor/actions/mentor-actions";
import { toast } from "sonner";

type MentorChatPaneProps = {
  title: string;
  conversationId: string | null;
  messages: AiMessageRow[];
  isLoading: boolean;
  isStreaming: boolean;
  error: string | null;
  onSend: (content: string) => void;
  onStop: () => void;
  onRegenerate: (messageId?: string) => void;
  onContinue: () => void;
};

function formatTime(iso: string) {
  try {
    return new Date(iso).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export function MentorChatPane({
  title,
  conversationId,
  messages,
  isLoading,
  isStreaming,
  error,
  onSend,
  onStop,
  onRegenerate,
  onContinue,
}: MentorChatPaneProps) {
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isStreaming]);

  const submit = () => {
    const value = draft.trim();
    if (!value || isStreaming) return;
    setDraft("");
    onSend(value);
    textareaRef.current?.focus();
  };

  const lastAssistant = [...messages]
    .reverse()
    .find((m) => m.role === "assistant");

  return (
    <div className="flex h-full min-h-0 min-w-0 flex-col bg-background">
      <header className="flex h-14 shrink-0 items-center border-b border-border px-4">
        <h1 className="truncate text-sm font-semibold text-foreground">
          {title || "AI Mentor"}
        </h1>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-8">
        {isLoading ? (
          <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading conversation…
          </div>
        ) : messages.length === 0 ? (
          <div className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-4 py-20 text-center">
            <p className="text-2xl font-semibold tracking-tight text-foreground">
              What are you building today?
            </p>
            <p className="max-w-lg text-sm text-muted-foreground">
              Ask anything about software engineering — code, architecture,
              debugging, interviews, career, cloud, AI, and more.
            </p>
            <div className="mt-2 grid w-full gap-2 sm:grid-cols-2">
              {[
                "Explain React Server Components simply",
                "Review this SQL schema for N+1 risks",
                "Generate system design interview questions",
                "Help me debug a Next.js hydration error",
              ].map((hint) => (
                <button
                  key={hint}
                  type="button"
                  onClick={() => onSend(hint)}
                  className="rounded-xl border border-border bg-card px-3 py-3 text-left text-sm text-foreground transition hover:border-foreground/30"
                >
                  {hint}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "group",
                  message.role === "user" ? "flex justify-end" : "block"
                )}
              >
                <div
                  className={cn(
                    "max-w-[min(100%,42rem)] rounded-2xl px-4 py-3",
                    message.role === "user"
                      ? "bg-foreground text-background"
                      : "border border-border bg-card text-foreground"
                  )}
                >
                  {message.role === "assistant" ? (
                    message.content ? (
                      <MentorMarkdown content={message.content} />
                    ) : (
                      <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-foreground/70" />
                        Thinking…
                      </span>
                    )
                  ) : (
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">
                      {message.content}
                    </p>
                  )}
                  <div
                    className={cn(
                      "mt-2 flex items-center gap-2 text-[10px]",
                      message.role === "user"
                        ? "text-background/70"
                        : "text-muted-foreground"
                    )}
                  >
                    <span>{formatTime(message.created_at)}</span>
                    {message.status === "streaming" ? (
                      <span>streaming</span>
                    ) : null}
                    {message.status === "error" ? (
                      <span className="text-rose-500">{message.error}</span>
                    ) : null}
                  </div>
                </div>

                {message.role === "assistant" &&
                message.status === "complete" ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {message.id === lastAssistant?.id ? (
                      <>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          className="h-8 gap-1.5 text-xs"
                          onClick={() => onRegenerate(message.id)}
                          disabled={isStreaming}
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                          Regenerate
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          className="h-8 gap-1.5 text-xs"
                          onClick={onContinue}
                          disabled={isStreaming}
                        >
                          <CornerDownLeft className="h-3.5 w-3.5" />
                          Continue
                        </Button>
                      </>
                    ) : null}
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="h-8 gap-1.5 text-xs"
                      disabled={!conversationId || message.id.startsWith("temp-")}
                      onClick={async () => {
                        if (!conversationId) return;
                        const result = await bookmarkMessageAction({
                          conversationId,
                          messageId: message.id,
                          snippet: message.content,
                        });
                        if (!result.success) toast.error(result.error);
                        else toast.success("Bookmarked");
                      }}
                    >
                      <Bookmark className="h-3.5 w-3.5" />
                      Bookmark
                    </Button>
                  </div>
                ) : null}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-border bg-background/95 px-4 py-3 backdrop-blur sm:px-8">
        {error ? (
          <p className="mb-2 text-center text-xs text-rose-600">{error}</p>
        ) : null}
        <div className="mx-auto flex max-w-3xl items-end gap-2 rounded-2xl border border-border bg-card p-2 shadow-sm">
          <textarea
            ref={textareaRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={1}
            placeholder="Message AI Mentor…"
            className="max-h-40 min-h-[44px] flex-1 resize-none bg-transparent px-2 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
          />
          {isStreaming ? (
            <Button
              type="button"
              size="icon"
              variant="secondary"
              className="h-10 w-10 shrink-0 rounded-xl"
              onClick={onStop}
              title="Stop generating"
            >
              <Square className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="button"
              size="icon"
              className="h-10 w-10 shrink-0 rounded-xl"
              onClick={submit}
              disabled={!draft.trim()}
              title="Send"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          )}
        </div>
        <p className="mt-2 text-center text-[10px] text-muted-foreground">
          Enter to send · Shift+Enter for newline · Esc to stop
        </p>
      </div>
    </div>
  );
}
