"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Bookmark, ChevronRight, Star } from "lucide-react";
import type { LearnDifficulty, LearnLesson, LearnWeekBundle } from "@/learning-engine/types";
import { lessonEntityId } from "@/learning-engine/types";
import { DIFFICULTY_LABELS, problemTypeLabel, weekProgress } from "@/learning-engine/labels";
import { categoryLabel } from "@/components/learning-engine/lesson-renderer";
import { useTrackResumePosition } from "@/hooks/use-resume-position";
import { useProgressStore } from "@/store/use-progress-store";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useStoreHydrated } from "@/hooks/use-store-hydrated";

const PAGE_SIZE = 25;

interface ChallengeItem {
  lesson: LearnLesson;
  topicSlug: string;
  topicTitle: string;
  topicIndex: number;
  lessonIndex: number;
  entityId: string;
}

function learnUrl(weekId: number, topicSlug: string, lesson: LearnLesson) {
  const params = new URLSearchParams({
    topic: topicSlug,
    lesson: lesson.id,
    difficulty: lesson.difficulty,
  });
  if (lesson.problemType) params.set("type", lesson.problemType);
  return `/roadmap/week/${weekId}/learn?${params.toString()}`;
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-zinc-800/80 pb-4 last:border-0">
      <p className="mb-2.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400">{title}</p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function FilterCheckbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-300">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-3.5 w-3.5 rounded border-zinc-600 bg-zinc-900 accent-emerald-500"
      />
      {label}
    </label>
  );
}

const DIFFICULTY_COLORS: Record<LearnDifficulty, string> = {
  easy: "text-emerald-400",
  medium: "text-amber-400",
  hard: "text-rose-400",
};

