import type { LessonSummary } from "@/features/curriculum/types";
import {
  allSystemsAcademyChallenges,
  systemsAcademyTopicChallengeCount,
} from "@/features/curriculum/lib/systems-academy-challenges";
import {
  SYSTEMS_ACADEMY_SECTIONS,
  flattenSystemsTopics,
  type SystemsTopicDef,
} from "@/features/curriculum/lib/systems-academy-curriculum";

export const SYSTEMS_ACADEMY_SLUG = "system-design-behavioral";

export function isSystemsAcademyModule(moduleSlug: string) {
  return moduleSlug === SYSTEMS_ACADEMY_SLUG;
}

export function getSystemsAcademySections() {
  return SYSTEMS_ACADEMY_SECTIONS;
}

export function getSystemsAcademyTopics(): SystemsTopicDef[] {
  return flattenSystemsTopics();
}

export function getSystemsAcademyTopic(slug: string): SystemsTopicDef | null {
  return flattenSystemsTopics().find((t) => t.slug === slug) ?? null;
}

export function getSystemsAcademyTopicLimit(topicSlug: string): number {
  return systemsAcademyTopicChallengeCount(topicSlug);
}

export function mergeSystemsAcademyLessons(
  lessons: LessonSummary[],
  completedIds: Set<string>
): LessonSummary[] {
  const bySlug = new Map(lessons.map((l) => [l.slug, l]));
  const merged: LessonSummary[] = [];
  let order = 1;
  for (const topic of flattenSystemsTopics()) {
    const existing = bySlug.get(topic.slug);
    if (existing) {
      merged.push(existing);
    } else {
      merged.push({
        id: `systems-${topic.slug}`,
        title: topic.title,
        slug: topic.slug,
        description: topic.summary,
        durationMinutes: topic.estimatedMinutes,
        difficulty: topic.difficulty,
        sortOrder: order,
        isPreview: order === 1,
        isCompleted: completedIds.has(`systems-${topic.slug}`),
      });
    }
    order += 1;
  }
  return merged;
}

export function systemsAcademyChallengeCounts() {
  const all = allSystemsAcademyChallenges();
  return {
    easy: all.filter((c) => c.difficulty === "easy").length,
    medium: all.filter((c) => c.difficulty === "medium").length,
    hard: all.filter((c) => c.difficulty === "hard").length,
    total: all.length,
  };
}
