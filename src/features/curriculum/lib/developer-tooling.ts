import type { LessonSummary } from "@/features/curriculum/types";
import {
  allDeveloperToolingChallenges,
  developerToolingTopicChallengeCount,
} from "@/features/curriculum/lib/developer-tooling-challenges";
import {
  DEVELOPER_TOOLING_SECTIONS,
  flattenToolingTopics,
  type ToolingTopicDef,
} from "@/features/curriculum/lib/developer-tooling-curriculum";

export const DEVELOPER_TOOLING_SLUG = "developer-tooling";

export function isDeveloperToolingModule(moduleSlug: string) {
  return moduleSlug === DEVELOPER_TOOLING_SLUG;
}

export function getDeveloperToolingSections() {
  return DEVELOPER_TOOLING_SECTIONS;
}

export function getDeveloperToolingTopics(): ToolingTopicDef[] {
  return flattenToolingTopics();
}

export function getDeveloperToolingTopic(slug: string): ToolingTopicDef | null {
  return flattenToolingTopics().find((t) => t.slug === slug) ?? null;
}

export function getDeveloperToolingTopicLimit(topicSlug: string): number {
  return developerToolingTopicChallengeCount(topicSlug);
}

export function mergeDeveloperToolingLessons(
  lessons: LessonSummary[],
  completedIds: Set<string>
): LessonSummary[] {
  const bySlug = new Map(lessons.map((l) => [l.slug, l]));
  const merged: LessonSummary[] = [];
  let order = 1;
  for (const topic of flattenToolingTopics()) {
    const existing = bySlug.get(topic.slug);
    if (existing) {
      merged.push(existing);
    } else {
      merged.push({
        id: `dt-${topic.slug}`,
        title: topic.title,
        slug: topic.slug,
        description: topic.summary,
        durationMinutes: topic.estimatedMinutes,
        difficulty: topic.difficulty,
        sortOrder: order,
        isPreview: order === 1,
        isCompleted: completedIds.has(`dt-${topic.slug}`),
      });
    }
    order += 1;
  }
  return merged;
}

export function developerToolingChallengeCounts(): {
  easy: number;
  medium: number;
  hard: number;
  total: number;
} {
  const all = allDeveloperToolingChallenges();
  const easy = all.filter((c) => c.difficulty === "easy").length;
  const medium = all.filter((c) => c.difficulty === "medium").length;
  const hard = all.filter((c) => c.difficulty === "hard").length;
  return { easy, medium, hard, total: all.length };
}

export function developerToolingSearchIndex(): Array<{
  id: string;
  title: string;
  sectionTitle: string;
  topicSlug: string;
  keywords: string[];
}> {
  const out: Array<{
    id: string;
    title: string;
    sectionTitle: string;
    topicSlug: string;
    keywords: string[];
  }> = [];
  for (const section of DEVELOPER_TOOLING_SECTIONS) {
    for (const topic of section.topics) {
      out.push({
        id: topic.slug,
        title: topic.title,
        sectionTitle: section.title,
        topicSlug: topic.slug,
        keywords: [
          topic.title,
          section.title,
          ...topic.keywords,
          ...topic.cheatSheet.commands.map((c) => c.cmd),
        ].map((k) => k.toLowerCase()),
      });
    }
  }
  return out;
}
