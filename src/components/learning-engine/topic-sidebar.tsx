"use client";

import { forwardRef, useMemo, useState } from "react";
import { CheckCircle2, Circle, Search } from "lucide-react";
import type { LearnDifficulty, LearnLesson } from "@/learning-engine/types";
import { lessonEntityId } from "@/learning-engine/types";
import type { LearnTopicBundle } from "@/learning-engine/types";
import {
  groupByProblemType,
  lessonsByDifficulty,
  problemTypeLabel,
  topicProgress,
} from "@/learning-engine/labels";
import { categoryLabel } from "./lesson-renderer";
import { cn } from "@/lib/utils";

interface TopicSidebarProps {
  weekId: number;
  topics: LearnTopicBundle[];
  activeSlug: string;
  onSelect: (slug: string) => void;
  isDone: (id: string) => boolean;
  difficulty: LearnDifficulty;
  problemType: string;
  activeLessonId: string;
  topicLessons: LearnLesson[];
  onProblemTypeChange: (type: string) => void;
  onLessonSelect: (id: string) => void;
}

export const TopicSidebar = forwardRef<HTMLElement, TopicSidebarProps>(function TopicSidebar(
  {
    weekId,
    topics,
    activeSlug,
    onSelect,
    isDone,
    difficulty,
    problemType,
    activeLessonId,
    topicLessons,
    onProblemTypeChange,
    onLessonSelect,
  },
  ref
) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return topics;
    return topics.filter(
      (t) =>
        t.topic.title.toLowerCase().includes(q) ||
        t.topic.slug.toLowerCase().includes(q) ||
        categoryLabel(t.topic.category).toLowerCase().includes(q)
    );
  }, [topics, query]);

  const difficultyLessons = useMemo(
    () => lessonsByDifficulty(topicLessons, difficulty),
    [topicLessons, difficulty]
  );
  const grouped = useMemo(() => groupByProblemType(difficultyLessons), [difficultyLessons]);
  const types = useMemo(() => Array.from(grouped.keys()), [grouped]);
  const activeType = types.includes(problemType) ? problemType : types[0] ?? "logic";
  const typeLessons = grouped.get(activeType) ?? [];

  return (
    <aside
      ref={ref}
      className="flex h-full min-h-0 w-full flex-col border-r border-zinc-800/80 bg-zinc-950 lg:w-[280px] lg:shrink-0"
    >
      <div className="shrink-0 border-b border-zinc-800/60 p-3">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
          Topics in this Week
        </p>
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
          <input
            type="search"
            placeholder="Search topics…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-md border border-zinc-800 bg-zinc-900 py-1.5 pl-8 pr-2 text-xs text-zinc-200 placeholder:text-zinc-600 focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/30"
          />
        </div>
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div className="p-2">
          {filtered.map((bundle, index) => {
            const prog = topicProgress(bundle, weekId, isDone);
            const active = bundle.topic.slug === activeSlug;
            const allDone = prog.percent === 100;

            return (
              <button
                key={bundle.topic.slug}
                type="button"
                onClick={() => onSelect(bundle.topic.slug)}
                className={cn(
                  "mb-0.5 flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors",
                  active
                    ? "bg-violet-500/10 ring-1 ring-violet-500/30"
                    : "hover:bg-zinc-900/60"
                )}
              >
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[10px] font-bold",
                    active ? "bg-violet-500/20 text-violet-300" : "bg-zinc-800 text-zinc-500"
                  )}
                >
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      "truncate text-xs font-medium",
                      active ? "text-violet-200" : "text-zinc-300"
                    )}
                  >
                    {bundle.topic.title}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="h-1 flex-1 overflow-hidden rounded-full bg-zinc-800">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          allDone ? "bg-emerald-500/80" : "bg-violet-500/70"
                        )}
                        style={{ width: `${prog.percent}%` }}
                      />
                    </div>
                    <span className="text-[10px] tabular-nums text-zinc-500">{prog.percent}%</span>
                  </div>
                </div>
                {allDone ? (
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                ) : active ? (
                  <Circle className="h-3.5 w-3.5 shrink-0 text-violet-400" />
                ) : null}
              </button>
            );
          })}
          {filtered.length === 0 && (
            <p className="px-2 py-4 text-center text-xs text-zinc-500">No topics match your search.</p>
          )}
        </div>

        {activeSlug && typeLessons.length > 0 && (
          <div className="border-t border-zinc-800/60 p-2">
            <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Problems
            </p>
            {types.length > 1 && (
              <div className="mb-2 flex gap-1 overflow-x-auto pb-1">
                {types.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => onProblemTypeChange(type)}
                    className={cn(
                      "shrink-0 rounded-md px-2 py-0.5 text-[10px] font-medium transition-colors",
                      activeType === type
                        ? "bg-violet-500/20 text-violet-300"
                        : "text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
                    )}
                  >
                    {problemTypeLabel(type)}
                  </button>
                ))}
              </div>
            )}
            <div className="space-y-0.5">
              {typeLessons.map((lesson, i) => {
                const eid = lessonEntityId({ weekId, topicSlug: lesson.topicSlug, id: lesson.id });
                const done = isDone(eid);
                const isActive = lesson.id === activeLessonId;
                return (
                  <button
                    key={lesson.id}
                    type="button"
                    onClick={() => onLessonSelect(lesson.id)}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[11px] transition-colors",
                      isActive
                        ? "bg-violet-500/15 text-violet-200"
                        : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300"
                    )}
                  >
                    <span className="shrink-0 font-mono text-[10px] text-zinc-600">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1 truncate">{lesson.title}</span>
                    {done && <CheckCircle2 className="h-3 w-3 shrink-0 text-emerald-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </nav>
    </aside>
  );
});
