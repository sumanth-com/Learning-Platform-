"use client";

import { useQuery, type QueryClient } from "@tanstack/react-query";
import { loadWorkspaceLessonAction } from "@/features/learn/actions/workspace-actions";
import { learnQueryKeys } from "@/features/learn/lib/query-keys";
import type { WorkspaceLessonPayload } from "@/features/learn/lib/workspace-tree";

async function fetchLesson(
  courseSlug: string,
  lessonSlug: string
): Promise<WorkspaceLessonPayload> {
  const result = await loadWorkspaceLessonAction(courseSlug, lessonSlug);
  if (!result.success) throw new Error(result.error);
  return result.data;
}

export function useWorkspaceLesson(
  courseSlug: string,
  lessonSlug: string | null,
  initialData?: WorkspaceLessonPayload | null
) {
  return useQuery({
    queryKey: lessonSlug
      ? learnQueryKeys.lesson(courseSlug, lessonSlug)
      : learnQueryKeys.course(courseSlug),
    queryFn: () => fetchLesson(courseSlug, lessonSlug!),
    enabled: Boolean(courseSlug && lessonSlug),
    initialData: initialData ?? undefined,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    placeholderData: (previous) => previous,
  });
}

export function prefetchWorkspaceLesson(
  queryClient: QueryClient,
  courseSlug: string,
  lessonSlug: string | null | undefined
) {
  if (!courseSlug || !lessonSlug) return;
  void queryClient.prefetchQuery({
    queryKey: learnQueryKeys.lesson(courseSlug, lessonSlug),
    queryFn: () => fetchLesson(courseSlug, lessonSlug),
    staleTime: 5 * 60 * 1000,
  });
}

export function setLessonQueryData(
  queryClient: QueryClient,
  courseSlug: string,
  lessonSlug: string,
  updater: (prev: WorkspaceLessonPayload | undefined) => WorkspaceLessonPayload
) {
  queryClient.setQueryData<WorkspaceLessonPayload>(
    learnQueryKeys.lesson(courseSlug, lessonSlug),
    (prev) => updater(prev)
  );
}
