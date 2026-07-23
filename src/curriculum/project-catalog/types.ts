export type ProjectDifficulty = "easy" | "medium" | "hard";
export type ProjectCategory =
  | "CLI"
  | "API"
  | "Web App"
  | "Docker Compose"
  | "Linux";

export interface ProjectMeta {
  difficulty: ProjectDifficulty;
  category: ProjectCategory;
  startedCount: number;
}

export interface ProjectListingItem {
  id: string;
  title: string;
  description: string;
  /** Module number (1–20). */
  weekId: number;
  moduleNumber: number;
  moduleSlug: string;
  moduleTitle: string;
  difficulty: ProjectDifficulty;
  category: ProjectCategory;
  startedCount: number;
  href: string;
}

/** @deprecated Portfolio catalog retired in favor of roadmap modules. */
export const PORTFOLIO_WEEK_ID = 12;

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  features: { id: string; title: string }[];
}
