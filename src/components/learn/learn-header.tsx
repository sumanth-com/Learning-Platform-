"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProgressRow } from "@/components/learn/progress-row";
import { CURRICULUM_ROUTES } from "@/features/curriculum/types";

type LearnHeaderProps = {
  courseTitle: string;
  phaseTitle?: string | null;
  moduleTitle?: string | null;
  moduleSlug?: string | null;
  moduleProgress?: number | null;
};

export function LearnHeader({
  courseTitle,
  phaseTitle,
  moduleTitle,
  moduleSlug,
  moduleProgress,
}: LearnHeaderProps) {
  const backHref = moduleSlug
    ? CURRICULUM_ROUTES.module(moduleSlug)
    : CURRICULUM_ROUTES.roadmap;

  return (
    <header className="sticky top-0 z-20 border-b border-zinc-800/90 bg-zinc-950/90 backdrop-blur-xl">
      <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-zinc-500">
            <Link
              href={CURRICULUM_ROUTES.roadmap}
              className="transition hover:text-zinc-300"
            >
              Roadmap
            </Link>
            {moduleSlug && moduleTitle ? (
              <>
                <span className="text-zinc-700">/</span>
                <Link
                  href={backHref}
                  className="inline-flex items-center gap-1 truncate transition hover:text-zinc-300"
                >
                  <ArrowLeft className="h-3 w-3" />
                  {moduleTitle}
                </Link>
              </>
            ) : null}
            {phaseTitle ? (
              <>
                <span className="hidden text-zinc-700 sm:inline">/</span>
                <span className="hidden truncate sm:inline">{phaseTitle}</span>
              </>
            ) : null}
          </div>
          <p className="mt-0.5 truncate text-sm font-medium text-zinc-100">
            {moduleTitle ?? courseTitle}
          </p>
        </div>

        {typeof moduleProgress === "number" ? (
          <div className="hidden w-40 shrink-0 sm:block">
            <ProgressRow
              label="Module"
              value={moduleProgress}
              meta={`${moduleProgress}%`}
            />
          </div>
        ) : null}
      </div>
    </header>
  );
}
