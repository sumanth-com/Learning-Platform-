import { LEARNING_BUNDLE } from "@/learning-engine/loader";
import type {
  LearnCategory,
  LearnDifficulty,
  LearnLesson,
} from "@/learning-engine/types";
import { isJavaLike } from "@/learning-engine/types";
import {
  getProgrammingFundamentalsTopicLimit,
  isProgrammingFundamentalsModule,
  programmingFundamentalsChallengeCounts,
} from "@/features/curriculum/lib/programming-fundamentals";
import {
  allProgrammingFundamentalsChallenges,
  findProgrammingFundamentalsChallenge,
  listProgrammingFundamentalsChallenges,
} from "@/features/curriculum/lib/programming-fundamentals-challenges";
import {
  developerToolingChallengeCounts,
  getDeveloperToolingTopicLimit,
  isDeveloperToolingModule,
} from "@/features/curriculum/lib/developer-tooling";
import {
  allDeveloperToolingChallenges,
  findDeveloperToolingChallenge,
  listDeveloperToolingChallenges,
} from "@/features/curriculum/lib/developer-tooling-challenges";
import {
  getHtmlAcademyTopicLimit,
  htmlAcademyChallengeCounts,
  isHtmlAcademyModule,
} from "@/features/curriculum/lib/html-academy";
import {
  allHtmlAcademyChallenges,
  findHtmlAcademyChallenge,
  listHtmlAcademyChallenges,
} from "@/features/curriculum/lib/html-academy-challenges";
import {
  cssAcademyChallengeCounts,
  getCssAcademyTopicLimit,
  isCssAcademyModule,
} from "@/features/curriculum/lib/css-academy";
import {
  allCssAcademyChallenges,
  findCssAcademyChallenge,
  listCssAcademyChallenges,
} from "@/features/curriculum/lib/css-academy-challenges";
import {
  jsAcademyChallengeCounts,
  getJsAcademyTopicLimit,
  isJsAcademyModule,
} from "@/features/curriculum/lib/js-academy";
import {
  allJsAcademyChallenges,
  findJsAcademyChallenge,
  listJsAcademyChallenges,
} from "@/features/curriculum/lib/js-academy-challenges";
import {
  reactAcademyChallengeCounts,
  getReactAcademyTopicLimit,
  isReactAcademyModule,
} from "@/features/curriculum/lib/react-academy";
import {
  allReactAcademyChallenges,
  findReactAcademyChallenge,
  listReactAcademyChallenges,
} from "@/features/curriculum/lib/react-academy-challenges";
import {
  nextjsAcademyChallengeCounts,
  getNextjsAcademyTopicLimit,
  isNextjsAcademyModule,
} from "@/features/curriculum/lib/nextjs-academy";
import {
  allNextjsAcademyChallenges,
  findNextjsAcademyChallenge,
  listNextjsAcademyChallenges,
} from "@/features/curriculum/lib/nextjs-academy-challenges";
import {
  typescriptAcademyChallengeCounts,
  getTypescriptAcademyTopicLimit,
  isTypescriptAcademyModule,
} from "@/features/curriculum/lib/typescript-academy";
import {
  allTypescriptAcademyChallenges,
  findTypescriptAcademyChallenge,
  listTypescriptAcademyChallenges,
} from "@/features/curriculum/lib/typescript-academy-challenges";
import {
  apisAcademyChallengeCounts,
  getApisAcademyTopicLimit,
  isApisAcademyModule,
} from "@/features/curriculum/lib/apis-academy";
import {
  allApisAcademyChallenges,
  findApisAcademyChallenge,
  listApisAcademyChallenges,
} from "@/features/curriculum/lib/apis-academy-challenges";
import {
  authAcademyChallengeCounts,
  getAuthAcademyTopicLimit,
  isAuthAcademyModule,
} from "@/features/curriculum/lib/auth-academy";
import {
  allAuthAcademyChallenges,
  findAuthAcademyChallenge,
  listAuthAcademyChallenges,
} from "@/features/curriculum/lib/auth-academy-challenges";
import {
  sqlAcademyChallengeCounts,
  getSqlAcademyTopicLimit,
  isSqlAcademyModule,
} from "@/features/curriculum/lib/sql-academy";
import {
  allSqlAcademyChallenges,
  findSqlAcademyChallenge,
  listSqlAcademyChallenges,
} from "@/features/curriculum/lib/sql-academy-challenges";
import {
  modelingAcademyChallengeCounts,
  getModelingAcademyTopicLimit,
  isModelingAcademyModule,
} from "@/features/curriculum/lib/modeling-academy";
import {
  allModelingAcademyChallenges,
  findModelingAcademyChallenge,
  listModelingAcademyChallenges,
} from "@/features/curriculum/lib/modeling-academy-challenges";
import {
  deploymentAcademyChallengeCounts,
  getDeploymentAcademyTopicLimit,
  isDeploymentAcademyModule,
} from "@/features/curriculum/lib/deployment-academy";
import {
  allDeploymentAcademyChallenges,
  findDeploymentAcademyChallenge,
  listDeploymentAcademyChallenges,
} from "@/features/curriculum/lib/deployment-academy-challenges";
import {
  cicdAcademyChallengeCounts,
  getCicdAcademyTopicLimit,
  isCicdAcademyModule,
} from "@/features/curriculum/lib/cicd-academy";
import {
  allCicdAcademyChallenges,
  findCicdAcademyChallenge,
  listCicdAcademyChallenges,
} from "@/features/curriculum/lib/cicd-academy-challenges";
import {
  llmAcademyChallengeCounts,
  getLlmAcademyTopicLimit,
  isLlmAcademyModule,
} from "@/features/curriculum/lib/llm-academy";
import {
  allLlmAcademyChallenges,
  findLlmAcademyChallenge,
  listLlmAcademyChallenges,
} from "@/features/curriculum/lib/llm-academy-challenges";
import {
  aiFeaturesAcademyChallengeCounts,
  getAiFeaturesAcademyTopicLimit,
  isAiFeaturesAcademyModule,
} from "@/features/curriculum/lib/ai-features-academy";
import {
  allAiFeaturesAcademyChallenges,
  findAiFeaturesAcademyChallenge,
  listAiFeaturesAcademyChallenges,
} from "@/features/curriculum/lib/ai-features-academy-challenges";
import {
  capstoneAcademyChallengeCounts,
  getCapstoneAcademyTopicLimit,
  isCapstoneAcademyModule,
} from "@/features/curriculum/lib/capstone-academy";
import {
  allCapstoneAcademyChallenges,
  findCapstoneAcademyChallenge,
  listCapstoneAcademyChallenges,
} from "@/features/curriculum/lib/capstone-academy-challenges";
import {
  shipAcademyChallengeCounts,
  getShipAcademyTopicLimit,
  isShipAcademyModule,
} from "@/features/curriculum/lib/ship-academy";
import {
  allShipAcademyChallenges,
  findShipAcademyChallenge,
  listShipAcademyChallenges,
} from "@/features/curriculum/lib/ship-academy-challenges";
import {
  interviewAcademyChallengeCounts,
  getInterviewAcademyTopicLimit,
  isInterviewAcademyModule,
} from "@/features/curriculum/lib/interview-academy";
import {
  allInterviewAcademyChallenges,
  findInterviewAcademyChallenge,
  listInterviewAcademyChallenges,
} from "@/features/curriculum/lib/interview-academy-challenges";
import {
  systemsAcademyChallengeCounts,
  getSystemsAcademyTopicLimit,
  isSystemsAcademyModule,
} from "@/features/curriculum/lib/systems-academy";
import {
  allSystemsAcademyChallenges,
  findSystemsAcademyChallenge,
  listSystemsAcademyChallenges,
} from "@/features/curriculum/lib/systems-academy-challenges";
import { getModuleChallengeExperience } from "@/features/curriculum/lib/challenge-experience";
import type { ChallengeExperienceKind } from "@/features/curriculum/lib/challenge-experience";
import type { ThinkingChallengeData } from "@/features/curriculum/lib/thinking-challenge";

