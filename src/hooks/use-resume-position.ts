"use client";

import { useEffect } from "react";
import { useProgressStore } from "@/store/use-progress-store";
import type { ResumePosition } from "@/lib/module-progress";
import type { LearningModule } from "@/lib/module-progress";

type ResumeMeta = Partial<
  Pick<
    ResumePosition,
    | "topicSlug"
    | "topicTitle"
    | "lessonId"
    | "lessonTitle"
    | "entityId"
    | "difficulty"
    | "problemType"
    | "scrollKey"
    | "scrollY"
  >
>;

export function useTrackResumePosition(
  module: LearningModule,
  weekId: number,
  title: string,
  subtitle: string | undefined,
  href: string,
  enabled = true,
  meta?: ResumeMeta
) {
  const setResumePosition = useProgressStore((s) => s.setResumePosition);

  useEffect(() => {
    if (!enabled || !href || weekId < 1) return;
    setResumePosition({
      module,
      weekId,
      title,
      subtitle,
      href,
      updatedAt: new Date().toISOString(),
      ...meta,
    });
  }, [
    module,
    weekId,
    title,
    subtitle,
    href,
    enabled,
    setResumePosition,
    meta?.topicSlug,
    meta?.topicTitle,
    meta?.lessonId,
    meta?.lessonTitle,
    meta?.entityId,
    meta?.difficulty,
    meta?.problemType,
    meta?.scrollKey,
    meta?.scrollY,
  ]);
}
