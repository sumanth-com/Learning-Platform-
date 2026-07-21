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
  Code2,
  ExternalLink,
  Lightbulb,
  Loader2,
  MessageSquare,
  Sparkles,
  Target,
} from "lucide-react";
import { toast } from "sonner";
import { LearnMarkdown } from "@/components/learn/learn-markdown";
import { LessonAssignmentSection } from "@/components/assignments/lesson-assignment-section";
import { DifficultyBadge } from "@/components/curriculum/difficulty-badge";
import { Button } from "@/components/ui/button";
import { toggleLessonCompleteAction } from "@/features/curriculum/actions/progress-actions";
import {
  prefetchModuleTopic,
  setModuleTopicCompleted,
  useModuleTopic,
} from "@/features/curriculum/hooks/use-module-hub";
import type { ModuleTopicPayload } from "@/features/curriculum/actions/module-hub-actions";
import { parseTopicDocSections } from "@/features/curriculum/lib/parse-topic-sections";
import { CURRICULUM_ROUTES } from "@/features/curriculum/types";
import { cn } from "@/lib/utils";

type ModuleTopicViewProps = {
  moduleSlug: string;
  topicSlug: string;
  initialData: ModuleTopicPayload;
  related: Array<{ slug: string; title: string }>;
};

export function ModuleTopicView({
  moduleSlug,
  topicSlug,
  initialData,
  related,
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

  useEffect(() => {
    prefetchModuleTopic(queryClient, moduleSlug, detail.previousLessonSlug);
    prefetchModuleTopic(queryClient, moduleSlug, detail.nextLessonSlug);
    for (const item of related.slice(0, 3)) {
      prefetchModuleTopic(queryClient, moduleSlug, item.slug);
    }
  }, [
    queryClient,
    moduleSlug,
    detail.previousLessonSlug,
    detail.nextLessonSlug,
    related,
  ]);

  return (
    <AnimatePresence mode="wait">
      <motion.article
        key={lesson.id}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.12 }}
        className="mx-auto max-w-3xl pb-8"
      >
        <Link
          href={CURRICULUM_ROUTES.module(moduleSlug)}
          className="inline-flex items-center gap-1.5 text-xs text-zinc-500 transition hover:text-zinc-300"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to module hub
        </Link>

        <header className="mt-4 space-y-3 border-b border-zinc-800/80 pb-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-indigo-300/80">
            {module.title} · Topic
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-50">
            {lesson.title}
          </h1>
          {lesson.description ? (
            <p className="text-sm leading-relaxed text-zinc-400">
              {lesson.description}
            </p>
          ) : null}
          <div className="flex flex-wrap items-center gap-2">
            <DifficultyBadge difficulty={lesson.difficulty} />
            <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 px-2.5 py-1 text-xs text-zinc-500">
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
          <TopicBlock icon={Target} title="Learning objectives">
            <ul className="space-y-2 text-sm text-zinc-400">
              {objectives.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
                  {item}
                </li>
              ))}
            </ul>
          </TopicBlock>
        ) : null}

        <div className="mt-8 space-y-10">
          {sections.length > 0 ? (
            sections.map((section) => (
              <TopicBlock
                key={`${section.id}-${section.title}`}
                icon={iconFor(section.id)}
                title={section.title}
              >
                <LearnMarkdown content={section.content} />
              </TopicBlock>
            ))
          ) : (
            <TopicBlock icon={BookOpen} title="Overview">
              <LearnMarkdown
                content={
                  lesson.content ||
                  "Topic content will appear here when published."
                }
              />
            </TopicBlock>
          )}
        </div>

        <TopicBlock icon={Code2} title="Interactive playground">
          <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-950/40 p-6 text-center text-xs text-zinc-500">
            Playground placeholder — ready for a future interactive runner
            without schema changes.
          </div>
        </TopicBlock>

        {assignments.length > 0 ? (
          <div className="mt-8">
            <LessonAssignmentSection assignments={assignments} />
          </div>
        ) : null}

        {resources.length > 0 ? (
          <TopicBlock icon={ExternalLink} title="References">
            <ul className="space-y-2">
              {resources.map((resource) => (
                <li key={resource.id}>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-indigo-300 hover:text-indigo-200"
                  >
                    {resource.title}
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </li>
              ))}
            </ul>
          </TopicBlock>
        ) : null}

        <TopicBlock icon={MessageSquare} title="Discussion">
          <p className="text-sm text-zinc-500">
            Module discussion threads will appear here — future integration.
          </p>
        </TopicBlock>

        {related.length > 0 ? (
          <TopicBlock icon={Sparkles} title="Related topics">
            <ul className="flex flex-wrap gap-2">
              {related.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={CURRICULUM_ROUTES.moduleTopic(moduleSlug, item.slug)}
                    className="rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1 text-xs text-zinc-300 transition hover:border-zinc-600"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </TopicBlock>
        ) : null}

        <div className="sticky bottom-0 mt-10 border-t border-zinc-800/90 bg-zinc-950/95 py-4 backdrop-blur">
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

function TopicBlock({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-8">
      <div className="mb-3 flex items-center gap-2">
        <Icon className={cn("h-4 w-4 text-indigo-400")} />
        <h2 className="text-sm font-semibold tracking-tight text-zinc-100">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

function iconFor(id: string) {
  if (id === "code" || id === "playground") return Code2;
  if (id === "objectives" || id === "practice" || id === "quiz") return Target;
  if (id === "why" || id === "practices" || id === "mistakes") return Lightbulb;
  if (id === "examples") return Sparkles;
  if (id === "discussion") return MessageSquare;
  return BookOpen;
}
