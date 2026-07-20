import type { CurriculumWeekDefinition } from "@/curriculum/types";
import { collectTrackableEntities } from "@/curriculum/entities";

export function getWeekEntityIds(week: CurriculumWeekDefinition): string[] {
  return collectTrackableEntities(week).map((e) => e.id);
}

export function getWeekProjectIds(week: CurriculumWeekDefinition): string[] {
  return week.projects.map((p) => p.id);
}

export interface ExportedProgress {
  version: number;
  exportedAt: string;
  app: "prathyu-academy" | "supracodez";
  progress: unknown;
  profile: unknown;
  studySessions: unknown;
  notes: unknown;
  todayGoal: string;
  todayGoalDate: string;
  todayGoalCompleted: boolean;
  resumePosition?: unknown;
}

export function parseImportedProgress(raw: string): ExportedProgress {
  const data = JSON.parse(raw) as ExportedProgress;
  if (data.app && data.app !== "prathyu-academy" && data.app !== "supracodez") {
    throw new Error("Invalid backup file. Please select a SupraCodez export.");
  }
  if (!data.progress) {
    throw new Error("Invalid backup file. Missing progress data.");
  }
  return data;
}

export function downloadJson(filename: string, content: string) {
  const blob = new Blob([content], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function aggregateStudyHoursByMonth(
  sessions: { date: string; hours: number }[]
): { month: string; hours: number }[] {
  const map = new Map<string, number>();
  for (const session of sessions) {
    const monthKey = session.date.slice(0, 7);
    map.set(monthKey, (map.get(monthKey) ?? 0) + session.hours);
  }
  const sorted = [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  return sorted.slice(-6).map(([key, hours]) => {
    const [year, month] = key.split("-");
    const label = new Date(Number(year), Number(month) - 1).toLocaleString("en", { month: "short" });
    return { month: label, hours: Math.round(hours * 10) / 10 };
  });
}
