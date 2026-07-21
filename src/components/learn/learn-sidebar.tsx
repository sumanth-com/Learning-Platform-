"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  ChevronDown,
  Circle,
  Lock,
  PlayCircle,
} from "lucide-react";
import { ProgressRow } from "@/components/learn/progress-row";
import { cn } from "@/lib/utils";
import type {
  WorkspaceLessonNode,
  WorkspaceTree,
} from "@/features/learn/lib/workspace-tree";

type LearnSidebarProps = {
  tree: WorkspaceTree;
  activeLessonSlug: string | null;
  expandedPhases: Set<string>;
  expandedModules: Set<string>;
  onTogglePhase: (phaseId: string) => void;
  onToggleModule: (moduleId: string) => void;
  onSelectLesson: (lesson: WorkspaceLessonNode) => void;
  className?: string;
};

export function LearnSidebar({
  tree,
  activeLessonSlug,
  expandedPhases,
  expandedModules,
  onTogglePhase,
  onToggleModule,
  onSelectLesson,
  className,
}: LearnSidebarProps) {
  const activeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({
      block: "nearest",
      behavior: "smooth",
    });
  }, [activeLessonSlug]);

  return (
    <aside
      className={cn(
        "flex h-full w-[300px] shrink-0 flex-col border-r border-zinc-800/90 bg-zinc-950",
        className
      )}
    >
      <div className="border-b border-zinc-800/90 px-3 py-4">
        <p className="px-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
          Learning path
        </p>
        <h2 className="mt-1.5 truncate px-1 text-[15px] font-semibold leading-snug tracking-tight text-zinc-50">
          {tree.course.title}
        </h2>
        <div className="mt-3 px-1">
          <ProgressRow
            label="Course progress"
            value={tree.progressPercent}
            meta={`${tree.completedCount}/${tree.totalCount}`}
          />
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3">
        <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-600">
          Course · Phase · Module · Lessons
        </p>
        <ul className="space-y-1">
          {tree.phases.map((phase) => {
            const phaseOpen = expandedPhases.has(phase.id);
            return (
              <li key={phase.id}>
                <button
                  type="button"
                  onClick={() => onTogglePhase(phase.id)}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left transition hover:bg-zinc-900"
                >
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 shrink-0 text-zinc-500 transition-transform",
                      !phaseOpen && "-rotate-90"
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-zinc-200">
                      {phase.title}
                    </p>
                    <p className="text-[11px] tabular-nums text-zinc-500">
                      {phase.completedCount}/{phase.totalCount} ·{" "}
                      {phase.progressPercent}%
                    </p>
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {phaseOpen ? (
                    <motion.div
                      key="phase-body"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="mb-2 ml-2 space-y-1 border-l border-zinc-800 pl-2">
                        {phase.modules.map((module) => {
                          const moduleOpen = expandedModules.has(module.id);
                          return (
                            <div key={module.id}>
                              <button
                                type="button"
                                onClick={() => onToggleModule(module.id)}
                                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left transition hover:bg-zinc-900/80"
                              >
                                <ChevronDown
                                  className={cn(
                                    "h-3.5 w-3.5 shrink-0 text-zinc-600 transition-transform",
                                    !moduleOpen && "-rotate-90"
                                  )}
                                />
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-xs font-medium text-zinc-300">
                                    {module.title}
                                  </p>
                                  <p className="text-[10px] text-zinc-600">
                                    {module.completedCount}/{module.totalCount}
                                  </p>
                                </div>
                              </button>

                              <AnimatePresence initial={false}>
                                {moduleOpen ? (
                                  <motion.ul
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.18 }}
                                    className="mb-1 ml-3 space-y-0.5 overflow-hidden border-l border-zinc-800/80 pl-2"
                                  >
                                    {module.lessons.map((lesson) => {
                                      const active =
                                        lesson.slug === activeLessonSlug;
                                      return (
                                        <li key={lesson.id}>
                                          <button
                                            type="button"
                                            ref={
                                              active ? activeRef : undefined
                                            }
                                            onClick={() =>
                                              onSelectLesson(lesson)
                                            }
                                            className={cn(
                                              "flex w-full items-start gap-2 rounded-md px-2 py-1.5 text-left text-xs transition",
                                              active
                                                ? "bg-indigo-500/15 text-indigo-100 ring-1 ring-indigo-500/30"
                                                : lesson.status === "locked"
                                                  ? "cursor-not-allowed text-zinc-600"
                                                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                                            )}
                                          >
                                            <LessonStatusIcon
                                              status={
                                                active
                                                  ? "current"
                                                  : lesson.status
                                              }
                                            />
                                            <span className="min-w-0 flex-1 leading-snug">
                                              <span className="block truncate">
                                                {lesson.title}
                                              </span>
                                              <span className="mt-0.5 block text-[10px] text-zinc-600">
                                                {lesson.durationMinutes} min
                                              </span>
                                            </span>
                                          </button>
                                        </li>
                                      );
                                    })}
                                  </motion.ul>
                                ) : null}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

function LessonStatusIcon({
  status,
}: {
  status: WorkspaceLessonNode["status"];
}) {
  if (status === "completed") {
    return <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />;
  }
  if (status === "current") {
    return <PlayCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-indigo-300" />;
  }
  if (status === "locked") {
    return <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-600" />;
  }
  return <Circle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-500" />;
}
