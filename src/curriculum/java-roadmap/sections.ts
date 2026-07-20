import type { JavaRoadmapSection } from "./types";
import { JAVA_ROADMAP_CURRICULUM } from "./curriculum";

/** One card per curriculum section on the roadmap page */
export const JAVA_ROADMAP_SECTIONS: JavaRoadmapSection[] = JAVA_ROADMAP_CURRICULUM.map((section, index) => ({
  id: section.slug,
  title: section.title,
  milestoneSlug: section.slug,
  groups: [
    {
      id: `${section.slug}-main`,
      topicSlugs: [section.slug],
      columns: 1 as const,
    },
  ],
}));

export const ROADMAP_SECTION_NUMBERS = JAVA_ROADMAP_CURRICULUM.map((s, i) => ({
  number: i + 1,
  slug: s.slug,
  badge: s.badge,
}));
