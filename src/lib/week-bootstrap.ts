import { getCurriculumWeeks } from "@/curriculum/registry";
import {
  isWeekFullyCompleteAcrossModules,
  markWeekCompleteAllModules,
  migrateProgressStateV3,
} from "@/lib/module-progress";
import type { UserProgressState } from "@/store/progress-types";

function ensureWeekComplete(
  progress: UserProgressState,
  weekId: number,
  nextWeekId: number
): UserProgressState {
  const weeks = getCurriculumWeeks();
  const nextOpen = progress.moduleGates?.practice?.unlockedWeekIds?.includes(nextWeekId) ?? false;
  const weekDone = isWeekFullyCompleteAcrossModules(progress, weekId, weeks);

  if (nextOpen && weekDone) {
    return migrateProgressStateV3(progress, weeks, { rebuildGates: true });
  }

  const seeded = markWeekCompleteAllModules(progress, weekId, weeks);
  return migrateProgressStateV3(seeded, weeks, { rebuildGates: true });
}

/**
 * Bootstrap weeks 1–2 to 100% everywhere so weeks 1, 2, and 3 are unlocked.
 * Week 4+ unlocks only when the previous week is fully completed.
 */
export function ensurePrathyuBootstrap(progress: UserProgressState): UserProgressState {
  let next = ensureWeekComplete(progress, 1, 2);
  next = ensureWeekComplete(next, 2, 3);
  return next;
}
