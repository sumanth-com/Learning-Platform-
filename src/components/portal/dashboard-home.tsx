import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Clock,
  Flame,
  FolderKanban,
  Target,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CURRICULUM_ROUTES } from "@/features/curriculum/types";
import type {
  ContinueLearningState,
  CourseJourney,
  LessonSummary,
} from "@/features/curriculum/types";

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

  const upcomingLessons = getUpcomingLessons(journey, 4);
  const recentCompleted = getRecentCompleted(journey, 3);

  const streak = Math.max(
    1,
    Math.min(30, Math.ceil((continueState?.completedCount ?? 0) / 2) || 1)
  );
  const studyMinutes =
    (continueState?.completedCount ?? 0) *
    (continueState?.lesson?.durationMinutes ?? 25);
  const progress = continueState?.progressPercent ?? 0;
  const courseTitle =
    continueState?.courseTitle ??
    journey?.course.title ??
    "Full Stack + AI Engineering";

  const dueAssignments = assignments.slice(0, 3);

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 overflow-hidden">
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold tracking-tight text-zinc-50 sm:text-2xl">
            Welcome back, {firstName}
          </h1>
          <p className="mt-0.5 truncate text-xs text-zinc-500">{courseTitle}</p>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <StatChip icon={TrendingUp} label="Progress" value={`${progress}%`} />
          <StatChip icon={Flame} label="Streak" value={`${streak}d`} />
          <StatChip icon={Clock} label="Study" value={`${studyMinutes}m`} />
        </div>
      </header>

      <div className="grid min-h-0 flex-1 gap-3 lg:grid-cols-12 lg:grid-rows-[auto_1fr]">
        {/* Continue Learning — primary */}
        <section className="flex min-h-0 flex-col justify-between rounded-xl border border-zinc-800/80 bg-gradient-to-br from-indigo-950/40 via-zinc-900/60 to-zinc-950 p-4 lg:col-span-7 lg:row-span-1">
          <div>
            <div className="mb-1.5 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-indigo-300/80">
              <BookOpen className="h-3 w-3" />
              Continue learning
            </div>
            <h2 className="text-lg font-semibold tracking-tight text-zinc-50">
              {continueState?.lesson?.title ?? "Start your next lesson"}
            </h2>
            <p className="mt-1 line-clamp-1 text-xs text-zinc-400">
              {continueState?.phaseTitle && continueState?.moduleTitle
                ? `${continueState.phaseTitle} · ${continueState.moduleTitle}`
                : "Open your roadmap to begin."}
            </p>
            <div className="mt-2 flex items-center gap-3 text-[11px] text-zinc-500">
              {continueState?.lesson ? (
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {continueState.lesson.durationMinutes} min
                </span>
              ) : null}
              <span>
                {continueState?.completedCount ?? 0}/
                {continueState?.totalCount ?? 0} lessons
              </span>
            </div>
            <Progress value={progress} className="mt-3 h-1.5" />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button asChild size="sm" className="gap-1.5">
              <Link href={resumeHref}>
                Resume
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href={CURRICULUM_ROUTES.roadmap}>
                Roadmap
              </Link>
            </Button>
          </div>
        </section>

        {/* Today's Goal + Assignments */}
        <div className="grid gap-3 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
          <section className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3.5">
            <div className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
              <Target className="h-3 w-3 text-indigo-400" />
              Today&apos;s goal
            </div>
            <p className="text-sm font-semibold text-zinc-50">
              Complete 1 lesson
            </p>
            <p className="mt-1 text-[11px] text-zinc-500">
              Stay consistent — one focused lesson keeps your streak alive.
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <MiniMetric label="Streak" value={`${streak}d`} />
              <MiniMetric label="Study" value={`${studyMinutes}m`} />
            </div>
          </section>

          <section className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3.5">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                <ClipboardList className="h-3 w-3 text-indigo-400" />
                Assignments due
              </div>
              <Link
                href="/assignments"
                className="text-[11px] font-medium text-indigo-300 hover:text-indigo-200"
              >
                View all
              </Link>
            </div>
            {dueAssignments.length === 0 ? (
              <p className="text-xs text-zinc-500">No open assignments.</p>
            ) : (
              <ul className="space-y-1.5">
                {dueAssignments.map((a) => (
                  <li key={a.id}>
                    <Link
                      href={`/assignment/${a.id}`}
                      className="flex items-center justify-between gap-2 rounded-lg border border-zinc-800/60 bg-zinc-950/40 px-2.5 py-2 transition hover:border-zinc-700"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-xs text-zinc-200">
                          {a.title}
                        </span>
                        <span className="text-[10px] text-zinc-600">
                          {a.lessonTitle ?? a.difficulty}
                          {a.dueDays != null ? ` · ${a.dueDays}d` : ""}
                        </span>
                      </span>
                      <ArrowRight className="h-3 w-3 shrink-0 text-zinc-600" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {/* Upcoming + Activity + Projects/Achievements */}
        <section className="min-h-0 overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3.5 lg:col-span-4">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-xs font-semibold text-zinc-100">
              Upcoming lessons
            </h2>
            <Link
              href={resumeHref}
              className="text-[11px] font-medium text-indigo-300 hover:text-indigo-200"
            >
              Path
            </Link>
          </div>
          {upcomingLessons.length === 0 ? (
            <p className="text-xs text-zinc-500">All caught up.</p>
          ) : (
            <ul className="space-y-1.5">
              {upcomingLessons.map((lesson) => {
                const moduleSlug = findLessonModuleSlug(journey, lesson.id);
                return (
                <li key={lesson.id}>
                  <Link
                    href={
                      moduleSlug
                        ? CURRICULUM_ROUTES.moduleTopic(moduleSlug, lesson.slug)
                        : CURRICULUM_ROUTES.roadmap
                    }
                    className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 transition hover:bg-zinc-950/60"
                  >
                    <span className="truncate text-xs text-zinc-300">
                      {lesson.title}
                    </span>
                    <span className="shrink-0 text-[10px] tabular-nums text-zinc-600">
                      {lesson.durationMinutes}m
                    </span>
                  </Link>
                </li>
              );
              })}
            </ul>
          )}
        </section>

        <section className="min-h-0 overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3.5 lg:col-span-4">
          <h2 className="mb-2 text-xs font-semibold text-zinc-100">
            Recent activity
          </h2>
          {recentCompleted.length === 0 ? (
            <p className="text-xs text-zinc-500">
              Complete a lesson to see activity here.
            </p>
          ) : (
            <ul className="space-y-1.5">
              {recentCompleted.map((lesson) => (
                <li
                  key={lesson.id}
                  className="flex items-center gap-2 rounded-lg px-2 py-1.5"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                  <span className="truncate text-xs text-zinc-300">
                    {lesson.title}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="grid min-h-0 grid-cols-2 gap-3 lg:col-span-4">
          <QuickCard
            href="/projects"
            icon={FolderKanban}
            title="Projects"
            body="Build portfolio pieces as you advance."
          />
          <QuickCard
            href={CURRICULUM_ROUTES.roadmap}
            icon={Award}
            title="Achievements"
            body={`${continueState?.completedCount ?? 0} lessons completed.`}
          />
        </section>
      </div>
    </div>
  );
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

function StatChip({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/60 px-2.5 py-1">
      <Icon className="h-3 w-3 text-indigo-400" />
      <span className="text-[10px] text-zinc-500">{label}</span>
      <span className="text-xs font-semibold tabular-nums text-zinc-100">
        {value}
      </span>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950/50 px-2.5 py-2">
      <p className="text-[10px] uppercase tracking-wide text-zinc-600">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-zinc-100">{value}</p>
    </div>
  );
}

function QuickCard({
  href,
  icon: Icon,
  title,
  body,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3.5 transition hover:border-zinc-700 hover:bg-zinc-900/70"
    >
      <Icon className="h-4 w-4 text-indigo-400" />
      <p className="mt-2 text-xs font-semibold text-zinc-100">{title}</p>
      <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-zinc-500">
        {body}
      </p>
    </Link>
  );
}
