export { CurriculumService } from "@/features/curriculum/services/curriculum.service";
export { ProgressService } from "@/features/curriculum/services/progress.service";
export {
  createCurriculumService,
  createProgressService,
} from "@/features/curriculum/lib/create-services";
export { toggleLessonCompleteAction } from "@/features/curriculum/actions/progress-actions";
export {
  CURRICULUM_ROUTES,
  CURRICULUM_PROTECTED_ROUTES,
  DEFAULT_COURSE_SLUG,
} from "@/features/curriculum/types";
export type {
  CourseJourney,
  LessonDetail,
  ModuleDetail,
  ContinueLearningState,
  LessonSummary,
  PhaseWithModules,
  ModuleSummary,
} from "@/features/curriculum/types";
