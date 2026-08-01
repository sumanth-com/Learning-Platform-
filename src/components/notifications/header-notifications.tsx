"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell, Check } from "lucide-react";
import {
  formatNotificationTime,
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  unreadNotificationCount,
  type AppNotification,
} from "@/lib/notifications";
import { PORTAL_ROUTES } from "@/features/portal/types";
import { cn } from "@/lib/utils";

export function HeaderNotifications() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<AppNotification[]>([]);
  const [unread, setUnread] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  const refresh = useCallback(() => {
    const next = listNotifications().filter((n) => !n.read);
    setItems(next.slice(0, 5));
    setUnread(unreadNotificationCount());
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

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("mousedown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v);
          refresh();
        }}
        aria-label="Notifications"
        className={cn(
          "relative inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border/80 bg-card/80 text-foreground transition",
          "hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
        )}
      >
        <Bell className="h-4 w-4" strokeWidth={1.75} />
        {unread > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground">
            {unread > 9 ? "9+" : unread}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-[min(22rem,calc(100vw-1.5rem))] overflow-hidden rounded-2xl border border-border bg-popover text-popover-foreground shadow-[0_20px_50px_-24px_rgba(15,23,42,0.45)]">
          <div className="flex items-center justify-between gap-2 border-b border-border/70 px-3.5 py-3">
            <p className="text-[13px] font-semibold text-foreground">
              Notifications
            </p>
            <button
              type="button"
              disabled={unread === 0}
              className={cn(
                "text-[11px] font-medium transition",
                unread > 0
                  ? "text-primary hover:text-primary/80"
                  : "cursor-default text-muted-foreground/50"
              )}
              onClick={() => {
                if (unread === 0) return;
                markAllNotificationsRead();
                refresh();
              }}
            >
              Mark as read
            </button>
          </div>

          {items.length === 0 ? (
            <p className="px-4 py-8 text-center text-[13px] text-muted-foreground">
              You&apos;re all caught up.
            </p>
          ) : (
            <ul className="max-h-[22rem] overflow-y-auto">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="border-b border-border/50 last:border-b-0"
                >
                  <div className="bg-primary/[0.05] px-3.5 py-3 transition hover:bg-muted/50">
                    <Link
                      href={item.href || PORTAL_ROUTES.notifications}
                      onClick={() => {
                        markNotificationRead(item.id);
                        setOpen(false);
                        refresh();
                      }}
                      className="block"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-[13px] font-semibold text-foreground">
                          {item.title}
                        </p>
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      </div>
                      <p className="mt-0.5 line-clamp-2 text-[12px] leading-relaxed text-muted-foreground">
                        {item.body}
                      </p>
                    </Link>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <p className="text-[10px] text-muted-foreground">
                        {formatNotificationTime(item.createdAt)}
                      </p>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium text-primary transition hover:bg-primary/10"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          markNotificationRead(item.id);
                          refresh();
                        }}
                      >
                        <Check className="h-3 w-3" strokeWidth={2.25} />
                        Mark as read
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="border-t border-border/70 px-3.5 py-2.5">
            <Link
              href={PORTAL_ROUTES.notifications}
              onClick={() => setOpen(false)}
              className="block text-center text-[12px] font-medium text-foreground hover:underline"
            >
              View all notifications
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
