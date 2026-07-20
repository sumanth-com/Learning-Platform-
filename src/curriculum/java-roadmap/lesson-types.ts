export type RoadmapLessonKind = "code" | "guide";

export interface RoadmapSubtopicLesson {
  id: string;
  title: string;
  category: string;
  parentTopic?: string;
  difficulty?: "easy" | "medium" | "hard";
  kind: RoadmapLessonKind;
  definition: string;
  explanation: string;
  code?: string;
  filename?: string;
  sampleOutput?: string;
  sampleInput?: string;
  runInstructions?: string;
  guidePoints?: string[];
}

export interface RoadmapTopicLessons {
  slug?: string;
  categories: { id: string; label: string }[];
  subtopics: RoadmapSubtopicLesson[];
}
