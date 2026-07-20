import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock, ExternalLink, Play, Target } from "lucide-react";
import { DifficultyBadge } from "@/components/curriculum/difficulty-badge";
import { MarkCompleteButton } from "@/components/curriculum/mark-complete-button";
import { LessonAssignmentSection } from "@/components/assignments/lesson-assignment-section";
import { MentorAssignmentForm } from "@/components/assignments/mentor-assignment-form";
import { Button } from "@/components/ui/button";
import { CURRICULUM_ROUTES } from "@/features/curriculum/types";
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

  return (
    <article className="mx-auto max-w-3xl">
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <Link
          href={CURRICULUM_ROUTES.module(module.slug)}
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition hover:text-zinc-300"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {module.title}
        </Link>
      </div>

      <header className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-indigo-300/80">
          {course.title} · {phase.title}
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
          {lesson.title}
        </h1>
        <p className="text-base leading-relaxed text-zinc-400">
          {lesson.description}
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <DifficultyBadge difficulty={lesson.difficulty} />
          <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500">
            <Clock className="h-3.5 w-3.5" />
            Estimated time · {lesson.duration_minutes} min
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
          <p className="text-sm font-medium text-zinc-400">Video placeholder</p>
          <p className="text-xs text-zinc-600">
            {lesson.video_url
              ? "Video URL configured — player ships later."
              : "No video attached yet."}
          </p>
        </div>
      </div>

      <div className="prose-lesson mt-10 space-y-4 text-[15px] leading-7 text-zinc-300">
        <h2 className="text-xl font-semibold tracking-tight text-zinc-50">
          Lesson content
        </h2>
        {renderContent(lesson.content)}
      </div>

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

      {isMentor ? <MentorAssignmentForm lessonId={lesson.id} /> : null}

      <div className="mt-10 flex flex-col gap-4 border-t border-zinc-800/80 pt-8 sm:flex-row sm:items-center sm:justify-between">
        <MarkCompleteButton
          lessonId={lesson.id}
          isCompleted={isCompleted}
        />

        <div className="flex gap-2">
          {detail.previousLessonSlug ? (
            <Link href={CURRICULUM_ROUTES.lesson(detail.previousLessonSlug)}>
              <Button variant="outline" size="sm" className="gap-1.5">
                <ArrowLeft className="h-3.5 w-3.5" />
                Previous
              </Button>
            </Link>
          ) : null}
          {detail.nextLessonSlug ? (
            <Link href={CURRICULUM_ROUTES.lesson(detail.nextLessonSlug)}>
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

function renderContent(content: string) {
  const blocks = content.split(/\n\n+/);

  return blocks.map((block, index) => {
    const trimmed = block.trim();
    if (!trimmed) return null;

    if (trimmed.startsWith("## ")) {
      return (
        <h3
          key={index}
          className="pt-2 text-lg font-semibold tracking-tight text-zinc-50"
        >
          {trimmed.replace(/^##\s+/, "")}
        </h3>
      );
    }

    if (trimmed.startsWith("### ")) {
      return (
        <h4 key={index} className="pt-1 text-base font-semibold text-zinc-100">
          {trimmed.replace(/^###\s+/, "")}
        </h4>
      );
    }

    if (trimmed.startsWith("- ")) {
      const items = trimmed.split("\n").filter((line) => line.startsWith("- "));
      return (
        <ul key={index} className="list-disc space-y-1 pl-5 text-zinc-400">
          {items.map((item) => (
            <li key={item}>{item.replace(/^-\s+/, "")}</li>
          ))}
        </ul>
      );
    }

    return (
      <p key={index} className="text-zinc-400">
        {trimmed}
      </p>
    );
  });
}
