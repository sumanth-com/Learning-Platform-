import { redirect } from "next/navigation";
import { CURRICULUM_ROUTES } from "@/features/curriculum/types";

/** Legacy hub tab → Topic Explorer */
export default async function LegacyModuleTabRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(CURRICULUM_ROUTES.module(slug));
}
