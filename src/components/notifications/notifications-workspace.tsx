"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Award,
  Bell,
  BellOff,
  BookOpen,
  Bot,
  Check,
  CheckCheck,
  Trash2,
} from "lucide-react";
import {
  clearAllNotifications,
  clearReadNotifications,
  deleteNotification,
  formatNotificationTime,
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  notificationChannelLabel,
  syncCertificateNotifications,
  type AppNotification,
} from "@/lib/notifications";
import { readUserSettings } from "@/lib/user-settings";
import { cn } from "@/lib/utils";
import { PORTAL_ROUTES } from "@/features/portal/types";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";

type ConfirmKind =
  | { type: "delete"; id: string; title: string }
  | { type: "clear-read" }
  | { type: "clear-all" };

function ChannelIcon({ channel }: { channel: AppNotification["channel"] }) {
  if (channel === "learning") return <BookOpen className="h-4 w-4" />;
  if (channel === "mentor") return <Bot className="h-4 w-4" />;
  return <Award className="h-4 w-4" />;
}

export function NotificationsWorkspace() {
  const [items, setItems] = useState<AppNotification[]>([]);
  const [muted, setMuted] = useState(false);
  const [confirm, setConfirm] = useState<ConfirmKind | null>(null);

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

  const handleConfirm = () => {
    if (!confirm) return;
    if (confirm.type === "delete") deleteNotification(confirm.id);
    if (confirm.type === "clear-read") clearReadNotifications();
    if (confirm.type === "clear-all") clearAllNotifications();
    setConfirm(null);
    refresh();
  };

  const confirmCopy =
    confirm?.type === "delete"
      ? {
          title: "Delete notification?",
          description: `“${confirm.title}” will be removed from your inbox. This can’t be undone.`,
          confirmLabel: "Delete",
          variant: "danger" as const,
        }
      : confirm?.type === "clear-read"
        ? {
            title: "Clear read notifications?",
            description: `${readCount} read ${readCount === 1 ? "notification" : "notifications"} will be removed. Unread items stay.`,
            confirmLabel: "Clear read",
            variant: "warning" as const,
          }
        : confirm?.type === "clear-all"
          ? {
              title: "Clear all notifications?",
              description:
                "Everything in your inbox will be removed. New updates can still arrive later.",
              confirmLabel: "Clear all",
              variant: "danger" as const,
            }
          : null;

  if (muted) {
    return (
      <div className="mx-auto w-full max-w-3xl pb-10">
        <div className="rounded-[1.5rem] border border-border/70 bg-card px-6 py-12 text-center shadow-sm">
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
    <div className="mx-auto w-full max-w-3xl space-y-4 pb-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[13px] text-muted-foreground">
          {items.length === 0
            ? "No updates yet"
            : `${unreadCount} unread · ${items.length} total`}
        </p>
        {items.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-border text-foreground hover:bg-muted"
              disabled={unreadCount === 0}
              onClick={() => {
                markAllNotificationsRead();
                refresh();
              }}
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all read
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-border text-foreground hover:bg-muted"
              disabled={readCount === 0}
              onClick={() => setConfirm({ type: "clear-read" })}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear read
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-border text-muted-foreground hover:bg-muted hover:text-foreground"
              onClick={() => setConfirm({ type: "clear-all" })}
            >
              Clear all
            </Button>
          </div>
        ) : null}
      </div>

      {items.length === 0 ? (
        <div className="rounded-[1.5rem] border border-border/70 bg-card px-6 py-12 text-center shadow-sm">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-muted/50 text-muted-foreground">
            <Bell className="h-5 w-5" />
          </span>
          <h2 className="mt-4 text-[16px] font-semibold text-foreground">
            You’re all caught up
          </h2>
          <p className="mx-auto mt-1.5 max-w-md text-[13px] leading-relaxed text-muted-foreground">
            Updates appear here when you pass a certification or earn a
            certificate.
          </p>
          <Link
            href={PORTAL_ROUTES.certifications}
            className="mt-5 inline-flex text-[13px] font-medium text-foreground underline-offset-4 hover:underline"
          >
            Browse certifications →
          </Link>
        </div>
      ) : (
        <ul className="overflow-hidden rounded-[1.5rem] border border-border/70 bg-card shadow-sm">
          {items.map((item, index) => (
            <li
              key={item.id}
              className={cn(
                "group border-border/60",
                index > 0 && "border-t",
                !item.read && "bg-[#27d17c]/[0.04]"
              )}
            >
              <div className="flex items-stretch gap-1 px-2 py-2 sm:gap-2 sm:px-3 sm:py-2.5">
                <Link
                  href={item.href || PORTAL_ROUTES.notifications}
                  onClick={() => {
                    markNotificationRead(item.id);
                    refresh();
                  }}
                  className="flex min-w-0 flex-1 gap-3 rounded-xl px-2 py-2 transition hover:bg-muted/40 sm:px-2.5"
                >
                  <span
                    className={cn(
                      "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border",
                      !item.read
                        ? "border-[#27d17c]/30 bg-[#27d17c]/10 text-[#1f8f55]"
                        : "border-border bg-muted/40 text-muted-foreground"
                    )}
                  >
                    <ChannelIcon channel={item.channel} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-[14px] font-semibold text-foreground">
                        {item.title}
                      </p>
                      {!item.read ? (
                        <span className="h-1.5 w-1.5 rounded-full bg-[#27d17c]" />
                      ) : null}
                    </div>
                    <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                      {item.body}
                    </p>
                    <p className="mt-2 text-[11px] text-muted-foreground">
                      {notificationChannelLabel(item.channel)} ·{" "}
                      {formatNotificationTime(item.createdAt)}
                    </p>
                  </div>
                </Link>

                <div className="flex shrink-0 flex-col justify-center gap-1 py-1 pr-1 sm:flex-row sm:items-center sm:pr-1.5">
                  {!item.read ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 gap-1.5 px-2 text-[12px] text-muted-foreground hover:bg-muted hover:text-foreground"
                      title="Mark as read"
                      onClick={() => {
                        markNotificationRead(item.id);
                        refresh();
                      }}
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Read</span>
                    </Button>
                  ) : null}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-1.5 px-2 text-[12px] text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    title="Delete notification"
                    onClick={() =>
                      setConfirm({
                        type: "delete",
                        id: item.id,
                        title: item.title,
                      })
                    }
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Delete</span>
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

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
