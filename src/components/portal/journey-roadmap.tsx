"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock,
  Database,
  FolderKanban,
  GitBranch,
  Layers,
  Lock,
  Server,
  Sparkles,
  Target,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import { PortalChrome } from "@/components/portal/portal-chrome";
import {
  WeekRoadmapArt,
  WEEK_CARD_ART_MIN_HEIGHT,
  WEEK_CARD_ART_PADDING,
} from "@/components/roadmap/week-roadmap-art";
import { getWeekRoadmapArt } from "@/lib/week-roadmap-art";
import { cn } from "@/lib/utils";
import { CURRICULUM_ROUTES } from "@/features/curriculum/types";
import {
  isProgrammingFundamentalsModule,
  programmingFundamentalsChallengeCounts,
  PROGRAMMING_FUNDAMENTALS_TOPICS,
} from "@/features/curriculum/lib/programming-fundamentals";
import {
  developerToolingChallengeCounts,
  isDeveloperToolingModule,
} from "@/features/curriculum/lib/developer-tooling";
import {
  flattenToolingTopics,
} from "@/features/curriculum/lib/developer-tooling-curriculum";
import {
  htmlAcademyChallengeCounts,
  isHtmlAcademyModule,
} from "@/features/curriculum/lib/html-academy";
import { flattenHtmlTopics } from "@/features/curriculum/lib/html-academy-curriculum";
import {
  cssAcademyChallengeCounts,
  isCssAcademyModule,
} from "@/features/curriculum/lib/css-academy";
import { flattenCssTopics } from "@/features/curriculum/lib/css-academy-curriculum";
import {
  jsAcademyChallengeCounts,
  isJsAcademyModule,
} from "@/features/curriculum/lib/js-academy";
import { flattenJsTopics } from "@/features/curriculum/lib/js-academy-curriculum";
import {
  reactAcademyChallengeCounts,
  isReactAcademyModule,
} from "@/features/curriculum/lib/react-academy";
import { flattenReactTopics } from "@/features/curriculum/lib/react-academy-curriculum";
import {
  nextjsAcademyChallengeCounts,
  isNextjsAcademyModule,
} from "@/features/curriculum/lib/nextjs-academy";
import { flattenNextjsTopics } from "@/features/curriculum/lib/nextjs-academy-curriculum";
import {
  typescriptAcademyChallengeCounts,
  isTypescriptAcademyModule,
} from "@/features/curriculum/lib/typescript-academy";
import { flattenTypescriptTopics } from "@/features/curriculum/lib/typescript-academy-curriculum";
import {
  apisAcademyChallengeCounts,
  isApisAcademyModule,
} from "@/features/curriculum/lib/apis-academy";
import { flattenApisTopics } from "@/features/curriculum/lib/apis-academy-curriculum";
import {
  authAcademyChallengeCounts,
  isAuthAcademyModule,
} from "@/features/curriculum/lib/auth-academy";
import { flattenAuthTopics } from "@/features/curriculum/lib/auth-academy-curriculum";
import {
  sqlAcademyChallengeCounts,
  isSqlAcademyModule,
} from "@/features/curriculum/lib/sql-academy";
import { flattenSqlTopics } from "@/features/curriculum/lib/sql-academy-curriculum";
import {
  modelingAcademyChallengeCounts,
  isModelingAcademyModule,
} from "@/features/curriculum/lib/modeling-academy";
import { flattenModelingTopics } from "@/features/curriculum/lib/modeling-academy-curriculum";
import {
  deploymentAcademyChallengeCounts,
  isDeploymentAcademyModule,
} from "@/features/curriculum/lib/deployment-academy";
import { flattenDeploymentTopics } from "@/features/curriculum/lib/deployment-academy-curriculum";
import {
  cicdAcademyChallengeCounts,
  isCicdAcademyModule,
} from "@/features/curriculum/lib/cicd-academy";
import { flattenCicdTopics } from "@/features/curriculum/lib/cicd-academy-curriculum";
import {
  llmAcademyChallengeCounts,
  isLlmAcademyModule,
} from "@/features/curriculum/lib/llm-academy";
import { flattenLlmTopics } from "@/features/curriculum/lib/llm-academy-curriculum";
import {
  aiFeaturesAcademyChallengeCounts,
  isAiFeaturesAcademyModule,
} from "@/features/curriculum/lib/ai-features-academy";
import { flattenAiFeaturesTopics } from "@/features/curriculum/lib/ai-features-academy-curriculum";
import {
  capstoneAcademyChallengeCounts,
  isCapstoneAcademyModule,
} from "@/features/curriculum/lib/capstone-academy";
import { flattenCapstoneTopics } from "@/features/curriculum/lib/capstone-academy-curriculum";
import {
  shipAcademyChallengeCounts,
  isShipAcademyModule,
} from "@/features/curriculum/lib/ship-academy";
import { flattenShipTopics } from "@/features/curriculum/lib/ship-academy-curriculum";
import {
  interviewAcademyChallengeCounts,
  isInterviewAcademyModule,
} from "@/features/curriculum/lib/interview-academy";
import { flattenInterviewTopics } from "@/features/curriculum/lib/interview-academy-curriculum";
import {
  systemsAcademyChallengeCounts,
  isSystemsAcademyModule,
} from "@/features/curriculum/lib/systems-academy";
import { flattenSystemsTopics } from "@/features/curriculum/lib/systems-academy-curriculum";
import type {
  CourseJourney,
  LessonDifficulty,
  ModuleSummary,
  PhaseWithModules,
} from "@/features/curriculum/types";

