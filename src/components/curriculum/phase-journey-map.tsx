"use client";

import Link from "next/link";
import { RoadmapJourneyMap } from "@/components/roadmap/roadmap-journey-map";
import type { JourneyMapNode } from "@/components/roadmap/journey-map-types";
import type { PhaseWithModules } from "@/features/curriculum/types";
import { CURRICULUM_ROUTES } from "@/features/curriculum/types";
import { cn } from "@/lib/utils";

interface PhaseJourneyMapProps {
  phases: PhaseWithModules[];
  courseTitle: string;
  currentPhaseOrder: number;
}

/**
 * Adapts curriculum phases into the existing roadmap timeline UI.
 * Phase nodes jump to the first module in that phase.
 */
export function PhaseJourneyMap({
  phases,
  courseTitle,
  currentPhaseOrder,
}: PhaseJourneyMapProps) {
  const nodes: JourneyMapNode[] = phases.map((phase) => {
    const firstModule = phase.modules[0];
    return {
      id: phase.sort_order,
      title: phase.title,
      description: phase.description,
      href: firstModule
        ? CURRICULUM_ROUTES.module(firstModule.slug)
        : `${CURRICULUM_ROUTES.roadmap}#${phase.slug}`,
    };
  });

  const completedPhaseIds = new Set(
    phases
      .filter((p) => p.totalCount > 0 && p.completedCount === p.totalCount)
      .map((p) => p.sort_order)
  );

  const progressByPhase = new Map(
    phases.map((p) => [
      p.sort_order,
      p.totalCount === 0
        ? 0
        : Math.round((p.completedCount / p.totalCount) * 100),
    ])
  );

  const completedCount = completedPhaseIds.size;
  const overallPct =
    phases.length === 0
      ? 0
      : Math.round(
          (phases.reduce((s, p) => s + p.completedCount, 0) /
            Math.max(
              phases.reduce((s, p) => s + p.totalCount, 0),
              1
            )) *
            100
        );

  return (
    <RoadmapJourneyMap
      nodes={nodes}
      currentNodeId={currentPhaseOrder}
      isLocked={() => false}
      isCompleted={(id) => completedPhaseIds.has(id)}
      getNodeProgress={(id) => ({
        overall: { percentage: progressByPhase.get(id) ?? 0 },
      })}
      completedCount={completedCount}
      overallPct={overallPct}
      mapLabel="Learning Roadmap"
      nodeLabel="Phase"
      finaleTitle="SupraBase Graduate"
      finaleSubtitle={`Complete all ${phases.length} phases in ${courseTitle}`}
      showSkillRoadmapLink={false}
    />
  );
}

interface PhaseModulesGridProps {
  phases: PhaseWithModules[];
}

export function PhaseModulesGrid({ phases }: PhaseModulesGridProps) {
  return (
    <div className="space-y-12">
      {phases.map((phase, index) => (
        <section key={phase.id} id={phase.slug} className="scroll-mt-24">
          <div className="mb-4">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-indigo-300/80">
              Phase {String(index + 1).padStart(2, "0")}
            </p>
            <h2 className="mt-1 font-display text-xl font-semibold text-zinc-50">
              {phase.title}
            </h2>
            <p className="mt-1 text-sm text-zinc-500">{phase.description}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {phase.modules.map((module) => (
              <Link
                key={module.id}
                href={CURRICULUM_ROUTES.module(module.slug)}
                className={cn(
                  "group rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5 transition",
                  "hover:border-indigo-500/40 hover:bg-zinc-900/70"
                )}
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span
                    className="rounded-lg px-2 py-1 text-[10px] font-semibold uppercase tracking-wider"
                    style={{
                      backgroundColor: `color-mix(in srgb, ${moduleColor(module.color)} 18%, transparent)`,
                      color: moduleColor(module.color),
                    }}
                  >
                    {module.title}
                  </span>
                  <span className="text-[11px] tabular-nums text-zinc-500">
                    {module.completedCount}/{module.totalCount}
                  </span>
                </div>
                <p className="line-clamp-2 text-sm text-zinc-400">
                  {module.description}
                </p>
                <p className="mt-3 text-[11px] uppercase tracking-wider text-zinc-600">
                  {module.estimated_duration || "—"} ·{" "}
                  {module.totalCount} lessons
                </p>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function moduleColor(token: string): string {
  const map: Record<string, string> = {
    sky: "#38bdf8",
    violet: "#a78bfa",
    orange: "#fb923c",
    pink: "#f472b6",
    amber: "#fbbf24",
    cyan: "#22d3ee",
    zinc: "#a1a1aa",
    blue: "#60a5fa",
    emerald: "#34d399",
    red: "#f87171",
    teal: "#2dd4bf",
    lime: "#a3e635",
    indigo: "#818cf8",
    fuchsia: "#e879f9",
    purple: "#c084fc",
    rose: "#fb7185",
  };
  return map[token] ?? map.indigo!;
}
