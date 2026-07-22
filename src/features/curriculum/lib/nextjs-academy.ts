import type { LessonSummary } from "@/features/curriculum/types";
import {
  allNextjsAcademyChallenges,
  nextjsAcademyTopicChallengeCount,
} from "@/features/curriculum/lib/nextjs-academy-challenges";
import {
  NEXTJS_ACADEMY_SECTIONS,
  flattenNextjsTopics,
  type NextjsTopicDef,
} from "@/features/curriculum/lib/nextjs-academy-curriculum";

export const NEXTJS_ACADEMY_SLUG = "nextjs";

export function isNextjsAcademyModule(moduleSlug: string) {
  return moduleSlug === NEXTJS_ACADEMY_SLUG;
}

export function getNextjsAcademySections() {
  return NEXTJS_ACADEMY_SECTIONS;
}

export function getNextjsAcademyTopics(): NextjsTopicDef[] {
  return flattenNextjsTopics();
}

export function getNextjsAcademyTopic(slug: string): NextjsTopicDef | null {
  return flattenNextjsTopics().find((t) => t.slug === slug) ?? null;
}

export function getNextjsAcademyTopicLimit(topicSlug: string): number {
  return nextjsAcademyTopicChallengeCount(topicSlug);
}

export function mergeNextjsAcademyLessons(
  lessons: LessonSummary[],
  completedIds: Set<string>
): LessonSummary[] {
  const bySlug = new Map(lessons.map((l) => [l.slug, l]));
  const merged: LessonSummary[] = [];
  let order = 1;
  for (const topic of flattenNextjsTopics()) {
    const existing = bySlug.get(topic.slug);
    if (existing) {
      merged.push(existing);
    } else {
      merged.push({
        id: `nextjs-${topic.slug}`,
        title: topic.title,
        slug: topic.slug,
        description: topic.summary,
        durationMinutes: topic.estimatedMinutes,
        difficulty: topic.difficulty,
        sortOrder: order,
        isPreview: order === 1,
        isCompleted: completedIds.has(`nextjs-${topic.slug}`),
      });
    }
    order += 1;
  }
  return merged;
}

export function nextjsAcademyChallengeCounts(): {
  easy: number;
  medium: number;
  hard: number;
  total: number;
} {
  const all = allNextjsAcademyChallenges();
  const easy = all.filter((c) => c.difficulty === "easy").length;
  const medium = all.filter((c) => c.difficulty === "medium").length;
  const hard = all.filter((c) => c.difficulty === "hard").length;
  return { easy, medium, hard, total: all.length };
}
