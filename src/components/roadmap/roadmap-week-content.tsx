"use client";

import { useMemo } from "react";
import Link from "next/link";
import type { CurriculumWeekDefinition } from "@/curriculum/types";
import type { WeekProgressBreakdown } from "@/lib/progress-engine";
import { flattenWeekLessonSections, getRoadmapItemDetail } from "@/curriculum/roadmap-content";
import { AiLearnSplitView } from "@/components/shared/ai-learn-split-view";
import { cn } from "@/lib/utils";

interface RoadmapWeekContentProps {
  week: CurriculumWeekDefinition;
  isDone: (id: string) => boolean;
  onToggle: (id: string) => void;
}

export function RoadmapWeekContent({
  week,
  isDone,
  onToggle,
}: RoadmapWeekContentProps) {
  const sections = useMemo(() => flattenWeekLessonSections(week), [week]);

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <AiLearnSplitView
        sections={sections}
        locked={false}
        isDone={isDone}
        onToggle={onToggle}
        getDetail={(id, title, _kind) => getRoadmapItemDetail(week, id, title)}
        sidebarTitle="Lessons"
      />
    </div>
  );
}

interface RoadmapWeekStatsBarProps {
  weekId: number;
  weekProgress: WeekProgressBreakdown;
  inline?: boolean;
}

function StatLink({
  href,
  label,
  value,
  highlight,
}: {
  href: string;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-lg border px-2.5 py-1 transition-colors hover:border-indigo-500/40 hover:bg-indigo-500/5",
        highlight ? "border-indigo-500/25 bg-indigo-500/5" : "border-zinc-800 bg-zinc-900/60"
      )}
    >
      <p className="text-[9px] font-semibold uppercase tracking-wider text-zinc-500">{label}</p>
      <p
        className={cn(
          "text-xs font-bold tabular-nums leading-tight",
          highlight ? "text-indigo-300" : "text-zinc-100"
        )}
      >
        {value}
      </p>
    </Link>
  );
}

export function RoadmapWeekStatsBar({
  weekId,
  weekProgress,
  inline = false,
}: RoadmapWeekStatsBarProps) {
  const wp = weekProgress;

  const pills = (
    <>
      <StatLink
        label="Lessons"
        value={`${wp.dayItems.completed}/${wp.dayItems.total}`}
        href={`/roadmap/week/${weekId}`}
        highlight
      />
      <StatLink
        label="Projects"
        value={`${wp.projects.completed}/${wp.projects.total}`}
        href="/projects"
      />
      <StatLink label="AI" value={`${wp.ai.completed}/${wp.ai.total}`} href={`/ai-skills/${weekId}`} />
    </>
  );

  if (inline) {
    return <div className="hidden shrink-0 items-center gap-1.5 xl:flex">{pills}</div>;
  }

  return <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-3">{pills}</div>;
}
