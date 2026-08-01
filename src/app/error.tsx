"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AUTH_ROUTES } from "@/features/auth/constants";

/**
 * Segment error UI — never auto-reload (that trapped users on /login).
 */
export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app-error]", {
      name: error.name,
      message: error.message,
      digest: error.digest,
    });
    try {
      sessionStorage.removeItem("suprabase.error.reload");
    } catch {
      /* ignore */
    }
  }, [error]);

  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-[#f7f4f1] px-6 text-center">
      <h1 className="text-2xl font-semibold tracking-tight text-[#14151a]">
        Something went wrong
      </h1>
      <p className="mt-2 max-w-sm text-sm text-[#4b5160]">
        This page hit an unexpected error. You can try again or go back to sign
        in.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-lg bg-[#5f3435] px-4 py-2 text-sm font-medium text-white"
        >
          Try again
        </button>
        <Link
          href={AUTH_ROUTES.login}
          className="rounded-lg border border-[#d9d3ce] px-4 py-2 text-sm font-medium text-[#14151a]"
        >
          Sign in
        </Link>
        <Link
          href={AUTH_ROUTES.public}
          className="rounded-lg border border-[#d9d3ce] px-4 py-2 text-sm font-medium text-[#14151a]"
        >
          Home
        </Link>
      </div>
    </main>
  );
}
