import type {
  CourseRow,
  LessonDifficulty,
  LessonResourceRow,
  LessonRow,
  ModuleRow,
  PhaseRow,
} from "@/types/database";

export type { LessonDifficulty };

export const CURRICULUM_ROUTES = {
  journey: "/journey",
  module: (slug: string) => `/module/${slug}`,
  moduleRoadmap: (slug: string) => `/module/${slug}/roadmap`,
  modulePractice: (slug: string) => `/module/${slug}/practice`,
  moduleResources: (slug: string) => `/module/${slug}/resources`,
  moduleAssignments: (slug: string) => `/module/${slug}/assignments`,
  moduleProjects: (slug: string) => `/module/${slug}/projects`,
  moduleAssessment: (slug: string) => `/module/${slug}/assessment`,
  moduleAiMentor: (slug: string) => `/module/${slug}/ai-mentor`,
  moduleTopic: (moduleSlug: string, topicSlug: string) =>
    `/module/${moduleSlug}/topic/${topicSlug}`,
  lesson: (slug: string) => `/lesson/${slug}`,
  learn: (courseSlug: string) => `/learn/${courseSlug}`,
  learnLesson: (courseSlug: string, lessonSlug: string) =>
    `/learn/${courseSlug}?lesson=${encodeURIComponent(lessonSlug)}`,
} as const;

export const CURRICULUM_PROTECTED_ROUTES = [
  CURRICULUM_ROUTES.journey,
  "/module",
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
