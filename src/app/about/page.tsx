import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  SiteCard,
  SitePageShell,
} from "@/components/site/site-page-shell";
import { AUTH_ROUTES } from "@/features/auth/constants";
import { SITE_ROUTES } from "@/lib/site-routes";
import { SITE, absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `About ${SITE.name} — production-ready software engineering through projects, AI mentoring, and verifiable certifications.`,
  alternates: { canonical: absoluteUrl(SITE_ROUTES.about) },
};

const PILLARS = [
  {
    title: "Build real systems",
    body: "Practice that mirrors production: architecture, shipping, debugging, and the judgment that separates demos from durable software.",
  },
  {
    title: "Mentor that knows your work",
    body: "AI mentoring grounded in your progress—so guidance stays specific to what you are building, not generic chat.",
  },
  {
    title: "Proof employers can verify",
    body: "Certifications issued after timed skill tests, with public IDs anyone can confirm. Signal over certificates of attendance.",
  },
];

export default function AboutPage() {
  return (
    <SitePageShell wide>
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-white/[0.08] via-white/[0.035] to-transparent px-6 py-12 shadow-[0_28px_80px_rgba(0,0,0,0.35)] sm:px-12 sm:py-16">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#e56b68]/20 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-24 left-10 h-64 w-64 rounded-full bg-[#786cac]/18 blur-3xl"
          />

          <p className="relative text-[12px] font-medium tracking-[0.12em] text-[#f3b7ac]/85 uppercase">
            About {SITE.name}
          </p>
          <h1 className="relative mt-4 max-w-3xl text-[2.4rem] font-semibold tracking-[-0.035em] text-white sm:text-[3.25rem] sm:leading-[1.05]">
            Become the developer companies actually hire.
          </h1>
          <p className="relative mt-5 max-w-2xl text-[15.5px] leading-7 text-white/55 sm:text-[16.5px]">
            {SITE.name} is built for engineers who want production signal—not
            another library of videos. Real projects, contextual AI mentoring,
            and verifiable certifications in one connected system.
          </p>

          <div className="relative mt-8 flex flex-wrap gap-3">
            <Link
              href={AUTH_ROUTES.signup}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-6 text-[13px] font-semibold text-[#181719] transition hover:bg-[#fff8f4]"
            >
              Start building
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href={SITE_ROUTES.manual}
              className="inline-flex h-11 items-center rounded-full bg-white/[0.06] px-6 text-[13px] font-medium text-white/75 transition hover:bg-white/[0.1] hover:text-white"
            >
              Read the manual
            </Link>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {PILLARS.map((pillar) => (
            <SiteCard key={pillar.title} className="sm:p-7">
              <h2 className="text-[17px] font-semibold tracking-tight text-white">
                {pillar.title}
              </h2>
              <p className="mt-3 text-[13.5px] leading-6 text-white/50">
                {pillar.body}
              </p>
            </SiteCard>
          ))}
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <SiteCard className="sm:p-8">
            <h2 className="text-[18px] font-semibold tracking-tight text-white">
              What we optimize for
            </h2>
            <p className="mt-3 text-[14px] leading-7 text-white/55">
              Clean engineering habits. System thinking. The ability to ship
              software people can trust. Paths cover Full Stack Development, AI
              Engineering, System Design, DevOps, and the tools modern teams
              actually use—kept connected so progress compounds on one profile.
            </p>
          </SiteCard>

          <SiteCard className="sm:p-8">
            <h2 className="text-[18px] font-semibold tracking-tight text-white">
              Talk to us
            </h2>
            <p className="mt-3 text-[14px] leading-7 text-white/55">
              Product questions, partnerships, or support—we are here.
            </p>
            <Link
              href={SITE_ROUTES.contact}
              className="mt-5 inline-flex text-[13px] font-medium text-[#f3b7ac] transition hover:text-white"
            >
              Contact →
            </Link>
          </SiteCard>
        </div>
      </div>
    </SitePageShell>
  );
}
