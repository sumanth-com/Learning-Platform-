import lessonsJson from "./bundled-lessons.json";
import type { RoadmapTopicLessons } from "../lesson-types";

export type { RoadmapSubtopicLesson, RoadmapTopicLessons, RoadmapLessonKind } from "../lesson-types";

const LESSONS = lessonsJson as unknown as Record<string, RoadmapTopicLessons>;

export function getTopicLessons(slug: string): RoadmapTopicLessons | null {
  const raw = LESSONS[slug];
  if (!raw) return null;
  return { ...raw, slug: raw.slug ?? slug };
}

export { getTopicLessons as getRoadmapTopicLessons };

export function getSubtopicLesson(slug: string, subtopicId: string) {
  const topic = LESSONS[slug];
  return topic?.subtopics.find((s) => s.id === subtopicId) ?? null;
}
