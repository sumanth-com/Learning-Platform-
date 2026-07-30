"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import type { AiConversationRow } from "@/types/database";
import type {
  LearningContext,
  MentorResponseMode,
} from "@/features/ai-mentor/types";
import {
  createConversationAction,
  listConversationsAction,
} from "@/features/ai-mentor/actions/mentor-actions";
import { useMentorChat } from "@/hooks/use-mentor-chat";
import { useProgressStore } from "@/store/use-progress-store";
import { MentorSidebar } from "@/components/ai-mentor/mentor-sidebar";
import { MentorChatPane } from "@/components/ai-mentor/mentor-chat-pane";
import { PortalChrome } from "@/components/portal/portal-chrome";
import { cn } from "@/lib/utils";

function useLearningContextFromStore(): LearningContext {
  const resume = useProgressStore((s) => s.resumePosition);
  return useMemo(() => {
    if (!resume) return {};
    return {
      moduleTitle: String(resume.module ?? ""),
      topicTitle: resume.topicTitle || resume.title || undefined,
      lessonTitle: resume.lessonTitle || undefined,
      progressSummary: resume.href
        ? `Continuing from ${resume.title}${resume.subtitle ? ` · ${resume.subtitle}` : ""}`
        : undefined,
    };
  }, [resume]);
}

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(t);
  }, [value, delayMs]);
  return debounced;
}

