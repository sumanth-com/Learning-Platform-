import type { ProjectStatus } from "@/types";
import type { ModuleWeekGates, ResumePosition } from "@/lib/module-progress";
import { createDefaultModuleGates } from "@/lib/module-progress";
import type { AssignmentSubmissionStatus } from "@/curriculum/assignment-catalog/types";

export interface ProjectProgressMeta {
  progress: number;
  status: ProjectStatus;
  githubLink: string;
  notes: string;
}

export interface AssignmentProgressMeta {
  status: AssignmentSubmissionStatus;
  githubUrl: string;
  liveUrl: string;
  screenshots: string;
  notes: string;
  reflection: string;
  submittedAt?: string;
  reviewedAt?: string;
  feedback?: string;
  marks?: number;
}

export interface UserProgressState {
  version: number;
  /** Universal completion map — key is entity ID from curriculum */
  completed: Record<string, boolean>;
  notes: Record<string, string>;
  bookmarks: Record<string, boolean>;
  completionDates: Record<string, string>;
  projectMeta: Record<string, ProjectProgressMeta>;
  assignmentMeta: Record<string, AssignmentProgressMeta>;
  /** One-time seed flag for demo A1–A4 completion */
  assignmentJourneySeeded?: boolean;
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

export const PROGRESS_VERSION = 20;

export const defaultProgressState: UserProgressState = {
  version: PROGRESS_VERSION,
  completed: {},
  notes: {},
  bookmarks: {},
  completionDates: {},
  projectMeta: {},
  assignmentMeta: {},
  assignmentJourneySeeded: false,
  githubRepoLinks: {},
  weekNotes: {},
  moduleGates: createDefaultModuleGates(),
  scrollPositions: {},
  unlockedWeekIds: [1],
  completedWeekIds: [],
};

export type { ResumePosition };

