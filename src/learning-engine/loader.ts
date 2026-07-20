import bundleJson from "./content/bundle.json";
import curriculumJson from "./curriculum.json";
import type { LearnLesson, LearnTopicBundle, LearnWeekBundle, LearnWeekDefinition } from "./types";

export const LEARNING_CURRICULUM = curriculumJson as LearnWeekDefinition[];

export const LEARNING_BUNDLE = bundleJson as {
  version: number;
  weeks: LearnWeekBundle[];
  stats: Record<string, unknown>;
};

const weekMap = new Map(LEARNING_BUNDLE.weeks.map((w) => [w.weekId, w]));
const weekSlugMap = new Map(LEARNING_BUNDLE.weeks.map((w) => [w.slug, w]));

export function getLearningWeek(weekId: number): LearnWeekBundle | null {
  return weekMap.get(weekId) ?? null;
}

export function getLearningWeekBySlug(slug: string): LearnWeekBundle | null {
  return weekSlugMap.get(slug) ?? null;
}

export function getLearningTopic(weekId: number, topicSlug: string): LearnTopicBundle | null {
  const week = getLearningWeek(weekId);
  return week?.topics.find((t) => t.topic.slug === topicSlug) ?? null;
}

export function getLearningLesson(weekId: number, topicSlug: string, lessonId: string): LearnLesson | null {
  const topic = getLearningTopic(weekId, topicSlug);
  return topic?.lessons.find((l) => l.id === lessonId) ?? null;
}

export function getAllLearningLessonIds(): string[] {
  const ids: string[] = [];
  for (const week of LEARNING_BUNDLE.weeks) {
    for (const topic of week.topics) {
      for (const lesson of topic.lessons) {
        ids.push(`learn-w${week.weekId}-${topic.topic.slug}-${lesson.id}`);
      }
    }
  }
  return ids;
}

export function getWeekLearningLessonIds(weekId: number): string[] {
  const week = getLearningWeek(weekId);
  if (!week) return [];
  return week.topics.flatMap((t) =>
    t.lessons.map((l) => `learn-w${weekId}-${t.topic.slug}-${l.id}`)
  );
}

export { lessonEntityId } from "./types";
