"use server";

import { revalidatePath } from "next/cache";
import { getAdminContext } from "@/features/admin/lib/require-admin";
import { AdminLessonsService } from "@/features/admin/services/lessons.service";
import { lessonFormSchema } from "@/features/admin/schemas/admin-schemas";
import { ADMIN_ROUTES, type AdminActionResult } from "@/features/admin/types";

function revalidateLessons() {
  revalidatePath(ADMIN_ROUTES.lessons);
  revalidatePath(ADMIN_ROUTES.root);
}

export async function createLessonAction(
  input: unknown
): Promise<AdminActionResult<{ id: string }>> {
  const ctx = await getAdminContext();
  if (!ctx.ok) return { success: false, error: ctx.error };

  const parsed = lessonFormSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input.",
    };
  }

  try {
    const lesson = await new AdminLessonsService(ctx.supabase).create(
      parsed.data
    );
    revalidateLessons();
    return {
      success: true,
      data: { id: lesson.id },
      message: "Lesson created.",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create lesson.",
    };
  }
}

export async function updateLessonAction(
  id: string,
  input: unknown
): Promise<AdminActionResult> {
  const ctx = await getAdminContext();
  if (!ctx.ok) return { success: false, error: ctx.error };

  const parsed = lessonFormSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input.",
    };
  }

  try {
    await new AdminLessonsService(ctx.supabase).update(id, parsed.data);
    revalidateLessons();
    revalidatePath(ADMIN_ROUTES.lessonEdit(id));
    return { success: true, message: "Lesson updated." };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update lesson.",
    };
  }
}

export async function deleteLessonAction(
  id: string
): Promise<AdminActionResult> {
  const ctx = await getAdminContext();
  if (!ctx.ok) return { success: false, error: ctx.error };

  try {
    await new AdminLessonsService(ctx.supabase).delete(id);
    revalidateLessons();
    return { success: true, message: "Lesson deleted." };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete lesson.",
    };
  }
}
