"use server";

import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { CurriculumService } from "@/features/curriculum/services/curriculum.service";
import { AssignmentService } from "@/features/assignments/services/assignment.service";
import { resolveLessonObjectives } from "@/features/learn/lib/objectives";
import { buildTopicCards } from "@/features/curriculum/lib/topic-cards";
import {
  buildModuleHubChallengeSummaries,
} from "@/features/curriculum/lib/module-hub-challenge-summaries";
import type { ModuleHubChallengeSummary } from "@/features/curriculum/lib/module-hub-challenge-summary";
import type { ModuleDetail, LessonDetail } from "@/features/curriculum/types";
import type { AssignmentSummary } from "@/features/assignments/types";
import type { LessonResourceRow } from "@/types/database";

export type ModuleHubPayload = {
  detail: ModuleDetail;
  challenges: ModuleHubChallengeSummary[];
  assignments: Array<
    AssignmentSummary & { lessonId: string; lessonTitle: string }
  >;
  resources: Array<
    LessonResourceRow & { lessonTitle: string; lessonSlug: string }
  >;
};

export type ModuleTopicPayload = {
  detail: LessonDetail;
  objectives: string[];
  assignments: AssignmentSummary[];
  isLocked: boolean;
};

export type ModuleActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

const loadModuleHubCached = cache(
  async (moduleSlug: string, userId: string) => {
    const supabase = await createClient();
    const curriculum = new CurriculumService(supabase);
    const detail = await curriculum.getModuleBySlug(userId, moduleSlug);
    if (!detail) return null;

    return {
      detail,
      challenges: buildModuleHubChallengeSummaries(
        detail.module.slug,
        detail.lessons
      ),
      assignments: [],
      resources: [],
    } satisfies ModuleHubPayload;
  }
);

export async function loadModuleHubAction(
  moduleSlug: string
): Promise<ModuleActionResult<ModuleHubPayload>> {
  if (!moduleSlug) return { success: false, error: "Module is required." };

  const { user } = await requireUser();
  if (!user) return { success: false, error: "Sign in required." };

  try {
    const data = await loadModuleHubCached(moduleSlug, user.id);
    if (!data) return { success: false, error: "Module not found." };
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to load module hub.",
    };
  }
}

const loadModuleTopicCached = cache(
  async (moduleSlug: string, topicSlug: string, userId: string) => {
    const supabase = await createClient();
    const curriculum = new CurriculumService(supabase);
    const moduleDetail = await curriculum.getModuleBySlug(userId, moduleSlug);
    if (!moduleDetail) return null;

    const belongs = moduleDetail.lessons.some((l) => l.slug === topicSlug);
    if (!belongs) return { error: "not_in_module" as const };

    const cards = buildTopicCards(moduleDetail.lessons, moduleSlug);
    const card = cards.find((c) => c.slug === topicSlug);
    const isLocked = card?.status === "locked";

    const detail = await curriculum.getLessonBySlug(userId, topicSlug);
    if (!detail) return null;

    const lessonId = detail.lesson.id;
    const isVirtualId = !/^[0-9a-f-]{36}$/i.test(lessonId);
    const assignments = isVirtualId
      ? []
      : await new AssignmentService(supabase).listForLesson(lessonId, userId);

    return {
      detail,
      objectives: resolveLessonObjectives(
        detail.lesson.learning_objectives,
        detail.lesson.content
      ),
      assignments,
      isLocked,
    } satisfies ModuleTopicPayload;
  }
);

export async function loadModuleTopicAction(
  moduleSlug: string,
  topicSlug: string
): Promise<ModuleActionResult<ModuleTopicPayload>> {
  if (!moduleSlug || !topicSlug) {
    return { success: false, error: "Module and topic are required." };
  }

  const { user } = await requireUser();
  if (!user) return { success: false, error: "Sign in required." };

  try {
    const data = await loadModuleTopicCached(moduleSlug, topicSlug, user.id);
    if (!data) return { success: false, error: "Topic not found." };
    if ("error" in data && data.error === "not_in_module") {
      return { success: false, error: "Topic is not part of this module." };
    }
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to load topic.",
    };
  }
}
