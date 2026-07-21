import { notFound } from "next/navigation";
import { ModuleTopicView } from "@/components/module-hub/module-topic-view";
import {
  loadModuleHubAction,
  loadModuleTopicAction,
} from "@/features/curriculum/actions/module-hub-actions";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; topicSlug: string }>;
}) {
  const { slug, topicSlug } = await params;
  const result = await loadModuleTopicAction(slug, topicSlug);
  return {
    title: result.success ? result.data.detail.lesson.title : "Topic",
  };
}

export default async function ModuleTopicPage({
  params,
}: {
  params: Promise<{ slug: string; topicSlug: string }>;
}) {
  const { slug, topicSlug } = await params;
  const [topic, hub] = await Promise.all([
    loadModuleTopicAction(slug, topicSlug),
    loadModuleHubAction(slug),
  ]);

  if (!topic.success || !hub.success) notFound();

  const related = hub.data.detail.lessons
    .filter((l) => l.slug !== topicSlug)
    .slice(0, 4)
    .map((l) => ({ slug: l.slug, title: l.title }));

  return (
    <ModuleTopicView
      moduleSlug={slug}
      topicSlug={topicSlug}
      initialData={topic.data}
      related={related}
    />
  );
}
