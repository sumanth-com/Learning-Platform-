import type { LessonSummary } from "@/features/curriculum/types";
import {
  allAiFeaturesAcademyChallenges,
  aiFeaturesAcademyTopicChallengeCount,
} from "@/features/curriculum/lib/ai-features-academy-challenges";
import {
  AI_FEATURES_ACADEMY_SECTIONS,
  flattenAiFeaturesTopics,
  type AiFeaturesTopicDef,
} from "@/features/curriculum/lib/ai-features-academy-curriculum";

export const AI_FEATURES_ACADEMY_SLUG = "building-ai-features";

export function isAiFeaturesAcademyModule(moduleSlug: string) {
  return moduleSlug === AI_FEATURES_ACADEMY_SLUG;
}

export function getAiFeaturesAcademySections() {
  return AI_FEATURES_ACADEMY_SECTIONS;
}

export function getAiFeaturesAcademyTopics(): AiFeaturesTopicDef[] {
  return flattenAiFeaturesTopics();
}

export function getAiFeaturesAcademyTopic(
  slug: string
): AiFeaturesTopicDef | null {
  return flattenAiFeaturesTopics().find((t) => t.slug === slug) ?? null;
}

export function getAiFeaturesAcademyTopicLimit(topicSlug: string): number {
  return aiFeaturesAcademyTopicChallengeCount(topicSlug);
}

export function mergeAiFeaturesAcademyLessons(
  lessons: LessonSummary[],
  completedIds: Set<string>
): LessonSummary[] {
  const bySlug = new Map(lessons.map((l) => [l.slug, l]));
  const merged: LessonSummary[] = [];
  let order = 1;
  for (const topic of flattenAiFeaturesTopics()) {
    const existing = bySlug.get(topic.slug);
    if (existing) {
      merged.push(existing);
    } else {
      merged.push({
        id: `aifeat-${topic.slug}`,
        title: topic.title,
        slug: topic.slug,
        description: topic.summary,
        durationMinutes: topic.estimatedMinutes,
        difficulty: topic.difficulty,
        sortOrder: order,
        isPreview: order === 1,
        isCompleted: completedIds.has(`aifeat-${topic.slug}`),
      });
    }
    order += 1;
  }
  return merged;
}

export function aiFeaturesAcademyChallengeCounts() {
  const all = allAiFeaturesAcademyChallenges();
  return {
    easy: all.filter((c) => c.difficulty === "easy").length,
    medium: all.filter((c) => c.difficulty === "medium").length,
    hard: all.filter((c) => c.difficulty === "hard").length,
    total: all.length,
  };
}
