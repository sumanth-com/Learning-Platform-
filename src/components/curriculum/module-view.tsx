import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  Clock,
  Layers,
  PlayCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DifficultyBadge } from "@/components/curriculum/difficulty-badge";
import { CURRICULUM_ROUTES } from "@/features/curriculum/types";
import type { ModuleDetail } from "@/features/curriculum/types";

interface ModuleViewProps {
  detail: ModuleDetail;
}

export function ModuleView({ detail }: ModuleViewProps) {
  const { module, phase, course, lessons } = detail;
  const nextLesson =
    lessons.find((lesson) => !lesson.isCompleted) ?? lessons[0] ?? null;
  const remaining = detail.totalCount - detail.completedCount;

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-1 py-2">
      <Link
        href={CURRICULUM_ROUTES.journey}
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition hover:text-zinc-300"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to journey
      </Link>

      <header className="overflow-hidden rounded-2xl border border-zinc-800/80 bg-gradient-to-br from-indigo-950/40 via-zinc-900/70 to-zinc-950 p-5 sm:p-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-indigo-300/80">
          {phase.title}
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">
          {module.title}
        </h1>
        {module.description ? (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-400">
            {module.description}
          </p>
        ) : null}

        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-950/50 px-2.5 py-1">
            <Layers className="h-3 w-3 text-indigo-400" />
            {detail.totalCount} lessons
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-950/50 px-2.5 py-1">
            <Clock className="h-3 w-3 text-indigo-400" />
            {module.estimated_duration || `${detail.totalDurationMinutes} min`}
          </span>
          <span className="rounded-full border border-zinc-800 bg-zinc-950/50 px-2.5 py-1">
            {detail.completedCount}/{detail.totalCount} complete
          </span>
          {remaining > 0 ? (
            <span className="rounded-full border border-zinc-800 bg-zinc-950/50 px-2.5 py-1">
              {remaining} left
            </span>
          ) : (
            <Badge variant="success">Module complete</Badge>
          )}
        </div>

        <div className="mt-4 space-y-1.5">
          <div className="flex justify-between text-[11px] text-zinc-500">
            <span>Module progress</span>
            <span className="tabular-nums text-zinc-300">
              {detail.progressPercent}%
            </span>
          </div>
          <Progress value={detail.progressPercent} className="h-1.5" />
        </div>

        {nextLesson ? (
          <div className="mt-5">
            <Button asChild className="gap-2">
              <Link
                href={CURRICULUM_ROUTES.moduleTopic(
                  module.slug,
                  nextLesson.slug
                )}
              >
                {nextLesson.isCompleted ? "Review lesson" : "Continue module"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <p className="mt-2 text-xs text-zinc-500">
              Next: {nextLesson.title}
            </p>
          </div>
        ) : null}
      </header>

      <section>
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-zinc-100">
            Lessons in this module
          </h2>
          <span className="text-[11px] text-zinc-600">{course.title}</span>
        </div>

        <ul className="space-y-2">
          {lessons.map((lesson, index) => {
            const isNext = nextLesson?.id === lesson.id && !lesson.isCompleted;
            return (
              <li key={lesson.id}>
                <Link
                  href={CURRICULUM_ROUTES.moduleTopic(module.slug, lesson.slug)}
                  className="flex items-center gap-3 rounded-xl border border-zinc-800/80 bg-zinc-900/40 px-3.5 py-3 transition hover:border-zinc-700 hover:bg-zinc-900/70"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950 text-xs font-semibold tabular-nums text-zinc-500">
                    {index + 1}
                  </span>
                  {lesson.isCompleted ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                  ) : isNext ? (
                    <PlayCircle className="h-4 w-4 shrink-0 text-indigo-300" />
                  ) : (
                    <Circle className="h-4 w-4 shrink-0 text-zinc-600" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-medium text-zinc-100">
                        {lesson.title}
                      </p>
                      {lesson.isCompleted ? (
                        <Badge variant="success">Done</Badge>
                      ) : null}
                      {isNext ? (
                        <Badge variant="secondary">Up next</Badge>
                      ) : null}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <DifficultyBadge difficulty={lesson.difficulty} />
                      <span className="inline-flex items-center gap-1 text-[11px] text-zinc-500">
                        <Clock className="h-3 w-3" />
                        {lesson.durationMinutes} min
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-zinc-600" />
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
