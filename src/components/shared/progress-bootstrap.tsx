"use client";

import { useEffect, useRef } from "react";
import { useProgressStore } from "@/store/use-progress-store";
import { useCurriculum } from "@/hooks/use-curriculum";
import { useStoreHydrated } from "@/hooks/use-store-hydrated";
import { getWeekById } from "@/curriculum/java-roadmap/curriculum";
import { isWeekFullyCompleteAcrossModules } from "@/lib/module-progress";
import { fireWeekCelebration } from "@/components/shared/week-completion-celebration";
import { syncCelebratedWeeks } from "@/lib/week-celebration-storage";

/** Runs once on app load: restore profile, daily goal, streak, and sync week gates. */
export function ProgressBootstrap() {
  const bootstrap = useProgressStore((s) => s.bootstrapSession);
  const hydrated = useStoreHydrated();

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  useEffect(() => {
    if (!hydrated) return;
    bootstrap();
  }, [hydrated, bootstrap]);

  return null;
}

/** Celebrates when a week is newly fully complete across every learning module. */
export function ModuleCompletionWatcher() {
  const weeks = useCurriculum();
  const progress = useProgressStore((s) => s.progress);
  const hydrated = useStoreHydrated();
  const prevCompleteRef = useRef<Record<number, boolean>>({});
  const syncedBaselineRef = useRef(false);

  useEffect(() => {
    if (!hydrated) return;

    const completedIds: number[] = [];

    weeks.forEach((week) => {
      const complete = isWeekFullyCompleteAcrossModules(progress, week.id, weeks);
      if (complete) completedIds.push(week.id);

      const prev = prevCompleteRef.current[week.id];
      const hasBaseline = prev !== undefined;

      if (hasBaseline && !prev && complete) {
        const meta = getWeekById(week.id);
        const nextWeek = week.id + 1;
        fireWeekCelebration({
          completedWeekId: week.id,
          nextWeekId: nextWeek <= weeks.length ? nextWeek : null,
          weekTitle: meta?.title ?? `Week ${week.id}`,
          weekEmoji: meta?.emoji,
        });
      }

      prevCompleteRef.current[week.id] = complete;
    });

    if (!syncedBaselineRef.current) {
      syncCelebratedWeeks(completedIds);
      syncedBaselineRef.current = true;
    }
  }, [weeks, progress.completed, hydrated]);

  return null;
}

/** @deprecated use ModuleCompletionWatcher */
export function WeekCompletionWatcher() {
  return <ModuleCompletionWatcher />;
}

export { MODULE_LABELS, type LearningModule } from "@/lib/module-progress";
