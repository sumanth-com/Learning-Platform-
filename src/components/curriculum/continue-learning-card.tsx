import Link from "next/link";
import { ArrowRight, BookOpen, Layers, Map, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CURRICULUM_ROUTES } from "@/features/curriculum/types";
import type { ContinueLearningState } from "@/features/curriculum/types";

interface ContinueLearningCardProps {
  state: ContinueLearningState;
}

export function ContinueLearningCard({ state }: ContinueLearningCardProps) {
  const resumeHref = state.lesson
    ? CURRICULUM_ROUTES.lesson(state.lesson.slug)
    : state.moduleSlug
      ? CURRICULUM_ROUTES.module(state.moduleSlug)
      : CURRICULUM_ROUTES.journey;

  return (
    <div className="space-y-4">
      <section className="overflow-hidden rounded-2xl border border-zinc-800/80 bg-gradient-to-br from-indigo-950/40 via-zinc-900/60 to-zinc-950 p-6 sm:p-8">
        <div className="mb-4 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-indigo-300/80">
          <BookOpen className="h-3.5 w-3.5" />
          Continue learning
        </div>

        <h2 className="font-display text-2xl font-semibold tracking-tight text-zinc-50">
          {state.courseTitle}
        </h2>
        <p className="mt-1 text-sm capitalize text-zinc-500">
          {state.courseDifficulty} · {state.courseDuration}
        </p>

        {state.lesson ? (
          <p className="mt-4 text-base text-zinc-300">
            Next lesson:{" "}
            <span className="font-medium text-indigo-300">
              {state.lesson.title}
            </span>
          </p>
        ) : (
          <p className="mt-4 text-sm text-zinc-400">
            Open the learning journey to begin.
          </p>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={resumeHref}>
            <Button className="gap-2" size="lg">
              Resume learning
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href={CURRICULUM_ROUTES.journey}>
            <Button variant="outline" size="lg">
              View journey
            </Button>
          </Link>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={BookOpen}
          label="Current course"
          value={state.courseTitle}
        />
        <StatCard icon={Map} label="Current phase" value={state.phaseTitle ?? "—"} />
        <StatCard
          icon={Layers}
          label="Current module"
          value={state.moduleTitle ?? "—"}
        />
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950 text-indigo-400">
            <TrendingUp className="h-4 w-4" />
          </div>
          <p className="text-xs uppercase tracking-wider text-zinc-500">
            Progress
          </p>
          <p className="mt-1 text-sm font-semibold text-zinc-100">
            {state.completedCount}/{state.totalCount} · {state.progressPercent}%
          </p>
          <Progress value={state.progressPercent} className="mt-3 h-1.5" />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950 text-indigo-400">
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-xs uppercase tracking-wider text-zinc-500">{label}</p>
      <p className="mt-1 line-clamp-2 text-sm font-semibold text-zinc-100">
        {value}
      </p>
    </div>
  );
}
