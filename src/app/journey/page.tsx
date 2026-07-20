import { PortalPage } from "@/components/portal/portal-page";
import { LearningJourney } from "@/components/curriculum/learning-journey";
import { getCurrentUser } from "@/features/auth/actions/auth-actions";
import { createCurriculumService } from "@/features/curriculum/lib/create-services";
import { AUTH_ROUTES } from "@/features/auth/constants";
import { DEFAULT_COURSE_SLUG } from "@/features/curriculum/types";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Learning Journey",
};

export default async function JourneyPage() {
  const session = await getCurrentUser();
  if (!session) redirect(AUTH_ROUTES.login);

  const curriculum = await createCurriculumService();
  const journey = await curriculum.getCourseJourney(
    session.user.id,
    DEFAULT_COURSE_SLUG
  );

  const currentPhase =
    journey?.phases.find((p) => p.completedCount < p.totalCount) ??
    journey?.phases[0];

  return (
    <PortalPage>
      {journey ? (
        <LearningJourney
          journey={journey}
          currentPhaseOrder={currentPhase?.sort_order ?? 1}
        />
      ) : (
        <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/40 p-10 text-center">
          <h1 className="text-xl font-semibold text-zinc-100">
            Curriculum unavailable
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Curriculum data could not be loaded from Supabase.
          </p>
        </div>
      )}
    </PortalPage>
  );
}
