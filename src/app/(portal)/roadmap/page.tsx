import { JourneyRoadmap } from "@/components/portal/journey-roadmap";
import { TrackPageEvent } from "@/components/analytics/track-page-event";
import { getPortalData } from "@/features/portal/lib/get-portal-data";
import { createClient } from "@/lib/supabase/server";
import { ANALYTICS_EVENTS } from "@/lib/analytics";

export const metadata = {
  title: "Roadmap",
};

export default async function RoadmapPage() {
  const data = await getPortalData();

  const supabase = await createClient();
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
