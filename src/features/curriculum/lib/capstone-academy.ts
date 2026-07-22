import type { LessonSummary } from "@/features/curriculum/types";
import {
  allCapstoneAcademyChallenges,
  capstoneAcademyTopicChallengeCount,
} from "@/features/curriculum/lib/capstone-academy-challenges";
import {
  CAPSTONE_ACADEMY_SECTIONS,
  flattenCapstoneTopics,
  type CapstoneTopicDef,
} from "@/features/curriculum/lib/capstone-academy-curriculum";

export const CAPSTONE_ACADEMY_SLUG = "capstone-planning";

export function isCapstoneAcademyModule(moduleSlug: string) {
  return moduleSlug === CAPSTONE_ACADEMY_SLUG;
}

export function getCapstoneAcademySections() {
  return CAPSTONE_ACADEMY_SECTIONS;
}

export function getCapstoneAcademyTopics(): CapstoneTopicDef[] {
  return flattenCapstoneTopics();
}

export function getCapstoneAcademyTopic(slug: string): CapstoneTopicDef | null {
  return flattenCapstoneTopics().find((t) => t.slug === slug) ?? null;
}

export function getCapstoneAcademyTopicLimit(topicSlug: string): number {
  return capstoneAcademyTopicChallengeCount(topicSlug);
}

export function mergeCapstoneAcademyLessons(
  lessons: LessonSummary[],
  completedIds: Set<string>
): LessonSummary[] {
  const bySlug = new Map(lessons.map((l) => [l.slug, l]));
  const merged: LessonSummary[] = [];
  let order = 1;
  for (const topic of flattenCapstoneTopics()) {
    const existing = bySlug.get(topic.slug);
    if (existing) {
      merged.push(existing);
    } else {
      merged.push({
        id: `capstone-${topic.slug}`,
        title: topic.title,
        slug: topic.slug,
        description: topic.summary,
        durationMinutes: topic.estimatedMinutes,
        difficulty: topic.difficulty,
        sortOrder: order,
        isPreview: order === 1,
        isCompleted: completedIds.has(`capstone-${topic.slug}`),
      });
    }
    order += 1;
  }
  return merged;
}

export function capstoneAcademyChallengeCounts() {
  const all = allCapstoneAcademyChallenges();
  return {
    easy: all.filter((c) => c.difficulty === "easy").length,
    medium: all.filter((c) => c.difficulty === "medium").length,
    hard: all.filter((c) => c.difficulty === "hard").length,
    total: all.length,
  };
}
