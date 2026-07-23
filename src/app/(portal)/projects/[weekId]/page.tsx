import { redirect } from "next/navigation";
import { getRoadmapModuleMeta } from "@/curriculum/project-catalog";

/**
 * Module-scoped projects URL — gallery filtered to that module.
 * Individual projects: /projects/{module-slug}/{project-slug}
 */
export default async function ProjectWeekPage({
  params,
}: {
  params: Promise<{ weekId: string }>;
}) {
  const { weekId } = await params;
  const asNumber = Number(weekId);
  const mod =
    Number.isFinite(asNumber) && asNumber > 0
      ? getRoadmapModuleMeta(asNumber)
      : null;

  if (mod) {
    redirect(`/projects?module=${encodeURIComponent(mod.slug)}`);
  }

  redirect(`/projects?module=${encodeURIComponent(weekId)}`);
}
