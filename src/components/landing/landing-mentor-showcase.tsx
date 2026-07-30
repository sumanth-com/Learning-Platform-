"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUp, Plus } from "lucide-react";
import { AUTH_ROUTES } from "@/features/auth/constants";
import { Reveal } from "./reveal";
import styles from "./landing.module.css";

const PROMPTS = [
  "Explain why my useEffect runs twice on mount",
  "Debug this TypeScript generic that won't compile",
  "Review my Next.js route handler for security holes",
  "Build a debounce helper with AbortController cleanup",
  "Walk me through Postgres indexes for this query",
  "Rewrite this React component without prop drilling",
  "How should I structure a production RAG pipeline?",
  "Find the race condition in this async fetch",
  "Explain system design for a realtime notifications API",
  "Help me pass the TypeScript intermediate certification",
];

const HOLD_MS = 2400;
const EASE = [0.22, 1, 0.36, 1] as const;

export function LandingMentorShowcase() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    const timer = setInterval(
      () => setActive((current) => (current + 1) % PROMPTS.length),
      HOLD_MS
    );
    return () => clearInterval(timer);
  }, [reduceMotion]);

  return (
    <section
      id="mentor"
      className={`${styles.mentorShowcase} relative flex min-h-[calc(100svh-4.75rem)] items-center overflow-hidden py-8 sm:py-10`}
    >
      <div aria-hidden className={styles.mentorGlow}>
        <span className={styles.mentorOrbA} />
        <span className={styles.mentorOrbB} />
        <span className={styles.mentorOrbC} />
        <span className={styles.mentorWash} />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-5xl px-5 text-center sm:px-8">
        <Reveal>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#f3aaa0]">
            Ask Supra · AI Mentor
          </p>
          <h2 className="mt-3 whitespace-normal text-[2.25rem] font-medium leading-[1.08] tracking-[-0.045em] text-white sm:text-[3rem] lg:whitespace-nowrap lg:text-[3.35rem]">
            Ask Supra anything.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-balance text-[13.5px] leading-6 text-white/50">
            It already understands your module, code and progress — so every
            answer starts with the context that matters.
          </p>
        </Reveal>

        <Reveal delay={0.12} className="relative mx-auto mt-2 max-w-[38rem]">
          <span aria-hidden className={styles.prismLayer}>
            <span className={styles.prismSpread} />
            <span className={styles.prismCore} />
          </span>

          <div className={styles.promptStage}>
            <div className={styles.promptViewport}>
              <div className={styles.promptDock}>
                <span aria-hidden className={styles.prismRing} />

                <Link
                  href={AUTH_ROUTES.signup}
                  aria-label={`Ask Supra: ${PROMPTS[active]}`}
                  className={styles.promptFocus}
                >
                  <span className={styles.promptPlus} aria-hidden>
                    <Plus className="h-4 w-4" strokeWidth={2.25} />
                  </span>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={PROMPTS[active]}
                      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduceMotion ? undefined : { opacity: 0, y: -14 }}
                      transition={{ duration: 0.4, ease: EASE }}
                      className="min-w-0 flex-1 truncate text-left text-[13.5px] font-medium text-[#f3b7ac] sm:text-[14.5px]"
                    >
                      {PROMPTS[active]}
                    </motion.span>
                  </AnimatePresence>
                  <span className={styles.promptSend} aria-hidden>
                    <ArrowUp className="h-4 w-4" strokeWidth={2.5} />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