export type TopicChallenge = {
  id: string;
  weekId: number;
  topicSlug: string;
  lesson: LearnLesson;
  source: "engine" | "synthetic";
  experience?: ChallengeExperienceKind;
  thinking?: ThinkingChallengeData;
};

const MODULE_CATEGORIES: Record<string, LearnCategory[]> = {
  "programming-fundamentals": ["java", "dsa"],
  "developer-tooling": ["git"],
  html: ["java"],
  css: ["java"],
  javascript: ["java", "dsa"],
  react: ["java"],
  nextjs: ["java"],
  typescript: ["java"],
  "apis-and-services": ["rest-api"],
  "auth-and-security": ["security"],
  "relational-databases": ["sql", "database-design"],
  "data-modeling": ["database-design", "sql"],
  "deployment-essentials": ["git"],
  "ci-cd-fundamentals": ["git"],
  "llm-fundamentals": ["ai"],
  "building-ai-features": ["ai"],
  "capstone-planning": ["java"],
  "ship-the-product": ["java"],
  "technical-interviews": ["dsa", "java"],
  "system-design-behavioral": ["java"],
};

function tokens(value: string): string[] {
  return value
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 2);
}

function flattenEngineLessons(): TopicChallenge[] {
  const out: TopicChallenge[] = [];
  for (const week of LEARNING_BUNDLE.weeks) {
    for (const topic of week.topics) {
      for (const lesson of topic.lessons) {
        out.push({
          id: lesson.id,
          weekId: week.weekId,
          topicSlug: topic.topic.slug,
          lesson,
          source: "engine",
        });
      }
    }
  }
  return out;
}

const ALL_ENGINE = flattenEngineLessons();

function scoreChallenge(
  item: TopicChallenge,
  topicSlug: string,
  topicTitle: string,
  categories: LearnCategory[]
): number {
  let score = 0;
  const topicTokens = new Set([
    ...tokens(topicSlug),
    ...tokens(topicTitle),
  ]);
  const hay = [
    item.topicSlug,
    item.lesson.title,
    item.lesson.description,
    item.lesson.category,
  ]
    .join(" ")
    .toLowerCase();

  for (const t of topicTokens) {
    if (hay.includes(t)) score += 3;
  }
  if (categories.includes(item.lesson.category)) score += 2;
  if (isJavaLike(item.lesson) || item.lesson.category === "git" || item.lesson.category === "sql") {
    score += 1;
  }
  return score;
}

function makeSynthetic(
  moduleSlug: string,
  topicSlug: string,
  topicTitle: string,
  index: number,
  difficulty: LearnDifficulty
): TopicChallenge {
  const id = `synth-${moduleSlug}-${topicSlug}-${index + 1}`;
  const minutes = difficulty === "easy" ? 10 : difficulty === "medium" ? 18 : 28;
  const title =
    index === 0
      ? `${topicTitle}: Warm-up`
      : index === 1
        ? `${topicTitle}: Apply the concept`
        : `${topicTitle}: Challenge`;

  const lesson = {
    id,
    topicSlug,
    weekId: 0,
    title,
    difficulty,
    category: "java" as const,
    description: `Practice what you learned in “${topicTitle}”. Write a small program that demonstrates the idea clearly.`,
    problemStatement: `## Problem\n\nApply the ideas from **${topicTitle}**.\n\nWrite a Java program that prints a short explanation of the concept, then demonstrates it with a concrete example.`,
    explanation: `Re-read the topic notes for ${topicTitle}, then implement a minimal example that proves you understand the concept.`,
    code: `public class Main {\n  public static void main(String[] args) {\n    // TODO: demonstrate ${topicTitle}\n    System.out.println("Ready to practice ${topicTitle}");\n  }\n}\n`,
    filename: "Main.java",
    expectedOutput: `Ready to practice ${topicTitle}`,
    commonMistakes: [
      "Skipping the concept explanation and jumping straight to code",
      "Writing code that compiles but does not demonstrate the topic idea",
    ],
    interviewTips: [`Explain ${topicTitle} out loud before coding.`],
    practiceQuestions: [`How would you teach ${topicTitle} to a junior developer?`],
    editorLanguage: "java" as const,
    estimatedMinutes: minutes,
    problemType: "logic" as const,
    hints: [
      `Start from the definition of ${topicTitle}.`,
      "Keep the example tiny — clarity beats cleverness.",
      "Print both the idea and a concrete result.",
    ],
    constraints: ["Use Java", "Keep the program under 40 lines", "Print clear console output"],
    exampleInput: "(none)",
    exampleOutput: `Ready to practice ${topicTitle}`,
    stepByStepExplanation: `1. Restate ${topicTitle} in one sentence.\n2. Pick one tiny example.\n3. Code it and print the result.`,
  } satisfies LearnLesson;

  return {
    id,
    weekId: 0,
    topicSlug,
    lesson,
    source: "synthetic",
  };
}

