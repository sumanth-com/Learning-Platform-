import type { Metadata } from "next";
import Link from "next/link";
import {
  Award,
  BookOpen,
  Brain,
  Code2,
  Layers,
  Rocket,
} from "lucide-react";
import {
  SiteCard,
  SitePageHero,
  SitePageShell,
} from "@/components/site/site-page-shell";
import { JsonLd } from "@/components/seo/json-ld";
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
  title: "Manual — How to Use the Learning Platform",
  description: `How to use ${SITE.name}: learning paths, browser practice, AI mentor, projects, and developer certifications—step-by-step workflows.`,
  path: SITE_ROUTES.manual,
  keywords: [
    "programming learning platform",
    "developer roadmap",
    "AI mentor",
    "coding practice",
  ],
});

const FEATURES = [
  {
    icon: BookOpen,
    title: "Learning paths",
    how: "Open your dashboard, pick a path, and move module by module. Track progress on one profile so fundamentals and advanced work stay connected.",
    href: SITE_ROUTES.platform,
  },
  {
    icon: Code2,
    title: "Browser practice",
    how: "Run challenges and practice environments in the browser. Ship small increments, read feedback, and iterate without leaving the platform.",
    href: SITE_ROUTES.journey,
  },
  {
    icon: Brain,
    title: "AI Mentor",
    how: "Ask Supra to explain, debug, build, or review. Mentoring uses your learning context so answers stay relevant to what you are working on.",
    href: SITE_ROUTES.mentor,
  },
  {
    icon: Award,
    title: "Certifications",
    how: "Prepare, take a timed skill test, and earn a credential with a public verification ID. Share the link or QR so employers can confirm it.",
    href: SITE_ROUTES.certifications,
  },
  {
    icon: Layers,
    title: "Technology stack",
    how: "Follow paths across React, Next.js, TypeScript, databases, AI tooling, and more. New stacks appear as they ship—check Stack for what is live.",
    href: SITE_ROUTES.stack,
  },
  {
    icon: Rocket,
    title: "Projects & shipping",
    how: "Treat projects like production work: structure, security, and polish. Use Mentor when you get stuck, then certify skills you can prove.",
    href: SITE_ROUTES.journey,
  },
];

const STEPS = [
  {
    step: "01",
    title: "Create an account",
    body: "Reserve your seat, get invited, activate your account, and land in the portal dashboard.",
  },
  {
    step: "02",
    title: "Choose what to build",
    body: "Start a learning path or jump into practice. Progress stays on your profile.",
  },
  {
    step: "03",
    title: "Use Mentor when stuck",
    body: "Ask for explain, debug, build, or review help tied to your current work.",
  },
  {
    step: "04",
    title: "Certify and share",
    body: "Pass a timed test, get a verifiable certificate, and share the public link.",
  },
];

export default function ManualPage() {
  return (
    <SitePageShell wide>
      <JsonLd
        id="json-ld-manual"
        data={graphSchema([
          organizationSchema(),
          breadcrumbSchema([
            { name: "Home", path: SITE_ROUTES.home },
            { name: "Manual", path: SITE_ROUTES.manual },
          ]),
        ])}
      />
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <SitePageHero
          eyebrow="Product manual"
          title="How to use Suprabase"
          description="A clear guide to the features that matter—what they do, how to use them, and where to go next."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((item) => (
            <SiteCard key={item.step} className="sm:p-6">
              <p className="text-[12px] font-semibold tracking-[0.08em] text-[#f3b7ac]/80">
                {item.step}
              </p>
              <h2 className="mt-2 text-[15px] font-semibold tracking-tight text-white">
                {item.title}
              </h2>
              <p className="mt-2 text-[13px] leading-6 text-white/50">
                {item.body}
              </p>
            </SiteCard>
          ))}
        </div>

        <h2 className="mt-12 text-[18px] font-semibold tracking-tight text-white">
          Features
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <SiteCard
                key={feature.title}
                className="flex h-full flex-col gap-5 sm:p-7"
              >
                <div className="flex items-start gap-4">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-[#f3b7ac]">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-[16px] font-semibold tracking-tight text-white">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-[13.5px] leading-6 text-white/50">
                      {feature.how}
                    </p>
                  </div>
                </div>
                <Link
                  href={feature.href}
                  className="mt-auto inline-flex h-9 w-fit items-center rounded-full bg-white/[0.07] px-4 text-[12.5px] font-medium text-[#f3b7ac] transition hover:bg-white/[0.11] hover:text-white"
                >
                  Learn more →
                </Link>
              </SiteCard>
            );
          })}
        </div>

        <SiteCard className="mt-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center sm:p-8">
          <div>
            <h2 className="text-[17px] font-semibold text-white">
              Ready to put it into practice?
            </h2>
            <p className="mt-1.5 text-[13.5px] text-white/45">
              Create an account and start with a path that matches your level.
            </p>
          </div>
          <Link
            href={AUTH_ROUTES.signup}
            className="inline-flex h-11 items-center rounded-full bg-white px-6 text-[13px] font-semibold text-[#181719] transition hover:bg-[#fff8f4]"
          >
            Get started
          </Link>
        </SiteCard>
      </div>
    </SitePageShell>
  );
}
