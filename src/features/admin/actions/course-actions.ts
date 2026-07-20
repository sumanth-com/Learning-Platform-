"use server";

import { revalidatePath } from "next/cache";
import { getAdminContext } from "@/features/admin/lib/require-admin";
import { AdminCoursesService } from "@/features/admin/services/courses.service";
import { courseFormSchema } from "@/features/admin/schemas/admin-schemas";
import { ADMIN_ROUTES, type AdminActionResult } from "@/features/admin/types";

function revalidateCourses() {
  revalidatePath(ADMIN_ROUTES.courses);
  revalidatePath(ADMIN_ROUTES.root);
}

export async function createCourseAction(
  input: unknown
): Promise<AdminActionResult<{ id: string }>> {
  const ctx = await getAdminContext();
  if (!ctx.ok) return { success: false, error: ctx.error };

  const parsed = courseFormSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input.",
    };
  }

  try {
    const course = await new AdminCoursesService(ctx.supabase).create(
      parsed.data
    );
    revalidateCourses();
    return {
      success: true,
      data: { id: course.id },
      message: "Course created.",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create course.",
    };
  }
}

export async function updateCourseAction(
  id: string,
  input: unknown
): Promise<AdminActionResult> {
  const ctx = await getAdminContext();
  if (!ctx.ok) return { success: false, error: ctx.error };

  const parsed = courseFormSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input.",
    };
  }

  try {
    await new AdminCoursesService(ctx.supabase).update(id, parsed.data);
    revalidateCourses();
    revalidatePath(ADMIN_ROUTES.courseEdit(id));
    return { success: true, message: "Course updated." };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update course.",
    };
  }
}

export async function toggleCoursePublishAction(
  id: string,
  isPublished: boolean
): Promise<AdminActionResult> {
  const ctx = await getAdminContext();
  if (!ctx.ok) return { success: false, error: ctx.error };

  try {
    await new AdminCoursesService(ctx.supabase).setPublished(id, isPublished);
    revalidateCourses();
    return {
      success: true,
      message: isPublished ? "Course published." : "Course unpublished.",
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update publish state.",
    };
  }
}

export async function deleteCourseAction(
  id: string
): Promise<AdminActionResult> {
  const ctx = await getAdminContext();
  if (!ctx.ok) return { success: false, error: ctx.error };

  try {
    await new AdminCoursesService(ctx.supabase).delete(id);
    revalidateCourses();
    return { success: true, message: "Course deleted." };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete course.",
    };
  }
}
