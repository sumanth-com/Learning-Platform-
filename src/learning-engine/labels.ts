import type { LearnDifficulty, LearnLesson, LearnTopicBundle, LearnWeekBundle } from "./types";
import { lessonEntityId } from "./types";

export const DIFFICULTY_LABELS: Record<LearnDifficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

export const DIFFICULTY_STYLES: Record<LearnDifficulty, string> = {
  easy: "bg-emerald-500/15 text-emerald-400 ring-emerald-500/30",
  medium: "bg-amber-500/15 text-amber-400 ring-amber-500/30",
  hard: "bg-rose-500/15 text-rose-400 ring-rose-500/30",
};

export const PROBLEM_TYPE_LABELS: Record<string, string> = {
  pattern: "Pattern Programs",
  logic: "Logic Problems",
  "output-prediction": "Output Prediction",
  "find-bug": "Find the Bug",
  mcq: "MCQ",
  "dry-run": "Dry Run",
  interview: "Interview Coding",
  hackerrank: "HackerRank Style",
  leetcode: "LeetCode Style",
  company: "Company Questions",
  optimization: "Optimization",
  debugging: "Debugging",
  "nested-pattern": "Nested Loop Patterns",
  select: "SELECT Queries",
  insert: "INSERT",
  update: "UPDATE",
  join: "JOINs",
  aggregate: "GROUP BY / HAVING",
  subquery: "Subqueries",
  transaction: "Transactions",
  controller: "Controller",
  service: "Service Layer",
  repository: "Repository",
  jwt: "JWT Flow",
  prompt: "Prompt Engineering",
  terminal: "Terminal Workflow",
};

export function problemTypeLabel(type?: string): string {
  if (!type) return "Problem";
  return PROBLEM_TYPE_LABELS[type] ?? type.replace(/-/g, " ");
}

export function weekProgress(
  week: LearnWeekBundle,
  isDone: (id: string) => boolean
): { completed: number; total: number; percent: number } {
  let completed = 0;
  let total = 0;
  for (const topic of week.topics) {
    for (const lesson of topic.lessons) {
      if (lesson.problemType === "mcq") continue;
      if (lesson.weekId && lesson.weekId !== week.weekId) continue;
      total++;
      const id = lessonEntityId({ weekId: week.weekId, topicSlug: lesson.topicSlug, id: lesson.id });
      if (isDone(id)) completed++;
    }
  }
  return { completed, total, percent: total ? Math.round((completed / total) * 100) : 0 };
}

export function topicProgress(
  bundle: LearnTopicBundle,
  weekId: number,
  isDone: (id: string) => boolean
): { completed: number; total: number; percent: number } {
  let completed = 0;
  const total = bundle.lessons.length;
  for (const lesson of bundle.lessons) {
    const id = lessonEntityId({ weekId, topicSlug: lesson.topicSlug, id: lesson.id });
    if (isDone(id)) completed++;
  }
  return { completed, total, percent: total ? Math.round((completed / total) * 100) : 0 };
}

export function topicEstimatedMinutes(bundle: LearnTopicBundle): number {
  return bundle.lessons.reduce((sum, l) => sum + (l.estimatedMinutes ?? 10), 0);
}

export function lessonsByDifficulty(lessons: LearnLesson[], difficulty: LearnDifficulty): LearnLesson[] {
  return lessons.filter((l) => l.difficulty === difficulty);
}

export function groupByProblemType(lessons: LearnLesson[]): Map<string, LearnLesson[]> {
  const map = new Map<string, LearnLesson[]>();
  for (const lesson of lessons) {
    const key = lesson.problemType ?? "logic";
    const list = map.get(key) ?? [];
    list.push(lesson);
    map.set(key, list);
  }
  return map;
}

export function completedTopicsCount(
  week: LearnWeekBundle,
  isDone: (id: string) => boolean
): number {
  return week.topics.filter((t) => {
    const p = topicProgress(t, week.weekId, isDone);
    return p.percent === 100;
  }).length;
}
