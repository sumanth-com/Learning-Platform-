import Link from "next/link";
import {
  BarChart3,
  CheckCircle2,
  Clock,
  Layers,
  PieChart,
  Timer,
} from "lucide-react";
import { DashboardGreeting } from "@/components/portal/dashboard-greeting";
import { DashboardDateTime } from "@/components/portal/dashboard-datetime";
import {
  PhaseCompletionChart,
  TimeSplitChart,
  type PhasePoint,
} from "@/components/portal/dashboard-charts";
import { CURRICULUM_ROUTES } from "@/features/curriculum/types";
import type {
  ContinueLearningState,
  CourseJourney,
} from "@/features/curriculum/types";
import { cn } from "@/lib/utils";

type DashboardHomeProps = {
  displayName: string;
  continueState: ContinueLearningState | null;
  journey: CourseJourney | null;
  assignments?: unknown[];
};

export function DashboardHome({
  displayName,
  continueState,
  journey,
}: DashboardHomeProps) {
  const firstName = displayName.split(" ")[0] || displayName;

  const stats = buildStats(journey, continueState);
  const phasePoints = getPhasePoints(journey, 6);

  const courseTitle =
    continueState?.courseTitle ??
    journey?.course.title ??
    "Full Stack + AI Engineering";
  const heroMessage = buildHeroMessage(stats, courseTitle);

  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-[1500px] flex-col gap-3 overflow-hidden">
      {/* ── Welcome ───────────────────────────────────── */}
      <section className="relative shrink-0 overflow-hidden rounded-2xl border border-border/70 bg-card">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 140% at 100% 0%, color-mix(in srgb, var(--color-primary) 16%, transparent) 0%, transparent 55%), radial-gradient(90% 120% at 0% 100%, color-mix(in srgb, var(--color-primary) 9%, transparent) 0%, transparent 60%)",
          }}
        />

        <div className="relative flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-5">
          <div className="min-w-0">
            <DashboardGreeting firstName={firstName} message={heroMessage} />
          </div>

          <DashboardDateTime />
        </div>
      </section>

      {/* ── Key numbers ───────────────────────────────── */}
      <div className="grid shrink-0 grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          icon={CheckCircle2}
          label="Lessons done"
          value={`${stats.completedLessons}`}
          hint={`${stats.remainingLessons} left`}
          accent="emerald"
        />
        <StatCard
          icon={Layers}
          label="Modules done"
          value={`${stats.completedModules}`}
          hint={`of ${stats.totalModules}`}
          accent="violet"
        />
        <StatCard
          icon={Clock}
          label="Time invested"
          value={formatMinutes(stats.investedMinutes)}
          hint="completed work"
          accent="sky"
        />
        <StatCard
          icon={Timer}
          label="Time to finish"
          value={formatMinutes(stats.remainingMinutes)}
          hint="remaining"
          accent="amber"
        />
      </div>

      {/* ── Charts ────────────────────────────────────── */}
      <div className="grid min-h-0 flex-1 gap-3 lg:grid-cols-12">
        <section className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-border/70 bg-card p-4 lg:col-span-8">
          <div className="flex shrink-0 items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
              <BarChart3 className="h-3.5 w-3.5" />
              Completion by phase
            </div>
            <Link
              href={CURRICULUM_ROUTES.roadmap}
              className="text-[11.5px] font-medium text-primary hover:underline"
            >
              All phases
            </Link>
          </div>
          <div className="mt-3 min-h-0 flex-1">
            <PhaseCompletionChart data={phasePoints} />
          </div>
        </section>

        <section className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-border/70 bg-card p-4 lg:col-span-4">
          <div className="flex shrink-0 items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
            <PieChart className="h-3.5 w-3.5" />
            Time split
          </div>
          <div className="mt-3 min-h-0 flex-1">
            <TimeSplitChart
              investedMinutes={stats.investedMinutes}
              remainingMinutes={stats.remainingMinutes}
              percent={stats.progress}
            />
          </div>
          <div className="mt-3 flex shrink-0 items-center justify-between gap-3 text-[11.5px]">
            <LegendItem
              swatch="bg-brand"
              label="Invested"
              value={formatMinutes(stats.investedMinutes)}
            />
            <LegendItem
              swatch="bg-border"
              label="Remaining"
              value={formatMinutes(stats.remainingMinutes)}
            />
          </div>
        </section>
      </div>
    </div>
  );
}

