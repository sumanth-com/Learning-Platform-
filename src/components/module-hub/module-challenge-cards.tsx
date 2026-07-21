"use client";

import Link from "next/link";
import { Bookmark, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CURRICULUM_ROUTES } from "@/features/curriculum/lib/curriculum-routes";
import type { TopicChallenge } from "@/features/curriculum/lib/topic-challenges";
import { DIFFICULTY_LABELS, problemTypeLabel } from "@/learning-engine/labels";
import type { LearnDifficulty } from "@/learning-engine/types";
import { curriculumChallengeEntityId } from "@/features/curriculum/lib/topic-challenges";
import { useProgressStore } from "@/store/use-progress-store";
import { useStoreHydrated } from "@/hooks/use-store-hydrated";
import { cn } from "@/lib/utils";

const DIFFICULTY_COLORS: Record<LearnDifficulty, string> = {
  easy: "text-emerald-400",
  medium: "text-amber-400",
  hard: "text-rose-400",
};

type ModuleChallengeCardsProps = {
  moduleSlug: string;
  topicSlug: string;
  challenges: TopicChallenge[];
};

export function ModuleChallengeCards({
  moduleSlug,
  topicSlug,
  challenges,
}: ModuleChallengeCardsProps) {
  const hydrated = useStoreHydrated();
  const isDoneFn = useProgressStore((s) => s.isDone);
  const isBookmarkedFn = useProgressStore((s) => s.isBookmarked);
  const toggleBookmark = useProgressStore((s) => s.toggleBookmark);

  if (challenges.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-950/40 p-8 text-center text-sm text-zinc-500">
        Practice challenges for this topic are coming soon.
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {challenges.map((item, index) => {
        const { lesson } = item;
        const entityId = curriculumChallengeEntityId(moduleSlug, {
          weekId: item.weekId || 0,
          topicSlug: item.topicSlug,
          lesson,
        });
        const done = hydrated && isDoneFn(entityId);
        const bookmarked = hydrated && isBookmarkedFn(entityId);
        const challengeNumber = String(index + 1).padStart(3, "0");
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
          <li key={item.id}>
            <article className="rounded-xl border border-zinc-800/90 bg-zinc-900/40 p-4 transition-colors hover:border-zinc-700">
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
                        bookmarked ? "Remove bookmark" : "Bookmark challenge"
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
                        <span>Challenge</span>
                      </div>
                      <h3 className="mt-1 text-base font-semibold text-zinc-100">
                        {lesson.title}
                      </h3>
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
                        <span>|</span>
                        <span
                          className={
                            done ? "text-emerald-400" : "text-zinc-500"
                          }
                        >
                          {done ? "Solved" : "Unsolved"}
                        </span>
                      </p>
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-400">
                        {lesson.problemStatement?.split("\n").find(Boolean) ??
                          lesson.description}
                      </p>
                    </div>
                  </div>
                </div>
                <Button
                  asChild
                  size="sm"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 sm:w-auto"
                >
                  <Link
                    href={CURRICULUM_ROUTES.moduleChallenge(
                      moduleSlug,
                      topicSlug,
                      item.id
                    )}
                  >
                    Solve Challenge
                  </Link>
                </Button>
              </div>
            </article>
          </li>
        );
      })}
    </ul>
  );
}
