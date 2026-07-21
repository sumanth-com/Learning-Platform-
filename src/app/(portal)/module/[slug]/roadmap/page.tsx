import { ModuleRoadmap } from "@/components/module-hub/module-roadmap";
import { loadModuleHubAction } from "@/features/curriculum/actions/module-hub-actions";
import { notFound } from "next/navigation";

export default async function ModuleRoadmapPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await loadModuleHubAction(slug);
  if (!result.success) notFound();
  return <ModuleRoadmap payload={result.data} />;
}
