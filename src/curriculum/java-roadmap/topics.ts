import type { JavaRoadmapTopic } from "./types";
import { WEEK_ROADMAP_CURRICULUM } from "./curriculum";

export const JAVA_ROADMAP_TOPICS: JavaRoadmapTopic[] = WEEK_ROADMAP_CURRICULUM.map((week) => ({
  slug: week.slug,
  title: `Week ${week.weekId}: ${week.title}`,
  kind: "milestone" as const,
  description: week.description,
  learn: week.description,
  relatedWeekIds: [week.weekId],
}));

export const TOPIC_MAP = new Map(JAVA_ROADMAP_TOPICS.map((t) => [t.slug, t]));

export const ROADMAP_SLUG_REDIRECTS: Record<string, string> = {
  "java-fundamentals": "week-1",
  "control-flow": "week-2",
  methods: "week-2",
  arrays: "week-2",
  oop: "week-3",
  strings: "week-4",
  "exception-handling": "week-4",
  "collections-framework": "week-4",
  generics: "week-5",
  "java-8-features": "week-5",
  "file-handling": "week-6",
  multithreading: "week-6",
  dsa: "week-7",
  jdbc: "week-9",
  "spring-ecosystem": "week-10",
  loops: "week-2",
  conditionals: "week-2",
};
