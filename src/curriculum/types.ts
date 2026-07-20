/**
 * Legacy week-curriculum types (JSON weeks under src/curriculum/weeks).
 * Used by progress engine, roadmap UI, interview/projects modules.
 */

export type CurriculumDifficulty = "easy" | "medium" | "hard";

export interface AiLearnDetail {
  answer: string;
  realWorld: string;
  code?: string;
}

export interface CurriculumChecklistItem {
  id: string;
  title: string;
  difficulty?: CurriculumDifficulty;
}

export interface CurriculumDayItem extends CurriculumChecklistItem {}

export interface CurriculumTopic {
  id: string;
  title: string;
  estimatedMinutes?: number;
  difficulty?: CurriculumDifficulty;
  items: CurriculumDayItem[];
}

export interface CurriculumDay {
  id: string;
  dayNumber: number;
  title: string;
  theme?: string;
  estimatedMinutes?: number;
  topics: CurriculumTopic[];
}

export interface CurriculumProgrammingQuestion {
  id: string;
  title: string;
  difficulty?: CurriculumDifficulty;
}

export interface CurriculumProgrammingCategory {
  id: string;
  category: string;
  questions: CurriculumProgrammingQuestion[];
}

export interface CurriculumProjectFeature {
  id: string;
  title: string;
}

export interface CurriculumProject {
  id: string;
  title: string;
  description: string;
  features: CurriculumProjectFeature[];
  requirements?: string[];
  bonusFeatures?: string[];
}

export interface CurriculumAIPromptExercise {
  id: string;
  prompt: string;
}

export interface CurriculumAISkill {
  id: string;
  title: string;
  description: string;
  learningTopics: CurriculumChecklistItem[];
  tools: string[];
  exercises: CurriculumChecklistItem[];
  promptExercises?: CurriculumAIPromptExercise[];
}

export interface CurriculumGitHubFile {
  id: string;
  path: string;
}

export interface CurriculumGitHubTasks {
  id: string;
  repository: string;
  description?: string;
  files: CurriculumGitHubFile[];
}

export interface CurriculumInterviewQuestion {
  id: string;
  question: string;
  answer: string;
  realWorld?: string;
  code?: string;
  output?: string;
}

export interface CurriculumInterviewCategory {
  id: string;
  category: string;
  questions: CurriculumInterviewQuestion[];
}

export interface CurriculumInterviewPack {
  id: string;
  title: string;
  subtitle?: string;
  categories: CurriculumInterviewCategory[];
}

export interface CurriculumDeliverable {
  id: string;
  title: string;
  description?: string;
  autoComplete?: {
    type: string;
    targetCount?: number;
  };
}

export interface CurriculumWeekDefinition {
  id: number;
  slug: string;
  title: string;
  goal?: string;
  description?: string;
  estimatedHours?: number;
  difficulty?: CurriculumDifficulty;
  days: CurriculumDay[];
  /** Some older week JSON files include an unused top-level topics array. */
  topics?: unknown[];
  programmingQuestions: CurriculumProgrammingCategory[];
  projects: CurriculumProject[];
  aiSkill: CurriculumAISkill;
  githubTasks: CurriculumGitHubTasks;
  interviewQuestions: CurriculumInterviewCategory[];
  deliverables?: CurriculumDeliverable[];
}

export type TrackableEntityType =
  | "day-item"
  | "programming-question"
  | "project-feature"
  | "project-complete"
  | "ai-topic"
  | "ai-exercise"
  | "ai-prompt"
  | "github-file"
  | "interview-question"
  | "learning-lesson";

export interface TrackableEntity {
  id: string;
  weekId: number;
  type: TrackableEntityType;
  label: string;
  difficulty?: CurriculumDifficulty | string;
  category?: string;
}
