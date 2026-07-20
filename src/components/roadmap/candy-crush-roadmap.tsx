"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Boxes,
  Brain,
  CheckCircle2,
  ChevronRight,
  Cloud,
  Coffee,
  Cpu,
  Database,
  FileCode,
  GitBranch,
  GraduationCap,
  Layers,
  Leaf,
  Library,
  Lock,
  Network,
  Route,
  ShieldCheck,
  Target,
  Trophy,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import type { CurriculumWeekDefinition } from "@/curriculum/types";
import { WEEK_ROADMAP_CURRICULUM } from "@/curriculum/java-roadmap/curriculum";
import { cn } from "@/lib/utils";
import { useStoreHydrated } from "@/hooks/use-store-hydrated";
import { playUnlockSound } from "@/lib/game-sounds";
import { getWeekRoadmapArt } from "@/lib/week-roadmap-art";
import {
  WeekRoadmapArt,
  WEEK_CARD_ART_MIN_HEIGHT,
  WEEK_CARD_ART_PADDING,
} from "@/components/roadmap/week-roadmap-art";

export interface CandyCrushRoadmapProps {
  weeks: CurriculumWeekDefinition[];
  currentWeekId: number;
  isLocked: (weekId: number) => boolean;
  isCompleted: (weekId: number) => boolean;
  getWeekProgress: (weekId: number) => { overall: { percentage: number } };
  completedCount: number;
  overallPct: number;
}

const CHALLENGES_PER_WEEK = { easy: 20, medium: 20, hard: 20, total: 60 };

const WEEK_META = Object.fromEntries(
  WEEK_ROADMAP_CURRICULUM.map((w) => [
    w.weekId,
    {
      title: w.title,
      description: w.description,
      badge: w.badge,
      topicCount: w.subtopics.length,
      theme: w.theme,
    },
  ])
);

const WEEK_ICONS: Record<number, LucideIcon> = {
  1: Coffee,
  2: Workflow,
  3: Boxes,
  4: FileCode,
  5: Library,
  6: Cpu,
  7: Brain,
  8: Network,
  9: Database,
  10: Leaf,
  11: ShieldCheck,
  12: GraduationCap,
};

const WEEK_THEME_STYLES: Record<
  string,
  {
    icon: string;
    ring: string;
    bg: string;
    gradient: string;
    glow: string;
    dot: string;
    progress: string;
  }
> = {
  "candy-blue": {
    icon: "text-sky-400",
    ring: "border-sky-500/40",
    bg: "bg-sky-500/10",
    gradient: "from-sky-500/20 via-sky-600/5 to-transparent",
    glow: "shadow-sky-500/25",
    dot: "bg-sky-400",
    progress: "bg-sky-400",
  },
  "candy-pink": {
    icon: "text-pink-400",
    ring: "border-pink-500/40",
    bg: "bg-pink-500/10",
    gradient: "from-pink-500/20 via-pink-600/5 to-transparent",
    glow: "shadow-pink-500/25",
    dot: "bg-pink-400",
    progress: "bg-pink-400",
  },
  "candy-purple": {
    icon: "text-violet-400",
    ring: "border-violet-500/40",
    bg: "bg-violet-500/10",
    gradient: "from-violet-500/20 via-violet-600/5 to-transparent",
    glow: "shadow-violet-500/25",
    dot: "bg-violet-400",
    progress: "bg-violet-400",
  },
  "candy-cyan": {
    icon: "text-cyan-400",
    ring: "border-cyan-500/40",
    bg: "bg-cyan-500/10",
    gradient: "from-cyan-500/20 via-cyan-600/5 to-transparent",
    glow: "shadow-cyan-500/25",
    dot: "bg-cyan-400",
    progress: "bg-cyan-400",
  },
  "candy-gold": {
    icon: "text-amber-400",
    ring: "border-amber-500/40",
    bg: "bg-amber-500/10",
    gradient: "from-amber-500/20 via-amber-600/5 to-transparent",
    glow: "shadow-amber-500/25",
    dot: "bg-amber-400",
    progress: "bg-amber-400",
  },
  "candy-teal": {
    icon: "text-teal-400",
    ring: "border-teal-500/40",
    bg: "bg-teal-500/10",
    gradient: "from-teal-500/20 via-teal-600/5 to-transparent",
    glow: "shadow-teal-500/25",
    dot: "bg-teal-400",
    progress: "bg-teal-400",
  },
  "candy-orange": {
    icon: "text-orange-400",
    ring: "border-orange-500/40",
    bg: "bg-orange-500/10",
    gradient: "from-orange-500/20 via-orange-600/5 to-transparent",
    glow: "shadow-orange-500/25",
    dot: "bg-orange-400",
    progress: "bg-orange-400",
  },
  "candy-red": {
    icon: "text-rose-400",
    ring: "border-rose-500/40",
    bg: "bg-rose-500/10",
    gradient: "from-rose-500/20 via-rose-600/5 to-transparent",
    glow: "shadow-rose-500/25",
    dot: "bg-rose-400",
    progress: "bg-rose-400",
  },
  "candy-indigo": {
    icon: "text-indigo-400",
    ring: "border-indigo-500/40",
    bg: "bg-indigo-500/10",
    gradient: "from-indigo-500/20 via-indigo-600/5 to-transparent",
    glow: "shadow-indigo-500/25",
    dot: "bg-indigo-400",
    progress: "bg-indigo-400",
  },
  "candy-green": {
    icon: "text-emerald-400",
    ring: "border-emerald-500/40",
    bg: "bg-emerald-500/10",
    gradient: "from-emerald-500/20 via-emerald-600/5 to-transparent",
    glow: "shadow-emerald-500/25",
    dot: "bg-emerald-400",
    progress: "bg-emerald-400",
  },
  "candy-royal": {
    icon: "text-purple-400",
    ring: "border-purple-500/40",
    bg: "bg-purple-500/10",
    gradient: "from-purple-500/20 via-purple-600/5 to-transparent",
    glow: "shadow-purple-500/25",
    dot: "bg-purple-400",
    progress: "bg-purple-400",
  },
};

