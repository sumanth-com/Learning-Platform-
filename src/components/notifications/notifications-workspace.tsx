"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Award,
  Bell,
  BellOff,
  BookOpen,
  Bot,
  CheckCheck,
  Inbox,
  MailOpen,
  Search,
  Trash2,
} from "lucide-react";
import {
  clearAllNotifications,
  clearReadNotifications,
  deleteNotification,
  formatNotificationDate,
  formatNotificationTime,
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  notificationChannelLabel,
  notificationSender,
  syncCertificateNotifications,
  type AppNotification,
} from "@/lib/notifications";
import { readUserSettings } from "@/lib/user-settings";
import { cn } from "@/lib/utils";
import { PORTAL_ROUTES, type PortalUser } from "@/features/portal/types";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { NotificationMessage } from "@/components/notifications/notification-message";

type ConfirmKind =
  | { type: "delete"; id: string; title: string }
  | { type: "clear-read" }
  | { type: "clear-all" };

type Filter = "all" | "unread";

function ChannelIcon({ channel }: { channel: AppNotification["channel"] }) {
  if (channel === "learning") return <BookOpen className="h-4 w-4" />;
  if (channel === "mentor") return <Bot className="h-4 w-4" />;
  return <Award className="h-4 w-4" />;
}

function EmptyPanel({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 py-12 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-muted/50 text-muted-foreground">
        {icon}
      </span>
      <h2 className="mt-4 text-[15px] font-semibold text-foreground">{title}</h2>
      <p className="mx-auto mt-1.5 max-w-sm text-[13px] leading-relaxed text-muted-foreground">
        {description}
      </p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function NotificationsWorkspace({ user }: { user: PortalUser }) {
  const [items, setItems] = useState<AppNotification[]>([]);
  const [muted, setMuted] = useState(false);
  const [confirm, setConfirm] = useState<ConfirmKind | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const refresh = useCallback(() => {
    syncCertificateNotifications();
    setMuted(readUserSettings().notificationsMuted);
    setItems(listNotifications());
  }, []);

  useEffect(() => {
    refresh();
    const onChange = () => refresh();
    window.addEventListener("suprabase:notifications-changed", onChange);
    window.addEventListener("suprabase:settings-changed", onChange);
    return () => {
      window.removeEventListener("suprabase:notifications-changed", onChange);
      window.removeEventListener("suprabase:settings-changed", onChange);
    };
  }, [refresh]);

  const unreadCount = items.filter((n) => !n.read).length;
  const readCount = items.length - unreadCount;

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items
      .filter((n) => (filter === "unread" ? !n.read : true))
      .filter((n) =>
        q
          ? `${n.title} ${n.body} ${notificationChannelLabel(n.channel)}`
              .toLowerCase()
              .includes(q)
          : true
      );
  }, [items, filter, query]);

  // Keep the open message readable even after it drops out of the current
  // filter (e.g. it just got marked read while "Unread" is active).
  useEffect(() => {
    setSelectedId((current) =>
      current && items.some((n) => n.id === current) ? current : null
    );
  }, [items]);

  const selected = items.find((n) => n.id === selectedId) ?? null;

  const openMessage = (item: AppNotification) => {
    setSelectedId(item.id);
    if (!item.read) {
      markNotificationRead(item.id);
      refresh();
    }
  };

  const handleConfirm = () => {
    if (!confirm) return;
    if (confirm.type === "delete") {
      deleteNotification(confirm.id);
      if (selectedId === confirm.id) setSelectedId(null);
    }
    if (confirm.type === "clear-read") clearReadNotifications();
    if (confirm.type === "clear-all") {
      clearAllNotifications();
      setSelectedId(null);
    }
    setConfirm(null);
    refresh();
  };

  const confirmCopy =
    confirm?.type === "delete"
      ? {
          title: "Delete message?",
          description: `“${confirm.title}” will be removed from your inbox. This can’t be undone.`,
          confirmLabel: "Delete",
          variant: "danger" as const,
        }
      : confirm?.type === "clear-read"
        ? {
            title: "Clear read messages?",
            description: `${readCount} read ${readCount === 1 ? "message" : "messages"} will be removed. Unread items stay.`,
            confirmLabel: "Clear read",
            variant: "warning" as const,
          }
        : confirm?.type === "clear-all"
          ? {
              title: "Clear the whole inbox?",
              description:
                "Every message will be removed. New updates can still arrive later.",
              confirmLabel: "Clear all",
              variant: "danger" as const,
            }
          : null;

  if (muted) {
    return (
      <div className="flex h-full min-h-0 flex-1 items-center justify-center bg-background px-6">
        <div className="w-full max-w-md text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-muted/50 text-muted-foreground">
            <BellOff className="h-5 w-5" />
          </span>
          <h2 className="mt-4 text-[16px] font-semibold text-foreground">
            Notifications are muted
          </h2>
          <p className="mx-auto mt-1.5 max-w-md text-[13px] text-muted-foreground">
            Unmute in Settings to see certification and other updates again.
          </p>
          <Link
            href={PORTAL_ROUTES.settings}
            className="mt-5 inline-flex text-[13px] font-medium text-foreground underline-offset-4 hover:underline"
          >
            Open notification settings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-background">
      <div className="flex min-h-0 flex-1 overflow-hidden border-t border-border/70 bg-card">
        {/* ── Message list ─────────────────────────────── */}
        <aside
          className={cn(
            "flex min-w-0 flex-col border-border/70 bg-card lg:w-[360px] lg:shrink-0 lg:border-r xl:w-[400px]",
            selected ? "hidden lg:flex" : "flex w-full"
          )}
        >
          <div className="space-y-3 border-b border-border/70 px-4 py-3.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Inbox className="h-4 w-4 text-muted-foreground" />
                <p className="text-[14px] font-semibold text-foreground">
                  Inbox
                </p>
                {unreadCount > 0 ? (
                  <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-semibold text-primary">
                    {unreadCount}
                  </span>
                ) : null}
              </div>
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-muted-foreground hover:text-foreground"
                  title="Mark all as read"
                  disabled={unreadCount === 0}
                  onClick={() => {
                    markAllNotificationsRead();
                    refresh();
                  }}
                >
                  <CheckCheck className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-muted-foreground hover:text-destructive"
                  title="Clear read messages"
                  disabled={readCount === 0}
                  onClick={() => setConfirm({ type: "clear-read" })}
                >
                  <MailOpen className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-muted-foreground hover:text-destructive"
                  title="Clear all messages"
                  disabled={items.length === 0}
                  onClick={() => setConfirm({ type: "clear-all" })}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-2.5 py-1.5">
              <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search messages"
                className="min-w-0 flex-1 bg-transparent text-[13px] text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>

            <div className="flex gap-1.5">
              {(["all", "unread"] as Filter[]).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={cn(
                    "rounded-md px-2.5 py-1 text-[12px] font-medium capitalize transition",
                    filter === f
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {f}
                  {f === "unread" && unreadCount > 0 ? ` (${unreadCount})` : ""}
                </button>
              ))}
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            {visible.length === 0 ? (
              <EmptyPanel
                icon={<Bell className="h-5 w-5" />}
                title={
                  items.length === 0 ? "You’re all caught up" : "No matches"
                }
                description={
                  items.length === 0
                    ? "Messages arrive here when you pass a certification or earn a certificate."
                    : "Try a different search term or switch back to all messages."
                }
                action={
                  items.length === 0 ? (
                    <Link
                      href={PORTAL_ROUTES.certifications}
                      className="text-[13px] font-medium text-foreground underline-offset-4 hover:underline"
                    >
                      Browse certifications →
                    </Link>
                  ) : null
                }
              />
            ) : (
              <ul>
                {visible.map((item) => {
                  const sender = notificationSender(item.channel);
                  const active = item.id === selectedId;
                  return (
                    <li key={item.id} className="border-b border-border/60">
                      <button
                        type="button"
                        onClick={() => openMessage(item)}
                        className={cn(
                          "group flex w-full gap-3 px-4 py-3 text-left transition",
                          active
                            ? "bg-primary/[0.09]"
                            : "hover:bg-muted/40",
                          !item.read && !active && "bg-primary/[0.035]"
                        )}
                      >
                        <span
                          className={cn(
                            "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border",
                            !item.read
                              ? "border-primary/30 bg-primary/12 text-primary"
                              : "border-border bg-muted/40 text-muted-foreground"
                          )}
                        >
                          <ChannelIcon channel={item.channel} />
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-2">
                            <span
                              className={cn(
                                "min-w-0 flex-1 truncate text-[13px]",
                                item.read
                                  ? "text-muted-foreground"
                                  : "font-semibold text-foreground"
                              )}
                            >
                              {sender.name}
                            </span>
                            <span className="shrink-0 text-[11px] text-muted-foreground">
                              {formatNotificationTime(item.createdAt)}
                            </span>
                          </span>

                          <span
                            className={cn(
                              "mt-0.5 block truncate text-[13.5px]",
                              item.read
                                ? "text-foreground/85"
                                : "font-semibold text-foreground"
                            )}
                          >
                            {item.title}
                          </span>

                          <span className="mt-0.5 flex items-center gap-2">
                            <span className="min-w-0 flex-1 truncate text-[12px] text-muted-foreground">
                              {item.body}
                            </span>
                            {!item.read ? (
                              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                            ) : null}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </aside>

        {/* ── Reading pane ─────────────────────────────── */}
        <section
          className={cn(
            "min-w-0 flex-1 flex-col bg-muted/15",
            selected ? "flex" : "hidden lg:flex"
          )}
        >
          {selected ? (
            <>
              <header className="flex items-start gap-3 border-b border-border/70 bg-card px-4 py-3.5 sm:px-6">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 shrink-0 px-2 text-muted-foreground hover:text-foreground lg:hidden"
                  onClick={() => setSelectedId(null)}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>

                <div className="min-w-0 flex-1">
                  <h1 className="truncate text-[15px] font-semibold text-foreground sm:text-[16px]">
                    {selected.title}
                  </h1>
                  <p className="mt-0.5 truncate text-[12px] text-muted-foreground">
                    <span className="font-medium text-foreground/80">
                      {notificationSender(selected.channel).name}
                    </span>{" "}
                    &lt;{notificationSender(selected.channel).email}&gt; · to{" "}
                    {user.email}
                  </p>
                  <p className="mt-0.5 text-[11.5px] text-muted-foreground">
                    {formatNotificationDate(selected.createdAt)} ·{" "}
                    {notificationChannelLabel(selected.channel)}
                  </p>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 shrink-0 gap-1.5 px-2 text-[12px] text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  title="Delete message"
                  onClick={() =>
                    setConfirm({
                      type: "delete",
                      id: selected.id,
                      title: selected.title,
                    })
                  }
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Delete</span>
                </Button>
              </header>

              <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
                <NotificationMessage
                  item={selected}
                  recipient={{ name: user.name, email: user.email }}
                />
              </div>
            </>
          ) : (
            <EmptyPanel
              icon={<Bell className="h-5 w-5" />}
              title={
                items.length === 0 ? "No messages yet" : "Select a message"
              }
              description={
                items.length === 0
                  ? "Certification results and credential updates land in this inbox."
                  : "Choose a message from the list to read the full update here."
              }
            />
          )}
        </section>
      </div>

      {confirmCopy ? (
        <ConfirmDialog
          open={confirm !== null}
          title={confirmCopy.title}
          description={confirmCopy.description}
          confirmLabel={confirmCopy.confirmLabel}
          variant={confirmCopy.variant}
          onConfirm={handleConfirm}
          onCancel={() => setConfirm(null)}
        />
      ) : null}
    </div>
  );
}
