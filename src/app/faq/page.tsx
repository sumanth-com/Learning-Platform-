import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { FAQ_ITEMS } from "@/components/landing/landing-faq";
import { TrackPageEvent } from "@/components/analytics/track-page-event";
import { JsonLd } from "@/components/seo/json-ld";
import {
  SiteCard,
  SitePageHero,
  SitePageShell,
} from "@/components/site/site-page-shell";
import { AUTH_ROUTES } from "@/features/auth/constants";
import { ANALYTICS_EVENTS } from "@/lib/analytics";
import { SITE_ROUTES } from "@/lib/site-routes";
import { buildPageMetadata } from "@/lib/seo";
import {
  breadcrumbSchema,
  faqPageSchema,
  graphSchema,
  organizationSchema,
} from "@/lib/seo-schema";

export const metadata: Metadata = buildPageMetadata({
  title: "FAQ — Software Engineering Learning Platform",
  description:
    "Answers about Suprabase: learning paths, AI mentoring, full stack and AI courses, practice projects, and verifiable developer certifications.",
  path: SITE_ROUTES.faq,
  keywords: [
    "AI learning platform FAQ",
    "developer certification",
    "full stack learning platform",
    "AI mentor",
    "software engineer training",
  ],
});

export default function FaqPage() {
  return (
    <SitePageShell wide>
      <TrackPageEvent event={ANALYTICS_EVENTS.faq_viewed} />
      <JsonLd
        id="json-ld-faq"
        data={graphSchema([
          organizationSchema(),
          faqPageSchema(FAQ_ITEMS),
          breadcrumbSchema([
            { name: "Home", path: SITE_ROUTES.home },
            { name: "FAQ", path: SITE_ROUTES.faq },
          ]),
        ])}
      />
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
                  <span
                    aria-hidden
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.05] text-white/45 transition group-open:rotate-45 group-open:bg-[#e56b68]/15 group-open:text-[#f3aaa0]"
                  >
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
            className="inline-flex h-10 items-center rounded-full bg-white px-5 text-[12.5px] font-semibold text-[#181719] transition hover:bg-[#fff8f4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Request access
          </Link>
        </SiteCard>
      </div>
    </SitePageShell>
  );
}
