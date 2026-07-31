import type { ReactNode } from "react";
import Link from "next/link";
import { LandingHeader } from "@/components/landing/landing-header";
import { SITE } from "@/lib/site";
import { SITE_ROUTES } from "@/lib/site-routes";
import { cn } from "@/lib/utils";

export function SitePageShell({
  children,
  wide = false,
}: {
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="min-h-screen bg-[#0b0b0d] text-white">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(229,107,104,0.12),transparent_42%),radial-gradient(ellipse_at_bottom_right,rgba(120,108,172,0.1),transparent_40%)]"
      />

      <LandingHeader showNav={false} />

      <main className="relative z-10 pt-[4.75rem]">{children}</main>

      <footer className="relative z-10">
        <div
          className={cn(
            "mx-auto flex flex-wrap items-center justify-between gap-3 px-5 py-8 text-[12px] text-white/35 sm:px-8",
            wide ? "max-w-6xl" : "max-w-5xl"
          )}
        >
          <p>
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-5">
            <Link
              href={SITE_ROUTES.manual}
              className="transition hover:text-white/70"
            >
              Manual
            </Link>
            <Link
              href={SITE_ROUTES.terms}
              className="transition hover:text-white/70"
            >
              Terms
            </Link>
            <Link
              href={SITE_ROUTES.privacy}
              className="transition hover:text-white/70"
            >
              Privacy
            </Link>
            <Link
              href={SITE_ROUTES.contact}
              className="transition hover:text-white/70"
            >
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function SiteCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[1.5rem] bg-gradient-to-b from-white/[0.07] to-white/[0.025] p-6 shadow-[0_22px_60px_rgba(0,0,0,0.32)] backdrop-blur-xl sm:rounded-[1.75rem] sm:p-8 lg:p-10",
        className
      )}
    >
      {children}
    </div>
  );
}

export function SitePageHero({
  eyebrow,
  title,
  description,
  meta,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  meta?: string;
}) {
  return (
    <div className="mb-8 max-w-3xl sm:mb-10">
      {eyebrow ? (
        <p className="text-[12px] font-medium tracking-[0.1em] text-[#f3b7ac]/80 uppercase">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="mt-3 text-[2.15rem] font-semibold tracking-[-0.03em] text-white sm:text-[2.75rem]">
        {title}
      </h1>
      <p className="mt-4 text-[15px] leading-7 text-white/50 sm:text-[16px]">
        {description}
      </p>
      {meta ? (
        <p className="mt-3 text-[12px] text-white/35">{meta}</p>
      ) : null}
    </div>
  );
}
