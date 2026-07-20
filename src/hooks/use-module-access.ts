"use client";

import { useMemo } from "react";
import { useProgressStore } from "@/store/use-progress-store";
import { useCurriculumWeek } from "@/hooks/use-curriculum";
import {
  getModuleWeekProgress,
  type LearningModule,
} from "@/lib/module-progress";

export function useModuleWeekAccess(module: LearningModule, weekId: number) {
  const week = useCurriculumWeek(module === "communication" ? 1 : weekId);
  const progress = useProgressStore((s) => s.progress);
  const isLocked = useProgressStore((s) => s.isModuleWeekLocked(module, weekId));
  const isCompleted = useProgressStore((s) => s.isModuleWeekCompleted(module, weekId));

  const segment = useMemo(
    () => getModuleWeekProgress(module, weekId, week, progress),
    [module, weekId, week, progress.completed]
  );

  return {
    isLocked,
    isCompleted,
    progress: segment,
    isActive: !isLocked && !isCompleted,
  };
}
