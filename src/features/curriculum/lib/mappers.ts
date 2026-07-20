import type { LessonRow } from "@/types/database";
import type { LessonSummary } from "@/features/curriculum/types";

export function toLessonSummary(
  lesson: LessonRow,
  completedIds: Set<string>
): LessonSummary {
  return {
    id: lesson.id,
    title: lesson.title,
    slug: lesson.slug,
    description: lesson.description,
    durationMinutes: lesson.duration_minutes,
    difficulty: lesson.difficulty,
    sortOrder: lesson.sort_order,
    isPreview: lesson.is_preview,
    isCompleted: completedIds.has(lesson.id),
  };
}

export function percent(completed: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}
