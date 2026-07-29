"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { LearnHeader } from "@/components/learn/learn-header";
import { LessonPanel } from "@/components/learn/lesson-panel";
import {
  prefetchWorkspaceLesson,
  setLessonQueryData,
  useWorkspaceLesson,
} from "@/features/learn/hooks/use-workspace-lesson";
import { learnQueryKeys } from "@/features/learn/lib/query-keys";
import {
  applyLessonCompletion,
  buildWorkspaceTree,
  resolveInitialLessonSlug,
  type WorkspaceLessonNode,
  type WorkspaceLessonPayload,
  type WorkspaceTree,
} from "@/features/learn/lib/workspace-tree";
import type { CourseJourney } from "@/features/curriculum/types";
import { CURRICULUM_ROUTES } from "@/features/curriculum/types";

type LearningWorkspaceProps = {
  courseSlug: string;
  journey: CourseJourney;
  initialLessonSlug?: string | null;
  initialPayload?: WorkspaceLessonPayload | null;
};

export function LearningWorkspace({
  courseSlug,
  journey,
  initialLessonSlug,
  initialPayload = null,
}: LearningWorkspaceProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [tree, setTree] = useState<WorkspaceTree>(() =>
    buildWorkspaceTree(journey, initialLessonSlug)
  );
  const [activeLessonSlug, setActiveLessonSlug] = useState<string | null>(() =>
    resolveInitialLessonSlug(
      buildWorkspaceTree(journey, initialLessonSlug),
      initialLessonSlug
    )
  );

  const lessonQuery = useWorkspaceLesson(
    courseSlug,
    activeLessonSlug,
    activeLessonSlug &&
      initialPayload?.detail.lesson.slug === activeLessonSlug
      ? initialPayload
      : null
  );

  const activeNode = useMemo(
    () => tree.flatLessons.find((l) => l.slug === activeLessonSlug) ?? null,
    [tree, activeLessonSlug]
  );

  const activeModule = useMemo(() => {
    if (!activeNode) return null;
    const phase = tree.phases.find((p) => p.id === activeNode.phaseId);
    return phase?.modules.find((m) => m.id === activeNode.moduleId) ?? null;
  }, [tree, activeNode]);

  /** Prev/next stay inside the current module only. */
  const neighbors = useMemo(() => {
    if (!activeNode || !activeModule) {
      return { previous: null, next: null, siblings: [] as string[] };
    }
    const moduleLessons = activeModule.lessons.filter(
      (l) => l.status !== "locked"
    );
    const idx = moduleLessons.findIndex((l) => l.slug === activeLessonSlug);
    if (idx < 0) {
      return { previous: null, next: null, siblings: [] as string[] };
    }
    return {
      previous: moduleLessons[idx - 1]?.slug ?? null,
      next: moduleLessons[idx + 1]?.slug ?? null,
      siblings: moduleLessons
        .filter((l) => l.slug !== activeLessonSlug)
        .map((l) => l.slug),
    };
  }, [activeLessonSlug, activeModule, activeNode]);

  useEffect(() => {
    const targets = [
      neighbors.previous,
      neighbors.next,
      ...neighbors.siblings.slice(0, 4),
    ];
    for (const slug of targets) {
      prefetchWorkspaceLesson(queryClient, courseSlug, slug);
    }
  }, [courseSlug, neighbors, queryClient]);

  useEffect(() => {
    if (!initialPayload || !initialLessonSlug) return;
    queryClient.setQueryData(
      learnQueryKeys.lesson(courseSlug, initialLessonSlug),
      initialPayload
    );
  }, [courseSlug, initialLessonSlug, initialPayload, queryClient]);

  const selectLesson = useCallback(
    (lesson: WorkspaceLessonNode | string) => {
      const slug = typeof lesson === "string" ? lesson : lesson.slug;
      const node =
        typeof lesson === "string"
          ? tree.flatLessons.find((l) => l.slug === slug)
          : lesson;

      if (!node) return;
      if (slug === activeLessonSlug) return;

      setActiveLessonSlug(slug);
      setTree((prev) => buildWorkspaceTree(toJourney(prev), slug));
      router.replace(
        CURRICULUM_ROUTES.moduleTopic(node.moduleSlug, slug),
        { scroll: false }
      );
    },
    [activeLessonSlug, router, tree.flatLessons]
  );

  useEffect(() => {
    if (lessonQuery.isError) {
      toast.error(
        lessonQuery.error instanceof Error
          ? lessonQuery.error.message
          : "Failed to load lesson."
      );
    }
  }, [lessonQuery.isError, lessonQuery.error]);

  const payload = useMemo(() => {
    if (!lessonQuery.data) return null;
    return {
      ...lessonQuery.data,
      detail: {
        ...lessonQuery.data.detail,
        isCompleted:
          tree.flatLessons.find(
            (l) => l.id === lessonQuery.data.detail.lesson.id
          )?.isCompleted ?? lessonQuery.data.detail.isCompleted,
      },
    };
  }, [lessonQuery.data, tree.flatLessons]);

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-zinc-950 font-sans text-zinc-100 antialiased">
      <LearnHeader
        courseTitle={tree.course.title}
        phaseTitle={activeNode?.phaseTitle}
        moduleTitle={activeNode?.moduleTitle}
        moduleSlug={activeNode?.moduleSlug}
        moduleProgress={activeModule?.progressPercent ?? null}
      />

      <main className="relative min-h-0 flex-1 overflow-y-auto">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_color-mix(in_srgb,var(--color-primary)_6%,transparent),_transparent_50%)]"
        />
        <div className="relative">
          <LessonPanel
            payload={payload}
            loading={lessonQuery.isFetching && !payload}
            previousSlug={neighbors.previous}
            nextSlug={neighbors.next}
            onNavigate={selectLesson}
            onCompletedChange={(lessonId, completed) => {
              setTree((prev) =>
                applyLessonCompletion(
                  prev,
                  lessonId,
                  completed,
                  activeLessonSlug
                )
              );
              if (activeLessonSlug && lessonQuery.data) {
                setLessonQueryData(
                  queryClient,
                  courseSlug,
                  activeLessonSlug,
                  (prev) => {
                    const base = prev ?? lessonQuery.data!;
                    return {
                      ...base,
                      detail: { ...base.detail, isCompleted: completed },
                    };
                  }
                );
              }
            }}
          />
        </div>
      </main>
    </div>
  );
}

function toJourney(tree: WorkspaceTree): CourseJourney {
  return {
    course: tree.course,
    completedCount: tree.completedCount,
    totalCount: tree.totalCount,
    progressPercent: tree.progressPercent,
    phases: tree.phases.map((phase) => ({
      ...phase,
      modules: phase.modules.map((module) => ({
        ...module,
        lessons: module.lessons.map((lesson) => ({
          id: lesson.id,
          title: lesson.title,
          slug: lesson.slug,
          description: lesson.description,
          durationMinutes: lesson.durationMinutes,
          difficulty: lesson.difficulty,
          sortOrder: lesson.sortOrder,
          isPreview: lesson.isPreview,
          isCompleted: lesson.isCompleted,
        })),
      })),
    })),
  };
}
