import { Suspense } from "react";
import { PhaseJourneyMap, PhaseModulesGrid } from "@/components/curriculum/phase-journey-map";
import { CurriculumExplorer } from "@/components/portal/curriculum-explorer";
import { Progress } from "@/components/ui/progress";
import type { CourseJourney } from "@/features/curriculum/types";

interface LearningJourneyProps {
  journey: CourseJourney;
  currentPhaseOrder: number;
}

export function LearningJourney({
  journey,
  currentPhaseOrder,
}: LearningJourneyProps) {
  return (
    <div className="space-y-14">
      <header className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-indigo-300/80">
          Learning journey
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
          {journey.course.title}
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
          {journey.course.description}
        </p>
        <div className="max-w-md space-y-2 pt-2">
          <div className="flex justify-between text-xs text-zinc-500">
            <span>Overall progress</span>
            <span className="tabular-nums text-zinc-300">
              {journey.completedCount}/{journey.totalCount} ·{" "}
              {journey.progressPercent}%
            </span>
          </div>
          <Progress value={journey.progressPercent} />
        </div>
      </header>

      <Suspense
        fallback={
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-8 text-sm text-zinc-500">
            Loading curriculum…
          </div>
        }
      >
        <CurriculumExplorer journey={journey} variant="page" />
      </Suspense>

      <PhaseJourneyMap
        phases={journey.phases}
        courseTitle={journey.course.title}
        currentPhaseOrder={currentPhaseOrder}
      />

      <div className="space-y-6">
        <div>
          <h2 className="font-display text-xl font-semibold text-zinc-50">
            Phases &amp; modules
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Open a module to view its lessons.
          </p>
        </div>
        <PhaseModulesGrid phases={journey.phases} />
      </div>
    </div>
  );
}
