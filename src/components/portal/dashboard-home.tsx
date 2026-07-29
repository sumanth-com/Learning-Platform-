import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Clock,
  FolderKanban,
  GraduationCap,
  Layers,
  Sparkles,
  Target,
  Timer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardGreeting } from "@/components/portal/dashboard-greeting";
import { CURRICULUM_ROUTES } from "@/features/curriculum/types";
import type {
  ContinueLearningState,
  CourseJourney,
  LessonSummary,
} from "@/features/curriculum/types";
import { cn } from "@/lib/utils";

type DashboardAssignment = {
  id: string;
  title: string;
  difficulty: string;
  dueDays: number | null;
  lessonTitle: string | null;
};

type DashboardHomeProps = {
  displayName: string;
  continueState: ContinueLearningState | null;
  journey: CourseJourney | null;
  assignments?: DashboardAssignment[];
};

export function DashboardHome({
  displayName,
  continueState,
  journey,
  assignments = [],
}: DashboardHomeProps) {
  const firstName = displayName.split(" ")[0] || displayName;
  const resumeHref =
    continueState?.lesson && continueState.moduleSlug
      ? CURRICULUM_ROUTES.moduleTopic(
          continueState.moduleSlug,
          continueState.lesson.slug
        )
      : continueState?.moduleSlug
        ? CURRICULUM_ROUTES.module(continueState.moduleSlug)
        : CURRICULUM_ROUTES.roadmap;

  const stats = buildStats(journey, continueState);
  const upcomingLessons = getUpcomingLessons(journey, 5);
  const recentCompleted = getRecentCompleted(journey, 3);
  const phaseProgress = getPhaseProgress(journey, 5);
  const nextMilestone = getNextMilestone(journey);
  const dueAssignments = assignments.slice(0, 3);

  const courseTitle =
    continueState?.courseTitle ??
    journey?.course.title ??
    "Full Stack + AI Engineering";

  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-[1500px] flex-col gap-3 overflow-y-auto lg:overflow-hidden">
      {/* ── Greeting + live stats ─────────────────────── */}
      <section className="relative shrink-0 overflow-hidden rounded-2xl border border-border/70 bg-card">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 140% at 100% 0%, color-mix(in srgb, var(--color-primary) 16%, transparent) 0%, transparent 55%), radial-gradient(90% 120% at 0% 100%, color-mix(in srgb, var(--color-primary) 9%, transparent) 0%, transparent 60%)",
          }}
        />

        <div className="relative flex flex-col gap-4 p-4 xl:flex-row xl:items-center xl:gap-6">
          <div className="flex min-w-0 flex-1 items-center gap-4">
            <ProgressRing
              percent={stats.progress}
              caption={`${stats.completedModules}/${stats.totalModules} modules`}
            />
            <div className="min-w-0">
              <DashboardGreeting firstName={firstName} />
              <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[12.5px] text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <GraduationCap className="h-3.5 w-3.5" />
                  {courseTitle}
                </span>
                <span className="text-border">•</span>
                <span>
                  {stats.completedLessons} of {stats.totalLessons} lessons done
                </span>
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button asChild size="sm" className="h-8 gap-1.5">
                  <Link href={resumeHref}>
                    {continueState?.hasStarted ? "Resume" : "Start learning"}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline" className="h-8">
                  <Link href={CURRICULUM_ROUTES.roadmap}>Roadmap</Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="grid shrink-0 grid-cols-2 gap-2 sm:grid-cols-4 xl:w-[560px]">
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
        </div>
      </section>

      {/* ── Working area — fills the rest of the screen ── */}
      <div className="grid gap-3 lg:min-h-0 lg:flex-1 lg:grid-cols-12">
        {/* Continue learning + phase tracking */}
        <section className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-border/70 bg-card lg:col-span-5">
          <div className="shrink-0 p-4 pb-3">
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
              <BookOpen className="h-3.5 w-3.5" />
              Continue learning
            </div>
            <h2 className="mt-2 line-clamp-1 text-[16px] font-semibold tracking-tight text-foreground">
              {continueState?.lesson?.title ?? "Pick your next lesson"}
            </h2>
            <p className="mt-1 line-clamp-1 text-[12.5px] text-muted-foreground">
              {continueState?.phaseTitle && continueState?.moduleTitle
                ? `${continueState.phaseTitle} · ${continueState.moduleTitle}`
                : "Open your roadmap to choose where to begin."}
            </p>
            <div className="mt-2.5 flex flex-wrap items-center gap-3 text-[11.5px] text-muted-foreground">
              {continueState?.lesson ? (
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {continueState.lesson.durationMinutes} min
                </span>
              ) : null}
              <span className="inline-flex items-center gap-1.5">
                <Target className="h-3.5 w-3.5" />
                {stats.progress}% complete
              </span>
            </div>
            <Bar value={stats.progress} className="mt-3" />
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto border-t border-border/60 px-4 py-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[12.5px] font-semibold text-foreground">
                Phase progress
              </h3>
              <Link
                href={CURRICULUM_ROUTES.roadmap}
                className="text-[11.5px] font-medium text-primary hover:underline"
              >
                All phases
              </Link>
            </div>

            {phaseProgress.length === 0 ? (
              <p className="mt-2 text-[12.5px] text-muted-foreground">
                Your phases appear here once the roadmap loads.
              </p>
            ) : (
              <ul className="mt-3 space-y-2.5">
                {phaseProgress.map((phase) => (
                  <li key={phase.id}>
                    <div className="flex items-center justify-between gap-3">
                      <span className="truncate text-[12px] text-foreground">
                        {phase.title}
                      </span>
                      <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground">
                        {phase.completed}/{phase.total}
                      </span>
                    </div>
                    <Bar value={phase.percent} className="mt-1.5" thin />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* Milestone + assignments */}
        <div className="flex min-h-0 flex-col gap-3 lg:col-span-4">
          <section className="shrink-0 rounded-2xl border border-border/70 bg-card p-4">
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Next milestone
            </div>

            {nextMilestone ? (
              <>
                <h2 className="mt-2 line-clamp-1 text-[14px] font-semibold text-foreground">
                  Finish {nextMilestone.title}
                </h2>
                <p className="mt-1 text-[12px] text-muted-foreground">
                  {nextMilestone.remaining}{" "}
                  {nextMilestone.remaining === 1 ? "lesson" : "lessons"} left ·
                  about {formatMinutes(nextMilestone.minutes)}
                </p>
                <Bar value={nextMilestone.percent} className="mt-2.5" />
                <Link
                  href={CURRICULUM_ROUTES.module(nextMilestone.slug)}
                  className="mt-2.5 inline-flex items-center gap-1.5 text-[12px] font-medium text-primary hover:underline"
                >
                  Open module
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </>
            ) : (
              <>
                <h2 className="mt-2 text-[14px] font-semibold text-foreground">
                  {stats.totalLessons > 0 &&
                  stats.completedLessons === stats.totalLessons
                    ? "Course complete"
                    : "Start your first module"}
                </h2>
                <p className="mt-1 text-[12px] text-muted-foreground">
                  {stats.totalLessons > 0 &&
                  stats.completedLessons === stats.totalLessons
                    ? "Every module is done. Try a certification next."
                    : "Choose a module from the roadmap to set a milestone."}
                </p>
              </>
            )}
          </section>

          <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-border/70 bg-card p-4">
            <div className="flex shrink-0 items-center justify-between">
              <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
                <ClipboardList className="h-3.5 w-3.5" />
                Assignments due
              </div>
              <Link
                href="/assignments"
                className="text-[11.5px] font-medium text-primary hover:underline"
              >
                View all
              </Link>
            </div>

            {dueAssignments.length === 0 ? (
              <p className="mt-3 text-[12.5px] text-muted-foreground">
                Nothing due right now. Nice work staying ahead.
              </p>
            ) : (
              <ul className="mt-3 min-h-0 flex-1 space-y-2 overflow-y-auto">
                {dueAssignments.map((a) => (
                  <li key={a.id}>
                    <Link
                      href={`/assignment/${a.id}`}
                      className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/30 px-3 py-2 transition hover:border-border hover:bg-muted/60"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-[12.5px] text-foreground">
                          {a.title}
                        </span>
                        <span className="text-[11px] capitalize text-muted-foreground">
                          {a.lessonTitle ?? a.difficulty}
                          {a.dueDays != null ? ` · due in ${a.dueDays}d` : ""}
                        </span>
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {/* Up next + activity + shortcuts */}
        <div className="flex min-h-0 flex-col gap-3 lg:col-span-3">
          <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-border/70 bg-card p-4">
            <div className="flex shrink-0 items-center justify-between">
              <h2 className="text-[12.5px] font-semibold text-foreground">
                Up next
              </h2>
              <Link
                href={resumeHref}
                className="text-[11.5px] font-medium text-primary hover:underline"
              >
                Path
              </Link>
            </div>

            {upcomingLessons.length === 0 ? (
              <p className="mt-3 text-[12.5px] text-muted-foreground">
                All caught up — every lesson is complete.
              </p>
            ) : (
              <ul className="mt-2 min-h-0 flex-1 space-y-0.5 overflow-y-auto">
                {upcomingLessons.map((lesson, index) => {
                  const moduleSlug = findLessonModuleSlug(journey, lesson.id);
                  return (
                    <li key={lesson.id}>
                      <Link
                        href={
                          moduleSlug
                            ? CURRICULUM_ROUTES.moduleTopic(
                                moduleSlug,
                                lesson.slug
                              )
                            : CURRICULUM_ROUTES.roadmap
                        }
                        className="flex items-center gap-2.5 rounded-lg px-1.5 py-1.5 transition hover:bg-muted/50"
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-border bg-muted/40 text-[9.5px] font-semibold tabular-nums text-muted-foreground">
                          {index + 1}
                        </span>
                        <span className="min-w-0 flex-1 truncate text-[12px] text-foreground">
                          {lesson.title}
                        </span>
                        <span className="shrink-0 text-[10.5px] tabular-nums text-muted-foreground">
                          {lesson.durationMinutes}m
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-border/70 bg-card p-4">
            <h2 className="shrink-0 text-[12.5px] font-semibold text-foreground">
              Recent activity
            </h2>

            {recentCompleted.length === 0 ? (
              <p className="mt-3 text-[12.5px] text-muted-foreground">
                Complete a lesson and it shows up here.
              </p>
            ) : (
              <ul className="mt-2 min-h-0 flex-1 space-y-0.5 overflow-y-auto">
                {recentCompleted.map((lesson) => (
                  <li
                    key={lesson.id}
                    className="flex items-center gap-2 rounded-lg px-1.5 py-1.5"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                    <span className="min-w-0 flex-1 truncate text-[12px] text-foreground">
                      {lesson.title}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <div className="grid shrink-0 grid-cols-2 gap-3">
            <QuickCard href="/projects" icon={FolderKanban} title="Projects" />
            <QuickCard
              href="/certifications"
              icon={Award}
              title="Certifications"
            />
          </div>
        </div>
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

function getPhaseProgress(journey: CourseJourney | null, limit: number) {
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
        title: phase.title,
        completed,
        total,
        percent: total > 0 ? Math.round((completed / total) * 100) : 0,
      };
    })
    .filter((p) => p.total > 0)
    .slice(0, limit);
}

/** First module that is started or next in line — the nearest real goal. */
function getNextMilestone(journey: CourseJourney | null) {
  if (!journey) return null;
  for (const phase of journey.phases) {
    for (const module of phase.modules) {
      if (module.totalCount === 0) continue;
      if (module.completedCount >= module.totalCount) continue;
      const remainingLessons = module.lessons.filter((l) => !l.isCompleted);
      return {
        title: module.title,
        slug: module.slug,
        remaining: remainingLessons.length,
        minutes: remainingLessons.reduce(
          (sum, l) => sum + l.durationMinutes,
          0
        ),
        percent: module.progressPercent,
      };
    }
  }
  return null;
}

function getUpcomingLessons(
  journey: CourseJourney | null,
  limit: number
): LessonSummary[] {
  if (!journey) return [];
  const flat: LessonSummary[] = [];
  for (const phase of journey.phases) {
    for (const module of phase.modules) {
      for (const lesson of module.lessons) {
        if (!lesson.isCompleted) flat.push(lesson);
      }
    }
  }
  return flat.slice(0, limit);
}

function findLessonModuleSlug(
  journey: CourseJourney | null,
  lessonId: string
): string | null {
  if (!journey) return null;
  for (const phase of journey.phases) {
    for (const module of phase.modules) {
      if (module.lessons.some((l) => l.id === lessonId)) return module.slug;
    }
  }
  return null;
}

function getRecentCompleted(
  journey: CourseJourney | null,
  limit: number
): LessonSummary[] {
  if (!journey) return [];
  const flat: LessonSummary[] = [];
  for (const phase of journey.phases) {
    for (const module of phase.modules) {
      for (const lesson of module.lessons) {
        if (lesson.isCompleted) flat.push(lesson);
      }
    }
  }
  return flat.slice(-limit).reverse();
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

function ProgressRing({
  percent,
  caption,
}: {
  percent: number;
  caption: string;
}) {
  const size = 104;
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, percent));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className="relative hidden shrink-0 items-center justify-center sm:flex">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          className="stroke-border"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="stroke-primary transition-[stroke-dashoffset] duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[21px] font-semibold tabular-nums leading-none text-foreground">
          {clamped}%
        </span>
        <span className="mt-1 text-[9.5px] text-muted-foreground">
          {caption}
        </span>
      </div>
    </div>
  );
}

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
    <div className="rounded-xl border border-border/70 bg-background/50 p-3">
      <span
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-lg border",
          ACCENTS[accent]
        )}
      >
        <Icon className="h-3.5 w-3.5" />
      </span>
      <p className="mt-2 text-[17px] font-semibold tabular-nums leading-none text-foreground">
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

function Bar({
  value,
  className,
  thin,
}: {
  value: number;
  className?: string;
  thin?: boolean;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-full bg-muted",
        thin ? "h-1" : "h-1.5",
        className
      )}
    >
      <div
        className="h-full rounded-full bg-primary transition-[width] duration-700"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

function QuickCard({
  href,
  icon: Icon,
  title,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-start gap-2 rounded-2xl border border-border/70 bg-card p-3 transition hover:border-primary/40 hover:bg-muted/40"
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-muted/40 text-foreground">
        <Icon className="h-3.5 w-3.5" />
      </span>
      <p className="text-[12px] font-semibold text-foreground">{title}</p>
    </Link>
  );
}
