"use client";

import { useMemo } from "react";
import { getCurriculumWeeks, getCurriculumWeek, getTotalWeeks } from "@/curriculum/registry";
import type { CurriculumWeekDefinition } from "@/curriculum/types";
import { useProgressStore } from "@/store/use-progress-store";
import {
  computeWeekProgress,
  computeGlobalStats,
  getTodayProgress,
  getTodayDayNumber,
  getProjectProgressPercent,
} from "@/lib/progress-engine";

export function useCurriculum() {
  return useMemo(() => getCurriculumWeeks(), []);
}

export function useCurriculumWeek(weekId: number): CurriculumWeekDefinition | undefined {
  return useMemo(() => getCurriculumWeek(weekId), [weekId]);
}

export function useTotalWeeks() {
  return getTotalWeeks();
}

export function useGlobalStats() {
  const progress = useProgressStore((s) => s.progress);
  return useMemo(() => computeGlobalStats(getCurriculumWeeks(), progress), [progress]);
}

export function useWeekProgress(weekId: number) {
  const progress = useProgressStore((s) => s.progress);
  return useMemo(() => {
    const week = getCurriculumWeek(weekId);
    if (!week) return null;
    return computeWeekProgress(week, progress);
  }, [weekId, progress]);
}

export function useTodayProgress(weekId: number) {
  const progress = useProgressStore((s) => s.progress);
  return useMemo(() => {
    const week = getCurriculumWeek(weekId);
    if (!week) return { completed: 0, total: 0, percentage: 0 };
    return getTodayProgress(week, progress, getTodayDayNumber());
  }, [weekId, progress]);
}

export function useProjectProgress(projectId: string, weekId: number) {
  const progress = useProgressStore((s) => s.progress);
  return useMemo(() => {
    const week = getCurriculumWeek(weekId);
    if (!week) return 0;
    return getProjectProgressPercent(projectId, week, progress);
  }, [projectId, weekId, progress]);
}

export function useEntityProgress(entityId: string) {
  const isDone = useProgressStore((s) => s.isDone(entityId));
  const toggle = useProgressStore((s) => s.toggleComplete);
  const note = useProgressStore((s) => s.getNote(entityId));
  const setNote = useProgressStore((s) => s.setNote);
  const bookmarked = useProgressStore((s) => s.isBookmarked(entityId));
  const toggleBookmark = useProgressStore((s) => s.toggleBookmark);
  const completionDate = useProgressStore((s) => s.progress.completionDates[entityId]);

  return { isDone, toggle, note, setNote, bookmarked, toggleBookmark, completionDate };
}

export function useWeekAccess(weekId: number) {
  const isLocked = useProgressStore((s) => s.isLocked(weekId));
  const isCompleted = useProgressStore((s) => s.isCompleted(weekId));
  const progress = useWeekProgress(weekId);
  return { isLocked, isCompleted, progress };
}

export function useCurrentWeekId() {
  return useProgressStore((s) => s.getCurrentWeekId());
}
