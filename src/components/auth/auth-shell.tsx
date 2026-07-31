"use client";

import Link from "next/link";
import { LogIn } from "lucide-react";
import { SupraBaseMark } from "@/components/brand/supra-learn-logo";
import { AUTH_ROUTES } from "@/features/auth/constants";
import { SITE } from "@/lib/site";
import { SITE_ROUTES } from "@/lib/site-routes";
import { cn } from "@/lib/utils";

interface AuthShellProps {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  /** Optional icon above the title — defaults to a sign-in glyph. */
  showIcon?: boolean;
}

/**
 * Shared visual chrome for all authentication screens.
 * UI only — forms keep their own submit / validation logic.
 */
export function AuthShell({
  title,
  description,
  children,
  footer,
  showIcon = true,
}: AuthShellProps) {
  return (
    <div className="relative flex h-svh max-h-svh flex-col overflow-hidden bg-[#e8f1fb]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.95)_0%,_transparent_55%),linear-gradient(180deg,#dceaf8_0%,#eef4fb_42%,#f7f9fc_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 118%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.55) 18%, transparent 48%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[42%] h-[140vmax] w-[140vmax] -translate-x-1/2 -translate-y-1/2"
      >
        <span className="absolute inset-[18%] rounded-full border border-white/45" />
        <span className="absolute inset-[28%] rounded-full border border-white/35" />
        <span className="absolute inset-[38%] rounded-full border border-white/25" />
        <span className="absolute inset-[48%] rounded-full border border-white/18" />
      </div>

      <header className="relative z-20 shrink-0 px-4 pt-3 sm:px-6 sm:pt-4">
        <Link
          href={AUTH_ROUTES.public}
          className="inline-flex items-center gap-2 text-[14px] font-semibold tracking-tight text-[#1c1d21] transition hover:opacity-80"
        >
          <SupraBaseMark className="h-7 w-7" />
          {SITE.name}
        </Link>
      </header>

      <main className="relative z-10 flex min-h-0 flex-1 items-center justify-center px-3 py-2 sm:px-5 sm:py-3">
        <div
          className={cn(
            "relative flex w-full max-w-[400px] max-h-full flex-col overflow-y-auto rounded-[1.5rem] border border-white/80 bg-white/85 px-5 py-4 shadow-[0_24px_60px_-24px_rgba(40,70,120,0.32)] backdrop-blur-xl sm:rounded-[1.75rem] sm:px-6 sm:py-5 before:pointer-events-none before:absolute before:inset-x-8 before:top-0 before:h-20 before:rounded-b-[50%] before:bg-[radial-gradient(ellipse_at_top,rgba(220,163,154,0.22),transparent_72%)] before:content-['']"
          )}
        >
          <div className="mb-4 flex shrink-0 flex-col items-center text-center">
            {showIcon ? (
              <span className="mb-2.5 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#e6ebf2] bg-white text-[#1c1d21] shadow-[0_6px_16px_-10px_rgba(30,40,80,0.35)]">
                <LogIn className="h-3.5 w-3.5" strokeWidth={2.25} />
              </span>
            ) : null}
            <h1 className="text-[1.35rem] font-semibold tracking-[-0.03em] text-[#14151a] sm:text-[1.5rem]">
              {title}
            </h1>
            <p className="mt-1 max-w-[19rem] text-[12.5px] leading-5 text-[#6b7285]">
              {description}
            </p>
          </div>

          <div className="min-h-0">{children}</div>

          {footer ? (
            <div className="mt-3.5 shrink-0 text-center text-[12.5px] text-[#6b7285]">
              {footer}
            </div>
          ) : null}
        </div>
      </main>

      <footer className="relative z-10 flex shrink-0 flex-wrap items-center justify-center gap-x-4 gap-y-1 px-4 pb-3 text-[11px] text-[#7a8494] sm:pb-4">
        <Link
          href={SITE_ROUTES.terms}
          className="transition hover:text-[#1c1d21]"
        >
          Terms
        </Link>
        <Link
          href={SITE_ROUTES.privacy}
          className="transition hover:text-[#1c1d21]"
        >
          Privacy
        </Link>
        <Link
          href={SITE_ROUTES.contact}
          className="transition hover:text-[#1c1d21]"
        >
          Contact
        </Link>
      </footer>
    </div>
  );
}

/** Shared light-theme classes for auth primary CTAs. */
export const authPrimaryBtnClass =
  "h-10 rounded-xl bg-[#1c1d21] text-[13px] font-semibold text-white shadow-[0_10px_24px_-12px_rgba(20,24,40,0.55)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#2a2b31] hover:shadow-[0_14px_28px_-12px_rgba(20,24,40,0.45)] hover:opacity-100 focus-visible:ring-[#1c1d21]/30 active:translate-y-0";

export const authSecondaryBtnClass =
  "h-10 rounded-xl border border-[#e2e7ef] bg-white text-[13px] font-medium text-[#1c1d21] shadow-none transition duration-200 hover:-translate-y-0.5 hover:bg-[#f5f7fb] hover:shadow-[0_10px_22px_-14px_rgba(40,60,100,0.3)] focus-visible:ring-[#1c1d21]/20 active:translate-y-0";

export const authLinkClass =
  "font-semibold text-[#5f3435] transition hover:text-[#3f2223] hover:underline hover:underline-offset-2";
