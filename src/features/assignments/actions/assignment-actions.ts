"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { AssignmentService } from "@/features/assignments/services/assignment.service";
import { SubmissionService } from "@/features/assignments/services/submission.service";
import {
  createAssignmentSchema,
  reviewSubmissionSchema,
  submitAssignmentSchema,
  updateAssignmentSchema,
} from "@/features/assignments/schemas/assignment-schemas";
import { LessonsRepository } from "@/features/curriculum/repositories/lessons.repository";
import {
  ASSIGNMENT_ROUTES,
  isMentorRole,
} from "@/features/assignments/types";
import { CURRICULUM_ROUTES } from "@/features/curriculum/types";
import type { UserRole } from "@/types/database";

type ActionResult<T = undefined> =
  | { success: true; data?: T; message?: string }
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

  return {
    supabase,
    user,
    role,
  };
}

async function requireMentor() {
  const ctx = await requireUser();
  if (!ctx.user) return { ...ctx, ok: false as const, error: "Sign in required." };
  if (!isMentorRole(ctx.role)) {
    return { ...ctx, ok: false as const, error: "Mentor access required." };
  }
  return { ...ctx, ok: true as const };
}

export async function createAssignmentAction(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  const mentor = await requireMentor();
  if (!mentor.ok) return { success: false, error: mentor.error };

  const parsed = createAssignmentSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input.",
    };
  }

  try {
    const service = new AssignmentService(mentor.supabase);
    const assignment = await service.create({
      lessonId: parsed.data.lessonId,
      title: parsed.data.title,
      description: parsed.data.description,
      instructions: parsed.data.instructions,
      difficulty: parsed.data.difficulty,
      estimatedTime: parsed.data.estimatedTime,
      totalMarks: parsed.data.totalMarks,
      dueDays: parsed.data.dueDays,
      isPublished: parsed.data.isPublished,
    });

    const lessons = new LessonsRepository(mentor.supabase);
    const lesson = await lessons.findById(parsed.data.lessonId);
    if (lesson?.slug) {
      revalidatePath(CURRICULUM_ROUTES.lesson(lesson.slug));
    }

    return {
      success: true,
      data: { id: assignment.id },
      message: "Assignment created.",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create assignment.",
    };
  }
}

export async function updateAssignmentAction(
  id: string,
  input: unknown
): Promise<ActionResult> {
  const mentor = await requireMentor();
  if (!mentor.ok) return { success: false, error: mentor.error };

  const parsed = updateAssignmentSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input.",
    };
  }

  try {
    const service = new AssignmentService(mentor.supabase);
    const assignment = await service.update(id, {
      title: parsed.data.title,
      description: parsed.data.description,
      instructions: parsed.data.instructions,
      difficulty: parsed.data.difficulty,
      estimatedTime: parsed.data.estimatedTime,
      totalMarks: parsed.data.totalMarks,
      dueDays: parsed.data.dueDays,
      isPublished: parsed.data.isPublished,
    });

    revalidatePath(ASSIGNMENT_ROUTES.detail(id));
    const lessons = new LessonsRepository(mentor.supabase);
    const lesson = await lessons.findById(assignment.lesson_id);
    if (lesson?.slug) {
      revalidatePath(CURRICULUM_ROUTES.lesson(lesson.slug));
    }

    return { success: true, message: "Assignment updated." };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update assignment.",
    };
  }
}

export async function deleteAssignmentAction(
  id: string
): Promise<ActionResult> {
  const mentor = await requireMentor();
  if (!mentor.ok) return { success: false, error: mentor.error };

  try {
    const service = new AssignmentService(mentor.supabase);
    const existing = await service.getDetail(id, mentor.user!.id, {
      isMentor: true,
    });
    await service.delete(id);
    revalidatePath(ASSIGNMENT_ROUTES.detail(id));
    if (existing?.lesson.slug) {
      revalidatePath(CURRICULUM_ROUTES.lesson(existing.lesson.slug));
    }
    return { success: true, message: "Assignment deleted." };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete assignment.",
    };
  }
}

export async function publishAssignmentAction(
  id: string,
  publish: boolean
): Promise<ActionResult> {
  const mentor = await requireMentor();
  if (!mentor.ok) return { success: false, error: mentor.error };

  try {
    const service = new AssignmentService(mentor.supabase);
    if (publish) await service.publish(id);
    else await service.unpublish(id);
    revalidatePath(ASSIGNMENT_ROUTES.detail(id));
    return {
      success: true,
      message: publish ? "Assignment published." : "Assignment unpublished.",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update publish state.",
    };
  }
}

export async function submitAssignmentAction(
  assignmentId: string,
  input: unknown
): Promise<ActionResult> {
  const ctx = await requireUser();
  if (!ctx.user) return { success: false, error: "Sign in required." };

  const parsed = submitAssignmentSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input.",
    };
  }

  try {
    const service = new SubmissionService(ctx.supabase);
    await service.submit(assignmentId, ctx.user.id, {
      githubUrl: parsed.data.githubUrl,
      demoUrl: parsed.data.demoUrl || undefined,
      notes: parsed.data.notes,
    });
    revalidatePath(ASSIGNMENT_ROUTES.detail(assignmentId));
    return { success: true, message: "Assignment submitted." };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to submit assignment.",
    };
  }
}

export async function reviewSubmissionAction(
  assignmentId: string,
  input: unknown
): Promise<ActionResult> {
  const mentor = await requireMentor();
  if (!mentor.ok) return { success: false, error: mentor.error };

  const parsed = reviewSubmissionSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input.",
    };
  }

  try {
    const assignments = new AssignmentService(mentor.supabase);
    const detail = await assignments.getDetail(assignmentId, mentor.user!.id, {
      isMentor: true,
    });
    if (!detail) return { success: false, error: "Assignment not found." };

    const submissions = new SubmissionService(mentor.supabase);
    await submissions.review(
      {
        submissionId: parsed.data.submissionId,
        status: parsed.data.status,
        marks: parsed.data.marks,
        feedback: parsed.data.feedback,
      },
      detail.assignment.total_marks
    );

    revalidatePath(ASSIGNMENT_ROUTES.detail(assignmentId));
    return { success: true, message: "Review saved." };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save review.",
    };
  }
}
