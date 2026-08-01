"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AUTH_ROUTES } from "@/features/auth/constants";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app-error]", error);
  }, [error]);

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-3xl tracking-tight text-foreground">
        Something went wrong
      </h1>
      <p className="mt-3 max-w-md text-sm text-muted-foreground">
        This page hit a temporary error. You can try again or head back to the
        home page.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background"
        >
          Try again
        </button>
        <Link
          href={AUTH_ROUTES.public}
          className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground"
        >
          Go home
        </Link>
      </div>
    </main>
  );
}
