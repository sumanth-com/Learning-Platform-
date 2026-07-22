import type { LessonSummary } from "@/features/curriculum/types";
import { isProgrammingFundamentalsModule } from "@/features/curriculum/lib/programming-fundamentals";
import { isDeveloperToolingModule } from "@/features/curriculum/lib/developer-tooling";
import { isHtmlAcademyModule } from "@/features/curriculum/lib/html-academy";
import { isCssAcademyModule } from "@/features/curriculum/lib/css-academy";
import { isJsAcademyModule } from "@/features/curriculum/lib/js-academy";
import { isReactAcademyModule } from "@/features/curriculum/lib/react-academy";
import { isNextjsAcademyModule } from "@/features/curriculum/lib/nextjs-academy";
import { isTypescriptAcademyModule } from "@/features/curriculum/lib/typescript-academy";
import { isApisAcademyModule } from "@/features/curriculum/lib/apis-academy";
import { isAuthAcademyModule } from "@/features/curriculum/lib/auth-academy";
import { isSqlAcademyModule } from "@/features/curriculum/lib/sql-academy";
import { isModelingAcademyModule } from "@/features/curriculum/lib/modeling-academy";
import { isDeploymentAcademyModule } from "@/features/curriculum/lib/deployment-academy";
import { isCicdAcademyModule } from "@/features/curriculum/lib/cicd-academy";
import { isLlmAcademyModule } from "@/features/curriculum/lib/llm-academy";
import { isAiFeaturesAcademyModule } from "@/features/curriculum/lib/ai-features-academy";
import { isCapstoneAcademyModule } from "@/features/curriculum/lib/capstone-academy";
import { isShipAcademyModule } from "@/features/curriculum/lib/ship-academy";
import { isInterviewAcademyModule } from "@/features/curriculum/lib/interview-academy";
import { isSystemsAcademyModule } from "@/features/curriculum/lib/systems-academy";

export type TopicCardStatus = "completed" | "current" | "locked";

export type TopicCardModel = LessonSummary & {
  index: number;
  status: TopicCardStatus;
};

/**
 * Sequential unlock within a module:
 * completed → first incomplete is current → everything after is locked
 * (preview lessons stay reachable even when after the frontier).
 * Challenge-hub academies unlock all topics at once.
 */
export function buildTopicCards(
  lessons: LessonSummary[],
  moduleSlug?: string
): TopicCardModel[] {
  if (
    moduleSlug &&
    (isProgrammingFundamentalsModule(moduleSlug) ||
      isDeveloperToolingModule(moduleSlug) ||
      isHtmlAcademyModule(moduleSlug) ||
      isCssAcademyModule(moduleSlug) ||
      isJsAcademyModule(moduleSlug) ||
      isReactAcademyModule(moduleSlug) ||
      isNextjsAcademyModule(moduleSlug) ||
      isTypescriptAcademyModule(moduleSlug) ||
      isApisAcademyModule(moduleSlug) ||
      isAuthAcademyModule(moduleSlug) ||
      isSqlAcademyModule(moduleSlug) ||
      isModelingAcademyModule(moduleSlug) ||
      isDeploymentAcademyModule(moduleSlug) ||
      isCicdAcademyModule(moduleSlug) ||
      isLlmAcademyModule(moduleSlug) ||
      isAiFeaturesAcademyModule(moduleSlug) ||
      isCapstoneAcademyModule(moduleSlug) ||
      isShipAcademyModule(moduleSlug) ||
      isInterviewAcademyModule(moduleSlug) ||
      isSystemsAcademyModule(moduleSlug))
  ) {
    return lessons.map((lesson, index) => ({
      ...lesson,
      index,
      status: lesson.isCompleted
        ? ("completed" as const)
        : ("current" as const),
    }));
  }

  const frontier = lessons.findIndex((l) => !l.isCompleted);

  return lessons.map((lesson, index) => {
    if (lesson.isCompleted) {
      return { ...lesson, index, status: "completed" as const };
    }

    if (frontier === -1) {
      return { ...lesson, index, status: "completed" as const };
    }

    if (index === frontier) {
      return { ...lesson, index, status: "current" as const };
    }

    if (index < frontier) {
      return { ...lesson, index, status: "current" as const };
    }

    if (lesson.isPreview) {
      return { ...lesson, index, status: "current" as const };
    }

    return { ...lesson, index, status: "locked" as const };
  });
}

export function findResumeTopicCard(
  cards: TopicCardModel[]
): TopicCardModel | null {
  return (
    cards.find((c) => c.status === "current" && !c.isCompleted) ??
    cards.find((c) => c.status === "current") ??
    cards.find((c) => c.status === "completed") ??
    cards[0] ??
    null
  );
}
