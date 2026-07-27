import type {
  CourseRow,
  LessonDifficulty,
  LessonResourceRow,
  LessonRow,
  ModuleRow,
  PhaseRow,
} from "@/types/database";

export type { LessonDifficulty };

export { CURRICULUM_ROUTES } from "@/features/curriculum/lib/curriculum-routes";

export const CURRICULUM_PROTECTED_ROUTES = [
  "/roadmap",
  "/module",
  "/challenge",
  "/lesson",
  "/learn",
] as const;

export const DEFAULT_COURSE_SLUG = "full-stack-ai-engineering";

export interface LessonSummary {
  id: string;
  title: string;
  slug: string;
  description: string;
  durationMinutes: number;
  difficulty: LessonDifficulty;
  sortOrder: number;
  isPreview: boolean;
  isCompleted: boolean;
}

export interface ModuleSummary extends ModuleRow {
  lessons: LessonSummary[];
  completedCount: number;
  totalCount: number;
  progressPercent: number;
}

export interface PhaseWithModules extends PhaseRow {
  modules: ModuleSummary[];
  completedCount: number;
  totalCount: number;
}

export interface CourseJourney {
  course: CourseRow;
  phases: PhaseWithModules[];
  completedCount: number;
  totalCount: number;
  progressPercent: number;
}

export interface ModuleDetail {
  module: ModuleRow;
  phase: PhaseRow;
  course: CourseRow;
  lessons: LessonSummary[];
  completedCount: number;
  totalCount: number;
  progressPercent: number;
  totalDurationMinutes: number;
}

export interface LessonDetail {
  lesson: LessonRow;
  resources: LessonResourceRow[];
  module: ModuleRow;
  phase: PhaseRow;
  course: CourseRow;
  isCompleted: boolean;
  previousLessonSlug: string | null;
  nextLessonSlug: string | null;
}

export interface ContinueLearningState {
  hasStarted: boolean;
  courseTitle: string;
  courseSlug: string;
  courseDifficulty: string;
  courseDuration: string;
  phaseTitle: string | null;
  moduleTitle: string | null;
  moduleSlug: string | null;
  lesson: LessonSummary | null;
  progressPercent: number;
  completedCount: number;
  totalCount: number;
}