export { curriculumChallengeEntityId } from "@/features/curriculum/lib/challenge-entity-id";

export function getModuleChallengeStats(moduleSlug: string): {
  easy: number;
  medium: number;
  hard: number;
  total: number;
} | null {
  if (isProgrammingFundamentalsModule(moduleSlug)) {
    return programmingFundamentalsChallengeCounts();
  }
  if (isDeveloperToolingModule(moduleSlug)) {
    return developerToolingChallengeCounts();
  }
  if (isHtmlAcademyModule(moduleSlug)) {
    return htmlAcademyChallengeCounts();
  }
  if (isCssAcademyModule(moduleSlug)) {
    return cssAcademyChallengeCounts();
  }
  if (isJsAcademyModule(moduleSlug)) {
    return jsAcademyChallengeCounts();
  }
  if (isReactAcademyModule(moduleSlug)) {
    return reactAcademyChallengeCounts();
  }
  if (isNextjsAcademyModule(moduleSlug)) {
    return nextjsAcademyChallengeCounts();
  }
  if (isTypescriptAcademyModule(moduleSlug)) {
    return typescriptAcademyChallengeCounts();
  }
  if (isApisAcademyModule(moduleSlug)) {
    return apisAcademyChallengeCounts();
  }
  if (isAuthAcademyModule(moduleSlug)) {
    return authAcademyChallengeCounts();
  }
  if (isSqlAcademyModule(moduleSlug)) {
    return sqlAcademyChallengeCounts();
  }
  if (isModelingAcademyModule(moduleSlug)) {
    return modelingAcademyChallengeCounts();
  }
  if (isDeploymentAcademyModule(moduleSlug)) {
    return deploymentAcademyChallengeCounts();
  }
  if (isCicdAcademyModule(moduleSlug)) {
    return cicdAcademyChallengeCounts();
  }
  if (isLlmAcademyModule(moduleSlug)) {
    return llmAcademyChallengeCounts();
  }
  if (isAiFeaturesAcademyModule(moduleSlug)) {
    return aiFeaturesAcademyChallengeCounts();
  }
  if (isCapstoneAcademyModule(moduleSlug)) {
    return capstoneAcademyChallengeCounts();
  }
  if (isShipAcademyModule(moduleSlug)) {
    return shipAcademyChallengeCounts();
  }
  if (isInterviewAcademyModule(moduleSlug)) {
    return interviewAcademyChallengeCounts();
  }
  if (isSystemsAcademyModule(moduleSlug)) {
    return systemsAcademyChallengeCounts();
  }
  return null;
}

export function getTopicChallengeLimit(
  moduleSlug: string,
  topicSlug: string
): number {
  if (isProgrammingFundamentalsModule(moduleSlug)) {
    return getProgrammingFundamentalsTopicLimit(topicSlug);
  }
  if (isDeveloperToolingModule(moduleSlug)) {
    return getDeveloperToolingTopicLimit(topicSlug);
  }
  if (isHtmlAcademyModule(moduleSlug)) {
    return getHtmlAcademyTopicLimit(topicSlug);
  }
  if (isCssAcademyModule(moduleSlug)) {
    return getCssAcademyTopicLimit(topicSlug);
  }
  if (isJsAcademyModule(moduleSlug)) {
    return getJsAcademyTopicLimit(topicSlug);
  }
  if (isReactAcademyModule(moduleSlug)) {
    return getReactAcademyTopicLimit(topicSlug);
  }
  if (isNextjsAcademyModule(moduleSlug)) {
    return getNextjsAcademyTopicLimit(topicSlug);
  }
  if (isTypescriptAcademyModule(moduleSlug)) {
    return getTypescriptAcademyTopicLimit(topicSlug);
  }
  if (isApisAcademyModule(moduleSlug)) {
    return getApisAcademyTopicLimit(topicSlug);
  }
  if (isAuthAcademyModule(moduleSlug)) {
    return getAuthAcademyTopicLimit(topicSlug);
  }
  if (isSqlAcademyModule(moduleSlug)) {
    return getSqlAcademyTopicLimit(topicSlug);
  }
  if (isModelingAcademyModule(moduleSlug)) {
    return getModelingAcademyTopicLimit(topicSlug);
  }
  if (isDeploymentAcademyModule(moduleSlug)) {
    return getDeploymentAcademyTopicLimit(topicSlug);
  }
  if (isCicdAcademyModule(moduleSlug)) {
    return getCicdAcademyTopicLimit(topicSlug);
  }
  if (isLlmAcademyModule(moduleSlug)) {
    return getLlmAcademyTopicLimit(topicSlug);
  }
  if (isAiFeaturesAcademyModule(moduleSlug)) {
    return getAiFeaturesAcademyTopicLimit(topicSlug);
  }
  if (isCapstoneAcademyModule(moduleSlug)) {
    return getCapstoneAcademyTopicLimit(topicSlug);
  }
  if (isShipAcademyModule(moduleSlug)) {
    return getShipAcademyTopicLimit(topicSlug);
  }
  if (isInterviewAcademyModule(moduleSlug)) {
    return getInterviewAcademyTopicLimit(topicSlug);
  }
  if (isSystemsAcademyModule(moduleSlug)) {
    return getSystemsAcademyTopicLimit(topicSlug);
  }
  return 4;
}

