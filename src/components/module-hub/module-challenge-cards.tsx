"use client";

import Link from "next/link";
import { SaveDiamondButton } from "@/components/shared/save-diamond-button";
import { Button } from "@/components/ui/button";
import { CURRICULUM_ROUTES } from "@/features/curriculum/lib/curriculum-routes";
import type { ModuleHubChallengeSummary } from "@/features/curriculum/lib/module-hub-challenge-summary";
import { DIFFICULTY_LABELS } from "@/learning-engine/labels";
import type { LearnDifficulty } from "@/learning-engine/types";
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
  challenges: ModuleHubChallengeSummary[];
};

export function ModuleChallengeCards({
  moduleSlug,
  topicSlug,
  challenges,
}: ModuleChallengeCardsProps) {
  const hydrated = useStoreHydrated();
  const isDoneFn = useProgressStore((s) => s.isDone);

  if (challenges.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-950/40 p-8 text-center text-sm text-zinc-500">
        Practice challenges for this topic are coming soon.
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {challenges.map((item) => {
        const done = hydrated && isDoneFn(item.entityId);
        const estimatedMinutes =
          item.estimatedMinutes ??
          (item.difficulty === "easy"
            ? 8
            : item.difficulty === "medium"
              ? 15
              : 25);
        const xpPoints =
          estimatedMinutes *
          (item.difficulty === "easy"
            ? 2
            : item.difficulty === "medium"
              ? 3
              : 4);
        const successRate =
          item.difficulty === "easy"
            ? 82
            : item.difficulty === "medium"
              ? 67
              : 41;

        return (
          <li key={item.id}>
            <article className="surface-card-3d p-4 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <SaveDiamondButton entityId={item.entityId} />
                    <h3 className="min-w-0 truncate text-base font-semibold text-zinc-100">
                      {item.title}
                    </h3>
                  </div>
                  <div className="mt-1.5 min-w-0 sm:pl-9">
                    <p className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-zinc-500">
                      <span
                        className={cn(
                          "font-semibold",
                          DIFFICULTY_COLORS[item.difficulty]
                        )}
                      >
                        {DIFFICULTY_LABELS[item.difficulty]}
                      </span>
                      <span>|</span>
                      <span>{item.kindLabel}</span>
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
                      {item.scenario}
                    </p>
                  </div>
                </div>
                <Button
                  asChild
                  size="sm"
                  className="h-9 w-full shrink-0 rounded-full bg-emerald-600 font-semibold shadow-sm shadow-emerald-600/25 hover:bg-emerald-500 sm:w-auto"
                >
                  <Link
                    href={CURRICULUM_ROUTES.moduleChallenge(
                      moduleSlug,
                      topicSlug,
                      item.id
                    )}
                    prefetch={false}
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
