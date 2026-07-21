"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  Bookmark,
  BookOpen,
  ChevronRight,
  Lock,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DifficultyBadge } from "@/components/curriculum/difficulty-badge";
import { CURRICULUM_ROUTES } from "@/features/curriculum/lib/curriculum-routes";
import type { ModuleHubPayload } from "@/features/curriculum/actions/module-hub-actions";
import {
  formatModuleDuration,
  moduleDifficulty,
} from "@/features/curriculum/lib/module-hub";
import {
  buildTopicCards,
  type TopicCardModel,
} from "@/features/curriculum/lib/topic-cards";
import {
  resolveTopicChallenges,
  getTopicChallengeLimit,
  curriculumChallengeEntityId,
} from "@/features/curriculum/lib/topic-challenges";
import { isProgrammingFundamentalsModule } from "@/features/curriculum/lib/programming-fundamentals";
import { prefetchModuleTopic, useModuleHub } from "@/features/curriculum/hooks/use-module-hub";
import { DIFFICULTY_LABELS, problemTypeLabel } from "@/learning-engine/labels";
import type { LearnDifficulty } from "@/learning-engine/types";
import { categoryLabel } from "@/components/learning-engine/lesson-renderer";
import { useProgressStore } from "@/store/use-progress-store";
import { useStoreHydrated } from "@/hooks/use-store-hydrated";
import { useTrackResumePosition } from "@/hooks/use-resume-position";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 25;

type ModuleChallengeItem = {
  id: string;
  weekId: number;
  topicSlug: string;
  curriculumTopicSlug: string;
  curriculumTopicTitle: string;
  topicIndex: number;
  lessonIndex: number;
  lesson: ReturnType<typeof resolveTopicChallenges>[number]["lesson"];
  entityId: string;
};

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-zinc-800/80 pb-4 last:border-0">
      <p className="mb-2.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
        {title}
      </p>
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

export function ModuleTopicExplorer() {
  const params = useParams<{ slug: string }>();
  const moduleSlug = params.slug;
  const hub = useModuleHub(moduleSlug);
  const payload = hub.data;
  const { detail } = payload ?? { detail: null };

  if (!payload || !detail) {
    return (
      <div className="mx-auto max-w-6xl animate-pulse space-y-6 pb-10">
        <div className="h-4 w-48 rounded bg-zinc-800" />
        <div className="h-24 rounded-xl bg-zinc-900/50" />
        <div className="h-10 rounded bg-zinc-900/50" />
        <div className="h-64 rounded-xl bg-zinc-900/40" />
      </div>
    );
  }

  return <ModuleTopicExplorerInner payload={payload} />;
}