function engineChallengesForTopic(
  weekId: number,
  engineTopicSlug: string,
  lessons: LearnLesson[]
): TopicChallenge[] {
  return lessons.map((lesson) => ({
    id: lesson.id,
    weekId,
    topicSlug: engineTopicSlug,
    lesson,
    source: "engine" as const,
  }));
}

/**
 * Resolve practice challenges for a curriculum topic without schema changes.
 * Prefers Learning Engine content when categories/keywords match; otherwise
 * generates topic-scoped synthetic challenges that work in the code workspace.
 */
export function resolveTopicChallenges(
  moduleSlug: string,
  topicSlug: string,
  topicTitle: string,
  limit?: number
): TopicChallenge[] {
  if (isProgrammingFundamentalsModule(moduleSlug)) {
    const max = limit ?? getProgrammingFundamentalsTopicLimit(topicSlug);
    return listProgrammingFundamentalsChallenges(topicSlug)
      .slice(0, max)
      .map(
        (c) =>
          ({
            id: c.id,
            weekId: c.weekId,
            topicSlug: c.topicSlug,
            lesson: c.lesson,
            source: "synthetic" as const,
            experience: "thinking" as const,
            thinking: c.thinking,
          }) satisfies TopicChallenge
      );
  }

  if (isDeveloperToolingModule(moduleSlug)) {
    const max = limit ?? getDeveloperToolingTopicLimit(topicSlug);
    return listDeveloperToolingChallenges(topicSlug)
      .slice(0, max)
      .map(
        (c) =>
          ({
            id: c.id,
            weekId: c.weekId,
            topicSlug: c.topicSlug,
            lesson: c.lesson,
            source: "synthetic" as const,
            experience: "tooling" as const,
          }) satisfies TopicChallenge
      );
  }

  if (isHtmlAcademyModule(moduleSlug)) {
    const max = limit ?? getHtmlAcademyTopicLimit(topicSlug);
    return listHtmlAcademyChallenges(topicSlug)
      .slice(0, max)
      .map(
        (c) =>
          ({
            id: c.id,
            weekId: c.weekId,
            topicSlug: c.topicSlug,
            lesson: c.lesson,
            source: "synthetic" as const,
            experience: "html-live" as const,
          }) satisfies TopicChallenge
      );
  }

  if (isCssAcademyModule(moduleSlug)) {
    const max = limit ?? getCssAcademyTopicLimit(topicSlug);
    return listCssAcademyChallenges(topicSlug)
      .slice(0, max)
      .map(
        (c) =>
          ({
            id: c.id,
            weekId: c.weekId,
            topicSlug: c.topicSlug,
            lesson: c.lesson,
            source: "synthetic" as const,
            experience: "css-live" as const,
          }) satisfies TopicChallenge
      );
  }

  if (isJsAcademyModule(moduleSlug)) {
    const max = limit ?? getJsAcademyTopicLimit(topicSlug);
    return listJsAcademyChallenges(topicSlug)
      .slice(0, max)
      .map(
        (c) =>
          ({
            id: c.id,
            weekId: c.weekId,
            topicSlug: c.topicSlug,
            lesson: c.lesson,
            source: "synthetic" as const,
            experience: "javascript-console" as const,
          }) satisfies TopicChallenge
      );
  }

  if (isReactAcademyModule(moduleSlug)) {
    const max = limit ?? getReactAcademyTopicLimit(topicSlug);
    return listReactAcademyChallenges(topicSlug)
      .slice(0, max)
      .map(
        (c) =>
          ({
            id: c.id,
            weekId: c.weekId,
            topicSlug: c.topicSlug,
            lesson: c.lesson,
            source: "synthetic" as const,
            experience: "react-preview" as const,
          }) satisfies TopicChallenge
      );
  }

  if (isNextjsAcademyModule(moduleSlug)) {
    const max = limit ?? getNextjsAcademyTopicLimit(topicSlug);
    return listNextjsAcademyChallenges(topicSlug)
      .slice(0, max)
      .map(
        (c) =>
          ({
            id: c.id,
            weekId: c.weekId,
            topicSlug: c.topicSlug,
            lesson: c.lesson,
            source: "synthetic" as const,
            experience: "nextjs-preview" as const,
          }) satisfies TopicChallenge
      );
  }

  if (isTypescriptAcademyModule(moduleSlug)) {
    const max = limit ?? getTypescriptAcademyTopicLimit(topicSlug);
    return listTypescriptAcademyChallenges(topicSlug)
      .slice(0, max)
      .map(
        (c) =>
          ({
            id: c.id,
            weekId: c.weekId,
            topicSlug: c.topicSlug,
            lesson: c.lesson,
            source: "synthetic" as const,
            experience: "typescript-console" as const,
          }) satisfies TopicChallenge
      );
  }

  if (isApisAcademyModule(moduleSlug)) {
    const max = limit ?? getApisAcademyTopicLimit(topicSlug);
    return listApisAcademyChallenges(topicSlug)
      .slice(0, max)
      .map(
        (c) =>
          ({
            id: c.id,
            weekId: c.weekId,
            topicSlug: c.topicSlug,
            lesson: c.lesson,
            source: "synthetic" as const,
            experience: "api-playground" as const,
          }) satisfies TopicChallenge
      );
  }

  if (isAuthAcademyModule(moduleSlug)) {
    const max = limit ?? getAuthAcademyTopicLimit(topicSlug);
    return listAuthAcademyChallenges(topicSlug)
      .slice(0, max)
      .map(
        (c) =>
          ({
            id: c.id,
            weekId: c.weekId,
            topicSlug: c.topicSlug,
            lesson: c.lesson,
            source: "synthetic" as const,
            experience: "auth-lab" as const,
          }) satisfies TopicChallenge
      );
  }

  if (isSqlAcademyModule(moduleSlug)) {
    const max = limit ?? getSqlAcademyTopicLimit(topicSlug);
    return listSqlAcademyChallenges(topicSlug)
      .slice(0, max)
      .map(
        (c) =>
          ({
            id: c.id,
            weekId: c.weekId,
            topicSlug: c.topicSlug,
            lesson: c.lesson,
            source: "synthetic" as const,
            experience: "sql-editor" as const,
          }) satisfies TopicChallenge
      );
  }

  if (isModelingAcademyModule(moduleSlug)) {
    const max = limit ?? getModelingAcademyTopicLimit(topicSlug);
    return listModelingAcademyChallenges(topicSlug)
      .slice(0, max)
      .map(
        (c) =>
          ({
            id: c.id,
            weekId: c.weekId,
            topicSlug: c.topicSlug,
            lesson: c.lesson,
            source: "synthetic" as const,
            experience: "modeling-lab" as const,
          }) satisfies TopicChallenge
      );
  }

  if (isDeploymentAcademyModule(moduleSlug)) {
    const max = limit ?? getDeploymentAcademyTopicLimit(topicSlug);
    return listDeploymentAcademyChallenges(topicSlug)
      .slice(0, max)
      .map(
        (c) =>
          ({
            id: c.id,
            weekId: c.weekId,
            topicSlug: c.topicSlug,
            lesson: c.lesson,
            source: "synthetic" as const,
            experience: "deploy-lab" as const,
          }) satisfies TopicChallenge
      );
  }

  if (isCicdAcademyModule(moduleSlug)) {
    const max = limit ?? getCicdAcademyTopicLimit(topicSlug);
    return listCicdAcademyChallenges(topicSlug)
      .slice(0, max)
      .map(
        (c) =>
          ({
            id: c.id,
            weekId: c.weekId,
            topicSlug: c.topicSlug,
            lesson: c.lesson,
            source: "synthetic" as const,
            experience: "cicd-lab" as const,
          }) satisfies TopicChallenge
      );
  }

  if (isLlmAcademyModule(moduleSlug)) {
    const max = limit ?? getLlmAcademyTopicLimit(topicSlug);
    return listLlmAcademyChallenges(topicSlug)
      .slice(0, max)
      .map(
        (c) =>
          ({
            id: c.id,
            weekId: c.weekId,
            topicSlug: c.topicSlug,
            lesson: c.lesson,
            source: "synthetic" as const,
            experience: "llm-lab" as const,
          }) satisfies TopicChallenge
      );
  }

  if (isAiFeaturesAcademyModule(moduleSlug)) {
    const max = limit ?? getAiFeaturesAcademyTopicLimit(topicSlug);
    return listAiFeaturesAcademyChallenges(topicSlug)
      .slice(0, max)
      .map(
        (c) =>
          ({
            id: c.id,
            weekId: c.weekId,
            topicSlug: c.topicSlug,
            lesson: c.lesson,
            source: "synthetic" as const,
            experience: "ai-lab" as const,
          }) satisfies TopicChallenge
      );
  }

  if (isCapstoneAcademyModule(moduleSlug)) {
    const max = limit ?? getCapstoneAcademyTopicLimit(topicSlug);
    return listCapstoneAcademyChallenges(topicSlug)
      .slice(0, max)
      .map(
        (c) =>
          ({
            id: c.id,
            weekId: c.weekId,
            topicSlug: c.topicSlug,
            lesson: c.lesson,
            source: "synthetic" as const,
            experience: "capstone-lab" as const,
          }) satisfies TopicChallenge
      );
  }

  if (isShipAcademyModule(moduleSlug)) {
    const max = limit ?? getShipAcademyTopicLimit(topicSlug);
    return listShipAcademyChallenges(topicSlug)
      .slice(0, max)
      .map(
        (c) =>
          ({
            id: c.id,
            weekId: c.weekId,
            topicSlug: c.topicSlug,
            lesson: c.lesson,
            source: "synthetic" as const,
            experience: "ship-lab" as const,
          }) satisfies TopicChallenge
      );
  }

  if (isInterviewAcademyModule(moduleSlug)) {
    const max = limit ?? getInterviewAcademyTopicLimit(topicSlug);
    return listInterviewAcademyChallenges(topicSlug)
      .slice(0, max)
      .map(
        (c) =>
          ({
            id: c.id,
            weekId: c.weekId,
            topicSlug: c.topicSlug,
            lesson: c.lesson,
            source: "synthetic" as const,
            experience: "interview-lab" as const,
          }) satisfies TopicChallenge
      );
  }

  if (isSystemsAcademyModule(moduleSlug)) {
    const max = limit ?? getSystemsAcademyTopicLimit(topicSlug);
    return listSystemsAcademyChallenges(topicSlug)
      .slice(0, max)
      .map(
        (c) =>
          ({
            id: c.id,
            weekId: c.weekId,
            topicSlug: c.topicSlug,
            lesson: c.lesson,
            source: "synthetic" as const,
            experience: "systems-lab" as const,
          }) satisfies TopicChallenge
      );
  }

  const resolvedLimit = limit ?? 4;
  const categories =
    MODULE_CATEGORIES[moduleSlug] ?? (["java"] as LearnCategory[]);

  const ranked = ALL_ENGINE
    .map((item) => ({
      item,
      score: scoreChallenge(item, topicSlug, topicTitle, categories),
    }))
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((row) => row.item);

  // Prefer unique titles; keep first hits
  const seen = new Set<string>();
  const picked: TopicChallenge[] = [];
  for (const item of ranked) {
    if (seen.has(item.lesson.title)) continue;
    seen.add(item.lesson.title);
    picked.push(item);
    if (picked.length >= resolvedLimit) break;
  }

  const difficulties: LearnDifficulty[] = ["easy", "medium", "hard"];
  let i = 0;
  while (picked.length < Math.min(3, resolvedLimit)) {
    picked.push(
      makeSynthetic(
        moduleSlug,
        topicSlug,
        topicTitle,
        i,
        difficulties[i % difficulties.length]!
      )
    );
    i += 1;
  }

  return picked.slice(0, resolvedLimit).map((c) => ({
    ...c,
    experience: c.experience ?? getModuleChallengeExperience(moduleSlug),
  }));
}

