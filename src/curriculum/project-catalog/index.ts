import { getCurriculumWeeks } from "@/curriculum/registry";
import portfolioProjects from "./portfolio-projects.json";
import portfolioMeta from "./portfolio-meta.json";
import type {
  ProjectCategory,
  ProjectDifficulty,
  ProjectListingItem,
  ProjectMeta,
  PortfolioProject,
} from "./types";
import { PORTFOLIO_WEEK_ID } from "./types";
import type { CurriculumProject } from "@/curriculum/types";

export { PORTFOLIO_WEEK_ID } from "./types";
export type { ProjectListingItem, ProjectDifficulty, ProjectCategory } from "./types";

const PORTFOLIO = portfolioProjects as PortfolioProject[];
const PORTFOLIO_META = portfolioMeta as Record<string, ProjectMeta>;

function hashCount(id: string, base: number): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return base + (Math.abs(h) % 8000);
}

function inferCurriculumMeta(weekId: number, projectId: string): ProjectMeta {
  let difficulty: ProjectDifficulty = "easy";
  if (weekId >= 8) difficulty = "hard";
  else if (weekId >= 4) difficulty = "medium";

  let category: ProjectCategory = "CLI";
  if (weekId >= 10) category = "API";
  else if (weekId >= 8) category = "API";
  else if (weekId === 7) category = "CLI";

  return {
    difficulty,
    category,
    startedCount: hashCount(projectId, weekId * 1200),
  };
}

function toListing(
  project: { id: string; title: string; description: string },
  weekId: number,
  meta: ProjectMeta
): ProjectListingItem {
  return {
    id: project.id,
    title: project.title,
    description: project.description,
    weekId,
    difficulty: meta.difficulty,
    category: meta.category,
    startedCount: meta.startedCount,
    href: `/projects/${weekId}/${project.id}`,
  };
}

export function getAllProjectListings(): ProjectListingItem[] {
  const items: ProjectListingItem[] = [];

  for (const week of getCurriculumWeeks()) {
    for (const project of week.projects) {
      items.push(toListing(project, week.id, inferCurriculumMeta(week.id, project.id)));
    }
  }

  for (const project of PORTFOLIO) {
    const meta = PORTFOLIO_META[project.id] ?? {
      difficulty: "medium" as const,
      category: "CLI" as const,
      startedCount: hashCount(project.id, 5000),
    };
    items.push(toListing(project, PORTFOLIO_WEEK_ID, meta));
  }

  return items;
}

export function isPortfolioWeek(weekId: number) {
  return weekId === PORTFOLIO_WEEK_ID;
}

export function getPortfolioProject(projectId: string): PortfolioProject | null {
  return PORTFOLIO.find((p) => p.id === projectId) ?? null;
}

export function resolveProject(
  weekId: number,
  projectId: string
): { project: CurriculumProject; weekId: number } | null {
  if (isPortfolioWeek(weekId)) {
    const p = getPortfolioProject(projectId);
    if (!p) return null;
    return { project: p, weekId };
  }

  const week = getCurriculumWeeks().find((w) => w.id === weekId);
  const project = week?.projects.find((p) => p.id === projectId);
  if (!week || !project) return null;
  return { project, weekId };
}

export function findProjectListing(projectId: string): ProjectListingItem | null {
  return getAllProjectListings().find((p) => p.id === projectId) ?? null;
}

export function getProjectMeta(projectId: string, weekId: number): ProjectMeta {
  if (isPortfolioWeek(weekId) && PORTFOLIO_META[projectId]) {
    return PORTFOLIO_META[projectId];
  }
  return inferCurriculumMeta(weekId, projectId);
}
