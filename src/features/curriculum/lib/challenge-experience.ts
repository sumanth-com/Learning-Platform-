/**
 * Maps each curriculum module to a challenge learning experience.
 * Do not route every module through a generic coding workspace.
 */

export type ChallengeExperienceKind =
  | "thinking"
  | "tooling"
  | "html-live"
  | "css-live"
  | "javascript-console"
  | "react-preview"
  | "api-playground"
  | "sql-editor"
  | "code-workspace";

const MODULE_EXPERIENCE: Record<string, ChallengeExperienceKind> = {
  "programming-fundamentals": "thinking",
  "developer-tooling": "tooling",
  html: "html-live",
  css: "css-live",
  javascript: "javascript-console",
  react: "react-preview",
  nextjs: "react-preview",
  typescript: "javascript-console",
  "apis-and-services": "api-playground",
  "auth-and-security": "api-playground",
  "relational-databases": "sql-editor",
  "data-modeling": "sql-editor",
  "deployment-essentials": "tooling",
  "ci-cd-fundamentals": "tooling",
  "llm-fundamentals": "code-workspace",
  "building-ai-features": "code-workspace",
  "capstone-planning": "code-workspace",
  "ship-the-product": "code-workspace",
  "technical-interviews": "code-workspace",
  "system-design-behavioral": "thinking",
};

export function getModuleChallengeExperience(
  moduleSlug: string
): ChallengeExperienceKind {
  return MODULE_EXPERIENCE[moduleSlug] ?? "code-workspace";
}

export function experienceLabel(kind: ChallengeExperienceKind): string {
  switch (kind) {
    case "thinking":
      return "Thinking Challenge";
    case "tooling":
      return "Tooling Lab";
    case "html-live":
      return "HTML Live Preview";
    case "css-live":
      return "CSS Live Preview";
    case "javascript-console":
      return "JavaScript Console";
    case "react-preview":
      return "React Preview";
    case "api-playground":
      return "API Playground";
    case "sql-editor":
      return "SQL Editor";
    case "code-workspace":
      return "Code Workspace";
  }
}
