export type RoadmapNodeKind = "milestone" | "topic";

export interface JavaRoadmapTopic {
  slug: string;
  title: string;
  kind: RoadmapNodeKind;
  description: string;
  learn: string;
  relatedWeekIds?: number[];
}

export interface JavaRoadmapGroup {
  id: string;
  title?: string;
  topicSlugs: string[];
  columns?: 1 | 2 | 3 | 4;
}

export interface JavaRoadmapSection {
  id: string;
  title: string;
  milestoneSlug?: string;
  groups: JavaRoadmapGroup[];
}
