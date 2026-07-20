"use client";

import { useMemo } from "react";
import { CheckCircle2 } from "lucide-react";
import type { LearnDifficulty, LearnLesson } from "@/learning-engine/types";
import { lessonEntityId } from "@/learning-engine/types";
import {
  DIFFICULTY_LABELS,
  DIFFICULTY_STYLES,
  groupByProblemType,
  lessonsByDifficulty,
  problemTypeLabel,
} from "@/learning-engine/labels";
import { cn } from "@/lib/utils";

const DIFFICULTIES: LearnDifficulty[] = ["easy", "medium", "hard"];

interface ProblemNavigatorProps {
  weekId: number;
  lessons: LearnLesson[];
  difficulty: LearnDifficulty;
  problemType: string;
  activeLessonId: string;
  onDifficultyChange: (d: LearnDifficulty) => void;
  onProblemTypeChange: (type: string) => void;
  onLessonSelect: (id: string) => void;
  isDone: (id: string) => boolean;
}

export function ProblemNavigator({
  weekId,
  lessons,
  difficulty,
  problemType,
  activeLessonId,
  onDifficultyChange,
  onProblemTypeChange,
  onLessonSelect,
  isDone,
}: ProblemNavigatorProps) {
  const difficultyLessons = useMemo(() => lessonsByDifficulty(lessons, difficulty), [lessons, difficulty]);
  const grouped = useMemo(() => groupByProblemType(difficultyLessons), [difficultyLessons]);
  const types = useMemo(() => Array.from(grouped.keys()), [grouped]);

  const activeType = types.includes(problemType) ? problemType : types[0] ?? "logic";
  const typeLessons = grouped.get(activeType) ?? [];

  return (
    <div className="shrink-0 border-b border-zinc-800/80 bg-zinc-900/40">
      <div className="flex flex-wrap items-center gap-2 border-b border-zinc-800/60 px-3 py-2 sm:px-4">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Difficulty</span>
        {DIFFICULTIES.map((d) => {
          const count = lessonsByDifficulty(lessons, d).length;
          return (
            <button
              key={d}
              type="button"
              onClick={() => onDifficultyChange(d)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold uppercase ring-1 transition-colors",
                difficulty === d ? DIFFICULTY_STYLES[d] : "bg-zinc-800/50 text-zinc-500 ring-zinc-700 hover:text-zinc-300"
              )}
            >
              {DIFFICULTY_LABELS[d]} ({count})
            </button>
          );
        })}
      </div>

      {types.length > 0 && (
        <div className="flex gap-1 overflow-x-auto border-b border-zinc-800/60 px-3 py-2 sm:px-4">
          {types.map((type) => {
            const count = grouped.get(type)?.length ?? 0;
            return (
              <button
                key={type}
                type="button"
                onClick={() => onProblemTypeChange(type)}
                className={cn(
                  "shrink-0 rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors",
                  activeType === type
                    ? "bg-indigo-500/20 text-indigo-300"
                    : "text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
                )}
              >
                {problemTypeLabel(type)} ({count})
              </button>
            );
          })}
        </div>
      )}

      <div className="max-h-36 overflow-y-auto overscroll-contain px-2 py-2 sm:max-h-40">
        <div className="grid gap-1 sm:grid-cols-2 lg:grid-cols-3">
          {typeLessons.map((lesson, i) => {
            const eid = lessonEntityId({ weekId, topicSlug: lesson.topicSlug, id: lesson.id });
            const done = isDone(eid);
            const active = lesson.id === activeLessonId;
            return (
              <button
                key={lesson.id}
                type="button"
                onClick={() => onLessonSelect(lesson.id)}
                className={cn(
                  "flex items-center gap-2 rounded-md border px-2.5 py-2 text-left text-xs transition-colors",
                  active
                    ? "border-indigo-500/50 bg-indigo-500/10 text-indigo-100"
                    : "border-zinc-800/60 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                )}
              >
                <span className="shrink-0 font-mono text-[10px] text-zinc-600">{String(i + 1).padStart(2, "0")}</span>
                <span className="min-w-0 flex-1 truncate font-medium">{lesson.title}</span>
                {done && <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />}
              </button>
            );
          })}
        </div>
        {typeLessons.length === 0 && (
          <p className="px-2 py-3 text-center text-xs text-zinc-500">No problems for this difficulty.</p>
        )}
      </div>
    </div>
  );
}
