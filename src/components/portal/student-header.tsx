"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { SupraBaseMark } from "@/components/brand/supra-learn-logo";
import { usePortalChrome } from "@/components/portal/portal-chrome";
import { ProfileMenu } from "@/components/portal/profile-menu";
import { HeaderNotifications } from "@/components/notifications/header-notifications";
import type { PortalUser } from "@/features/portal/types";
import { PORTAL_ROUTES } from "@/features/portal/types";
import { SITE } from "@/lib/site";
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
  const { breadcrumbs } = usePortalChrome();
  const showBackToProjects = isProjectDetailPath(pathname);
  const hasBreadcrumbs = Boolean(breadcrumbs && breadcrumbs.length > 0);
  const mentorMobile = pathname.startsWith("/ai-mentor");

  return (
    <header
      className={cn(
        "portal-topbar sticky top-0 z-20 backdrop-blur-xl",
        mentorMobile
          ? "max-lg:border-b-0 border-b border-zinc-800/90"
          : "border-b border-zinc-800/90"
      )}
    >
      <div className="flex min-h-14 items-center gap-2.5 px-3.5 py-2.5 sm:min-h-16 sm:gap-3 sm:px-6 sm:py-3 max-md:min-h-[3.25rem]">
        {/* Desktop-only: back to projects. Mobile hits Continue-on-Desktop for labs. */}
        {showBackToProjects ? (
          <Link
            href="/projects"
            className="hidden shrink-0 items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 px-2.5 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-700 hover:bg-zinc-900 hover:text-zinc-50 md:inline-flex"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Projects</span>
          </Link>
        ) : null}

        <div className="flex min-w-0 flex-1 items-center gap-3">
          {/* Mobile companion: brand lockup instead of page titles */}
          <Link
            href={PORTAL_ROUTES.dashboard}
            className="inline-flex min-w-0 items-center gap-2 md:hidden"
            aria-label={`${SITE.name} home`}
          >
            <SupraBaseMark className="h-7 w-7" />
            <span className="truncate text-[14.5px] font-semibold tracking-[-0.02em] text-foreground">
              {SITE.name}
            </span>
          </Link>

          {/* Desktop / tablet: breadcrumbs or page title */}
          {hasBreadcrumbs ? (
            <nav
              aria-label="Breadcrumb"
              className="hidden min-w-0 flex-1 overflow-hidden md:block"
            >
              <ol className="flex min-w-0 items-center gap-1.5 overflow-x-auto whitespace-nowrap text-sm [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {breadcrumbs!.map((crumb, index) => {
                  const isLast = index === breadcrumbs!.length - 1;
                  return (
                    <li
                      key={`${crumb.label}-${index}`}
                      className="flex items-center gap-1.5"
                    >
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
            <div className="hidden min-w-0 flex-1 items-center overflow-visible py-0.5 md:flex">
              <h1 className="truncate text-base font-semibold leading-snug tracking-tight text-foreground sm:text-lg">
                {title}
              </h1>
              {subtitle ? (
                <p className="ml-2 hidden truncate text-xs leading-snug text-muted-foreground sm:block">
                  {subtitle}
                </p>
              ) : null}
            </div>
          ) : (
            <div className="hidden min-w-0 flex-1 md:block" />
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <HeaderNotifications />
          <ProfileMenu name={user.name} role={user.role} />
        </div>
      </div>
    </header>
  );
}
