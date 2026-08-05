/** Slug-only guards — no challenge catalog imports. */
export const CHALLENGE_HUB_MODULE_SLUGS = new Set([
  "programming-fundamentals",
  "developer-tooling",
  "html",
  "css",
  "javascript",
  "react",
  "nextjs",
  "typescript",
  "apis-and-services",
  "auth-and-security",
  "relational-databases",
  "data-modeling",
  "deployment-essentials",
  "ci-cd-fundamentals",
  "llm-fundamentals",
  "building-ai-features",
  "capstone-planning",
  "ship-the-product",
  "technical-interviews",
  "system-design-behavioral",
]);

export const DRILL_STYLE_MODULE_SLUGS = new Set([
  "technical-interviews",
  "system-design-behavioral",
]);

export function isChallengeHubModule(moduleSlug: string): boolean {
  return CHALLENGE_HUB_MODULE_SLUGS.has(moduleSlug);
}

export function isDrillStyleModule(moduleSlug: string): boolean {
  return DRILL_STYLE_MODULE_SLUGS.has(moduleSlug);
}

export function isInterviewPrepKitModule(moduleSlug: string): boolean {
  return isDrillStyleModule(moduleSlug);
}
