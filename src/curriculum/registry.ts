import manifest from "./manifest.json";
import week1 from "./weeks/week-1.json";
import week2 from "./weeks/week-2.json";
import week3 from "./weeks/week-3.json";
import week4 from "./weeks/week-4.json";
import week5 from "./weeks/week-5.json";
import week6 from "./weeks/week-6.json";
import week7 from "./weeks/week-7.json";
import week8 from "./weeks/week-8.json";
import week9 from "./weeks/week-9.json";
import week10 from "./weeks/week-10.json";
import week11 from "./weeks/week-11.json";
import week12 from "./weeks/week-12.json";
import type { CurriculumWeekDefinition } from "./types";
import { withInterviewContent } from "./interview/merge";

/**
 * Week module registry.
 * To add a new week:
 * 1. Create src/curriculum/weeks/week-N.json
 * 2. Add "week-N" to manifest.json
 * 3. Import and register below (one line)
 */
const WEEK_MODULES: Record<string, CurriculumWeekDefinition> = {
  "week-1": week1 as CurriculumWeekDefinition,
  "week-2": week2 as CurriculumWeekDefinition,
  "week-3": week3 as CurriculumWeekDefinition,
  "week-4": week4 as CurriculumWeekDefinition,
  "week-5": week5 as CurriculumWeekDefinition,
  "week-6": week6 as CurriculumWeekDefinition,
  "week-7": week7 as CurriculumWeekDefinition,
  "week-8": week8 as CurriculumWeekDefinition,
  "week-9": week9 as CurriculumWeekDefinition,
  "week-10": week10 as CurriculumWeekDefinition,
  "week-11": week11 as CurriculumWeekDefinition,
  "week-12": week12 as CurriculumWeekDefinition,
};

let cachedWeeks: CurriculumWeekDefinition[] | null = null;

export function getCurriculumWeeks(): CurriculumWeekDefinition[] {
  if (!cachedWeeks) {
    cachedWeeks = manifest.weeks
      .map((slug) => WEEK_MODULES[slug])
      .filter((w): w is CurriculumWeekDefinition => Boolean(w))
      .map(withInterviewContent)
      .sort((a, b) => a.id - b.id);
  }
  return cachedWeeks;
}

export function getCurriculumWeek(id: number): CurriculumWeekDefinition | undefined {
  return getCurriculumWeeks().find((w) => w.id === id);
}

export function getTotalWeeks(): number {
  return getCurriculumWeeks().length;
}
