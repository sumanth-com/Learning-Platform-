import type { LessonSummary } from "@/features/curriculum/types";
import {
  allSqlAcademyChallenges,
  sqlAcademyTopicChallengeCount,
} from "@/features/curriculum/lib/sql-academy-challenges";
import {
  SQL_ACADEMY_SECTIONS,
  flattenSqlTopics,
  type SqlTopicDef,
} from "@/features/curriculum/lib/sql-academy-curriculum";

export const SQL_ACADEMY_SLUG = "relational-databases";

export function isSqlAcademyModule(moduleSlug: string) {
  return moduleSlug === SQL_ACADEMY_SLUG;
}

export function getSqlAcademySections() {
  return SQL_ACADEMY_SECTIONS;
}

export function getSqlAcademyTopics(): SqlTopicDef[] {
  return flattenSqlTopics();
}

export function getSqlAcademyTopic(slug: string): SqlTopicDef | null {
  return flattenSqlTopics().find((t) => t.slug === slug) ?? null;
}

export function getSqlAcademyTopicLimit(topicSlug: string): number {
  return sqlAcademyTopicChallengeCount(topicSlug);
}

export function mergeSqlAcademyLessons(
  lessons: LessonSummary[],
  completedIds: Set<string>
): LessonSummary[] {
  const bySlug = new Map(lessons.map((l) => [l.slug, l]));
  const merged: LessonSummary[] = [];
  let order = 1;
  for (const topic of flattenSqlTopics()) {
    const existing = bySlug.get(topic.slug);
    if (existing) {
      merged.push(existing);
    } else {
      merged.push({
        id: `sql-${topic.slug}`,
        title: topic.title,
        slug: topic.slug,
        description: topic.summary,
        durationMinutes: topic.estimatedMinutes,
        difficulty: topic.difficulty,
        sortOrder: order,
        isPreview: order === 1,
        isCompleted: completedIds.has(`sql-${topic.slug}`),
      });
    }
    order += 1;
  }
  return merged;
}

export function sqlAcademyChallengeCounts() {
  const all = allSqlAcademyChallenges();
  return {
    easy: all.filter((c) => c.difficulty === "easy").length,
    medium: all.filter((c) => c.difficulty === "medium").length,
    hard: all.filter((c) => c.difficulty === "hard").length,
    total: all.length,
  };
}
