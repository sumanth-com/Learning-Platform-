import type { LessonDifficulty, LessonSummary, ModuleDetail } from "@/features/curriculum/types";

export function moduleDifficulty(
  lessons: LessonSummary[]
): LessonDifficulty {
  if (lessons.length === 0) return "beginner";
  const score = { beginner: 1, intermediate: 2, advanced: 3 } as const;
  const avg =
    lessons.reduce((sum, l) => sum + score[l.difficulty], 0) / lessons.length;
  if (avg < 1.5) return "beginner";
  if (avg < 2.5) return "intermediate";
  return "advanced";
}

export function moduleOutcomes(detail: ModuleDetail): string[] {
  const fromDescription = detail.module.description
    ?.split(/[.\n]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 24)
    .slice(0, 3);

  if (fromDescription && fromDescription.length > 0) return fromDescription;

  return detail.lessons.slice(0, 4).map((lesson) => `Master ${lesson.title}`);
}

export function formatModuleDuration(detail: ModuleDetail): string {
  if (detail.module.estimated_duration?.trim()) {
    return detail.module.estimated_duration;
  }
  const minutes = detail.totalDurationMinutes;
  if (minutes <= 0) return "—";
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

export function topicStatus(
  lesson: LessonSummary,
  currentSlug: string | null
): "completed" | "current" | "upcoming" {
  if (lesson.isCompleted) return "completed";
  if (lesson.slug === currentSlug) return "current";
  return "upcoming";
}

export function findResumeTopic(lessons: LessonSummary[]): LessonSummary | null {
  return lessons.find((l) => !l.isCompleted) ?? lessons[0] ?? null;
}
