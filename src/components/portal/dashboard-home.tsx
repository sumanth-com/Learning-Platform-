import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  CalendarDays,
  Clock,
  Flame,
  FolderKanban,
  Target,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CURRICULUM_ROUTES } from "@/features/curriculum/types";
import type {
  ContinueLearningState,
  CourseJourney,
} from "@/features/curriculum/types";

type DashboardHomeProps = {
  displayName: string;
  continueState: ContinueLearningState | null;
  journey: CourseJourney | null;
};

export function DashboardHome({
  displayName,
  continueState,
  journey,
}: DashboardHomeProps) {
  const firstName = displayName.split(" ")[0] || displayName;
  const resumeHref = continueState?.lesson
    ? CURRICULUM_ROUTES.learnLesson(
        continueState.courseSlug,
        continueState.lesson.slug
      )
    : CURRICULUM_ROUTES.learn(
        continueState?.courseSlug ?? journey?.course.slug ?? "full-stack-ai-engineering"
      );

  const nextLesson = continueState?.lesson;
  const recentCompleted =
    journey?.phases
      .flatMap((p) =>
        p.modules.flatMap((m) =>
          m.lessons
            .filter((l) => l.isCompleted)
            .map((l) => ({ ...l, moduleTitle: m.title, phaseTitle: p.title }))
        )
      )
      .slice(-4)
      .reverse() ?? [];

  const upcomingModules =
    journey?.phases
      .flatMap((p) =>
        p.modules
          .filter((m) => m.completedCount < m.totalCount)
          .map((m) => ({ ...m, phaseTitle: p.title }))
      )
      .slice(0, 4) ?? [];

  const streak = Math.max(
    1,
    Math.min(30, Math.ceil((continueState?.completedCount ?? 0) / 2) || 1)
  );
  const studyMinutes =
    (continueState?.completedCount ?? 0) *
    (continueState?.lesson?.durationMinutes ?? 25);

  const weekBars = Array.from({ length: 7 }, (_, i) => {
    const base = continueState?.progressPercent ?? 0;
    return Math.min(100, Math.max(8, ((base / 7) * (i + 1) + i * 4) % 100));
  });

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300/80">
          Dashboard
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
          Welcome back, {firstName}
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
          Continue your{" "}
          <span className="text-zinc-200">
            {continueState?.courseTitle ??
              journey?.course.title ??
              "Full Stack + AI Engineering"}
          </span>{" "}
          journey.
        </p>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <div className="overflow-hidden rounded-2xl border border-zinc-800/80 bg-gradient-to-br from-indigo-950/50 via-zinc-900/70 to-zinc-950 p-6 xl:col-span-2">
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-300/80">
            <BookOpen className="h-3.5 w-3.5" />
            Continue learning
          </div>
          <h2 className="font-display text-2xl text-zinc-50">
            {continueState?.lesson?.title ?? "Start your next lesson"}
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            {continueState?.phaseTitle && continueState?.moduleTitle
              ? `${continueState.phaseTitle} · ${continueState.moduleTitle}`
              : "Open the learning workspace to begin."}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-zinc-500">
            {continueState?.lesson ? (
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {continueState.lesson.durationMinutes} min
              </span>
            ) : null}
            <span>
              Progress {continueState?.progressPercent ?? 0}% ·{" "}
              {continueState?.completedCount ?? 0}/
              {continueState?.totalCount ?? 0}
            </span>
          </div>
          <Progress
            value={continueState?.progressPercent ?? 0}
            className="mt-4 h-2"
          />
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg" className="gap-2">
              <Link href={resumeHref}>
                Resume
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href={CURRICULUM_ROUTES.journey}>View journey</Link>
            </Button>
            {nextLesson ? (
              <p className="flex items-center text-xs text-zinc-500">
                Next up:{" "}
                <span className="ml-1 font-medium text-zinc-300">
                  {nextLesson.title}
                </span>
              </p>
            ) : null}
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6">
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
            <Target className="h-3.5 w-3.5 text-indigo-400" />
            Today&apos;s goal
          </div>
          <p className="font-display text-xl text-zinc-50">
            Complete 1 lesson
          </p>
          <p className="mt-2 text-sm text-zinc-500">
            Stay consistent — one focused lesson keeps your streak alive.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Metric
              icon={Flame}
              label="Streak"
              value={`${streak}d`}
            />
            <Metric
              icon={Clock}
              label="Study time"
              value={`${studyMinutes}m`}
            />
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          icon={TrendingUp}
          label="Progress"
          value={`${continueState?.progressPercent ?? 0}%`}
          hint={`${continueState?.completedCount ?? 0} lessons done`}
        />
        <Stat
          icon={Flame}
          label="Study streak"
          value={`${streak} days`}
          hint="Keep learning daily"
        />
        <Stat
          icon={Clock}
          label="Study time"
          value={`${studyMinutes} min`}
          hint="Based on completed lessons"
        />
        <Stat
          icon={CalendarDays}
          label="Weekly activity"
          value="On track"
          hint="Last 7 days"
        />
      </section>

      <section className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-100">
            Weekly activity
          </h2>
          <span className="text-xs text-zinc-500">Mon – Sun</span>
        </div>
        <div className="flex h-28 items-end gap-2">
          {weekBars.map((h, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-2">
              <div
                className="w-full rounded-t-md bg-gradient-to-t from-indigo-600/80 to-indigo-400/60"
                style={{ height: `${h}%` }}
              />
              <span className="text-[10px] text-zinc-600">
                {"MTWTFSS"[i]}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Panel title="Recent lessons" icon={BookOpen}>
          {recentCompleted.length === 0 ? (
            <Empty text="Complete a lesson to see it here." />
          ) : (
            <ul className="space-y-2">
              {recentCompleted.map((lesson) => (
                <li key={lesson.id}>
                  <Link
                    href={CURRICULUM_ROUTES.learnLesson(
                      journey!.course.slug,
                      lesson.slug
                    )}
                    className="flex items-center justify-between rounded-xl border border-zinc-800/70 bg-zinc-950/40 px-3 py-2.5 transition hover:border-zinc-700"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm text-zinc-200">
                        {lesson.title}
                      </p>
                      <p className="truncate text-xs text-zinc-500">
                        {lesson.moduleTitle}
                      </p>
                    </div>
                    <Badge variant="success">Done</Badge>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Available modules" icon={FolderKanban}>
          {upcomingModules.length === 0 ? (
            <Empty text="All modules complete — incredible work." />
          ) : (
            <ul className="space-y-2">
              {upcomingModules.map((module) => (
                <li key={module.id}>
                  <Link
                    href={CURRICULUM_ROUTES.module(module.slug)}
                    className="block rounded-xl border border-zinc-800/70 bg-zinc-950/40 px-3 py-2.5 transition hover:border-zinc-700"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm text-zinc-200">
                        {module.title}
                      </p>
                      <span className="text-[11px] tabular-nums text-zinc-500">
                        {module.completedCount}/{module.totalCount}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-zinc-500">
                      {module.phaseTitle}
                      {module.estimated_duration
                        ? ` · ${module.estimated_duration}`
                        : ""}
                    </p>
                    <Progress
                      value={module.progressPercent}
                      className="mt-2 h-1"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <FeatureCard
          title="Assignments due"
          body="Practice by shipping real work tied to each lesson."
          href="/assignments"
          cta="View assignments"
        />
        <FeatureCard
          title="Achievements"
          body={`${continueState?.completedCount ?? 0} lessons completed on your path.`}
          href={CURRICULUM_ROUTES.journey}
          cta="See journey"
          icon={Award}
        />
        <FeatureCard
          title="Recent projects"
          body="Build portfolio pieces as you progress through modules."
          href="/projects"
          cta="Open projects"
        />
      </section>
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-3">
      <div className="mb-2 flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-zinc-500">
        <Icon className="h-3 w-3 text-indigo-400" />
        {label}
      </div>
      <p className="text-lg font-semibold text-zinc-100">{value}</p>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950 text-indigo-400">
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-xs uppercase tracking-wider text-zinc-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-zinc-100">{value}</p>
      <p className="mt-1 text-xs text-zinc-600">{hint}</p>
    </div>
  );
}

function Panel({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5">
      <div className="mb-4 flex items-center gap-2">
        <Icon className="h-4 w-4 text-indigo-400" />
        <h2 className="text-sm font-semibold text-zinc-100">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="text-sm text-zinc-500">{text}</p>;
}

function FeatureCard({
  title,
  body,
  href,
  cta,
  icon: Icon = FolderKanban,
}: {
  title: string;
  body: string;
  href: string;
  cta: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950 text-indigo-400">
        <Icon className="h-4 w-4" />
      </div>
      <h3 className="text-sm font-semibold text-zinc-100">{title}</h3>
      <p className="mt-2 text-sm text-zinc-500">{body}</p>
      <Link
        href={href}
        className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-indigo-300 hover:text-indigo-200"
      >
        {cta}
        <ArrowRight className="h-3 w-3" />
      </Link>
    </div>
  );
}
