import { redirect } from "next/navigation";
import { CURRICULUM_ROUTES } from "@/features/curriculum/types";

/** Legacy nested challenge URL → flat solve route. */
export default async function LegacyModuleChallengeRedirect({
  params,
}: {
  params: Promise<{ slug: string; topicSlug: string; challengeId: string }>;
}) {
  const { slug, topicSlug, challengeId } = await params;
  redirect(
    CURRICULUM_ROUTES.moduleChallenge(slug, topicSlug, challengeId)
  );
}
