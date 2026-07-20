import Link from "next/link";
import { ArrowLeft, CheckCircle2, Circle, Clock } from "lucide-react";
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

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <Link
        href={CURRICULUM_ROUTES.journey}
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition hover:text-zinc-300"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to journey
      </Link>

      <header className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-indigo-300/80">
          {course.title} · {phase.title}
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
          {module.title}
        </h1>
        <p className="text-base text-zinc-400">{module.description}</p>

        <div className="flex flex-wrap gap-3 pt-2 text-xs text-zinc-500">
          <span>{module.estimated_duration || "—"}</span>
          <span>·</span>
          <span>{detail.totalDurationMinutes} min total</span>
          <span>·</span>
          <span>
            {detail.completedCount}/{detail.totalCount} complete
          </span>
        </div>

        <div className="max-w-md space-y-2 pt-2">
          <div className="flex justify-between text-xs text-zinc-500">
            <span>Module progress</span>
            <span className="tabular-nums">{detail.progressPercent}%</span>
          </div>
          <Progress value={detail.progressPercent} />
        </div>
      </header>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-zinc-100">Lessons</h2>
        <div className="space-y-2">
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              className="flex flex-col gap-3 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 items-start gap-3">
                {lesson.isCompleted ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                ) : (
                  <Circle className="mt-0.5 h-4 w-4 shrink-0 text-zinc-600" />
                )}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-zinc-100">{lesson.title}</p>
                    {lesson.isCompleted ? (
                      <Badge variant="success">Completed</Badge>
                    ) : null}
                    {lesson.isPreview ? (
                      <Badge variant="secondary">Preview</Badge>
                    ) : null}
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <DifficultyBadge difficulty={lesson.difficulty} />
                    <span className="inline-flex items-center gap-1 text-[11px] text-zinc-500">
                      <Clock className="h-3 w-3" />
                      {lesson.durationMinutes} min
                    </span>
                  </div>
                </div>
              </div>
              <Link href={CURRICULUM_ROUTES.lesson(lesson.slug)}>
                <Button size="sm" variant="secondary">
                  Open lesson
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
