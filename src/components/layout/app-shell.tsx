"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { MobileGate } from "@/components/layout/mobile-gate";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="lg:hidden">
        <MobileGate />
      </div>

      <div className="hidden min-h-screen bg-zinc-950 text-zinc-100 lg:block">
        <Sidebar />
        <main className="min-h-screen lg:pl-64">
          <div className="mx-auto max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </>
  );
}
