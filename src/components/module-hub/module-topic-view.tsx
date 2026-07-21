"use client";

import { useEffect, useMemo, useTransition } from "react";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Circle,
  Clock,
  ExternalLink,
  Lightbulb,
  Loader2,
  Target,
} from "lucide-react";
import { toast } from "sonner";
import { LearnMarkdown } from "@/components/learn/learn-markdown";
import { LessonAssignmentSection } from "@/components/assignments/lesson-assignment-section";
import { DifficultyBadge } from "@/components/curriculum/difficulty-badge";
import { ModuleChallengeCards } from "@/components/module-hub/module-challenge-cards";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toggleLessonCompleteAction } from "@/features/curriculum/actions/progress-actions";
import {
  prefetchModuleTopic,
  setModuleTopicCompleted,
  useModuleTopic,
} from "@/features/curriculum/hooks/use-module-hub";
import type { ModuleTopicPayload } from "@/features/curriculum/actions/module-hub-actions";
import { parseTopicDocSections } from "@/features/curriculum/lib/parse-topic-sections";
import { resolveTopicChallenges, getTopicChallengeLimit } from "@/features/curriculum/lib/topic-challenges";
import { CURRICULUM_ROUTES } from "@/features/curriculum/types";
import { cn } from "@/lib/utils";

type ModuleTopicViewProps = {
  moduleSlug: string;
  topicSlug: string;
  initialData: ModuleTopicPayload;
};

const SECTION_ICONS: Record<string, typeof BookOpen> = {
  overview: BookOpen,
  explanation: BookOpen,
  diagrams: Target,
  examples: Lightbulb,
  code: BookOpen,
  mistakes: Lightbulb,
  practices: CheckCircle2,
  other: BookOpen,
};

