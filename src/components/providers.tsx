"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { Suspense, useEffect, useState } from "react";
import { AuthAnalyticsBridge } from "@/components/analytics/auth-analytics-bridge";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { getQueryClient } from "@/lib/get-query-client";

/**
 * Root providers — keep light for marketing pages.
 * Portal progress/celebration mounts only in the student shell.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => getQueryClient());

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    // Quietly drop any leftover workers/caches. Do not force-navigate —
    // that interrupts hydration and can flash the app error screen.
    void (async () => {
      try {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map((reg) => reg.unregister()));
      } catch {
        /* ignore */
      }
      if (!("caches" in window)) return;
      try {
        const keys = await caches.keys();
        await Promise.all(
          keys
            .filter(
              (key) =>
                key.startsWith("suprabase-") ||
                key.startsWith("supracodez-") ||
                key.includes("supra")
            )
            .map((key) => caches.delete(key))
        );
      } catch {
        /* ignore */
      }
    })();
  }, []);

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={null}>
          <AuthAnalyticsBridge />
        </Suspense>
        {children}
      </QueryClientProvider>
    </ThemeProvider>
  );
}
