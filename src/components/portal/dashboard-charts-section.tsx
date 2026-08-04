"use client";

import dynamic from "next/dynamic";
import { BarChart3, PieChart } from "lucide-react";
import Link from "next/link";
import { CURRICULUM_ROUTES } from "@/features/curriculum/types";
import type { PhasePoint } from "@/components/portal/dashboard-charts";
import { cn } from "@/lib/utils";

const PhaseCompletionChart = dynamic(
  () =>
    import("@/components/portal/dashboard-charts").then(
      (m) => m.PhaseCompletionChart
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full animate-pulse rounded-lg bg-muted/40" />
    ),
  }
);

const TimeSplitChart = dynamic(
  () =>
    import("@/components/portal/dashboard-charts").then(
      (m) => m.TimeSplitChart
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full animate-pulse rounded-lg bg-muted/40" />
    ),
  }
);

function formatMinutes(mins: number) {
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

function LegendItem({
  swatch,
  label,
  value,
}: {
  swatch: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <span className={cn("h-2 w-2 shrink-0 rounded-full", swatch)} />
      <span className="truncate text-muted-foreground">{label}</span>
      <span className="font-semibold tabular-nums text-foreground">{value}</span>
    </div>
  );
}

export function DashboardChartsSection({
  phasePoints,
  investedMinutes,
  remainingMinutes,
  percent,
}: {
  phasePoints: PhasePoint[];
  investedMinutes: number;
  remainingMinutes: number;
  percent: number;
}) {
  return (
    <div className="grid shrink-0 gap-2.5 sm:gap-3 lg:grid-cols-12">
      <section className="flex min-h-0 flex-col overflow-hidden rounded-[1.25rem] border border-border/60 bg-card p-3.5 sm:p-4 max-md:rounded-2xl lg:col-span-8">
        <div className="flex shrink-0 items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
            <BarChart3 className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">Completion by phase</span>
          </div>
          <Link
            href={CURRICULUM_ROUTES.roadmap}
            className="shrink-0 text-[11px] font-semibold tracking-tight text-primary hover:underline"
          >
            All phases
          </Link>
        </div>
        <div className="mt-2.5 h-[10.5rem] min-w-0 sm:mt-3 sm:h-[12rem]">
          <PhaseCompletionChart data={phasePoints} />
        </div>
      </section>

      <section className="hidden min-h-0 flex-col overflow-hidden rounded-[1.25rem] border border-border/60 bg-card p-3.5 sm:p-4 lg:col-span-4 lg:flex">
        <div className="flex shrink-0 items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
          <PieChart className="h-3.5 w-3.5" />
          Time split
        </div>
        <div className="mt-3 h-[12rem] min-w-0">
          <TimeSplitChart
            investedMinutes={investedMinutes}
            remainingMinutes={remainingMinutes}
            percent={percent}
          />
        </div>
        <div className="mt-3 flex shrink-0 items-center justify-between gap-3 text-[11.5px]">
          <LegendItem
            swatch="bg-brand"
            label="Invested"
            value={formatMinutes(investedMinutes)}
          />
          <LegendItem
            swatch="bg-border"
            label="Remaining"
            value={formatMinutes(remainingMinutes)}
          />
        </div>
      </section>
    </div>
  );
}
