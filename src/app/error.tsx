"use client";

import { useEffect } from "react";

const RELOAD_KEY = "suprabase.error.reload";

function isRecoverableClientError(error: Error) {
  const name = error.name || "";
  const message = (error.message || "").toLowerCase();
  return (
    name === "ChunkLoadError" ||
    message.includes("loading chunk") ||
    message.includes("failed to fetch") ||
    message.includes("fetching script") ||
    message.includes("dynamically imported module") ||
    message.includes("unexpected token")
  );
}

/**
 * Segment error boundary — recover with a full reload once so users never
 * stay stuck on an error screen after deploys / stale clients.
 */
export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app-error]", error);

    try {
      const last = Number(sessionStorage.getItem(RELOAD_KEY) || "0");
      const now = Date.now();
      // Always attempt one hard recovery within a short window.
      if (!last || now - last > 15_000) {
        sessionStorage.setItem(RELOAD_KEY, String(now));
        window.location.replace(
          `${window.location.pathname}${window.location.search}`
        );
        return;
      }
    } catch {
      if (isRecoverableClientError(error)) {
        window.location.reload();
      }
    }
  }, [error]);

  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-[#f7f4f1] px-6 text-center">
      <h1 className="text-2xl font-semibold tracking-tight text-[#14151a]">
        Loading…
      </h1>
      <p className="mt-2 max-w-sm text-sm text-[#4b5160]">
        Refreshing this page to continue.
      </p>
      <button
        type="button"
        onClick={() => {
          try {
            sessionStorage.removeItem(RELOAD_KEY);
          } catch {
            /* ignore */
          }
          reset();
          window.location.reload();
        }}
        className="mt-6 rounded-lg bg-[#5f3435] px-4 py-2 text-sm font-medium text-white"
      >
        Continue
      </button>
    </main>
  );
}
