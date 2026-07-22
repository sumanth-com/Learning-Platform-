import type { LessonSummary } from "@/features/curriculum/types";
import {
  allJsAcademyChallenges,
  jsAcademyTopicChallengeCount,
} from "@/features/curriculum/lib/js-academy-challenges";
import {
  JS_ACADEMY_SECTIONS,
  flattenJsTopics,
  type JsTopicDef,
} from "@/features/curriculum/lib/js-academy-curriculum";

export const JS_ACADEMY_SLUG = "javascript";

export function isJsAcademyModule(moduleSlug: string) {
  return moduleSlug === JS_ACADEMY_SLUG;
}

export function getJsAcademySections() {
  return JS_ACADEMY_SECTIONS;
}

export function getJsAcademyTopics(): JsTopicDef[] {
  return flattenJsTopics();
}

export function getJsAcademyTopic(slug: string): JsTopicDef | null {
  return flattenJsTopics().find((t) => t.slug === slug) ?? null;
}

export function getJsAcademyTopicLimit(topicSlug: string): number {
  return jsAcademyTopicChallengeCount(topicSlug);
}

export function mergeJsAcademyLessons(
  lessons: LessonSummary[],
  completedIds: Set<string>
): LessonSummary[] {
  const bySlug = new Map(lessons.map((l) => [l.slug, l]));
  const merged: LessonSummary[] = [];
  let order = 1;
  for (const topic of flattenJsTopics()) {
    const existing = bySlug.get(topic.slug);
    if (existing) {
      merged.push(existing);
    } else {
      merged.push({
        id: `js-${topic.slug}`,
        title: topic.title,
        slug: topic.slug,
        description: topic.summary,
        durationMinutes: topic.estimatedMinutes,
        difficulty: topic.difficulty,
        sortOrder: order,
        isPreview: order === 1,
        isCompleted: completedIds.has(`js-${topic.slug}`),
      });
    }
    order += 1;
  }
  return merged;
}

export function jsAcademyChallengeCounts(): {
  easy: number;
  medium: number;
  hard: number;
  total: number;
} {
  const all = allJsAcademyChallenges();
  const easy = all.filter((c) => c.difficulty === "easy").length;
  const medium = all.filter((c) => c.difficulty === "medium").length;
  const hard = all.filter((c) => c.difficulty === "hard").length;
  return { easy, medium, hard, total: all.length };
}
