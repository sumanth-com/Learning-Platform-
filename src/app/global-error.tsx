"use client";

import { useEffect } from "react";

const RELOAD_KEY = "suprabase.global-error.reload";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[global-error]", error);
    try {
      const last = Number(sessionStorage.getItem(RELOAD_KEY) || "0");
      const now = Date.now();
      if (!last || now - last > 15_000) {
        sessionStorage.setItem(RELOAD_KEY, String(now));
        window.location.replace(
          `${window.location.pathname}${window.location.search}`
        );
      }
    } catch {
      /* ignore */
    }
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#f7f4f1",
          color: "#14151a",
          fontFamily:
            "Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif",
          padding: 24,
          textAlign: "center",
        }}
      >
        <div>
          <h1 style={{ fontSize: 24, margin: 0 }}>Loading…</h1>
          <p style={{ marginTop: 12, opacity: 0.7, maxWidth: 420 }}>
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
            style={{
              marginTop: 24,
              border: 0,
              borderRadius: 8,
              padding: "10px 18px",
              background: "#5f3435",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Continue
          </button>
        </div>
      </body>
    </html>
  );
}
