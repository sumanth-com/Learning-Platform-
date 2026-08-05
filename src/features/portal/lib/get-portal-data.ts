import { cache } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/actions/auth-actions";
import { createCurriculumService } from "@/features/curriculum/lib/create-services";
import { AUTH_ROUTES } from "@/features/auth/constants";
import { DEFAULT_COURSE_SLUG } from "@/features/curriculum/types";
import type { PortalData, PortalUser } from "@/features/portal/types";

function toPortalUser(
  session: NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>
): PortalUser {
  const name =
    session.profile?.full_name ||
    session.user.user_metadata?.full_name ||
    session.user.email ||
    "Learner";

  return {
    id: session.user.id,
    name: String(name),
    email: session.profile?.email || session.user.email || "",
    role: session.profile?.role ?? "student",
  };
}

/**
 * Auth-only portal user — cached per request. Use for chrome/shell so pages
 * don't wait on the full course journey.
 */
export const getPortalUser = cache(async (): Promise<PortalUser> => {
  const session = await getCurrentUser();
  if (!session) redirect(AUTH_ROUTES.login);
  return toPortalUser(session);
});

/**
 * Shared student portal data — cached per request so layout + pages share one fetch.
 * Journey is loaded once; continue state is derived (no second DB waterfall).
 */
export const getPortalData = cache(async (): Promise<PortalData> => {
  const session = await getCurrentUser();
  if (!session) redirect(AUTH_ROUTES.login);

  const user = toPortalUser(session);
  const curriculum = await createCurriculumService();

  let journey = null;
  let continueState = null;

  try {
    journey = await curriculum.getCourseJourney(
      session.user.id,
      DEFAULT_COURSE_SLUG
    );
    continueState = journey ? curriculum.continueFromJourney(journey) : null;
  } catch {
    journey = null;
    continueState = null;
  }

  return {
    user,
    journey,
    continueState,
  };
});
