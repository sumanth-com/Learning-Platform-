"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import {
  ArrowLeft,
  BarChart3,
  BookOpen,
  Boxes,
  ClipboardList,
  FileText,
  Inbox,
  Layers,
  LayoutDashboard,
  Link2,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ADMIN_ROUTES } from "@/features/admin/types";
import { useAdminShell } from "@/components/admin/admin-shell-context";
import { Button } from "@/components/ui/button";

const NAV: Array<{
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
}> = [
  { href: ADMIN_ROUTES.root, label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: ADMIN_ROUTES.courses, label: "Courses", icon: BookOpen },
  { href: ADMIN_ROUTES.phases, label: "Phases", icon: Layers },
  { href: ADMIN_ROUTES.modules, label: "Modules", icon: Boxes },
  { href: ADMIN_ROUTES.lessons, label: "Lessons", icon: FileText },
  { href: ADMIN_ROUTES.assignments, label: "Assignments", icon: ClipboardList },
  { href: ADMIN_ROUTES.resources, label: "Resources", icon: Link2 },
  { href: ADMIN_ROUTES.students, label: "Students", icon: Users },
  { href: ADMIN_ROUTES.submissions, label: "Submissions", icon: Inbox },
  { href: ADMIN_ROUTES.analytics, label: "Analytics", icon: BarChart3 },
  { href: ADMIN_ROUTES.settings, label: "Settings", icon: Settings },
];

type AdminSidebarProps = {
  userName?: string | null;
  userRole?: string | null;
};

export function AdminSidebar({ userName, userRole }: AdminSidebarProps) {
  const pathname = usePathname();
  const { collapsed, mobileOpen, closeMobile, toggleCollapsed } =
    useAdminShell();

  useEffect(() => {
    closeMobile();
  }, [pathname, closeMobile]);

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity lg:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={closeMobile}
        aria-hidden={!mobileOpen}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-full flex-col border-r border-zinc-800 bg-zinc-950 transition-[width,transform] duration-200 lg:static lg:translate-x-0",
          collapsed ? "lg:w-[72px]" : "lg:w-60",
          "w-60",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div
          className={cn(
            "flex h-16 shrink-0 items-center border-b border-zinc-800",
            collapsed ? "justify-center px-2" : "justify-between px-4"
          )}
        >
          <Link
            href={ADMIN_ROUTES.root}
            onClick={closeMobile}
            className={cn(
              "min-w-0",
              collapsed && "flex items-center justify-center"
            )}
          >
            {collapsed ? (
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
                S
              </span>
            ) : (
              <div>
                <p className="font-display text-lg leading-tight text-zinc-50">
                  SupraLearn
                </p>
                <p className="text-[11px] uppercase tracking-[0.14em] text-zinc-500">
                  Admin Portal
                </p>
              </div>
            )}
          </Link>

          <div className="flex items-center gap-1">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="hidden h-8 w-8 lg:inline-flex"
              onClick={toggleCollapsed}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <PanelLeftOpen className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-8 w-8 lg:hidden"
              onClick={closeMobile}
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-3">
          {NAV.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobile}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors",
                  collapsed && "justify-center px-2",
                  active
                    ? "bg-zinc-800 text-white shadow-sm shadow-black/20"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0",
                    active ? "text-indigo-300" : "text-zinc-500 group-hover:text-zinc-300"
                  )}
                />
                {!collapsed ? <span className="truncate">{item.label}</span> : null}
              </Link>
            );
          })}
        </nav>

        <div
          className={cn(
            "border-t border-zinc-800 py-3",
            collapsed ? "px-2" : "px-3"
          )}
        >
          {!collapsed && userName ? (
            <div className="mb-2 px-1">
              <p className="truncate text-xs font-medium text-zinc-300">
                {userName}
              </p>
              {userRole ? (
                <p className="truncate text-[11px] capitalize text-zinc-500">
                  {userRole}
                </p>
              ) : null}
            </div>
          ) : null}
          <Link
            href="/dashboard"
            onClick={closeMobile}
            title={collapsed ? "Back to app" : undefined}
            className={cn(
              "inline-flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs text-zinc-400 transition hover:bg-zinc-900 hover:text-zinc-200",
              collapsed && "justify-center px-2"
            )}
          >
            <ArrowLeft className="h-3.5 w-3.5 shrink-0" />
            {!collapsed ? <span>Back to app</span> : null}
          </Link>
        </div>
      </aside>
    </>
  );
}
