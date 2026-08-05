import type { LearnDifficulty } from "@/learning-engine/types";

/** Slim challenge row for module hub lists — safe for client + server. */
export type ModuleHubChallengeSummary = {
  id: string;
  entityId: string;
  weekId: number;
  topicSlug: string;
  curriculumTopicSlug: string;
  curriculumTopicTitle: string;
  topicIndex: number;
  lessonIndex: number;
  title: string;
  difficulty: LearnDifficulty;
  category: string;
  problemType?: string;
  estimatedMinutes?: number;
  kindLabel: string;
  scenario: string;
};
