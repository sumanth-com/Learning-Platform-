/**
 * Legacy cleanup worker.
 * Older builds intercepted page navigations and could return Response.error(),
 * which shows Chrome/Vercel "This page couldn't load" on /login and other routes.
 * This version clears caches and unregisters itself so pages always hit the network.
 */
const CACHE_PREFIX = "suprabase-";

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key.startsWith(CACHE_PREFIX) || key.includes("supra"))
          .map((key) => caches.delete(key))
      );
      await self.registration.unregister();
      const clients = await self.clients.matchAll({ type: "window" });
      for (const client of clients) {
        if ("navigate" in client) {
          try {
            await client.navigate(client.url);
          } catch {
            /* ignore */
          }
        }
      }
    })()
  );
});

// Do not intercept any fetches — pages must never be soft-failed by this worker.
self.addEventListener("fetch", () => {});