function ModuleTopicExplorerInner({
  payload,
}: {
  payload: ModuleHubPayload;
}) {
  const { detail } = payload;
  const moduleSlug = detail.module.slug;
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const hydrated = useStoreHydrated();

  const cards = useMemo(
    () => buildTopicCards(detail.lessons, moduleSlug),
    [detail.lessons, moduleSlug]
  );

  const validTopicSlugs = useMemo(
    () => new Set(cards.map((c) => c.slug)),
    [cards]
  );

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
    const pf = isProgrammingFundamentalsModule(moduleSlug);

    if (pf) {
      const fallback = cards[0]?.slug;
      const next =
        topic && validTopicSlugs.has(topic) ? topic : (fallback ?? "all");
      setActiveTopic(next);
      if (!topic && fallback) {
        router.replace(CURRICULUM_ROUTES.moduleHub(moduleSlug, fallback), {
          scroll: false,
        });
      }
      return;
    }

    const next = topic && validTopicSlugs.has(topic) ? topic : "all";
    setActiveTopic(next);
  }, [searchParams, validTopicSlugs, moduleSlug, cards, router]);

  useEffect(() => {
    for (const card of cards.slice(0, 5)) {
      if (card.status !== "locked") {
        prefetchModuleTopic(queryClient, moduleSlug, card.slug);
      }
    }
  }, [cards, moduleSlug, queryClient]);

  const syncTopicUrl = useCallback(
    (slug: string) => {
      router.replace(CURRICULUM_ROUTES.moduleHub(moduleSlug, slug === "all" ? null : slug), {
        scroll: false,
      });
    },
    [moduleSlug, router]
  );

  const isDoneFn = useProgressStore((s) => s.isDone);
  const isBookmarkedFn = useProgressStore((s) => s.isBookmarked);
  const toggleBookmark = useProgressStore((s) => s.toggleBookmark);

  const allChallenges = useMemo<ModuleChallengeItem[]>(() => {
    const items: ModuleChallengeItem[] = [];
    cards.forEach((card, topicIndex) => {
      if (card.status === "locked") return;
      const challenges = resolveTopicChallenges(
        moduleSlug,
        card.slug,
        card.title,
        getTopicChallengeLimit(moduleSlug, card.slug)
      );
      challenges.forEach((challenge, lessonIndex) => {
        items.push({
          id: challenge.id,
          weekId: challenge.weekId,
          topicSlug: challenge.topicSlug,
          curriculumTopicSlug: card.slug,
          curriculumTopicTitle: card.title,
          topicIndex,
          lessonIndex,
          lesson: challenge.lesson,
          entityId: curriculumChallengeEntityId(moduleSlug, {
            weekId: challenge.weekId || 0,
            topicSlug: challenge.topicSlug,
            lesson: challenge.lesson,
          }),
        });
      });
    });
    return items;
  }, [cards, moduleSlug]);

  const challengeProgress = useMemo(() => {
    const total = allChallenges.length;
    if (!hydrated || total === 0) {
      return { completed: 0, total, percent: detail.progressPercent };
    }
    const completed = allChallenges.filter((c) => isDoneFn(c.entityId)).length;
    const percent = Math.round((completed / total) * 100);
    return { completed, total, percent };
  }, [allChallenges, detail.progressPercent, hydrated, isDoneFn]);

  const filteredAndSorted = useMemo(() => {
    const byDifficultyRank: Record<LearnDifficulty, number> = {
      easy: 0,
      medium: 1,
      hard: 2,
    };

    return allChallenges
      .filter((c) => {
        if (activeTopic !== "all" && c.curriculumTopicSlug !== activeTopic) {
          return false;
        }
        const done = hydrated && isDoneFn(c.entityId);
        if (done && !showSolved) return false;
        if (!done && !showUnsolved) return false;
        if (bookmarkedOnly && !isBookmarkedFn(c.entityId)) return false;
        const d = c.lesson.difficulty;
        if (d === "easy" && !diffEasy) return false;
        if (d === "medium" && !diffMedium) return false;
        if (d === "hard" && !diffHard) return false;
        return true;
      })
      .sort((a, b) => {
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
    hydrated,
    isBookmarkedFn,
    isDoneFn,
    showSolved,
    showUnsolved,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSorted.length / PAGE_SIZE));
  const pageItems = filteredAndSorted.slice(
    page * PAGE_SIZE,
    (page + 1) * PAGE_SIZE
  );

  const selectTopic = (slug: string, card?: TopicCardModel) => {
    if (card?.status === "locked") return;
    setActiveTopic(slug);
    setPage(0);
    syncTopicUrl(slug);
  };

  const activeCard =
    activeTopic === "all"
      ? null
      : cards.find((c) => c.slug === activeTopic);

  const activeTopicTitle =
    activeTopic === "all"
      ? "All topics"
      : (activeCard?.title ?? activeTopic);

  const hubHref = CURRICULUM_ROUTES.moduleHub(
    moduleSlug,
    activeTopic === "all" ? null : activeTopic
  );

  useTrackResumePosition(
    "roadmap",
    Math.max(1, detail.module.sort_order),
    detail.module.title,
    activeTopicTitle,
    hubHref,
    hydrated,
    activeTopic !== "all" && activeCard
      ? { topicSlug: activeTopic, topicTitle: activeTopicTitle }
      : { topicTitle: detail.module.title }
  );

  const displayProgress = hydrated
    ? challengeProgress
    : { completed: 0, total: challengeProgress.total, percent: 0 };
  const pointsToNext = displayProgress.total - displayProgress.completed;

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-10">
      <nav className="flex items-center gap-1.5 text-xs text-zinc-500">
        <Link href={CURRICULUM_ROUTES.roadmap} className="hover:text-zinc-300">
          Roadmap
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-zinc-400">{detail.phase.title}</span>
      </nav>

      {isProgrammingFundamentalsModule(moduleSlug) ? (
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-xs text-emerald-300">
          <strong className="font-semibold">{detail.module.title}</strong> —
          how developers think, structure logic, and solve problems. Practice
          here is built for freshers — read the topic lesson, then solve the
          matching challenge.
        </div>
      ) : (
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-xs text-emerald-300">
          Showing topics and practice for{" "}
          <strong className="font-semibold">{detail.module.title}</strong> only.
          Open a topic to read the lesson, then solve challenges below.
        </div>
      )}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-violet-500/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-violet-300 ring-1 ring-violet-500/25">
              Module
            </span>
            <DifficultyBadge difficulty={moduleDifficulty(detail.lessons)} />
            {!isProgrammingFundamentalsModule(moduleSlug) ? (
              <span className="text-[11px] text-zinc-500">
                {formatModuleDuration(detail)}
              </span>
            ) : null}
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-50 sm:text-3xl">
            {detail.module.title}
          </h1>
          {detail.module.description ? (
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-400">
              {detail.module.description}
            </p>
          ) : null}
        </div>

        <div className="w-full shrink-0 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 lg:w-72">
          <p className="text-xs text-zinc-400" suppressHydrationWarning>
            {pointsToNext > 0
              ? `${pointsToNext} more challenge${pointsToNext === 1 ? "" : "s"} in this module`
              : "All challenges complete — great job!"}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <Progress value={displayProgress.percent} className="h-2 flex-1" />
            <span
              className="text-sm font-semibold tabular-nums text-emerald-400"
              suppressHydrationWarning
            >
              {hydrated ? `${displayProgress.percent}%` : "\u00a0"}
            </span>
          </div>
          <p
            className="mt-2 text-[11px] tabular-nums text-zinc-500"
            suppressHydrationWarning
          >
            {hydrated
              ? `Challenges: ${displayProgress.completed}/${displayProgress.total} · Topics: ${detail.completedCount}/${detail.totalCount}`
              : "\u00a0"}
          </p>
        </div>
      </div>

      <div className="flex gap-6 overflow-x-auto border-b border-zinc-800 pb-1">
        {!isProgrammingFundamentalsModule(moduleSlug) ? (
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
        ) : null}
        {cards.map((card) => {
          const locked = card.status === "locked";
          return (
            <button
              key={card.slug}
              type="button"
              disabled={locked}
              onClick={() => selectTopic(card.slug, card)}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 border-b-2 pb-2.5 text-sm font-medium transition-colors",
                activeTopic === card.slug
                  ? "border-emerald-500 text-emerald-400"
                  : locked
                    ? "cursor-not-allowed border-transparent text-zinc-600"
                    : "border-transparent text-zinc-500 hover:text-zinc-300"
              )}
            >
              {locked ? <Lock className="h-3 w-3" /> : null}
              {card.title}
            </button>
          );
        })}
      </div>

      {activeCard ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-800/80 bg-zinc-900/30 px-4 py-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Study topic
            </p>
            <p className="mt-0.5 text-sm font-medium text-zinc-100">
              {activeCard.title}
            </p>
          </div>
          <Button asChild size="sm" variant="outline" className="gap-2">
            <Link
              href={CURRICULUM_ROUTES.moduleTopic(moduleSlug, activeCard.slug)}
            >
              <BookOpen className="h-3.5 w-3.5" />
              Read lesson
            </Link>
          </Button>
        </div>
      ) : null}

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="min-w-0 flex-1 space-y-3">
          {pageItems.length === 0 ? (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-10 text-center text-sm text-zinc-500">
              {activeCard?.status === "locked"
                ? "Complete the previous topic to unlock practice here."
                : "No challenges match your filters."}
            </div>
          ) : (
            pageItems.map((item, i) => {
              const { lesson, curriculumTopicTitle, entityId } = item;
              const done = hydrated && isDoneFn(entityId);
              const bookmarked = isBookmarkedFn(entityId);
              const isFirst = page === 0 && i === 0;
              const challengeNumber = String(page * PAGE_SIZE + i + 1).padStart(
                3,
                "0"
              );
              const estimatedMinutes =
                lesson.estimatedMinutes ??
                (lesson.difficulty === "easy"
                  ? 8
                  : lesson.difficulty === "medium"
                    ? 15
                    : 25);
              const xpPoints =
                estimatedMinutes *
                (lesson.difficulty === "easy"
                  ? 2
                  : lesson.difficulty === "medium"
                    ? 3
                    : 4);
              const successRate =
                lesson.difficulty === "easy"
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
                            bookmarked
                              ? "border-amber-400/60 bg-amber-500/10"
                              : "hover:border-amber-500/60"
                          )}
                          aria-label={
                            bookmarked
                              ? "Remove bookmark"
                              : "Bookmark challenge"
                          }
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
                            <span>{curriculumTopicTitle}</span>
                          </div>
                          <h2 className="mt-1 text-base font-semibold text-zinc-100">
                            {lesson.title}
                          </h2>
                          <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-zinc-500">
                            <span
                              className={cn(
                                "font-semibold",
                                DIFFICULTY_COLORS[lesson.difficulty]
                              )}
                            >
                              {DIFFICULTY_LABELS[lesson.difficulty]}
                            </span>
                            <span>|</span>
                            <span>{problemTypeLabel(lesson.problemType)}</span>
                            <span>|</span>
                            <span>Est. {estimatedMinutes} min</span>
                            <span>|</span>
                            <span>{xpPoints} XP</span>
                            <span>|</span>
                            <span className="tabular-nums text-emerald-400">
                              {successRate}% success
                            </span>
                            {done ? (
                              <>
                                <span>|</span>
                                <span className="text-emerald-400">Solved</span>
                              </>
                            ) : null}
                          </p>
                          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-400">
                            {lesson.problemStatement?.split("\n")[0] ??
                              lesson.description ??
                              `Practice ${categoryLabel(lesson.category)} concepts.`}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Button
                      asChild
                      size="sm"
                      className={cn(
                        "h-9 min-w-[8.5rem] shrink-0 font-semibold",
                        isFirst && !done
                          ? "bg-emerald-600 hover:bg-emerald-500"
                          : done
                            ? "border border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800"
                            : "border border-emerald-600/60 bg-transparent text-emerald-400 hover:bg-emerald-500/10"
                      )}
                      variant={isFirst && !done ? "default" : "outline"}
                    >
                      <Link
                        href={CURRICULUM_ROUTES.moduleChallenge(
                          moduleSlug,
                          item.curriculumTopicSlug,
                          item.id
                        )}
                      >
                        {done ? "Solved" : "Solve Challenge"}
                      </Link>
                    </Button>
                  </div>
                </article>
              );
            })
          )}

          {totalPages > 1 ? (
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
          ) : null}
        </div>

        <aside className="w-full shrink-0 space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/30 p-4 lg:sticky lg:top-6 lg:w-64 lg:self-start">
          <FilterSection title="Status">
            <FilterCheckbox
              label="Solved"
              checked={showSolved}
              onChange={setShowSolved}
            />
            <FilterCheckbox
              label="Unsolved"
              checked={showUnsolved}
              onChange={setShowUnsolved}
            />
            <FilterCheckbox
              label="Bookmarked only"
              checked={bookmarkedOnly}
              onChange={setBookmarkedOnly}
            />
          </FilterSection>
          <FilterSection title="Difficulty">
            <FilterCheckbox
              label="Easy"
              checked={diffEasy}
              onChange={setDiffEasy}
            />
            <FilterCheckbox
              label="Medium"
              checked={diffMedium}
              onChange={setDiffMedium}
            />
            <FilterCheckbox
              label="Hard"
              checked={diffHard}
              onChange={setDiffHard}
            />
          </FilterSection>
        </aside>
      </div>
    </div>
  );
}
