"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ChevronRight, Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <header className="sticky top-0 z-20 border-b border-zinc-800/90 bg-background/95 backdrop-blur-xl">
      <div className="flex min-h-16 items-center gap-3 px-4 py-2.5 sm:px-6">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="h-9 w-9 md:hidden"
          onClick={toggleMobile}
          aria-label="Open navigation"
        >
          <Menu className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="hidden h-9 w-9 md:inline-flex"
          onClick={toggleCollapsed}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </Button>

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
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-lg font-semibold tracking-tight text-zinc-50 sm:text-xl">
                {title}
              </h1>
              {subtitle ? (
                <p className="mt-0.5 truncate text-xs text-zinc-500">{subtitle}</p>
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
