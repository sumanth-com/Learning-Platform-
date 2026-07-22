import type { LessonSummary } from "@/features/curriculum/types";
import {
  allReactAcademyChallenges,
  reactAcademyTopicChallengeCount,
} from "@/features/curriculum/lib/react-academy-challenges";
import {
  REACT_ACADEMY_SECTIONS,
  flattenReactTopics,
  type ReactTopicDef,
} from "@/features/curriculum/lib/react-academy-curriculum";

export const REACT_ACADEMY_SLUG = "react";

export function isReactAcademyModule(moduleSlug: string) {
  return moduleSlug === REACT_ACADEMY_SLUG;
}

export function getReactAcademySections() {
  return REACT_ACADEMY_SECTIONS;
}

export function getReactAcademyTopics(): ReactTopicDef[] {
  return flattenReactTopics();
}

export function getReactAcademyTopic(slug: string): ReactTopicDef | null {
  return flattenReactTopics().find((t) => t.slug === slug) ?? null;
}

export function getReactAcademyTopicLimit(topicSlug: string): number {
  return reactAcademyTopicChallengeCount(topicSlug);
}

export function mergeReactAcademyLessons(
  lessons: LessonSummary[],
  completedIds: Set<string>
): LessonSummary[] {
  const bySlug = new Map(lessons.map((l) => [l.slug, l]));
  const merged: LessonSummary[] = [];
  let order = 1;
  for (const topic of flattenReactTopics()) {
    const existing = bySlug.get(topic.slug);
    if (existing) {
      merged.push(existing);
    } else {
      merged.push({
        id: `react-${topic.slug}`,
        title: topic.title,
        slug: topic.slug,
        description: topic.summary,
        durationMinutes: topic.estimatedMinutes,
        difficulty: topic.difficulty,
        sortOrder: order,
        isPreview: order === 1,
        isCompleted: completedIds.has(`react-${topic.slug}`),
      });
    }
    order += 1;
  }
  return merged;
}

export function reactAcademyChallengeCounts(): {
  easy: number;
  medium: number;
  hard: number;
  total: number;
} {
  const all = allReactAcademyChallenges();
  const easy = all.filter((c) => c.difficulty === "easy").length;
  const medium = all.filter((c) => c.difficulty === "medium").length;
  const hard = all.filter((c) => c.difficulty === "hard").length;
  return { easy, medium, hard, total: all.length };
}
