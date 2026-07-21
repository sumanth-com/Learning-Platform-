"use client";

import {
  useQuery,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";
import {
  loadModuleHubAction,
  loadModuleTopicAction,
  type ModuleHubPayload,
  type ModuleTopicPayload,
} from "@/features/curriculum/actions/module-hub-actions";

export const moduleHubKeys = {
  all: ["module-hub"] as const,
  module: (slug: string) => [...moduleHubKeys.all, slug] as const,
  topic: (moduleSlug: string, topicSlug: string) =>
    [...moduleHubKeys.module(moduleSlug), "topic", topicSlug] as const,
};

async function fetchModuleHub(slug: string): Promise<ModuleHubPayload> {
  const result = await loadModuleHubAction(slug);
  if (!result.success) throw new Error(result.error);
  return result.data;
}

async function fetchModuleTopic(
  moduleSlug: string,
  topicSlug: string
): Promise<ModuleTopicPayload> {
  const result = await loadModuleTopicAction(moduleSlug, topicSlug);
  if (!result.success) throw new Error(result.error);
  return result.data;
}

export function useModuleHub(slug: string, initialData?: ModuleHubPayload) {
  return useQuery({
    queryKey: moduleHubKeys.module(slug),
    queryFn: () => fetchModuleHub(slug),
    initialData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

export function useModuleTopic(
  moduleSlug: string,
  topicSlug: string,
  initialData?: ModuleTopicPayload
) {
  return useQuery({
    queryKey: moduleHubKeys.topic(moduleSlug, topicSlug),
    queryFn: () => fetchModuleTopic(moduleSlug, topicSlug),
    enabled: Boolean(moduleSlug && topicSlug),
    initialData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    placeholderData: (previous) => previous,
  });
}

export function prefetchModuleTopic(
  queryClient: QueryClient,
  moduleSlug: string,
  topicSlug: string | null | undefined
) {
  if (!moduleSlug || !topicSlug) return;
  void queryClient.prefetchQuery({
    queryKey: moduleHubKeys.topic(moduleSlug, topicSlug),
    queryFn: () => fetchModuleTopic(moduleSlug, topicSlug),
    staleTime: 5 * 60 * 1000,
  });
}

export function setModuleTopicCompleted(
  queryClient: QueryClient,
  moduleSlug: string,
  topicSlug: string,
  completed: boolean
) {
  queryClient.setQueryData<ModuleTopicPayload>(
    moduleHubKeys.topic(moduleSlug, topicSlug),
    (prev) =>
      prev
        ? { ...prev, detail: { ...prev.detail, isCompleted: completed } }
        : prev
  );

  queryClient.setQueryData<ModuleHubPayload>(
    moduleHubKeys.module(moduleSlug),
    (prev) => {
      if (!prev) return prev;
      const lessons = prev.detail.lessons.map((lesson) =>
        lesson.slug === topicSlug ? { ...lesson, isCompleted: completed } : lesson
      );
      const completedCount = lessons.filter((l) => l.isCompleted).length;
      const progressPercent =
        lessons.length === 0
          ? 0
          : Math.round((completedCount / lessons.length) * 100);
      return {
        ...prev,
        detail: {
          ...prev.detail,
          lessons,
          completedCount,
          progressPercent,
        },
      };
    }
  );
}
