import type { LessonSummary } from "@/features/curriculum/types";
import {
  allLlmAcademyChallenges,
  llmAcademyTopicChallengeCount,
} from "@/features/curriculum/lib/llm-academy-challenges";
import {
  LLM_ACADEMY_SECTIONS,
  flattenLlmTopics,
  type LlmTopicDef,
} from "@/features/curriculum/lib/llm-academy-curriculum";

export const LLM_ACADEMY_SLUG = "llm-fundamentals";

export function isLlmAcademyModule(moduleSlug: string) {
  return moduleSlug === LLM_ACADEMY_SLUG;
}

export function getLlmAcademySections() {
  return LLM_ACADEMY_SECTIONS;
}

export function getLlmAcademyTopics(): LlmTopicDef[] {
  return flattenLlmTopics();
}

export function getLlmAcademyTopic(slug: string): LlmTopicDef | null {
  return flattenLlmTopics().find((t) => t.slug === slug) ?? null;
}

export function getLlmAcademyTopicLimit(topicSlug: string): number {
  return llmAcademyTopicChallengeCount(topicSlug);
}

export function mergeLlmAcademyLessons(
  lessons: LessonSummary[],
  completedIds: Set<string>
): LessonSummary[] {
  const bySlug = new Map(lessons.map((l) => [l.slug, l]));
  const merged: LessonSummary[] = [];
  let order = 1;
  for (const topic of flattenLlmTopics()) {
    const existing = bySlug.get(topic.slug);
    if (existing) {
      merged.push(existing);
    } else {
      merged.push({
        id: `llm-${topic.slug}`,
        title: topic.title,
        slug: topic.slug,
        description: topic.summary,
        durationMinutes: topic.estimatedMinutes,
        difficulty: topic.difficulty,
        sortOrder: order,
        isPreview: order === 1,
        isCompleted: completedIds.has(`llm-${topic.slug}`),
      });
    }
    order += 1;
  }
  return merged;
}

export function llmAcademyChallengeCounts() {
  const all = allLlmAcademyChallenges();
  return {
    easy: all.filter((c) => c.difficulty === "easy").length,
    medium: all.filter((c) => c.difficulty === "medium").length,
    hard: all.filter((c) => c.difficulty === "hard").length,
    total: all.length,
  };
}
