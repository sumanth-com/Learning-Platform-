import type {
  ProjectListingItem,
  ProjectMeta,
} from "./types";
import {
  ROADMAP_MODULE_PROJECTS,
  getRoadmapModuleMeta,
  listRoadmapModuleOptions,
  type ModuleProjectDef,
} from "./module-projects";
import type { CurriculumProject } from "@/curriculum/types";

export { PORTFOLIO_WEEK_ID } from "./types";
export type { ProjectListingItem, ProjectDifficulty, ProjectCategory } from "./types";
export { listRoadmapModuleOptions, getRoadmapModuleMeta, ROADMAP_MODULE_PROJECTS };

/** Public URL slug from internal id (`m01-console-calculator` → `console-calculator`). */
export function projectPublicSlug(projectId: string): string {
  return projectId.replace(/^m\d+-/i, "");
}

/** Canonical professional project URL. */
export function projectHref(moduleSlug: string, projectId: string): string {
  return `/projects/${moduleSlug}/${projectPublicSlug(projectId)}`;
}

function hashCount(id: string, base: number): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return base + (Math.abs(h) % 8000);
}

function toListing(
  project: ModuleProjectDef,
  moduleNumber: number,
  moduleSlug: string,
  moduleTitle: string
): ProjectListingItem {
  return {
    id: project.id,
    title: project.title,
    description: project.description,
    weekId: moduleNumber,
    moduleNumber,
    moduleSlug,
    moduleTitle,
    difficulty: project.difficulty,
    category: project.category,
    startedCount: hashCount(project.id, moduleNumber * 1200),
    href: projectHref(moduleSlug, project.id),
  };
}

export function getAllProjectListings(): ProjectListingItem[] {
  const items: ProjectListingItem[] = [];
  for (const mod of ROADMAP_MODULE_PROJECTS) {
    for (const project of mod.projects) {
      items.push(
        toListing(project, mod.moduleNumber, mod.slug, mod.title)
      );
    }
  }
  return items;
}

export function isPortfolioWeek(_weekId: number) {
  return false;
}

export function getPortfolioProject(_projectId: string) {
  return null;
}

function findModuleByKey(moduleKey: string) {
  const asNumber = Number(moduleKey);
  if (Number.isFinite(asNumber) && asNumber > 0) {
    return (
      ROADMAP_MODULE_PROJECTS.find((m) => m.moduleNumber === asNumber) ?? null
    );
  }
  return (
    ROADMAP_MODULE_PROJECTS.find((m) => m.slug === moduleKey) ?? null
  );
}

function findProjectInModule(
  mod: (typeof ROADMAP_MODULE_PROJECTS)[number],
  projectKey: string
) {
  return (
    mod.projects.find(
      (p) =>
        p.id === projectKey || projectPublicSlug(p.id) === projectKey
    ) ?? null
  );
}

export function resolveProject(
  weekId: number,
  projectId: string
): { project: CurriculumProject; weekId: number } | null {
  const mod = getRoadmapModuleMeta(weekId);
  const project = mod?.projects.find(
    (p) => p.id === projectId || projectPublicSlug(p.id) === projectId
  );
  if (!mod || !project) return null;
  return {
    project: {
      id: project.id,
      title: project.title,
      description: project.description,
      features: project.features,
    },
    weekId,
  };
}

/** Resolve `/projects/[module]/[project]` for slug or legacy numeric paths. */
export function resolveProjectRoute(
  moduleKey: string,
  projectKey: string
): {
  project: CurriculumProject;
  listing: ProjectListingItem;
  href: string;
} | null {
  const mod = findModuleByKey(moduleKey);
  if (!mod) return null;
  const def = findProjectInModule(mod, projectKey);
  if (!def) return null;
  const listing = toListing(def, mod.moduleNumber, mod.slug, mod.title);
  return {
    project: {
      id: def.id,
      title: def.title,
      description: def.description,
      features: def.features,
    },
    listing,
    href: listing.href,
  };
}

export function findProjectListing(projectId: string): ProjectListingItem | null {
  return (
    getAllProjectListings().find(
      (p) =>
        p.id === projectId || projectPublicSlug(p.id) === projectId
    ) ?? null
  );
}

export function getProjectMeta(projectId: string, weekId: number): ProjectMeta {
  const listing = getAllProjectListings().find(
    (p) =>
      p.moduleNumber === weekId &&
      (p.id === projectId || projectPublicSlug(p.id) === projectId)
  );
  if (listing) {
    return {
      difficulty: listing.difficulty,
      category: listing.category,
      startedCount: listing.startedCount,
    };
  }
  return {
    difficulty: "medium",
    category: "CLI",
    startedCount: hashCount(projectId, weekId * 1200),
  };
}

export function getModuleProjectDef(
  moduleNumber: number,
  projectId: string
): ModuleProjectDef | null {
  return (
    getRoadmapModuleMeta(moduleNumber)?.projects.find(
      (p) => p.id === projectId || projectPublicSlug(p.id) === projectId
    ) ?? null
  );
}
