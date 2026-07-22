import type { LessonSummary } from "@/features/curriculum/types";
import {
  allShipAcademyChallenges,
  shipAcademyTopicChallengeCount,
} from "@/features/curriculum/lib/ship-academy-challenges";
import {
  SHIP_ACADEMY_SECTIONS,
  flattenShipTopics,
  type ShipTopicDef,
} from "@/features/curriculum/lib/ship-academy-curriculum";

export const SHIP_ACADEMY_SLUG = "ship-the-product";

export function isShipAcademyModule(moduleSlug: string) {
  return moduleSlug === SHIP_ACADEMY_SLUG;
}

export function getShipAcademySections() {
  return SHIP_ACADEMY_SECTIONS;
}

export function getShipAcademyTopics(): ShipTopicDef[] {
  return flattenShipTopics();
}

export function getShipAcademyTopic(slug: string): ShipTopicDef | null {
  return flattenShipTopics().find((t) => t.slug === slug) ?? null;
}

export function getShipAcademyTopicLimit(topicSlug: string): number {
  return shipAcademyTopicChallengeCount(topicSlug);
}

export function mergeShipAcademyLessons(
  lessons: LessonSummary[],
  completedIds: Set<string>
): LessonSummary[] {
  const bySlug = new Map(lessons.map((l) => [l.slug, l]));
  const merged: LessonSummary[] = [];
  let order = 1;
  for (const topic of flattenShipTopics()) {
    const existing = bySlug.get(topic.slug);
    if (existing) {
      merged.push(existing);
    } else {
      merged.push({
        id: `ship-${topic.slug}`,
        title: topic.title,
        slug: topic.slug,
        description: topic.summary,
        durationMinutes: topic.estimatedMinutes,
        difficulty: topic.difficulty,
        sortOrder: order,
        isPreview: order === 1,
        isCompleted: completedIds.has(`ship-${topic.slug}`),
      });
    }
    order += 1;
  }
  return merged;
}

export function shipAcademyChallengeCounts() {
  const all = allShipAcademyChallenges();
  return {
    easy: all.filter((c) => c.difficulty === "easy").length,
    medium: all.filter((c) => c.difficulty === "medium").length,
    hard: all.filter((c) => c.difficulty === "hard").length,
    total: all.length,
  };
}
