import type { LessonSummary } from "@/features/curriculum/types";
import {
  allAuthAcademyChallenges,
  authAcademyTopicChallengeCount,
} from "@/features/curriculum/lib/auth-academy-challenges";
import {
  AUTH_ACADEMY_SECTIONS,
  flattenAuthTopics,
  type AuthTopicDef,
} from "@/features/curriculum/lib/auth-academy-curriculum";

export const AUTH_ACADEMY_SLUG = "auth-and-security";

export function isAuthAcademyModule(moduleSlug: string) {
  return moduleSlug === AUTH_ACADEMY_SLUG;
}

export function getAuthAcademySections() {
  return AUTH_ACADEMY_SECTIONS;
}

export function getAuthAcademyTopics(): AuthTopicDef[] {
  return flattenAuthTopics();
}

export function getAuthAcademyTopic(slug: string): AuthTopicDef | null {
  return flattenAuthTopics().find((t) => t.slug === slug) ?? null;
}

export function getAuthAcademyTopicLimit(topicSlug: string): number {
  return authAcademyTopicChallengeCount(topicSlug);
}

export function mergeAuthAcademyLessons(
  lessons: LessonSummary[],
  completedIds: Set<string>
): LessonSummary[] {
  const bySlug = new Map(lessons.map((l) => [l.slug, l]));
  const merged: LessonSummary[] = [];
  let order = 1;
  for (const topic of flattenAuthTopics()) {
    const existing = bySlug.get(topic.slug);
    if (existing) {
      merged.push(existing);
    } else {
      merged.push({
        id: `auth-${topic.slug}`,
        title: topic.title,
        slug: topic.slug,
        description: topic.summary,
        durationMinutes: topic.estimatedMinutes,
        difficulty: topic.difficulty,
        sortOrder: order,
        isPreview: order === 1,
        isCompleted: completedIds.has(`auth-${topic.slug}`),
      });
    }
    order += 1;
  }
  return merged;
}

export function authAcademyChallengeCounts(): {
  easy: number;
  medium: number;
  hard: number;
  total: number;
} {
  const all = allAuthAcademyChallenges();
  return {
    easy: all.filter((c) => c.difficulty === "easy").length,
    medium: all.filter((c) => c.difficulty === "medium").length,
    hard: all.filter((c) => c.difficulty === "hard").length,
    total: all.length,
  };
}
