import type {
  AssignmentLocalMetaRow,
  EntityNoteRow,
  EntityProgressRow,
  HubLibraryRow,
  LearnerBookmarkRow,
  LearnerNoteRow,
  LearnerNotificationRow,
  LearnerPreferencesRow,
  LearnerResumeRow,
  LearnerStatsRow,
  ModuleGateRow,
  ProjectProgressRow,
  StudySessionRow,
  WeekNoteRow,
} from "@/types/database";
import type { LearningModule, ModuleWeekGates } from "@/lib/module-progress";
import { createDefaultModuleGates, LEARNING_MODULES } from "@/lib/module-progress";
import type {
  AssignmentProgressMeta,
  ProjectProgressMeta,
  UserProgressState,
} from "@/store/progress-types";
import { defaultProgressState, PROGRESS_VERSION } from "@/store/progress-types";
import type { AppNote, StudySession, UserProfile } from "@/types";

export type LearnerWorkspace = {
  stats: LearnerStatsRow;
  preferences: LearnerPreferencesRow;
  progress: UserProgressState;
  profile: Pick<
    UserProfile,
    | "currentWeek"
    | "streak"
    | "totalStudyHours"
    | "lastActiveDate"
    | "resumeReadinessScore"
    | "githubProgress"
  > & { totalXp: number; level: number };
  notes: AppNote[];
  studySessions: StudySession[];
  resumePosition: LearnerResumeRow | null;
  notifications: LearnerNotificationRow[];
  hubLibrary: HubLibraryRow | null;
};

function gatesFromRows(rows: ModuleGateRow[]): ModuleWeekGates {
  const base = createDefaultModuleGates();
  for (const row of rows) {
    const module = row.module as LearningModule;
    if (!LEARNING_MODULES.includes(module)) continue;
    base[module] = {
      unlockedWeekIds: row.unlocked_week_ids?.length
        ? row.unlocked_week_ids
        : [1],
      completedWeekIds: row.completed_week_ids ?? [],
    };
  }
  return base;
}

export function mapWorkspaceToProgress(input: {
  entities: EntityProgressRow[];
  entityNotes: EntityNoteRow[];
  weekNotes: WeekNoteRow[];
  bookmarks: LearnerBookmarkRow[];
  projects: ProjectProgressRow[];
  assignments: AssignmentLocalMetaRow[];
  gates: ModuleGateRow[];
  preferences: LearnerPreferencesRow;
}): UserProgressState {
  const completed: Record<string, boolean> = {};
  const completionDates: Record<string, string> = {};
  for (const row of input.entities) {
    if (!row.completed) continue;
    completed[row.entity_id] = true;
    if (row.completed_at) {
      completionDates[row.entity_id] = row.completed_at.slice(0, 10);
    }
  }

  const notes: Record<string, string> = {};
  for (const row of input.entityNotes) {
    notes[row.entity_id] = row.note;
  }

  const weekNotes: Record<number, string> = {};
  for (const row of input.weekNotes) {
    weekNotes[row.week_id] = row.note;
  }

  const bookmarks: Record<string, boolean> = {};
  for (const row of input.bookmarks) {
    bookmarks[row.entity_id] = true;
  }

  const projectMeta: Record<string, ProjectProgressMeta> = {};
  for (const row of input.projects) {
    projectMeta[row.project_id] = {
      progress: row.progress,
      status: row.status as ProjectProgressMeta["status"],
      githubLink: row.github_link,
      notes: row.notes,
    };
  }

  const assignmentMeta: Record<string, AssignmentProgressMeta> = {};
  for (const row of input.assignments) {
    assignmentMeta[row.catalog_id] = {
      status: row.status as AssignmentProgressMeta["status"],
      githubUrl: row.github_url,
      liveUrl: row.live_url,
      screenshots: row.screenshots,
      notes: row.notes,
      reflection: row.reflection,
      submittedAt: row.submitted_at ?? undefined,
      reviewedAt: row.reviewed_at ?? undefined,
      feedback: row.feedback ?? undefined,
      marks: row.marks ?? undefined,
    };
  }

  const scrollPositions =
    (input.preferences.scroll_positions as Record<string, number> | null) ??
    {};
  const githubRepoLinks =
    (input.preferences.github_repo_links as Record<string, string> | null) ??
    {};

  const moduleGates = gatesFromRows(input.gates);

  return {
    ...defaultProgressState,
    version: PROGRESS_VERSION,
    completed,
    notes,
    bookmarks,
    completionDates,
    projectMeta,
    assignmentMeta,
    githubRepoLinks,
    weekNotes,
    moduleGates,
    scrollPositions,
    unlockedWeekIds: moduleGates.practice.unlockedWeekIds,
    completedWeekIds: moduleGates.practice.completedWeekIds,
  };
}

export function mapLearnerNotes(rows: LearnerNoteRow[]): AppNote[] {
  const accents = new Set(["indigo", "emerald", "amber", "rose", "sky"]);
  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    content: row.content,
    weekId: row.week_id ?? undefined,
    updatedAt: row.updated_at,
    pinned: row.pinned,
    accent:
      row.accent && accents.has(row.accent)
        ? (row.accent as AppNote["accent"])
        : undefined,
  }));
}

export function mapStudySessions(rows: StudySessionRow[]): StudySession[] {
  return rows.map((row) => ({
    date: row.session_date,
    hours: Number(row.hours),
    weekId: row.week_id,
  }));
}
