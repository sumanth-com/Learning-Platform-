import type { ProjectStatus } from "@/types";
import type { ModuleWeekGates, ResumePosition } from "@/lib/module-progress";
import { createDefaultModuleGates } from "@/lib/module-progress";

export interface ProjectProgressMeta {
  progress: number;
  status: ProjectStatus;
  githubLink: string;
  notes: string;
}

export interface UserProgressState {
  version: number;
  /** Universal completion map — key is entity ID from curriculum */
  completed: Record<string, boolean>;
  notes: Record<string, string>;
  bookmarks: Record<string, boolean>;
  completionDates: Record<string, string>;
  projectMeta: Record<string, ProjectProgressMeta>;
  githubRepoLinks: Record<string, string>;
  weekNotes: Record<number, string>;
  /** Per-module week unlock/completion (v3+) */
  moduleGates: ModuleWeekGates;
  /** Saved scroll offsets keyed by page id (e.g. challenge problem pane) */
  scrollPositions: Record<string, number>;
  /** @deprecated legacy global gates — kept for migration only */
  unlockedWeekIds: number[];
  /** @deprecated legacy global gates — kept for migration only */
  completedWeekIds: number[];
}

export const PROGRESS_VERSION = 19;

export const defaultProgressState: UserProgressState = {
  version: PROGRESS_VERSION,
  completed: {},
  notes: {},
  bookmarks: {},
  completionDates: {},
  projectMeta: {},
  githubRepoLinks: {},
  weekNotes: {},
  moduleGates: createDefaultModuleGates(),
  scrollPositions: {},
  unlockedWeekIds: [1],
  completedWeekIds: [],
};

export type { ResumePosition };

