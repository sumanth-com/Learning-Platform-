import type {
  CourseJourney,
  LessonDetail,
  LessonSummary,
  ModuleSummary,
  PhaseWithModules,
} from "@/features/curriculum/types";
import type { AssignmentSummary } from "@/features/assignments/types";

export type WorkspaceLessonStatus = "locked" | "available" | "current" | "completed";

export type WorkspaceLessonNode = LessonSummary & {
  phaseId: string;
  phaseTitle: string;
  moduleId: string;
  moduleTitle: string;
  moduleSlug: string;
  status: WorkspaceLessonStatus;
  globalIndex: number;
};

export type WorkspaceModuleNode = Omit<ModuleSummary, "lessons"> & {
  lessons: WorkspaceLessonNode[];
};

export type WorkspacePhaseNode = Omit<PhaseWithModules, "modules"> & {
  modules: WorkspaceModuleNode[];
  progressPercent: number;
};

export type WorkspaceTree = {
  course: CourseJourney["course"];
  phases: WorkspacePhaseNode[];
  flatLessons: WorkspaceLessonNode[];
  completedCount: number;
  totalCount: number;
  progressPercent: number;
};

export type WorkspaceLessonPayload = {
  detail: LessonDetail;
  objectives: string[];
  assignments: AssignmentSummary[];
  isMentor: boolean;
};

/**
 * Sequential unlock: first lesson + preview lessons are open;
 * otherwise all prior lessons in course order must be completed.
 */
export function buildWorkspaceTree(
  journey: CourseJourney,
  currentLessonSlug?: string | null
): WorkspaceTree {
  const flat: Array<{
    lesson: LessonSummary;
    phase: PhaseWithModules;
    module: ModuleSummary;
  }> = [];

  for (const phase of journey.phases) {
    for (const module of phase.modules) {
      for (const lesson of module.lessons) {
        flat.push({ lesson, phase, module });
      }
    }
  }

  const nodes: WorkspaceLessonNode[] = flat.map((item, index) => {
    let status: WorkspaceLessonStatus = "available";
    if (item.lesson.isCompleted) status = "completed";
    else if (currentLessonSlug && item.lesson.slug === currentLessonSlug) {
      status = "current";
    }

    return {
      ...item.lesson,
      phaseId: item.phase.id,
      phaseTitle: item.phase.title,
      moduleId: item.module.id,
      moduleTitle: item.module.title,
      moduleSlug: item.module.slug,
      status,
      globalIndex: index,
    };
  });

  // If no current slug, mark first incomplete unlocked lesson as current for display
  if (!currentLessonSlug) {
    const next = nodes.find(
      (n) => n.status === "available" || n.status === "completed"
    );
    if (next && next.status === "available") next.status = "current";
  }

  const byModule = new Map<string, WorkspaceLessonNode[]>();
  for (const node of nodes) {
    const list = byModule.get(node.moduleId) ?? [];
    list.push(node);
    byModule.set(node.moduleId, list);
  }

  const phases: WorkspacePhaseNode[] = journey.phases.map((phase) => {
    const modules: WorkspaceModuleNode[] = phase.modules.map((module) => ({
      ...module,
      lessons: byModule.get(module.id) ?? [],
    }));
    const completedCount = modules.reduce((s, m) => s + m.completedCount, 0);
    const totalCount = modules.reduce((s, m) => s + m.totalCount, 0);
    return {
      ...phase,
      modules,
      completedCount,
      totalCount,
      progressPercent:
        totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100),
    };
  });

  return {
    course: journey.course,
    phases,
    flatLessons: nodes,
    completedCount: journey.completedCount,
    totalCount: journey.totalCount,
    progressPercent: journey.progressPercent,
  };
}

export function resolveInitialLessonSlug(
  tree: WorkspaceTree,
  requested?: string | null
): string | null {
  if (requested) {
    const match = tree.flatLessons.find((l) => l.slug === requested);
    if (match && match.status !== "locked") return match.slug;
  }

  const incomplete = tree.flatLessons.find(
    (l) => l.status === "current" || l.status === "available"
  );
  if (incomplete) return incomplete.slug;

  return tree.flatLessons[0]?.slug ?? null;
}

export function applyLessonCompletion(
  tree: WorkspaceTree,
  lessonId: string,
  completed: boolean,
  currentLessonSlug: string | null
): WorkspaceTree {
  const journeyLike: CourseJourney = {
    course: tree.course,
    completedCount: 0,
    totalCount: tree.totalCount,
    progressPercent: 0,
    phases: tree.phases.map((phase) => ({
      ...phase,
      modules: phase.modules.map((module) => {
        const lessons = module.lessons.map((lesson) =>
          lesson.id === lessonId ? { ...lesson, isCompleted: completed } : lesson
        );
        const completedCount = lessons.filter((l) => l.isCompleted).length;
        return {
          ...module,
          lessons,
          completedCount,
          totalCount: lessons.length,
          progressPercent:
            lessons.length === 0
              ? 0
              : Math.round((completedCount / lessons.length) * 100),
        };
      }),
    })),
  };

  for (const phase of journeyLike.phases) {
    phase.completedCount = phase.modules.reduce(
      (s, m) => s + m.completedCount,
      0
    );
    phase.totalCount = phase.modules.reduce((s, m) => s + m.totalCount, 0);
  }

  journeyLike.completedCount = journeyLike.phases.reduce(
    (s, p) => s + p.completedCount,
    0
  );
  journeyLike.progressPercent =
    journeyLike.totalCount === 0
      ? 0
      : Math.round(
          (journeyLike.completedCount / journeyLike.totalCount) * 100
        );

  return buildWorkspaceTree(journeyLike, currentLessonSlug);
}
