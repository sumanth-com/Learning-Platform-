"use client";

import Link from "next/link";
import { ArrowRight, BadgeCheck, ShieldCheck, Sparkles } from "lucide-react";
import { CertificateSheet } from "@/components/certifications/certificate-document";
import { AUTH_ROUTES } from "@/features/auth/constants";
import { Reveal } from "./reveal";
import styles from "./landing.module.css";

const POINTS = [
  {
    icon: BadgeCheck,
    title: "Proof employers trust",
    body: "Timed skill tests and public verification for your portfolio.",
  },
  {
    icon: ShieldCheck,
    title: "Built for hiring signals",
    body: "Measurable Full Stack and AI skill — not completion badges.",
  },
  {
    icon: Sparkles,
    title: "Your next chapter, certified",
    body: "Interview-ready proof you can ship production software.",
  },
] as const;

export function LandingCertifications() {
  return (
    <section
      id="certifications"
      className="relative overflow-hidden py-16 sm:py-28"
    >
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="mx-auto max-w-5xl text-center">
          <span className={styles.sectionPill}>Verifiable certifications</span>
          <h2 className={`${styles.sectionHeading} max-md:text-[1.7rem] max-md:leading-[1.2] sm:whitespace-nowrap`}>
            The credential that opens your next chapter.
          </h2>
          <p className="mx-auto mt-3.5 max-w-lg text-balance text-[13.5px] leading-6 text-white/50 max-md:mt-3 max-md:max-w-[20.5rem] max-md:text-[12.5px] max-md:leading-[1.45]">
            The best futures aren&apos;t promised by tutorials — they&apos;re
            earned with proof you can ship under real constraints.
          </p>
        </Reveal>

        <div className="mt-10 grid items-center gap-8 sm:mt-14 sm:gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16 xl:gap-20">
          <Reveal from="left" className="relative">
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-8 rounded-[2rem] bg-[radial-gradient(circle_at_40%_35%,rgba(229,107,104,0.22),transparent_62%)] blur-2xl"
            />
            <div className={`${styles.certFrame} relative overflow-visible`}>
              <CertificateSheet
                compact
                recipientName="Alex Rivera"
                title="TypeScript (Intermediate)"
                technology="TypeScript"
                level="intermediate"
                score={94}
                issuedAt="2026-07-15T12:00:00.000Z"
                certificateId="XXXXXXXXX"
                className="relative w-full max-w-none shadow-[0_28px_70px_-24px_rgba(0,0,0,0.55)] max-md:!aspect-[1.05/1] max-md:rounded-[0.95rem]"
              />
            </div>
          </Reveal>

          <Reveal from="right">
            <ul className="space-y-4 sm:space-y-5">
              {POINTS.map((point) => (
                <li key={point.title} className="flex gap-3.5">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e56b68]/12 text-[#f3aaa0]">
                    <point.icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13.5px] font-medium tracking-tight text-white/90">
                      {point.title}
                    </p>
                    <p className="mt-1 max-w-[22rem] text-[12.5px] leading-5 text-white/42 line-clamp-2">
                      {point.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8 grid grid-cols-2 gap-2.5 sm:mt-10 sm:flex sm:flex-wrap sm:items-center sm:gap-3">
              <Link
                href={AUTH_ROUTES.signup}
                className={`${styles.shine} inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-full bg-white px-3 text-[12px] font-semibold text-[#1b181a] shadow-[0_14px_36px_rgba(0,0,0,0.35)] transition hover:-translate-y-0.5 hover:bg-[#fff8f4] sm:w-auto sm:gap-2 sm:px-6 sm:text-[13px]`}
              >
                <span className="truncate">Earn your credential</span>
                <ArrowRight className="h-3.5 w-3.5 shrink-0" />
              </Link>
              <Link
                href={AUTH_ROUTES.login}
                className="inline-flex h-11 w-full items-center justify-center rounded-full border border-white/12 bg-white/[0.05] px-3 text-[12px] font-semibold text-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition hover:bg-white/[0.08] hover:text-white sm:w-auto sm:px-6 sm:text-[13px] sm:font-medium sm:text-white/70"
              >
                <span className="truncate">View certifications</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
