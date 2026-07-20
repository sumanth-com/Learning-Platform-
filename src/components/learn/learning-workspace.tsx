"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { LearnHeader } from "@/components/learn/learn-header";
import { LearnSidebar } from "@/components/learn/learn-sidebar";
import { LearnMobileDrawer } from "@/components/learn/learn-mobile-drawer";
import { LessonPanel } from "@/components/learn/lesson-panel";
import { loadWorkspaceLessonAction } from "@/features/learn/actions/workspace-actions";
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
  const [tree, setTree] = useState<WorkspaceTree>(() =>
    buildWorkspaceTree(journey, initialLessonSlug)
  );
  const [activeLessonSlug, setActiveLessonSlug] = useState<string | null>(() =>
    resolveInitialLessonSlug(
      buildWorkspaceTree(journey, initialLessonSlug),
      initialLessonSlug
    )
  );
  const [payload, setPayload] = useState<WorkspaceLessonPayload | null>(
    initialPayload
  );
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(() =>
    initialExpandedPhases(tree, activeLessonSlug)
  );
  const [expandedModules, setExpandedModules] = useState<Set<string>>(() =>
    initialExpandedModules(tree, activeLessonSlug)
  );
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loadingLesson, startLessonTransition] = useTransition();

  const activeNode = useMemo(
    () =>
      tree.flatLessons.find((l) => l.slug === activeLessonSlug) ?? null,
    [tree, activeLessonSlug]
  );

  const activePhase = useMemo(() => {
    if (!activeNode) return null;
    return tree.phases.find((p) => p.id === activeNode.phaseId) ?? null;
  }, [tree, activeNode]);

  const activeModule = useMemo(() => {
    if (!activeNode || !activePhase) return null;
    return (
      activePhase.modules.find((m) => m.id === activeNode.moduleId) ?? null
    );
  }, [activePhase, activeNode]);

  const neighbors = useMemo(() => {
    if (!activeLessonSlug) return { previous: null, next: null };
    const idx = tree.flatLessons.findIndex((l) => l.slug === activeLessonSlug);
    if (idx < 0) return { previous: null, next: null };
    const previous = tree.flatLessons
      .slice(0, idx)
      .reverse()
      .find((l) => l.status !== "locked");
    const next = tree.flatLessons
      .slice(idx + 1)
      .find((l) => l.status !== "locked");
    return {
      previous: previous?.slug ?? null,
      next: next?.slug ?? null,
    };
  }, [tree, activeLessonSlug]);

  const selectLesson = useCallback(
    (lesson: WorkspaceLessonNode | string) => {
      const slug = typeof lesson === "string" ? lesson : lesson.slug;
      const node =
        typeof lesson === "string"
          ? tree.flatLessons.find((l) => l.slug === slug)
          : lesson;

      if (!node) return;
      if (node.status === "locked") {
        toast.error("Complete previous lessons to unlock this one.");
        return;
      }

      setActiveLessonSlug(slug);
      setTree((prev) => buildWorkspaceTree(toJourney(prev), slug));
      setExpandedPhases((prev) => new Set(prev).add(node.phaseId));
      setExpandedModules((prev) => new Set(prev).add(node.moduleId));

      router.replace(CURRICULUM_ROUTES.learnLesson(courseSlug, slug), {
        scroll: false,
      });

      startLessonTransition(async () => {
        const result = await loadWorkspaceLessonAction(courseSlug, slug);
        if (!result.success) {
          toast.error(result.error);
          return;
        }
        setPayload(result.data);
      });
    },
    [courseSlug, router, tree.flatLessons]
  );

  // Keep payload in sync when server sends a fresh initial payload
  useEffect(() => {
    if (initialPayload) setPayload(initialPayload);
  }, [initialPayload]);

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-zinc-950 text-zinc-100">
      <AnimatePresence initial={false}>
        {desktopSidebarOpen ? (
          <motion.div
            key="desktop-sidebar"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 300, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="hidden h-full shrink-0 overflow-hidden lg:block"
          >
            <LearnSidebar
              tree={tree}
              activeLessonSlug={activeLessonSlug}
              expandedPhases={expandedPhases}
              expandedModules={expandedModules}
              onTogglePhase={(id) =>
                setExpandedPhases((prev) => toggleSet(prev, id))
              }
              onToggleModule={(id) =>
                setExpandedModules((prev) => toggleSet(prev, id))
              }
              onSelectLesson={selectLesson}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <LearnMobileDrawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        tree={tree}
        activeLessonSlug={activeLessonSlug}
        expandedPhases={expandedPhases}
        expandedModules={expandedModules}
        onTogglePhase={(id) =>
          setExpandedPhases((prev) => toggleSet(prev, id))
        }
        onToggleModule={(id) =>
          setExpandedModules((prev) => toggleSet(prev, id))
        }
        onSelectLesson={selectLesson}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <LearnHeader
          tree={tree}
          phaseTitle={activeNode?.phaseTitle}
          moduleTitle={activeNode?.moduleTitle}
          lessonProgress={activeModule?.progressPercent ?? null}
          desktopSidebarOpen={desktopSidebarOpen}
          onToggleDesktopSidebar={() => setDesktopSidebarOpen((v) => !v)}
          onOpenMobileDrawer={() => setMobileOpen(true)}
        />

        <main className="relative min-h-0 flex-1 overflow-y-auto">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(99,102,241,0.08),_transparent_50%)]"
          />
          <div className="relative">
            <LessonPanel
              payload={
                payload
                  ? {
                      ...payload,
                      detail: {
                        ...payload.detail,
                        isCompleted:
                          tree.flatLessons.find(
                            (l) => l.id === payload.detail.lesson.id
                          )?.isCompleted ?? payload.detail.isCompleted,
                      },
                    }
                  : null
              }
              loading={loadingLesson}
              phaseProgress={activePhase?.progressPercent ?? 0}
              moduleProgress={activeModule?.progressPercent ?? 0}
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
                setPayload((prev) =>
                  prev
                    ? {
                        ...prev,
                        detail: { ...prev.detail, isCompleted: completed },
                      }
                    : prev
                );
              }}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

function toggleSet(set: Set<string>, id: string) {
  const next = new Set(set);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  return next;
}

function initialExpandedPhases(
  tree: WorkspaceTree,
  activeSlug: string | null
): Set<string> {
  const ids = new Set<string>();
  if (tree.phases[0]) ids.add(tree.phases[0].id);
  const active = tree.flatLessons.find((l) => l.slug === activeSlug);
  if (active) ids.add(active.phaseId);
  return ids;
}

function initialExpandedModules(
  tree: WorkspaceTree,
  activeSlug: string | null
): Set<string> {
  const ids = new Set<string>();
  const firstModule = tree.phases[0]?.modules[0];
  if (firstModule) ids.add(firstModule.id);
  const active = tree.flatLessons.find((l) => l.slug === activeSlug);
  if (active) ids.add(active.moduleId);
  return ids;
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
