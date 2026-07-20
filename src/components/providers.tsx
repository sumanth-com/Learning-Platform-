"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ProgressBootstrap, ModuleCompletionWatcher } from "@/components/shared/progress-bootstrap";
import { WeekCompletionCelebration } from "@/components/shared/week-completion-celebration";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: { queries: { staleTime: 60 * 1000, refetchOnWindowFocus: false } },
  }));

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    // In dev, remove stale service workers — they cache old bundles and break HMR.
    if (process.env.NODE_ENV !== "production") {
      void navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => void registration.unregister());
      });
      return;
    }

    let reloaded = false;

    const activateWaitingWorker = (registration: ServiceWorkerRegistration) => {
      if (registration.waiting) {
        registration.waiting.postMessage({ type: "SKIP_WAITING" });
      }
    };

    void navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        activateWaitingWorker(registration);
        void registration.update();

        registration.addEventListener("updatefound", () => {
          const installing = registration.installing;
          if (!installing) return;

          installing.addEventListener("statechange", () => {
            if (installing.state !== "installed") return;
            if (!navigator.serviceWorker.controller) return;
            activateWaitingWorker(registration);
          });
        });
      })
      .catch(() => {
        /* offline support is best-effort */
      });

    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (reloaded) return;
      reloaded = true;
      window.location.reload();
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ProgressBootstrap />
      <ModuleCompletionWatcher />
      <WeekCompletionCelebration />
      {children}
    </QueryClientProvider>
  );
}
