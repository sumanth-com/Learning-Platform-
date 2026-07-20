"use client";

import { Bookmark, ChevronLeft, ChevronRight, CheckCircle2, Circle } from "lucide-react";
import type { LearnDifficulty, LearnLesson } from "@/learning-engine/types";
import { DIFFICULTY_LABELS, DIFFICULTY_STYLES } from "@/learning-engine/labels";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DIFFICULTIES: LearnDifficulty[] = ["easy", "medium", "hard"];

interface WeekTopToolbarProps {
  topicTitle?: string;
  topicProgressPercent: number;
  difficulty: LearnDifficulty;
  difficultyCounts: Record<LearnDifficulty, number>;
  lessons: LearnLesson[];
  activeLessonId: string;
  completed: boolean;
  onDifficultyChange: (d: LearnDifficulty) => void;
  onPrev: () => void;
  onNext: () => void;
  onToggleComplete: () => void;
}

export function WeekTopToolbar({
  topicTitle,
  topicProgressPercent,
  difficulty,
  difficultyCounts,
  lessons,
  activeLessonId,
  completed,
  onDifficultyChange,
  onPrev,
  onNext,
  onToggleComplete,
}: WeekTopToolbarProps) {
  const currentIndex = lessons.findIndex((l) => l.id === activeLessonId);
  const currentNum = currentIndex >= 0 ? currentIndex + 1 : 0;
  const total = lessons.length;

  return (
    <div className="shrink-0 border-b border-zinc-800/80 bg-zinc-950/90">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2.5">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="min-w-[140px] flex-1 max-w-xs">
            <div className="mb-1 flex items-center justify-between gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                Topic Progress
              </span>
              <span className="text-[10px] tabular-nums font-semibold text-violet-300">
                {topicProgressPercent}%
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-500"
                style={{ width: `${topicProgressPercent}%` }}
              />
            </div>
            {topicTitle && (
              <p className="mt-1 truncate text-[10px] text-zinc-600">{topicTitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900/60 p-0.5">
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => onDifficultyChange(d)}
              className={cn(
                "rounded-md px-3 py-1 text-[11px] font-semibold uppercase transition-colors",
                difficulty === d
                  ? DIFFICULTY_STYLES[d]
                  : "text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
              )}
            >
              {DIFFICULTY_LABELS[d]}
              <span className="ml-1 opacity-60">({difficultyCounts[d]})</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onPrev}
            disabled={currentIndex <= 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="min-w-[4rem] text-center text-xs tabular-nums text-zinc-400">
            {currentNum} / {total}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onNext}
            disabled={currentIndex < 0 || currentIndex >= total - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-violet-400">
          <Bookmark className="h-4 w-4" />
        </Button>

        <Button
          variant={completed ? "secondary" : "default"}
          size="sm"
          className={cn(
            "h-8 shrink-0 gap-1.5 text-xs",
            !completed && "bg-violet-600 hover:bg-violet-500"
          )}
          onClick={onToggleComplete}
        >
          {completed ? (
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
          ) : (
            <Circle className="h-3.5 w-3.5" />
          )}
          {completed ? "Completed" : "Mark Complete"}
        </Button>
      </div>
    </div>
  );
}
