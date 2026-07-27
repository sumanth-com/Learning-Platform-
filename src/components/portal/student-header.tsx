"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ChevronRight, Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { usePortalShell } from "@/components/portal/portal-shell-context";
import { usePortalChrome } from "@/components/portal/portal-chrome";
import { ProfileMenu } from "@/components/portal/profile-menu";
import type { PortalUser } from "@/features/portal/types";
import { cn } from "@/lib/utils";

type StudentHeaderProps = {
  title?: string;
  subtitle?: string;
  user: PortalUser;
};

function isProjectDetailPath(pathname: string) {
  return /^\/projects\/[^/]+\/[^/]+\/?$/.test(pathname);
}

export function StudentHeader({ title, subtitle, user }: StudentHeaderProps) {
  const pathname = usePathname();
  const { collapsed, toggleCollapsed, toggleMobile } = usePortalShell();
  const { breadcrumbs } = usePortalChrome();
  const showBackToProjects = isProjectDetailPath(pathname);
  const hasBreadcrumbs = Boolean(breadcrumbs && breadcrumbs.length > 0);

  return (
    <header className="portal-topbar sticky top-0 z-20 border-b border-zinc-800/90 backdrop-blur-xl">
      <div className="flex min-h-16 items-center gap-2.5 px-4 py-3 sm:gap-3 sm:px-6">
        <button
          type="button"
          className={cn(
            "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md md:hidden",
            "text-muted-foreground transition-colors",
            "hover:bg-muted hover:text-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          )}
          onClick={toggleMobile}
          aria-label="Open navigation"
        >
          <Menu className="h-4 w-4" strokeWidth={1.75} />
        </button>

        <button
          type="button"
          className={cn(
            "hidden h-8 w-8 shrink-0 items-center justify-center rounded-md md:inline-flex",
            "text-muted-foreground transition-colors",
            "hover:bg-muted hover:text-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          )}
          onClick={toggleCollapsed}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-4 w-4" strokeWidth={1.75} />
          ) : (
            <PanelLeftClose className="h-4 w-4" strokeWidth={1.75} />
          )}
        </button>

        {showBackToProjects ? (
          <Link
            href="/projects"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 px-2.5 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-700 hover:bg-zinc-900 hover:text-zinc-50"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Back to Projects</span>
            <span className="sm:hidden">Projects</span>
          </Link>
        ) : null}

        <div className="flex min-w-0 flex-1 items-center gap-3">
          {hasBreadcrumbs ? (
            <nav aria-label="Breadcrumb" className="min-w-0 flex-1 overflow-hidden">
              <ol className="flex min-w-0 items-center gap-1.5 overflow-x-auto whitespace-nowrap text-sm [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {breadcrumbs!.map((crumb, index) => {
                  const isLast = index === breadcrumbs!.length - 1;
                  return (
                    <li key={`${crumb.label}-${index}`} className="flex items-center gap-1.5">
                      {index > 0 ? (
                        <ChevronRight
                          className="h-3.5 w-3.5 shrink-0 text-zinc-600"
                          aria-hidden
                        />
                      ) : null}
                      {crumb.href && !isLast ? (
                        <Link
                          href={crumb.href}
                          className="font-semibold text-zinc-100 transition-colors hover:text-indigo-300"
                        >
                          {crumb.label}
                        </Link>
                      ) : (
                        <span
                          className={cn(
                            isLast
                              ? "font-medium text-zinc-400"
                              : "font-semibold text-zinc-100"
                          )}
                        >
                          {crumb.label}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ol>
            </nav>
          ) : title ? (
            <div className="flex min-w-0 flex-1 items-center overflow-visible py-0.5">
              <h1 className="truncate text-base font-semibold leading-snug tracking-tight text-foreground sm:text-lg">
                {title}
              </h1>
              {subtitle ? (
                <p className="ml-2 truncate text-xs leading-snug text-muted-foreground">
                  {subtitle}
                </p>
              ) : null}
            </div>
          ) : (
            <div className="min-w-0 flex-1" />
          )}
        </div>

        <ProfileMenu name={user.name} role={user.role} />
      </div>
    </header>
  );
}