/* ─────────────────── data helpers ─────────────────── */

function buildStats(
  journey: CourseJourney | null,
  continueState: ContinueLearningState | null
) {
  let completedLessons = 0;
  let totalLessons = 0;
  let investedMinutes = 0;
  let remainingMinutes = 0;
  let completedModules = 0;
  let totalModules = 0;

  for (const phase of journey?.phases ?? []) {
    for (const module of phase.modules) {
      totalModules += 1;
      if (module.totalCount > 0 && module.completedCount === module.totalCount) {
        completedModules += 1;
      }
      for (const lesson of module.lessons) {
        totalLessons += 1;
        if (lesson.isCompleted) {
          completedLessons += 1;
          investedMinutes += lesson.durationMinutes;
        } else {
          remainingMinutes += lesson.durationMinutes;
        }
      }
    }
  }

  if (totalLessons === 0) {
    completedLessons = continueState?.completedCount ?? 0;
    totalLessons = continueState?.totalCount ?? 0;
  }

  const progress =
    journey?.progressPercent ??
    continueState?.progressPercent ??
    (totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0);

  return {
    completedLessons,
    totalLessons,
    remainingLessons: Math.max(0, totalLessons - completedLessons),
    investedMinutes,
    remainingMinutes,
    completedModules,
    totalModules,
    progress,
  };
}

type DashboardStats = ReturnType<typeof buildStats>;

function buildHeroMessage(stats: DashboardStats, courseTitle: string) {
  if (stats.totalLessons === 0) {
    return "Your learning path is getting ready — check back in a moment.";
  }
  if (stats.completedLessons === 0) {
    return `${courseTitle} is ready when you are. One short lesson is enough to start the streak.`;
  }
  if (stats.completedLessons >= stats.totalLessons) {
    return "Every lesson is finished. A certification is the natural next step.";
  }
  const left = stats.remainingLessons;
  return `You're ${stats.progress}% through ${courseTitle} — ${left} ${
    left === 1 ? "lesson" : "lessons"
  } to go. Keep the momentum.`;
}

function getPhasePoints(
  journey: CourseJourney | null,
  limit: number
): PhasePoint[] {
  if (!journey) return [];
  return journey.phases
    .map((phase) => {
      const total = phase.modules.reduce((sum, m) => sum + m.totalCount, 0);
      const completed = phase.modules.reduce(
        (sum, m) => sum + m.completedCount,
        0
      );
      return {
        id: phase.id,
        label: phase.title,
        short: shortPhaseLabel(phase.title),
        completed,
        total,
        percent: total > 0 ? Math.round((completed / total) * 100) : 0,
      };
    })
    .filter((p) => p.total > 0)
    .slice(0, limit);
}

/** Axis labels stay on one line, so keep them to a single short word. */
function shortPhaseLabel(title: string) {
  const first = title.split(/[\s·—-]+/)[0] ?? title;
  return first.length > 11 ? `${first.slice(0, 10)}…` : first;
}

function formatMinutes(total: number) {
  if (total <= 0) return "0m";
  const hours = Math.floor(total / 60);
  const mins = total % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

/* ─────────────────── ui pieces ─────────────────── */

const ACCENTS = {
  emerald: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
  violet: "text-violet-500 bg-violet-500/10 border-violet-500/20",
  sky: "text-sky-500 bg-sky-500/10 border-sky-500/20",
  amber: "text-amber-500 bg-amber-500/10 border-amber-500/20",
} as const;

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  hint: string;
  accent: keyof typeof ACCENTS;
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card p-3.5">
      <span
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-lg border",
          ACCENTS[accent]
        )}
      >
        <Icon className="h-3.5 w-3.5" />
      </span>
      <p className="mt-2.5 text-[18px] font-semibold tabular-nums leading-none text-foreground">
        {value}
      </p>
      <p className="mt-1.5 text-[11px] font-medium leading-none text-foreground">
        {label}
      </p>
      <p className="mt-1 text-[10.5px] leading-none text-muted-foreground">
        {hint}
      </p>
    </div>
  );
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
    <span className="inline-flex min-w-0 items-center gap-1.5">
      <span className={cn("h-2 w-2 shrink-0 rounded-full", swatch)} />
      <span className="truncate text-muted-foreground">{label}</span>
      <span className="shrink-0 font-medium tabular-nums text-foreground">
        {value}
      </span>
    </span>
  );
}
