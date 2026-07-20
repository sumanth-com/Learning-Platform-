import type { CurriculumWeekDefinition } from "@/curriculum/types";
import { collectTrackableEntities, getEntityIdsByType } from "@/curriculum/entities";
import type { UserProgressState } from "@/store/progress-types";
import {
  getModuleCurrentWeek,
  getModuleWeekProgress,
  isModuleWeekCompleted,
  isModuleWeekLocked,
} from "@/lib/module-progress";

export interface ProgressCounts {
  completed: number;
  total: number;
  percentage: number;
}

export interface WeekProgressBreakdown {
  overall: ProgressCounts;
  dayItems: ProgressCounts;
  topicItems: ProgressCounts;
  programming: ProgressCounts;
  projects: ProgressCounts;
  ai: ProgressCounts;
  github: ProgressCounts;
  interview: ProgressCounts;
}

export interface GlobalStats {
  overallProgress: number;
  topicsCompleted: number;
  topicsTotal: number;
  programmingCompleted: number;
  programmingTotal: number;
  projectsCompleted: number;
  projectsTotal: number;
  interviewCompleted: number;
  interviewTotal: number;
  aiCompleted: number;
  aiTotal: number;
  githubCompleted: number;
  githubTotal: number;
}

function countProgress(ids: string[], completed: Record<string, boolean>): ProgressCounts {
  const total = ids.length;
  if (total === 0) return { completed: 0, total: 0, percentage: 0 };
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

export function computeWeekProgress(
  week: CurriculumWeekDefinition,
  progress: UserProgressState
): WeekProgressBreakdown {
  const { completed } = progress;

  const dayItems = countProgress(idsOfType(week, "day-item"), completed);
  const topicItems = countProgress(idsOfType(week, "topic-item"), completed);
  const programming = countProgress(idsOfType(week, "programming-question"), completed);
  const projectFeatures = countProgress(idsOfType(week, "project-feature"), completed);
  const projectComplete = countProgress(idsOfType(week, "project-complete"), completed);
  const projects = {
    completed: projectComplete.completed,
    total: projectComplete.total,
    percentage: projectComplete.total
      ? Math.round((projectComplete.completed / projectComplete.total) * 100)
      : 0,
  };
  const aiTopics = countProgress(idsOfType(week, "ai-topic"), completed);
  const aiExercises = countProgress(idsOfType(week, "ai-exercise"), completed);
  const aiPrompts = countProgress(idsOfType(week, "ai-prompt"), completed);
  const aiTotal = aiTopics.total + aiExercises.total + aiPrompts.total;
  const aiDone = aiTopics.completed + aiExercises.completed + aiPrompts.completed;
  const ai = {
    completed: aiDone,
    total: aiTotal,
    percentage: aiTotal ? Math.round((aiDone / aiTotal) * 100) : 0,
  };
  const github = countProgress(idsOfType(week, "github-file"), completed);
  const interview = countProgress(idsOfType(week, "interview-question"), completed);

  const overall = getModuleWeekProgress("practice", week.id, week, progress);

  return {
    overall,
    dayItems,
    topicItems,
    programming,
    projects: { ...projects, completed: projectComplete.completed, total: projectComplete.total },
    ai,
    github,
    interview,
  };
}

export function computeGlobalStats(
  weeks: CurriculumWeekDefinition[],
  progress: UserProgressState
): GlobalStats {
  let topicsCompleted = 0;
  let topicsTotal = 0;
  let programmingCompleted = 0;
  let programmingTotal = 0;
  let projectsCompleted = 0;
  let projectsTotal = 0;
  let interviewCompleted = 0;
  let interviewTotal = 0;
  let aiCompleted = 0;
  let aiTotal = 0;
  let githubCompleted = 0;
  let githubTotal = 0;
  let overallSum = 0;

  weeks.forEach((week) => {
    const bp = computeWeekProgress(week, progress);
    const practice = getModuleWeekProgress("practice", week.id, week, progress);
    overallSum += practice.percentage;
    topicsCompleted += bp.dayItems.completed;
    topicsTotal += bp.dayItems.total;
    programmingCompleted += bp.programming.completed;
    programmingTotal += bp.programming.total;
    projectsCompleted += bp.projects.completed;
    projectsTotal += bp.projects.total;
    interviewCompleted += bp.interview.completed;
    interviewTotal += bp.interview.total;
    aiCompleted += bp.ai.completed;
    aiTotal += bp.ai.total;
    githubCompleted += bp.github.completed;
    githubTotal += bp.github.total;
  });

  return {
    overallProgress: weeks.length ? Math.round(overallSum / weeks.length) : 0,
    topicsCompleted,
    topicsTotal,
    programmingCompleted,
    programmingTotal,
    projectsCompleted,
    projectsTotal,
    interviewCompleted,
    interviewTotal,
    aiCompleted,
    aiTotal,
    githubCompleted,
    githubTotal,
  };
}

export function isWeekLocked(weekId: number, progress: UserProgressState): boolean {
  return isModuleWeekLocked("practice", weekId, progress);
}

export function isWeekCompleted(weekId: number, progress: UserProgressState): boolean {
  return isModuleWeekCompleted("practice", weekId, progress);
}

export function getCurrentWeekId(weeks: CurriculumWeekDefinition[], progress: UserProgressState): number {
  return getModuleCurrentWeek("practice", progress, weeks.length);
}

export function getTodayProgress(
  week: CurriculumWeekDefinition,
  progress: UserProgressState,
  dayNumber: number
): ProgressCounts {
  const day = week.days.find((d) => d.dayNumber === dayNumber);
  if (!day) return { completed: 0, total: 0, percentage: 0 };
  const ids = day.topics.flatMap((t) => t.items.map((i) => i.id));
  return countProgress(ids, progress.completed);
}

/** Get day number for today within a week (1-7 cycle based on day of week) */
export function getTodayDayNumber(): number {
  const day = new Date().getDay();
  return day === 0 ? 7 : day;
}

export function getProjectProgressPercent(
  projectId: string,
  week: CurriculumWeekDefinition,
  progress: UserProgressState
): number {
  const project = week.projects.find((p) => p.id === projectId);
  if (!project) return 0;
  if (progress.completed[`${projectId}-complete`]) return 100;
  const featureIds = project.features.map((f) => f.id);
  const done = featureIds.filter((id) => progress.completed[id]).length;
  return featureIds.length ? Math.round((done / featureIds.length) * 100) : 0;
}

export function getEntityIdsForWeek(weekId: number, weeks: CurriculumWeekDefinition[]): string[] {
  const week = weeks.find((w) => w.id === weekId);
  if (!week) return [];
  return collectTrackableEntities(week).map((e) => e.id);
}

export { getEntityIdsByType };
