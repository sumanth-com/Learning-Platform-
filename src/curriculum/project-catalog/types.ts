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
  weekId: number;
  difficulty: ProjectDifficulty;
  category: ProjectCategory;
  startedCount: number;
  href: string;
}

export const PORTFOLIO_WEEK_ID = 12;

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  features: { id: string; title: string }[];
}
