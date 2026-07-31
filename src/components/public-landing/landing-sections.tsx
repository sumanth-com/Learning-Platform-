"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  Check,
  Code2,
  Route,
  ShieldCheck,
  X,
} from "lucide-react";
import { AUTH_ROUTES } from "@/features/auth/constants";
import { cn } from "@/lib/utils";
import { BrowserFrame } from "./browser-frame";
import {
  OUTCOMES,
  PRICING_COMPARISON,
  PRICING_PLANS,
  STATS,
  TECH_LOGOS,
} from "./content";
import { DemoFrame } from "./feature-demos";
import {
  useDemoClock,
  useInViewOnce,
  usePrefersReducedMotion,
} from "./demo-hooks";
import type { TourTabId } from "./content";
import devforgeDark from "@/assets/DevforgeDark.png";

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#f3aaa0]">
      {children}
    </p>
  );
}

function FeatureStory({
  id,
  eyebrow,
  title,
  body,
  kind,
  reverse,
  visual,
}: {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  kind: TourTabId;
  reverse?: boolean;
  visual?: React.ReactNode;
}) {
  const { ref, inView } = useInViewOnce(0.3);
  const reduced = usePrefersReducedMotion();
  const { progress } = useDemoClock({
    durationMs: 22000,
    active: inView,
    reducedMotion: reduced,
  });

  return (
    <section
      id={id}
      ref={ref}
      className="relative mx-auto grid w-full max-w-6xl items-center gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-2 lg:gap-14"
    >
      <div className={cn(reverse && "lg:order-2")}>
        <SectionEyebrow>{eyebrow}</SectionEyebrow>
        <h2 className="mt-3 max-w-lg text-balance text-[1.85rem] font-medium tracking-[-0.04em] text-white sm:text-[2.35rem]">
          {title}
        </h2>
        <p className="mt-4 max-w-md text-[14px] leading-relaxed text-white/55 sm:text-[15px]">
          {body}
        </p>
      </div>
      <div className={cn(reverse && "lg:order-1")}>
        {visual ?? (
          <BrowserFrame url={`app.suprabase.dev/${kind}`}>
            <DemoFrame kind={kind} progress={progress} />
          </BrowserFrame>
        )}
      </div>
    </section>
  );
}