type JourneyRoadmapProps = {
  journey: CourseJourney;
  assignmentLessonIds?: string[];
  projectModuleIds?: string[];
};

type ModuleCardModel = {
  module: ModuleSummary;
  phase: PhaseWithModules;
  index: number;
  globalIndex: number;
  locked: boolean;
  done: boolean;
  active: boolean;
  href: string;
  assignmentCount: number;
  hasProject: boolean;
  easy: number;
  medium: number;
  hard: number;
  challengeTotal: number | null;
  topicCount: number;
  durationLabel: string;
  isInterviewPrep: boolean;
};

const THEME_KEYS = [
  "candy-indigo",
  "candy-purple",
  "candy-cyan",
  "candy-teal",
  "candy-blue",
  "candy-green",
  "candy-gold",
  "candy-orange",
  "candy-pink",
  "candy-red",
  "candy-royal",
] as const;

const THEME_STYLES: Record<
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

const PILLAR_ICONS: LucideIcon[] = [
  BookOpen,
  Layers,
  Server,
  Database,
  GitBranch,
  Sparkles,
];

const PILLAR_THEMES = [
  // Foundation — strong cyan (high contrast on light cream)
  {
    chip: "bg-cyan-600 text-white shadow-sm shadow-cyan-600/25",
    card: "border-cyan-600/40 bg-cyan-500/15",
  },
  {
    chip: "bg-violet-600 text-white shadow-sm shadow-violet-600/25",
    card: "border-violet-600/40 bg-violet-500/15",
  },
  {
    chip: "bg-emerald-600 text-white shadow-sm shadow-emerald-600/25",
    card: "border-emerald-600/40 bg-emerald-500/15",
  },
  // Database — strong blue (high contrast on light cream)
  {
    chip: "bg-blue-600 text-white shadow-sm shadow-blue-600/25",
    card: "border-blue-600/40 bg-blue-500/15",
  },
  {
    chip: "bg-rose-600 text-white shadow-sm shadow-rose-600/25",
    card: "border-rose-600/40 bg-rose-500/15",
  },
  {
    chip: "bg-indigo-600 text-white shadow-sm shadow-indigo-600/25",
    card: "border-indigo-600/40 bg-indigo-500/15",
  },
] as const;

/** Keep pillar chips readable in a tight 3-col grid without ellipsis. */
function shortenPillarLabel(title: string): string {
  const cleaned = title
    .replace(/\s+Development$/i, "")
    .replace(/^Developer\s+/i, "")
    .replace(/^Database\s+Engineering$/i, "Database")
    .replace(/^AI\s+Engineering$/i, "AI")
    .trim();
  return cleaned || title;
}

