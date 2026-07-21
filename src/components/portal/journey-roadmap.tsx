"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock,
  FolderKanban,
  Layers,
  Lock,
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
  Target,
  FolderKanban,
  ClipboardList,
  Clock,
];

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
    icon: PILLAR_ICONS[i % PILLAR_ICONS.length]!,
    accent: [
      "text-amber-400 bg-amber-500/10 ring-amber-500/20",
      "text-violet-400 bg-violet-500/10 ring-violet-500/20",
      "text-emerald-400 bg-emerald-500/10 ring-emerald-500/20",
      "text-sky-400 bg-sky-500/10 ring-sky-500/20",
      "text-orange-400 bg-orange-500/10 ring-orange-500/20",
      "text-indigo-400 bg-indigo-500/10 ring-indigo-500/20",
    ][i % 6]!,
  }));

  return (
    <>
      <PortalChrome title="Roadmap" fillViewport />
      <div className="h-full min-h-0 overflow-y-auto bg-zinc-950">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:py-8">
          <header className="mb-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex flex-col gap-4">
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

              <div className="lg:max-w-md lg:pt-1">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
                  What you will learn
                </p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {pillars.map((pillar) => {
                    const Icon = pillar.icon;
                    return (
                      <span
                        key={pillar.label}
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-medium ring-1 ring-inset",
                          pillar.accent
                        )}
                      >
                        <Icon className="h-3 w-3 shrink-0" />
                        <span className="truncate">{pillar.label}</span>
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
                  {card.challengeTotal} challenges
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
          <WeekRoadmapArt src={art} />
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
          "border border-indigo-500/50 bg-indigo-600/80 text-white shadow-[0_0_16px_rgba(99,102,241,0.35)]",
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

    const href = isProgrammingFundamentalsModule(module.slug)
      ? CURRICULUM_ROUTES.moduleHub(
          module.slug,
          PROGRAMMING_FUNDAMENTALS_TOPICS[0]!.slug
        )
      : isDeveloperToolingModule(module.slug)
        ? CURRICULUM_ROUTES.moduleHub(
            module.slug,
            flattenToolingTopics()[0]!.slug
          )
        : isHtmlAcademyModule(module.slug)
          ? CURRICULUM_ROUTES.moduleHub(
              module.slug,
              flattenHtmlTopics()[0]!.slug
            )
          : CURRICULUM_ROUTES.module(module.slug);

    const pf = isProgrammingFundamentalsModule(module.slug);
    const dt = isDeveloperToolingModule(module.slug);
    const html = isHtmlAcademyModule(module.slug);
    const pfCounts = pf ? programmingFundamentalsChallengeCounts() : null;
    const dtCounts = dt ? developerToolingChallengeCounts() : null;
    const htmlCounts = html ? htmlAcademyChallengeCounts() : null;
    const specialCounts = pfCounts ?? dtCounts ?? htmlCounts;
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
