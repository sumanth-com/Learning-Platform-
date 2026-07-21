"use server";

import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { CurriculumService } from "@/features/curriculum/services/curriculum.service";
import { AssignmentService } from "@/features/assignments/services/assignment.service";
import { LessonResourcesRepository } from "@/features/curriculum/repositories/resources.repository";
import { resolveLessonObjectives } from "@/features/learn/lib/objectives";
import type { ModuleDetail, LessonDetail } from "@/features/curriculum/types";
import type { AssignmentSummary } from "@/features/assignments/types";
import type { LessonResourceRow } from "@/types/database";

export type ModuleHubPayload = {
  detail: ModuleDetail;
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

    const assignmentService = new AssignmentService(supabase);
    const resourceRepo = new LessonResourcesRepository(supabase);

    const perLesson = await Promise.all(
      detail.lessons.map(async (lesson) => {
        const [lessonAssignments, lessonResources] = await Promise.all([
          assignmentService.listForLesson(lesson.id, userId),
          resourceRepo.listByLessonId(lesson.id),
        ]);
        return { lesson, lessonAssignments, lessonResources };
      })
    );

    const assignments: ModuleHubPayload["assignments"] = [];
    const resources: ModuleHubPayload["resources"] = [];

    for (const row of perLesson) {
      for (const item of row.lessonAssignments) {
        assignments.push({
          ...item,
          lessonId: row.lesson.id,
          lessonTitle: row.lesson.title,
        });
      }
      for (const resource of row.lessonResources) {
        resources.push({
          ...resource,
          lessonTitle: row.lesson.title,
          lessonSlug: row.lesson.slug,
        });
      }
    }

    return { detail, assignments, resources } satisfies ModuleHubPayload;
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

export async function loadModuleTopicAction(
  moduleSlug: string,
  topicSlug: string
): Promise<ModuleActionResult<ModuleTopicPayload>> {
  if (!moduleSlug || !topicSlug) {
    return { success: false, error: "Module and topic are required." };
  }

  const { supabase, user } = await requireUser();
  if (!user) return { success: false, error: "Sign in required." };

  try {
    const curriculum = new CurriculumService(supabase);
    const moduleDetail = await curriculum.getModuleBySlug(user.id, moduleSlug);
    if (!moduleDetail) return { success: false, error: "Module not found." };

    const belongs = moduleDetail.lessons.some((l) => l.slug === topicSlug);
    if (!belongs) {
      return { success: false, error: "Topic is not part of this module." };
    }

    const detail = await curriculum.getLessonBySlug(user.id, topicSlug);
    if (!detail) return { success: false, error: "Topic not found." };

    const assignments = await new AssignmentService(supabase).listForLesson(
      detail.lesson.id,
      user.id
    );

    return {
      success: true,
      data: {
        detail,
        objectives: resolveLessonObjectives(
          detail.lesson.learning_objectives,
          detail.lesson.content
        ),
        assignments,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to load topic.",
    };
  }
}
