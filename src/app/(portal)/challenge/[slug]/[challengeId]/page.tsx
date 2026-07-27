import { notFound, redirect } from "next/navigation";
import { PortalChrome } from "@/components/portal/portal-chrome";
import { ModuleChallengeSolve } from "@/components/module-hub/module-challenge-solve";
import { getCurrentUser } from "@/features/auth/actions/auth-actions";
import { AUTH_ROUTES } from "@/features/auth/constants";
import { loadModuleHubAction } from "@/features/curriculum/actions/module-hub-actions";
import { findModuleChallenge } from "@/features/curriculum/lib/topic-challenges";
import {
  isProgrammingFundamentalsModule,
  PROGRAMMING_FUNDAMENTALS_TOPICS,
} from "@/features/curriculum/lib/programming-fundamentals";
import { getDeveloperToolingTopic } from "@/features/curriculum/lib/developer-tooling";
import { getHtmlAcademyTopic } from "@/features/curriculum/lib/html-academy";
import { getCssAcademyTopic } from "@/features/curriculum/lib/css-academy";
import { getJsAcademyTopic } from "@/features/curriculum/lib/js-academy";
import { getReactAcademyTopic } from "@/features/curriculum/lib/react-academy";
import { getNextjsAcademyTopic } from "@/features/curriculum/lib/nextjs-academy";
import { getTypescriptAcademyTopic } from "@/features/curriculum/lib/typescript-academy";
import { getApisAcademyTopic } from "@/features/curriculum/lib/apis-academy";
import { getAuthAcademyTopic } from "@/features/curriculum/lib/auth-academy";
import { getSqlAcademyTopic } from "@/features/curriculum/lib/sql-academy";
import { getModelingAcademyTopic } from "@/features/curriculum/lib/modeling-academy";
import { getDeploymentAcademyTopic } from "@/features/curriculum/lib/deployment-academy";
import { getCicdAcademyTopic } from "@/features/curriculum/lib/cicd-academy";
import { getLlmAcademyTopic } from "@/features/curriculum/lib/llm-academy";
import { getAiFeaturesAcademyTopic } from "@/features/curriculum/lib/ai-features-academy";
import { getCapstoneAcademyTopic } from "@/features/curriculum/lib/capstone-academy";
import { getShipAcademyTopic } from "@/features/curriculum/lib/ship-academy";
import { getInterviewAcademyTopic } from "@/features/curriculum/lib/interview-academy";
import { getSystemsAcademyTopic } from "@/features/curriculum/lib/systems-academy";
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
      .replace(
        /^(pf|html|css|js|react|nextjs|ts|apis|auth|sql|modeling|deploy|cicd|llm|aifeat|capstone|ship|interview|systems|tooling)-/,
        ""
      )
      .split("-")
      .slice(-2)
      .join(" ")
      .replace(/\b\w/g, (c) => c.toUpperCase()),
  };
}

function resolveTopicTitle(
  slug: string,
  topicSlug: string,
  fallbackTitle?: string
) {
  return (
    fallbackTitle ||
    (isProgrammingFundamentalsModule(slug)
      ? PROGRAMMING_FUNDAMENTALS_TOPICS.find((t) => t.slug === topicSlug)?.title
      : undefined) ||
    getDeveloperToolingTopic(topicSlug)?.title ||
    getHtmlAcademyTopic(topicSlug)?.title ||
    getCssAcademyTopic(topicSlug)?.title ||
    getJsAcademyTopic(topicSlug)?.title ||
    getReactAcademyTopic(topicSlug)?.title ||
    getNextjsAcademyTopic(topicSlug)?.title ||
    getTypescriptAcademyTopic(topicSlug)?.title ||
    getApisAcademyTopic(topicSlug)?.title ||
    getAuthAcademyTopic(topicSlug)?.title ||
    getSqlAcademyTopic(topicSlug)?.title ||
    getModelingAcademyTopic(topicSlug)?.title ||
    getDeploymentAcademyTopic(topicSlug)?.title ||
    getCicdAcademyTopic(topicSlug)?.title ||
    getLlmAcademyTopic(topicSlug)?.title ||
    getAiFeaturesAcademyTopic(topicSlug)?.title ||
    getCapstoneAcademyTopic(topicSlug)?.title ||
    getShipAcademyTopic(topicSlug)?.title ||
    getInterviewAcademyTopic(topicSlug)?.title ||
    getSystemsAcademyTopic(topicSlug)?.title ||
    topicSlug
  );
}

export default async function ChallengeSolvePage({
  params,
}: {
  params: Promise<{ slug: string; challengeId: string }>;
}) {
  const session = await getCurrentUser();
  if (!session) redirect(AUTH_ROUTES.login);

  const { slug, challengeId } = await params;
  const decodedId = decodeURIComponent(challengeId);

  // Academy challenges live in static banks — resolve before any DB hub load so a
  // hub/auth flake cannot 404 a challenge that findModuleChallenge already knows.
  const challenge = findModuleChallenge(slug, decodedId);
  if (!challenge) notFound();

  const hub = await loadModuleHubAction(slug);
  if (!hub.success) {
    if (hub.error === "Sign in required.") redirect(AUTH_ROUTES.login);
    // Challenge is valid; render with static titles if the module hub is unavailable.
    const topicTitle = resolveTopicTitle(slug, challenge.topicSlug);
    return (
      <div className="flex h-full min-h-0 flex-col overflow-hidden">
        <PortalChrome title="Roadmap" subtitle={topicTitle} fillViewport />
        <ModuleChallengeSolve
          moduleSlug={slug}
          topicSlug={challenge.topicSlug}
          topicTitle={topicTitle}
          moduleTitle={slug}
          challenge={challenge}
        />
      </div>
    );
  }

  const { detail } = hub.data;
  const cards = buildTopicCards(detail.lessons, slug);
  const topicCard = cards.find((c) => c.slug === challenge.topicSlug);
  if (topicCard?.status === "locked") {
    redirect(CURRICULUM_ROUTES.moduleHub(slug));
  }

  const topicTitle = resolveTopicTitle(
    slug,
    challenge.topicSlug,
    topicCard?.title
  );

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
