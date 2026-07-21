import { notFound, redirect } from "next/navigation";
import { ModuleTopicView } from "@/components/module-hub/module-topic-view";
import { loadModuleTopicAction } from "@/features/curriculum/actions/module-hub-actions";
import { CURRICULUM_ROUTES } from "@/features/curriculum/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; topicSlug: string }>;
}) {
  const { topicSlug } = await params;
  return {
    title: topicSlug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" "),
  };
}

export default async function ModuleTopicPage({
  params,
}: {
  params: Promise<{ slug: string; topicSlug: string }>;
}) {
  const { slug, topicSlug } = await params;
  const topic = await loadModuleTopicAction(slug, topicSlug);

  if (!topic.success) notFound();
  if (topic.data.isLocked) {
    redirect(CURRICULUM_ROUTES.moduleHub(slug));
  }

  return (
    <ModuleTopicView
      moduleSlug={slug}
      topicSlug={topicSlug}
      initialData={topic.data}
    />
  );
}
