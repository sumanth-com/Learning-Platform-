"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Bot,
  ClipboardList,
  FolderKanban,
  LayoutDashboard,
  Library,
  Map,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  StickyNote,
  Trophy,
  UserRound,
  X,
  Bell,
} from "lucide-react";
import { SupraBaseMark } from "@/components/brand/supra-learn-logo";
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
  roadmap: Map,
  projects: FolderKanban,
  assignments: ClipboardList,
  "ai-mentor": Bot,
  resources: Library,
  notes: StickyNote,
  certifications: Trophy,
  notifications: Bell,
  profile: UserRound,
  settings: Settings,
};

type StudentSidebarProps = {
  mode?: "desktop" | "drawer";
};

export function StudentSidebar({ mode = "desktop" }: StudentSidebarProps) {
  const pathname = usePathname();
  const { collapsed, closeMobile, toggleCollapsed } = usePortalShell();
  const isCollapsed = mode === "desktop" && collapsed;
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  useEffect(() => {
    closeMobile();
  }, [pathname, closeMobile]);

  useEffect(() => {
    setPendingHref(null);
  }, [pathname]);

  const activePath = pendingHref ?? pathname;

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
        "portal-rail flex h-full flex-col overflow-hidden border-r border-zinc-800/90 transition-[width] duration-150",
        mode === "drawer" && "shadow-2xl shadow-black/50"
      )}
    >
      <div
        className={cn(
          "flex shrink-0 items-center border-b border-zinc-800/90",
          isCollapsed
            ? "h-auto flex-col gap-2 px-2 py-3"
            : "h-16 gap-2 px-4"
        )}
      >
        <Link
          href="/dashboard"
          prefetch={false}
          onClick={() => {
            setPendingHref("/dashboard");
            closeMobile();
          }}
          className={cn(
            "flex min-w-0 items-center rounded-xl transition-opacity duration-100 hover:opacity-90",
            isCollapsed ? "justify-center p-1" : "gap-3 py-1"
          )}
        >
          <SupraBaseMark className="h-9 w-9 shrink-0" />
          {!isCollapsed ? (
            <div className="min-w-0">
              <p className="truncate text-[15px] font-semibold leading-none tracking-tight text-foreground">
                Suprabase
              </p>
              <p className="mt-1.5 truncate text-[10px] font-medium uppercase leading-none tracking-[0.16em] text-muted-foreground">
                Learn · Build · Ship
              </p>
            </div>
          ) : null}
        </Link>

        {mode === "desktop" ? (
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className={cn(
              "h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground",
              !isCollapsed && "ml-auto"
            )}
            onClick={toggleCollapsed}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="h-4 w-4" strokeWidth={1.75} />
            ) : (
              <PanelLeftClose className="h-4 w-4" strokeWidth={1.75} />
            )}
          </Button>
        ) : (
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="ml-auto h-8 w-8 shrink-0"
            onClick={closeMobile}
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {PORTAL_NAV.map((item) => {
          const Icon = ICONS[item.id];
          const active = item.match
            ? item.match(activePath)
            : activePath === item.href ||
              activePath.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.id}
              href={item.href}
              prefetch={false}
              onClick={() => {
                setPendingHref(item.href);
                closeMobile();
              }}
              title={isCollapsed ? item.label : undefined}
              className={cn(
                "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-100 active:scale-[0.99]",
                isCollapsed && "justify-center px-2",
                active
                  ? "bg-[#5f3435] text-white shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {active ? (
                <span
                  aria-hidden
                  className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-[#a7423d]"
                />
              ) : null}
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0",
                  active ? "text-white" : "text-muted-foreground"
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
