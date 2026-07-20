"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import {
  BookOpen,
  Bot,
  Briefcase,
  ClipboardList,
  Code2,
  FolderKanban,
  LayoutDashboard,
  Library,
  Map,
  MessageSquare,
  Settings,
  StickyNote,
  UserRound,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { usePortalShell } from "@/components/portal/portal-shell-context";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  PORTAL_NAV,
  PORTAL_SIDEBAR_WIDTH,
  type PortalNavId,
} from "@/features/portal/types";

const ICONS: Record<PortalNavId, typeof LayoutDashboard> = {
  dashboard: LayoutDashboard,
  journey: Map,
  courses: BookOpen,
  projects: FolderKanban,
  assignments: ClipboardList,
  practice: Code2,
  "ai-mentor": Bot,
  interview: Briefcase,
  resources: Library,
  notes: StickyNote,
  community: MessageSquare,
  profile: UserRound,
  settings: Settings,
};

type StudentSidebarProps = {
  mode?: "desktop" | "drawer";
};

export function StudentSidebar({ mode = "desktop" }: StudentSidebarProps) {
  const pathname = usePathname();
  const { collapsed, closeMobile } = usePortalShell();
  const isCollapsed = mode === "desktop" && collapsed;

  useEffect(() => {
    closeMobile();
  }, [pathname, closeMobile]);

  return (
    <aside
      style={{
        width:
          mode === "drawer"
            ? PORTAL_SIDEBAR_WIDTH
            : isCollapsed
              ? 72
              : PORTAL_SIDEBAR_WIDTH,
      }}
      className={cn(
        "flex h-full flex-col overflow-hidden border-r border-zinc-800/90 bg-zinc-950 transition-[width] duration-200",
        mode === "drawer" && "shadow-2xl shadow-black/50"
      )}
    >
      <div
        className={cn(
          "flex h-14 shrink-0 items-center border-b border-zinc-800/90",
          isCollapsed ? "justify-center px-2" : "justify-between px-4"
        )}
      >
        <Link href="/dashboard" onClick={closeMobile} className="min-w-0">
          {isCollapsed ? (
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
              S
            </span>
          ) : (
            <div>
              <p className="font-display text-base leading-none text-zinc-50">
                SupraLearn
              </p>
              <p className="mt-1 text-[9px] font-semibold tracking-[0.18em] text-indigo-300/80">
                LEARN · BUILD · SHIP
              </p>
            </div>
          )}
        </Link>

        {mode === "drawer" ? (
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={closeMobile}
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </Button>
        ) : null}
      </div>

      <nav className="min-h-0 flex-1 space-y-0.5 overflow-y-auto px-2 py-3">
        {PORTAL_NAV.map((item) => {
          const Icon = ICONS[item.id];
          const active = item.match
            ? item.match(pathname)
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={closeMobile}
              title={isCollapsed ? item.label : undefined}
              className={cn(
                "relative flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] transition-colors",
                isCollapsed && "justify-center px-2",
                active
                  ? "bg-zinc-800/90 text-white"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
              )}
            >
              {active ? (
                <motion.span
                  layoutId="portal-nav-indicator"
                  className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-indigo-400"
                />
              ) : null}
              <Icon
                className={cn(
                  "h-3.5 w-3.5 shrink-0",
                  active ? "text-indigo-300" : "text-zinc-500"
                )}
              />
              {!isCollapsed ? (
                <span className="truncate">{item.label}</span>
              ) : null}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
