"use server";

import { createClient } from "@/lib/supabase/server";
import { CurriculumService } from "@/features/curriculum/services/curriculum.service";
import { AssignmentService } from "@/features/assignments/services/assignment.service";
import { isMentorRole } from "@/features/assignments/types";
import { resolveLessonObjectives } from "@/features/learn/lib/objectives";
import type { WorkspaceLessonPayload } from "@/features/learn/lib/workspace-tree";
import type { UserRole } from "@/types/database";

export type LearnActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase, user: null, role: null as UserRole | null };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const role = (profile as { role?: UserRole } | null)?.role ?? "student";
  return { supabase, user, role };
}

export async function loadWorkspaceLessonAction(
  courseSlug: string,
  lessonSlug: string
): Promise<LearnActionResult<WorkspaceLessonPayload>> {
  if (!courseSlug || !lessonSlug) {
    return { success: false, error: "Course and lesson are required." };
  }

  const ctx = await requireUser();
  if (!ctx.user) return { success: false, error: "Sign in required." };

  try {
    const curriculum = new CurriculumService(ctx.supabase);
    const detail = await curriculum.getLessonBySlug(ctx.user.id, lessonSlug);
    if (!detail) {
      return { success: false, error: "Lesson not found." };
    }
    if (detail.course.slug !== courseSlug) {
      return { success: false, error: "Lesson is not part of this course." };
    }

    const mentor = isMentorRole(ctx.role);
    const assignments = await new AssignmentService(ctx.supabase).listForLesson(
      detail.lesson.id,
      ctx.user.id,
      { includeUnpublished: mentor }
    );

    const objectives = resolveLessonObjectives(
      detail.lesson.learning_objectives,
      detail.lesson.content
    );

    return {
      success: true,
      data: {
        detail,
        objectives,
        assignments,
        isMentor: mentor,
      },
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to load lesson.",
    };
  }
}
