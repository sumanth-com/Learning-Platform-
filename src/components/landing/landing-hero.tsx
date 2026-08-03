"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Brain,
  ChevronDown,
  Code2,
  LayoutGrid,
  Map,
  ShieldCheck,
  Star,
  Terminal,
} from "lucide-react";
import { TrackedLink } from "@/components/analytics/tracked-link";
import { AUTH_ROUTES } from "@/features/auth/constants";
import { ANALYTICS_EVENTS } from "@/lib/analytics";
import styles from "./landing.module.css";

const HEADLINE = "Become the developer companies actually hire";

const SUBHEAD =
  "Full Stack, AI Engineering, System Design, and DevOps — built through real projects, AI mentoring, and verifiable certifications.";
/** Forced 2-line mobile subcopy — stable height, no stretch. */
const SUBHEAD_MOBILE_LINES = [
  "Full Stack, AI, System Design & DevOps —",
  "real projects, mentoring & certifications.",
] as const;

const EASE = [0.22, 1, 0.36, 1] as const;

const STATUS_LINES = [
  "Production-ready engineering paths",
  "AI mentor on every module",
  "Verifiable skill certifications",
] as const;

const TRUST_AVATARS = [
  { src: "/images/trust/01.jpg", alt: "Developer from India" },
  { src: "/images/trust/02.jpg", alt: "Developer from India" },
  { src: "/images/trust/03.jpg", alt: "Developer from India" },
  { src: "/images/trust/04.jpg", alt: "Developer from India" },
  { src: "/images/trust/05.jpg", alt: "Developer from India" },
] as const;

const HERO_FEATURES = [
  {
    title: "Real Projects",
    description: "Ship real production work.",
    Icon: Code2,
  },
  {
    title: "AI Mentor",
    description: "Help on every module.",
    Icon: Brain,
  },
  {
    title: "Verifiable Certs",
    description: "Proof employers trust.",
    Icon: ShieldCheck,
  },
  {
    title: "Structured Paths",
    description: "Clear learning roadmap.",
    Icon: Map,
  },
  {
    title: "In-browser IDE",
    description: "Code with no setup.",
    Icon: Terminal,
  },
  {
    title: "Developer Hub",
    description: "Progress in one place.",
    Icon: LayoutGrid,
  },
] as const;

/**
 * Image-2 layout:
 *  - top pair: two parallels that jog down at 45°
 *  - middle: two arms converge into one stem (Y junction)
 *  - bottom pair: two parallels that jog up at 45°
 */
const CHANNELS = [
  { d: "M 0 48 H 60 L 88 76 H 148", delay: "0s" },
  { d: "M 0 62 H 60 L 88 90 H 148", delay: "-0.7s" },
  { d: "M 0 130 H 50 L 86 168 H 148", delay: "-1.5s" },
  { d: "M 0 206 H 50 L 86 168 H 148", delay: "-2.2s" },
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

function HeroTrust({ reduceMotion }: { reduceMotion: boolean | null }) {
  return (
    <motion.div
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.65, ease: EASE }}
      className={styles.heroTrust}
    >
      <div className={styles.heroTrustAvatars} aria-hidden>
        {TRUST_AVATARS.map((avatar, index) => (
          <span
            key={avatar.src}
            className={styles.heroTrustAvatar}
            style={{ zIndex: TRUST_AVATARS.length - index }}
          >
            <Image
              src={avatar.src}
              alt=""
              width={40}
              height={40}
              className={styles.heroTrustAvatarImg}
            />
          </span>
        ))}
      </div>
      <div className={styles.heroTrustMeta}>
        <div className={styles.heroTrustStars} aria-hidden>
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              className="h-3 w-3 fill-white text-white"
              strokeWidth={0}
            />
          ))}
        </div>
        <p className={styles.heroTrustLabel}>
          Trusted by 700+ developers
        </p>
      </div>
    </motion.div>
  );
}

function HeroFeatureGrid({ reduceMotion }: { reduceMotion: boolean | null }) {
  return (
    <motion.div
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.75, ease: EASE }}
      className={styles.heroFeatureGrid}
    >
      {HERO_FEATURES.map(({ title, description, Icon }) => (
        <div key={title} className={styles.heroFeatureItem}>
          <span className={styles.heroFeatureIcon} aria-hidden>
            <Icon className="h-3.5 w-3.5" strokeWidth={2} />
          </span>
          <div className={styles.heroFeatureCopy}>
            <p className={styles.heroFeatureTitle}>{title}</p>
            <p className={styles.heroFeatureDesc}>{description}</p>
          </div>
        </div>
      ))}
    </motion.div>
  );
}

export function LandingHero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className={styles.heroSection}>
      <div aria-hidden className={styles.heroWashTop} />
      <div aria-hidden className={styles.heroWashBottom} />
      <div aria-hidden className={styles.heroWashCore} />

      <div aria-hidden className={`${styles.heroAmbient} max-md:hidden`} />
      <div className="max-md:hidden">
        <CircuitWall side="left" />
        <CircuitWall side="right" />
      </div>

      <div className={styles.heroMiddle}>
        <StatusBadge reduceMotion={reduceMotion} />

        <h1 className={styles.heroHeadline}>
          <span className="sr-only">{HEADLINE}.</span>
          <span aria-hidden className={styles.heroHeadlineVisible}>
            <motion.span
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1, ease: EASE }}
              className={styles.heroHeadlineLine}
            >
              Become the{" "}
              <span className={styles.heroGradientWord}>developer</span>
            </motion.span>
            <motion.span
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.2, ease: EASE }}
              className={styles.heroHeadlineLine}
            >
              companies actually hire.
            </motion.span>
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.4, ease: EASE }}
          className={styles.heroSubhead}
        >
          <span className={styles.heroSubheadMobile} aria-hidden>
            {SUBHEAD_MOBILE_LINES.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </span>
          <span className="sr-only sm:hidden">
            {SUBHEAD_MOBILE_LINES.join(" ")}
          </span>
          <span className={styles.heroSubheadDesktop}>{SUBHEAD}</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.55, ease: EASE }}
          className={styles.heroInvite}
        >
          <span aria-hidden className={styles.heroInviteAura} />
          <span aria-hidden className={styles.heroInviteRing} />
          <TrackedLink
            href={AUTH_ROUTES.reserveSeat}
            event={ANALYTICS_EVENTS.reserve_seat_clicked}
            eventParams={{ source: "hero" }}
            className={styles.heroInviteBtn}
          >
            <span className={styles.heroInviteLive} aria-hidden />
            <span className={styles.heroInviteLabel}>Reserve your seat</span>
            <span className={styles.heroInviteArrow} aria-hidden>
              <ArrowRight className="h-4 w-4" strokeWidth={2.25} />
            </span>
          </TrackedLink>
        </motion.div>

        <HeroTrust reduceMotion={reduceMotion} />
        <HeroFeatureGrid reduceMotion={reduceMotion} />
      </div>

      <motion.a
        href="#mentor"
        aria-label="Scroll to explore"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.95 }}
        className={styles.scrollCue}
      >
        <span className={styles.scrollCueLabel}>Scroll to explore</span>
        <ChevronDown className="h-4 w-4" strokeWidth={1.75} />
      </motion.a>
    </section>
  );
}
