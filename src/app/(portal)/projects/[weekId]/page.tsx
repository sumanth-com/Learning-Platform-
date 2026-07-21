import { redirect } from "next/navigation";

/**
 * Week-scoped projects URL — send learners to the projects gallery.
 * Individual projects live at /projects/[weekId]/[projectId].
 */
export default async function ProjectWeekPage({
  params,
}: {
  params: Promise<{ weekId: string }>;
}) {
  const { weekId } = await params;
  redirect(`/projects?week=${encodeURIComponent(weekId)}`);
}
