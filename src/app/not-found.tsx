import Link from "next/link";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { SITE_ROUTES } from "@/lib/site-routes";

export const metadata: Metadata = buildPageMetadata({
  title: "Page Not Found",
  description:
    "This page does not exist. Return to Suprabase to explore the AI learning platform, mentor, and certifications.",
  path: "/404",
  noIndex: true,
});

export default function NotFound() {
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center bg-[#0c0c0e] px-6 text-center text-white">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#f3aaa0]/80">
        404
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
        Page not found
      </h1>
      <p className="mt-3 max-w-md text-[14px] leading-6 text-white/50">
        The page you are looking for may have moved or never existed. Head back
        to the home page to continue.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href={SITE_ROUTES.home}
          className="inline-flex h-11 items-center rounded-full bg-white px-6 text-[13px] font-semibold text-[#181719] transition hover:bg-[#fff8f4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Go to home
        </Link>
        <Link
          href={SITE_ROUTES.faq}
          className="inline-flex h-11 items-center rounded-full border border-white/12 bg-white/[0.06] px-6 text-[13px] font-medium text-white/80 transition hover:bg-white/[0.1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Read FAQ
        </Link>
      </div>
    </main>
  );
}
