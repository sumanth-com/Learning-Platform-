"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Braces,
  ChevronDown,
  Clock,
  Layers,
  Route,
} from "lucide-react";
import { CertTechLogo } from "@/components/certifications/cert-tech-logos";
import { CertificateSheet } from "@/components/certifications/certificate-document";
import { categoryMeta } from "@/features/certifications/data/catalog";
import { CERT_RETRY_COOLDOWN_HOURS } from "@/features/certifications/lib/retry-cooldown";
import type { Certification } from "@/features/certifications/types";
import { cn } from "@/lib/utils";

const COMPANIES = [
  "Stripe",
  "Notion",
  "Vercel",
  "Shopify",
  "Atlassian",
  "Cloudflare",
];

const FAQS: { q: string; a: (c: Certification) => string }[] = [
  {
    q: "What is the SupraBase Certification Test?",
    a: (c) =>
      `A timed coding assessment for ${c.shortTitle}. You solve real problems in an online editor with test cases that run against your code.`,
  },
  {
    q: "What are the different types of certification tests?",
    a: () =>
      "Each technology offers Basic and Intermediate tracks. Basic focuses on core patterns; Intermediate adds harder algorithms and longer sessions.",
  },
  {
    q: "What is the subject matter tested during the test?",
    a: (c) => {
      const topics = c.questions
        .slice(0, 3)
        .map((q) => q.title)
        .join(", ");
      return `You’ll face coding problems covering topics like ${topics}${c.questions.length > 3 ? ", and more" : ""}.`;
    },
  },
  {
    q: "What happens if I fail the test?",
    a: () =>
      `If you don’t pass, you’ll wait ${CERT_RETRY_COOLDOWN_HOURS} hours before you can retest the same certification.`,
  },
  {
    q: "Why should I take this test?",
    a: () =>
      "A verified SupraBase certificate signals interview-ready coding skill — share it on LinkedIn, your resume, or with hiring teams.",
  },
  {
    q: "What's the duration of the test?",
    a: (c) =>
      `You’ll have ${c.durationMinutes} minutes once the timer starts. It cannot be paused.`,
  },
  {
    q: "How many questions are in the test?",
    a: (c) =>
      `This assessment has ${c.questionCount} coding questions. You can move between them from the lobby.`,
  },
];

