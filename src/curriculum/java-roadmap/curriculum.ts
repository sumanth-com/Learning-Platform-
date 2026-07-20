/** 11-week Java backend roadmap — weekly curriculum source of truth */

import weekCurriculumJson from "./week-curriculum.json";

export interface CurriculumSubtopic {
  slug: string;
  title: string;
}

export interface WeekCurriculumSection {
  weekId: number;
  slug: string;
  title: string;
  emoji: string;
  theme: string;
  badge?: string;
  description: string;
  subtopics: CurriculumSubtopic[];
}

export const WEEK_ROADMAP_CURRICULUM = weekCurriculumJson as WeekCurriculumSection[];

export const WEEK_CURRICULUM_MAP = new Map(WEEK_ROADMAP_CURRICULUM.map((w) => [w.slug, w]));

export function getWeekBySlug(slug: string) {
  return WEEK_CURRICULUM_MAP.get(slug) ?? null;
}

export function getWeekById(weekId: number) {
  return WEEK_ROADMAP_CURRICULUM.find((w) => w.weekId === weekId) ?? null;
}

export function getAllWeekSlugs() {
  return WEEK_ROADMAP_CURRICULUM.map((w) => w.slug);
}

/** Legacy 19-section curriculum (deprecated — use week curriculum) */
import legacyJson from "./curriculum.json";
export interface CurriculumSection {
  slug: string;
  title: string;
  badge?: string;
  description: string;
  subtopics: CurriculumSubtopic[];
}
export const JAVA_ROADMAP_CURRICULUM = legacyJson as CurriculumSection[];
export const CURRICULUM_MAP = new Map(JAVA_ROADMAP_CURRICULUM.map((s) => [s.slug, s]));
export function getSectionBySlug(slug: string) {
  return CURRICULUM_MAP.get(slug) ?? null;
}
export function getAllSectionSlugs() {
  return JAVA_ROADMAP_CURRICULUM.map((s) => s.slug);
}
