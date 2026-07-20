"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowRight } from "lucide-react";
import { getCurriculumWeeks } from "@/curriculum/registry";
import { getSupplementalInterviewPacks } from "@/curriculum/interview/merge";
import {
  countInterviewDone,
  countInterviewItems,
} from "@/components/shared/interview-week-content";
import { useProgressStore } from "@/store/use-progress-store";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export function InterviewGallery() {
  const progress = useProgressStore((s) => s.progress);
  const isLocked = useProgressStore((s) => s.isModuleWeekLocked);
  const packs = useMemo(() => getSupplementalInterviewPacks(), []);
  const weeks = useMemo(() => getCurriculumWeeks(), []);

  const weekCards = weeks
    .filter((w) => (w.interviewQuestions?.length ?? 0) > 0)
    .map((week) => {
      const categories = week.interviewQuestions ?? [];
      const total = countInterviewItems(categories);
      const done = countInterviewDone(categories, (id) =>
        Boolean(progress.completed[id])
      );
      return {
        id: String(week.id),
        href: `/interview/${week.id}`,
        title: week.title,
        subtitle: `Week ${week.id}`,
        total,
        done,
        locked: isLocked("interview", week.id),
      };
    });

  const packCards = packs.map((pack) => {
    const total = countInterviewItems(pack.categories);
    const done = countInterviewDone(pack.categories, (id) =>
      Boolean(progress.completed[id])
    );
    return {
      id: pack.id,
      href: `/interview/${pack.id}`,
      title: pack.title,
      subtitle: "Supplemental pack",
      total,
      done,
      locked: false,
    };
  });

  const cards = [...weekCards, ...packCards];

  return (
    <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => {
        const pct = card.total
          ? Math.round((card.done / card.total) * 100)
          : 0;

        return (
          <li key={card.id}>
            {card.locked ? (
              <div className="flex h-full flex-col rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-5 opacity-60">
                <Badge variant="secondary" className="mb-3 w-fit">
                  Locked
                </Badge>
                <h2 className="text-base font-semibold text-zinc-200">
                  {card.title}
                </h2>
                <p className="mt-1 text-xs text-zinc-500">{card.subtitle}</p>
              </div>
            ) : (
              <Link
                href={card.href}
                className="flex h-full flex-col rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5 transition hover:border-zinc-700 hover:bg-zinc-900/70"
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <p className="text-xs uppercase tracking-wide text-zinc-500">
                    {card.subtitle}
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs text-indigo-300">
                    Open <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
                <h2 className="text-base font-semibold text-zinc-50">
                  {card.title}
                </h2>
                <div className="mt-auto pt-4">
                  <div className="mb-1.5 flex justify-between text-[11px] text-zinc-500">
                    <span>
                      {card.done}/{card.total} items
                    </span>
                    <span>{pct}%</span>
                  </div>
                  <Progress value={pct} className="h-1.5" />
                </div>
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}
