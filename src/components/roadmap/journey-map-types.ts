/**
 * Generic node for the vertical adventure / timeline map.
 * Used by Java week roadmap and SupraLearn curriculum phases.
 */
export interface JourneyMapNode {
  id: number;
  title: string;
  href: string;
  description?: string;
}

export interface RoadmapJourneyMapProps {
  nodes: JourneyMapNode[];
  currentNodeId: number;
  isLocked: (nodeId: number) => boolean;
  isCompleted: (nodeId: number) => boolean;
  getNodeProgress: (nodeId: number) => { overall: { percentage: number } };
  completedCount: number;
  overallPct: number;
  /** Eyebrow label above the map */
  mapLabel?: string;
  /** Progress chip label prefix (e.g. "Phase" or "Level") */
  nodeLabel?: string;
  /** Trophy caption at the end of the path */
  finaleTitle?: string;
  finaleSubtitle?: string;
  /** Hide legacy skill-roadmap link */
  showSkillRoadmapLink?: boolean;
}
