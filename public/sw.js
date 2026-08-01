/**
 * One-shot cleanup worker for older builds that intercepted navigations.
 * Never call clients.navigate() — that can interrupt React mid-hydration
 * and surface the app error boundary on /login.
 */
self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
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
      try {
        await self.registration.unregister();
      } catch {
        /* ignore */
      }
    })()
  );
});
