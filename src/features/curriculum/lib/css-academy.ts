import type { LessonSummary } from "@/features/curriculum/types";
import {
  allCssAcademyChallenges,
  cssAcademyTopicChallengeCount,
} from "@/features/curriculum/lib/css-academy-challenges";
import {
  CSS_ACADEMY_SECTIONS,
  flattenCssTopics,
  type CssTopicDef,
} from "@/features/curriculum/lib/css-academy-curriculum";

export const CSS_ACADEMY_SLUG = "css";

export function isCssAcademyModule(moduleSlug: string) {
  return moduleSlug === CSS_ACADEMY_SLUG;
}

export function getCssAcademySections() {
  return CSS_ACADEMY_SECTIONS;
}

export function getCssAcademyTopics(): CssTopicDef[] {
  return flattenCssTopics();
}

export function getCssAcademyTopic(slug: string): CssTopicDef | null {
  return flattenCssTopics().find((t) => t.slug === slug) ?? null;
}

export function getCssAcademyTopicLimit(topicSlug: string): number {
  return cssAcademyTopicChallengeCount(topicSlug);
}

export function mergeCssAcademyLessons(
  lessons: LessonSummary[],
  completedIds: Set<string>
): LessonSummary[] {
  const bySlug = new Map(lessons.map((l) => [l.slug, l]));
  const merged: LessonSummary[] = [];
  let order = 1;
  for (const topic of flattenCssTopics()) {
    const existing = bySlug.get(topic.slug);
    if (existing) {
      merged.push(existing);
    } else {
      merged.push({
        id: `css-${topic.slug}`,
        title: topic.title,
        slug: topic.slug,
        description: topic.summary,
        durationMinutes: topic.estimatedMinutes,
        difficulty: topic.difficulty,
        sortOrder: order,
        isPreview: order === 1,
        isCompleted: completedIds.has(`css-${topic.slug}`),
      });
    }
    order += 1;
  }
  return merged;
}

export function cssAcademyChallengeCounts(): {
  easy: number;
  medium: number;
  hard: number;
  total: number;
} {
  const all = allCssAcademyChallenges();
  const easy = all.filter((c) => c.difficulty === "easy").length;
  const medium = all.filter((c) => c.difficulty === "medium").length;
  const hard = all.filter((c) => c.difficulty === "hard").length;
  return { easy, medium, hard, total: all.length };
}
