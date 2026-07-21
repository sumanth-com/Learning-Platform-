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
  findProgrammingFundamentalsChallenge,
  listProgrammingFundamentalsChallenges,
} from "@/features/curriculum/lib/programming-fundamentals-challenges";
import {
  developerToolingChallengeCounts,
  getDeveloperToolingTopicLimit,
  isDeveloperToolingModule,
} from "@/features/curriculum/lib/developer-tooling";
import {
  findDeveloperToolingChallenge,
  listDeveloperToolingChallenges,
} from "@/features/curriculum/lib/developer-tooling-challenges";
import {
  getHtmlAcademyTopicLimit,
  htmlAcademyChallengeCounts,
  isHtmlAcademyModule,
} from "@/features/curriculum/lib/html-academy";
import {
  findHtmlAcademyChallenge,
  listHtmlAcademyChallenges,
} from "@/features/curriculum/lib/html-academy-challenges";
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

export function curriculumChallengeEntityId(
  moduleSlug: string,
  challenge: { weekId: number; topicSlug: string; lesson: { id: string } }
): string {
  return `curriculum-${moduleSlug}-${challenge.weekId}-${challenge.topicSlug}-${challenge.lesson.id}`;
}

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
  if (isProgrammingFundamentalsModule(moduleSlug)) {
    const decoded = decodeURIComponent(challengeId);
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
    const decoded = decodeURIComponent(challengeId);
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
    const decoded = decodeURIComponent(challengeId);
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

  const searchLimit = 12;
  const experience = getModuleChallengeExperience(moduleSlug);
  return (
    resolveTopicChallenges(moduleSlug, topicSlug, topicTitle, searchLimit)
      .map((c) => ({ ...c, experience: c.experience ?? experience }))
      .find(
        (c) => c.id === challengeId || c.lesson.id === challengeId
      ) ?? null
  );
}
