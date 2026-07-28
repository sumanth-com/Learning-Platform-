import type { HubResource, HubSection } from "../types";

/**
 * Assembles the reader journey from authored resource content only.
 * No generic filler sections — every item must be relevant to this guide.
 */
export function buildLearningJourney(resource: HubResource): HubSection[] {
  const objectives = resource.objectives?.filter(Boolean) ?? [];
  const prerequisites = resource.prerequisites?.filter(Boolean) ?? [];
  const takeaways = resource.takeaways?.filter(Boolean) ?? [];

  const authored = resource.sections.map((section) => ({
    ...section,
    kind: section.kind ?? ("content" as const),
  }));

  const journey: HubSection[] = [
    {
      id: "overview",
      kind: "overview",
      title: "Overview",
      body:
        resource.overviewBody?.trim() ||
        `${resource.description}\n\nThis guide stays on ${resource.title} only — decisions, trade-offs, and patterns you can use in design reviews and production work.`,
    },
  ];

  if (objectives.length > 0) {
    journey.push({
      id: "objectives",
      kind: "objectives",
      title: "What you will be able to do",
      body: "After this guide, you should be able to:",
      bullets: objectives,
    });
  }

  if (prerequisites.length > 0) {
    journey.push({
      id: "prerequisites",
      kind: "prerequisites",
      title: "Prerequisites",
      body: "Skip or skim only if these are already solid:",
      bullets: prerequisites,
    });
  }

  journey.push(...authored);

  if (takeaways.length > 0) {
    journey.push({
      id: "takeaways",
      kind: "takeaways",
      title: "Takeaways",
      body: "Keep these next to your next design doc or PR:",
      bullets: takeaways,
    });
  }

  if (resource.nextSlug) {
    journey.push({
      id: "next-topic",
      kind: "next",
      title: "Next",
      body: "When this guide clicks, continue with the related guide linked at the bottom — same track, deeper skill.",
    });
  }

  return journey;
}
