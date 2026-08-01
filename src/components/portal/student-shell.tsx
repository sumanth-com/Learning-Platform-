"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  PortalShellProvider,
  usePortalShell,
} from "@/components/portal/portal-shell-context";
import { PortalChromeProvider, usePortalChrome } from "@/components/portal/portal-chrome";
import { StudentSidebar } from "@/components/portal/student-sidebar";
import { StudentHeader } from "@/components/portal/student-header";
import { ContinueOnDesktop } from "@/components/portal/continue-on-desktop";
import { MobileBottomNav } from "@/components/portal/mobile-bottom-nav";
import type { PortalData } from "@/features/portal/types";
import { useMinWidth } from "@/hooks/use-min-width";
import { getQueryClient } from "@/lib/get-query-client";
import {
  isDesktopOnlyPath,
  shouldHideBottomNav,
} from "@/lib/portal-mobile";
import { cn } from "@/lib/utils";

type StudentShellProps = {
  data: PortalData;
  children: React.ReactNode;
};

export function StudentShell(props: StudentShellProps) {
  const [queryClient] = useState(() => getQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <PortalShellProvider>
        <PortalChromeProvider>
          <StudentShellInner {...props} />
        </PortalChromeProvider>
      </PortalShellProvider>
    </QueryClientProvider>
  );
}

function StudentShellInner({ data, children }: StudentShellProps) {
  const pathname = usePathname();
  const { setCollapsed } = usePortalShell();
  const { title, subtitle, fillViewport } = usePortalChrome();
  const isMdUp = useMinWidth(768);

  const flush =
    fillViewport ||
    pathname.startsWith("/learn") ||
    pathname.startsWith("/module/") ||
    pathname.startsWith("/challenge/") ||
    pathname.startsWith("/ai-mentor") ||
    /^\/projects\/[^/]+\/[^/]+/.test(pathname) ||
    /^\/assignments\/[^/]+\/[^/]+/.test(pathname) ||
    pathname === "/roadmap" ||
    pathname === "/dashboard";

  const hideMobileNav = shouldHideBottomNav(pathname);
  const desktopOnly = isDesktopOnlyPath(pathname);

  // After hydration: skip mounting heavy desktop workspaces on phones
  const gateOnly = desktopOnly && isMdUp === false;
  const desktopContentOnly = desktopOnly && isMdUp === true;
  const cssSplitGate = desktopOnly && isMdUp === null;

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const apply = () => {
      if (!mq.matches) {
        try {
          const stored = window.localStorage.getItem(
            "SupraBase.portal.sidebarCollapsed"
          );
          if (stored === null) setCollapsed(true);
        } catch {
          setCollapsed(true);
        }
      }
    };
    apply();
  }, [setCollapsed]);

  const contentClassName = cn(
    "relative w-full min-w-0",
    flush
      ? cn(
          "h-full min-h-0 flex-col",
          gateOnly ? "hidden" : desktopContentOnly || !desktopOnly ? "flex" : "hidden md:flex"
        )
      : cn(
          "mx-auto max-w-[1440px] px-4 py-6 pb-12 sm:px-6 lg:px-8",
          gateOnly && "hidden",
          cssSplitGate && "hidden md:block",
          !hideMobileNav && "max-md:pb-6"
        )
  );

  return (
    <div className="portal-shell flex h-[100dvh] overflow-hidden bg-background font-sans text-foreground antialiased [&_.font-display]:font-sans">
      {/* Desktop rail — unchanged */}
      <div className="hidden h-full md:block">
        <StudentSidebar mode="desktop" />
      </div>

      <div className="portal-shell-col flex min-w-0 flex-1 flex-col bg-background">
        <StudentHeader title={title} subtitle={subtitle} user={data.user} />
        <main
          className={cn(
            "relative min-h-0 min-w-0 flex-1",
            flush
              ? "overflow-hidden"
              : desktopOnly
                ? "overflow-hidden md:overflow-x-hidden md:overflow-y-auto"
                : "overflow-x-hidden overflow-y-auto"
          )}
        >
          <div
            aria-hidden
            className="portal-ambient pointer-events-none absolute inset-0"
          />

          {(gateOnly || cssSplitGate) && (
            <div
              className={cn(
                "relative flex h-full min-h-0 flex-col",
                cssSplitGate && "md:hidden"
              )}
            >
              <ContinueOnDesktop
                featureLabel={
                  pathname.startsWith("/module/")
                    ? "Learning module"
                    : undefined
                }
              />
            </div>
          )}

          {!gateOnly ? (
            <div className={contentClassName}>{children}</div>
          ) : null}
        </main>
        <MobileBottomNav />
      </div>
    </div>
  );
}
