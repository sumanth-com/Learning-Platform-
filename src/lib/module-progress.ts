import type { CurriculumWeekDefinition } from "@/curriculum/types";
import { collectTrackableEntities } from "@/curriculum/entities";
import { getLearningWeek, lessonEntityId } from "@/learning-engine/loader";
import {
  COMMUNICATION_WEEKS,
  collectCommunicationIds,
  getCommunicationWeek,
} from "@/curriculum/communication-skills";
import { getCurriculumWeeks, getTotalWeeks } from "@/curriculum/registry";
import type { UserProgressState } from "@/store/progress-types";
import { PROGRESS_VERSION } from "@/store/progress-types";
import { UNLOCK_ALL_WEEKS } from "@/lib/feature-flags";
import type { ProgressCounts } from "@/lib/progress-engine";

export type LearningModule =
  | "roadmap"
  | "practice"
  | "ai-skills"
  | "projects"
  | "github"
  | "interview"
  | "communication";

export const LEARNING_MODULES: LearningModule[] = [
  "roadmap",
  "practice",
  "ai-skills",
  "projects",
  "github",
  "interview",
  "communication",
];

export const MODULE_LABELS: Record<LearningModule, string> = {
  roadmap: "Roadmap",
  practice: "Practice",
  "ai-skills": "AI Skills",
  projects: "Projects",
  github: "GitHub Tasks",
  interview: "Interview",
  communication: "Communication",
};

export interface ModuleWeekGate {
  unlockedWeekIds: number[];
  completedWeekIds: number[];
}

export type ModuleWeekGates = Record<LearningModule, ModuleWeekGate>;

export interface ResumePosition {
  module: LearningModule;
  weekId: number;
  title: string;
  subtitle?: string;
  href: string;
  updatedAt: string;
  topicSlug?: string;
  topicTitle?: string;
  lessonId?: string;
  lessonTitle?: string;
  entityId?: string;
  difficulty?: string;
  problemType?: string;
  scrollKey?: string;
  scrollY?: number;
}

const emptyCounts = (): ProgressCounts => ({ completed: 0, total: 0, percentage: 0 });

function countProgress(ids: string[], completed: Record<string, boolean>): ProgressCounts {
  const total = ids.length;
  if (total === 0) return emptyCounts();
  const done = ids.filter((id) => completed[id]).length;
  return {
    completed: done,
    total,
    percentage: Math.round((done / total) * 100),
  };
}

function idsOfType(week: CurriculumWeekDefinition, type: string): string[] {
  return collectTrackableEntities(week)
    .filter((e) => e.type === type)
    .map((e) => e.id);
}

/** Challenge-hub lessons only — matches WeekChallengeHub (no MCQ, week-scoped). */
function hubChallengeLessonIds(week: CurriculumWeekDefinition): string[] {
  const learnWeek = getLearningWeek(week.id);
  if (!learnWeek) return idsOfType(week, "learning-lesson");

  const ids: string[] = [];
  for (const bundle of learnWeek.topics) {
    for (const lesson of bundle.lessons) {
      if (lesson.problemType === "mcq") continue;
      if (lesson.weekId && lesson.weekId !== week.id) continue;
      ids.push(
        lessonEntityId({
          weekId: week.id,
          topicSlug: lesson.topicSlug ?? bundle.topic.slug,
          id: lesson.id,
        })
      );
    }
  }
  return ids;
}

export function getHubChallengeLessonIds(week: CurriculumWeekDefinition): string[] {
  return hubChallengeLessonIds(week);
}

/** Entity IDs that count toward a module's week progress bar. */
export function collectWeekModuleProgressIds(
  week: CurriculumWeekDefinition,
  module: LearningModule
): string[] {
  if (module === "communication") {
    const comm = getCommunicationWeek(week.id);
    return comm ? collectCommunicationIds(comm.skill) : [];
  }

  switch (module) {
    case "roadmap":
    case "practice":
      return hubChallengeLessonIds(week);
    case "ai-skills":
      return [
        ...idsOfType(week, "ai-topic"),
        ...idsOfType(week, "ai-exercise"),
        ...idsOfType(week, "ai-prompt"),
      ];
    case "projects":
      return idsOfType(week, "project-complete");
    case "github":
      return idsOfType(week, "github-file");
    case "interview":
      return idsOfType(week, "interview-question");
    default:
      return [];
  }
}

const JAVA_TRACK_MODULES: LearningModule[] = [
  "roadmap",
  "practice",
  "ai-skills",
  "projects",
  "github",
  "interview",
];