export function findTopicChallenge(
  moduleSlug: string,
  topicSlug: string,
  topicTitle: string,
  challengeId: string
): TopicChallenge | null {
    const decoded = decodeURIComponent(challengeId);

  if (isProgrammingFundamentalsModule(moduleSlug)) {
    const found = findProgrammingFundamentalsChallenge(topicSlug, decoded);
    if (!found) return null;
    return {
      id: found.id,
      weekId: found.weekId,
      topicSlug: found.topicSlug,
      lesson: found.lesson,
      source: "synthetic" as const,
      experience: "thinking" as const,
      thinking: found.thinking,
    } satisfies TopicChallenge;
  }

  if (isDeveloperToolingModule(moduleSlug)) {
    const found = findDeveloperToolingChallenge(topicSlug, decoded);
    if (!found) return null;
    return {
      id: found.id,
      weekId: found.weekId,
      topicSlug: found.topicSlug,
      lesson: found.lesson,
      source: "synthetic" as const,
      experience: "tooling" as const,
    } satisfies TopicChallenge;
  }

  if (isHtmlAcademyModule(moduleSlug)) {
    const found = findHtmlAcademyChallenge(topicSlug, decoded);
    if (!found) return null;
    return {
      id: found.id,
      weekId: found.weekId,
      topicSlug: found.topicSlug,
      lesson: found.lesson,
      source: "synthetic" as const,
      experience: "html-live" as const,
    } satisfies TopicChallenge;
  }

  if (isCssAcademyModule(moduleSlug)) {
    const found = findCssAcademyChallenge(topicSlug, decoded);
    if (!found) return null;
    return {
      id: found.id,
      weekId: found.weekId,
      topicSlug: found.topicSlug,
      lesson: found.lesson,
      source: "synthetic" as const,
      experience: "css-live" as const,
    } satisfies TopicChallenge;
  }

  if (isJsAcademyModule(moduleSlug)) {
    const found = findJsAcademyChallenge(topicSlug, decoded);
    if (!found) return null;
    return {
      id: found.id,
      weekId: found.weekId,
      topicSlug: found.topicSlug,
      lesson: found.lesson,
      source: "synthetic" as const,
      experience: "javascript-console" as const,
    } satisfies TopicChallenge;
  }

  if (isReactAcademyModule(moduleSlug)) {
    const found = findReactAcademyChallenge(topicSlug, decoded);
    if (!found) return null;
    return {
      id: found.id,
      weekId: found.weekId,
      topicSlug: found.topicSlug,
      lesson: found.lesson,
      source: "synthetic" as const,
      experience: "react-preview" as const,
    } satisfies TopicChallenge;
  }

  if (isNextjsAcademyModule(moduleSlug)) {
    const found = findNextjsAcademyChallenge(topicSlug, decoded);
    if (!found) return null;
    return {
      id: found.id,
      weekId: found.weekId,
      topicSlug: found.topicSlug,
      lesson: found.lesson,
      source: "synthetic" as const,
      experience: "nextjs-preview" as const,
    } satisfies TopicChallenge;
  }

  if (isTypescriptAcademyModule(moduleSlug)) {
    const found = findTypescriptAcademyChallenge(topicSlug, decoded);
    if (!found) return null;
    return {
      id: found.id,
      weekId: found.weekId,
      topicSlug: found.topicSlug,
      lesson: found.lesson,
      source: "synthetic" as const,
      experience: "typescript-console" as const,
    } satisfies TopicChallenge;
  }

  if (isApisAcademyModule(moduleSlug)) {
    const found = findApisAcademyChallenge(topicSlug, decoded);
    if (!found) return null;
    return {
      id: found.id,
      weekId: found.weekId,
      topicSlug: found.topicSlug,
      lesson: found.lesson,
      source: "synthetic" as const,
      experience: "api-playground" as const,
    } satisfies TopicChallenge;
  }

  if (isAuthAcademyModule(moduleSlug)) {
    const found = findAuthAcademyChallenge(topicSlug, decoded);
    if (!found) return null;
    return {
      id: found.id,
      weekId: found.weekId,
      topicSlug: found.topicSlug,
      lesson: found.lesson,
      source: "synthetic" as const,
      experience: "auth-lab" as const,
    } satisfies TopicChallenge;
  }

  if (isSqlAcademyModule(moduleSlug)) {
    const found = findSqlAcademyChallenge(topicSlug, decoded);
    if (!found) return null;
    return {
      id: found.id,
      weekId: found.weekId,
      topicSlug: found.topicSlug,
      lesson: found.lesson,
      source: "synthetic" as const,
      experience: "sql-editor" as const,
    } satisfies TopicChallenge;
  }

  if (isModelingAcademyModule(moduleSlug)) {
    const found = findModelingAcademyChallenge(topicSlug, decoded);
    if (!found) return null;
    return {
      id: found.id,
      weekId: found.weekId,
      topicSlug: found.topicSlug,
      lesson: found.lesson,
      source: "synthetic" as const,
      experience: "modeling-lab" as const,
    } satisfies TopicChallenge;
  }

  if (isDeploymentAcademyModule(moduleSlug)) {
    const found = findDeploymentAcademyChallenge(topicSlug, decoded);
    if (!found) return null;
    return {
      id: found.id,
      weekId: found.weekId,
      topicSlug: found.topicSlug,
      lesson: found.lesson,
      source: "synthetic" as const,
      experience: "deploy-lab" as const,
    } satisfies TopicChallenge;
  }

  if (isCicdAcademyModule(moduleSlug)) {
    const found = findCicdAcademyChallenge(topicSlug, decoded);
    if (!found) return null;
    return {
      id: found.id,
      weekId: found.weekId,
      topicSlug: found.topicSlug,
      lesson: found.lesson,
      source: "synthetic" as const,
      experience: "cicd-lab" as const,
    } satisfies TopicChallenge;
  }

  if (isLlmAcademyModule(moduleSlug)) {
    const found = findLlmAcademyChallenge(topicSlug, decoded);
    if (!found) return null;
    return {
      id: found.id,
      weekId: found.weekId,
      topicSlug: found.topicSlug,
      lesson: found.lesson,
      source: "synthetic" as const,
      experience: "llm-lab" as const,
    } satisfies TopicChallenge;
  }

  if (isAiFeaturesAcademyModule(moduleSlug)) {
    const found = findAiFeaturesAcademyChallenge(topicSlug, decoded);
    if (!found) return null;
    return {
      id: found.id,
      weekId: found.weekId,
      topicSlug: found.topicSlug,
      lesson: found.lesson,
      source: "synthetic" as const,
      experience: "ai-lab" as const,
    } satisfies TopicChallenge;
  }

  if (isCapstoneAcademyModule(moduleSlug)) {
    const found = findCapstoneAcademyChallenge(topicSlug, decoded);
    if (!found) return null;
    return {
      id: found.id,
      weekId: found.weekId,
      topicSlug: found.topicSlug,
      lesson: found.lesson,
      source: "synthetic" as const,
      experience: "capstone-lab" as const,
    } satisfies TopicChallenge;
  }

  if (isShipAcademyModule(moduleSlug)) {
    const found = findShipAcademyChallenge(topicSlug, decoded);
    if (!found) return null;
    return {
      id: found.id,
      weekId: found.weekId,
      topicSlug: found.topicSlug,
      lesson: found.lesson,
      source: "synthetic" as const,
      experience: "ship-lab" as const,
    } satisfies TopicChallenge;
  }

  if (isInterviewAcademyModule(moduleSlug)) {
    const found = findInterviewAcademyChallenge(topicSlug, decoded);
    if (!found) return null;
    return {
      id: found.id,
      weekId: found.weekId,
      topicSlug: found.topicSlug,
      lesson: found.lesson,
      source: "synthetic" as const,
      experience: "interview-lab" as const,
    } satisfies TopicChallenge;
  }

  if (isSystemsAcademyModule(moduleSlug)) {
    const found = findSystemsAcademyChallenge(topicSlug, decoded);
    if (!found) return null;
    return {
      id: found.id,
      weekId: found.weekId,
      topicSlug: found.topicSlug,
      lesson: found.lesson,
      source: "synthetic" as const,
      experience: "systems-lab" as const,
    } satisfies TopicChallenge;
  }

  const searchLimit = 12;
  const experience = getModuleChallengeExperience(moduleSlug);
  return (
    resolveTopicChallenges(moduleSlug, topicSlug, topicTitle, searchLimit)
      .map((c) => ({ ...c, experience: c.experience ?? experience }))
      .find((c) => c.id === decoded || c.lesson.id === decoded) ?? null
  );
}

