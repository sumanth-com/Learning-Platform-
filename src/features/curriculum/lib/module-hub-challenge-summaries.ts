import type { LessonSummary } from "@/features/curriculum/types";
import { buildTopicCards } from "@/features/curriculum/lib/topic-cards";
import {
  getTopicChallengeLimit,
  resolveTopicChallenges,
} from "@/features/curriculum/lib/topic-challenges";
import { curriculumChallengeEntityId } from "@/features/curriculum/lib/challenge-entity-id";
import { isDeveloperToolingModule } from "@/features/curriculum/lib/developer-tooling";
import { findDeveloperToolingChallenge } from "@/features/curriculum/lib/developer-tooling-challenges";
import { isHtmlAcademyModule } from "@/features/curriculum/lib/html-academy";
import { findHtmlAcademyChallenge } from "@/features/curriculum/lib/html-academy-challenges";
import { isCssAcademyModule } from "@/features/curriculum/lib/css-academy";
import { findCssAcademyChallenge } from "@/features/curriculum/lib/css-academy-challenges";
import { isJsAcademyModule } from "@/features/curriculum/lib/js-academy";
import { findJsAcademyChallenge } from "@/features/curriculum/lib/js-academy-challenges";
import { isReactAcademyModule } from "@/features/curriculum/lib/react-academy";
import { findReactAcademyChallenge } from "@/features/curriculum/lib/react-academy-challenges";
import { isNextjsAcademyModule } from "@/features/curriculum/lib/nextjs-academy";
import { findNextjsAcademyChallenge } from "@/features/curriculum/lib/nextjs-academy-challenges";
import { isTypescriptAcademyModule } from "@/features/curriculum/lib/typescript-academy";
import { findTypescriptAcademyChallenge } from "@/features/curriculum/lib/typescript-academy-challenges";
import { isApisAcademyModule } from "@/features/curriculum/lib/apis-academy";
import { findApisAcademyChallenge } from "@/features/curriculum/lib/apis-academy-challenges";
import { isAuthAcademyModule } from "@/features/curriculum/lib/auth-academy";
import { findAuthAcademyChallenge } from "@/features/curriculum/lib/auth-academy-challenges";
import { isSqlAcademyModule } from "@/features/curriculum/lib/sql-academy";
import { findSqlAcademyChallenge } from "@/features/curriculum/lib/sql-academy-challenges";
import { isModelingAcademyModule } from "@/features/curriculum/lib/modeling-academy";
import { findModelingAcademyChallenge } from "@/features/curriculum/lib/modeling-academy-challenges";
import { isDeploymentAcademyModule } from "@/features/curriculum/lib/deployment-academy";
import { findDeploymentAcademyChallenge } from "@/features/curriculum/lib/deployment-academy-challenges";
import { isCicdAcademyModule } from "@/features/curriculum/lib/cicd-academy";
import { findCicdAcademyChallenge } from "@/features/curriculum/lib/cicd-academy-challenges";
import { isLlmAcademyModule } from "@/features/curriculum/lib/llm-academy";
import { findLlmAcademyChallenge } from "@/features/curriculum/lib/llm-academy-challenges";
import { isAiFeaturesAcademyModule } from "@/features/curriculum/lib/ai-features-academy";
import { findAiFeaturesAcademyChallenge } from "@/features/curriculum/lib/ai-features-academy-challenges";
import { isCapstoneAcademyModule } from "@/features/curriculum/lib/capstone-academy";
import { findCapstoneAcademyChallenge } from "@/features/curriculum/lib/capstone-academy-challenges";
import { isShipAcademyModule } from "@/features/curriculum/lib/ship-academy";
import { findShipAcademyChallenge } from "@/features/curriculum/lib/ship-academy-challenges";
import { isInterviewAcademyModule } from "@/features/curriculum/lib/interview-academy";
import { findInterviewAcademyChallenge } from "@/features/curriculum/lib/interview-academy-challenges";
import { isSystemsAcademyModule } from "@/features/curriculum/lib/systems-academy";
import { findSystemsAcademyChallenge } from "@/features/curriculum/lib/systems-academy-challenges";
import { THINKING_KIND_LABELS } from "@/features/curriculum/lib/thinking-challenge";
import { categoryLabel } from "@/learning-engine/category-labels";
import { problemTypeLabel } from "@/learning-engine/labels";
import type { ModuleHubChallengeSummary } from "@/features/curriculum/lib/module-hub-challenge-summary";

