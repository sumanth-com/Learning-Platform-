"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AUTH_ROUTES } from "@/features/auth/constants";

interface AuthShellProps {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

/**
 * Shared visual chrome for all authentication screens.
 */
export function AuthShell({
  title,
  description,
  children,
  footer,
}: AuthShellProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(99,102,241,0.18),_transparent_55%),radial-gradient(ellipse_at_bottom_right,_rgba(59,130,246,0.12),_transparent_45%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />

      <motion.div
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <Link
            href={AUTH_ROUTES.public}
            className="inline-flex items-center gap-2 text-2xl font-semibold tracking-tight text-zinc-50 transition hover:opacity-90"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-lg shadow-indigo-500/30">
              S
            </span>
            <span className="gradient-text">SupraBase</span>
          </Link>
        </div>

        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/70 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-8">
          <div className="mb-6 space-y-2 text-center sm:text-left">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">
              {title}
            </h1>
            <p className="text-sm text-zinc-400">{description}</p>
          </div>

          {children}

          {footer ? (
            <div className="mt-6 border-t border-zinc-800/80 pt-6 text-center text-sm text-zinc-400">
              {footer}
            </div>
          ) : null}
        </div>
      </motion.div>
    </div>
  );
}