export function StatsBand() {
  return (
    <section
      id="stats"
      className="relative border-y border-white/8 bg-black/20 py-14"
    >
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
          Built for serious learners
        </p>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-5 text-center"
            >
              <p className="text-[1.6rem] font-medium tracking-tight text-white sm:text-[1.85rem]">
                {stat.value}
              </p>
              <p className="mt-1.5 text-[12px] text-white/45">{stat.label}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-5 opacity-70">
          {TECH_LOGOS.map((logo) => (
            <Image
              key={logo.src}
              src={logo.src}
              alt={logo.alt}
              width={88}
              height={24}
              className="h-6 w-auto brightness-0 invert"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export function FeatureStories() {
  return (
    <div id="features">
      <FeatureStory
        id="paths"
        eyebrow="Learning paths"
        title="A roadmap that unlocks as you grow"
        body="Progress increases, lessons unlock, assignments complete, and XP compounds — so you always know what to do next."
        kind="roadmap"
      />
      <FeatureStory
        id="mentor"
        eyebrow="AI Mentor"
        title="Ask anything. Watch the answer stream."
        body="Debug stuck code, explain concepts, review diffs, and build features with a mentor that responds in real time."
        kind="mentor"
        reverse
      />
      <FeatureStory
        id="projects"
        eyebrow="Projects"
        title="Ship work that looks like the job"
        body="Requirements, code, live preview, and submission — the same loop you’ll use on a real engineering team."
        kind="projects"
      />
      <FeatureStory
        id="hub"
        eyebrow="Developer Hub"
        title="Guides deep enough to bookmark"
        body="Open architecture notes, scroll diagrams, save bookmarks, and export PDFs when you need a reference later."
        kind="hub"
        reverse
        visual={
          <div className="relative overflow-hidden rounded-[1.35rem] border border-white/10 bg-[#121214] shadow-[0_40px_100px_-40px_rgba(0,0,0,0.85)]">
            <div className="relative h-56 sm:h-72">
              <Image
                src={devforgeDark}
                alt="Developer Hub artwork"
                fill
                className="object-cover object-center opacity-90"
                sizes="(max-width: 1024px) 100vw, 520px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0f] via-transparent to-transparent" />
            </div>
            <div className="p-1">
              <DemoFrame kind="hub" progress={0.75} />
            </div>
          </div>
        }
      />
      <FeatureStory
        id="certs"
        eyebrow="Certifications"
        title="Prove it. Download it. Share it."
        body="Take the assessment, pass, generate a verified certificate, download the PDF, and share your credential with a unique ID."
        kind="certs"
      />
    </div>
  );
}

export function OutcomesWall() {
  return (
    <section
      id="outcomes"
      className="relative mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-28"
    >
      <div className="mx-auto max-w-2xl text-center">
        <SectionEyebrow>Real outcomes</SectionEyebrow>
        <h2 className="mt-3 text-balance text-[2rem] font-medium tracking-[-0.04em] text-white sm:text-[2.6rem]">
          Artifacts you can show — not empty testimonials
        </h2>
        <p className="mt-4 text-[14px] leading-relaxed text-white/55">
          Leave with a portfolio of projects, certificates, skills, and career
          readiness signals hiring managers understand.
        </p>
      </div>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {OUTCOMES.map((item) => (
          <article
            key={item.title}
            className="rounded-[1.35rem] border border-white/8 bg-white/[0.03] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e56b68]/25 bg-[#e56b68]/10 text-[#f3aaa0]">
              {item.title === "Certificates" ? (
                <ShieldCheck className="h-4 w-4" />
              ) : item.title === "Projects" ? (
                <Code2 className="h-4 w-4" />
              ) : item.title === "Skills map" ? (
                <Route className="h-4 w-4" />
              ) : (
                <BrainCircuit className="h-4 w-4" />
              )}
            </div>
            <h3 className="mt-4 text-[16px] font-medium text-white">
              {item.title}
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-white/50">
              {item.detail}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function PricingSection() {
  return (
    <section
      id="pricing"
      className="relative mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-28"
    >
      <div className="mx-auto max-w-2xl text-center">
        <SectionEyebrow>Pricing</SectionEyebrow>
        <h2 className="mt-3 text-balance text-[2rem] font-medium tracking-[-0.04em] text-white sm:text-[2.6rem]">
          Simple plans. Clear preview.
        </h2>
        <p className="mt-4 text-[14px] leading-relaxed text-white/55">
          Free is available today. Pro and Teams pricing is a marketing preview —
          checkout is not enabled yet.
        </p>
      </div>

      <div className="mt-12 grid gap-4 lg:grid-cols-3">
        {PRICING_PLANS.map((plan) => (
          <article
            key={plan.id}
            className={cn(
              "relative flex flex-col rounded-[1.5rem] border p-6",
              plan.featured
                ? "border-[#e56b68]/45 bg-gradient-to-b from-[#2a1f22] to-[#151516] shadow-[0_30px_80px_-40px_rgba(229,107,104,0.55)]"
                : "border-white/8 bg-white/[0.03]"
            )}
          >
            {plan.badge ? (
              <span className="absolute -top-3 left-6 rounded-full bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#181719]">
                {plan.badge}
              </span>
            ) : null}
            <h3 className="text-[18px] font-medium text-white">{plan.name}</h3>
            <p className="mt-2 text-[13px] leading-relaxed text-white/50">
              {plan.description}
            </p>
            <p className="mt-6 flex items-end gap-1">
              <span className="text-[2.4rem] font-medium tracking-tight text-white">
                {plan.price}
              </span>
              <span className="pb-2 text-[12px] text-white/40">{plan.period}</span>
            </p>
            <ul className="mt-6 space-y-2.5 text-[13px] text-white/65">
              {plan.features.map((feature) => (
                <li key={feature} className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#78d7a6]" />
                  {feature}
                </li>
              ))}
            </ul>
            {plan.disabled ? (
              <button
                type="button"
                disabled
                className="mt-8 inline-flex h-11 cursor-not-allowed items-center justify-center rounded-full border border-white/10 bg-white/5 text-[13px] font-semibold text-white/40"
              >
                {plan.cta}
              </button>
            ) : (
              <Link
                href={AUTH_ROUTES.signup}
                className="mt-8 inline-flex h-11 items-center justify-center rounded-full bg-white text-[13px] font-semibold text-[#181719] transition hover:bg-[#fff8f4]"
              >
                {plan.cta}
              </Link>
            )}
          </article>
        ))}
      </div>

      <div className="mt-12 overflow-x-auto rounded-[1.35rem] border border-white/8">
        <table className="min-w-full text-left text-[13px]">
          <thead className="bg-white/[0.03] text-white/45">
            <tr>
              <th className="px-4 py-3 font-medium">Feature</th>
              <th className="px-4 py-3 font-medium">Free</th>
              <th className="px-4 py-3 font-medium">Pro</th>
              <th className="px-4 py-3 font-medium">Teams</th>
            </tr>
          </thead>
          <tbody>
            {PRICING_COMPARISON.map((row) => (
              <tr key={row.feature} className="border-t border-white/8">
                <td className="px-4 py-3 text-white/75">{row.feature}</td>
                {[row.free, row.pro, row.teams].map((cell, i) => (
                  <td key={i} className="px-4 py-3 text-white/55">
                    {typeof cell === "boolean" ? (
                      cell ? (
                        <Check className="h-4 w-4 text-[#78d7a6]" />
                      ) : (
                        <X className="h-4 w-4 text-white/25" />
                      )
                    ) : (
                      cell
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section className="relative mx-auto w-full max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
      <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#2c2225] via-[#1a1618] to-[#101011] px-6 py-14 text-center shadow-[0_40px_100px_-50px_rgba(229,107,104,0.55)] sm:px-12">
        <h2 className="text-balance text-[2rem] font-medium tracking-[-0.045em] text-white sm:text-[2.8rem]">
          Start building today
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-[14px] leading-relaxed text-white/55 sm:text-[15px]">
          Create your account, pick a path, and ship your first project with an
          AI mentor beside you.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={AUTH_ROUTES.signup}
            className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-[13px] font-semibold text-[#181719] transition hover:-translate-y-0.5 hover:bg-[#fff8f4]"
          >
            Get started free
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href={AUTH_ROUTES.login}
            className="inline-flex h-12 items-center rounded-full border border-white/12 px-6 text-[13px] font-medium text-white/75 transition hover:bg-white/5 hover:text-white"
          >
            I already have an account
          </Link>
        </div>
      </div>
    </section>
  );
}

export function LandingFooter() {
  return (
    <footer className="border-t border-white/8 bg-black/30">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-12 sm:px-8 md:flex-row md:justify-between">
        <div>
          <p className="text-[15px] font-semibold text-white">SupraBase</p>
          <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-white/45">
            Learn. Build. Ship. An enterprise-ready learning platform for Full
            Stack and AI developers.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 text-[13px] sm:grid-cols-3">
          <div className="space-y-2.5">
            <p className="font-medium text-white">Product</p>
            <a href="#tour" className="block text-white/45 hover:text-white">
              Tour
            </a>
            <a href="#paths" className="block text-white/45 hover:text-white">
              Paths
            </a>
            <a href="#pricing" className="block text-white/45 hover:text-white">
              Pricing
            </a>
          </div>
          <div className="space-y-2.5">
            <p className="font-medium text-white">Account</p>
            <Link href={AUTH_ROUTES.signup} className="block text-white/45 hover:text-white">
              Sign up
            </Link>
            <Link href={AUTH_ROUTES.login} className="block text-white/45 hover:text-white">
              Sign in
            </Link>
          </div>
          <div className="space-y-2.5">
            <p className="font-medium text-white">Support</p>
            <a href="#faq" className="block text-white/45 hover:text-white">
              FAQ
            </a>
            <a
              href="mailto:support.suprabase@gmail.com"
              className="block text-white/45 hover:text-white"
            >
              Email support
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/8 py-5 text-center text-[12px] text-white/35">
        © {new Date().getFullYear()} SupraBase. All rights reserved.
      </div>
    </footer>
  );
}
