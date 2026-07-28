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
  | "nextjs-preview"
  | "typescript-console"
  | "api-playground"
  | "auth-lab"
  | "sql-editor"
  | "modeling-lab"
  | "deploy-lab"
  | "cicd-lab"
  | "llm-lab"
  | "ai-lab"
  | "capstone-lab"
  | "ship-lab"
  | "interview-lab"
  | "systems-lab"
  | "code-workspace";

const MODULE_EXPERIENCE: Record<string, ChallengeExperienceKind> = {
  "programming-fundamentals": "thinking",
  "developer-tooling": "tooling",
  html: "html-live",
  css: "css-live",
  javascript: "javascript-console",
  react: "react-preview",
  nextjs: "nextjs-preview",
  typescript: "typescript-console",
  "apis-and-services": "api-playground",
  "auth-and-security": "auth-lab",
  "relational-databases": "sql-editor",
  "data-modeling": "modeling-lab",
  "deployment-essentials": "deploy-lab",
  "ci-cd-fundamentals": "cicd-lab",
  "llm-fundamentals": "llm-lab",
  "building-ai-features": "ai-lab",
  "capstone-planning": "capstone-lab",
  "ship-the-product": "ship-lab",
  "technical-interviews": "interview-lab",
  "system-design-behavioral": "systems-lab",
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
    case "nextjs-preview":
      return "Next.js Preview";
    case "typescript-console":
      return "TypeScript Console";
    case "api-playground":
      return "API Playground";
    case "auth-lab":
      return "Auth Lab";
    case "sql-editor":
      return "SQL Editor";
    case "modeling-lab":
      return "Data Modeling Lab";
    case "deploy-lab":
      return "Deploy Lab";
    case "cicd-lab":
      return "CI/CD Lab";
    case "llm-lab":
      return "LLM Lab";
    case "ai-lab":
      return "AI Features Lab";
    case "capstone-lab":
      return "Capstone Lab";
    case "ship-lab":
      return "Ship Lab";
    case "interview-lab":
      return "Interview Prep";
    case "systems-lab":
      return "System Design Prep";
    case "code-workspace":
      return "Code Workspace";
  }
}
