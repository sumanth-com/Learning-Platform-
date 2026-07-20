import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { CoursesRepository } from "@/features/curriculum/repositories/courses.repository";
import { PhasesRepository } from "@/features/curriculum/repositories/phases.repository";
import { ModulesRepository } from "@/features/curriculum/repositories/modules.repository";
import { LessonsRepository } from "@/features/curriculum/repositories/lessons.repository";
import { LessonResourcesRepository } from "@/features/curriculum/repositories/resources.repository";
import { ProgressRepository } from "@/features/curriculum/repositories/progress.repository";
import { percent, toLessonSummary } from "@/features/curriculum/lib/mappers";
import { DEFAULT_COURSE_SLUG } from "@/features/curriculum/types";
import type {
  ContinueLearningState,
  CourseJourney,
  LessonDetail,
  ModuleDetail,
  ModuleSummary,
  PhaseWithModules,
} from "@/features/curriculum/types";

type Client = SupabaseClient<Database>;

export class CurriculumService {
  private readonly courses: CoursesRepository;
  private readonly phases: PhasesRepository;
  private readonly modules: ModulesRepository;
  private readonly lessons: LessonsRepository;
  private readonly resources: LessonResourcesRepository;
  private readonly progress: ProgressRepository;

  constructor(client: Client) {
    this.courses = new CoursesRepository(client);
    this.phases = new PhasesRepository(client);
    this.modules = new ModulesRepository(client);
    this.lessons = new LessonsRepository(client);
    this.resources = new LessonResourcesRepository(client);
    this.progress = new ProgressRepository(client);
  }

  async getCourseJourney(
    profileId: string,
    courseSlug: string = DEFAULT_COURSE_SLUG
  ): Promise<CourseJourney | null> {
    const course = await this.courses.findPublishedBySlug(courseSlug);
    if (!course) return null;

    const phases = await this.phases.listByCourseId(course.id);
    const modules = await this.modules.listByPhaseIds(phases.map((p) => p.id));
    const lessons = await this.lessons.listByModuleIds(modules.map((m) => m.id));
    const completedIds = await this.progress.listCompletedLessonIds(profileId);

    const lessonsByModule = groupBy(lessons, (l) => l.module_id);
    const modulesByPhase = groupBy(modules, (m) => m.phase_id);

    const phasesWithModules: PhaseWithModules[] = phases.map((phase) => {
      const phaseModules: ModuleSummary[] = (
        modulesByPhase.get(phase.id) ?? []
      ).map((module) => {
        const moduleLessons = (lessonsByModule.get(module.id) ?? []).map((l) =>
          toLessonSummary(l, completedIds)
        );
        const completedCount = moduleLessons.filter((l) => l.isCompleted).length;
        return {
          ...module,
          lessons: moduleLessons,
          completedCount,
          totalCount: moduleLessons.length,
          progressPercent: percent(completedCount, moduleLessons.length),
        };
      });

      const completedCount = phaseModules.reduce(
        (s, m) => s + m.completedCount,
        0
      );
      const totalCount = phaseModules.reduce((s, m) => s + m.totalCount, 0);

      return {
        ...phase,
        modules: phaseModules,
        completedCount,
        totalCount,
      };
    });

    const completedCount = phasesWithModules.reduce(
      (s, p) => s + p.completedCount,
      0
    );
    const totalCount = phasesWithModules.reduce((s, p) => s + p.totalCount, 0);

    return {
      course,
      phases: phasesWithModules,
      completedCount,
      totalCount,
      progressPercent: percent(completedCount, totalCount),
    };
  }

  async getModuleBySlug(
    profileId: string,
    slug: string
  ): Promise<ModuleDetail | null> {
    const module = await this.modules.findBySlug(slug);
    if (!module) return null;

    const phase = await this.phases.findById(module.phase_id);
    if (!phase) return null;

    const course = await this.courses.findById(phase.course_id);
    if (!course) return null;

    const lessons = await this.lessons.listByModuleIds([module.id]);
    const completedIds = await this.progress.listCompletedLessonIds(profileId);
    const summaries = lessons.map((l) => toLessonSummary(l, completedIds));
    const completedCount = summaries.filter((l) => l.isCompleted).length;

    return {
      module,
      phase,
      course,
      lessons: summaries,
      completedCount,
      totalCount: summaries.length,
      progressPercent: percent(completedCount, summaries.length),
      totalDurationMinutes: summaries.reduce(
        (s, l) => s + l.durationMinutes,
        0
      ),
    };
  }

  async getLessonBySlug(
    profileId: string,
    slug: string
  ): Promise<LessonDetail | null> {
    const lesson = await this.lessons.findBySlug(slug);
    if (!lesson) return null;

    const module = await this.modules.findById(lesson.module_id);
    if (!module) return null;

    const phase = await this.phases.findById(module.phase_id);
    if (!phase) return null;

    const course = await this.courses.findById(phase.course_id);
    if (!course) return null;

    const resources = await this.resources.listByLessonId(lesson.id);
    const siblings = await this.lessons.listByModuleIds([module.id]);
    const ordered = [...siblings].sort((a, b) => a.sort_order - b.sort_order);
    const index = ordered.findIndex((l) => l.id === lesson.id);
    const completedIds = await this.progress.listCompletedLessonIds(profileId);

    return {
      lesson,
      resources,
      module,
      phase,
      course,
      isCompleted: completedIds.has(lesson.id),
      previousLessonSlug: index > 0 ? ordered[index - 1]!.slug : null,
      nextLessonSlug:
        index >= 0 && index < ordered.length - 1
          ? ordered[index + 1]!.slug
          : null,
    };
  }

  async getContinueLearning(
    profileId: string,
    courseSlug: string = DEFAULT_COURSE_SLUG
  ): Promise<ContinueLearningState | null> {
    const journey = await this.getCourseJourney(profileId, courseSlug);
    if (!journey) return null;

    const ordered = journey.phases.flatMap((phase) =>
      phase.modules.flatMap((module) =>
        module.lessons.map((lesson) => ({
          lesson,
          phaseTitle: phase.title,
          moduleTitle: module.title,
          moduleSlug: module.slug,
        }))
      )
    );

    const next =
      ordered.find((item) => !item.lesson.isCompleted) ?? ordered[0] ?? null;

    return {
      hasStarted: journey.completedCount > 0,
      courseTitle: journey.course.title,
      courseSlug: journey.course.slug,
      courseDifficulty: journey.course.difficulty,
      courseDuration: journey.course.estimated_duration,
      phaseTitle: next?.phaseTitle ?? null,
      moduleTitle: next?.moduleTitle ?? null,
      moduleSlug: next?.moduleSlug ?? null,
      lesson: next?.lesson ?? null,
      progressPercent: journey.progressPercent,
      completedCount: journey.completedCount,
      totalCount: journey.totalCount,
    };
  }
}

function groupBy<T>(items: T[], keyFn: (item: T) => string): Map<string, T[]> {
  const map = new Map<string, T[]>();
  for (const item of items) {
    const key = keyFn(item);
    const bucket = map.get(key);
    if (bucket) bucket.push(item);
    else map.set(key, [item]);
  }
  return map;
}
