import type { LessonSummary } from "@/features/curriculum/types";
import {
  allCicdAcademyChallenges,
  cicdAcademyTopicChallengeCount,
} from "@/features/curriculum/lib/cicd-academy-challenges";
import {
  CICD_ACADEMY_SECTIONS,
  flattenCicdTopics,
  type CicdTopicDef,
} from "@/features/curriculum/lib/cicd-academy-curriculum";

export const CICD_ACADEMY_SLUG = "ci-cd-fundamentals";

export function isCicdAcademyModule(moduleSlug: string) {
  return moduleSlug === CICD_ACADEMY_SLUG;
}

export function getCicdAcademySections() {
  return CICD_ACADEMY_SECTIONS;
}

export function getCicdAcademyTopics(): CicdTopicDef[] {
  return flattenCicdTopics();
}

export function getCicdAcademyTopic(slug: string): CicdTopicDef | null {
  return flattenCicdTopics().find((t) => t.slug === slug) ?? null;
}

export function getCicdAcademyTopicLimit(topicSlug: string): number {
  return cicdAcademyTopicChallengeCount(topicSlug);
}

export function mergeCicdAcademyLessons(
  lessons: LessonSummary[],
  completedIds: Set<string>
): LessonSummary[] {
  const bySlug = new Map(lessons.map((l) => [l.slug, l]));
  const merged: LessonSummary[] = [];
  let order = 1;
  for (const topic of flattenCicdTopics()) {
    const existing = bySlug.get(topic.slug);
    if (existing) {
      merged.push(existing);
    } else {
      merged.push({
        id: `cicd-${topic.slug}`,
        title: topic.title,
        slug: topic.slug,
        description: topic.summary,
        durationMinutes: topic.estimatedMinutes,
        difficulty: topic.difficulty,
        sortOrder: order,
        isPreview: order === 1,
        isCompleted: completedIds.has(`cicd-${topic.slug}`),
      });
    }
    order += 1;
  }
  return merged;
}

export function cicdAcademyChallengeCounts() {
  const all = allCicdAcademyChallenges();
  return {
    easy: all.filter((c) => c.difficulty === "easy").length,
    medium: all.filter((c) => c.difficulty === "medium").length,
    hard: all.filter((c) => c.difficulty === "hard").length,
    total: all.length,
  };
}
