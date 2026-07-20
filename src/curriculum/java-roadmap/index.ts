export type { JavaRoadmapTopic, JavaRoadmapSection, JavaRoadmapGroup, RoadmapNodeKind } from "./types";
export type { WeekCurriculumSection, CurriculumSubtopic, CurriculumSection } from "./curriculum";
export {
  WEEK_ROADMAP_CURRICULUM,
  WEEK_CURRICULUM_MAP,
  getWeekBySlug,
  getWeekById,
  getAllWeekSlugs,
  JAVA_ROADMAP_CURRICULUM,
  CURRICULUM_MAP,
  getSectionBySlug,
  getAllSectionSlugs,
} from "./curriculum";
export { JAVA_ROADMAP_TOPICS, TOPIC_MAP, ROADMAP_SLUG_REDIRECTS } from "./topics";

import { TOPIC_MAP, ROADMAP_SLUG_REDIRECTS } from "./topics";
import { getWeekBySlug } from "./curriculum";
export { getTopicLessons } from "./lessons";

export function getTopicBySlug(slug: string) {
  const resolved = ROADMAP_SLUG_REDIRECTS[slug] ?? slug;
  return TOPIC_MAP.get(resolved) ?? null;
}

export function getAllTopicSlugs() {
  return [...TOPIC_MAP.keys()];
}

export function getSectionForTopic(slug: string) {
  const resolved = ROADMAP_SLUG_REDIRECTS[slug] ?? slug;
  return getWeekBySlug(resolved);
}

export function getRelatedTopics(slug: string, limit = 6) {
  const topic = getTopicBySlug(slug);
  if (!topic) return [];
  return [...TOPIC_MAP.values()].filter((t) => t.slug !== topic.slug).slice(0, limit);
}
