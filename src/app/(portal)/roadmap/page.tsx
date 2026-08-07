import { Suspense } from "react";
import { JourneyRoadmap } from "@/components/portal/journey-roadmap";
import { TrackPageEvent } from "@/components/analytics/track-page-event";
import { getPortalData } from "@/features/portal/lib/get-portal-data";
import { createClient } from "@/lib/supabase/server";
import { ANALYTICS_EVENTS } from "@/lib/analytics";

export const metadata = {
  title: "Roadmap",
};

function RoadmapFallback() {
  return (
    <div className="h-full min-h-0 animate-pulse space-y-4 p-4 sm:p-6">
      <div className="h-8 w-40 rounded bg-zinc-800/80" />
      <div className="h-36 rounded-2xl bg-zinc-900/50" />
      <div className="h-36 rounded-2xl bg-zinc-900/40" />
      <div className="h-36 rounded-2xl bg-zinc-900/40" />
    </div>
  );
}

async function RoadmapContent() {
  const [data, supabase] = await Promise.all([
    getPortalData(),
    createClient(),
  ]);

  const { data: assignmentRows } = await supabase
    .from("assignments")
    .select("lesson_id")
    .eq("is_published", true);

  const assignmentLessonIds = [
    ...new Set(
      (assignmentRows ?? [])
        .map((row) => (row as { lesson_id: string | null }).lesson_id)
        .filter(Boolean) as string[]
    ),
  ];

  const projectModuleIds =
    data.journey?.phases.flatMap((phase) =>
      phase.modules
        .filter((m) => /project/i.test(m.title))
        .map((m) => m.id)
    ) ?? [];

  if (!data.journey) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-center">
        <div>
          <h1 className="text-lg font-semibold text-zinc-100">
            Curriculum unavailable
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Curriculum data could not be loaded.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <TrackPageEvent event={ANALYTICS_EVENTS.roadmap_viewed} />
      <JourneyRoadmap
        journey={data.journey}
        assignmentLessonIds={assignmentLessonIds}
        projectModuleIds={projectModuleIds}
      />
    </>
  );
}

export default function RoadmapPage() {
  return (
    <Suspense fallback={<RoadmapFallback />}>
      <RoadmapContent />
    </Suspense>
  );
}
