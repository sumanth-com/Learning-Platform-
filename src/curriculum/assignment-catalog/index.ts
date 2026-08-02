import type {
  AssignmentCardStatus,
  AssignmentListingItem,
  AssignmentSubmissionStatus,
  ModuleAssignmentDef,
} from "./types";
import {
  ROADMAP_MODULE_ASSIGNMENTS,
  getAssignmentModuleMeta,
  listAssignmentModuleOptions,
} from "./module-assignments";

export type {
  AssignmentDifficulty,
  AssignmentType,
  AssignmentCardStatus,
  AssignmentSubmissionStatus,
  AssignmentStarterFile,
  AssignmentTeachContent,
  ModuleAssignmentDef,
  RoadmapModuleAssignments,
  AssignmentListingItem,
} from "./types";

export {
  ROADMAP_MODULE_ASSIGNMENTS,
  getAssignmentModuleMeta,
  listAssignmentModuleOptions,
};

export function assignmentPublicSlug(assignmentId: string): string {
  return assignmentId.replace(/^a\d+-/i, "");
}

export function assignmentHref(moduleSlug: string, assignmentId: string): string {
  return `/assignments/${moduleSlug}/${assignmentPublicSlug(assignmentId)}`;
}

function toListing(
  assignment: ModuleAssignmentDef,
  moduleNumber: number,
  moduleSlug: string,
  moduleTitle: string,
  displayModuleTitle: string
): AssignmentListingItem {
  return {
    ...assignment,
    moduleNumber,
    moduleSlug,
    moduleTitle,
    displayModuleTitle,
    href: assignmentHref(moduleSlug, assignment.id),
  };
}

export function getAllAssignmentListings(): AssignmentListingItem[] {
  const items: AssignmentListingItem[] = [];
  for (const mod of ROADMAP_MODULE_ASSIGNMENTS) {
    for (const assignment of mod.assignments) {
      items.push(
        toListing(
          assignment,
          mod.moduleNumber,
          mod.slug,
          mod.title,
          mod.displayTitle
        )
      );
    }
  }
  return items;
}

export function findAssignmentListing(
  assignmentIdOrSlug: string
): AssignmentListingItem | null {
  return (
    getAllAssignmentListings().find(
      (a) =>
        a.id === assignmentIdOrSlug ||
        a.slug === assignmentIdOrSlug ||
        assignmentPublicSlug(a.id) === assignmentIdOrSlug
    ) ?? null
  );
}

function findModuleByKey(moduleKey: string) {
  const asNumber = Number(moduleKey);
  if (Number.isFinite(asNumber) && asNumber > 0) {
    return getAssignmentModuleMeta(asNumber);
  }
  return (
    ROADMAP_MODULE_ASSIGNMENTS.find((m) => m.slug === moduleKey) ?? null
  );
}

function findAssignmentInModule(
  mod: (typeof ROADMAP_MODULE_ASSIGNMENTS)[number],
  key: string
) {
  return (
    mod.assignments.find(
      (a) =>
        a.id === key ||
        a.slug === key ||
        assignmentPublicSlug(a.id) === key
    ) ?? null
  );
}

export function resolveAssignmentRoute(
  moduleKey: string,
  assignmentKey: string
): {
  assignment: ModuleAssignmentDef;
  listing: AssignmentListingItem;
  href: string;
} | null {
  const mod = findModuleByKey(moduleKey);
  if (!mod) return null;
  const def = findAssignmentInModule(mod, assignmentKey);
  if (!def) return null;
  const listing = toListing(
    def,
    mod.moduleNumber,
    mod.slug,
    mod.title,
    mod.displayTitle
  );
  return { assignment: def, listing, href: listing.href };
}

export function isModuleUnlocked(
  _moduleNumber: number,
  _isAssignmentComplete: (assignmentId: string) => boolean
): boolean {
  // All assignments are open — journey progress is tracked via Solved/submission only.
  return true;
}

export function deriveAssignmentCardStatus(input: {
  locked: boolean;
  completed: boolean;
  submissionStatus?: AssignmentSubmissionStatus | null;
}): AssignmentCardStatus {
  if (input.locked) return "locked";
  if (input.completed) return "completed";
  const s = input.submissionStatus ?? "not_started";
  if (s === "approved" || s === "completed") return "completed";
  if (s === "revision_requested") return "revision_requested";
  if (s === "reviewed") return "reviewed";
  if (s === "submitted" || s === "pending_review") return "submitted";
  if (s === "in_progress") return "in_progress";
  return "available";
}

export function computeAssignmentStats(
  listings: AssignmentListingItem[],
  isComplete: (id: string) => boolean,
  getXp?: (id: string) => number
) {
  const total = listings.length;
  const completed = listings.filter((a) => isComplete(a.id)).length;
  const remaining = total - completed;
  const xpEarned = listings
    .filter((a) => isComplete(a.id))
    .reduce((sum, a) => sum + (getXp?.(a.id) ?? a.xp), 0);
  const completionPct = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { total, completed, remaining, xpEarned, completionPct };
}
