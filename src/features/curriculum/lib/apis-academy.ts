import type { LessonSummary } from "@/features/curriculum/types";
import {
  allApisAcademyChallenges,
  apisAcademyTopicChallengeCount,
} from "@/features/curriculum/lib/apis-academy-challenges";
import {
  APIS_ACADEMY_SECTIONS,
  flattenApisTopics,
  type ApisTopicDef,
} from "@/features/curriculum/lib/apis-academy-curriculum";

export const APIS_ACADEMY_SLUG = "apis-and-services";

export function isApisAcademyModule(moduleSlug: string) {
  return moduleSlug === APIS_ACADEMY_SLUG;
}

export function getApisAcademySections() {
  return APIS_ACADEMY_SECTIONS;
}

export function getApisAcademyTopics(): ApisTopicDef[] {
  return flattenApisTopics();
}

export function getApisAcademyTopic(slug: string): ApisTopicDef | null {
  return flattenApisTopics().find((t) => t.slug === slug) ?? null;
}

export function getApisAcademyTopicLimit(topicSlug: string): number {
  return apisAcademyTopicChallengeCount(topicSlug);
}

export function mergeApisAcademyLessons(
  lessons: LessonSummary[],
  completedIds: Set<string>
): LessonSummary[] {
  const bySlug = new Map(lessons.map((l) => [l.slug, l]));
  const merged: LessonSummary[] = [];
  let order = 1;
  for (const topic of flattenApisTopics()) {
    const existing = bySlug.get(topic.slug);
    if (existing) {
      merged.push(existing);
    } else {
      merged.push({
        id: `apis-${topic.slug}`,
        title: topic.title,
        slug: topic.slug,
        description: topic.summary,
        durationMinutes: topic.estimatedMinutes,
        difficulty: topic.difficulty,
        sortOrder: order,
        isPreview: order === 1,
        isCompleted: completedIds.has(`apis-${topic.slug}`),
      });
    }
    order += 1;
  }
  return merged;
}

export function apisAcademyChallengeCounts(): {
  easy: number;
  medium: number;
  hard: number;
  total: number;
} {
  const all = allApisAcademyChallenges();
  return {
    easy: all.filter((c) => c.difficulty === "easy").length,
    medium: all.filter((c) => c.difficulty === "medium").length,
    hard: all.filter((c) => c.difficulty === "hard").length,
    total: all.length,
  };
}
