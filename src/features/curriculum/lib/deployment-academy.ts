import type { LessonSummary } from "@/features/curriculum/types";
import {
  allDeploymentAcademyChallenges,
  deploymentAcademyTopicChallengeCount,
} from "@/features/curriculum/lib/deployment-academy-challenges";
import {
  DEPLOYMENT_ACADEMY_SECTIONS,
  flattenDeploymentTopics,
  type DeploymentTopicDef,
} from "@/features/curriculum/lib/deployment-academy-curriculum";

export const DEPLOYMENT_ACADEMY_SLUG = "deployment-essentials";

export function isDeploymentAcademyModule(moduleSlug: string) {
  return moduleSlug === DEPLOYMENT_ACADEMY_SLUG;
}

export function getDeploymentAcademySections() {
  return DEPLOYMENT_ACADEMY_SECTIONS;
}

export function getDeploymentAcademyTopics(): DeploymentTopicDef[] {
  return flattenDeploymentTopics();
}

export function getDeploymentAcademyTopic(
  slug: string
): DeploymentTopicDef | null {
  return flattenDeploymentTopics().find((t) => t.slug === slug) ?? null;
}

export function getDeploymentAcademyTopicLimit(topicSlug: string): number {
  return deploymentAcademyTopicChallengeCount(topicSlug);
}

export function mergeDeploymentAcademyLessons(
  lessons: LessonSummary[],
  completedIds: Set<string>
): LessonSummary[] {
  const bySlug = new Map(lessons.map((l) => [l.slug, l]));
  const merged: LessonSummary[] = [];
  let order = 1;
  for (const topic of flattenDeploymentTopics()) {
    const existing = bySlug.get(topic.slug);
    if (existing) {
      merged.push(existing);
    } else {
      merged.push({
        id: `deploy-${topic.slug}`,
        title: topic.title,
        slug: topic.slug,
        description: topic.summary,
        durationMinutes: topic.estimatedMinutes,
        difficulty: topic.difficulty,
        sortOrder: order,
        isPreview: order === 1,
        isCompleted: completedIds.has(`deploy-${topic.slug}`),
      });
    }
    order += 1;
  }
  return merged;
}

export function deploymentAcademyChallengeCounts() {
  const all = allDeploymentAcademyChallenges();
  return {
    easy: all.filter((c) => c.difficulty === "easy").length,
    medium: all.filter((c) => c.difficulty === "medium").length,
    hard: all.filter((c) => c.difficulty === "hard").length,
    total: all.length,
  };
}
