"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Lock, Map, Sparkles, Star, Trophy, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStoreHydrated } from "@/hooks/use-store-hydrated";
import { playUnlockSound } from "@/lib/game-sounds";
import { Progress } from "@/components/ui/progress";
import type {
  JourneyMapNode,
  RoadmapJourneyMapProps,
} from "@/components/roadmap/journey-map-types";

export type { JourneyMapNode, RoadmapJourneyMapProps };

function shortTitle(title: string): string {
  return title.split("+")[0]?.split("—")[0]?.trim() ?? title;
}

function starCount(pct: number, done: boolean): number {
  if (done || pct >= 100) return 3;
  if (pct >= 66) return 2;
  if (pct > 0) return 1;
  return 0;
}

function UnlockParticles() {
  const angles = Array.from({ length: 12 }, (_, i) => i * 30);
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      {angles.map((deg) => (
        <motion.span
          key={deg}
          className="absolute h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]"
          initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
          animate={{
            x: Math.cos((deg * Math.PI) / 180) * 56,
            y: Math.sin((deg * Math.PI) / 180) * 56,
            scale: [0, 1.2, 0],
            opacity: [1, 1, 0],
          }}
          transition={{ duration: 0.75, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

function LevelNode({
  node,
  index,
  locked,
  done,
  active,
  pct,
  justUnlocked,
  nodeLabel,
}: {
  node: JourneyMapNode;
  index: number;
  locked: boolean;
  done: boolean;
  active: boolean;
  pct: number;
  justUnlocked: boolean;
  nodeLabel: string;
}) {
  const stars = starCount(pct, done);
  const label = shortTitle(node.title);

  const content = (
    <motion.div
      layout
      initial={justUnlocked ? { scale: 0.2, opacity: 0 } : { scale: 0.9, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={
        justUnlocked
          ? { type: "spring", stiffness: 320, damping: 16 }
          : { delay: index * 0.05, duration: 0.4, ease: "easeOut" }
      }
      className="relative flex flex-col items-center text-center"
    >
      <AnimatePresence>
        {justUnlocked && (
          <>
            <UnlockParticles />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4 }}
              className="absolute -top-10 z-20 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-200 ring-1 ring-amber-400/40 shadow-lg shadow-amber-500/20"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Level Unlocked!
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="relative">
        {active && (
          <>
            <motion.span
              className="absolute -inset-3 rounded-full bg-indigo-500/25"
              animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.span
              className="absolute -inset-1 rounded-full ring-2 ring-indigo-400/50"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
          </>
        )}

        {justUnlocked && (
          <motion.span
            className="absolute -inset-4 rounded-full bg-amber-400/20"
            initial={{ scale: 0.5, opacity: 0.8 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          />
        )}

        <motion.div
          animate={
            justUnlocked
              ? { rotate: [0, -8, 8, -4, 4, 0], scale: [1, 1.12, 1] }
              : active
                ? { y: [0, -4, 0] }
                : {}
          }
          transition={
            justUnlocked
              ? { duration: 0.55 }
              : active
                ? { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
                : {}
          }
          className={cn(
            "relative flex h-[4.75rem] w-[4.75rem] items-center justify-center rounded-full border-[3px] shadow-xl sm:h-[5.25rem] sm:w-[5.25rem]",
            locked && "border-zinc-700/80 bg-zinc-900/95 text-zinc-600 shadow-none",
            done &&
              "border-emerald-400/90 bg-gradient-to-br from-emerald-600/30 via-zinc-900 to-zinc-950 text-emerald-300 shadow-emerald-500/25",
            active &&
              "border-indigo-300 bg-gradient-to-br from-indigo-500 via-violet-600 to-purple-700 text-white shadow-indigo-500/50",
            justUnlocked &&
              "border-amber-400/90 bg-gradient-to-br from-amber-500/40 via-violet-600 to-indigo-700 text-white shadow-amber-500/40",
            !locked &&
              !done &&
              !active &&
              !justUnlocked &&
              "border-indigo-500/60 bg-gradient-to-br from-zinc-900 via-indigo-950/70 to-zinc-950 text-indigo-200"
          )}
        >
          {locked ? (
            <Lock className="h-7 w-7" strokeWidth={2} />
          ) : done ? (
            <Check className="h-9 w-9" strokeWidth={2.5} />
          ) : (
            <span className="text-3xl font-extrabold tabular-nums">{node.id}</span>
          )}
        </motion.div>

        {active && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-indigo-500 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-lg"
          >
            Play
          </motion.span>
        )}
      </div>

      <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500">
        {nodeLabel} {node.id}
      </p>
      <p
        className={cn(
          "mt-1 max-w-[220px] text-[13px] font-semibold leading-snug sm:max-w-[260px] sm:text-sm",
          locked ? "text-zinc-600" : "text-zinc-100"
        )}
      >
        {label}
      </p>

      {!locked && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 + index * 0.04 }}
          className="mt-2 flex items-center justify-center gap-1"
        >
          {[1, 2, 3].map((s) => (
            <Star
              key={s}
              className={cn(
                "h-3.5 w-3.5 transition-colors",
                s <= stars ? "fill-amber-400 text-amber-400" : "text-zinc-700"
              )}
            />
          ))}
          <span className="ml-1 text-[11px] tabular-nums text-zinc-500">{pct}%</span>
        </motion.div>
      )}
    </motion.div>
  );

  if (locked) return content;

  return (
    <Link href={node.href} className="group block outline-none">
      <div className="rounded-2xl px-2 py-1 transition-transform duration-200 group-hover:scale-[1.03] group-active:scale-[0.98]">
        {content}
      </div>
    </Link>
  );
}

function VerticalPath({ filled, index }: { filled: boolean; index: number }) {
  return (
    <div className="relative mx-auto flex h-14 w-8 items-center justify-center">
      <div className="absolute h-full w-1 rounded-full bg-zinc-800/90" />
      <motion.div
        className="absolute top-0 w-1 origin-top rounded-full bg-gradient-to-b from-indigo-400 to-violet-500"
        initial={{ height: 0, opacity: 0.3 }}
        animate={{ height: filled ? "100%" : "0%", opacity: filled ? 1 : 0.25 }}
        transition={{ duration: 0.7, delay: index * 0.04, ease: "easeInOut" }}
      />
      {filled && (
        <motion.span
          className="absolute bottom-0 h-2 w-2 rounded-full bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.7)]"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.4, 1] }}
          transition={{ duration: 0.4, delay: index * 0.04 + 0.3 }}
        />
      )}
    </div>
  );
}

/**
 * Vertical adventure / timeline map — shared by week roadmap and curriculum phases.
 */
export function RoadmapJourneyMap({
  nodes,
  currentNodeId,
  isLocked,
  isCompleted,
  getNodeProgress,
  completedCount,
  overallPct,
  mapLabel = "Adventure Map",
  nodeLabel = "Level",
  finaleTitle = "Full Stack Graduate",
  finaleSubtitle,
  showSkillRoadmapLink = false,
}: RoadmapJourneyMapProps) {
  const hydrated = useStoreHydrated();
  const prevLockedRef = useRef<Record<number, boolean>>({});
  const [justUnlockedId, setJustUnlockedId] = useState<number | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (!hydrated) return;

    let unlocked: number | null = null;
    nodes.forEach((node) => {
      const wasLocked = prevLockedRef.current[node.id];
      const nowLocked = isLocked(node.id);
      if (wasLocked === true && !nowLocked && node.id > 1) unlocked = node.id;
      prevLockedRef.current[node.id] = nowLocked;
    });

    if (unlocked === null) return;

    setJustUnlockedId(unlocked);
    setShowCelebration(true);
    playUnlockSound();

    const t1 = window.setTimeout(() => setShowCelebration(false), 2400);
    const t2 = window.setTimeout(() => setJustUnlockedId(null), 3500);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [nodes, isLocked, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    nodes.forEach((node) => {
      if (prevLockedRef.current[node.id] === undefined) {
        prevLockedRef.current[node.id] = isLocked(node.id);
      }
    });
  }, [nodes, isLocked, hydrated]);

  return (
    <div className="relative min-h-[calc(100vh-5rem)] overflow-hidden rounded-2xl border border-zinc-800/50 bg-gradient-to-b from-zinc-950 via-indigo-950/15 to-zinc-950">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 0%, rgba(99,102,241,0.14) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(168,85,247,0.08) 0%, transparent 40%)",
        }}
      />

      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute inset-0 z-30 bg-amber-500/[0.06]"
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 px-4 pb-16 pt-6 sm:px-6 sm:pt-8">
        <div className="mx-auto mb-8 flex max-w-md flex-col items-center gap-3">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <div className="flex items-center gap-2 rounded-full border border-indigo-500/25 bg-indigo-500/10 px-3 py-1">
              <Zap className="h-3.5 w-3.5 text-indigo-300" />
              <span className="text-xs font-bold text-indigo-200">{mapLabel}</span>
            </div>
            {showSkillRoadmapLink ? (
              <Link
                href="/roadmap"
                className="flex items-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-200 transition-colors hover:bg-amber-500/20"
              >
                <Map className="h-3.5 w-3.5" />
                Skill Roadmap
              </Link>
            ) : null}
          </div>

          <div className="w-full max-w-xs rounded-2xl border border-zinc-800/70 bg-zinc-900/50 px-4 py-3 backdrop-blur-sm">
            <div className="mb-2 flex items-center justify-between text-[11px]">
              <span className="font-semibold text-zinc-400">
                {nodeLabel} {currentNodeId} · {completedCount}/{nodes.length}{" "}
                cleared
              </span>
              <span className="tabular-nums font-bold text-indigo-300">
                {overallPct}%
              </span>
            </div>
            <Progress value={overallPct} className="h-2" />
          </div>
        </div>

        <div className="relative mx-auto flex max-w-md flex-col items-center">
          {nodes.map((node, index) => {
            const locked = isLocked(node.id);
            const done = isCompleted(node.id);
            const active = !locked && !done && node.id === currentNodeId;
            const pct = getNodeProgress(node.id).overall.percentage;
            const prevDone = index > 0 && isCompleted(nodes[index - 1]!.id);

            return (
              <div key={node.id} className="flex w-full flex-col items-center">
                {index > 0 && <VerticalPath filled={prevDone} index={index} />}
                <LevelNode
                  node={node}
                  index={index}
                  locked={locked}
                  done={done}
                  active={active}
                  pct={pct}
                  justUnlocked={justUnlockedId === node.id}
                  nodeLabel={nodeLabel}
                />
              </div>
            );
          })}

          <VerticalPath
            filled={completedCount === nodes.length}
            index={nodes.length}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: nodes.length * 0.05 + 0.15 }}
            className="mt-4 flex flex-col items-center rounded-2xl border border-dashed border-amber-500/25 bg-amber-500/5 px-6 py-4 text-center"
          >
            <Trophy className="h-8 w-8 text-amber-400/80" />
            <p className="mt-2 text-sm font-bold text-zinc-200">{finaleTitle}</p>
            <p className="mt-0.5 text-[11px] text-zinc-500">
              {finaleSubtitle ?? `Beat all ${nodes.length} levels to win`}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
