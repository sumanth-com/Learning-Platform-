"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  COMMUNICATION_WEEKS,
  getCommunicationWeekProgress,
} from "@/curriculum/communication-skills";
import { useProgressStore } from "@/store/use-progress-store";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export function CommunityGallery() {
  const progress = useProgressStore((s) => s.progress);
  const isLocked = useProgressStore((s) => s.isModuleWeekLocked);

  return (
    <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {COMMUNICATION_WEEKS.map((week) => {
        const locked = isLocked("communication", week.weekId);
        const pct = getCommunicationWeekProgress(week.skill, (id) =>
          Boolean(progress.completed[id])
        );

        const inner = (
          <>
            <div className="mb-3 flex items-center justify-between gap-2">
              <p className="text-xs uppercase tracking-wide text-zinc-500">
                Week {week.weekId}
              </p>
              {locked ? (
                <Badge variant="secondary">Locked</Badge>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs text-indigo-300">
                  Open <ArrowRight className="h-3 w-3" />
                </span>
              )}
            </div>
            <h2 className="text-base font-semibold text-zinc-50">
              {week.title}
            </h2>
            <p className="mt-2 line-clamp-2 text-sm text-zinc-400">
              {week.subtitle}
            </p>
            <div className="mt-auto pt-4">
              <div className="mb-1.5 flex justify-between text-[11px] text-zinc-500">
                <span>{week.focus}</span>
                <span>{pct}%</span>
              </div>
              <Progress value={pct} className="h-1.5" />
            </div>
          </>
        );

        return (
          <li key={week.weekId}>
            {locked ? (
              <div className="flex h-full flex-col rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-5 opacity-60">
                {inner}
              </div>
            ) : (
              <Link
                href={`/communication/${week.weekId}`}
                className="flex h-full flex-col rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5 transition hover:border-zinc-700 hover:bg-zinc-900/70"
              >
                {inner}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}