export function CertLandingPage({
  certification,
  locked,
  lockedReason,
  onStart,
}: {
  certification: Certification;
  locked?: boolean;
  lockedReason?: string;
  onStart: () => void;
}) {
  const meta = categoryMeta(certification.categoryId);
  const topicSample =
    certification.questions[0]?.title ?? certification.categoryLabel;
  const hours =
    certification.durationMinutes >= 60
      ? `${Math.round(certification.durationMinutes / 60 * 10) / 10} hr`
      : `${certification.durationMinutes} min`;

  const highlights = [
    {
      icon: Clock,
      label: `Complete a ${hours} assessment`,
    },
    {
      icon: Layers,
      label: `Solve ${certification.questionCount} questions`,
    },
    {
      icon: Route,
      label: `Covers topics like ${topicSample}`,
    },
    {
      icon: Braces,
      label: "Earn a SupraBase certificate",
    },
  ];

  return (
    <div className="h-full min-h-0 overflow-y-auto bg-background text-foreground">
      {/* Hero */}
      <section className="relative flex min-h-[72vh] flex-col items-center justify-center px-6 pb-16 pt-20 text-center sm:min-h-[78vh]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 55% 45% at 50% 35%, ${meta.accent}18, transparent 70%)`,
          }}
        />
        <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-card p-3 shadow-sm">
          <CertTechLogo id={certification.categoryId} size={40} />
        </div>
        <p className="relative text-[15px] text-muted-foreground">
          Get certified in
        </p>
        <h1 className="relative mt-2 max-w-3xl text-[36px] font-semibold tracking-tight text-foreground sm:text-[48px]">
          {certification.shortTitle}
        </h1>
        <p className="relative mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
          SupraBase certifications help you stand out when applying to jobs
          and are trusted as a signal of real engineering skill.
        </p>

        {locked ? (
          <p className="relative mt-8 max-w-md rounded-xl border border-border bg-muted/70 px-4 py-3 text-[13px] text-foreground">
            {lockedReason}
          </p>
        ) : (
          <button
            type="button"
            onClick={onStart}
            className="relative mt-8 rounded-md bg-primary px-9 py-3 text-[15px] font-bold text-primary-foreground transition hover:bg-primary/90"
          >
            Get Certified
          </button>
        )}

        <p className="relative mt-5 text-[13px] text-muted-foreground">
          Join developers building a verified skill signal on SupraBase
        </p>
        <Link
          href="/certifications"
          className="relative mt-8 text-[13px] text-muted-foreground transition hover:text-foreground"
        >
          ← Back to certifications
        </Link>
      </section>

      {/* Highlights card */}
      <section className="mx-auto w-full max-w-5xl px-4 sm:px-6">
        <div className="grid rounded-2xl bg-card sm:grid-cols-4">
          {highlights.map((h, i) => (
            <div
              key={h.label}
              className={cn(
                "flex flex-col items-center gap-3 px-5 py-8 text-center",
                i > 0 && "border-t border-border sm:border-t-0 sm:border-l"
              )}
            >
              <h.icon
                className="h-6 w-6 text-muted-foreground"
                strokeWidth={1.5}
              />
              <p className="max-w-[11rem] text-[13px] leading-snug text-foreground">
                {h.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Companies */}
      <section className="mx-auto mt-20 w-full max-w-5xl px-4 text-center sm:px-6">
        <p className="text-[15px] text-muted-foreground">
          SupraBase certified developers work toward roles at
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
          {COMPANIES.map((name) => (
            <span
              key={name}
              className="select-none text-[18px] font-semibold tracking-tight text-foreground/85 sm:text-[20px]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {name}
            </span>
          ))}
        </div>
      </section>

      {/* Certificate preview */}
      <section className="mx-auto mt-24 w-full max-w-5xl px-4 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-14">
          <div>
            <h2 className="text-[28px] font-semibold tracking-tight sm:text-[32px]">
              Get your own certificate
            </h2>
            <p className="mt-4 max-w-md text-[14px] leading-relaxed text-muted-foreground">
              Show it on LinkedIn, your resume, or portfolio. A clean verify
              link proves you passed — useful for hiring conversations and
              performance reviews.
            </p>
            {!locked ? (
              <button
                type="button"
                onClick={onStart}
                className="mt-7 rounded-md border border-border px-5 py-2.5 text-[13px] font-medium text-foreground transition hover:border-foreground hover:bg-foreground/5"
              >
                Start the assessment
              </button>
            ) : null}
          </div>
          <CertificatePreviewCard certification={certification} />
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto mt-24 w-full max-w-3xl px-4 pb-4 sm:px-6">
        <h2 className="text-center text-[26px] font-semibold tracking-tight sm:text-[28px]">
          Frequently asked questions
        </h2>
        <div className="mt-10">
          {FAQS.map((item) => (
            <FaqRow
              key={item.q}
              question={item.q}
              answer={item.a(certification)}
            />
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="flex flex-col items-center px-6 pb-24 pt-16 text-center">
        <p className="text-[22px] font-medium tracking-tight text-foreground sm:text-[24px]">
          What are you waiting for?
        </p>
        {locked ? (
          <p className="mt-5 max-w-sm text-[13px] text-muted-foreground">
            {lockedReason}
          </p>
        ) : (
          <button
            type="button"
            onClick={onStart}
            className="mt-6 rounded-md bg-primary px-9 py-3 text-[15px] font-bold text-primary-foreground transition hover:bg-primary/90"
          >
            Get Certified
          </button>
        )}
      </section>
    </div>
  );
}

function CertificatePreviewCard({
  certification,
}: {
  certification: Certification;
}) {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div
        aria-hidden
        className="absolute -inset-4 rounded-3xl opacity-40 blur-2xl"
        style={{
          background: `radial-gradient(circle at 40% 30%, ${categoryMeta(certification.categoryId).accent}55, transparent 70%)`,
        }}
      />
      <CertificateSheet
        compact
        recipientName="Your Name"
        title={certification.shortTitle}
        technology={certification.categoryLabel}
        level={certification.level}
        className="relative"
      />
    </div>
  );
}

function FaqRow({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <span className="text-[15px] text-foreground">{question}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition",
            open && "rotate-180"
          )}
        />
      </button>
      {open ? (
        <p className="pb-5 pr-8 text-[13px] leading-relaxed text-muted-foreground">
          {answer}
        </p>
      ) : null}
    </div>
  );
}