export function MentorWorkspace() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeId = searchParams.get("c");
  const bootAsk = searchParams.get("q");

  const [conversations, setConversations] = useState<AiConversationRow[]>([]);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 250);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [pending, startTransition] = useTransition();
  const learningContext = useLearningContextFromStore();
  const pendingPromptRef = useRef<string | null>(null);
  const pendingResponseModeRef = useRef<MentorResponseMode>("suggested");
  const bootAskHandled = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("SupraBase.ai-mentor.sidebar-collapsed");
      if (raw === "1") setSidebarCollapsed(true);
    } catch {
      /* ignore */
    }
  }, []);

  const setCollapsed = useCallback((next: boolean) => {
    setSidebarCollapsed(next);
    try {
      localStorage.setItem(
        "SupraBase.ai-mentor.sidebar-collapsed",
        next ? "1" : "0"
      );
    } catch {
      /* ignore */
    }
  }, []);

  const {
    messages,
    isLoading,
    isStreaming,
    error,
    send,
    editMessage,
    stop,
    regenerate,
    continueResponse,
  } = useMentorChat(activeId);

  const pendingAttachmentsRef = useRef<string[] | undefined>(undefined);

  const refreshConversations = useCallback(async (q?: string) => {
    const result = await listConversationsAction(q);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    setConversations(result.data?.conversations ?? []);
  }, []);

  useEffect(() => {
    void refreshConversations(debouncedSearch || undefined);
  }, [refreshConversations, debouncedSearch]);

  const selectConversation = useCallback(
    (id: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("c", id);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      setMobileSidebar(false);
    },
    [pathname, router, searchParams]
  );

  useEffect(() => {
    if (!bootAsk || bootAskHandled.current) return;
    bootAskHandled.current = true;
    pendingPromptRef.current = bootAsk;

    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    const next = params.toString();
    router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });

    if (!activeId) {
      startTransition(async () => {
        const result = await createConversationAction(learningContext);
        if (!result.success) {
          pendingPromptRef.current = null;
          toast.error(result.error);
          return;
        }
        const conversation = result.data?.conversation;
        if (!conversation) {
          pendingPromptRef.current = null;
          return;
        }
        setConversations((prev) => [conversation, ...prev]);
        selectConversation(conversation.id);
      });
    }
  }, [
    bootAsk,
    activeId,
    learningContext,
    pathname,
    router,
    searchParams,
    selectConversation,
  ]);

  const newChat = useCallback(() => {
    startTransition(async () => {
      const result = await createConversationAction(learningContext);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      const conversation = result.data?.conversation;
      if (!conversation) return;
      setConversations((prev) => [conversation, ...prev]);
      selectConversation(conversation.id);
    });
  }, [learningContext, selectConversation]);

  useEffect(() => {
    if (!activeId || !pendingPromptRef.current) return;
    const prompt = pendingPromptRef.current;
    const attachmentIds = pendingAttachmentsRef.current;
    const responseMode = pendingResponseModeRef.current;
    pendingPromptRef.current = null;
    pendingAttachmentsRef.current = undefined;
    pendingResponseModeRef.current = "suggested";
    void send(prompt, learningContext, attachmentIds, responseMode).then((meta) => {
      if (meta?.title) {
        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeId ? { ...c, title: meta.title! } : c
          )
        );
      } else {
        void refreshConversations(debouncedSearch || undefined);
      }
    });
  }, [
    activeId,
    debouncedSearch,
    learningContext,
    refreshConversations,
    send,
  ]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key.toLowerCase() === "n") {
        e.preventDefault();
        newChat();
      }
      if (e.key === "Escape" && isStreaming) {
        e.preventDefault();
        stop();
      }
      if (
        e.key === "/" &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        document
          .querySelector<HTMLInputElement>('input[aria-label="Search chats"]')
          ?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isStreaming, newChat, stop]);

  const activeTitle =
    conversations.find((c) => c.id === activeId)?.title ?? "AI Mentor";

  const ensureConversation = useCallback(async () => {
    if (activeId) return activeId;
    const result = await createConversationAction(learningContext);
    if (!result.success) {
      toast.error(result.error);
      return null;
    }
    const conversation = result.data?.conversation;
    if (!conversation) return null;
    setConversations((prev) => [conversation, ...prev]);
    selectConversation(conversation.id);
    return conversation.id;
  }, [activeId, learningContext, selectConversation]);

  const handleSend = (
    content: string,
    attachmentIds?: string[],
    responseMode: MentorResponseMode = "suggested"
  ) => {
    if (activeId) {
      void send(content, learningContext, attachmentIds, responseMode).then((meta) => {
        if (meta?.title) {
          setConversations((prev) =>
            prev.map((c) =>
              c.id === activeId ? { ...c, title: meta.title! } : c
            )
          );
        } else {
          void refreshConversations(debouncedSearch || undefined);
        }
      });
      return;
    }

    pendingPromptRef.current = content;
    pendingAttachmentsRef.current = attachmentIds;
    pendingResponseModeRef.current = responseMode;
    startTransition(async () => {
      const result = await createConversationAction(learningContext);
      if (!result.success) {
        pendingPromptRef.current = null;
        pendingAttachmentsRef.current = undefined;
        pendingResponseModeRef.current = "suggested";
        toast.error(result.error);
        return;
      }
      const conversation = result.data?.conversation;
      if (!conversation) {
        pendingPromptRef.current = null;
        pendingAttachmentsRef.current = undefined;
        pendingResponseModeRef.current = "suggested";
        return;
      }
      setConversations((prev) => [conversation, ...prev]);
      selectConversation(conversation.id);
    });
  };

  return (
    <>
      <PortalChrome title="AI Mentor" fillViewport />
      <div
        data-ai-mentor
        className="relative flex h-full min-h-0 overflow-hidden bg-background"
      >
        <button
          type="button"
          className="absolute left-3 top-3 z-20 rounded-xl border border-border/80 bg-background/95 px-2.5 py-1.5 text-xs font-medium shadow-sm backdrop-blur lg:hidden"
          onClick={() => setMobileSidebar((v) => !v)}
          aria-label="Open chats"
        >
          Chats
        </button>

        {mobileSidebar ? (
          <button
            type="button"
            aria-label="Close chats"
            className="absolute inset-0 z-20 bg-black/40 lg:hidden"
            onClick={() => setMobileSidebar(false)}
          />
        ) : null}

        <div
          className={cn(
            "h-full shrink-0 overflow-hidden bg-background",
            "transition-[width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
            sidebarCollapsed ? "lg:w-[68px]" : "lg:w-[272px] xl:w-[292px]",
            "max-lg:absolute max-lg:inset-y-0 max-lg:left-0 max-lg:z-30 max-lg:w-[min(86vw,300px)] max-lg:shadow-2xl",
            mobileSidebar ? "max-lg:block" : "max-lg:hidden",
            "lg:block"
          )}
        >
          <MentorSidebar
            conversations={conversations}
            activeId={activeId}
            search={search}
            collapsed={sidebarCollapsed}
            onCollapsedChange={setCollapsed}
            onSearchChange={setSearch}
            onSelect={selectConversation}
            onNewChat={newChat}
            onLocalUpdate={(next) => setConversations(next)}
            onRefresh={() => {
              void refreshConversations(debouncedSearch || undefined);
            }}
          />
        </div>

        <div className="min-w-0 flex-1">
          <MentorChatPane
            title={activeTitle}
            conversationId={activeId}
            messages={activeId ? messages : []}
            isLoading={Boolean(activeId) && isLoading}
            isStreaming={isStreaming || pending}
            error={error}
            onSend={handleSend}
            onEditMessage={(messageId, content) => {
              void editMessage(messageId, content, learningContext);
            }}
            onStop={stop}
            onRegenerate={(id) => {
              void regenerate(id, learningContext);
            }}
            onContinue={() => {
              void continueResponse(learningContext);
            }}
            onEnsureConversation={ensureConversation}
          />
        </div>
      </div>
    </>
  );
}
