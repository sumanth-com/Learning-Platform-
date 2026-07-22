import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { CoursesRepository } from "@/features/curriculum/repositories/courses.repository";
import { PhasesRepository } from "@/features/curriculum/repositories/phases.repository";
import { ModulesRepository } from "@/features/curriculum/repositories/modules.repository";
import { LessonsRepository } from "@/features/curriculum/repositories/lessons.repository";
import { LessonResourcesRepository } from "@/features/curriculum/repositories/resources.repository";
import { ProgressRepository } from "@/features/curriculum/repositories/progress.repository";
import { percent, toLessonSummary } from "@/features/curriculum/lib/mappers";
import {
  isProgrammingFundamentalsModule,
  mergeProgrammingFundamentalsLessons,
  programmingFundamentalsLessonContent,
  PROGRAMMING_FUNDAMENTALS_TOPICS,
} from "@/features/curriculum/lib/programming-fundamentals";
import {
  isDeveloperToolingModule,
  mergeDeveloperToolingLessons,
} from "@/features/curriculum/lib/developer-tooling";
import {
  isHtmlAcademyModule,
  mergeHtmlAcademyLessons,
} from "@/features/curriculum/lib/html-academy";
import {
  isCssAcademyModule,
  mergeCssAcademyLessons,
} from "@/features/curriculum/lib/css-academy";
import {
  isJsAcademyModule,
  mergeJsAcademyLessons,
} from "@/features/curriculum/lib/js-academy";
import {
  isReactAcademyModule,
  mergeReactAcademyLessons,
} from "@/features/curriculum/lib/react-academy";
import {
  isNextjsAcademyModule,
  mergeNextjsAcademyLessons,
} from "@/features/curriculum/lib/nextjs-academy";
import {
  isTypescriptAcademyModule,
  mergeTypescriptAcademyLessons,
} from "@/features/curriculum/lib/typescript-academy";
import {
  isApisAcademyModule,
  mergeApisAcademyLessons,
} from "@/features/curriculum/lib/apis-academy";
import {
  isAuthAcademyModule,
  mergeAuthAcademyLessons,
} from "@/features/curriculum/lib/auth-academy";
import {
  isSqlAcademyModule,
  mergeSqlAcademyLessons,
} from "@/features/curriculum/lib/sql-academy";
import {
  isModelingAcademyModule,
  mergeModelingAcademyLessons,
} from "@/features/curriculum/lib/modeling-academy";
import {
  isDeploymentAcademyModule,
  mergeDeploymentAcademyLessons,
} from "@/features/curriculum/lib/deployment-academy";
import {
  isCicdAcademyModule,
  mergeCicdAcademyLessons,
} from "@/features/curriculum/lib/cicd-academy";
import {
  isLlmAcademyModule,
  mergeLlmAcademyLessons,
} from "@/features/curriculum/lib/llm-academy";
import {
  isAiFeaturesAcademyModule,
  mergeAiFeaturesAcademyLessons,
} from "@/features/curriculum/lib/ai-features-academy";
import {
  isCapstoneAcademyModule,
  mergeCapstoneAcademyLessons,
} from "@/features/curriculum/lib/capstone-academy";
import {
  isShipAcademyModule,
  mergeShipAcademyLessons,
} from "@/features/curriculum/lib/ship-academy";
import {
  isInterviewAcademyModule,
  mergeInterviewAcademyLessons,
} from "@/features/curriculum/lib/interview-academy";
import {
  isSystemsAcademyModule,
  mergeSystemsAcademyLessons,
} from "@/features/curriculum/lib/systems-academy";
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
        const mergedLessons = isProgrammingFundamentalsModule(module.slug)
          ? mergeProgrammingFundamentalsLessons(moduleLessons, completedIds)
          : isDeveloperToolingModule(module.slug)
            ? mergeDeveloperToolingLessons(moduleLessons, completedIds)
            : isHtmlAcademyModule(module.slug)
              ? mergeHtmlAcademyLessons(moduleLessons, completedIds)
              : isCssAcademyModule(module.slug)
                ? mergeCssAcademyLessons(moduleLessons, completedIds)
                : isJsAcademyModule(module.slug)
                  ? mergeJsAcademyLessons(moduleLessons, completedIds)
                  : isReactAcademyModule(module.slug)
                    ? mergeReactAcademyLessons(moduleLessons, completedIds)
                    : isNextjsAcademyModule(module.slug)
                      ? mergeNextjsAcademyLessons(moduleLessons, completedIds)
                      : isTypescriptAcademyModule(module.slug)
                        ? mergeTypescriptAcademyLessons(
                            moduleLessons,
                            completedIds
                          )
                        : isApisAcademyModule(module.slug)
                          ? mergeApisAcademyLessons(
                              moduleLessons,
                              completedIds
                            )
                          : isAuthAcademyModule(module.slug)
                            ? mergeAuthAcademyLessons(
                                moduleLessons,
                                completedIds
                              )
                            : isSqlAcademyModule(module.slug)
                              ? mergeSqlAcademyLessons(
                                  moduleLessons,
                                  completedIds
                                )
                              : isModelingAcademyModule(module.slug)
                                ? mergeModelingAcademyLessons(
                                    moduleLessons,
                                    completedIds
                                  )
                                : isDeploymentAcademyModule(module.slug)
                                  ? mergeDeploymentAcademyLessons(
                                      moduleLessons,
                                      completedIds
                                    )
                                  : isCicdAcademyModule(module.slug)
                                    ? mergeCicdAcademyLessons(
                                        moduleLessons,
                                        completedIds
                                      )
                                    : isLlmAcademyModule(module.slug)
                                      ? mergeLlmAcademyLessons(
                                          moduleLessons,
                                          completedIds
                                        )
                                      : isAiFeaturesAcademyModule(module.slug)
                                        ? mergeAiFeaturesAcademyLessons(
                                            moduleLessons,
                                            completedIds
                                          )
                                        : isCapstoneAcademyModule(module.slug)
                                          ? mergeCapstoneAcademyLessons(
                                              moduleLessons,
                                              completedIds
                                            )
                                          : isShipAcademyModule(module.slug)
                                            ? mergeShipAcademyLessons(
                                                moduleLessons,
                                                completedIds
                                              )
                                            : isInterviewAcademyModule(
                                                  module.slug
                                                )
                                              ? mergeInterviewAcademyLessons(
                                                  moduleLessons,
                                                  completedIds
                                                )
                                              : isSystemsAcademyModule(
                                                    module.slug
                                                  )
                                                ? mergeSystemsAcademyLessons(
                                                    moduleLessons,
                                                    completedIds
                                                  )
                                                : moduleLessons;
        const completedCount = mergedLessons.filter((l) => l.isCompleted).length;
        return {
          ...module,
          lessons: mergedLessons,
          completedCount,
          totalCount: mergedLessons.length,
          progressPercent: percent(completedCount, mergedLessons.length),
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
    const completedSet = new Set(completedIds);
    const summaries = lessons.map((l) => toLessonSummary(l, completedIds));
    const merged = isProgrammingFundamentalsModule(slug)
      ? mergeProgrammingFundamentalsLessons(summaries, completedSet)
      : isDeveloperToolingModule(slug)
        ? mergeDeveloperToolingLessons(summaries, completedSet)
        : isHtmlAcademyModule(slug)
          ? mergeHtmlAcademyLessons(summaries, completedSet)
          : isCssAcademyModule(slug)
            ? mergeCssAcademyLessons(summaries, completedSet)
            : isJsAcademyModule(slug)
              ? mergeJsAcademyLessons(summaries, completedSet)
              : isReactAcademyModule(slug)
                ? mergeReactAcademyLessons(summaries, completedSet)
                : isNextjsAcademyModule(slug)
                  ? mergeNextjsAcademyLessons(summaries, completedSet)
                  : isTypescriptAcademyModule(slug)
                    ? mergeTypescriptAcademyLessons(summaries, completedSet)
                    : isApisAcademyModule(slug)
                      ? mergeApisAcademyLessons(summaries, completedSet)
                      : isAuthAcademyModule(slug)
                        ? mergeAuthAcademyLessons(summaries, completedSet)
                        : isSqlAcademyModule(slug)
                          ? mergeSqlAcademyLessons(summaries, completedSet)
                          : isModelingAcademyModule(slug)
                            ? mergeModelingAcademyLessons(
                                summaries,
                                completedSet
                              )
                            : isDeploymentAcademyModule(slug)
                              ? mergeDeploymentAcademyLessons(
                                  summaries,
                                  completedSet
                                )
                              : isCicdAcademyModule(slug)
                                ? mergeCicdAcademyLessons(
                                    summaries,
                                    completedSet
                                  )
                                : isLlmAcademyModule(slug)
                                  ? mergeLlmAcademyLessons(
                                      summaries,
                                      completedSet
                                    )
                                  : isAiFeaturesAcademyModule(slug)
                                    ? mergeAiFeaturesAcademyLessons(
                                        summaries,
                                        completedSet
                                      )
                                    : isCapstoneAcademyModule(slug)
                                      ? mergeCapstoneAcademyLessons(
                                          summaries,
                                          completedSet
                                        )
                                      : isShipAcademyModule(slug)
                                        ? mergeShipAcademyLessons(
                                            summaries,
                                            completedSet
                                          )
                                        : isInterviewAcademyModule(slug)
                                          ? mergeInterviewAcademyLessons(
                                              summaries,
                                              completedSet
                                            )
                                          : isSystemsAcademyModule(slug)
                                            ? mergeSystemsAcademyLessons(
                                                summaries,
                                                completedSet
                                              )
                                            : summaries;
    const completedCount = merged.filter((l) => l.isCompleted).length;

    return {
      module,
      phase,
      course,
      lessons: merged,
      completedCount,
      totalCount: merged.length,
      progressPercent: percent(completedCount, merged.length),
      totalDurationMinutes: merged.reduce((s, l) => s + l.durationMinutes, 0),
    };
  }

  async getLessonBySlug(
    profileId: string,
    slug: string
  ): Promise<LessonDetail | null> {
    const lesson = await this.lessons.findBySlug(slug);

    if (!lesson) {
      const pfTopic = PROGRAMMING_FUNDAMENTALS_TOPICS.find((t) => t.slug === slug);
      if (!pfTopic) return null;

      const module = await this.modules.findBySlug("programming-fundamentals");
      if (!module) return null;

      const phase = await this.phases.findById(module.phase_id);
      if (!phase) return null;
      const course = await this.courses.findById(phase.course_id);
      if (!course) return null;

      const siblings = await this.lessons.listByModuleIds([module.id]);
      const completedIds = await this.progress.listCompletedLessonIds(profileId);
      const merged = mergeProgrammingFundamentalsLessons(
        siblings.map((l) => toLessonSummary(l, completedIds)),
        new Set(completedIds)
      );
      const index = merged.findIndex((l) => l.slug === slug);
      const virtual = merged[index];
      if (!virtual) return null;

      return {
        lesson: {
          id: virtual.id,
          module_id: module.id,
          title: virtual.title,
          slug: virtual.slug,
          description: virtual.description,
          content: programmingFundamentalsLessonContent(slug),
          duration_minutes: virtual.durationMinutes,
          difficulty: virtual.difficulty,
          video_url: null,
          is_preview: virtual.isPreview,
          sort_order: virtual.sortOrder,
          learning_objectives: [],
          created_at: module.created_at,
        },
        resources: [],
        module,
        phase,
        course,
        isCompleted: virtual.isCompleted,
        previousLessonSlug: index > 0 ? merged[index - 1]!.slug : null,
        nextLessonSlug:
          index >= 0 && index < merged.length - 1
            ? merged[index + 1]!.slug
            : null,
      };
    }

    const module = await this.modules.findById(lesson.module_id);
    if (!module) return null;

    const phase = await this.phases.findById(module.phase_id);
    if (!phase) return null;

    const course = await this.courses.findById(phase.course_id);
    if (!course) return null;

    const resources = await this.resources.listByLessonId(lesson.id);
    const siblings = await this.lessons.listByModuleIds([module.id]);
    const orderedRows = [...siblings].sort((a, b) => a.sort_order - b.sort_order);
    const completedIds = await this.progress.listCompletedLessonIds(profileId);
    const merged = isProgrammingFundamentalsModule(module.slug)
      ? mergeProgrammingFundamentalsLessons(
          orderedRows.map((l) => toLessonSummary(l, completedIds)),
          new Set(completedIds)
        )
      : isDeveloperToolingModule(module.slug)
        ? mergeDeveloperToolingLessons(
            orderedRows.map((l) => toLessonSummary(l, completedIds)),
            new Set(completedIds)
          )
        : isHtmlAcademyModule(module.slug)
          ? mergeHtmlAcademyLessons(
              orderedRows.map((l) => toLessonSummary(l, completedIds)),
              new Set(completedIds)
            )
          : isCssAcademyModule(module.slug)
            ? mergeCssAcademyLessons(
                orderedRows.map((l) => toLessonSummary(l, completedIds)),
                new Set(completedIds)
              )
            : isJsAcademyModule(module.slug)
              ? mergeJsAcademyLessons(
                  orderedRows.map((l) => toLessonSummary(l, completedIds)),
                  new Set(completedIds)
                )
              : isReactAcademyModule(module.slug)
                ? mergeReactAcademyLessons(
                    orderedRows.map((l) => toLessonSummary(l, completedIds)),
                    new Set(completedIds)
                  )
                : isNextjsAcademyModule(module.slug)
                  ? mergeNextjsAcademyLessons(
                      orderedRows.map((l) => toLessonSummary(l, completedIds)),
                      new Set(completedIds)
                    )
                  : isTypescriptAcademyModule(module.slug)
                    ? mergeTypescriptAcademyLessons(
                        orderedRows.map((l) =>
                          toLessonSummary(l, completedIds)
                        ),
                        new Set(completedIds)
                      )
                    : isApisAcademyModule(module.slug)
                      ? mergeApisAcademyLessons(
                          orderedRows.map((l) =>
                            toLessonSummary(l, completedIds)
                          ),
                          new Set(completedIds)
                        )
                      : isAuthAcademyModule(module.slug)
                        ? mergeAuthAcademyLessons(
                            orderedRows.map((l) =>
                              toLessonSummary(l, completedIds)
                            ),
                            new Set(completedIds)
                          )
                        : isSqlAcademyModule(module.slug)
                          ? mergeSqlAcademyLessons(
                              orderedRows.map((l) =>
                                toLessonSummary(l, completedIds)
                              ),
                              new Set(completedIds)
                            )
                          : isModelingAcademyModule(module.slug)
                            ? mergeModelingAcademyLessons(
                                orderedRows.map((l) =>
                                  toLessonSummary(l, completedIds)
                                ),
                                new Set(completedIds)
                              )
                            : isDeploymentAcademyModule(module.slug)
                              ? mergeDeploymentAcademyLessons(
                                  orderedRows.map((l) =>
                                    toLessonSummary(l, completedIds)
                                  ),
                                  new Set(completedIds)
                                )
                              : isCicdAcademyModule(module.slug)
                                ? mergeCicdAcademyLessons(
                                    orderedRows.map((l) =>
                                      toLessonSummary(l, completedIds)
                                    ),
                                    new Set(completedIds)
                                  )
                                : isLlmAcademyModule(module.slug)
                                  ? mergeLlmAcademyLessons(
                                      orderedRows.map((l) =>
                                        toLessonSummary(l, completedIds)
                                      ),
                                      new Set(completedIds)
                                    )
                                  : isAiFeaturesAcademyModule(module.slug)
                                    ? mergeAiFeaturesAcademyLessons(
                                        orderedRows.map((l) =>
                                          toLessonSummary(l, completedIds)
                                        ),
                                        new Set(completedIds)
                                      )
                                    : isCapstoneAcademyModule(module.slug)
                                      ? mergeCapstoneAcademyLessons(
                                          orderedRows.map((l) =>
                                            toLessonSummary(l, completedIds)
                                          ),
                                          new Set(completedIds)
                                        )
                                      : isShipAcademyModule(module.slug)
                                        ? mergeShipAcademyLessons(
                                            orderedRows.map((l) =>
                                              toLessonSummary(l, completedIds)
                                            ),
                                            new Set(completedIds)
                                          )
                                        : isInterviewAcademyModule(module.slug)
                                          ? mergeInterviewAcademyLessons(
                                              orderedRows.map((l) =>
                                                toLessonSummary(l, completedIds)
                                              ),
                                              new Set(completedIds)
                                            )
                                          : isSystemsAcademyModule(module.slug)
                                            ? mergeSystemsAcademyLessons(
                                                orderedRows.map((l) =>
                                                  toLessonSummary(
                                                    l,
                                                    completedIds
                                                  )
                                                ),
                                                new Set(completedIds)
                                              )
                                            : orderedRows.map((l) =>
                                                toLessonSummary(l, completedIds)
                                              );
    const index = merged.findIndex((l) => l.slug === lesson.slug);

    return {
      lesson,
      resources,
      module,
      phase,
      course,
      isCompleted: completedIds.has(lesson.id),
      previousLessonSlug: index > 0 ? merged[index - 1]!.slug : null,
      nextLessonSlug:
        index >= 0 && index < merged.length - 1
          ? merged[index + 1]!.slug
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