/**
 * Resolve a challenge by id alone (flat /module/:slug/challenge/:id routes).
 * Falls back to scanning module topic lessons for engine-backed modules.
 */
export function findModuleChallenge(
  moduleSlug: string,
  challengeId: string,
  lessons: Array<{ slug: string; title: string }> = []
): TopicChallenge | null {
  const decoded = decodeURIComponent(challengeId);

  if (isProgrammingFundamentalsModule(moduleSlug)) {
    const found = allProgrammingFundamentalsChallenges().find(
      (c) => c.id === decoded || c.lesson.id === decoded
    );
    if (!found) return null;
    return {
      id: found.id,
      weekId: found.weekId,
      topicSlug: found.topicSlug,
      lesson: found.lesson,
      source: "synthetic" as const,
      experience: "thinking" as const,
      thinking: found.thinking,
    } satisfies TopicChallenge;
  }

  if (isDeveloperToolingModule(moduleSlug)) {
    const found = allDeveloperToolingChallenges().find(
      (c) => c.id === decoded || c.lesson.id === decoded
    );
    if (!found) return null;
    return {
      id: found.id,
      weekId: found.weekId,
      topicSlug: found.topicSlug,
      lesson: found.lesson,
      source: "synthetic" as const,
      experience: "tooling" as const,
    } satisfies TopicChallenge;
  }

  if (isHtmlAcademyModule(moduleSlug)) {
    const found = allHtmlAcademyChallenges().find(
      (c) => c.id === decoded || c.lesson.id === decoded
    );
    if (!found) return null;
    return {
      id: found.id,
      weekId: found.weekId,
      topicSlug: found.topicSlug,
      lesson: found.lesson,
      source: "synthetic" as const,
      experience: "html-live" as const,
    } satisfies TopicChallenge;
  }

  if (isCssAcademyModule(moduleSlug)) {
    const found = allCssAcademyChallenges().find(
      (c) => c.id === decoded || c.lesson.id === decoded
    );
    if (!found) return null;
    return {
      id: found.id,
      weekId: found.weekId,
      topicSlug: found.topicSlug,
      lesson: found.lesson,
      source: "synthetic" as const,
      experience: "css-live" as const,
    } satisfies TopicChallenge;
  }

  if (isJsAcademyModule(moduleSlug)) {
    const found = allJsAcademyChallenges().find(
      (c) => c.id === decoded || c.lesson.id === decoded
    );
    if (!found) return null;
    return {
      id: found.id,
      weekId: found.weekId,
      topicSlug: found.topicSlug,
      lesson: found.lesson,
      source: "synthetic" as const,
      experience: "javascript-console" as const,
    } satisfies TopicChallenge;
  }

  if (isReactAcademyModule(moduleSlug)) {
    const found = allReactAcademyChallenges().find(
      (c) => c.id === decoded || c.lesson.id === decoded
    );
    if (!found) return null;
    return {
      id: found.id,
      weekId: found.weekId,
      topicSlug: found.topicSlug,
      lesson: found.lesson,
      source: "synthetic" as const,
      experience: "react-preview" as const,
    } satisfies TopicChallenge;
  }

  if (isNextjsAcademyModule(moduleSlug)) {
    const found = allNextjsAcademyChallenges().find(
      (c) => c.id === decoded || c.lesson.id === decoded
    );
    if (!found) return null;
    return {
      id: found.id,
      weekId: found.weekId,
      topicSlug: found.topicSlug,
      lesson: found.lesson,
      source: "synthetic" as const,
      experience: "nextjs-preview" as const,
    } satisfies TopicChallenge;
  }

  if (isTypescriptAcademyModule(moduleSlug)) {
    const found = allTypescriptAcademyChallenges().find(
      (c) => c.id === decoded || c.lesson.id === decoded
    );
    if (!found) return null;
    return {
      id: found.id,
      weekId: found.weekId,
      topicSlug: found.topicSlug,
      lesson: found.lesson,
      source: "synthetic" as const,
      experience: "typescript-console" as const,
    } satisfies TopicChallenge;
  }

  if (isApisAcademyModule(moduleSlug)) {
    const found = allApisAcademyChallenges().find(
      (c) => c.id === decoded || c.lesson.id === decoded
    );
    if (!found) return null;
    return {
      id: found.id,
      weekId: found.weekId,
      topicSlug: found.topicSlug,
      lesson: found.lesson,
      source: "synthetic" as const,
      experience: "api-playground" as const,
    } satisfies TopicChallenge;
  }

  if (isAuthAcademyModule(moduleSlug)) {
    const found = allAuthAcademyChallenges().find(
      (c) => c.id === decoded || c.lesson.id === decoded
    );
    if (!found) return null;
    return {
      id: found.id,
      weekId: found.weekId,
      topicSlug: found.topicSlug,
      lesson: found.lesson,
      source: "synthetic" as const,
      experience: "auth-lab" as const,
    } satisfies TopicChallenge;
  }

  if (isSqlAcademyModule(moduleSlug)) {
    const found = allSqlAcademyChallenges().find(
      (c) => c.id === decoded || c.lesson.id === decoded
    );
    if (!found) return null;
    return {
      id: found.id,
      weekId: found.weekId,
      topicSlug: found.topicSlug,
      lesson: found.lesson,
      source: "synthetic" as const,
      experience: "sql-editor" as const,
    } satisfies TopicChallenge;
  }

  if (isModelingAcademyModule(moduleSlug)) {
    const found = allModelingAcademyChallenges().find(
      (c) => c.id === decoded || c.lesson.id === decoded
    );
    if (!found) return null;
    return {
      id: found.id,
      weekId: found.weekId,
      topicSlug: found.topicSlug,
      lesson: found.lesson,
      source: "synthetic" as const,
      experience: "modeling-lab" as const,
    } satisfies TopicChallenge;
  }

  if (isDeploymentAcademyModule(moduleSlug)) {
    const found = allDeploymentAcademyChallenges().find(
      (c) => c.id === decoded || c.lesson.id === decoded
    );
    if (!found) return null;
    return {
      id: found.id,
      weekId: found.weekId,
      topicSlug: found.topicSlug,
      lesson: found.lesson,
      source: "synthetic" as const,
      experience: "deploy-lab" as const,
    } satisfies TopicChallenge;
  }

  if (isCicdAcademyModule(moduleSlug)) {
    const found = allCicdAcademyChallenges().find(
      (c) => c.id === decoded || c.lesson.id === decoded
    );
    if (!found) return null;
    return {
      id: found.id,
      weekId: found.weekId,
      topicSlug: found.topicSlug,
      lesson: found.lesson,
      source: "synthetic" as const,
      experience: "cicd-lab" as const,
    } satisfies TopicChallenge;
  }

  if (isLlmAcademyModule(moduleSlug)) {
    const found = allLlmAcademyChallenges().find(
      (c) => c.id === decoded || c.lesson.id === decoded
    );
    if (!found) return null;
    return {
      id: found.id,
      weekId: found.weekId,
      topicSlug: found.topicSlug,
      lesson: found.lesson,
      source: "synthetic" as const,
      experience: "llm-lab" as const,
    } satisfies TopicChallenge;
  }

  if (isAiFeaturesAcademyModule(moduleSlug)) {
    const found = allAiFeaturesAcademyChallenges().find(
      (c) => c.id === decoded || c.lesson.id === decoded
    );
    if (!found) return null;
    return {
      id: found.id,
      weekId: found.weekId,
      topicSlug: found.topicSlug,
      lesson: found.lesson,
      source: "synthetic" as const,
      experience: "ai-lab" as const,
    } satisfies TopicChallenge;
  }

  if (isCapstoneAcademyModule(moduleSlug)) {
    const found = allCapstoneAcademyChallenges().find(
      (c) => c.id === decoded || c.lesson.id === decoded
    );
    if (!found) return null;
    return {
      id: found.id,
      weekId: found.weekId,
      topicSlug: found.topicSlug,
      lesson: found.lesson,
      source: "synthetic" as const,
      experience: "capstone-lab" as const,
    } satisfies TopicChallenge;
  }

  if (isShipAcademyModule(moduleSlug)) {
    const found = allShipAcademyChallenges().find(
      (c) => c.id === decoded || c.lesson.id === decoded
    );
    if (!found) return null;
    return {
      id: found.id,
      weekId: found.weekId,
      topicSlug: found.topicSlug,
      lesson: found.lesson,
      source: "synthetic" as const,
      experience: "ship-lab" as const,
    } satisfies TopicChallenge;
  }

  if (isInterviewAcademyModule(moduleSlug)) {
    const found = allInterviewAcademyChallenges().find(
      (c) => c.id === decoded || c.lesson.id === decoded
    );
    if (!found) return null;
    return {
      id: found.id,
      weekId: found.weekId,
      topicSlug: found.topicSlug,
      lesson: found.lesson,
      source: "synthetic" as const,
      experience: "interview-lab" as const,
    } satisfies TopicChallenge;
  }

  if (isSystemsAcademyModule(moduleSlug)) {
    const found = allSystemsAcademyChallenges().find(
      (c) => c.id === decoded || c.lesson.id === decoded
    );
    if (!found) return null;
    return {
      id: found.id,
      weekId: found.weekId,
      topicSlug: found.topicSlug,
      lesson: found.lesson,
      source: "synthetic" as const,
      experience: "systems-lab" as const,
    } satisfies TopicChallenge;
  }

  for (const lesson of lessons) {
    const found = findTopicChallenge(
      moduleSlug,
      lesson.slug,
      lesson.title,
      decoded
    );
    if (found) return found;
  }

  return null;
}
