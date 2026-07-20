"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CheckCircle2, LockOpen, Sparkles, Trophy } from "lucide-react";
import Link from "next/link";
import { useCelebrationStore } from "@/store/use-celebration-store";
import { celebrateWeekComplete } from "@/lib/confetti";
import { playUnlockSound } from "@/lib/game-sounds";
import { hasWeekBeenCelebrated, markWeekCelebrated } from "@/lib/week-celebration-storage";
import { Button } from "@/components/ui/button";
import { MODULE_LABELS, UNIFIED_WEEK_MODULES } from "@/lib/module-progress";

const SECTIONS = [
  ...UNIFIED_WEEK_MODULES.filter((m) => m !== "practice").map((m) => MODULE_LABELS[m]),
  MODULE_LABELS.communication,
];

export function WeekCompletionCelebration() {
  const active = useCelebrationStore((s) => s.active);
  const dismiss = useCelebrationStore((s) => s.dismiss);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, dismiss]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {active && (
        <motion.div
          key={`week-celebration-${active.completedWeekId}`}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <motion.button
            type="button"
            aria-label="Dismiss celebration"
            className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={dismiss}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="week-celebration-title"
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-indigo-500/30 bg-gradient-to-b from-indigo-950/90 via-zinc-900 to-zinc-950 p-6 shadow-2xl shadow-indigo-500/20 sm:p-8"
            initial={{ scale: 0.82, y: 40, opacity: 0, rotateX: 12 }}
            animate={{ scale: 1, y: 0, opacity: 1, rotateX: 0 }}
            exit={{ scale: 0.92, y: 24, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
          >
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-violet-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-cyan-500/15 blur-3xl" />

            <div className="relative flex flex-col items-center text-center">
              <motion.div
                className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl border border-amber-400/40 bg-gradient-to-br from-amber-400/25 to-orange-500/10 shadow-lg shadow-amber-500/20"
                initial={{ scale: 0, rotate: -24 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 14, delay: 0.1 }}
              >
                <motion.div
                  animate={{ rotate: [0, -8, 8, 0], scale: [1, 1.08, 1] }}
                  transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 1.2 }}
                >
                  <Trophy className="h-10 w-10 text-amber-300" />
                </motion.div>
              </motion.div>

              <motion.p
                className="mb-1 inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-indigo-300"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Sparkles className="h-3.5 w-3.5" />
                Milestone unlocked
              </motion.p>

              <motion.h2
                id="week-celebration-title"
                className="text-2xl font-bold tracking-tight text-zinc-50 sm:text-3xl"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                {active.weekEmoji ? `${active.weekEmoji} ` : ""}
                Week {active.completedWeekId} Complete!
              </motion.h2>

              <motion.p
                className="mt-2 max-w-sm text-sm text-zinc-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.32 }}
              >
                {active.weekTitle} — finished across Practice, Projects, AI Skills, Interview,
                Communication & more.
              </motion.p>

              <motion.ul
                className="mt-5 grid w-full grid-cols-2 gap-2 text-left sm:grid-cols-3"
                initial="hidden"
                animate="show"
                variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: 0.06, delayChildren: 0.4 } },
                }}
              >
                {SECTIONS.map((label) => (
                  <motion.li
                    key={label}
                    variants={{
                      hidden: { opacity: 0, x: -10, scale: 0.95 },
                      show: { opacity: 1, x: 0, scale: 1 },
                    }}
                    className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-2"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                    <span className="truncate text-[11px] font-medium text-zinc-200">{label}</span>
                  </motion.li>
                ))}
              </motion.ul>

              {active.nextWeekId && (
                <motion.div
                  className="mt-5 flex items-center gap-2 rounded-xl border border-violet-500/25 bg-violet-500/10 px-4 py-2.5"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.75, type: "spring" }}
                >
                  <LockOpen className="h-4 w-4 text-violet-300" />
                  <span className="text-sm font-semibold text-violet-200">
                    Week {active.nextWeekId} is now open everywhere
                  </span>
                </motion.div>
              )}

              <motion.div
                className="mt-6 flex w-full flex-col gap-2 sm:flex-row sm:justify-center"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.85 }}
              >
                {active.nextWeekId ? (
                  <Link href={`/roadmap/week/${active.nextWeekId}`} className="w-full sm:w-auto" onClick={dismiss}>
                    <Button variant="gradient" className="h-11 w-full gap-2 px-6 font-semibold">
                      Start Week {active.nextWeekId}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                ) : null}
                <Button variant="outline" className="h-11 w-full sm:w-auto" onClick={dismiss}>
                  Keep exploring
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export function fireWeekCelebration(payload: {
  completedWeekId: number;
  nextWeekId: number | null;
  weekTitle: string;
  weekEmoji?: string;
}) {
  if (hasWeekBeenCelebrated(payload.completedWeekId)) return;

  markWeekCelebrated(payload.completedWeekId);
  celebrateWeekComplete(payload.completedWeekId);
  playUnlockSound();
  useCelebrationStore.getState().showWeekComplete(payload);

  if (payload.nextWeekId) {
    try {
      sessionStorage.setItem(
        "module-unlock-celebrate",
        JSON.stringify({ module: "practice", weekId: payload.nextWeekId })
      );
    } catch {
      /* ignore */
    }
  }
}