const SKILL_PILLARS: { label: string; icon: LucideIcon; accent: string }[] = [
  { label: "Java & OOP", icon: Coffee, accent: "text-amber-400 bg-amber-500/10 ring-amber-500/20" },
  { label: "DSA", icon: Brain, accent: "text-violet-400 bg-violet-500/10 ring-violet-500/20" },
  { label: "Spring Boot", icon: Leaf, accent: "text-emerald-400 bg-emerald-500/10 ring-emerald-500/20" },
  { label: "SQL & JDBC", icon: Database, accent: "text-sky-400 bg-sky-500/10 ring-sky-500/20" },
  { label: "Git & Tools", icon: GitBranch, accent: "text-orange-400 bg-orange-500/10 ring-orange-500/20" },
  { label: "Cloud & DevOps", icon: Cloud, accent: "text-indigo-400 bg-indigo-500/10 ring-indigo-500/20" },
];

function StatPill({
  icon: Icon,
  children,
  dotColor,
  textColor = "text-zinc-400",
}: {
  icon?: LucideIcon;
  children: React.ReactNode;
  dotColor?: string;
  textColor?: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800/80 bg-zinc-950/60 px-2.5 py-1 text-[11px] font-medium backdrop-blur-sm">
      {dotColor ? (
        <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", dotColor)} />
      ) : Icon ? (
        <Icon className="h-3 w-3 shrink-0 text-zinc-500" />
      ) : null}
      <span className={textColor}>{children}</span>
    </span>
  );
}

function WeekBadge({
  children,
  variant,
}: {
  children: React.ReactNode;
  variant: "start" | "current" | "complete";
}) {
  return (
    <span
      className={cn(
        "inline-flex h-5 items-center rounded-full px-2 text-[10px] font-semibold uppercase tracking-wide",
        variant === "start" &&
          "border border-purple-500/40 bg-purple-500/10 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.15)]",
        variant === "current" &&
          "border border-indigo-500/50 bg-indigo-600/80 text-white shadow-[0_0_16px_rgba(99,102,241,0.35)]",
        variant === "complete" && "border border-emerald-500/30 bg-emerald-500/15 text-emerald-300"
      )}
    >
      {children}
    </span>
  );
}

