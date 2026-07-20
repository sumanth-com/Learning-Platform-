"use client";

import { Suspense, use } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Lock } from "lucide-react";
import { getLearningWeek } from "@/learning-engine/loader";
import { LearningEngineView } from "@/components/learning-engine/learning-engine-view";
import { ChallengeMarkCompleteButton } from "@/components/learning-engine/challenge-mark-complete";
import { Button } from "@/components/ui/button";
import { useStoreHydrated } from "@/hooks/use-store-hydrated";
import { useProgressStore } from "@/store/use-progress-store";

function BackToChallengesLink({ weekId }: { weekId: number }) {
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic");
  const href = topic ? `/roadmap/week/${weekId}?topic=${encodeURIComponent(topic)}` : `/roadmap/week/${weekId}`;

  return (
    <Link href={href}>
      <Button variant="ghost" size="sm" className="h-8 gap-1.5 px-2 text-xs text-zinc-400 hover:text-zinc-200">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Challenges
      </Button>
    </Link>
  );
}

function WeekLearnContent({ weekId }: { weekId: number }) {
  const hydrated = useStoreHydrated();
  const week = getLearningWeek(weekId);
  const isLocked = useProgressStore((s) => s.isModuleWeekLocked("practice", weekId));

  if (!week) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-xl font-semibold">Week not found</h2>
        <Link href="/roadmap">
          <Button className="mt-4" variant="secondary">
            Back to Roadmap
          </Button>
        </Link>
      </div>
    );
  }

  if (!hydrated) {
    return (
      <div className="fixed inset-0 z-10 flex flex-col overflow-hidden bg-[#0d0d0d] lg:left-64">
        <header className="flex h-11 shrink-0 items-center gap-3 border-b border-zinc-800 bg-[#0a0a0a] px-4">
          <div className="h-8 w-32 animate-pulse rounded bg-zinc-800" />
        </header>
        <div className="flex flex-1 items-center justify-center text-sm text-zinc-500">Loading…</div>
      </div>
    );
  }

  if (isLocked) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900">
          <Lock className="h-6 w-6 text-zinc-500" />
        </div>
        <h2 className="text-lg font-semibold text-zinc-300">Week {weekId} is locked</h2>
        <p className="mt-2 max-w-sm text-sm text-zinc-500">
          Complete Practice Week {weekId - 1} to unlock this week.
        </p>
        <Link href="/roadmap">
          <Button className="mt-6" variant="secondary">
            Back to Roadmap
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-10 flex flex-col overflow-hidden bg-[#0d0d0d] lg:left-64">
      <header className="flex h-11 shrink-0 items-center gap-3 border-b border-zinc-800 bg-[#0a0a0a] px-4">
        <Suspense fallback={null}>
          <BackToChallengesLink weekId={weekId} />
        </Suspense>
        <h1 className="truncate text-sm font-medium text-zinc-300">{week.title}</h1>
        <Suspense fallback={null}>
          <ChallengeMarkCompleteButton weekId={weekId} />
        </Suspense>
      </header>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <Suspense fallback={<div className="flex flex-1 items-center justify-center text-zinc-500">Loading…</div>}>
          <LearningEngineView weekId={weekId} weekTitle={week.title} flush />
        </Suspense>
      </div>
    </div>
  );
}

export default function RoadmapWeekLearnPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const weekId = parseInt(id, 10);

  return (
    <Suspense fallback={<div className="py-20 text-center text-zinc-500">Loading…</div>}>
      <WeekLearnContent weekId={weekId} />
    </Suspense>
  );
}
