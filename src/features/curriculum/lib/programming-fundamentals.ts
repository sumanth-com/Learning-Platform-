import type { LessonSummary } from "@/features/curriculum/types";
import {
  allProgrammingFundamentalsChallenges,
  programmingFundamentalsTopicChallengeCount,
} from "@/features/curriculum/lib/programming-fundamentals-challenges";

export const PROGRAMMING_FUNDAMENTALS_SLUG = "programming-fundamentals";

export const PROGRAMMING_FUNDAMENTALS_CHALLENGES = {
  easy: 20,
  medium: 20,
  hard: 20,
  total: 60,
} as const;

/** Fresher-focused topics: how developers think, plan, and solve problems. */
export const PROGRAMMING_FUNDAMENTALS_TOPICS = [
  {
    slug: "thinking-like-a-developer",
    title: "Thinking Like a Developer",
    description:
      "Build the mental habits that separate beginners from effective problem solvers.",
    durationMinutes: 30,
    difficulty: "beginner" as const,
    sortOrder: 1,
    content: `## Thinking Like a Developer

Great engineers **clarify**, **decompose**, and **validate** before they write code.

### You will learn
- Restate problems in plain language
- Separate what you know from what you must ask
- Choose the smallest useful first step

### For freshers
You do not need to memorize syntax first. You need a repeatable way to turn confusion into clear steps.

### Key takeaway
Code is the last step. Understanding the problem is the first.`,
  },
  {
    slug: "breaking-down-problems",
    title: "Breaking Down Problems",
    description: "Split overwhelming tasks into small, ordered, doable pieces.",
    durationMinutes: 35,
    difficulty: "beginner" as const,
    sortOrder: 2,
    content: `## Breaking Down Problems

Big goals become achievable when you list **phases**, **dependencies**, and **deliverables**.

### Practice
Take one assignment from school or life and break it into 5 steps a beginner could follow.`,
  },
  {
    slug: "understanding-requirements",
    title: "Understanding Requirements",
    description: "Read specs carefully, spot ambiguity, and define done clearly.",
    durationMinutes: 35,
    difficulty: "beginner" as const,
    sortOrder: 3,
    content: `## Understanding Requirements

Vague requests create bugs. Learn user stories, acceptance criteria, and the questions to ask early.`,
  },
  {
    slug: "pseudocode-and-flowcharts",
    title: "Pseudocode & Flowcharts",
    description: "Plan logic on paper before touching an editor.",
    durationMinutes: 40,
    difficulty: "beginner" as const,
    sortOrder: 4,
    content: `## Pseudocode & Flowcharts

Pseudocode is **language-agnostic**. Flowcharts show decisions and loops visually.

### Workflow
1. Write steps in plain English
2. Add decisions (if/else)
3. Translate to code only when the plan is clear`,
  },
  {
    slug: "variables-and-state",
    title: "Variables & State",
    description: "How programs remember information and why naming matters.",
    durationMinutes: 35,
    difficulty: "beginner" as const,
    sortOrder: 5,
    content: `## Variables & State

Programs store data in **variables**. Good names and valid values prevent most beginner bugs.`,
  },
  {
    slug: "logic-and-decisions",
    title: "Logic & Decisions",
    description: "Conditions, truth tables, and branching like a developer.",
    durationMinutes: 40,
    difficulty: "beginner" as const,
    sortOrder: 6,
    content: `## Logic & Decisions

Every app chooses paths: if the user is logged in, if payment succeeded, if input is valid.`,
  },
  {
    slug: "patterns-and-debugging",
    title: "Patterns & Debugging",
    description: "Loops, repetition, and a calm process when something breaks.",
    durationMinutes: 45,
    difficulty: "beginner" as const,
    sortOrder: 7,
    content: `## Patterns & Debugging

Loops repeat work. Debugging is **hypothesis → test → learn** — not random changes.`,
  },
] as const;

const TOPIC_BY_SLUG = new Map<string, (typeof PROGRAMMING_FUNDAMENTALS_TOPICS)[number]>(
  PROGRAMMING_FUNDAMENTALS_TOPICS.map((t) => [t.slug, t])
);

export function isProgrammingFundamentalsModule(moduleSlug: string) {
  return moduleSlug === PROGRAMMING_FUNDAMENTALS_SLUG;
}

export function getProgrammingFundamentalsTopicLimit(
  curriculumTopicSlug: string
): number {
  return programmingFundamentalsTopicChallengeCount(curriculumTopicSlug);
}

/** @deprecated Engine mapping removed — challenges are module-scoped. */
export function getProgrammingFundamentalsEngineTopicSlug(
  curriculumTopicSlug: string
): string | null {
  return TOPIC_BY_SLUG.has(curriculumTopicSlug) ? curriculumTopicSlug : null;
}

/** @deprecated Use programming-fundamentals-challenges.ts */
export function listProgrammingFundamentalsEngineLessons() {
  return [];
}

export function mergeProgrammingFundamentalsLessons(
  lessons: LessonSummary[],
  completedIds: Set<string>
): LessonSummary[] {
  const bySlug = new Map(lessons.map((l) => [l.slug, l]));
  const merged: LessonSummary[] = [];

  for (const topic of PROGRAMMING_FUNDAMENTALS_TOPICS) {
    const existing = bySlug.get(topic.slug);
    if (existing) {
      merged.push(existing);
      continue;
    }
    merged.push({
      id: `pf-${topic.slug}`,
      title: topic.title,
      slug: topic.slug,
      description: topic.description,
      durationMinutes: topic.durationMinutes,
      difficulty: topic.difficulty,
      sortOrder: topic.sortOrder,
      isPreview: topic.sortOrder === 1,
      isCompleted: completedIds.has(`pf-${topic.slug}`),
    });
  }

  return merged;
}

export function programmingFundamentalsLessonContent(slug: string): string {
  return (
    TOPIC_BY_SLUG.get(slug)?.content ??
    "## Topic\n\nContent coming soon."
  );
}

export function programmingFundamentalsChallengeCounts(): {
  easy: number;
  medium: number;
  hard: number;
  total: number;
} {
  const all = allProgrammingFundamentalsChallenges();
  const easy = all.filter((c) => c.lesson.difficulty === "easy").length;
  const medium = all.filter((c) => c.lesson.difficulty === "medium").length;
  const hard = all.filter((c) => c.lesson.difficulty === "hard").length;
  return { easy, medium, hard, total: all.length };
}

export function isProgrammingFundamentalsCurriculumTopic(slug: string) {
  return TOPIC_BY_SLUG.has(slug);
}

export function isProgrammingFundamentalsEngineTopic(slug: string) {
  return TOPIC_BY_SLUG.has(slug);
}
