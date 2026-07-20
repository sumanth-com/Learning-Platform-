"use client";

import { Clock, Target, TrendingUp } from "lucide-react";
import type { LearnDifficulty, LearnWeekBundle } from "@/learning-engine/types";
import {
  completedTopicsCount,
  DIFFICULTY_LABELS,
  DIFFICULTY_STYLES,
  topicEstimatedMinutes,
  weekProgress,
} from "@/learning-engine/labels";
import { cn } from "@/lib/utils";

interface WeekLearningHeaderProps {
  week: LearnWeekBundle;
  currentTopicTitle?: string;
  currentDifficulty?: LearnDifficulty;
  topicLessonCount?: number;
  topicEstimatedMin?: number;
  isDone: (id: string) => boolean;
}

export function WeekLearningHeader({
  week,
  currentTopicTitle,
  currentDifficulty,
  topicLessonCount,
  topicEstimatedMin,
  isDone,
}: WeekLearningHeaderProps) {
  const progress = weekProgress(week, isDone);
  const topicsDone = completedTopicsCount(week, isDone);

  return (
    <div className="shrink-0 border-b border-zinc-800/80 bg-gradient-to-r from-zinc-950 via-zinc-900/80 to-zinc-950 px-4 py-4 sm:px-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-indigo-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-300 ring-1 ring-indigo-500/25">
              Week {week.weekId}
            </span>
            {currentDifficulty && (
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ring-1",
                  DIFFICULTY_STYLES[currentDifficulty]
                )}
              >
                {DIFFICULTY_LABELS[currentDifficulty]}
              </span>
            )}
          </div>
          <h1 className="mt-1.5 truncate text-lg font-bold tracking-tight text-zinc-50 sm:text-xl">
            {week.title}
          </h1>
          <p className="mt-0.5 line-clamp-2 text-xs text-zinc-500 sm:text-sm">{week.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:gap-3">
          <StatCard
            icon={TrendingUp}
            label="Week Progress"
            value={`${progress.percent}%`}
            sub={`${progress.completed}/${progress.total} problems`}
          />
          <StatCard
            icon={Target}
            label="Topics Done"
            value={`${topicsDone}/${week.topics.length}`}
            sub={currentTopicTitle ? `Current: ${currentTopicTitle}` : "Select a topic"}
          />
          <StatCard
            icon={Clock}
            label="Study Time"
            value={topicEstimatedMin ? `~${topicEstimatedMin}m` : "—"}
            sub={topicLessonCount ? `${topicLessonCount} problems in topic` : "Per topic estimate"}
          />
          <div className="col-span-2 flex flex-col justify-center rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2 sm:col-span-1">
            <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">Completion</p>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500"
                style={{ width: `${progress.percent}%` }}
              />
            </div>
            <p className="mt-1 text-[10px] text-zinc-500">{progress.percent}% of week complete</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2">
      <div className="flex items-center gap-1.5 text-zinc-500">
        <Icon className="h-3 w-3" />
        <p className="text-[10px] font-medium uppercase tracking-wider">{label}</p>
      </div>
      <p className="mt-1 text-sm font-semibold text-zinc-100">{value}</p>
      <p className="truncate text-[10px] text-zinc-500">{sub}</p>
    </div>
  );
}
