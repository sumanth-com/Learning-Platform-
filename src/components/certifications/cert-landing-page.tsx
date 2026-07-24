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
        <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-800 bg-card p-3 shadow-lg">
          <CertTechLogo id={certification.categoryId} size={40} />
        </div>
        <p className="relative text-[15px] text-zinc-400">Get certified in</p>
        <h1 className="relative mt-2 max-w-3xl text-[36px] font-semibold tracking-tight sm:text-[48px]">
          {certification.shortTitle}
        </h1>
        <p className="relative mt-4 max-w-xl text-[15px] leading-relaxed text-zinc-400">
          SupraBase certifications help you stand out when applying to jobs
          and are trusted as a signal of real engineering skill.
        </p>

        {locked ? (
          <p className="relative mt-8 max-w-md rounded-xl border border-zinc-700/80 bg-zinc-900/70 px-4 py-3 text-[13px] text-zinc-300">
            {lockedReason}
          </p>
        ) : (
          <button
            type="button"
            onClick={onStart}
            className="relative mt-8 rounded-md bg-[#27d17c] px-9 py-3 text-[15px] font-bold text-zinc-950 transition hover:bg-[#3ee08d]"
          >
            Get Certified
          </button>
        )}

        <p className="relative mt-5 text-[13px] text-zinc-500">
          Join developers building a verified skill signal on SupraBase
        </p>
        <Link
          href="/certifications"
          className="relative mt-8 text-[13px] text-zinc-500 transition hover:text-zinc-300"
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
                i > 0 && "border-t border-zinc-800/80 sm:border-t-0 sm:border-l"
              )}
            >
              <h.icon className="h-6 w-6 text-zinc-300" strokeWidth={1.5} />
              <p className="max-w-[11rem] text-[13px] leading-snug text-zinc-200">
                {h.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Companies */}
      <section className="mx-auto mt-20 w-full max-w-5xl px-4 text-center sm:px-6">
        <p className="text-[15px] text-zinc-300">
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
            <p className="mt-4 max-w-md text-[14px] leading-relaxed text-zinc-400">
              Show it on LinkedIn, your resume, or portfolio. A clean verify
              link proves you passed — useful for hiring conversations and
              performance reviews.
            </p>
            {!locked ? (
              <button
                type="button"
                onClick={onStart}
                className="mt-7 rounded-md border border-zinc-600 px-5 py-2.5 text-[13px] font-medium text-foreground transition hover:border-foreground hover:bg-foreground/5"
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
          <p className="mt-5 max-w-sm text-[13px] text-zinc-500">{lockedReason}</p>
        ) : (
          <button
            type="button"
            onClick={onStart}
            className="mt-6 rounded-md bg-[#27d17c] px-9 py-3 text-[15px] font-bold text-zinc-950 transition hover:bg-[#3ee08d]"
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
  const maroon = "#a31d2d";
  const charcoal = "#1f1f1f";
  const gold = "#c5a572";

  return (
    <div className="relative mx-auto w-full max-w-md">
      <div
        aria-hidden
        className="absolute -inset-4 rounded-3xl opacity-40 blur-2xl"
        style={{
          background: `radial-gradient(circle at 40% 30%, ${categoryMeta(certification.categoryId).accent}55, transparent 70%)`,
        }}
      />
      <div
        className="relative aspect-[1.414/1] overflow-hidden border-[3px] border-black bg-[#f6f1e8] shadow-2xl"
        style={{ fontFamily: "var(--font-plus-jakarta), system-ui, sans-serif" }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 50% 42%, #fffdf8 0%, transparent 70%)",
          }}
        />
        <div className="pointer-events-none absolute inset-[7px] border border-black/80" />
        <div
          className="pointer-events-none absolute inset-[11px] border"
          style={{ borderColor: `${gold}aa` }}
        />

        {/* Corner marks */}
        {[
          "left-[14px] top-[14px]",
          "right-[14px] top-[14px] scale-x-[-1]",
          "bottom-[14px] left-[14px] scale-y-[-1]",
          "bottom-[14px] right-[14px] scale-[-1]",
        ].map((pos) => (
          <svg
            key={pos}
            aria-hidden
            viewBox="0 0 40 40"
            className={`pointer-events-none absolute h-8 w-8 ${pos}`}
          >
            <path d="M2 2 H22 M2 2 V22" fill="none" stroke={charcoal} strokeWidth="1.3" />
            <path d="M5 5 H16 M5 5 V16" fill="none" stroke={maroon} strokeWidth="1" />
            <circle cx="8" cy="8" r="1.3" fill={maroon} />
          </svg>
        ))}

        <div className="relative z-10 flex h-full flex-col items-center px-[11%] pb-[6%] pt-[7%] text-center">
          <div className="flex w-[48%] items-center gap-1.5">
            <div
              className="h-px flex-1"
              style={{ background: `linear-gradient(90deg, transparent, ${maroon})` }}
            />
            <span className="h-1 w-1 rotate-45" style={{ backgroundColor: gold }} />
            <div
              className="h-px flex-1"
              style={{ background: `linear-gradient(90deg, ${maroon}, transparent)` }}
            />
          </div>

          <div className="mt-2.5 flex items-center gap-1.5">
            <svg viewBox="0 0 36 36" className="h-6 w-6" aria-hidden>
              <path d="M8 26 L18 6 L22 14 L12 28 Z" fill={maroon} />
              <path d="M14 22 L24 8 L28 16 L18 30 Z" fill={charcoal} />
            </svg>
            <span className="text-[11px] font-semibold tracking-wide text-[#1f1f1f]">
              SupraBase
            </span>
          </div>

          <p
            className="mt-2 text-[8px] font-semibold uppercase tracking-[0.32em]"
            style={{ color: maroon }}
          >
            Verified skill
          </p>

          <h3 className="mt-2 text-[22px] font-extrabold uppercase tracking-[0.12em] text-[#1f1f1f]">
            Certificate
          </h3>
          <p className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.28em] text-[#1f1f1f]">
            Of Achievement
          </p>

          <div className="mt-3 flex items-center gap-1.5" aria-hidden>
            <span className="h-px w-6" style={{ backgroundColor: `${gold}99` }} />
            <span className="h-1 w-1 rotate-45" style={{ backgroundColor: maroon }} />
            <span className="h-px w-6" style={{ backgroundColor: `${gold}99` }} />
          </div>

          <p className="mt-3 text-[8px] font-medium uppercase tracking-[0.22em] text-[#5c5c5c]">
            Presented to
          </p>
          <p
            className="mt-0.5 text-[28px] leading-none text-[#a31d2d]"
            style={{ fontFamily: "var(--font-cert-script), cursive" }}
          >
            Your Name
          </p>
          <div
            className="mt-1.5 h-px w-28"
            style={{
              background: `linear-gradient(90deg, transparent, ${charcoal}, transparent)`,
            }}
          />

          <p className="mt-3 max-w-[72%] text-[9px] leading-relaxed text-[#3d3d3d]">
            Successfully completed the{" "}
            <span className="font-semibold text-[#1f1f1f]">
              {certification.shortTitle}
            </span>{" "}
            skill certification on SupraBase.
          </p>

          <div className="mt-auto flex w-full max-w-[88%] items-end justify-between pt-4">
            <div className="min-w-[4.5rem] text-center">
              <p className="text-[9px] font-medium text-[#1f1f1f]">—.—.—</p>
              <div className="mx-auto mt-1 h-px w-full bg-[#1f1f1f]" />
              <p className="mt-0.5 text-[7px] font-semibold uppercase tracking-wider text-[#5c5c5c]">
                Date
              </p>
            </div>
            <div className="min-w-[4.5rem] text-center">
              <p
                className="text-[14px] leading-none text-[#a31d2d]"
                style={{ fontFamily: "var(--font-cert-script), cursive" }}
              >
                SupraBase
              </p>
              <div className="mx-auto mt-1 h-px w-full bg-[#1f1f1f]" />
              <p className="mt-0.5 text-[7px] font-semibold uppercase tracking-wider text-[#5c5c5c]">
                Platform
              </p>
            </div>
          </div>

          <div className="mt-3 flex w-[48%] items-center gap-1.5">
            <div
              className="h-px flex-1"
              style={{ background: `linear-gradient(90deg, transparent, ${maroon})` }}
            />
            <span className="h-1 w-1 rotate-45" style={{ backgroundColor: gold }} />
            <div
              className="h-px flex-1"
              style={{ background: `linear-gradient(90deg, ${maroon}, transparent)` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function FaqRow({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-zinc-800">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <span className="text-[15px] text-zinc-100">{question}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-zinc-400 transition",
            open && "rotate-180"
          )}
        />
      </button>
      {open ? (
        <p className="pb-5 pr-8 text-[13px] leading-relaxed text-zinc-400">
          {answer}
        </p>
      ) : null}
    </div>
  );
}