export type { ModuleHubChallengeSummary };

const TOOLING_KIND_LABELS: Record<string, string> = {
  terminal: "Terminal Practice",
  git: "Git Practice",
  scenario: "Scenario Based",
  debug: "Debugging",
  recovery: "Recovery",
};
const HTML_KIND_LABELS: Record<string, string> = {
  build: "Build",
  fix: "Bug Fix",
  a11y: "Accessibility",
  seo: "SEO",
  semantic: "Semantic HTML",
  interview: "Interview",
  project: "Mini Project",
};
const DEFAULT_ACADEMY_KIND_LABELS: Record<string, string> = {
  build: "Build",
  fix: "Bug Fix",
  layout: "Practice",
  responsive: "Responsive",
  interview: "Interview",
  project: "Mini Project",
};
const CSS_KIND_LABELS: Record<string, string> = {
  build: "Build",
  fix: "Bug Fix",
  layout: "Layout",
  responsive: "Responsive",
  interview: "Interview",
  project: "Mini Project",
};
type AcademyMeta = { kind?: string; scenario?: string };
function resolveAcademyMeta(
  moduleSlug: string,
  topicSlug: string,
  challengeId: string,
): AcademyMeta {
  if (isDeveloperToolingModule(moduleSlug)) {
    const c = findDeveloperToolingChallenge(topicSlug, challengeId);
    return { kind: c?.kind, scenario: c?.scenario };
  }
  if (isHtmlAcademyModule(moduleSlug)) {
    const c = findHtmlAcademyChallenge(topicSlug, challengeId);
    return { kind: c?.kind, scenario: c?.scenario };
  }
  if (isCssAcademyModule(moduleSlug)) {
    const c = findCssAcademyChallenge(topicSlug, challengeId);
    return { kind: c?.kind, scenario: c?.scenario };
  }
  if (isJsAcademyModule(moduleSlug)) {
    const c = findJsAcademyChallenge(topicSlug, challengeId);
    return { kind: c?.kind, scenario: c?.scenario };
  }
  if (isReactAcademyModule(moduleSlug)) {
    const c = findReactAcademyChallenge(topicSlug, challengeId);
    return { kind: c?.kind, scenario: c?.scenario };
  }
  if (isNextjsAcademyModule(moduleSlug)) {
    const c = findNextjsAcademyChallenge(topicSlug, challengeId);
    return { kind: c?.kind, scenario: c?.scenario };
  }
  if (isTypescriptAcademyModule(moduleSlug)) {
    const c = findTypescriptAcademyChallenge(topicSlug, challengeId);
    return { kind: c?.kind, scenario: c?.scenario };
  }
  if (isApisAcademyModule(moduleSlug)) {
    const c = findApisAcademyChallenge(topicSlug, challengeId);
    return { kind: c?.kind, scenario: c?.scenario };
  }
  if (isAuthAcademyModule(moduleSlug)) {
    const c = findAuthAcademyChallenge(topicSlug, challengeId);
    return { kind: c?.kind, scenario: c?.scenario };
  }
  if (isSqlAcademyModule(moduleSlug)) {
    const c = findSqlAcademyChallenge(topicSlug, challengeId);
    return { kind: c?.kind, scenario: c?.scenario };
  }
  if (isModelingAcademyModule(moduleSlug)) {
    const c = findModelingAcademyChallenge(topicSlug, challengeId);
    return { kind: c?.kind, scenario: c?.scenario };
  }
  if (isDeploymentAcademyModule(moduleSlug)) {
    const c = findDeploymentAcademyChallenge(topicSlug, challengeId);
    return { kind: c?.kind, scenario: c?.scenario };
  }
  if (isCicdAcademyModule(moduleSlug)) {
    const c = findCicdAcademyChallenge(topicSlug, challengeId);
    return { kind: c?.kind, scenario: c?.scenario };
  }
  if (isLlmAcademyModule(moduleSlug)) {
    const c = findLlmAcademyChallenge(topicSlug, challengeId);
    return { kind: c?.kind, scenario: c?.scenario };
  }
  if (isAiFeaturesAcademyModule(moduleSlug)) {
    const c = findAiFeaturesAcademyChallenge(topicSlug, challengeId);
    return { kind: c?.kind, scenario: c?.scenario };
  }
  if (isCapstoneAcademyModule(moduleSlug)) {
    const c = findCapstoneAcademyChallenge(topicSlug, challengeId);
    return { kind: c?.kind, scenario: c?.scenario };
  }
  if (isShipAcademyModule(moduleSlug)) {
    const c = findShipAcademyChallenge(topicSlug, challengeId);
    return { kind: c?.kind, scenario: c?.scenario };
  }
  if (isInterviewAcademyModule(moduleSlug)) {
    const c = findInterviewAcademyChallenge(topicSlug, challengeId);
    return { kind: c?.kind, scenario: c?.scenario };
  }
  if (isSystemsAcademyModule(moduleSlug)) {
    const c = findSystemsAcademyChallenge(topicSlug, challengeId);
    return { kind: c?.kind, scenario: c?.scenario };
  }
  return {};
}
function kindLabelFor(
  moduleSlug: string,
  kind: string | undefined,
  thinkingKind: string | undefined,
  problemType: string | undefined,
): string {
  if (thinkingKind) {
    return (
      THINKING_KIND_LABELS[thinkingKind as keyof typeof THINKING_KIND_LABELS] ??
      thinkingKind
    );
  }
  if (!kind) return problemTypeLabel(problemType);
  if (isDeveloperToolingModule(moduleSlug)) {
    return TOOLING_KIND_LABELS[kind] ?? kind;
  }
  if (isHtmlAcademyModule(moduleSlug)) {
    return HTML_KIND_LABELS[kind] ?? kind;
  }
  if (isCssAcademyModule(moduleSlug)) {
    return CSS_KIND_LABELS[kind] ?? kind;
  }
  return DEFAULT_ACADEMY_KIND_LABELS[kind] ?? kind;
}
/** * Server-only slim challenge rows for the module hub list. * Keeps LEARNING_BUNDLE + academy catalogs off the client graph. */ export function buildModuleHubChallengeSummaries(
  moduleSlug: string,
  lessons: LessonSummary[],
): ModuleHubChallengeSummary[] {
  const cards = buildTopicCards(lessons, moduleSlug);
  const items: ModuleHubChallengeSummary[] = [];
  cards.forEach((card, topicIndex) => {
    if (card.status === "locked") return;
    const challenges = resolveTopicChallenges(
      moduleSlug,
      card.slug,
      card.title,
      getTopicChallengeLimit(moduleSlug, card.slug),
    );
    challenges.forEach((challenge, lessonIndex) => {
      const academy = resolveAcademyMeta(moduleSlug, card.slug, challenge.id);
      const lesson = challenge.lesson;
      const thinking = challenge.thinking;
      const scenario =
        thinking?.scenario ??
        academy.scenario ??
        lesson.description ??
        `Practice ${categoryLabel(lesson.category)} concepts.`;
      items.push({
        id: challenge.id,
        entityId: curriculumChallengeEntityId(moduleSlug, {
          weekId: challenge.weekId || 0,
          topicSlug: challenge.topicSlug,
          lesson,
        }),
        weekId: challenge.weekId,
        topicSlug: challenge.topicSlug,
        curriculumTopicSlug: card.slug,
        curriculumTopicTitle: card.title,
        topicIndex,
        lessonIndex,
        title: lesson.title,
        difficulty: lesson.difficulty,
        category: lesson.category,
        problemType: lesson.problemType,
        estimatedMinutes: lesson.estimatedMinutes,
        kindLabel: kindLabelFor(
          moduleSlug,
          academy.kind,
          thinking?.kind,
          lesson.problemType,
        ),
        scenario,
      });
    });
  });
  return items;
}
