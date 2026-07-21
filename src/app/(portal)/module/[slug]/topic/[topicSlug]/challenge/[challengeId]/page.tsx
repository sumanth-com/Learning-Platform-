import { notFound, redirect } from "next/navigation";
import { ModuleChallengeSolve } from "@/components/module-hub/module-challenge-solve";
import { loadModuleHubAction } from "@/features/curriculum/actions/module-hub-actions";
import { findTopicChallenge } from "@/features/curriculum/lib/topic-challenges";
import {
  isProgrammingFundamentalsModule,
  PROGRAMMING_FUNDAMENTALS_TOPICS,
} from "@/features/curriculum/lib/programming-fundamentals";
import { buildTopicCards } from "@/features/curriculum/lib/topic-cards";
import { CURRICULUM_ROUTES } from "@/features/curriculum/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; topicSlug: string; challengeId: string }>;
}) {
  const { challengeId } = await params;
  const decoded = decodeURIComponent(challengeId);
  return {
    title: decoded
      .replace(/^pf-/, "")
      .split("-")
      .slice(-2)
      .join(" ")
      .replace(/\b\w/g, (c) => c.toUpperCase()),
  };
}

export default async function ModuleChallengePage({
  params,
}: {
  params: Promise<{ slug: string; topicSlug: string; challengeId: string }>;
}) {
  const { slug, topicSlug, challengeId } = await params;
  const decodedId = decodeURIComponent(challengeId);

  const hub = await loadModuleHubAction(slug);
  if (!hub.success) notFound();

  const { detail } = hub.data;
  const cards = buildTopicCards(detail.lessons, slug);
  const topicCard = cards.find((c) => c.slug === topicSlug);

  if (!topicCard) notFound();
  if (topicCard.status === "locked") {
    redirect(CURRICULUM_ROUTES.moduleHub(slug));
  }

  const topicTitle =
    topicCard.title ||
    (isProgrammingFundamentalsModule(slug)
      ? PROGRAMMING_FUNDAMENTALS_TOPICS.find((t) => t.slug === topicSlug)?.title
      : undefined) ||
    topicSlug;

  const challenge = findTopicChallenge(
    slug,
    topicSlug,
    topicTitle,
    decodedId
  );
  if (!challenge) notFound();

  return (
    <ModuleChallengeSolve
      moduleSlug={slug}
      topicSlug={topicSlug}
      topicTitle={topicTitle}
      moduleTitle={detail.module.title}
      challenge={challenge}
    />
  );
}
