import { notFound, redirect } from "next/navigation";
import { PortalChrome } from "@/components/portal/portal-chrome";
import { ModuleChallengeSolve } from "@/components/module-hub/module-challenge-solve";
import { loadModuleHubAction } from "@/features/curriculum/actions/module-hub-actions";
import { findModuleChallenge } from "@/features/curriculum/lib/topic-challenges";
import {
  isProgrammingFundamentalsModule,
  PROGRAMMING_FUNDAMENTALS_TOPICS,
} from "@/features/curriculum/lib/programming-fundamentals";
import { getDeveloperToolingTopic } from "@/features/curriculum/lib/developer-tooling";
import { getHtmlAcademyTopic } from "@/features/curriculum/lib/html-academy";
import { buildTopicCards } from "@/features/curriculum/lib/topic-cards";
import { CURRICULUM_ROUTES } from "@/features/curriculum/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; challengeId: string }>;
}) {
  const { challengeId } = await params;
  const decoded = decodeURIComponent(challengeId);
  return {
    title: decoded
      .replace(/^(pf|html|tooling)-/, "")
      .split("-")
      .slice(-2)
      .join(" ")
      .replace(/\b\w/g, (c) => c.toUpperCase()),
  };
}

export default async function ChallengeSolvePage({
  params,
}: {
  params: Promise<{ slug: string; challengeId: string }>;
}) {
  const { slug, challengeId } = await params;
  const decodedId = decodeURIComponent(challengeId);

  const hub = await loadModuleHubAction(slug);
  if (!hub.success) notFound();

  const { detail } = hub.data;
  const cards = buildTopicCards(detail.lessons, slug);
  const challenge = findModuleChallenge(
    slug,
    decodedId,
    detail.lessons.map((l) => ({ slug: l.slug, title: l.title }))
  );
  if (!challenge) notFound();

  const topicCard = cards.find((c) => c.slug === challenge.topicSlug);
  if (topicCard?.status === "locked") {
    redirect(CURRICULUM_ROUTES.moduleHub(slug));
  }

  const topicTitle =
    topicCard?.title ||
    (isProgrammingFundamentalsModule(slug)
      ? PROGRAMMING_FUNDAMENTALS_TOPICS.find(
          (t) => t.slug === challenge.topicSlug
        )?.title
      : undefined) ||
    getDeveloperToolingTopic(challenge.topicSlug)?.title ||
    getHtmlAcademyTopic(challenge.topicSlug)?.title ||
    challenge.topicSlug;

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <PortalChrome title="Roadmap" subtitle={detail.phase.title} fillViewport />
      <ModuleChallengeSolve
        moduleSlug={slug}
        topicSlug={challenge.topicSlug}
        topicTitle={topicTitle}
        moduleTitle={detail.module.title}
        challenge={challenge}
      />
    </div>
  );
}
