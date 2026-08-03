"use client";

import Link from "next/link";
import { AuthLeftAurora } from "@/components/auth/auth-left-aurora";
import {
  LOGIN_PANEL,
  RESERVE_PANEL,
  SIGNUP_PANEL,
  type AuthPanelCopy,
} from "@/components/auth/auth-panel-copy";
import { SupraBaseMark } from "@/components/brand/supra-learn-logo";
import { AUTH_ROUTES } from "@/features/auth/constants";
import { SITE_ROUTES } from "@/lib/site-routes";
import { cn } from "@/lib/utils";

const BRAND_NAME = "Suprabase";

interface AuthShellProps {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  /** Distinct left-panel copy for reserve / signup / sign-in. */
  panelVariant?: "reserve" | "signup" | "login";
  panelTitle?: string;
  panelPoints?: AuthPanelCopy["points"];
}

const PANEL_BY_VARIANT = {
  reserve: RESERVE_PANEL,
  signup: SIGNUP_PANEL,
  login: LOGIN_PANEL,
} as const;

/**
 * Shared visual chrome for authentication screens.
 * Split marketing + form layout on a public-page brand gradient.
 */
export function AuthShell({
  title,
  description,
  children,
  footer,
  panelVariant = "signup",
  panelTitle,
  panelPoints,
}: AuthShellProps) {
  const panel = PANEL_BY_VARIANT[panelVariant];
  const resolvedTitle = panelTitle ?? panel.title;
  const points = panelPoints ?? panel.points;

  return (
    <div className="relative flex min-h-svh items-stretch overflow-x-hidden overflow-y-auto bg-[#0c0d0e] p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))] sm:p-4 lg:p-5">
      {/* Brand aurora — same family as the marketing landing */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 12% 20%, rgba(229,107,104,0.34), transparent 55%), radial-gradient(ellipse 55% 50% at 88% 15%, rgba(233,158,214,0.22), transparent 52%), radial-gradient(ellipse 60% 55% at 70% 85%, rgba(120,108,172,0.28), transparent 55%), radial-gradient(ellipse 50% 40% at 20% 90%, rgba(241,163,121,0.16), transparent 50%), #0c0d0e",
        }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl min-h-[calc(100svh-1.5rem)] flex-1 flex-col rounded-[1.5rem] bg-[#f7f4f1] shadow-[0_40px_100px_-40px_rgba(0,0,0,0.65)] sm:min-h-[calc(100svh-2rem)] sm:rounded-[1.75rem] lg:min-h-[min(100%,44rem)] lg:flex-row lg:overflow-hidden lg:rounded-[2rem]">
        {/* Left marketing panel — soft aurora under readable dark type */}
        <aside className="relative hidden min-h-0 w-[48%] flex-col justify-between overflow-hidden bg-[#fbf9f7] p-8 lg:flex xl:w-[52%] xl:p-10">
          <AuthLeftAurora intensity="soft" />

          <Link
            href={AUTH_ROUTES.public}
            className="relative z-10 inline-flex items-center gap-2.5 text-[15px] font-semibold tracking-tight text-[#14151a] transition hover:opacity-80"
          >
            <SupraBaseMark className="h-8 w-8" />
            {BRAND_NAME}
          </Link>

          <div className="relative z-10 max-w-md">
            <h2 className="text-[2rem] font-semibold leading-[1.15] tracking-[-0.035em] text-[#14151a] xl:text-[2.35rem]">
              {resolvedTitle}
            </h2>
            <ul className="mt-8 space-y-5">
              {points.map((point) => {
                const Icon = point.icon;
                return (
                  <li key={point.title} className="flex gap-3.5">
                    <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/70 text-[#5f3435] shadow-[0_8px_18px_-12px_rgba(95,52,53,0.3)] backdrop-blur-sm">
                      <Icon className="h-4 w-4" strokeWidth={2} />
                    </span>
                    <div>
                      <p className="text-[14px] font-semibold text-[#14151a]">
                        {point.title}
                      </p>
                      <p className="mt-1 text-[13px] leading-5 text-[#3f4550]">
                        {point.body}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="relative z-10 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-[#5a616e]">
            <Link
              href={SITE_ROUTES.terms}
              className="transition hover:text-[#14151a]"
            >
              Terms
            </Link>
            <Link
              href={SITE_ROUTES.privacy}
              className="transition hover:text-[#14151a]"
            >
              Privacy
            </Link>
            <Link
              href={SITE_ROUTES.contact}
              className="transition hover:text-[#14151a]"
            >
              Contact
            </Link>
          </div>
        </aside>

        {/* Right form column — fuller aurora behind the card */}
        <section className="relative flex min-h-0 flex-1 flex-col bg-[#f4f1ee] px-4 py-4 sm:px-6 sm:py-5 lg:overflow-hidden lg:px-8 lg:py-6">
          <AuthLeftAurora intensity="full" />

          <div className="relative z-10 flex min-h-0 flex-1 flex-col">
            {/* Brand + card centered as one stack (logo sits above the card) */}
            <div className="flex min-h-0 flex-1 items-center justify-center py-2">
              <div className="flex w-full max-w-[400px] flex-col items-center max-md:max-w-[min(100%,22.5rem)]">
                <Link
                  href={AUTH_ROUTES.public}
                  className="mb-3.5 inline-flex items-center gap-2 text-[15px] font-semibold tracking-[-0.02em] text-[#1c1d21] lg:hidden"
                >
                  <SupraBaseMark className="h-7 w-7" />
                  {BRAND_NAME}
                </Link>

                <div
                  className={cn(
                    "relative z-10 flex w-full flex-col overflow-visible rounded-[1.35rem] bg-white/95 px-5 py-5 shadow-[0_28px_70px_-30px_rgba(40,30,40,0.4)] backdrop-blur-sm sm:px-6 sm:py-6"
                  )}
                >
                  <div className="mb-5 shrink-0 space-y-2 pt-1 text-center sm:mb-6 sm:pt-1.5">
                    <h1 className="text-[1.45rem] font-semibold tracking-[-0.03em] text-[#14151a] sm:text-[1.6rem]">
                      {title}
                    </h1>
                    <p className="text-[13px] leading-5 text-[#4b5160]">
                      {description}
                    </p>
                  </div>

                  <div className="relative z-20 min-w-0 overflow-visible">
                    {children}
                  </div>

                  {footer ? (
                    <p className="mt-4 shrink-0 text-center text-[13px] font-normal text-[#14151a]">
                      {footer}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-1 flex shrink-0 flex-wrap items-center justify-center gap-x-4 gap-y-1 pb-0.5 text-[11px] text-[#8b93a3] lg:hidden">
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
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

/** Shared light-theme classes for auth primary CTAs. */
export const authPrimaryBtnClass =
  "h-10 rounded-xl bg-[#5f3435] text-[13px] font-semibold text-white shadow-[0_12px_28px_-14px_rgba(95,52,53,0.55)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#6d3c3d] hover:shadow-[0_16px_32px_-14px_rgba(95,52,53,0.5)] hover:opacity-100 focus-visible:ring-[#5f3435]/30 active:translate-y-0";

export const authSecondaryBtnClass =
  "h-10 rounded-xl border-0 bg-[#f0ece9] text-[13px] font-medium text-[#1c1d21] shadow-none transition duration-200 hover:-translate-y-0.5 hover:bg-[#e8e3df] hover:shadow-[0_10px_22px_-14px_rgba(40,60,100,0.25)] focus-visible:ring-[#5f3435]/20 active:translate-y-0";

export const authLinkClass =
  "font-medium text-[#5f3435] transition hover:text-[#3f2223] hover:underline hover:underline-offset-2";
