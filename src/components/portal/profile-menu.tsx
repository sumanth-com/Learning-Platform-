"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import {
  ChevronDown,
  CircleHelp,
  Loader2,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";
import { toast } from "sonner";
import { logoutAction } from "@/features/auth/actions/auth-actions";
import { AUTH_MESSAGES } from "@/features/auth/constants";
import { useTheme } from "@/components/theme/theme-provider";
import { PORTAL_ROUTES } from "@/features/portal/types";
import { cn } from "@/lib/utils";

type ProfileMenuProps = {
  name: string;
  role: string;
};

export function ProfileMenu({ name, role }: ProfileMenuProps) {
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const rootRef = useRef<HTMLDivElement>(null);
  const initial = name.charAt(0).toUpperCase() || "U";

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Open profile menu"
        className={cn(
          "group inline-flex items-center gap-1.5 rounded-xl p-0.5 transition-colors",
          "hover:bg-muted",
          open && "bg-muted"
        )}
      >
        <span
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-xl text-[14px] font-semibold",
            "bg-gradient-to-br from-[#242328] via-[#343136] to-brand text-white",
            "ring-1 ring-border shadow-sm"
          )}
        >
          {initial}
        </span>
        <ChevronDown
          className={cn(
            "mr-1 h-3.5 w-3.5 text-muted-foreground transition-transform",
            open && "rotate-180 text-foreground"
          )}
        />
      </button>

      {open ? (
        <div
          role="menu"
          className={cn(
            "absolute right-0 z-50 mt-2 w-56 origin-top-right overflow-hidden",
            "rounded-2xl border border-border bg-popover p-1.5 text-popover-foreground",
            "shadow-xl shadow-black/10"
          )}
        >
          <div className="mb-1 rounded-xl bg-muted px-3 py-2.5">
            <p className="truncate text-sm font-semibold text-foreground">{name}</p>
            <p className="truncate text-[11px] capitalize text-muted-foreground">
              {role}
            </p>
          </div>

          <div className="space-y-0.5">
            <button
              type="button"
              role="menuitem"
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-foreground transition-colors hover:bg-muted"
              onClick={() => {
                toggleTheme();
                setOpen(false);
              }}
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 text-amber-500" />
              ) : (
                <Moon className="h-4 w-4 text-primary" />
              )}
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </button>

            <Link
              href={PORTAL_ROUTES.help}
              role="menuitem"
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              onClick={() => setOpen(false)}
            >
              <CircleHelp className="h-4 w-4 text-muted-foreground" />
              Help
            </Link>

            <div className="my-1 h-px bg-border" />

            <button
              type="button"
              role="menuitem"
              disabled={pending}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-rose-600 transition-colors hover:bg-rose-500/10 disabled:opacity-60 dark:text-rose-400"
              onClick={() => {
                startTransition(async () => {
                  toast.success(AUTH_MESSAGES.logoutSuccess);
                  await logoutAction();
                });
              }}
            >
              {pending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="h-4 w-4" />
              )}
              Logout
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