export function ModuleTopicView({
  moduleSlug,
  topicSlug,
  initialData,
}: ModuleTopicViewProps) {
  const queryClient = useQueryClient();
  const [pending, startTransition] = useTransition();
  const query = useModuleTopic(moduleSlug, topicSlug, initialData);
  const payload = query.data ?? initialData;
  const { detail, objectives, assignments } = payload;
  const { lesson, resources, module, isCompleted } = detail;

  const sections = useMemo(
    () => parseTopicDocSections(lesson.content || ""),
    [lesson.content]
  );

  const challenges = useMemo(
    () =>
      resolveTopicChallenges(
        moduleSlug,
        topicSlug,
        lesson.title,
        getTopicChallengeLimit(moduleSlug, topicSlug)
      ),
    [moduleSlug, topicSlug, lesson.title]
  );

  useEffect(() => {
    prefetchModuleTopic(queryClient, moduleSlug, detail.previousLessonSlug);
    prefetchModuleTopic(queryClient, moduleSlug, detail.nextLessonSlug);
  }, [queryClient, moduleSlug, detail.previousLessonSlug, detail.nextLessonSlug]);

  return (
    <AnimatePresence mode="wait">
      <motion.article
        key={lesson.id}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.12 }}
        className="mx-auto max-w-4xl space-y-10 pb-12"
      >
        <nav className="flex flex-wrap items-center gap-1.5 text-xs text-zinc-500">
          <Link
            href={CURRICULUM_ROUTES.moduleHub(moduleSlug)}
            className="inline-flex items-center gap-1 transition hover:text-zinc-300"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to challenges
          </Link>
          <span className="text-zinc-700">·</span>
          <Link
            href={CURRICULUM_ROUTES.moduleHub(moduleSlug, topicSlug)}
            className="transition hover:text-zinc-300"
          >
            {module.title}
          </Link>
          <span className="text-zinc-700">/</span>
          <span className="text-zinc-300">{lesson.title}</span>
        </nav>

        <header className="space-y-4 border-b border-zinc-800/80 pb-6">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-indigo-300/80">
              Topic
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50">
              {lesson.title}
            </h1>
            {lesson.description ? (
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                {lesson.description}
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <DifficultyBadge difficulty={lesson.difficulty} />
            <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500">
              <Clock className="h-3.5 w-3.5" />
              {lesson.duration_minutes} min
            </span>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                isCompleted
                  ? "bg-emerald-500/15 text-emerald-300"
                  : "bg-indigo-500/15 text-indigo-300"
              )}
            >
              {isCompleted ? "Completed" : "In progress"}
            </span>
          </div>

          <div className="max-w-xs space-y-1.5">
            <div className="flex justify-between text-[11px] text-zinc-500">
              <span>Topic progress</span>
              <span className="tabular-nums text-zinc-300">
                {isCompleted ? "100%" : "0%"}
              </span>
            </div>
            <Progress value={isCompleted ? 100 : 0} className="h-1.5" />
          </div>
        </header>

        {objectives.length > 0 ? (
          <section>
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

        <section className="space-y-8">
          <div>
            <h2 className="text-lg font-semibold text-zinc-50">
              Learning content
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Read the concept first. Practice challenges come after.
            </p>
          </div>

          {sections.length > 0 ? (
            sections
              .filter((s) => s.id !== "practice" && s.id !== "assignment")
              .map((section) => {
                const Icon = SECTION_ICONS[section.id] ?? BookOpen;
                return (
                  <div key={`${section.id}-${section.title}`}>
                    <div className="mb-3 flex items-center gap-2">
                      <Icon className="h-4 w-4 text-indigo-400" />
                      <h3 className="text-sm font-semibold text-zinc-100">
                        {section.title}
                      </h3>
                    </div>
                    <LearnMarkdown content={section.content} />
                  </div>
                );
              })
          ) : (
            <LearnMarkdown content={lesson.content || "No content yet."} />
          )}
        </section>

        {resources.length > 0 ? (
          <section>
            <h2 className="text-sm font-semibold text-zinc-100">Resources</h2>
            <ul className="mt-3 space-y-2">
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
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="space-y-4 border-t border-zinc-800/80 pt-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-zinc-50">
                Practice challenges
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Solve these after reading. Mark the topic complete when you are
                done studying.
              </p>
            </div>
            <Button asChild size="sm" variant="outline" className="shrink-0">
              <Link href={CURRICULUM_ROUTES.moduleHub(moduleSlug, topicSlug)}>
                View on module hub
              </Link>
            </Button>
          </div>
          <ModuleChallengeCards
            moduleSlug={moduleSlug}
            topicSlug={topicSlug}
            challenges={challenges}
          />
        </section>

        <section className="space-y-4 border-t border-zinc-800/80 pt-8">
          <div>
            <h2 className="text-lg font-semibold text-zinc-50">Assignments</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Submit after finishing the topic challenges.
            </p>
          </div>
          <LessonAssignmentSection assignments={assignments} />
        </section>

        <div className="sticky bottom-0 border-t border-zinc-800/90 bg-zinc-950/95 py-4 backdrop-blur">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {detail.previousLessonSlug ? (
              <Button asChild variant="outline">
                <Link
                  href={CURRICULUM_ROUTES.moduleTopic(
                    moduleSlug,
                    detail.previousLessonSlug
                  )}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </Link>
              </Button>
            ) : (
              <Button variant="outline" disabled className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>
            )}

            <Button
              type="button"
              variant={isCompleted ? "secondary" : "default"}
              className="gap-2"
              disabled={pending}
              onClick={() => {
                setModuleTopicCompleted(
                  queryClient,
                  moduleSlug,
                  topicSlug,
                  !isCompleted
                );
                startTransition(async () => {
                  const result = await toggleLessonCompleteAction(
                    lesson.id,
                    isCompleted
                  );
                  if (!result.success) {
                    setModuleTopicCompleted(
                      queryClient,
                      moduleSlug,
                      topicSlug,
                      isCompleted
                    );
                    toast.error(result.error);
                    return;
                  }
                  setModuleTopicCompleted(
                    queryClient,
                    moduleSlug,
                    topicSlug,
                    result.completed
                  );
                  toast.success(
                    result.completed
                      ? "Topic marked complete."
                      : "Topic marked incomplete."
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

            {detail.nextLessonSlug ? (
              <Button asChild variant="secondary">
                <Link
                  href={CURRICULUM_ROUTES.moduleTopic(
                    moduleSlug,
                    detail.nextLessonSlug
                  )}
                  className="gap-2"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button variant="secondary" disabled className="gap-2">
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </motion.article>
    </AnimatePresence>
  );
}
