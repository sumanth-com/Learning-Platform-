"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { AUTH_ROUTES } from "@/features/auth/constants";
import styles from "./landing.module.css";

const HEADLINE = "Become the developer companies actually hire";
/** Forced 2-line break — keeps mobile hero clean and readable. */
const HEADLINE_LINES = [
  "Become the developer",
  "companies actually hire.",
] as const;

const SUBHEAD =
  "Full Stack, AI Engineering, System Design, and DevOps — built through real projects, AI mentoring, and verifiable certifications.";
/** Forced 3-line mobile subcopy — fixed rhythm, never reflows oddly. */
const SUBHEAD_MOBILE_LINES = [
  "Full Stack, AI, System Design & DevOps —",
  "real projects, mentoring,",
  "and verifiable certifications.",
] as const;

const EASE = [0.22, 1, 0.36, 1] as const;

const STATUS_LINES = [
  "Production-ready engineering paths",
  "AI mentor on every module",
  "Verifiable skill certifications",
] as const;

/**
 * Image-2 layout:
 *  - top pair: two parallels that jog down at 45°
 *  - middle: two arms converge into one stem (Y junction)
 *  - bottom pair: two parallels that jog up at 45°
 */
const CHANNELS = [
  // Upside pair — jog down
  { d: "M 0 48 H 60 L 88 76 H 148", delay: "0s" },
  { d: "M 0 62 H 60 L 88 90 H 148", delay: "-0.7s" },
  // Middle Y — arms converge into one stem going right
  { d: "M 0 130 H 50 L 86 168 H 148", delay: "-1.5s" },
  { d: "M 0 206 H 50 L 86 168 H 148", delay: "-2.2s" },
  // Downside pair — jog up
  { d: "M 0 246 H 60 L 88 218 H 148", delay: "-3s" },
  { d: "M 0 260 H 60 L 88 232 H 148", delay: "-3.7s" },
] as const;

function EngravedPath({ d }: { d: string }) {
  return (
    <>
      <path
        d={d}
        className={styles.channelShadow}
        transform="translate(0 -0.75)"
      />
      <path d={d} className={styles.channelGroove} />
      <path
        d={d}
        className={styles.channelHighlight}
        transform="translate(0 0.9)"
      />
    </>
  );
}

function CircuitWall({ side }: { side: "left" | "right" }) {
  const fadeId = `circuitFade-${side}`;
  const maskId = `circuitMask-${side}`;

  return (
    <div
      aria-hidden
      className={`${styles.circuit} ${
        side === "left" ? styles.circuitLeft : styles.circuitRight
      }`}
    >
      <svg
        viewBox="0 0 150 330"
        className={styles.circuitBoard}
        fill="none"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id={fadeId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#fff" stopOpacity="1" />
            <stop offset="68%" stopColor="#fff" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <mask id={maskId}>
            <rect width="150" height="330" fill={`url(#${fadeId})`} />
          </mask>
        </defs>

        <g mask={`url(#${maskId})`}>
          {CHANNELS.map((channel, index) => (
            <g
              key={index}
              className={styles.channel}
              style={{ ["--delay" as string]: channel.delay }}
            >
              <EngravedPath d={channel.d} />
              <path
                d={channel.d}
                className={styles.channelSupply}
                pathLength={1}
              />
            </g>
          ))}

          <g className={styles.channelNode}>
            <rect
              x="82"
              y="164"
              width="8"
              height="8"
              rx="1.2"
              className={styles.channelNodeBody}
            />
            <rect
              x="83.2"
              y="165.2"
              width="5.6"
              height="5.6"
              rx="0.8"
              className={styles.channelNodeCore}
            />
          </g>
        </g>
      </svg>
    </div>
  );
}

function StatusBadge({ reduceMotion }: { reduceMotion: boolean | null }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    const timer = setInterval(
      () => setActive((current) => (current + 1) % STATUS_LINES.length),
      2800
    );
    return () => clearInterval(timer);
  }, [reduceMotion]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE }}
      className={styles.statusBadge}
    >
      <span className={styles.statusPulse} aria-hidden />
      {/* Grid sizer: longest line sets width so rotating copy never stretches the pill */}
      <span className={styles.statusTextSlot}>
        {STATUS_LINES.map((line) => (
          <span key={line} className={styles.statusTextSizer} aria-hidden>
            {line}
          </span>
        ))}
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={STATUS_LINES[active]}
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: EASE }}
            className={styles.statusTextActive}
          >
            {STATUS_LINES[active]}
          </motion.span>
        </AnimatePresence>
      </span>
    </motion.div>
  );
}

