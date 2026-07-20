import { extractLearningObjectives } from "@/features/assignments/lib/extract-objectives";

/**
 * Prefer admin-authored objectives; fall back to markdown extraction.
 */
export function resolveLessonObjectives(
  learningObjectives: string[] | null | undefined,
  content: string
): string[] {
  const fromDb = (learningObjectives ?? []).map((s) => s.trim()).filter(Boolean);
  if (fromDb.length > 0) return fromDb;
  return extractLearningObjectives(content);
}
