import { redirect } from "next/navigation";

/** Legacy route: /roadmap/1 → /roadmap/week/1 */
export default async function LegacyRoadmapWeekRedirect({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (/^\d+$/.test(id)) {
    redirect(`/roadmap/week/${id}`);
  }
  redirect("/roadmap");
}
