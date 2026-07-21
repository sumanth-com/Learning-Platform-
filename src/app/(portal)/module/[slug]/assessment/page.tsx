import { ModuleAssessment } from "@/components/module-hub/module-assessment";
import { loadModuleHubAction } from "@/features/curriculum/actions/module-hub-actions";
import { notFound } from "next/navigation";

export default async function ModuleAssessmentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await loadModuleHubAction(slug);
  if (!result.success) notFound();
  return <ModuleAssessment payload={result.data} />;
}
