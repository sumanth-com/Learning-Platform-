import {
  getActiveWorkspaceUserId,
  scopedWorkspaceKey,
  WORKSPACE_STORAGE_BASES,
} from "@/lib/client-workspace";

const LEGACY_KEY = "prathyu-celebrated-weeks";

function storageKey(): string | null {
  return scopedWorkspaceKey(
    WORKSPACE_STORAGE_BASES.celebratedWeeks,
    getActiveWorkspaceUserId()
  );
}

function readCelebratedWeeks(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const key = storageKey();
    if (!key) return [];
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((n) => typeof n === "number")
      : [];
  } catch {
    return [];
  }
}

export function hasWeekBeenCelebrated(weekId: number): boolean {
  return readCelebratedWeeks().includes(weekId);
}

export function markWeekCelebrated(weekId: number): void {
  if (typeof window === "undefined") return;
  try {
    const key = storageKey();
    if (!key) return;
    const ids = readCelebratedWeeks();
    if (!ids.includes(weekId)) {
      localStorage.setItem(key, JSON.stringify([...ids, weekId]));
    }
    try {
      localStorage.removeItem(LEGACY_KEY);
    } catch {
      /* ignore */
    }
  } catch {
    /* ignore */
  }
}

/** Backfill so already-completed weeks never celebrate again on refresh. */
export function syncCelebratedWeeks(completedWeekIds: number[]): void {
  if (typeof window === "undefined" || completedWeekIds.length === 0) return;
  try {
    const key = storageKey();
    if (!key) return;
    const existing = new Set(readCelebratedWeeks());
    completedWeekIds.forEach((id) => existing.add(id));
    localStorage.setItem(
      key,
      JSON.stringify([...existing].sort((a, b) => a - b))
    );
  } catch {
    /* ignore */
  }
}
