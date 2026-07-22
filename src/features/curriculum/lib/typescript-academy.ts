import type { LessonSummary } from "@/features/curriculum/types";
import {
  allTypescriptAcademyChallenges,
  typescriptAcademyTopicChallengeCount,
} from "@/features/curriculum/lib/typescript-academy-challenges";
import {
  TYPESCRIPT_ACADEMY_SECTIONS,
  flattenTypescriptTopics,
  type TypescriptTopicDef,
} from "@/features/curriculum/lib/typescript-academy-curriculum";

export const TYPESCRIPT_ACADEMY_SLUG = "typescript";

export function isTypescriptAcademyModule(moduleSlug: string) {
  return moduleSlug === TYPESCRIPT_ACADEMY_SLUG;
}

export function getTypescriptAcademySections() {
  return TYPESCRIPT_ACADEMY_SECTIONS;
}

export function getTypescriptAcademyTopics(): TypescriptTopicDef[] {
  return flattenTypescriptTopics();
}

export function getTypescriptAcademyTopic(slug: string): TypescriptTopicDef | null {
  return flattenTypescriptTopics().find((t) => t.slug === slug) ?? null;
}

export function getTypescriptAcademyTopicLimit(topicSlug: string): number {
  return typescriptAcademyTopicChallengeCount(topicSlug);
}

export function mergeTypescriptAcademyLessons(
  lessons: LessonSummary[],
  completedIds: Set<string>
): LessonSummary[] {
  const bySlug = new Map(lessons.map((l) => [l.slug, l]));
  const merged: LessonSummary[] = [];
  let order = 1;
  for (const topic of flattenTypescriptTopics()) {
    const existing = bySlug.get(topic.slug);
    if (existing) {
      merged.push(existing);
    } else {
      merged.push({
        id: `ts-${topic.slug}`,
        title: topic.title,
        slug: topic.slug,
        description: topic.summary,
        durationMinutes: topic.estimatedMinutes,
        difficulty: topic.difficulty,
        sortOrder: order,
        isPreview: order === 1,
        isCompleted: completedIds.has(`ts-${topic.slug}`),
      });
    }
    order += 1;
  }
  return merged;
}

export function typescriptAcademyChallengeCounts(): {
  easy: number;
  medium: number;
  hard: number;
  total: number;
} {
  const all = allTypescriptAcademyChallenges();
  const easy = all.filter((c) => c.difficulty === "easy").length;
  const medium = all.filter((c) => c.difficulty === "medium").length;
  const hard = all.filter((c) => c.difficulty === "hard").length;
  return { easy, medium, hard, total: all.length };
}
