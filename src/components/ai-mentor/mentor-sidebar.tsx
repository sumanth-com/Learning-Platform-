"use client";

import {
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Archive,
  Copy,
  Download,
  MessageSquare,
  MoreHorizontal,
  PanelLeftClose,
  PanelLeftOpen,
  Pencil,
  Pin,
  Plus,
  Search,
  Share2,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import type { AiConversationRow, AiMessageRow } from "@/types/database";
import { groupConversationsByRecency } from "@/features/ai-mentor/types";
import {
  archiveConversationAction,
  deleteConversationAction,
  duplicateConversationAction,
  listMessagesAction,
  pinConversationAction,
  renameConversationAction,
} from "@/features/ai-mentor/actions/mentor-actions";
import {
  DialogButton,
  MentorDialog,
} from "@/components/ai-mentor/mentor-dialog";
import { cn } from "@/lib/utils";

type MentorSidebarProps = {
  conversations: AiConversationRow[];
  activeId: string | null;
  search: string;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  onSearchChange: (value: string) => void;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  onRefresh: () => void;
  onLocalUpdate?: (next: AiConversationRow[]) => void;
};

type MenuAction =
  | "rename"
  | "pin"
  | "archive"
  | "delete"
  | "duplicate"
  | "export"
  | "share";

type DialogKind =
  | null
  | { type: "rename"; id: string }
  | { type: "delete"; id: string }
  | { type: "archive"; id: string }
  | { type: "duplicate"; id: string }
  | { type: "export"; id: string }
  | { type: "share" };

function formatUpdated(iso: string | null | undefined, fallback: string) {
  const raw = iso || fallback;
  try {
    const d = new Date(raw);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
  } catch {
    return "";
  }
}

function HighlightTitle({ title, query }: { title: string; query: string }) {
  const q = query.trim();
  if (!q) return <span className="truncate">{title}</span>;
  const idx = title.toLowerCase().indexOf(q.toLowerCase());
  if (idx < 0) return <span className="truncate">{title}</span>;
  return (
    <span className="truncate">
      {title.slice(0, idx)}
      <mark className="rounded-sm bg-amber-200/80 px-0.5 text-inherit dark:bg-amber-400/30">
        {title.slice(idx, idx + q.length)}
      </mark>
      {title.slice(idx + q.length)}
    </span>
  );
}

function ConversationMenu({
  open,
  onClose,
  onAction,
  pinned,
}: {
  open: boolean;
  onClose: () => void;
  onAction: (action: MenuAction) => void;
  pinned: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [focusIndex, setFocusIndex] = useState(0);
  const focusIndexRef = useRef(0);

  const items: {
    id: MenuAction;
    label: string;
    icon: ReactNode;
    danger?: boolean;
  }[] = useMemo(
    () => [
      {
        id: "rename",
        label: "Rename",
        icon: <Pencil className="h-3.5 w-3.5" />,
      },
      {
        id: "pin",
        label: pinned ? "Unpin" : "Pin",
        icon: <Pin className="h-3.5 w-3.5" />,
      },
      {
        id: "duplicate",
        label: "Duplicate",
        icon: <Copy className="h-3.5 w-3.5" />,
      },
      {
        id: "archive",
        label: "Archive",
        icon: <Archive className="h-3.5 w-3.5" />,
      },
      {
        id: "export",
        label: "Export",
        icon: <Download className="h-3.5 w-3.5" />,
      },
      { id: "share", label: "Share", icon: <Share2 className="h-3.5 w-3.5" /> },
      {
        id: "delete",
        label: "Delete",
        icon: <Trash2 className="h-3.5 w-3.5" />,
        danger: true,
      },
    ],
    [pinned]
  );

  useEffect(() => {
    focusIndexRef.current = focusIndex;
  }, [focusIndex]);

  useEffect(() => {
    if (!open) return;
    setFocusIndex(0);
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setFocusIndex((i) => (i + 1) % items.length);
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocusIndex((i) => (i - 1 + items.length) % items.length);
      }
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const item = items[focusIndexRef.current];
        if (item) {
          onAction(item.id);
          onClose();
        }
      }
      if (e.key === "Tab") onClose();
    };
    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, onAction, items]);

  useEffect(() => {
    if (!open) return;
    const buttons = ref.current?.querySelectorAll<HTMLButtonElement>(
      '[role="menuitem"]'
    );
    buttons?.[focusIndex]?.focus();
  }, [open, focusIndex]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          ref={ref}
          role="menu"
          aria-orientation="vertical"
          initial={{ opacity: 0, scale: 0.96, y: -6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -4 }}
          transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
          className="absolute right-1 top-[calc(100%-4px)] z-40 min-w-[176px] origin-top-right overflow-hidden rounded-xl border border-border/80 bg-card p-1 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.28),0_0_0_1px_rgba(0,0,0,0.04)]"
        >
          {items.map((item, i) => (
            <button
              key={item.id}
              type="button"
              role="menuitem"
              tabIndex={focusIndex === i ? 0 : -1}
              className={cn(
                "flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[13px] transition-colors duration-150",
                "focus-visible:outline-none focus-visible:bg-muted",
                item.danger
                  ? "text-rose-600 hover:bg-rose-500/10"
                  : "text-foreground hover:bg-muted",
                focusIndex === i && (item.danger ? "bg-rose-500/10" : "bg-muted")
              )}
              onMouseEnter={() => setFocusIndex(i)}
              onClick={() => {
                onAction(item.id);
                onClose();
              }}
            >
              <span className="text-muted-foreground">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

const ConversationRow = memo(function ConversationRow({
  conversation,
  active,
  search,
  onSelect,
  onAction,
}: {
  conversation: AiConversationRow;
  active: boolean;
  search: string;
  onSelect: (id: string) => void;
  onAction: (id: string, action: MenuAction) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const updated = formatUpdated(
    conversation.last_message_at,
    conversation.updated_at || conversation.created_at
  );

  return (
    <div className="group relative px-1">
      <div
        className={cn(
          "relative flex items-start gap-0.5 rounded-xl pl-2.5 pr-1 py-1.5",
          "transition-[background-color,box-shadow,transform] duration-200 ease-out",
          active
            ? "bg-muted shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
            : "hover:bg-muted/65 hover:shadow-[0_1px_3px_rgba(0,0,0,0.06)]",
          menuOpen && !active && "bg-muted/65 shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
        )}
      >
        {active ? (
          <span
            aria-hidden
            className="absolute left-0 top-2 bottom-2 w-[2.5px] rounded-full bg-foreground"
          />
        ) : null}

        <button
          type="button"
          onClick={() => onSelect(conversation.id)}
          aria-current={active ? "true" : undefined}
          className={cn(
            "min-w-0 flex-1 rounded-lg py-1 pl-1 pr-1 text-left",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          )}
        >
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                "min-w-0 flex-1 truncate text-[13px] leading-snug tracking-[-0.01em]",
                active ? "font-semibold text-foreground" : "font-medium text-foreground/90"
              )}
            >
              <HighlightTitle title={conversation.title} query={search} />
            </span>
            {conversation.pinned ? (
              <Pin className="h-3 w-3 shrink-0 text-muted-foreground" />
            ) : null}
          </div>
          <span className="mt-0.5 block text-[11px] text-muted-foreground">
            {updated}
          </span>
        </button>

        <button
          type="button"
          aria-label="Conversation menu"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          className={cn(
            "mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
            "text-muted-foreground transition-[opacity,background-color,color] duration-200",
            "hover:bg-background/90 hover:text-foreground",
            "focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
            menuOpen
              ? "bg-background/90 text-foreground opacity-100"
              : "opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
          )}
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen((v) => !v);
          }}
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      <ConversationMenu
        open={menuOpen}
        pinned={conversation.pinned}
        onClose={() => setMenuOpen(false)}
        onAction={(action) => onAction(conversation.id, action)}
      />
    </div>
  );
});

function Section(props: {
  title: string;
  items: AiConversationRow[];
  activeId: string | null;
  search: string;
  onSelect: (id: string) => void;
  onAction: (id: string, action: MenuAction) => void;
}) {
  if (props.items.length === 0) return null;
  return (
    <div className="space-y-0.5">
      <p className="px-3 pb-1.5 pt-3 text-[11px] font-medium tracking-[0.04em] text-muted-foreground/90">
        {props.title}
      </p>
      {props.items.map((c) => (
        <ConversationRow
          key={c.id}
          conversation={c}
          active={props.activeId === c.id}
          search={props.search}
          onSelect={props.onSelect}
          onAction={props.onAction}
        />
      ))}
    </div>
  );
}

function downloadBlob(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function messagesToMarkdown(title: string, messages: AiMessageRow[]) {
  const lines = [`# ${title}`, ""];
  for (const m of messages) {
    lines.push(`## ${m.role === "user" ? "You" : "AI Mentor"}`);
    lines.push("");
    lines.push(m.content);
    lines.push("");
  }
  return lines.join("\n");
}

export function MentorSidebar({
  conversations,
  activeId,
  search,
  collapsed = false,
  onCollapsedChange,
  onSearchChange,
  onSelect,
  onNewChat,
  onRefresh,
  onLocalUpdate,
}: MentorSidebarProps) {
  const [pending, startTransition] = useTransition();
  const [searchFocused, setSearchFocused] = useState(false);
  const [dialog, setDialog] = useState<DialogKind>(null);
  const [renameValue, setRenameValue] = useState("");
  const [renameError, setRenameError] = useState("");
  const [isDesktop, setIsDesktop] = useState(true);
  const grouped = useMemo(
    () => groupConversationsByRecency(conversations),
    [conversations]
  );
  const showCollapsed = collapsed && isDesktop;

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const apply = () => setIsDesktop(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const dialogConversation = useMemo(() => {
    if (!dialog || dialog.type === "share") return null;
    return conversations.find((c) => c.id === dialog.id) ?? null;
  }, [conversations, dialog]);

  const openRename = (id: string) => {
    const current = conversations.find((c) => c.id === id)?.title ?? "";
    setRenameValue(current);
    setRenameError("");
    setDialog({ type: "rename", id });
  };

  const confirmRename = () => {
    if (!dialog || dialog.type !== "rename") return;
    const title = renameValue.trim();
    if (!title) {
      setRenameError("Title cannot be empty.");
      return;
    }
    if (title.length > 100) {
      setRenameError("Title must be 100 characters or fewer.");
      return;
    }
    const id = dialog.id;
    setDialog(null);
    startTransition(async () => {
      onLocalUpdate?.(
        conversations.map((c) => (c.id === id ? { ...c, title } : c))
      );
      const result = await renameConversationAction({
        conversationId: id,
        title,
      });
      if (!result.success) {
        toast.error(result.error);
        onRefresh();
      }
    });
  };

  const runMenuAction = (id: string, action: MenuAction) => {
    if (action === "rename") {
      openRename(id);
      return;
    }
    if (action === "pin") {
      startTransition(async () => {
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
      });
      return;
    }
    if (action === "delete") {
      setDialog({ type: "delete", id });
      return;
    }
    if (action === "archive") {
      setDialog({ type: "archive", id });
      return;
    }
    if (action === "duplicate") {
      setDialog({ type: "duplicate", id });
      return;
    }
    if (action === "export") {
      setDialog({ type: "export", id });
      return;
    }
    if (action === "share") {
      setDialog({ type: "share" });
    }
  };

  const exportConversation = async (format: "markdown" | "json" | "pdf") => {
    if (!dialog || dialog.type !== "export") return;
    const id = dialog.id;
    const title =
      conversations.find((c) => c.id === id)?.title ?? "conversation";
    const result = await listMessagesAction(id);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    const messages = result.data?.messages ?? [];
    const safe = title.replace(/[^\w\-]+/g, "_").slice(0, 40) || "chat";

    if (format === "markdown") {
      downloadBlob(
        `${safe}.md`,
        messagesToMarkdown(title, messages),
        "text/markdown;charset=utf-8"
      );
      toast.success("Exported Markdown");
    } else if (format === "json") {
      downloadBlob(
        `${safe}.json`,
        JSON.stringify({ title, messages }, null, 2),
        "application/json"
      );
      toast.success("Exported JSON");
    } else {
      const html = `<!doctype html><html><head><title>${title}</title>
        <style>body{font-family:system-ui;padding:32px;max-width:720px;margin:auto;line-height:1.6}
        h1{font-size:20px} h2{font-size:14px;margin-top:24px;color:#555}
        pre{white-space:pre-wrap;font-family:inherit}</style></head><body>
        <h1>${title}</h1>
        ${messages
          .map(
            (m) =>
              `<h2>${m.role === "user" ? "You" : "AI Mentor"}</h2><pre>${m.content
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")}</pre>`
          )
          .join("")}
        <script>window.onload=()=>window.print()</script></body></html>`;
      const w = window.open("", "_blank");
      if (!w) {
        toast.error("Allow popups to export PDF");
        return;
      }
      w.document.write(html);
      w.document.close();
      toast.success("Use Print → Save as PDF");
    }
    setDialog(null);
  };

  return (
    <aside className="flex h-full min-h-0 w-full flex-col border-r border-border/70 bg-background">
      {showCollapsed ? (
        <div className="flex h-full flex-col items-center gap-2 px-2 py-3">
          <button
            type="button"
            aria-label="Expand sidebar"
            title="Expand sidebar"
            onClick={() => onCollapsedChange?.(false)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            <PanelLeftOpen className="h-4 w-4" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            aria-label="New chat"
            title="New chat"
            disabled={pending}
            onClick={onNewChat}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-foreground text-background shadow-sm transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:opacity-60"
          >
            <Plus className="h-4 w-4" />
          </button>
          <div className="mt-2 flex h-9 w-9 items-center justify-center rounded-lg bg-foreground/5 text-[10px] font-semibold text-foreground">
            AI
          </div>
          <div className="mt-auto pb-2 text-muted-foreground/50">
            <MessageSquare className="h-4 w-4" />
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-3 px-3 pb-3 pt-3">
            <div className="flex items-center gap-2 px-0.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-foreground/5 text-[11px] font-semibold tracking-tight text-foreground">
                AI
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-semibold leading-none tracking-tight text-foreground">
                  AI Mentor
                </p>
                <p className="mt-1 truncate text-[11px] text-muted-foreground">
                  Private chats
                </p>
              </div>
              <button
                type="button"
                aria-label="Collapse sidebar"
                title="Collapse sidebar"
                onClick={() => onCollapsedChange?.(true)}
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                <PanelLeftClose className="h-4 w-4" strokeWidth={1.75} />
              </button>
            </div>

            <motion.button
              type="button"
              onClick={onNewChat}
              disabled={pending}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.985 }}
              className={cn(
                "group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl",
                "bg-foreground px-3 py-2.5 text-sm font-medium text-background",
                "shadow-[0_1px_2px_rgba(0,0,0,0.08),0_8px_24px_-12px_rgba(0,0,0,0.35)]",
                "transition-[box-shadow,opacity] duration-200 hover:shadow-[0_2px_8px_rgba(0,0,0,0.12),0_12px_28px_-12px_rgba(0,0,0,0.4)]",
                "disabled:cursor-not-allowed disabled:opacity-60"
              )}
            >
              <Plus className="h-4 w-4 transition-transform duration-200 group-hover:rotate-90" />
              New chat
            </motion.button>

            <div
              className={cn(
                "relative rounded-xl border bg-muted/40 transition-[border-color,box-shadow,background-color] duration-200",
                searchFocused
                  ? "border-foreground/20 bg-background shadow-[0_0_0_3px_rgba(99,102,241,0.12)]"
                  : "border-transparent hover:border-border"
              )}
            >
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder="Search chats"
                aria-label="Search chats"
                className="h-10 w-full bg-transparent py-2 pl-9 pr-8 text-[13px] text-foreground outline-none placeholder:text-muted-foreground"
              />
              {search ? (
                <button
                  type="button"
                  aria-label="Clear search"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  onClick={() => onSearchChange("")}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              ) : null}
            </div>
          </div>

          <div className="mentor-scroll min-h-0 flex-1 overflow-y-auto px-1.5 pb-6">
            <Section
              title="Pinned"
              items={grouped.pinned}
              activeId={activeId}
              search={search}
              onSelect={onSelect}
              onAction={runMenuAction}
            />
            <Section
              title="Today"
              items={grouped.today}
              activeId={activeId}
              search={search}
              onSelect={onSelect}
              onAction={runMenuAction}
            />
            <Section
              title="Yesterday"
              items={grouped.yesterday}
              activeId={activeId}
              search={search}
              onSelect={onSelect}
              onAction={runMenuAction}
            />
            <Section
              title="Previous 7 days"
              items={grouped.lastWeek}
              activeId={activeId}
              search={search}
              onSelect={onSelect}
              onAction={runMenuAction}
            />
            <Section
              title="Older"
              items={grouped.older}
              activeId={activeId}
              search={search}
              onSelect={onSelect}
              onAction={runMenuAction}
            />
            {conversations.length === 0 ? (
              <p className="px-3 py-12 text-center text-[13px] text-muted-foreground">
                No conversations yet
              </p>
            ) : null}
          </div>
        </>
      )}

      <MentorDialog
        open={dialog?.type === "rename"}
        onClose={() => setDialog(null)}
        title="Rename conversation"
        description="Choose a clear title so you can find this chat later."
        footer={
          <>
            <DialogButton onClick={() => setDialog(null)}>Cancel</DialogButton>
            <DialogButton variant="primary" onClick={confirmRename}>
              Save
            </DialogButton>
          </>
        }
      >
        <input
          value={renameValue}
          data-dialog-autofocus
          onChange={(e) => {
            setRenameValue(e.target.value.slice(0, 100));
            setRenameError("");
          }}
          maxLength={100}
          className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-foreground/30 focus:ring-2 focus:ring-ring/40"
          onKeyDown={(e) => {
            if (e.key === "Enter") confirmRename();
          }}
        />
        <div className="mt-1.5 flex justify-between text-[11px] text-muted-foreground">
          <span className="text-rose-600">{renameError}</span>
          <span>{renameValue.trim().length}/100</span>
        </div>
      </MentorDialog>

      <MentorDialog
        open={dialog?.type === "delete"}
        onClose={() => setDialog(null)}
        title="Delete conversation?"
        description="This permanently deletes the conversation and all messages."
        footer={
          <>
            <DialogButton autoFocus onClick={() => setDialog(null)}>
              Cancel
            </DialogButton>
            <DialogButton
              variant="danger"
              onClick={() => {
                if (!dialog || dialog.type !== "delete") return;
                const id = dialog.id;
                setDialog(null);
                startTransition(async () => {
                  onLocalUpdate?.(conversations.filter((c) => c.id !== id));
                  const result = await deleteConversationAction(id);
                  if (!result.success) {
                    toast.error(result.error);
                    onRefresh();
                  } else toast.success("Deleted");
                });
              }}
            >
              Delete
            </DialogButton>
          </>
        }
      />

      <MentorDialog
        open={dialog?.type === "archive"}
        onClose={() => setDialog(null)}
        title="Archive conversation?"
        description={`“${dialogConversation?.title ?? "This chat"}” will be hidden from your sidebar.`}
        footer={
          <>
            <DialogButton onClick={() => setDialog(null)}>Cancel</DialogButton>
            <DialogButton
              variant="primary"
              onClick={() => {
                if (!dialog || dialog.type !== "archive") return;
                const id = dialog.id;
                setDialog(null);
                startTransition(async () => {
                  onLocalUpdate?.(conversations.filter((c) => c.id !== id));
                  const result = await archiveConversationAction(id);
                  if (!result.success) {
                    toast.error(result.error);
                    onRefresh();
                  } else toast.success("Archived");
                });
              }}
            >
              Archive
            </DialogButton>
          </>
        }
      />

      <MentorDialog
        open={dialog?.type === "duplicate"}
        onClose={() => setDialog(null)}
        title="Duplicate conversation?"
        description="Creates a copy with the same messages so you can branch the discussion."
        footer={
          <>
            <DialogButton onClick={() => setDialog(null)}>Cancel</DialogButton>
            <DialogButton
              variant="primary"
              onClick={() => {
                if (!dialog || dialog.type !== "duplicate") return;
                const id = dialog.id;
                setDialog(null);
                startTransition(async () => {
                  const result = await duplicateConversationAction(id);
                  if (!result.success) {
                    toast.error(result.error);
                    return;
                  }
                  const copy = result.data?.conversation;
                  if (copy) {
                    onLocalUpdate?.([copy, ...conversations]);
                    onSelect(copy.id);
                    toast.success("Duplicated");
                  } else onRefresh();
                });
              }}
            >
              Duplicate
            </DialogButton>
          </>
        }
      />

      <MentorDialog
        open={dialog?.type === "export"}
        onClose={() => setDialog(null)}
        title="Export conversation"
        description="Choose a format for download."
        size="md"
      >
        <div className="grid gap-2">
          {(
            [
              ["markdown", "Markdown (.md)"],
              ["pdf", "PDF (Print dialog)"],
              ["json", "JSON"],
            ] as const
          ).map(([format, label]) => (
            <button
              key={format}
              type="button"
              className="rounded-xl border border-border px-3 py-2.5 text-left text-[13px] transition hover:bg-muted"
              onClick={() => void exportConversation(format)}
            >
              {label}
            </button>
          ))}
        </div>
      </MentorDialog>

      <MentorDialog
        open={dialog?.type === "share"}
        onClose={() => setDialog(null)}
        title="Share"
        description="Coming soon — secure sharing links for mentors and teammates."
        footer={
          <DialogButton variant="primary" onClick={() => setDialog(null)}>
            Got it
          </DialogButton>
        }
      />
    </aside>
  );
}
