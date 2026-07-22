import { redirect } from "next/navigation";
import { CURRICULUM_ROUTES } from "@/features/curriculum/types";

/** Legacy /module/:slug/challenge/:id → /challenge/:slug/:id */
export default async function LegacyModuleChallengeRedirect({
  params,
}: {
  params: Promise<{ slug: string; challengeId: string }>;
}) {
  const { slug, challengeId } = await params;
  redirect(CURRICULUM_ROUTES.moduleChallenge(slug, "", challengeId));
}
