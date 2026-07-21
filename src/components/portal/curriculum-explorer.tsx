"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  ChevronDown,
  Circle,
  Clock,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { CURRICULUM_ROUTES } from "@/features/curriculum/types";
import type { CourseJourney } from "@/features/curriculum/types";

type CurriculumExplorerProps = {
  journey: CourseJourney;
  /** Page layout for Journey; sidebar is compact (kept for reuse). */
  variant?: "page" | "sidebar";
};

export function CurriculumExplorer({
  journey,
  variant = "page",
}: CurriculumExplorerProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isPage = variant === "page";

  const activeLessonSlug = useMemo(() => {
    const topicMatch = pathname.match(/^\/module\/[^/]+\/topic\/([^/]+)/);
    if (topicMatch?.[1]) return topicMatch[1];
    if (pathname.startsWith("/lesson/")) {
      return pathname.replace("/lesson/", "").split("/")[0] ?? null;
    }
    if (pathname.startsWith("/learn")) {
      return searchParams.get("lesson");
    }
    return null;
  }, [pathname, searchParams]);

  const currentLesson = useMemo(() => {
    if (activeLessonSlug) {
      for (const phase of journey.phases) {
        for (const module of phase.modules) {
          for (const lesson of module.lessons) {
            if (lesson.slug === activeLessonSlug) {
              return { phaseId: phase.id, moduleId: module.id, lesson };
            }
          }
        }
      }
    }
    for (const phase of journey.phases) {
      for (const module of phase.modules) {
        for (const lesson of module.lessons) {
          if (!lesson.isCompleted) {
            return { phaseId: phase.id, moduleId: module.id, lesson };
          }
        }
      }
    }
    const first = journey.phases[0]?.modules[0]?.lessons[0];
    return first
      ? {
          phaseId: journey.phases[0]!.id,
          moduleId: journey.phases[0]!.modules[0]!.id,
          lesson: first,
        }
      : null;
  }, [journey, activeLessonSlug]);

  const [openPhases, setOpenPhases] = useState<Set<string>>(() => {
    const ids = new Set<string>();
    if (currentLesson) ids.add(currentLesson.phaseId);
    else if (journey.phases[0]) ids.add(journey.phases[0].id);
    return ids;
  });

  const [openModules, setOpenModules] = useState<Set<string>>(() => {
    const ids = new Set<string>();
    if (currentLesson) ids.add(currentLesson.moduleId);
    else if (journey.phases[0]?.modules[0]) {
      ids.add(journey.phases[0].modules[0].id);
    }
    return ids;
  });

  const activeRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    if (currentLesson) {
      setOpenPhases((prev) => new Set(prev).add(currentLesson.phaseId));
      setOpenModules((prev) => new Set(prev).add(currentLesson.moduleId));
    }
  }, [currentLesson]);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [activeLessonSlug, currentLesson?.lesson.id]);

  const tree = (
    <ul className={cn("space-y-1", isPage && "space-y-2")}>
      {journey.phases.map((phase) => {
        const phaseOpen = openPhases.has(phase.id);
        const phasePct =
          phase.totalCount === 0
            ? 0
            : Math.round((phase.completedCount / phase.totalCount) * 100);

        return (
          <li
            key={phase.id}
            className={cn(
              isPage &&
                "rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-2 sm:p-3"
            )}
          >
            <button
              type="button"
              onClick={() => setOpenPhases((prev) => toggle(prev, phase.id))}
              className={cn(
                "flex w-full items-center gap-2 rounded-lg text-left transition hover:bg-zinc-900",
                isPage ? "px-2 py-2.5" : "px-2 py-1.5"
              )}
            >
              <ChevronDown
                className={cn(
                  "h-4 w-4 shrink-0 text-zinc-500 transition-transform duration-150",
                  !phaseOpen && "-rotate-90"
                )}
              />
              <span
                className={cn(
                  "min-w-0 flex-1 truncate font-semibold text-zinc-100",
                  isPage ? "text-sm" : "text-xs"
                )}
              >
                {phase.title}
              </span>
              <span className="shrink-0 text-[11px] tabular-nums text-zinc-500">
                {phase.completedCount}/{phase.totalCount} · {phasePct}%
              </span>
            </button>

            <AnimatePresence initial={false}>
              {phaseOpen ? (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="overflow-hidden"
                >
                  <ul
                    className={cn(
                      "mb-1 space-y-0.5 border-l border-zinc-800",
                      isPage ? "ml-3 pl-3" : "ml-2 pl-2"
                    )}
                  >
                    {phase.modules.map((module) => {
                      const moduleOpen = openModules.has(module.id);
                      return (
                        <li key={module.id}>
                          <button
                            type="button"
                            onClick={() =>
                              setOpenModules((prev) => toggle(prev, module.id))
                            }
                            className="flex w-full items-start gap-2 rounded-md px-2 py-2 text-left hover:bg-zinc-900/80"
                          >
                            <ChevronDown
                              className={cn(
                                "mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-600 transition-transform duration-150",
                                !moduleOpen && "-rotate-90"
                              )}
                            />
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-[13px] font-medium text-zinc-200">
                                {module.title}
                              </span>
                              <span className="mt-0.5 flex items-center gap-2 text-[11px] text-zinc-600">
                                <span>
                                  {module.completedCount}/{module.totalCount}{" "}
                                  lessons
                                </span>
                                {module.estimated_duration ? (
                                  <span className="inline-flex items-center gap-0.5">
                                    <Clock className="h-3 w-3" />
                                    {module.estimated_duration}
                                  </span>
                                ) : null}
                              </span>
                            </span>
                          </button>

                          <AnimatePresence initial={false}>
                            {moduleOpen ? (
                              <motion.ul
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="mb-2 ml-4 space-y-0.5 overflow-hidden border-l border-zinc-800/70 pl-3"
                              >
                                {module.lessons.map((lesson) => {
                                  const isActive =
                                    lesson.slug === activeLessonSlug ||
                                    lesson.id === currentLesson?.lesson.id;
                                  const href = CURRICULUM_ROUTES.moduleTopic(
                                    module.slug,
                                    lesson.slug
                                  );

                                  return (
                                    <li key={lesson.id}>
                                      <Link
                                        ref={isActive ? activeRef : undefined}
                                        href={href}
                                        className={cn(
                                          "flex items-start gap-2 rounded-lg px-2 py-1.5 text-[13px] transition",
                                          isActive
                                            ? "bg-indigo-500/15 text-indigo-100 ring-1 ring-indigo-500/25"
                                            : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                                        )}
                                      >
                                        {lesson.isCompleted ? (
                                          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                                        ) : (
                                          <Circle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-600" />
                                        )}
                                        <span className="min-w-0 flex-1 leading-snug">
                                          <span className="block">
                                            {lesson.title}
                                          </span>
                                          <span className="text-[11px] text-zinc-600">
                                            {lesson.durationMinutes} min
                                          </span>
                                        </span>
                                      </Link>
                                    </li>
                                  );
                                })}
                              </motion.ul>
                            ) : null}
                          </AnimatePresence>
                        </li>
                      );
                    })}
                  </ul>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );

  if (!isPage) {
    return (
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-2">{tree}</div>
      </div>
    );
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-300/80">
            Curriculum
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-50">
            {journey.course.title}
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-zinc-500">
            Explore every phase, module, and lesson. Expand a section to jump
            straight into learning.
          </p>
        </div>
        <div className="w-full max-w-xs space-y-2">
          <div className="flex justify-between text-xs text-zinc-500">
            <span>Course progress</span>
            <span className="tabular-nums text-zinc-300">
              {journey.completedCount}/{journey.totalCount} ·{" "}
              {journey.progressPercent}%
            </span>
          </div>
          <Progress value={journey.progressPercent} className="h-2" />
        </div>
      </div>
      {tree}
    </section>
  );
}

function toggle(set: Set<string>, id: string) {
  const next = new Set(set);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  return next;
}