/** Modules that must all reach 100% before the next week unlocks everywhere. */
export const UNIFIED_WEEK_MODULES: LearningModule[] = [
  "practice",
  "ai-skills",
  "projects",
  "github",
  "interview",
];

/**
 * Week N+1 unlocks only when week N is 100% in every module above plus Communication.
 * Example: week 2 done everywhere → week 3 opens in Roadmap, AI Skills, Projects, etc.
 */

export function isWeekFullyCompleteAcrossModules(
  progress: UserProgressState,
  weekId: number,
  weeks: CurriculumWeekDefinition[]
): boolean {
  const week = weeks.find((w) => w.id === weekId);
  if (!week) return false;

  for (const module of UNIFIED_WEEK_MODULES) {
    if (getModuleWeekProgress(module, weekId, week, progress).percentage < 100) {
      return false;
    }
  }

  const commWeek = getCommunicationWeek(weekId);
  if (commWeek) {
    if (getModuleWeekProgress("communication", weekId, undefined, progress).percentage < 100) {
      return false;
    }
  }

  return true;
}

/** Mark every tracked item for a week across all learning modules and rebuild gates. */
export function markWeekCompleteAllModules(
  progress: UserProgressState,
  weekId: number,
  weeks: CurriculumWeekDefinition[]
): UserProgressState {
  const week = weeks.find((w) => w.id === weekId);
  const ids = new Set<string>();

  if (week) {
    for (const module of JAVA_TRACK_MODULES) {
      for (const id of collectWeekModuleProgressIds(week, module)) {
        ids.add(id);
      }
    }
  }

  const commWeek = getCommunicationWeek(weekId);
  if (commWeek) {
    for (const id of collectCommunicationIds(commWeek.skill)) {
      ids.add(id);
    }
  }

  if (ids.size === 0) return progress;

  const today = new Date().toISOString().split("T")[0];
  const completed = { ...progress.completed };
  const completionDates = { ...progress.completionDates };

  for (const id of ids) {
    completed[id] = true;
    completionDates[id] = today;
  }

  const next = { ...progress, completed, completionDates };
  return {
    ...next,
    moduleGates: rebuildModuleGatesFromProgress(getCurriculumWeeks(), next),
  };
}

/** @deprecated use markWeekCompleteAllModules */
export function markWeekHubChallengesComplete(
  progress: UserProgressState,
  weekId: number,
  weeks: CurriculumWeekDefinition[]
): UserProgressState {
  return markWeekCompleteAllModules(progress, weekId, weeks);
}

export function weekNeedsAllModulesSeed(
  progress: UserProgressState,
  weekId: number,
  weeks: CurriculumWeekDefinition[]
): boolean {
  const week = weeks.find((w) => w.id === weekId);
  if (!week) return false;

  for (const module of JAVA_TRACK_MODULES) {
    if (module === "roadmap") continue;
    if (isModuleWeekLocked(module, weekId + 1, progress)) return true;
    if (getModuleWeekProgress(module, weekId, week, progress).percentage < 100) return true;
  }

  const commWeek = getCommunicationWeek(weekId);
  if (commWeek) {
    if (isModuleWeekLocked("communication", weekId + 1, progress)) return true;
    if (getModuleWeekProgress("communication", weekId, undefined, progress).percentage < 100) {
      return true;
    }
  }

  return false;
}

export function createDefaultModuleGates(): ModuleWeekGates {
  const mk = (): ModuleWeekGate => ({ unlockedWeekIds: [1], completedWeekIds: [] });
  return {
    roadmap: mk(),
    practice: mk(),
    "ai-skills": mk(),
    projects: mk(),
    github: mk(),
    interview: mk(),
    communication: mk(),
  };
}

export function getModuleWeekProgress(
  module: LearningModule,
  weekId: number,
  week: CurriculumWeekDefinition | undefined,
  progress: UserProgressState
): ProgressCounts {
  if (module === "communication") {
    const commWeek = getCommunicationWeek(weekId);
    if (!commWeek) return emptyCounts();
    const ids = collectCommunicationIds(commWeek.skill);
    return countProgress(ids, progress.completed);
  }

  if (!week) return emptyCounts();

  const { completed } = progress;

  switch (module) {
    case "roadmap":
    case "practice":
      return countProgress(hubChallengeLessonIds(week), completed);
    case "ai-skills": {
      const aiIds = [
        ...idsOfType(week, "ai-topic"),
        ...idsOfType(week, "ai-exercise"),
        ...idsOfType(week, "ai-prompt"),
      ];
      return countProgress(aiIds, completed);
    }
    case "projects":
      return countProgress(idsOfType(week, "project-complete"), completed);
    case "github":
      return countProgress(idsOfType(week, "github-file"), completed);
    case "interview":
      return countProgress(idsOfType(week, "interview-question"), completed);
    default:
      return emptyCounts();
  }
}

