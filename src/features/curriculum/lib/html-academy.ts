import type { LessonSummary } from "@/features/curriculum/types";
import {
  allHtmlAcademyChallenges,
  htmlAcademyTopicChallengeCount,
} from "@/features/curriculum/lib/html-academy-challenges";
import {
  HTML_ACADEMY_SECTIONS,
  flattenHtmlTopics,
  type HtmlTopicDef,
} from "@/features/curriculum/lib/html-academy-curriculum";

export const HTML_ACADEMY_SLUG = "html";

export function isHtmlAcademyModule(moduleSlug: string) {
  return moduleSlug === HTML_ACADEMY_SLUG;
}

export function getHtmlAcademySections() {
  return HTML_ACADEMY_SECTIONS;
}

export function getHtmlAcademyTopics(): HtmlTopicDef[] {
  return flattenHtmlTopics();
}

export function getHtmlAcademyTopic(slug: string): HtmlTopicDef | null {
  return flattenHtmlTopics().find((t) => t.slug === slug) ?? null;
}

export function getHtmlAcademyTopicLimit(topicSlug: string): number {
  return htmlAcademyTopicChallengeCount(topicSlug);
}

export function mergeHtmlAcademyLessons(
  lessons: LessonSummary[],
  completedIds: Set<string>
): LessonSummary[] {
  const bySlug = new Map(lessons.map((l) => [l.slug, l]));
  const merged: LessonSummary[] = [];
  let order = 1;
  for (const topic of flattenHtmlTopics()) {
    const existing = bySlug.get(topic.slug);
    if (existing) {
      merged.push(existing);
    } else {
      merged.push({
        id: `html-${topic.slug}`,
        title: topic.title,
        slug: topic.slug,
        description: topic.summary,
        durationMinutes: topic.estimatedMinutes,
        difficulty: topic.difficulty,
        sortOrder: order,
        isPreview: order === 1,
        isCompleted: completedIds.has(`html-${topic.slug}`),
      });
    }
    order += 1;
  }
  return merged;
}

export function htmlAcademyChallengeCounts(): {
  easy: number;
  medium: number;
  hard: number;
  total: number;
} {
  const all = allHtmlAcademyChallenges();
  const easy = all.filter((c) => c.difficulty === "easy").length;
  const medium = all.filter((c) => c.difficulty === "medium").length;
  const hard = all.filter((c) => c.difficulty === "hard").length;
  return { easy, medium, hard, total: all.length };
}
