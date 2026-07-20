"use client";

import { useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  Clock,
  ExternalLink,
  Loader2,
  Play,
  Target,
} from "lucide-react";
import { toast } from "sonner";
import { LearnMarkdown } from "@/components/learn/learn-markdown";
import { ProgressRow } from "@/components/learn/progress-row";
import { LessonAssignmentSection } from "@/components/assignments/lesson-assignment-section";
import { DifficultyBadge } from "@/components/curriculum/difficulty-badge";
import { Button } from "@/components/ui/button";
import { toggleLessonCompleteAction } from "@/features/curriculum/actions/progress-actions";
import type { WorkspaceLessonPayload } from "@/features/learn/lib/workspace-tree";

type LessonPanelProps = {
  payload: WorkspaceLessonPayload | null;
  loading?: boolean;
  phaseProgress: number;
  moduleProgress: number;
  previousSlug: string | null;
  nextSlug: string | null;
  onNavigate: (slug: string) => void;
  onCompletedChange: (lessonId: string, completed: boolean) => void;
};

export function LessonPanel({
  payload,
  loading,
  phaseProgress,
  moduleProgress,
  previousSlug,
  nextSlug,
  onNavigate,
  onCompletedChange,
}: LessonPanelProps) {
  const [pending, startTransition] = useTransition();

  if (loading && !payload) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-zinc-500">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading lesson…
      </div>
    );
  }

  if (!payload) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-6 text-center text-sm text-zinc-500">
        Select a lesson from the curriculum sidebar to begin.
      </div>
    );
  }

  const { detail, objectives, assignments } = payload;
  const { lesson, resources, module, phase, course, isCompleted } = detail;

  return (
    <AnimatePresence mode="wait">
      <motion.article
        key={lesson.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="mx-auto max-w-3xl px-4 py-8 sm:px-8"
      >
        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          <ProgressRow
            label="Phase progress"
            value={phaseProgress}
            meta={`${phaseProgress}%`}
          />
          <ProgressRow
            label="Module progress"
            value={moduleProgress}
            meta={`${moduleProgress}%`}
          />
          <ProgressRow
            label="Lesson"
            value={isCompleted ? 100 : 0}
            meta={isCompleted ? "Complete" : "In progress"}
          />
        </div>

        <header className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-indigo-300/80">
            {course.title} · {phase.title} · {module.title}
          </p>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
            {lesson.title}
          </h1>
          {lesson.description ? (
            <p className="max-w-2xl text-base leading-relaxed text-zinc-400">
              {lesson.description}
            </p>
          ) : null}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <DifficultyBadge difficulty={lesson.difficulty} />
            <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500">
              <Clock className="h-3.5 w-3.5" />
              {lesson.duration_minutes} min
            </span>
          </div>
        </header>

        {objectives.length > 0 ? (
          <section className="mt-8 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6">
            <div className="mb-3 flex items-center gap-2">
              <Target className="h-4 w-4 text-indigo-400" />
              <h2 className="text-sm font-semibold text-zinc-100">
                Learning objectives
              </h2>
            </div>
            <ul className="space-y-2 text-sm text-zinc-400">
              {objectives.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <div className="mt-8 flex aspect-video items-center justify-center rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/60">
          <div className="flex flex-col items-center gap-2 text-zinc-500">
            <Play className="h-10 w-10 text-indigo-400/80" />
            <p className="text-sm font-medium text-zinc-400">
              {lesson.video_url ? "Video ready" : "No video attached"}
            </p>
            <p className="max-w-sm px-4 text-center text-xs text-zinc-600">
              {lesson.video_url ??
                "Attach a video URL in the Admin CMS to show a player here."}
            </p>
          </div>
        </div>

        <section className="mt-10">
          <h2 className="mb-4 font-display text-xl font-semibold tracking-tight text-zinc-50">
            Lesson content
          </h2>
          <LearnMarkdown content={lesson.content || "No content yet."} />
        </section>

        {resources.length > 0 ? (
          <section className="mt-12 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6">
            <h2 className="text-sm font-semibold text-zinc-100">Resources</h2>
            <ul className="mt-4 space-y-3">
              {resources.map((resource) => (
                <li key={resource.id}>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-indigo-300 transition hover:text-indigo-200"
                  >
                    {resource.title}
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span className="text-xs capitalize text-zinc-600">
                      {resource.type}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <LessonAssignmentSection assignments={assignments} />

        <div className="sticky bottom-0 mt-10 -mx-4 border-t border-zinc-800/90 bg-zinc-950/95 px-4 py-4 backdrop-blur sm:-mx-8 sm:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="gap-2"
              disabled={!previousSlug}
              onClick={() => previousSlug && onNavigate(previousSlug)}
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>

            <Button
              type="button"
              variant={isCompleted ? "secondary" : "default"}
              size="lg"
              className="gap-2"
              disabled={pending}
              onClick={() => {
                startTransition(async () => {
                  const result = await toggleLessonCompleteAction(
                    lesson.id,
                    isCompleted
                  );
                  if (!result.success) {
                    toast.error(result.error);
                    return;
                  }
                  onCompletedChange(lesson.id, result.completed);
                  toast.success(
                    result.completed
                      ? "Lesson marked complete."
                      : "Lesson marked incomplete."
                  );
                });
              }}
            >
              {pending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isCompleted ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              ) : (
                <Circle className="h-4 w-4" />
              )}
              {isCompleted ? "Completed" : "Mark complete"}
            </Button>

            <Button
              type="button"
              variant="secondary"
              size="lg"
              className="gap-2"
              disabled={!nextSlug}
              onClick={() => nextSlug && onNavigate(nextSlug)}
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.article>
    </AnimatePresence>
  );
}