export function isModuleWeekLocked(
  module: LearningModule,
  weekId: number,
  progress: UserProgressState
): boolean {
  if (UNLOCK_ALL_WEEKS) return false;
  const gates = progress.moduleGates?.[module];
  if (!gates) return weekId !== 1;
  return !gates.unlockedWeekIds.includes(weekId);
}

export function isModuleWeekCompleted(
  module: LearningModule,
  weekId: number,
  progress: UserProgressState
): boolean {
  return progress.moduleGates?.[module]?.completedWeekIds.includes(weekId) ?? false;
}

export function getModuleCurrentWeek(
  module: LearningModule,
  progress: UserProgressState,
  totalWeeks = getTotalWeeks()
): number {
  const gates = progress.moduleGates?.[module];
  if (!gates) return 1;
  const incomplete = gates.unlockedWeekIds.find((id) => !gates.completedWeekIds.includes(id));
  return incomplete ?? gates.unlockedWeekIds[gates.unlockedWeekIds.length - 1] ?? totalWeeks;
}

function unlockNextWeek(gate: ModuleWeekGate, weekId: number, maxWeek: number): ModuleWeekGate {
  const completedWeekIds = gate.completedWeekIds.includes(weekId)
    ? gate.completedWeekIds
    : [...gate.completedWeekIds, weekId];
  const nextId = weekId + 1;
  const unlockedWeekIds =
    nextId <= maxWeek && !gate.unlockedWeekIds.includes(nextId)
      ? [...gate.unlockedWeekIds, nextId].sort((a, b) => a - b)
      : gate.unlockedWeekIds;
  return { completedWeekIds, unlockedWeekIds };
}

export function applyModuleCompletionUnlock(
  module: LearningModule,
  weekId: number,
  gates: ModuleWeekGates,
  maxWeek = 12
): ModuleWeekGates {
  const gate = gates[module];
  if (!gate || gate.completedWeekIds.includes(weekId)) return gates;
  return {
    ...gates,
    [module]: unlockNextWeek(gate, weekId, maxWeek),
  };
}

export function rebuildModuleGatesFromProgress(
  weeks: CurriculumWeekDefinition[],
  progress: UserProgressState
): ModuleWeekGates {
  const gates = createDefaultModuleGates();
  const maxJavaWeek = weeks.length || getTotalWeeks();

  let consecutiveComplete = 0;
  for (const week of weeks) {
    if (isWeekFullyCompleteAcrossModules(progress, week.id, weeks)) {
      consecutiveComplete = week.id;
    } else {
      break;
    }
  }

  const unlockedWeekIds = Array.from(
    { length: Math.min(consecutiveComplete + 1, maxJavaWeek) },
    (_, i) => i + 1
  );
  const completedWeekIds = Array.from({ length: consecutiveComplete }, (_, i) => i + 1);

  for (const module of JAVA_TRACK_MODULES) {
    gates[module] = {
      unlockedWeekIds: [...unlockedWeekIds],
      completedWeekIds: [...completedWeekIds],
    };
  }

  const maxCommWeek = COMMUNICATION_WEEKS.length;
  gates.communication = {
    unlockedWeekIds: Array.from(
      { length: Math.min(consecutiveComplete + 1, maxCommWeek) },
      (_, i) => i + 1
    ),
    completedWeekIds: Array.from({ length: Math.min(consecutiveComplete, maxCommWeek) }, (_, i) => i + 1),
  };

  return gates;
}

export function migrateProgressStateV3(
  state: UserProgressState,
  weeks: CurriculumWeekDefinition[],
  options?: { rebuildGates?: boolean }
): UserProgressState {
  const withScroll = {
    ...state,
    scrollPositions: state.scrollPositions ?? {},
  };

  const moduleGates =
    options?.rebuildGates || !withScroll.moduleGates || withScroll.version < 3
      ? rebuildModuleGatesFromProgress(weeks, withScroll)
      : withScroll.moduleGates;

  return {
    ...withScroll,
    version: PROGRESS_VERSION,
    moduleGates,
    unlockedWeekIds: state.unlockedWeekIds?.length ? state.unlockedWeekIds : [1],
    completedWeekIds: state.completedWeekIds ?? [],
  };
}
