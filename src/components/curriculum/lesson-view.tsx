import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock, ExternalLink, Target } from "lucide-react";
import { DifficultyBadge } from "@/components/curriculum/difficulty-badge";
import { MarkCompleteButton } from "@/components/curriculum/mark-complete-button";
import { LessonAssignmentSection } from "@/components/assignments/lesson-assignment-section";
import { MentorAssignmentForm } from "@/components/assignments/mentor-assignment-form";
import { Button } from "@/components/ui/button";
import { LearnMarkdown } from "@/components/learn/learn-markdown";
import { CURRICULUM_ROUTES } from "@/features/curriculum/types";
import { parseLessonDocSections } from "@/features/learn/lib/parse-lesson-sections";
import type { LessonDetail } from "@/features/curriculum/types";
import type { AssignmentSummary } from "@/features/assignments/types";

interface LessonViewProps {
  detail: LessonDetail;
  objectives: string[];
  assignments: AssignmentSummary[];
  isMentor: boolean;
}

export function LessonView({
  detail,
  objectives,
  assignments,
  isMentor,
}: LessonViewProps) {
  const { lesson, resources, module, phase, course, isCompleted } = detail;
  const sections = parseLessonDocSections(lesson.content || "");

  return (
    <article className="mx-auto max-w-3xl">
      <div className="mb-6">
        <Link
          href={CURRICULUM_ROUTES.module(module.slug)}
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition hover:text-zinc-300"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to {module.title}
        </Link>
      </div>

      <header className="space-y-3 border-b border-zinc-800/80 pb-8">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-indigo-300/80">
          {course.title} / {phase.title} / {module.title}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
          {lesson.title}
        </h1>
        {lesson.description ? (
          <p className="text-base leading-relaxed text-zinc-400">
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
        <section className="mt-8">
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

      <div className="mt-10 space-y-10">
        {sections.length > 0 ? (
          sections.map((section) => (
            <section key={`${section.id}-${section.title}`}>
              <h2 className="text-sm font-semibold tracking-tight text-zinc-100">
                {section.title}
              </h2>
              <div className="mt-4">
                <LearnMarkdown content={section.content} />
              </div>
            </section>
          ))
        ) : (
          <LearnMarkdown content={lesson.content || "No content yet."} />
        )}
      </div>

      {resources.length > 0 ? (
        <section className="mt-12">
          <h2 className="text-sm font-semibold text-zinc-100">Resources</h2>
          <ul className="mt-4 space-y-2">
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

      {isMentor ? <MentorAssignmentForm lessonId={lesson.id} /> : null}

      <div className="mt-10 flex flex-col gap-4 border-t border-zinc-800/80 pt-8 sm:flex-row sm:items-center sm:justify-between">
        <MarkCompleteButton lessonId={lesson.id} isCompleted={isCompleted} />

        <div className="flex gap-2">
          {detail.previousLessonSlug ? (
            <Link
              href={CURRICULUM_ROUTES.moduleTopic(
                module.slug,
                detail.previousLessonSlug
              )}
            >
              <Button variant="outline" size="sm" className="gap-1.5">
                <ArrowLeft className="h-3.5 w-3.5" />
                Previous
              </Button>
            </Link>
          ) : null}
          {detail.nextLessonSlug ? (
            <Link
              href={CURRICULUM_ROUTES.moduleTopic(
                module.slug,
                detail.nextLessonSlug
              )}
            >
              <Button variant="secondary" size="sm" className="gap-1.5">
                Next
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}
