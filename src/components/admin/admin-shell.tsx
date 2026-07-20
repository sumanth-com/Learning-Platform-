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
 */
export function AdminShell({
  userName,
  userRole,
  children,
}: AdminShellProps) {
  return (
    <AdminShellProvider>
      <div className="flex min-h-screen bg-zinc-950 text-zinc-100">
        <AdminSidebar userName={userName} userRole={userRole} />
        <div className="flex min-w-0 flex-1 flex-col">
          <AdminTopbar />
          <main className="flex-1 overflow-x-hidden">
            <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AdminShellProvider>
  );
}