export function WeekChallengeHub({ week }: { week: LearnWeekBundle }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const validTopicSlugs = useMemo(
    () => new Set(week.topics.map((t) => t.topic.slug)),
    [week.topics]
  );

  const hydrated = useStoreHydrated();
  // Hydration-safe: always start with "all" on the server; update on client.
  const [activeTopic, setActiveTopic] = useState("all");
  const [page, setPage] = useState(0);
  const [showSolved, setShowSolved] = useState(true);
  const [showUnsolved, setShowUnsolved] = useState(true);
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);
  const [diffEasy, setDiffEasy] = useState(true);
  const [diffMedium, setDiffMedium] = useState(true);
  const [diffHard, setDiffHard] = useState(true);

  useEffect(() => {
    const topic = searchParams.get("topic");
    const next = topic && validTopicSlugs.has(topic) ? topic : "all";
    setActiveTopic(next);
  }, [searchParams, validTopicSlugs]);

  const syncTopicUrl = useCallback(
    (slug: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (slug === "all") {
        params.delete("topic");
      } else {
        params.set("topic", slug);
      }
      const qs = params.toString();
      router.replace(`/roadmap/week/${week.weekId}${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [router, searchParams, week.weekId]
  );

  const isDoneFn = useProgressStore((s) => s.isDone);
  const isBookmarkedFn = useProgressStore((s) => s.isBookmarked);
  const toggleBookmark = useProgressStore((s) => s.toggleBookmark);

  const allChallenges = useMemo<ChallengeItem[]>(() => {
    return week.topics.flatMap((bundle, topicIndex) =>
      bundle.lessons
        .filter((lesson) => (!lesson.weekId || lesson.weekId === week.weekId) && lesson.problemType !== "mcq")
        .map((lesson, lessonIndex) => ({
          lesson,
          topicSlug: bundle.topic.slug,
          topicTitle: bundle.topic.title,
          topicIndex,
          lessonIndex,
          entityId: lessonEntityId({
            weekId: week.weekId,
            topicSlug: bundle.topic.slug,
            id: lesson.id,
          }),
        }))
    );
  }, [week]);

  const progress = useMemo(() => weekProgress(week, isDoneFn), [week, isDoneFn]);

  const filteredAndSorted = useMemo(() => {
    const byDifficultyRank: Record<LearnDifficulty, number> = { easy: 0, medium: 1, hard: 2 };

    const filtered = allChallenges.filter((c) => {
      if (activeTopic !== "all" && c.topicSlug !== activeTopic) return false;

      const done = hydrated && isDoneFn(c.entityId);
      if (done && !showSolved) return false;
      if (!done && !showUnsolved) return false;

      if (bookmarkedOnly && !isBookmarkedFn(c.entityId)) return false;

      const d = c.lesson.difficulty;
      if (d === "easy" && !diffEasy) return false;
      if (d === "medium" && !diffMedium) return false;
      if (d === "hard" && !diffHard) return false;

      return true;
    });

    return [...filtered].sort((a, b) => {
      if (a.topicIndex !== b.topicIndex) return a.topicIndex - b.topicIndex;
      const da = byDifficultyRank[a.lesson.difficulty];
      const db = byDifficultyRank[b.lesson.difficulty];
      if (da !== db) return da - db;
      return a.lessonIndex - b.lessonIndex;
    });
  }, [
    activeTopic,
    allChallenges,
    bookmarkedOnly,
    diffEasy,
    diffHard,
    diffMedium,
    isBookmarkedFn,
    isDoneFn,
    showSolved,
    showUnsolved,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSorted.length / PAGE_SIZE));
  const pageItems = filteredAndSorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const selectTopic = (slug: string) => {
    setActiveTopic(slug);
    setPage(0);
    syncTopicUrl(slug);
  };

  const activeTopicTitle =
    activeTopic === "all"
      ? "All topics"
      : (week.topics.find((t) => t.topic.slug === activeTopic)?.topic.title ?? activeTopic);

  const hubHref =
    activeTopic === "all"
      ? `/roadmap/week/${week.weekId}`
      : `/roadmap/week/${week.weekId}?topic=${encodeURIComponent(activeTopic)}`;

  useTrackResumePosition(
    "practice",
    week.weekId,
    `Week ${week.weekId} · ${week.title}`,
    activeTopicTitle,
    hubHref,
    hydrated,
    activeTopic !== "all"
      ? {
          topicSlug: activeTopic,
          topicTitle: activeTopicTitle,
        }
      : {
          topicTitle: week.title,
        }
  );

  const displayProgress = hydrated ? progress : { completed: 0, total: progress.total, percent: 0 };
  const displayPointsToNext = displayProgress.total - displayProgress.completed;

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-zinc-500">
        <Link href="/roadmap" className="hover:text-zinc-300">
          Roadmap
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-zinc-400">Week {week.weekId}</span>
      </nav>

      <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-xs text-emerald-300">
        Showing challenges for <strong className="font-semibold">Week {week.weekId} — {week.title}</strong> only.
        Other weeks are not included on this page.
      </div>

      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-violet-500/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-violet-300 ring-1 ring-violet-500/25">
              Week {week.weekId}
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-50 sm:text-3xl">{week.title}</h1>
        </div>
        <div className="w-full shrink-0 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 lg:w-72">
          <p className="text-xs text-zinc-400" suppressHydrationWarning>
            {displayPointsToNext > 0
              ? `${displayPointsToNext} more challenge${displayPointsToNext === 1 ? "" : "s"} to complete this week!`
              : "Week complete — great job!"}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <Progress value={displayProgress.percent} className="h-2 flex-1" />
            <span className="text-sm font-semibold tabular-nums text-emerald-400" suppressHydrationWarning>
              {hydrated ? `${displayProgress.percent}%` : "\u00a0"}
            </span>
          </div>
          <p className="mt-2 text-[11px] tabular-nums text-zinc-500" suppressHydrationWarning>
            {hydrated
              ? `Progress: ${displayProgress.completed}/${displayProgress.total} challenges`
              : "\u00a0"}
          </p>
        </div>
      </div>

      {/* Topic tabs */}
      <div className="flex gap-6 overflow-x-auto border-b border-zinc-800 pb-1">
        <button
          type="button"
          onClick={() => selectTopic("all")}
          className={cn(
            "shrink-0 border-b-2 pb-2.5 text-sm font-medium transition-colors",
            activeTopic === "all"
              ? "border-emerald-500 text-emerald-400"
              : "border-transparent text-zinc-500 hover:text-zinc-300"
          )}
        >
          All Topics
        </button>
        {week.topics.map((t) => (
          <button
            key={t.topic.slug}
            type="button"
            onClick={() => selectTopic(t.topic.slug)}
            className={cn(
              "shrink-0 border-b-2 pb-2.5 text-sm font-medium transition-colors",
              activeTopic === t.topic.slug
                ? "border-emerald-500 text-emerald-400"
                : "border-transparent text-zinc-500 hover:text-zinc-300"
            )}
          >
            {t.topic.title}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Challenge list */}
        <div className="min-w-0 flex-1 space-y-3">
          {pageItems.length === 0 ? (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-10 text-center text-sm text-zinc-500">
              No challenges match your filters.
            </div>
          ) : (
            pageItems.map((item, i) => {
              const { lesson, topicSlug, topicTitle, entityId } = item;
              const done = hydrated && isDoneFn(entityId);
              const bookmarked = isBookmarkedFn(entityId);
              const isFirst = page === 0 && i === 0;
              const globalIndex = page * PAGE_SIZE + i + 1;
              const challengeNumber = globalIndex.toString().padStart(3, "0");
              const estimatedMinutes = lesson.estimatedMinutes ?? (lesson.difficulty === "easy" ? 8 : lesson.difficulty === "medium" ? 15 : 25);
              const xpPoints = estimatedMinutes * (lesson.difficulty === "easy" ? 2 : lesson.difficulty === "medium" ? 3 : 4);
              const successRate =
                "successRate" in lesson && typeof (lesson as any).successRate === "number"
                  ? (lesson as any).successRate
                  : lesson.difficulty === "easy"
                    ? 82
                    : lesson.difficulty === "medium"
                      ? 67
                      : 41;

              return (
                <article
                  key={entityId}
                  className="rounded-xl border border-zinc-800/90 bg-zinc-900/40 p-4 transition-colors hover:border-zinc-700"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          onClick={() => toggleBookmark(entityId)}
                          className={cn(
                            "mt-0.5 shrink-0 rounded-full border border-zinc-800 p-1 transition-colors",
                            bookmarked ? "border-amber-400/60 bg-amber-500/10" : "hover:border-amber-500/60"
                          )}
                          aria-label={bookmarked ? "Remove bookmark" : "Bookmark challenge"}
                        >
                          {bookmarked ? (
                            <Bookmark className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          ) : (
                            <Star className="h-3.5 w-3.5 text-zinc-500" />
                          )}
                        </button>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500">
                            <span className="rounded bg-zinc-800/70 px-1.5 py-0.5 text-[10px] text-zinc-300">
                              #{challengeNumber}
                            </span>
                            <span>{topicTitle}</span>
                          </div>
                          <h2 className="mt-1 text-base font-semibold text-zinc-100">{lesson.title}</h2>
                          <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-zinc-500">
                            <span className={cn("font-semibold", DIFFICULTY_COLORS[lesson.difficulty])}>
                              {DIFFICULTY_LABELS[lesson.difficulty]}
                            </span>
                            <span>|</span>
                            <span>{problemTypeLabel(lesson.problemType)}</span>
                            <span>|</span>
                            <span>Est. {estimatedMinutes} min</span>
                            <span>|</span>
                            <span>{xpPoints} XP</span>
                            <span>|</span>
                            <span className="text-emerald-400 tabular-nums">{successRate}% success</span>
                            {done && (
                              <>
                                <span>|</span>
                                <span className="text-emerald-400">Solved</span>
                              </>
                            )}
                          </p>
                          <div className="mt-1 flex flex-wrap items-center gap-1.5">
                            {Array.isArray((lesson as any).companyTags) &&
                              (lesson as any).companyTags.slice(0, 3).map((tag: string) => (
                                <span
                                  key={tag}
                                  className="rounded-full bg-violet-500/10 px-2 py-0.5 text-[10px] font-medium text-violet-300 ring-1 ring-violet-500/30"
                                >
                                  {tag}
                                </span>
                              ))}
                          </div>
                          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-400">
                            {lesson.problemStatement?.split("\n")[0] ??
                              lesson.description ??
                              `Practice ${categoryLabel(lesson.category)} concepts.`}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Link href={learnUrl(week.weekId, topicSlug, lesson)} className="shrink-0">
                      <Button
                        size="sm"
                        className={cn(
                          "h-9 min-w-[8.5rem] font-semibold",
                          isFirst && !done
                            ? "bg-emerald-600 hover:bg-emerald-500"
                            : done
                              ? "border border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800"
                              : "border border-emerald-600/60 bg-transparent text-emerald-400 hover:bg-emerald-500/10"
                        )}
                        variant={isFirst && !done ? "default" : "outline"}
                      >
                        {done ? "Solved" : "Solve Challenge"}
                      </Button>
                    </Link>
                  </div>
                </article>
              );
            })
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
                className="h-8 border-zinc-800"
              >
                Previous
              </Button>
              <span className="text-xs tabular-nums text-zinc-500">
                Page {page + 1} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
                className="h-8 border-zinc-800"
              >
                Next
              </Button>
            </div>
          )}
        </div>

        {/* Filter sidebar — sticky while scrolling */}
        <aside className="w-full shrink-0 space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/30 p-4 lg:sticky lg:top-6 lg:w-64 lg:self-start">
          <FilterSection title="Status">
            <FilterCheckbox label="Solved" checked={showSolved} onChange={setShowSolved} />
            <FilterCheckbox label="Unsolved" checked={showUnsolved} onChange={setShowUnsolved} />
            <FilterCheckbox label="Bookmarked only" checked={bookmarkedOnly} onChange={setBookmarkedOnly} />
          </FilterSection>

          <FilterSection title="Difficulty">
            <FilterCheckbox label="Easy" checked={diffEasy} onChange={setDiffEasy} />
            <FilterCheckbox label="Medium" checked={diffMedium} onChange={setDiffMedium} />
            <FilterCheckbox label="Hard" checked={diffHard} onChange={setDiffHard} />
          </FilterSection>
        </aside>
      </div>
    </div>
  );
}
