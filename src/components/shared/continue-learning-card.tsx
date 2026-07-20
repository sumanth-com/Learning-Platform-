"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Layers, Target } from "lucide-react";
import { useProgressStore } from "@/store/use-progress-store";
import { useStoreHydrated } from "@/hooks/use-store-hydrated";
import { MODULE_LABELS } from "@/lib/module-progress";
import { buildContinueLearningTarget } from "@/lib/continue-learning";
import { WEEK_ROADMAP_CURRICULUM } from "@/curriculum/java-roadmap/curriculum";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function ResumeRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/80">
        <Icon className="h-3.5 w-3.5 text-indigo-400" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">{label}</p>
        <p className="mt-0.5 truncate text-sm font-semibold text-zinc-100">{value}</p>
      </div>
    </div>
  );
}

export function ContinueLearningCard({ className }: { className?: string }) {
  const hydrated = useStoreHydrated();
  const resume = useProgressStore((s) => s.resumePosition);
  const isDone = useProgressStore((s) => s.isDone);
  const practiceWeek = useProgressStore((s) => s.getModuleCurrentWeek("practice"));
  const activeWeekId = hydrated ? practiceWeek : 1;
  const weekMeta = WEEK_ROADMAP_CURRICULUM.find((w) => w.weekId === activeWeekId);

  if (!hydrated) {
    return (
      <div
        className={cn(
          "rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5 animate-pulse",
          className
        )}
      >
        <div className="h-4 w-40 rounded bg-zinc-800" />
        <div className="mt-4 h-20 rounded bg-zinc-800/80" />
      </div>
    );
  }

  const target = buildContinueLearningTarget(activeWeekId, isDone, resume, weekMeta?.title);
  const moduleLabel = resume?.module
    ? MODULE_LABELS[resume.module === "roadmap" ? "practice" : resume.module]
    : "Practice";

  return (
    <div
      className={cn(
        "rounded-2xl border border-indigo-500/25 bg-gradient-to-br from-indigo-950/40 via-zinc-900/80 to-zinc-950 p-5",
        className
      )}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-zinc-100">Continue Learning</h2>
          <p className="mt-0.5 text-xs text-zinc-500">Picks up exactly where you stopped</p>
        </div>
        <span className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-indigo-300">
          {moduleLabel}
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <ResumeRow icon={BookOpen} label="Week" value={target.weekLabel} />
        <ResumeRow icon={Layers} label="Topic" value={target.topicLabel} />
        <ResumeRow icon={Target} label="Challenge" value={target.challengeLabel} />
      </div>

      <Link href={target.href} className="mt-5 block">
        <Button variant="gradient" size="sm" className="h-10 w-full gap-2 text-sm font-semibold">
          Resume
          <ArrowRight className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
}
