"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
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

    // Remove any service worker. Prior versions intercepted navigations and
    // could surface "This page couldn't load" on auth routes in production.
    void navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => {
        void registration.unregister();
      });
    });

    if ("caches" in window) {
      void caches.keys().then((keys) => {
        keys
          .filter((key) => key.startsWith("suprabase-") || key.includes("supra"))
          .forEach((key) => void caches.delete(key));
      });
    }
  }, []);

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ThemeProvider>
  );
}
