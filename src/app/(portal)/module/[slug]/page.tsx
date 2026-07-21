import { ModuleOverview } from "@/components/module-hub/module-overview";
import { loadModuleHubAction } from "@/features/curriculum/actions/module-hub-actions";
import { notFound } from "next/navigation";

export default async function ModuleOverviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await loadModuleHubAction(slug);
  if (!result.success) notFound();
  return <ModuleOverview payload={result.data} />;
}
