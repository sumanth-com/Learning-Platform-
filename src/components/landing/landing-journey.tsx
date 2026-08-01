"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Award,
  FolderGit2,
  GitBranch,
  Sparkles,
  Terminal,
} from "lucide-react";
import { Reveal } from "./reveal";
import styles from "./landing.module.css";

const HELPS = [
  {
    id: "mentor",
    icon: Sparkles,
    title: "AI Mentor",
    help: "Stuck on a bug or design choice? Get context-aware guidance tied to what you’re building right now—not generic chat.",
  },
  {
    id: "practice",
    icon: Terminal,
    title: "Browser Practice",
    help: "Write, run, and debug in the browser. No local setup tax—just open a challenge and start shipping muscle memory.",
  },
  {
    id: "projects",
    icon: FolderGit2,
    title: "Portfolio Projects",
    help: "Ship work you can walk through in interviews: real constraints, clean structure, and outcomes you can defend.",
  },
  {
    id: "certs",
    icon: Award,
    title: "Verifiable Certs",
    help: "Earn timed credentials with public IDs employers can confirm instantly—proof that travels with you.",
  },
  {
    id: "roadmap",
    icon: GitBranch,
    title: "Connected Roadmap",
    help: "One path from fundamentals to production. Lessons, practice, projects, and certs stay linked on a single profile.",
  },
] as const;

const ROTATE_MS = 2500;

export function LandingJourney() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduceMotion || paused) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % HELPS.length);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, [paused, reduceMotion]);

  const current = HELPS[active]!;
  const Icon = current.icon;

  return (
    <section
      id="journey"
      className="relative mx-auto max-w-5xl px-5 py-24 sm:px-8 sm:py-32"
    >
      <Reveal className="mx-auto max-w-3xl text-center">
        <span className={styles.sectionPill}>Most useful</span>
        <h2 className={styles.sectionHeading}>
          Learn software engineering with AI mentoring, practice, and proof
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-[14px] leading-relaxed text-white/55 sm:text-[15px]">
          Suprabase combines an AI coding mentor, in-browser practice, portfolio
          projects, verifiable certifications, and a connected roadmap—so you
          build real skills employers can trust.
        </p>
      </Reveal>

      <div
        className={`${styles.helpStage} mt-12`}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setPaused(false);
          }
        }}
      >
        <div aria-hidden className={styles.helpGlow} />
        <div aria-hidden className={styles.helpGlowAlt} />
        <div aria-hidden className={styles.helpSheen} />
        <div aria-hidden className={styles.helpBloom} />

        <div className="relative z-10 flex flex-col items-center">
          <div
            role="tablist"
            aria-label="What helps you move forward"
            className="flex max-w-full flex-wrap items-center justify-center gap-2"
          >
            {HELPS.map((item, index) => {
              const TabIcon = item.icon;
              const selected = index === active;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls="help-panel"
                  id={`help-tab-${item.id}`}
                  onClick={() => setActive(index)}
                  className={`${styles.helpTab} ${selected ? styles.helpTabActive : ""}`}
                >
                  <TabIcon className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
                  <span className="hidden sm:inline">{item.title}</span>
                </button>
              );
            })}
          </div>

          <div
            id="help-panel"
            role="tabpanel"
            aria-labelledby={`help-tab-${current.id}`}
            className={styles.helpPanel}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={
                  reduceMotion
                    ? false
                    : { opacity: 0, y: 22, scale: 0.94 }
                }
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={
                  reduceMotion
                    ? undefined
                    : { opacity: 0, y: -16, scale: 0.96 }
                }
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="mx-auto flex w-full max-w-xl flex-col items-center text-center"
              >
                <div className={styles.helpIconWrap}>
                  <span aria-hidden className={styles.helpIconHalo} />
                  <motion.span
                    className={styles.helpIcon}
                    initial={reduceMotion ? false : { scale: 0.72, opacity: 0.5 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 280,
                      damping: 18,
                    }}
                  >
                    <Icon className="h-7 w-7" strokeWidth={1.6} />
                  </motion.span>
                </div>

                <motion.h3
                  className="mt-7 text-[1.55rem] font-semibold tracking-[-0.035em] text-white sm:text-[1.85rem]"
                  initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08, duration: 0.4 }}
                >
                  {current.title}
                </motion.h3>
                <motion.p
                  className="mt-3 max-w-md text-[14.5px] leading-relaxed text-white/65 sm:text-[15.5px]"
                  initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.14, duration: 0.45 }}
                >
                  {current.help}
                </motion.p>
              </motion.div>
            </AnimatePresence>

            <div className={styles.helpDots} aria-hidden>
              {HELPS.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  aria-label={item.title}
                  onClick={() => setActive(index)}
                  className={`${styles.helpDot} ${index === active ? styles.helpDotActive : ""}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
