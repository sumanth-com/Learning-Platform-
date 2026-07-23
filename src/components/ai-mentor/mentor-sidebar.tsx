"use client";

import { useMemo, useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Archive,
  MoreHorizontal,
  Pin,
  Plus,
  Search,
  Star,
  Trash2,
  Pencil,
} from "lucide-react";
import { toast } from "sonner";
import type { AiConversationRow } from "@/types/database";
import { groupConversationsByRecency } from "@/features/ai-mentor/types";
import {
  archiveConversationAction,
  deleteConversationAction,
  favoriteConversationAction,
  pinConversationAction,
  renameConversationAction,
} from "@/features/ai-mentor/actions/mentor-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type MentorSidebarProps = {
  conversations: AiConversationRow[];
  activeId: string | null;
  search: string;
  onSearchChange: (value: string) => void;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  onRefresh: () => void;
  onLocalUpdate?: (next: AiConversationRow[]) => void;
};

function Section({
  title,
  items,
  activeId,
  onSelect,
  onAction,
}: {
  title: string;
  items: AiConversationRow[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onAction: (
    id: string,
    action: "rename" | "pin" | "favorite" | "archive" | "delete"
  ) => void;
}) {
  if (items.length === 0) return null;
  return (
    <div className="space-y-1">
      <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </p>
      <AnimatePresence initial={false}>
        {items.map((c) => (
          <motion.div
            key={c.id}
            layout
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="group relative"
          >
            <button
              type="button"
              onClick={() => onSelect(c.id)}
              className={cn(
                "flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left text-sm transition",
                activeId === c.id
                  ? "bg-foreground text-background"
                  : "text-foreground hover:bg-muted"
              )}
            >
              <span className="min-w-0 flex-1 truncate font-medium">
                {c.title}
              </span>
              {(c.pinned || c.favorited) && (
                <Pin className="h-3 w-3 shrink-0 opacity-70" />
              )}
            </button>
            <div className="absolute right-1 top-1/2 hidden -translate-y-1/2 items-center gap-0.5 rounded-lg border border-border bg-card p-0.5 shadow-sm group-hover:flex">
              <button
                type="button"
                title="Rename"
                className="rounded p-1 hover:bg-muted"
                onClick={() => onAction(c.id, "rename")}
              >
                <Pencil className="h-3 w-3" />
              </button>
              <button
                type="button"
                title="Pin"
                className="rounded p-1 hover:bg-muted"
                onClick={() => onAction(c.id, "pin")}
              >
                <Pin className="h-3 w-3" />
              </button>
              <button
                type="button"
                title="Favorite"
                className="rounded p-1 hover:bg-muted"
                onClick={() => onAction(c.id, "favorite")}
              >
                <Star className="h-3 w-3" />
              </button>
              <button
                type="button"
                title="Archive"
                className="rounded p-1 hover:bg-muted"
                onClick={() => onAction(c.id, "archive")}
              >
                <Archive className="h-3 w-3" />
              </button>
              <button
                type="button"
                title="Delete"
                className="rounded p-1 text-rose-600 hover:bg-rose-500/10"
                onClick={() => onAction(c.id, "delete")}
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export function MentorSidebar({
  conversations,
  activeId,
  search,
  onSearchChange,
  onSelect,
  onNewChat,
  onRefresh,
  onLocalUpdate,
}: MentorSidebarProps) {
  const [pending, startTransition] = useTransition();
  const grouped = useMemo(
    () => groupConversationsByRecency(conversations),
    [conversations]
  );

  const runAction = (
    id: string,
    action: "rename" | "pin" | "favorite" | "archive" | "delete"
  ) => {
    startTransition(async () => {
      if (action === "rename") {
        const current = conversations.find((c) => c.id === id)?.title ?? "";
        const next = window.prompt("Rename conversation", current);
        if (!next?.trim()) return;
        const optimistic = conversations.map((c) =>
          c.id === id ? { ...c, title: next.trim() } : c
        );
        onLocalUpdate?.(optimistic);
        const result = await renameConversationAction({
          conversationId: id,
          title: next.trim(),
        });
        if (!result.success) {
          toast.error(result.error);
          onRefresh();
        } else if (result.data?.conversation) {
          onLocalUpdate?.(
            conversations.map((c) =>
              c.id === id ? result.data!.conversation : c
            )
          );
        }
        return;
      }
      if (action === "pin") {
        const current = conversations.find((c) => c.id === id);
        const pinned = !current?.pinned;
        onLocalUpdate?.(
          conversations.map((c) =>
            c.id === id ? { ...c, pinned, favorited: pinned } : c
          )
        );
        const result = await pinConversationAction(id, pinned);
        if (!result.success) {
          toast.error(result.error);
          onRefresh();
        }
        return;
      }
      if (action === "favorite") {
        const current = conversations.find((c) => c.id === id);
        const favorited = !current?.favorited;
        onLocalUpdate?.(
          conversations.map((c) =>
            c.id === id ? { ...c, favorited } : c
          )
        );
        const result = await favoriteConversationAction(id, favorited);
        if (!result.success) {
          toast.error(result.error);
          onRefresh();
        }
        return;
      }
      if (action === "archive") {
        onLocalUpdate?.(conversations.filter((c) => c.id !== id));
        const result = await archiveConversationAction(id);
        if (!result.success) {
          toast.error(result.error);
          onRefresh();
        } else {
          toast.success("Archived");
        }
        return;
      }
      if (action === "delete") {
        if (!window.confirm("Delete this conversation permanently?")) return;
        onLocalUpdate?.(conversations.filter((c) => c.id !== id));
        const result = await deleteConversationAction(id);
        if (!result.success) {
          toast.error(result.error);
          onRefresh();
        } else {
          toast.success("Deleted");
        }
      }
    });
  };

  return (
    <aside className="flex h-full min-h-0 w-full flex-col border-r border-border bg-card/40">
      <div className="space-y-3 border-b border-border p-3">
        <Button
          type="button"
          className="w-full justify-start gap-2"
          onClick={onNewChat}
          disabled={pending}
        >
          <Plus className="h-4 w-4" />
          New chat
        </Button>
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search chats"
            className="h-9 pl-8"
            aria-label="Search chats"
          />
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-2 pb-6">
        <Section
          title="Pinned"
          items={grouped.pinned}
          activeId={activeId}
          onSelect={onSelect}
          onAction={runAction}
        />
        <Section
          title="Today"
          items={grouped.today}
          activeId={activeId}
          onSelect={onSelect}
          onAction={runAction}
        />
        <Section
          title="Yesterday"
          items={grouped.yesterday}
          activeId={activeId}
          onSelect={onSelect}
          onAction={runAction}
        />
        <Section
          title="Last 7 days"
          items={grouped.lastWeek}
          activeId={activeId}
          onSelect={onSelect}
          onAction={runAction}
        />
        <Section
          title="Older"
          items={grouped.older}
          activeId={activeId}
          onSelect={onSelect}
          onAction={runAction}
        />
        {conversations.length === 0 ? (
          <p className="px-2 py-8 text-center text-xs text-muted-foreground">
            No conversations yet. Start a new chat.
          </p>
        ) : null}
      </div>

      <div className="border-t border-border p-3 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <MoreHorizontal className="h-3 w-3" />
          Unlimited personal chats · private to you
        </span>
      </div>
    </aside>
  );
}
