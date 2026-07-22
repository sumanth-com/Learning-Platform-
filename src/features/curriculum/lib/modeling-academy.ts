import type { LessonSummary } from "@/features/curriculum/types";
import {
  allModelingAcademyChallenges,
  modelingAcademyTopicChallengeCount,
} from "@/features/curriculum/lib/modeling-academy-challenges";
import {
  MODELING_ACADEMY_SECTIONS,
  flattenModelingTopics,
  type ModelingTopicDef,
} from "@/features/curriculum/lib/modeling-academy-curriculum";

export const MODELING_ACADEMY_SLUG = "data-modeling";

export function isModelingAcademyModule(moduleSlug: string) {
  return moduleSlug === MODELING_ACADEMY_SLUG;
}

export function getModelingAcademySections() {
  return MODELING_ACADEMY_SECTIONS;
}

export function getModelingAcademyTopics(): ModelingTopicDef[] {
  return flattenModelingTopics();
}

export function getModelingAcademyTopic(slug: string): ModelingTopicDef | null {
  return flattenModelingTopics().find((t) => t.slug === slug) ?? null;
}

export function getModelingAcademyTopicLimit(topicSlug: string): number {
  return modelingAcademyTopicChallengeCount(topicSlug);
}

export function mergeModelingAcademyLessons(
  lessons: LessonSummary[],
  completedIds: Set<string>
): LessonSummary[] {
  const bySlug = new Map(lessons.map((l) => [l.slug, l]));
  const merged: LessonSummary[] = [];
  let order = 1;
  for (const topic of flattenModelingTopics()) {
    const existing = bySlug.get(topic.slug);
    if (existing) {
      merged.push(existing);
    } else {
      merged.push({
        id: `modeling-${topic.slug}`,
        title: topic.title,
        slug: topic.slug,
        description: topic.summary,
        durationMinutes: topic.estimatedMinutes,
        difficulty: topic.difficulty,
        sortOrder: order,
        isPreview: order === 1,
        isCompleted: completedIds.has(`modeling-${topic.slug}`),
      });
    }
    order += 1;
  }
  return merged;
}

export function modelingAcademyChallengeCounts() {
  const all = allModelingAcademyChallenges();
  return {
    easy: all.filter((c) => c.difficulty === "easy").length,
    medium: all.filter((c) => c.difficulty === "medium").length,
    hard: all.filter((c) => c.difficulty === "hard").length,
    total: all.length,
  };
}
