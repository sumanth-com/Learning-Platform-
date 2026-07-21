"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  PortalShellProvider,
  usePortalShell,
} from "@/components/portal/portal-shell-context";
import { PortalChromeProvider, usePortalChrome } from "@/components/portal/portal-chrome";
import { StudentSidebar } from "@/components/portal/student-sidebar";
import { StudentHeader } from "@/components/portal/student-header";
import type { PortalData } from "@/features/portal/types";
import { getQueryClient } from "@/lib/get-query-client";
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
  const { mobileOpen, closeMobile, setCollapsed } = usePortalShell();
  const { title, subtitle, fillViewport } = usePortalChrome();

  const flush =
    fillViewport ||
    pathname.startsWith("/learn") ||
    pathname.startsWith("/module/") ||
    pathname === "/journey" ||
    pathname === "/dashboard";

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const apply = () => {
      if (!mq.matches) {
        try {
          const stored = window.localStorage.getItem(
            "supralearn.portal.sidebarCollapsed"
          );
          if (stored === null) setCollapsed(true);
        } catch {
          setCollapsed(true);
        }
      }
    };
    apply();
  }, [setCollapsed]);

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-zinc-950 font-sans text-zinc-100 antialiased [&_.font-display]:font-sans">
      <div className="hidden h-full md:block">
        <StudentSidebar mode="desktop" />
      </div>

      <AnimatePresence>
        {mobileOpen ? (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={closeMobile}
            />
            <motion.div
              key="drawer"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 380, damping: 36 }}
              className="fixed inset-y-0 left-0 z-50 md:hidden"
            >
              <StudentSidebar mode="drawer" />
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col">
        <StudentHeader title={title} subtitle={subtitle} user={data.user} />
        <main
          className={cn(
            "relative min-h-0 flex-1",
            flush ? "overflow-hidden" : "overflow-y-auto"
          )}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(99,102,241,0.07),_transparent_55%)]"
          />
          <div
            className={cn(
              "relative h-full",
              flush
                ? "min-h-0"
                : "mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8"
            )}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
