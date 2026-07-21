"use client";

import { Suspense, use } from "react";
import Link from "next/link";
import { Lock } from "lucide-react";
import { getLearningWeek } from "@/learning-engine/loader";
import { WeekChallengeHub } from "@/components/learning-engine/week-challenge-hub";
import { WeekChallengeHubSkeleton } from "@/components/learning-engine/week-challenge-hub-skeleton";
import { Button } from "@/components/ui/button";
import { useStoreHydrated } from "@/hooks/use-store-hydrated";
import { useProgressStore } from "@/store/use-progress-store";

function WeekHubContent({ weekId }: { weekId: number }) {
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
    return <WeekChallengeHubSkeleton />;
  }

  if (isLocked) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900">
          <Lock className="h-6 w-6 text-zinc-500" />
        </div>
        <h2 className="text-lg font-semibold text-zinc-300">
          Week {weekId} is locked
        </h2>
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

  return <WeekChallengeHub week={week} />;
}

export default function RoadmapWeekHubPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const weekId = parseInt(id, 10);

  return (
    <Suspense fallback={<WeekChallengeHubSkeleton />}>
      <WeekHubContent weekId={weekId} />
    </Suspense>
  );
}
