/**
 * Canonical student roadmap modules — order matches the published course journey.
 * Keep in sync with seeded CMS modules (curriculum engine v2).
 */
export type RoadmapModuleMeta = {
  index: number;
  slug: string;
  title: string;
};

export const ROADMAP_MODULES: RoadmapModuleMeta[] = [
  { index: 1, slug: "programming-fundamentals", title: "Programming Fundamentals" },
  { index: 2, slug: "developer-tooling", title: "Developer Tooling" },
  { index: 3, slug: "html", title: "HTML" },
  { index: 4, slug: "css", title: "CSS" },
  { index: 5, slug: "javascript", title: "JavaScript" },
  { index: 6, slug: "react", title: "React" },
  { index: 7, slug: "nextjs", title: "Next.js" },
  { index: 8, slug: "typescript", title: "TypeScript" },
  { index: 9, slug: "apis-and-services", title: "APIs & Services" },
  { index: 10, slug: "auth-and-security", title: "Auth & Security" },
  { index: 11, slug: "relational-databases", title: "Relational Databases" },
  { index: 12, slug: "data-modeling", title: "Data Modeling" },
  { index: 13, slug: "deployment-essentials", title: "Deployment Essentials" },
  { index: 14, slug: "ci-cd-fundamentals", title: "CI/CD Fundamentals" },
  { index: 15, slug: "llm-fundamentals", title: "LLM Fundamentals" },
  { index: 16, slug: "building-ai-features", title: "Building AI Features" },
  { index: 17, slug: "capstone-planning", title: "Capstone Planning" },
  { index: 18, slug: "ship-the-product", title: "Ship the Product" },
  { index: 19, slug: "technical-interviews", title: "Technical Interviews" },
  { index: 20, slug: "system-design-behavioral", title: "System Design & Behavioral" },
];

export const ROADMAP_MODULE_COUNT = ROADMAP_MODULES.length;

export function getRoadmapModuleByIndex(
  index: number
): RoadmapModuleMeta | undefined {
  return ROADMAP_MODULES.find((m) => m.index === index);
}

export function roadmapModuleLabel(index: number): string {
  const mod = getRoadmapModuleByIndex(index);
  if (!mod) return `Module ${index}`;
  return `Module ${mod.index} · ${mod.title}`;
}
