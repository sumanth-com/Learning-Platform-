"use client";

import { AdminShellProvider } from "@/components/admin/admin-shell-context";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";

type AdminShellProps = {
  userName?: string | null;
  userRole?: string | null;
  children: React.ReactNode;
};

/**
 * Dedicated Admin Portal chrome — independent of student AppHeader/nav.
 * Viewport-locked shell: sidebar stays put, only main content scrolls.
 */
export function AdminShell({
  userName,
  userRole,
  children,
}: AdminShellProps) {
  return (
    <AdminShellProvider>
      <div className="flex h-[100dvh] overflow-hidden bg-zinc-950 font-sans text-zinc-100 antialiased [&_.font-display]:font-sans">
        <div className="hidden h-full shrink-0 lg:block">
          <AdminSidebar mode="desktop" />
        </div>

        <AdminSidebar mode="drawer" />

        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <AdminTopbar userName={userName} userRole={userRole} />
          <main className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
            <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AdminShellProvider>
  );
}
