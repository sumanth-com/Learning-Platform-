import { redirect } from "next/navigation";
import { CURRICULUM_ROUTES } from "@/features/curriculum/types";

/** Legacy nested topic URL → module explorer with topic selected. */
export default async function LegacyModuleTopicRedirect({
  params,
}: {
  params: Promise<{ slug: string; topicSlug: string }>;
}) {
  const { slug, topicSlug } = await params;
  redirect(CURRICULUM_ROUTES.moduleHub(slug, topicSlug));
}
