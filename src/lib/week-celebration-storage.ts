const STORAGE_KEY = "prathyu-celebrated-weeks";

function readCelebratedWeeks(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((n) => typeof n === "number") : [];
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
    const ids = readCelebratedWeeks();
    if (!ids.includes(weekId)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids, weekId]));
    }
  } catch {
    /* ignore */
  }
}

/** Backfill so already-completed weeks never celebrate again on refresh. */
export function syncCelebratedWeeks(completedWeekIds: number[]): void {
  if (typeof window === "undefined" || completedWeekIds.length === 0) return;
  try {
    const existing = new Set(readCelebratedWeeks());
    completedWeekIds.forEach((id) => existing.add(id));
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...existing].sort((a, b) => a - b)));
  } catch {
    /* ignore */
  }
}