export function JourneyRoadmap({
  journey,
  assignmentLessonIds = [],
  projectModuleIds = [],
}: JourneyRoadmapProps) {
  const assignmentSet = new Set(assignmentLessonIds);
  const projectSet = new Set(projectModuleIds);

  const cards = buildModuleCards(journey, assignmentSet, projectSet);
  const completedModules = cards.filter((c) => c.done).length;
  const totalModules = cards.length;
  const remaining = journey.totalCount - journey.completedCount;

  const pillars = journey.phases.slice(0, 6).map((phase, i) => ({
    label: phase.title,
    shortLabel: shortenPillarLabel(phase.title),
    icon: PILLAR_ICONS[i % PILLAR_ICONS.length]!,
    theme: PILLAR_THEMES[i % PILLAR_THEMES.length]!,
  }));

  return (
    <>
      <PortalChrome title="Roadmap" fillViewport />
      <div className="h-full min-h-0 overflow-y-auto bg-zinc-950">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:py-8">
          <header className="mb-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
              <div className="flex min-w-0 flex-1 flex-col gap-4">
                <h1 className="text-2xl font-bold tracking-tight text-zinc-50 sm:text-3xl">
                  {journey.course.title}
                </h1>
                <div className="inline-flex w-fit items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-indigo-500/30 bg-indigo-500/10">
                    <Trophy className="h-5 w-5 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-xl font-bold tabular-nums text-zinc-50">
                      {journey.progressPercent}%
                    </p>
                    <p className="text-xs text-zinc-500">
                      {completedModules} of {totalModules} modules · {remaining}{" "}
                      lessons left
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-full shrink-0 lg:w-[22.5rem]">
                <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
                  What you will learn
                </p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {pillars.map((pillar) => {
                    const Icon = pillar.icon;
                    return (
                      <span
                        key={pillar.label}
                        title={pillar.label}
                        className={cn(
                          "flex min-h-[3.25rem] w-full items-center gap-2.5 rounded-xl border-2 px-2.5 py-2 text-left sm:min-h-[3.4rem]",
                          pillar.theme.card
                        )}
                      >
                        <span
                          className={cn(
                            "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
                            pillar.theme.chip
                          )}
                        >
                          <Icon className="h-3.5 w-3.5" strokeWidth={2.4} />
                        </span>
                        <span className="min-w-0 text-[11px] font-semibold tracking-tight text-zinc-100 sm:text-xs">
                          {pillar.shortLabel}
                        </span>
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </header>

          <div className="mb-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
              Learning modules
            </p>
          </div>

          <ol className="relative">
            {cards.map((card, index) => (
              <ModuleJourneyCard
                key={card.module.id}
                card={card}
                index={index}
                isLast={index === cards.length - 1}
                prevDone={index === 0 ? true : cards[index - 1]!.done}
              />
            ))}
          </ol>
        </div>
      </div>
    </>
  );
}

function ModuleJourneyCard({
  card,
  index,
  isLast,
  prevDone,
}: {
  card: ModuleCardModel;
  index: number;
  isLast: boolean;
  prevDone: boolean;
}) {
  const themeKey = THEME_KEYS[index % THEME_KEYS.length]!;
  const themeStyle = THEME_STYLES[themeKey] ?? THEME_STYLES["candy-indigo"]!;
  const art = getWeekRoadmapArt((index % 12) + 1);
  const pct = card.module.progressPercent;

  const cardInner = (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.24) }}
      whileHover={!card.locked ? { y: -2 } : undefined}
      className={cn(
        "group relative overflow-hidden rounded-2xl border transition-all duration-300",
        card.locked && "border-zinc-800/60 bg-zinc-950/30 opacity-50",
        card.done && "border-emerald-500/20 bg-zinc-950/80",
        card.active &&
          cn("border-indigo-500/30 bg-zinc-950/90 shadow-2xl", themeStyle.glow),
        !card.locked &&
          !card.done &&
          !card.active &&
          "border-zinc-800/70 bg-zinc-950/70 hover:border-zinc-700 hover:shadow-xl hover:shadow-black/40"
      )}
    >
      {!card.locked ? (
        <div
          className={cn(
            "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-60",
            themeStyle.gradient
          )}
        />
      ) : null}

      {card.active ? (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-400/60 to-transparent" />
      ) : null}

      <div
        className={cn(
          "relative flex items-start gap-3 p-4 sm:gap-4 sm:p-5",
          art && !card.locked && WEEK_CARD_ART_MIN_HEIGHT
        )}
      >
        <div
          className={cn(
            "relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border sm:h-16 sm:w-16",
            card.locked && "border-zinc-800 bg-zinc-900/80 text-zinc-600",
            card.done &&
              "border-emerald-500/30 bg-gradient-to-br from-emerald-500/20 to-emerald-600/5 text-emerald-400 shadow-lg shadow-emerald-500/10",
            !card.locked &&
              !card.done &&
              cn(
                "border-white/5 bg-gradient-to-br shadow-lg",
                themeStyle.ring,
                themeStyle.bg,
                themeStyle.glow,
                themeStyle.icon
              )
          )}
        >
          {card.locked ? (
            <Lock className="relative h-5 w-5" />
          ) : card.done ? (
            <CheckCircle2 className="relative h-6 w-6" />
          ) : (
            <Layers className="relative h-6 w-6 sm:h-7 sm:w-7" />
          )}
        </div>

        <div
          className={cn(
            "min-w-0 flex-1",
            art && !card.locked && WEEK_CARD_ART_PADDING
          )}
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-500">
              Module {card.globalIndex + 1}
            </span>
            {card.isInterviewPrep ? (
              <StatusBadge variant="start">Career critical</StatusBadge>
            ) : null}
            {card.active && !card.done ? (
              <StatusBadge variant="start">Start here</StatusBadge>
            ) : null}
            {card.active ? (
              <StatusBadge variant="current">Current</StatusBadge>
            ) : null}
            {card.done ? (
              <StatusBadge variant="complete">Complete</StatusBadge>
            ) : null}
          </div>

          <h3
            className={cn(
              "mt-1.5 text-lg font-bold tracking-tight sm:text-xl",
              card.locked ? "text-zinc-600" : "text-zinc-50"
            )}
          >
            {card.module.title}
          </h3>

          <p className="mt-1 text-[11px] font-medium text-zinc-600">
            {card.phase.title}
          </p>

          {card.locked ? (
            <p className="mt-2 text-sm text-zinc-500">
              Locked — finish the previous module to unlock.
            </p>
          ) : card.module.description ? (
            <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-zinc-500">
              {card.module.description}
            </p>
          ) : null}

          {!card.locked ? (
            <div className="mt-3 flex flex-wrap gap-1.5">
              <StatPill icon={Layers}>
                {card.challengeTotal != null
                  ? `${card.topicCount} topics`
                  : `${card.module.totalCount} lessons`}
              </StatPill>
              {card.challengeTotal == null ? (
                <StatPill icon={Clock}>{card.durationLabel}</StatPill>
              ) : null}
              {card.challengeTotal != null ? (
                <StatPill icon={Target}>
                  {card.challengeTotal}{" "}
                  {card.isInterviewPrep ? "drills" : "challenges"}
                </StatPill>
              ) : null}
              {card.assignmentCount > 0 ? (
                <StatPill icon={ClipboardList}>
                  {card.assignmentCount} assignment
                  {card.assignmentCount === 1 ? "" : "s"}
                </StatPill>
              ) : null}
              {card.hasProject ? (
                <StatPill icon={FolderKanban}>Project</StatPill>
              ) : null}
              {card.easy > 0 ? (
                <StatPill dotColor="bg-emerald-400" textColor="text-emerald-400">
                  {card.easy} Easy
                </StatPill>
              ) : null}
              {card.medium > 0 ? (
                <StatPill dotColor="bg-amber-400" textColor="text-amber-400">
                  {card.medium} Med
                </StatPill>
              ) : null}
              {card.hard > 0 ? (
                <StatPill dotColor="bg-rose-400" textColor="text-rose-400">
                  {card.hard} Hard
                </StatPill>
              ) : null}
            </div>
          ) : null}
        </div>

        {!card.locked && art ? (
          <WeekRoadmapArt
            src={art}
            className={
              card.globalIndex === 7 || card.globalIndex === 19
                ? "-translate-y-7"
                : undefined
            }
          />
        ) : !card.locked ? (
          <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-zinc-800/80 bg-zinc-900/80 text-zinc-500 transition-all duration-300 group-hover:border-zinc-700 group-hover:bg-zinc-800 group-hover:text-zinc-200">
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </div>
        ) : null}
      </div>

      {!card.locked ? (
        <div className="relative border-t border-zinc-800/60 bg-zinc-950/40 px-4 py-2.5 sm:px-5">
          <div className="flex items-center gap-3">
            <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-800/80">
              <motion.div
                className={cn(
                  "absolute inset-y-0 left-0 rounded-full",
                  card.done ? "bg-emerald-400" : themeStyle.progress
                )}
                initial={{ width: 0 }}
                whileInView={{ width: `${pct}%` }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.7,
                  ease: "easeOut",
                  delay: Math.min(index * 0.04, 0.2),
                }}
              />
            </div>
            <span className="min-w-[2.5rem] text-right text-xs font-semibold tabular-nums text-zinc-400">
              {pct}%
            </span>
          </div>
        </div>
      ) : null}
    </motion.article>
  );

  return (
    <li className="relative flex gap-3 sm:gap-6">
      <div className="relative flex w-10 shrink-0 flex-col items-center sm:w-12">
        <div className="relative">
          {card.active ? (
            <span
              className={cn(
                "absolute inset-0 animate-ping rounded-full opacity-40",
                themeStyle.bg.replace("/10", "/30")
              )}
            />
          ) : null}
          <div
            className={cn(
              "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 bg-zinc-950 transition-all duration-300 sm:h-11 sm:w-11",
              card.locked && "border-zinc-800 text-zinc-600",
              card.done &&
                "border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/20",
              card.active &&
                "border-indigo-400 bg-indigo-500/15 shadow-lg shadow-indigo-500/40 ring-4 ring-indigo-500/10",
              !card.locked &&
                !card.done &&
                !card.active &&
                cn("border-zinc-700 bg-zinc-900 shadow-md", themeStyle.ring)
            )}
          >
            {card.done ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-400 sm:h-5 sm:w-5" />
            ) : card.active ? (
              <span
                className={cn(
                  "h-2.5 w-2.5 rounded-full shadow-lg",
                  themeStyle.dot
                )}
              />
            ) : card.locked ? (
              <Lock className="h-3.5 w-3.5 text-zinc-600" />
            ) : (
              <Layers className={cn("h-4 w-4", themeStyle.icon)} />
            )}
          </div>
        </div>
        {!isLast ? (
          <div className="relative mt-2 min-h-[32px] w-px flex-1">
            <div className="absolute inset-0 bg-zinc-800/80" />
            <motion.div
              className="absolute inset-x-0 top-0 w-px origin-top bg-gradient-to-b from-indigo-500/80 to-indigo-500/20"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: prevDone || card.done ? 1 : 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              style={{ height: "100%" }}
            />
          </div>
        ) : null}
      </div>

      <div className="min-w-0 flex-1 pb-8">
        {card.locked ? (
          cardInner
        ) : (
          <Link
            href={card.href}
            prefetch
            className="block rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
          >
            {cardInner}
          </Link>
        )}
      </div>
    </li>
  );
}

