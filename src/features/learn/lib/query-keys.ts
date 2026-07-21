import type { WorkspaceLessonPayload } from "@/features/learn/lib/workspace-tree";

export const learnQueryKeys = {
  all: ["learn"] as const,
  course: (courseSlug: string) => [...learnQueryKeys.all, courseSlug] as const,
  lesson: (courseSlug: string, lessonSlug: string) =>
    [...learnQueryKeys.course(courseSlug), "lesson", lessonSlug] as const,
  journey: (courseSlug: string) =>
    [...learnQueryKeys.course(courseSlug), "journey"] as const,
};

export type { WorkspaceLessonPayload };
