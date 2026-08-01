"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowUp,
  Code2,
  GitBranch,
  ImageIcon,
  Plus,
  Sparkles,
} from "lucide-react";
import { AUTH_ROUTES } from "@/features/auth/constants";
import { Reveal } from "./reveal";
import styles from "./landing.module.css";

const ROTATING_PROMPTS = [
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

const SUGGESTIONS = [
  {
    text: "Explain React Server Components simply",
    short: "Explain React Server Components",
    icon: Sparkles,
  },
  {
    text: "Design a production-ready learning dashboard",
    short: "Design a learning dashboard",
    icon: Code2,
  },
  {
    text: "Help me debug a Next.js hydration error",
    short: "Debug a Next.js hydration error",
    icon: GitBranch,
  },
] as const;

const TABS = ["Explore", "Explain", "Debug", "Build", "Review"] as const;

const HOLD_MS = 3200;
const EASE = [0.22, 1, 0.36, 1] as const;

export function LandingMentorShowcase() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    const timer = setInterval(
      () => setActive((current) => (current + 1) % ROTATING_PROMPTS.length),
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
          <span className={styles.sectionPill}>Ask Supra · AI Mentor</span>
          <h2 className={`${styles.sectionHeading} max-md:text-[1.65rem] sm:whitespace-nowrap`}>
            Your AI software engineering mentor.
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-balance text-[13.5px] leading-6 text-white/50 max-md:mt-2.5 max-md:max-w-[20rem] max-md:text-[12.5px] max-md:leading-[1.45]">
            <span className="sm:hidden">
              Instant help with debugging, architecture, React, Next.js, and
              production engineering.
            </span>
            <span className="hidden sm:inline">
              Get instant help with debugging, architecture, React, Next.js,
              Python, Java, databases, AI, DevOps, interviews, system design, and
              production engineering—powered by your learning progress.
            </span>
          </p>
        </Reveal>

        <Reveal
          delay={0.08}
          className="relative mx-auto mt-6 w-full max-w-[720px] text-left sm:mt-7"
        >
          <span aria-hidden className={styles.prismLayer}>
            <span className={styles.prismSpread} />
            <span className={styles.prismCore} />
          </span>

          <div className={styles.promptStage}>
            <div className={styles.promptDock}>
              <span aria-hidden className={styles.prismRingComposer} />

              <Link
                href={AUTH_ROUTES.signup}
                aria-label={`Ask Supra: ${ROTATING_PROMPTS[active]}`}
                className={styles.promptComposer}
              >
                <span className="relative block min-h-[52px] overflow-hidden px-1 pt-0.5 max-md:min-h-[44px]">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={ROTATING_PROMPTS[active]}
                      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
                      transition={{ duration: 0.35, ease: EASE }}
                      className="absolute inset-x-1 top-0.5 block text-[15px] leading-6 text-[#f3b7ac]/80 max-md:text-[14px] max-md:leading-5"
                    >
                      {ROTATING_PROMPTS[active]}
                    </motion.span>
                  </AnimatePresence>
                  <span
                    className="invisible block text-[15px] leading-6 max-md:text-[14px] max-md:leading-5"
                    aria-hidden
                  >
                    {ROTATING_PROMPTS[0]}
                  </span>
                </span>

                <span className="mt-3 flex items-center justify-between gap-2 max-md:mt-2.5">
                  <span className="flex items-center gap-0.5">
                    <span className={styles.promptTool} aria-hidden>
                      <Plus className="h-5 w-5" strokeWidth={1.75} />
                    </span>
                    <span className={styles.promptTool} aria-hidden>
                      <ImageIcon className="h-4 w-4" strokeWidth={1.75} />
                    </span>
                    <span className={styles.promptExplore} aria-hidden>
                      <Sparkles className="h-3.5 w-3.5" />
                      Explore
                    </span>
                  </span>

                  <span className="flex items-center gap-2">
                    <span className="text-[12px] font-medium text-white/40">
                      Supra
                    </span>
                    <span className={styles.promptSend} aria-hidden>
                      <ArrowUp className="h-4 w-4" strokeWidth={2.5} />
                    </span>
                  </span>
                </span>
              </Link>
            </div>
          </div>

          <div className="relative z-10 mt-3.5 space-y-2.5 sm:mt-4 sm:space-y-3" aria-hidden>
            <div className="pointer-events-none flex gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {TABS.map((tab) => (
                <span
                  key={tab}
                  className={
                    tab === "Explore" ? styles.promptTabActive : styles.promptTab
                  }
                >
                  {tab === "Explore" ? (
                    <Sparkles className="h-3.5 w-3.5" />
                  ) : null}
                  {tab}
                </span>
              ))}
            </div>

            <div className={`${styles.promptSuggestions} pointer-events-none`}>
              {SUGGESTIONS.map((prompt) => {
                const PromptIcon = prompt.icon;
                return (
                  <div key={prompt.text} className={styles.promptSuggestion}>
                    <span className={styles.promptSuggestionIcon}>
                      <PromptIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </span>
                    <span className={styles.promptSuggestionLabel}>
                      <span className="sm:hidden">{prompt.short}</span>
                      <span className="hidden sm:inline">{prompt.text}</span>
                    </span>
                    <ArrowUp className="h-3.5 w-3.5 shrink-0 rotate-90 opacity-30" />
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
