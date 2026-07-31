import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { FAQ_ITEMS } from "@/components/landing/landing-faq";
import {
  SiteCard,
  SitePageHero,
  SitePageShell,
} from "@/components/site/site-page-shell";
import { AUTH_ROUTES } from "@/features/auth/constants";
import { SITE_ROUTES } from "@/lib/site-routes";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers about Suprabase, learning paths, AI Engineering, and certifications.",
  alternates: { canonical: absoluteUrl(SITE_ROUTES.faq) },
};

export default function FaqPage() {
  return (
    <SitePageShell wide>
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <SitePageHero
          eyebrow="FAQ"
          title="Software engineering questions, answered"
          description="Clear answers about the platform, how learning works, and what certifications mean."
        />

        <div className="grid gap-3">
          {FAQ_ITEMS.map((item) => (
            <SiteCard key={item.question} className="p-0 sm:p-0 lg:p-0">
              <details className="group">
                <summary className="flex cursor-pointer list-none items-center gap-4 px-6 py-5 text-left sm:px-7 [&::-webkit-details-marker]:hidden">
                  <h2 className="flex-1 text-[14.5px] font-medium text-white/90">
                    {item.question}
                  </h2>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.05] text-white/45 transition group-open:rotate-45 group-open:bg-[#e56b68]/15 group-open:text-[#f3aaa0]">
                    <Plus className="h-3.5 w-3.5" />
                  </span>
                </summary>
                <p className="px-6 pb-6 pr-14 text-[13.5px] leading-6 text-white/50 sm:px-7">
                  {item.answer}
                </p>
              </details>
            </SiteCard>
          ))}
        </div>

        <SiteCard className="mt-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="text-[13.5px] text-white/50">
            Still need help? Read the{" "}
            <Link
              href={SITE_ROUTES.manual}
              className="text-[#f3b7ac] underline underline-offset-4 hover:text-white"
            >
              Manual
            </Link>{" "}
            or{" "}
            <Link
              href={SITE_ROUTES.contact}
              className="text-[#f3b7ac] underline underline-offset-4 hover:text-white"
            >
              contact us
            </Link>
            .
          </p>
          <Link
            href={AUTH_ROUTES.signup}
            className="inline-flex h-10 items-center rounded-full bg-white px-5 text-[12.5px] font-semibold text-[#181719] transition hover:bg-[#fff8f4]"
          >
            Get started
          </Link>
        </SiteCard>
      </div>
    </SitePageShell>
  );
}
