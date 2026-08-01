"use client";

import { useEffect } from "react";

/**
 * Root error UI — never auto-reload in a loop.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[global-error]", {
      name: error.name,
      message: error.message,
      digest: error.digest,
    });
    try {
      sessionStorage.removeItem("suprabase.global-error.reload");
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
          <h1 style={{ fontSize: 24, margin: 0 }}>Something went wrong</h1>
          <p style={{ marginTop: 12, opacity: 0.7, maxWidth: 420 }}>
            An unexpected error stopped this page. Try again or return home.
          </p>
          <div
            style={{
              marginTop: 24,
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={() => reset()}
              style={{
                border: 0,
                borderRadius: 8,
                padding: "10px 18px",
                background: "#5f3435",
                color: "#fff",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Try again
            </button>
            <a
              href="/login"
              style={{
                borderRadius: 8,
                padding: "10px 18px",
                border: "1px solid #d9d3ce",
                color: "#14151a",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Sign in
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
