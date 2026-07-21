"use client";

import { useMemo, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Circle,
  Clock,
  Code2,
  ExternalLink,
  Lightbulb,
  Loader2,
  Sparkles,
  Target,
} from "lucide-react";
import { toast } from "sonner";
import { LearnMarkdown } from "@/components/learn/learn-markdown";
import { LessonAssignmentSection } from "@/components/assignments/lesson-assignment-section";
import { DifficultyBadge } from "@/components/curriculum/difficulty-badge";
import { Button } from "@/components/ui/button";
import { toggleLessonCompleteAction } from "@/features/curriculum/actions/progress-actions";
import { parseLessonDocSections } from "@/features/learn/lib/parse-lesson-sections";
import type { WorkspaceLessonPayload } from "@/features/learn/lib/workspace-tree";
import { cn } from "@/lib/utils";

type LessonPanelProps = {
  payload: WorkspaceLessonPayload | null;
  loading?: boolean;
  previousSlug: string | null;
  nextSlug: string | null;
  onNavigate: (slug: string) => void;
  onCompletedChange: (lessonId: string, completed: boolean) => void;
};

const SECTION_ICONS: Record<string, typeof BookOpen> = {
  introduction: BookOpen,
  concepts: Lightbulb,
  examples: Sparkles,
  code: Code2,
  exercises: Target,
  other: BookOpen,
};

export function LessonPanel({
  payload,
  loading,
  previousSlug,
  nextSlug,
  onNavigate,
  onCompletedChange,
}: LessonPanelProps) {
  const [pending, startTransition] = useTransition();

  const sections = useMemo(
    () =>
      payload ? parseLessonDocSections(payload.detail.lesson.content || "") : [],
    [payload]
  );

  if (loading && !payload) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-zinc-500">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading lesson…
      </div>
    );
  }

  if (!payload) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center px-6 text-center text-sm text-zinc-500">
        Select a lesson from the learning path to begin.
      </div>
    );
  }

  const { detail, objectives, assignments } = payload;
  const { lesson, resources, module, phase, course, isCompleted } = detail;

  return (
    <AnimatePresence mode="wait">
      <motion.article
        key={lesson.id}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.12, ease: "easeOut" }}
        className="mx-auto max-w-3xl px-4 py-8 sm:px-8"
      >
        <header className="space-y-4 border-b border-zinc-800/80 pb-8">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-indigo-300/80">
            {course.title}
            <span className="mx-2 text-zinc-700">/</span>
            {phase.title}
            <span className="mx-2 text-zinc-700">/</span>
            {module.title}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
            {lesson.title}
          </h1>
          {lesson.description ? (
            <p className="max-w-2xl text-base leading-relaxed text-zinc-400">
              {lesson.description}
            </p>
          ) : null}
          <div className="flex flex-wrap items-center gap-3">
            <DifficultyBadge difficulty={lesson.difficulty} />
            <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/50 px-2.5 py-1 text-xs text-zinc-400">
              <Clock className="h-3.5 w-3.5" />
              {lesson.duration_minutes} min
            </span>
            {isCompleted ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-300">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Completed
              </span>
            ) : null}
          </div>
        </header>

        {objectives.length > 0 ? (
          <section className="mt-8">
            <SectionHeading icon={Target} title="Learning objectives" />
            <ul className="mt-3 space-y-2 text-sm text-zinc-400">
              {objectives.map((item) => (
                <li key={item} className="flex gap-2.5">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <div className="mt-10 space-y-10">
          {sections.length > 0 ? (
            sections.map((section) => {
              const Icon = SECTION_ICONS[section.id] ?? BookOpen;
              return (
                <section key={`${section.id}-${section.title}`}>
                  <SectionHeading icon={Icon} title={section.title} />
                  <div className="mt-4">
                    <LearnMarkdown content={section.content} />
                  </div>
                </section>
              );
            })
          ) : (
            <section>
              <SectionHeading icon={BookOpen} title="Introduction" />
              <div className="mt-4">
                <LearnMarkdown content="This lesson does not have written content yet. Check back soon, or ask your mentor to publish the documentation." />
              </div>
            </section>
          )}
        </div>

        {assignments.length > 0 ? (
          <div className="mt-4">
            <LessonAssignmentSection assignments={assignments} />
          </div>
        ) : null}

        {resources.length > 0 ? (
          <section className="mt-12">
            <SectionHeading icon={ExternalLink} title="Resources" />
            <ul className="mt-4 space-y-2">
              {resources.map((resource) => (
                <li key={resource.id}>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-3 rounded-xl border border-zinc-800/80 bg-zinc-900/30 px-3.5 py-2.5 transition hover:border-zinc-700 hover:bg-zinc-900/60"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm text-zinc-200 group-hover:text-white">
                        {resource.title}
                      </span>
                      <span className="text-[11px] capitalize text-zinc-600">
                        {resource.type}
                      </span>
                    </span>
                    <ExternalLink className="h-3.5 w-3.5 shrink-0 text-zinc-600 group-hover:text-indigo-300" />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <div className="sticky bottom-0 mt-12 -mx-4 border-t border-zinc-800/90 bg-zinc-950/95 px-4 py-4 backdrop-blur sm:-mx-8 sm:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button
              type="button"
              variant="outline"
              className="gap-2"
              disabled={!previousSlug}
              onClick={() => previousSlug && onNavigate(previousSlug)}
            >
              <ArrowLeft className="h-4 w-4" />
              Previous lesson
            </Button>

            <Button
              type="button"
              variant={isCompleted ? "secondary" : "default"}
              className="gap-2"
              disabled={pending}
              onClick={() => {
                const nextCompleted = !isCompleted;
                onCompletedChange(lesson.id, nextCompleted);
                startTransition(async () => {
                  const result = await toggleLessonCompleteAction(
                    lesson.id,
                    isCompleted
                  );
                  if (!result.success) {
                    onCompletedChange(lesson.id, isCompleted);
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
              className="gap-2"
              disabled={!nextSlug}
              onClick={() => nextSlug && onNavigate(nextSlug)}
            >
              Next lesson
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.article>
    </AnimatePresence>
  );
}

function SectionHeading({
  icon: Icon,
  title,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className={cn("h-4 w-4 text-indigo-400")} />
      <h2 className="text-sm font-semibold tracking-tight text-zinc-100">
        {title}
      </h2>
    </div>
  );
}
