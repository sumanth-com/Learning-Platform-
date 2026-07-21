export const CURRICULUM_ROUTES = {
  roadmap: "/roadmap",
  module: (slug: string) => `/module/${slug}`,
  moduleHub: (slug: string, topicSlug?: string | null) => {
    const base = `/module/${slug}`;
    if (!topicSlug) return base;
    return `${base}?topic=${encodeURIComponent(topicSlug)}`;
  },
  moduleTopic: (moduleSlug: string, topicSlug: string) =>
    `/module/${moduleSlug}/topic/${topicSlug}`,
  moduleChallenge: (
    moduleSlug: string,
    topicSlug: string,
    challengeId: string
  ) => `/module/${moduleSlug}/topic/${topicSlug}/challenge/${encodeURIComponent(challengeId)}`,
  /** @deprecated Legacy hub tabs redirect to module explorer */
  moduleRoadmap: (slug: string) => `/module/${slug}`,
  modulePractice: (slug: string) => `/module/${slug}`,
  moduleResources: (slug: string) => `/module/${slug}`,
  moduleAssignments: (slug: string) => `/module/${slug}`,
  moduleProjects: (slug: string) => `/module/${slug}`,
  moduleAssessment: (slug: string) => `/module/${slug}`,
  moduleAiMentor: (slug: string) => `/module/${slug}`,
  lesson: (slug: string) => `/lesson/${slug}`,
  learn: (courseSlug: string) => `/learn/${courseSlug}`,
  learnLesson: (courseSlug: string, lessonSlug: string) =>
    `/learn/${courseSlug}?lesson=${encodeURIComponent(lessonSlug)}`,
} as const;
