import { ModuleAssignmentsPanel } from "@/components/module-hub/module-assignments-panel";
import { loadModuleHubAction } from "@/features/curriculum/actions/module-hub-actions";
import { notFound } from "next/navigation";

export default async function ModuleAssignmentsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await loadModuleHubAction(slug);
  if (!result.success) notFound();
  return <ModuleAssignmentsPanel payload={result.data} />;
}
