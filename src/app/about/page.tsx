import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import {
  SiteCard,
  SitePageShell,
} from "@/components/site/site-page-shell";
import { AUTH_ROUTES } from "@/features/auth/constants";
import { SITE_ROUTES } from "@/lib/site-routes";
import { SITE } from "@/lib/site";
import { buildPageMetadata } from "@/lib/seo";
import {
  breadcrumbSchema,
  graphSchema,
  organizationSchema,
} from "@/lib/seo-schema";

export const metadata: Metadata = buildPageMetadata({
  title: "About — Building Production-Ready Software Engineers",
  description: `About ${SITE.name}: an AI learning platform for full stack development, AI engineering, system design, and DevOps—with real projects, mentoring, and verifiable certifications.`,
  path: SITE_ROUTES.about,
  keywords: [
    "software engineering learning platform",
    "developer career platform",
    "AI learning platform",
    "software engineer training",
  ],
});

const PILLARS = [
  {
    title: "Build real systems",
    body: "Practice that mirrors production: architecture, shipping, debugging, and the judgment that separates demos from durable software.",
    short:
      "Production-style practice—architecture, shipping, and debugging that lasts.",
  },
  {
    title: "Mentor that knows your work",
    body: "AI mentoring grounded in your progress—so guidance stays specific to what you are building, not generic chat.",
    short:
      "AI mentoring grounded in your progress—specific to what you are building.",
  },
  {
    title: "Proof employers can verify",
    body: "Certifications issued after timed skill tests, with public IDs anyone can confirm. Signal over certificates of attendance.",
    short:
      "Timed skill tests with public IDs anyone can confirm—real hiring signal.",
  },
] as const;

export default function AboutPage() {
  return (
    <SitePageShell wide>
      <JsonLd
        id="json-ld-about"
        data={graphSchema([
          organizationSchema(),
          breadcrumbSchema([
            { name: "Home", path: SITE_ROUTES.home },
            { name: "About", path: SITE_ROUTES.about },
          ]),
        ])}
      />
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-16">
        <div className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-white/[0.08] via-white/[0.035] to-transparent px-5 py-10 text-center shadow-[0_28px_80px_rgba(0,0,0,0.35)] sm:px-12 sm:py-16 sm:text-left">
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
          <h1 className="relative mx-auto mt-4 max-w-[18.5rem] text-[1.85rem] font-semibold leading-[1.18] tracking-[-0.035em] text-white sm:mx-0 sm:max-w-3xl sm:text-[3.25rem] sm:leading-[1.05]">
            <span className="sm:hidden">
              <span className="block">Become the developer</span>
              <span className="block">companies actually hire.</span>
            </span>
            <span className="hidden sm:inline">
              Become the developer companies actually hire.
            </span>
          </h1>
          <p className="relative mx-auto mt-4 max-w-[20rem] text-[13.5px] leading-[1.45] text-white/55 sm:mx-0 sm:mt-5 sm:max-w-2xl sm:text-[16.5px] sm:leading-7">
            <span className="sm:hidden">
              Production signal—not video libraries. Real projects, AI
              mentoring, and verifiable certifications in one system.
            </span>
            <span className="hidden sm:inline">
              {SITE.name} is built for engineers who want production signal—not
              another library of videos. Real projects, contextual AI mentoring,
              and verifiable certifications in one connected system.
            </span>
          </p>

          <div className="relative mx-auto mt-7 grid w-full max-w-sm grid-cols-2 gap-2.5 sm:mx-0 sm:mt-8 sm:flex sm:max-w-none sm:flex-wrap sm:gap-3">
            <Link
              href={AUTH_ROUTES.signup}
              className="inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-full bg-white px-3 text-[12.5px] font-semibold text-[#181719] transition hover:bg-[#fff8f4] sm:w-auto sm:gap-2 sm:px-6 sm:text-[13px]"
            >
              Start building
              <ArrowRight className="h-3.5 w-3.5 shrink-0" />
            </Link>
            <Link
              href={SITE_ROUTES.manual}
              className="inline-flex h-11 w-full items-center justify-center rounded-full border border-white/12 bg-white/[0.06] px-3 text-[12.5px] font-semibold text-white/80 transition hover:bg-white/[0.1] hover:text-white sm:w-auto sm:border-0 sm:px-6 sm:text-[13px] sm:font-medium sm:text-white/75"
            >
              Read the manual
            </Link>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {PILLARS.map((pillar) => (
            <SiteCard key={pillar.title} className="sm:p-7 max-md:text-center">
              <h2 className="text-[16px] font-semibold tracking-tight text-white sm:text-[17px]">
                {pillar.title}
              </h2>
              <p className="mt-2.5 text-[13px] leading-6 text-white/50 sm:mt-3 sm:text-[13.5px]">
                <span className="sm:hidden">{pillar.short}</span>
                <span className="hidden sm:inline">{pillar.body}</span>
              </p>
            </SiteCard>
          ))}
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <SiteCard className="sm:p-8 max-md:text-center">
            <h2 className="text-[17px] font-semibold tracking-tight text-white sm:text-[18px]">
              What we optimize for
            </h2>
            <p className="mt-2.5 text-[13.5px] leading-6 text-white/55 sm:mt-3 sm:text-[14px] sm:leading-7">
              <span className="sm:hidden">
                Clean habits, system thinking, and shipping software people
                trust—Full Stack, AI, System Design, and DevOps on one profile.
              </span>
              <span className="hidden sm:inline">
                Clean engineering habits. System thinking. The ability to ship
                software people can trust. Paths cover Full Stack Development, AI
                Engineering, System Design, DevOps, and the tools modern teams
                actually use—kept connected so progress compounds on one profile.
              </span>
            </p>
          </SiteCard>

          <SiteCard className="flex flex-col items-center text-center sm:items-start sm:p-8 sm:text-left">
            <h2 className="text-[17px] font-semibold tracking-tight text-white sm:text-[18px]">
              Talk to us
            </h2>
            <p className="mt-2.5 max-w-[16rem] text-[13.5px] leading-6 text-white/55 sm:mt-3 sm:max-w-none sm:text-[14px] sm:leading-7">
              Product questions, partnerships, or support—we are here.
            </p>
            <Link
              href={SITE_ROUTES.contact}
              className="mt-5 inline-flex h-10 items-center justify-center rounded-full bg-white px-5 text-[12.5px] font-semibold text-[#181719] transition hover:bg-[#fff8f4] sm:h-11 sm:px-6 sm:text-[13px]"
            >
              Contact
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </SiteCard>
        </div>
      </div>
    </SitePageShell>
  );
}
