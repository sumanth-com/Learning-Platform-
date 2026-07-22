import type { LessonSummary } from "@/features/curriculum/types";
import {
  allInterviewAcademyChallenges,
  interviewAcademyTopicChallengeCount,
} from "@/features/curriculum/lib/interview-academy-challenges";
import {
  INTERVIEW_ACADEMY_SECTIONS,
  flattenInterviewTopics,
  type InterviewTopicDef,
} from "@/features/curriculum/lib/interview-academy-curriculum";

export const INTERVIEW_ACADEMY_SLUG = "technical-interviews";

export function isInterviewAcademyModule(moduleSlug: string) {
  return moduleSlug === INTERVIEW_ACADEMY_SLUG;
}

export function getInterviewAcademySections() {
  return INTERVIEW_ACADEMY_SECTIONS;
}

export function getInterviewAcademyTopics(): InterviewTopicDef[] {
  return flattenInterviewTopics();
}

export function getInterviewAcademyTopic(slug: string): InterviewTopicDef | null {
  return flattenInterviewTopics().find((t) => t.slug === slug) ?? null;
}

export function getInterviewAcademyTopicLimit(topicSlug: string): number {
  return interviewAcademyTopicChallengeCount(topicSlug);
}

export function mergeInterviewAcademyLessons(
  lessons: LessonSummary[],
  completedIds: Set<string>
): LessonSummary[] {
  const bySlug = new Map(lessons.map((l) => [l.slug, l]));
  const merged: LessonSummary[] = [];
  let order = 1;
  for (const topic of flattenInterviewTopics()) {
    const existing = bySlug.get(topic.slug);
    if (existing) {
      merged.push(existing);
    } else {
      merged.push({
        id: `interview-${topic.slug}`,
        title: topic.title,
        slug: topic.slug,
        description: topic.summary,
        durationMinutes: topic.estimatedMinutes,
        difficulty: topic.difficulty,
        sortOrder: order,
        isPreview: order === 1,
        isCompleted: completedIds.has(`interview-${topic.slug}`),
      });
    }
    order += 1;
  }
  return merged;
}

export function interviewAcademyChallengeCounts() {
  const all = allInterviewAcademyChallenges();
  return {
    easy: all.filter((c) => c.difficulty === "easy").length,
    medium: all.filter((c) => c.difficulty === "medium").length,
    hard: all.filter((c) => c.difficulty === "hard").length,
    total: all.length,
  };
}