function StatusBadge({
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
          "border border-indigo-500/50 bg-indigo-600/80 text-white shadow-[0_0_16px_color-mix(in_srgb,var(--color-primary)_35%,transparent)]",
        variant === "complete" &&
          "border border-emerald-500/30 bg-emerald-500/15 text-emerald-300"
      )}
    >
      {children}
    </span>
  );
}

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

function buildModuleCards(
  journey: CourseJourney,
  assignmentSet: Set<string>,
  projectSet: Set<string>
): ModuleCardModel[] {
  const flat: Array<{ module: ModuleSummary; phase: PhaseWithModules }> = [];
  for (const phase of journey.phases) {
    for (const module of phase.modules) {
      flat.push({ module, phase });
    }
  }

  let activeAssigned = false;

  return flat.map(({ module, phase }, globalIndex) => {
    const done =
      module.totalCount > 0 && module.completedCount >= module.totalCount;
    const locked = false;
    const active = !done && !activeAssigned;
    if (active) activeAssigned = true;

    // Open every module on "All" topics — never jump straight to the first topic.
    const href = CURRICULUM_ROUTES.moduleHub(module.slug);

    const pf = isProgrammingFundamentalsModule(module.slug);
    const dt = isDeveloperToolingModule(module.slug);
    const html = isHtmlAcademyModule(module.slug);
    const css = isCssAcademyModule(module.slug);
    const js = isJsAcademyModule(module.slug);
    const react = isReactAcademyModule(module.slug);
    const nextjs = isNextjsAcademyModule(module.slug);
    const ts = isTypescriptAcademyModule(module.slug);
    const apis = isApisAcademyModule(module.slug);
    const auth = isAuthAcademyModule(module.slug);
    const sql = isSqlAcademyModule(module.slug);
    const modeling = isModelingAcademyModule(module.slug);
    const deploy = isDeploymentAcademyModule(module.slug);
    const cicd = isCicdAcademyModule(module.slug);
    const llm = isLlmAcademyModule(module.slug);
    const aiFeatures = isAiFeaturesAcademyModule(module.slug);
    const capstone = isCapstoneAcademyModule(module.slug);
    const ship = isShipAcademyModule(module.slug);
    const interview = isInterviewAcademyModule(module.slug);
    const systems = isSystemsAcademyModule(module.slug);
    const pfCounts = pf ? programmingFundamentalsChallengeCounts() : null;
    const dtCounts = dt ? developerToolingChallengeCounts() : null;
    const htmlCounts = html ? htmlAcademyChallengeCounts() : null;
    const cssCounts = css ? cssAcademyChallengeCounts() : null;
    const jsCounts = js ? jsAcademyChallengeCounts() : null;
    const reactCounts = react ? reactAcademyChallengeCounts() : null;
    const nextjsCounts = nextjs ? nextjsAcademyChallengeCounts() : null;
    const tsCounts = ts ? typescriptAcademyChallengeCounts() : null;
    const apisCounts = apis ? apisAcademyChallengeCounts() : null;
    const authCounts = auth ? authAcademyChallengeCounts() : null;
    const sqlCounts = sql ? sqlAcademyChallengeCounts() : null;
    const modelingCounts = modeling ? modelingAcademyChallengeCounts() : null;
    const deployCounts = deploy ? deploymentAcademyChallengeCounts() : null;
    const cicdCounts = cicd ? cicdAcademyChallengeCounts() : null;
    const llmCounts = llm ? llmAcademyChallengeCounts() : null;
    const aiFeaturesCounts = aiFeatures
      ? aiFeaturesAcademyChallengeCounts()
      : null;
    const capstoneCounts = capstone ? capstoneAcademyChallengeCounts() : null;
    const shipCounts = ship ? shipAcademyChallengeCounts() : null;
    const interviewCounts = interview
      ? interviewAcademyChallengeCounts()
      : null;
    const systemsCounts = systems ? systemsAcademyChallengeCounts() : null;
    const specialCounts =
      pfCounts ??
      dtCounts ??
      htmlCounts ??
      cssCounts ??
      jsCounts ??
      reactCounts ??
      nextjsCounts ??
      tsCounts ??
      apisCounts ??
      authCounts ??
      sqlCounts ??
      modelingCounts ??
      deployCounts ??
      cicdCounts ??
      llmCounts ??
      aiFeaturesCounts ??
      capstoneCounts ??
      shipCounts ??
      interviewCounts ??
      systemsCounts;
    const lessonCounts = countDifficulties(

      module.lessons.map((l) => l.difficulty)
    );
    const minutes = module.lessons.reduce(
      (sum, l) => sum + l.durationMinutes,
      0
    );
    const topicCount = pf
      ? PROGRAMMING_FUNDAMENTALS_TOPICS.length
      : dt
        ? flattenToolingTopics().length
        : html
          ? flattenHtmlTopics().length
          : css
            ? flattenCssTopics().length
            : js
              ? flattenJsTopics().length
              : react
                ? flattenReactTopics().length
                : nextjs
                  ? flattenNextjsTopics().length
                  : ts
                    ? flattenTypescriptTopics().length
                    : apis
                      ? flattenApisTopics().length
                      : auth
                        ? flattenAuthTopics().length
                        : sql
                          ? flattenSqlTopics().length
                          : modeling
                            ? flattenModelingTopics().length
                            : deploy
                              ? flattenDeploymentTopics().length
                              : cicd
                                ? flattenCicdTopics().length
                                : llm
                                  ? flattenLlmTopics().length
                                  : aiFeatures
                                    ? flattenAiFeaturesTopics().length
                                    : capstone
                                      ? flattenCapstoneTopics().length
                                      : ship
                                        ? flattenShipTopics().length
                                        : interview
                                          ? flattenInterviewTopics().length
                                          : systems
                                            ? flattenSystemsTopics().length
                                            : module.totalCount;

    return {
      module,
      phase,
      index: globalIndex,
      globalIndex,
      locked,
      done,
      active,
      href,
      assignmentCount: module.lessons.filter((l) => assignmentSet.has(l.id))
        .length,
      hasProject: projectSet.has(module.id) || /project/i.test(module.title),
      easy: specialCounts?.easy ?? lessonCounts.beginner,
      medium: specialCounts?.medium ?? lessonCounts.intermediate,
      hard: specialCounts?.hard ?? lessonCounts.advanced,
      challengeTotal: specialCounts?.total ?? null,
      topicCount,
      durationLabel:
        module.estimated_duration ||
        (minutes > 0 ? formatMinutes(minutes) : "—"),
      isInterviewPrep: interview || systems,
    };
  });
}

function countDifficulties(levels: LessonDifficulty[]) {
  return levels.reduce(
    (acc, level) => {
      if (level === "beginner") acc.beginner += 1;
      else if (level === "intermediate") acc.intermediate += 1;
      else acc.advanced += 1;
      return acc;
    },
    { beginner: 0, intermediate: 0, advanced: 0 }
  );
}

function formatMinutes(total: number) {
  if (total < 60) return `${total}m`;
  const h = Math.floor(total / 60);
  const m = total % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}
