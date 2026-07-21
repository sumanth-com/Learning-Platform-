"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle2,
  Circle,
  Clock,
  PlayCircle,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { DifficultyBadge } from "@/components/curriculum/difficulty-badge";
import { CURRICULUM_ROUTES } from "@/features/curriculum/types";
import type { ModuleHubPayload } from "@/features/curriculum/actions/module-hub-actions";
import { findResumeTopic } from "@/features/curriculum/lib/module-hub";
import { prefetchModuleTopic } from "@/features/curriculum/hooks/use-module-hub";
import { cn } from "@/lib/utils";

export function ModuleRoadmap({ payload }: { payload: ModuleHubPayload }) {
  const { detail } = payload;
  const resume = findResumeTopic(detail.lessons);
  const queryClient = useQueryClient();

  useEffect(() => {
    const idx = resume
      ? detail.lessons.findIndex((l) => l.id === resume.id)
      : 0;
    const neighbors = [
      detail.lessons[idx - 1]?.slug,
      detail.lessons[idx]?.slug,
      detail.lessons[idx + 1]?.slug,
    ];
    for (const slug of neighbors) {
      prefetchModuleTopic(queryClient, detail.module.slug, slug);
    }
  }, [detail.lessons, detail.module.slug, queryClient, resume]);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-5">
        <h2 className="text-lg font-semibold tracking-tight text-zinc-50">
          Learning roadmap
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Topics in order. Open any topic to study — prev/next stays inside this
          module.
        </p>
      </div>

      <ol className="relative space-y-0">
        {detail.lessons.map((lesson, index) => {
          const isCurrent = resume?.id === lesson.id && !lesson.isCompleted;
          const status = lesson.isCompleted
            ? "completed"
            : isCurrent
              ? "current"
              : "upcoming";

          return (
            <li key={lesson.id} className="relative flex gap-4 pb-4">
              <div className="relative flex w-8 shrink-0 flex-col items-center">
                <div
                  className={cn(
                    "relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 bg-zinc-950",
                    status === "completed" &&
                      "border-emerald-500 text-emerald-400",
                    status === "current" &&
                      "border-indigo-400 text-indigo-300 ring-4 ring-indigo-500/10",
                    status === "upcoming" && "border-zinc-700 text-zinc-600"
                  )}
                >
                  {status === "completed" ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : status === "current" ? (
                    <PlayCircle className="h-4 w-4" />
                  ) : (
                    <Circle className="h-3.5 w-3.5" />
                  )}
                </div>
                {index < detail.lessons.length - 1 ? (
                  <div className="w-px flex-1 bg-zinc-800" />
                ) : null}
              </div>

              <Link
                href={CURRICULUM_ROUTES.moduleTopic(
                  detail.module.slug,
                  lesson.slug
                )}
                onMouseEnter={() =>
                  prefetchModuleTopic(
                    queryClient,
                    detail.module.slug,
                    lesson.slug
                  )
                }
                className={cn(
                  "min-w-0 flex-1 rounded-xl border px-4 py-3 transition",
                  status === "current"
                    ? "border-indigo-500/30 bg-indigo-500/10"
                    : "border-zinc-800/80 bg-zinc-900/40 hover:border-zinc-700"
                )}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-500">
                    Topic {index + 1}
                  </span>
                  <StatusChip status={status} />
                </div>
                <p className="mt-1 text-sm font-semibold text-zinc-50">
                  {lesson.title}
                </p>
                {lesson.description ? (
                  <p className="mt-1 line-clamp-2 text-xs text-zinc-500">
                    {lesson.description}
                  </p>
                ) : null}
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <DifficultyBadge difficulty={lesson.difficulty} />
                  <span className="inline-flex items-center gap-1 text-[11px] text-zinc-500">
                    <Clock className="h-3 w-3" />
                    {lesson.durationMinutes} min
                  </span>
                  <span className="text-[11px] text-zinc-600">1 lesson</span>
                </div>
                {lesson.isCompleted ? (
                  <Progress value={100} className="mt-2 h-1" />
                ) : isCurrent ? (
                  <Progress value={0} className="mt-2 h-1" />
                ) : null}
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function StatusChip({
  status,
}: {
  status: "completed" | "current" | "upcoming";
}) {
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        status === "completed" &&
          "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30",
        status === "current" &&
          "bg-indigo-500/20 text-indigo-200 ring-1 ring-indigo-500/40",
        status === "upcoming" &&
          "bg-zinc-800/80 text-zinc-500 ring-1 ring-zinc-700"
      )}
    >
      {status}
    </span>
  );
}