export function LandingHero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 pb-24 pt-28 text-center sm:px-8">
      {/* Mobile: floating content + animated round washes (no glass card) */}
      <div aria-hidden className={styles.heroWashTop} />
      <div aria-hidden className={styles.heroWashBottom} />
      <div aria-hidden className={styles.heroWashCore} />

      {/* Desktop ambient + circuit walls */}
      <div aria-hidden className={`${styles.heroAmbient} max-md:hidden`} />
      <div className="max-md:hidden">
        <CircuitWall side="left" />
        <CircuitWall side="right" />
      </div>

      <div className={`${styles.heroMiddle} relative z-10 mx-auto flex w-full max-w-[760px] flex-col items-center`}>
        <StatusBadge reduceMotion={reduceMotion} />

        <h1 className="mt-6 w-full max-w-[20.5rem] text-[1.85rem] font-medium leading-[1.15] tracking-[-0.04em] text-white sm:mt-7 sm:max-w-none sm:text-[3.2rem] sm:leading-[1.12] sm:tracking-[-0.045em] lg:text-[3.65rem]">
          <span className="sr-only">{HEADLINE}.</span>
          <span
            aria-hidden
            className="flex flex-col items-center gap-y-0.5 sm:gap-y-1"
          >
            {HEADLINE_LINES.map((line, index) => (
              <motion.span
                key={line}
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.55,
                  delay: 0.1 + index * 0.1,
                  ease: EASE,
                }}
                className="block text-balance text-white"
              >
                {line}
              </motion.span>
            ))}
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.4, ease: EASE }}
          className={`${styles.heroSubhead} mt-4 max-w-[19.5rem] text-[13px] leading-[1.45] text-white/55 sm:mt-5 sm:max-w-[32rem] sm:text-pretty sm:text-[15px] sm:leading-7`}
        >
          <span className="flex flex-col items-center sm:hidden" aria-hidden>
            {SUBHEAD_MOBILE_LINES.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </span>
          <span className="sr-only sm:hidden">
            {SUBHEAD_MOBILE_LINES.join(" ")}
          </span>
          <span className="hidden sm:inline">{SUBHEAD}</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.55, ease: EASE }}
          className={styles.heroInvite}
        >
          <span aria-hidden className={styles.heroInviteAura} />
          <span aria-hidden className={styles.heroInviteRing} />
          <Link href={AUTH_ROUTES.signup} className={styles.heroInviteBtn}>
            <span className={styles.heroInviteLive} aria-hidden />
            <span className={styles.heroInviteLabel}>Enter Suprabase</span>
            <span className={styles.heroInviteArrow} aria-hidden>
              <ArrowRight className="h-4 w-4" strokeWidth={2.25} />
            </span>
          </Link>
        </motion.div>
      </div>

      <motion.a
        href="/mentor"
        aria-label="Explore AI Mentor"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        className={`${styles.scrollCue} absolute bottom-8 left-1/2 z-10 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full text-white/45 transition hover:bg-white/[0.04] hover:text-white/75`}
      >
        <ChevronDown className="h-5 w-5" strokeWidth={1.75} />
      </motion.a>
    </section>
  );
}
