"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import {
  Award,
  BarChart3,
  Bell,
  BookOpen,
  ClipboardList,
  LayoutDashboard,
  Settings,
  Users,
  X,
} from "lucide-react";
import { SupraBaseMark } from "@/components/brand/supra-learn-logo";
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
  { href: ADMIN_ROUTES.students, label: "Students", icon: Users },
  { href: ADMIN_ROUTES.accessRequests, label: "Access Requests", icon: ClipboardList },
  { href: ADMIN_ROUTES.learning, label: "Learning Management", icon: BookOpen },
  { href: ADMIN_ROUTES.certifications, label: "Certifications", icon: Award },
  { href: ADMIN_ROUTES.analytics, label: "Analytics", icon: BarChart3 },
  { href: ADMIN_ROUTES.notifications, label: "Notifications", icon: Bell },
  { href: ADMIN_ROUTES.settings, label: "Settings", icon: Settings },
];

type AdminSidebarProps = {
  mode?: "desktop" | "drawer";
};

export function AdminSidebar({ mode = "desktop" }: AdminSidebarProps) {
  const pathname = usePathname();
  const { mobileOpen, closeMobile } = useAdminShell();

  useEffect(() => {
    closeMobile();
  }, [pathname, closeMobile]);

  if (mode === "drawer") {
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
            "fixed inset-y-0 left-0 z-50 flex h-full w-64 flex-col border-r border-zinc-800/90 bg-zinc-950 shadow-2xl shadow-black/40 transition-transform duration-200 lg:hidden",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <SidebarChrome onCloseMobile={closeMobile} showClose />
        </aside>
      </>
    );
  }

  return (
    <aside className="flex h-full w-64 flex-col overflow-hidden border-r border-zinc-800/90 bg-zinc-950">
      <SidebarChrome onCloseMobile={closeMobile} />
    </aside>
  );
}

function SidebarChrome({
  onCloseMobile,
  showClose = false,
}: {
  onCloseMobile: () => void;
  showClose?: boolean;
}) {
  const pathname = usePathname();

  return (
    <>
      <div
        className={cn(
          "flex h-16 shrink-0 items-center border-b border-zinc-800/90 px-4",
          showClose ? "justify-between gap-2" : "gap-2.5"
        )}
      >
        <Link
          href={ADMIN_ROUTES.root}
          onClick={onCloseMobile}
          className="flex min-w-0 items-center gap-2.5 rounded-xl transition-opacity hover:opacity-90"
        >
          <SupraBaseMark className="h-9 w-9 shrink-0" />
          <div className="min-w-0">
            <p className="truncate text-[15px] font-semibold leading-none tracking-tight text-zinc-50">
              Suprabase
            </p>
            <p className="mt-1.5 truncate text-[10px] font-medium uppercase leading-none tracking-[0.16em] text-zinc-500">
              Super Admin
            </p>
          </div>
        </Link>

        {showClose ? (
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-8 w-8 shrink-0 text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200"
            onClick={onCloseMobile}
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </Button>
        ) : null}
      </div>

      <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAV.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-[#5f3435] text-white shadow-sm"
                  : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-100"
              )}
            >
              {active ? (
                <span
                  className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-[#a7423d]"
                  aria-hidden
                />
              ) : null}
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-colors",
                  active
                    ? "text-white"
                    : "text-zinc-500 group-hover:text-zinc-200"
                )}
                strokeWidth={1.75}
              />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
