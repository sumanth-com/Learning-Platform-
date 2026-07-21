"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  PlayCircle,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CURRICULUM_ROUTES } from "@/features/curriculum/types";
import type { ModuleHubPayload } from "@/features/curriculum/actions/module-hub-actions";
import {
  findResumeTopic,
  formatModuleDuration,
  moduleDifficulty,
  moduleOutcomes,
} from "@/features/curriculum/lib/module-hub";
import { DifficultyBadge } from "@/components/curriculum/difficulty-badge";

export function ModuleOverview({
  payload,
}: {
  payload: ModuleHubPayload;
}) {
  const { detail, assignments } = payload;
  const resume = findResumeTopic(detail.lessons);
  const outcomes = moduleOutcomes(detail);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <section className="overflow-hidden rounded-2xl border border-zinc-800/80 bg-gradient-to-br from-indigo-950/40 via-zinc-900/70 to-zinc-950 p-5 sm:p-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-indigo-300/80">
          Module overview
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-50">
          {detail.module.title}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-400">
          {detail.module.description ||
            "A structured module of topics, practice, and assignments."}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <DifficultyBadge difficulty={moduleDifficulty(detail.lessons)} />
          <Meta>{formatModuleDuration(detail)}</Meta>
          <Meta>
            {detail.completedCount}/{detail.totalCount} topics done
          </Meta>
          <Meta>{assignments.length} assignments</Meta>
        </div>

        <div className="mt-5 max-w-md space-y-1.5">
          <div className="flex justify-between text-[11px] text-zinc-500">
            <span>Progress</span>
            <span className="tabular-nums">{detail.progressPercent}%</span>
          </div>
          <Progress value={detail.progressPercent} className="h-1.5" />
        </div>

        {resume ? (
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button asChild className="gap-2">
              <Link
                href={CURRICULUM_ROUTES.moduleTopic(
                  detail.module.slug,
                  resume.slug
                )}
              >
                Resume learning
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <p className="text-xs text-zinc-500">Next up: {resume.title}</p>
          </div>
        ) : null}
      </section>

      <section className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5">
        <div className="mb-3 flex items-center gap-2">
          <Target className="h-4 w-4 text-indigo-400" />
          <h3 className="text-sm font-semibold text-zinc-100">
            Learning outcomes
          </h3>
        </div>
        <ul className="space-y-2">
          {outcomes.map((item) => (
            <li key={item} className="flex gap-2 text-sm text-zinc-400">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400/80" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <QuickCard
          href={CURRICULUM_ROUTES.moduleRoadmap(detail.module.slug)}
          title="Learning roadmap"
          body={`${detail.totalCount} topics in order — track status as you go.`}
        />
        <QuickCard
          href={CURRICULUM_ROUTES.modulePractice(detail.module.slug)}
          title="Practice hub"
          body="Problems organized by difficulty and real-world scenarios."
        />
        <QuickCard
          href={CURRICULUM_ROUTES.moduleAssignments(detail.module.slug)}
          title="Assignments"
          body={
            assignments.length
              ? `${assignments.length} deliverable${assignments.length === 1 ? "" : "s"} tied to this module.`
              : "Assignments appear here when mentors publish them."
          }
        />
        <QuickCard
          href={CURRICULUM_ROUTES.moduleResources(detail.module.slug)}
          title="Resources"
          body="Docs, cheatsheets, and curated references for this module."
        />
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-100">Topics at a glance</h3>
          <Link
            href={CURRICULUM_ROUTES.moduleRoadmap(detail.module.slug)}
            className="text-xs font-medium text-indigo-300 hover:text-indigo-200"
          >
            Full roadmap
          </Link>
        </div>
        <ul className="space-y-2">
          {detail.lessons.slice(0, 5).map((lesson, index) => (
            <li key={lesson.id}>
              <Link
                href={CURRICULUM_ROUTES.moduleTopic(
                  detail.module.slug,
                  lesson.slug
                )}
                className="flex items-center gap-3 rounded-xl border border-zinc-800/80 bg-zinc-900/40 px-3 py-2.5 transition hover:border-zinc-700"
              >
                {lesson.isCompleted ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                ) : index === 0 ||
                  detail.lessons.slice(0, index).every((l) => l.isCompleted) ? (
                  <PlayCircle className="h-4 w-4 text-indigo-300" />
                ) : (
                  <Clock className="h-4 w-4 text-zinc-600" />
                )}
                <span className="min-w-0 flex-1 truncate text-sm text-zinc-200">
                  {lesson.title}
                </span>
                <span className="text-[11px] tabular-nums text-zinc-600">
                  {lesson.durationMinutes}m
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Meta({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-zinc-800 bg-zinc-950/50 px-2.5 py-1 text-[11px] text-zinc-500">
      {children}
    </span>
  );
}

function QuickCard({
  href,
  title,
  body,
}: {
  href: string;
  title: string;
  body: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 transition hover:border-zinc-700 hover:bg-zinc-900/70"
    >
      <p className="text-sm font-semibold text-zinc-100">{title}</p>
      <p className="mt-1 text-xs leading-relaxed text-zinc-500">{body}</p>
    </Link>
  );
}
