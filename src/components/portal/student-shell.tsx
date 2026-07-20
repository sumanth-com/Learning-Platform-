"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import {
  PortalShellProvider,
  usePortalShell,
} from "@/components/portal/portal-shell-context";
import { StudentSidebar } from "@/components/portal/student-sidebar";
import { StudentHeader } from "@/components/portal/student-header";
import type { PortalData } from "@/features/portal/types";

type StudentShellProps = {
  data: PortalData;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
};

export function StudentShell(props: StudentShellProps) {
  return (
    <PortalShellProvider>
      <StudentShellInner {...props} />
    </PortalShellProvider>
  );
}

function StudentShellInner({
  data,
  title,
  subtitle,
  children,
}: StudentShellProps) {
  const { mobileOpen, closeMobile, setCollapsed } = usePortalShell();

  // Tablet: prefer collapsed rail without overwriting desktop preference in storage.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const apply = () => {
      if (!mq.matches) {
        // Collapse in-memory only (PortalShellContext setCollapsed persists).
        // Use a one-shot visual preference via the public setter only on tablet mount.
        try {
          const stored = window.localStorage.getItem(
            "supralearn.portal.sidebarCollapsed"
          );
          if (stored === null) {
            // Default tablet to collapsed once; user can expand.
            setCollapsed(true);
          }
        } catch {
          setCollapsed(true);
        }
      }
    };
    apply();
  }, [setCollapsed]);

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-zinc-950 text-zinc-100">
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
        <main className="relative min-h-0 flex-1 overflow-y-auto">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(99,102,241,0.07),_transparent_55%)]"
          />
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="relative mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
