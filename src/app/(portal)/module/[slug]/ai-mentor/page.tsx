import { ModuleAiMentor } from "@/components/module-hub/module-ai-mentor";
import { loadModuleHubAction } from "@/features/curriculum/actions/module-hub-actions";
import { notFound } from "next/navigation";

export default async function ModuleAiMentorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await loadModuleHubAction(slug);
  if (!result.success) notFound();
  return <ModuleAiMentor payload={result.data} />;
}