function WeekModuleCard({
  week,
  index,
  locked,
  done,
  active,
  pct,
  justUnlocked,
  hydrated,
  isLast,
  prevDone,
}: {
  week: CurriculumWeekDefinition;
  index: number;
  locked: boolean;
  done: boolean;
  active: boolean;
  pct: number;
  justUnlocked: boolean;
  hydrated: boolean;
  isLast: boolean;
  prevDone: boolean;
}) {
  const meta = WEEK_META[week.id] ?? {
    title: week.title,
    description: "",
    badge: undefined,
    topicCount: 0,
    theme: "candy-indigo",
  };
  const Icon = WEEK_ICONS[week.id] ?? Layers;
  const themeStyle = WEEK_THEME_STYLES[meta.theme] ?? WEEK_THEME_STYLES["candy-indigo"];
  const weekArt = getWeekRoadmapArt(week.id);

  const cardInner = (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={!locked ? { y: -2 } : undefined}
      className={cn(
        "group relative overflow-hidden rounded-2xl border transition-all duration-300",
        locked && "border-zinc-800/60 bg-zinc-950/30 opacity-50",
        done && "border-emerald-500/20 bg-zinc-950/80",
        active &&
          cn(
            "border-indigo-500/30 bg-zinc-950/90 shadow-2xl",
            themeStyle.glow
          ),
        !locked &&
          !done &&
          !active &&
          "border-zinc-800/70 bg-zinc-950/70 hover:border-zinc-700 hover:shadow-xl hover:shadow-black/40"
      )}
    >
      {/* Ambient gradient wash */}
      {!locked && (
        <div
          className={cn(
            "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-60",
            themeStyle.gradient
          )}
        />
      )}

      {/* Top shimmer line on active */}
      {active && (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-400/60 to-transparent" />
      )}

      {justUnlocked && (
        <span className="absolute right-4 top-3 z-10 rounded-full bg-emerald-500 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-lg shadow-emerald-500/30">
          Unlocked
        </span>
      )}

      <div
        className={cn(
          "relative flex items-start gap-3 p-4 sm:gap-4 sm:p-5",
          weekArt && !locked && WEEK_CARD_ART_MIN_HEIGHT
        )}
      >
        {/* Icon tile */}
        <div
          className={cn(
            "relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border sm:h-16 sm:w-16",
            locked && "border-zinc-800 bg-zinc-900/80 text-zinc-600",
            done && "border-emerald-500/30 bg-gradient-to-br from-emerald-500/20 to-emerald-600/5 text-emerald-400 shadow-lg shadow-emerald-500/10",
            !locked &&
              !done &&
              cn(
                "border-white/5 bg-gradient-to-br shadow-lg",
                themeStyle.ring,
                themeStyle.bg,
                themeStyle.glow,
                themeStyle.icon
              )
          )}
        >
          {!locked && !done && (
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-white/5" />
          )}
          {locked ? (
            <Lock className="relative h-5 w-5" />
          ) : done ? (
            <CheckCircle2 className="relative h-6 w-6" />
          ) : (
            <Icon className="relative h-6 w-6 sm:h-7 sm:w-7" />
          )}
        </div>

        <div
          className={cn(
            "min-w-0 flex-1",
            weekArt && !locked && WEEK_CARD_ART_PADDING
          )}
        >
          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-500">
              Week {week.id}
            </span>
            {meta.badge && !locked && <WeekBadge variant="start">{meta.badge}</WeekBadge>}
            {active && <WeekBadge variant="current">Current</WeekBadge>}
            {done && <WeekBadge variant="complete">Complete</WeekBadge>}
          </div>

          <h3
            className={cn(
              "mt-1.5 text-lg font-bold tracking-tight sm:text-xl",
              locked ? "text-zinc-600" : "text-zinc-50"
            )}
          >
            {meta.title}
          </h3>

          {locked && (
            <p className="mt-2 text-sm text-zinc-500">
              🔒 Locked — finish Week {week.id - 1} in every section to unlock.
            </p>
          )}

          {!locked && meta.description && (
            <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-zinc-500">{meta.description}</p>
          )}

          {!locked && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              <StatPill icon={Layers}>{meta.topicCount} topics</StatPill>
              <StatPill icon={Target}>{CHALLENGES_PER_WEEK.total} challenges</StatPill>
              <StatPill dotColor="bg-emerald-400" textColor="text-emerald-400">
                {CHALLENGES_PER_WEEK.easy} Easy
              </StatPill>
              <StatPill dotColor="bg-amber-400" textColor="text-amber-400">
                {CHALLENGES_PER_WEEK.medium} Med
              </StatPill>
              <StatPill dotColor="bg-rose-400" textColor="text-rose-400">
                {CHALLENGES_PER_WEEK.hard} Hard
              </StatPill>
            </div>
          )}
        </div>

        {!locked && weekArt ? (
          <WeekRoadmapArt src={weekArt} />
        ) : !locked ? (
          <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-zinc-800/80 bg-zinc-900/80 text-zinc-500 transition-all duration-300 group-hover:border-zinc-700 group-hover:bg-zinc-800 group-hover:text-zinc-200 group-hover:shadow-md">
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </div>
        ) : null}
      </div>

      {/* Progress footer */}
      {!locked && hydrated && (
        <div className="relative border-t border-zinc-800/60 bg-zinc-950/40 px-4 py-2.5 sm:px-5">
          <div className="flex items-center gap-3">
            <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-800/80">
              <motion.div
                className={cn("absolute inset-y-0 left-0 rounded-full", done ? "bg-emerald-400" : themeStyle.progress)}
                initial={{ width: 0 }}
                whileInView={{ width: `${pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.05 }}
              />
            </div>
            <span className="min-w-[2.5rem] text-right text-xs font-semibold tabular-nums text-zinc-400">
              {pct}%
            </span>
          </div>
        </div>
      )}
    </motion.article>
  );

  const card = cardInner;

  return (
    <li className="relative flex gap-3 sm:gap-6">
      {/* Timeline rail */}
      <div className="relative flex w-10 shrink-0 flex-col items-center sm:w-12">
        <div className="relative">
          {active && (
            <span
              className={cn(
                "absolute inset-0 animate-ping rounded-full opacity-40",
                themeStyle.bg.replace("/10", "/30")
              )}
            />
          )}
          <div
            className={cn(
              "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 bg-zinc-950 transition-all duration-300 sm:h-11 sm:w-11",
              locked && "border-zinc-800 text-zinc-600",
              done && "border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/20",
              active &&
                cn(
                  "border-indigo-400 bg-indigo-500/15 shadow-lg shadow-indigo-500/40",
                  "ring-4 ring-indigo-500/10"
                ),
              !locked &&
                !done &&
                !active &&
                cn("border-zinc-700 bg-zinc-900 shadow-md", themeStyle.ring)
            )}
          >
            {done ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-400 sm:h-5 sm:w-5" />
            ) : active ? (
              <span className={cn("h-2.5 w-2.5 rounded-full shadow-lg", themeStyle.dot, themeStyle.glow)} />
            ) : locked ? (
              <Lock className="h-3.5 w-3.5 text-zinc-600" />
            ) : (
              <Icon className={cn("h-4 w-4 sm:h-[18px] sm:w-[18px]", themeStyle.icon)} />
            )}
          </div>
        </div>
        {!isLast && (
          <div className="relative mt-2 w-px flex-1 min-h-[32px]">
            <div className="absolute inset-0 bg-zinc-800/80" />
            <motion.div
              className="absolute inset-x-0 top-0 w-px origin-top bg-gradient-to-b from-indigo-500/80 to-indigo-500/20"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: prevDone || done ? 1 : 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              style={{ height: "100%" }}
            />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1 pb-10">
        {locked ? card : (
          <Link
            href={`/roadmap/week/${week.id}`}
            className="block rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
          >
            {card}
          </Link>
        )}
      </div>
    </li>
  );
}

export function CandyCrushRoadmap({
  weeks,
  currentWeekId,
  isLocked,
  isCompleted,
  getWeekProgress,
  completedCount,
  overallPct,
}: CandyCrushRoadmapProps) {
  const hydrated = useStoreHydrated();
  const prevLockedRef = useRef<Record<number, boolean>>({});
  const [justUnlockedId, setJustUnlockedId] = useState<number | null>(null);

  useEffect(() => {
    if (!hydrated) return;
    let unlocked: number | null = null;
    weeks.forEach((week) => {
      const was = prevLockedRef.current[week.id];
      const now = isLocked(week.id);
      if (was === true && !now && week.id > 1) unlocked = week.id;
      prevLockedRef.current[week.id] = now;
    });
    if (unlocked) {
      setJustUnlockedId(unlocked);
      playUnlockSound();
      const t = window.setTimeout(() => setJustUnlockedId(null), 2500);
      return () => window.clearTimeout(t);
    }
  }, [weeks, isLocked, hydrated]);

  const totalWeeks = weeks.length;
  const displayPct = hydrated ? overallPct : 0;
  const displayCompleted = hydrated ? completedCount : 0;

  return (
    <div className="min-h-screen bg-zinc-950 pb-16">
      <div className="mx-auto max-w-4xl px-4 pt-8 sm:px-6 lg:pt-10">
        <header className="mb-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex flex-col gap-4">
              <h1 className="text-2xl font-bold tracking-tight text-zinc-50 sm:text-3xl">Java Roadmap</h1>
              <div className="inline-flex w-fit items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-indigo-500/30 bg-indigo-500/10">
                  <Trophy className="h-5 w-5 text-indigo-400" />
                </div>
                <div>
                  <p className="text-xl font-bold tabular-nums text-zinc-100" suppressHydrationWarning>
                    {hydrated ? `${displayPct}%` : "\u00a0"}
                  </p>
                  <p className="text-xs text-zinc-500" suppressHydrationWarning>
                    {hydrated
                      ? `${displayCompleted} of ${totalWeeks} weeks done`
                      : "\u00a0"}
                  </p>
                </div>
              </div>
            </div>

            <div className="relative w-full lg:max-w-md lg:pt-1">
              <div className="pointer-events-none absolute -inset-3 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-violet-500/5 to-cyan-500/10 blur-xl" />
              <h2 className="relative mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 lg:justify-end">
                <Layers className="h-3.5 w-3.5 text-indigo-400" />
                What you will learn
              </h2>
              <div className="relative grid grid-cols-3 gap-2 lg:ml-auto">
                {SKILL_PILLARS.map(({ label, icon: Icon, accent }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800/90 bg-zinc-900/60 px-2.5 py-2 text-[11px] font-medium text-zinc-200 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] backdrop-blur-sm transition-colors hover:border-indigo-500/30 hover:bg-zinc-900/80 sm:gap-2 sm:px-3 sm:text-xs"
                  >
                    <span className={cn("flex h-5 w-5 shrink-0 items-center justify-center rounded-md ring-1 sm:h-6 sm:w-6", accent)}>
                      <Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    </span>
                    <span className="truncate">{label}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </header>

        <section>
          <h2 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            <Route className="h-3.5 w-3.5" />
            Weekly modules
          </h2>
          <ol className="list-none">
            {weeks.map((week, index) => {
              const locked = hydrated ? isLocked(week.id) : week.id > 1;
              const done = hydrated && isCompleted(week.id);
              const active = hydrated
                ? !locked && !done && week.id === currentWeekId
                : week.id === 1;
              const prevDone = hydrated
                ? index === 0 || isCompleted(weeks[index - 1].id)
                : false;

              return (
                <WeekModuleCard
                  key={week.id}
                  week={week}
                  index={index}
                  locked={locked}
                  done={done}
                  active={active}
                  pct={hydrated ? getWeekProgress(week.id).overall.percentage : 0}
                  justUnlocked={hydrated && justUnlockedId === week.id}
                  hydrated={hydrated}
                  isLast={index === weeks.length - 1}
                  prevDone={prevDone}
                />
              );
            })}
          </ol>
        </section>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className={cn(
            "mt-2 flex items-center gap-4 rounded-xl border p-5",
            completedCount === totalWeeks && hydrated
              ? "border-amber-500/30 bg-amber-500/5"
              : "border-zinc-800/90 bg-zinc-900/30"
          )}
        >
          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border",
              completedCount === totalWeeks && hydrated
                ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                : "border-zinc-800 bg-zinc-900 text-zinc-600"
            )}
          >
            <GraduationCap className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-zinc-200">Backend Developer Certificate</h3>
            <p className="mt-0.5 text-sm text-zinc-500">
              Complete all {totalWeeks} weeks — {totalWeeks * CHALLENGES_PER_WEEK.total} challenges — to graduate.
            </p>
          </div>
          {completedCount < totalWeeks && (
            <ArrowRight className="hidden h-5 w-5 shrink-0 text-zinc-700 sm:block" />
          )}
        </motion.div>
      </div>
    </div>
  );
}
