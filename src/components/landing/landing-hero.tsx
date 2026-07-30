"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { AUTH_ROUTES } from "@/features/auth/constants";
import styles from "./landing.module.css";

const HEADLINE = "Explore what you can become";
const EASE = [0.22, 1, 0.36, 1] as const;

const TRACES = [
  { d: "M 0 18 H 42 V 8 H 92", startY: 18, endX: 92, endY: 8, delay: "0s" },
  { d: "M 0 42 H 28 V 58 H 78", startY: 42, endX: 78, endY: 58, delay: "-1.2s" },
  { d: "M 0 86 H 52 V 72 H 110", startY: 86, endX: 110, endY: 72, delay: "-2.4s" },
  { d: "M 0 118 H 34 V 132 H 86", startY: 118, endX: 86, endY: 132, delay: "-0.6s" },
  { d: "M 0 156 H 48 V 146 H 102", startY: 156, endX: 102, endY: 146, delay: "-3.1s" },
  { d: "M 0 188 H 22 V 204 H 70", startY: 188, endX: 70, endY: 204, delay: "-1.8s" },
] as const;

function CircuitWall({ side }: { side: "left" | "right" }) {
  return (
    <div
      aria-hidden
      className={`${styles.circuit} ${
        side === "left" ? styles.circuitLeft : styles.circuitRight
      }`}
    >
      <svg viewBox="0 0 120 220" className={styles.circuitBoard} fill="none">
        {TRACES.map((trace, index) => (
          <g key={index} style={{ ["--delay" as string]: trace.delay }}>
            <path d={trace.d} className={styles.boardTrace} />
            <path d={trace.d} className={styles.boardPulse} pathLength={1} />
            <circle cx={0} cy={trace.startY} r={2} className={styles.boardVia} />
            <circle
              cx={trace.endX}
              cy={trace.endY}
              r={2.4}
              className={styles.boardPad}
            />
          </g>
        ))}
      </svg>
    </div>
  );
}

export function LandingHero() {
  const reduceMotion = useReducedMotion();
  const words = HEADLINE.split(" ");

  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 pb-24 pt-28 text-center sm:px-8">
      <CircuitWall side="left" />
      <CircuitWall side="right" />

      <div className="relative z-10 mx-auto flex w-full max-w-[720px] flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/70 backdrop-blur-xl"
        >
          <Sparkles className="h-3.5 w-3.5 text-[#f3aaa0]" />
          Learn · Build · Ship
        </motion.div>

        <h1 className="mt-7 w-full text-[2.55rem] font-medium leading-[1.08] tracking-[-0.05em] text-white sm:text-[3.35rem] lg:text-[3.85rem]">
          <span className="sr-only">
            {HEADLINE} with learning that moves.
          </span>
          <span
            aria-hidden
            className="flex flex-wrap justify-center gap-x-[0.28em]"
          >
            {words.map((word, index) => (
              <motion.span
                key={word}
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.65,
                  delay: 0.1 + index * 0.06,
                  ease: EASE,
                }}
                className="inline-block"
              >
                {word}
              </motion.span>
            ))}
          </span>
          <motion.span
            aria-hidden
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.42, ease: EASE }}
            className="mt-1 block bg-gradient-to-b from-white/70 via-[#f3b7ac] to-white/45 bg-clip-text text-transparent"
          >
            with learning that moves.
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.55, ease: EASE }}
          className="mt-5 max-w-[34rem] text-pretty text-[13.5px] leading-6 text-white/55 sm:text-[14.5px] sm:leading-7"
        >
          Follow structured paths, build production-ready projects, and learn
          with an AI mentor that understands where you are and what comes next.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.68, ease: EASE }}
          className="mt-9 flex w-full max-w-[26rem] items-center rounded-full border border-white/10 bg-white/[0.08] p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_18px_55px_rgba(0,0,0,0.3)] backdrop-blur-2xl"
        >
          <div className="min-w-0 flex-1 px-4 text-left">
            <p className="truncate text-[12px] font-medium text-white/88">
              Your next skill starts here
            </p>
            <p className="mt-0.5 text-[10px] text-white/38">
              Full Stack · AI · Real projects
            </p>
          </div>
          <Link
            href={AUTH_ROUTES.signup}
            className={`${styles.shine} inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-white px-5 text-[12px] font-semibold text-[#1b181a] shadow-lg transition hover:-translate-y-0.5 hover:bg-[#fff8f4]`}
          >
            Start learning
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
        className={`${styles.scrollCue} absolute bottom-8 left-1/2 z-10 flex h-9 w-5 -translate-x-1/2 items-start justify-center rounded-full border border-white/15 pt-1.5`}
      >
        <span />
      </motion.div>
    </section>
  );
}
