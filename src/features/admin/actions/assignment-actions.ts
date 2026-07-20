"use server";

import { revalidatePath } from "next/cache";
import { getAdminContext } from "@/features/admin/lib/require-admin";
import { AdminAssignmentsService } from "@/features/admin/services/assignments.service";
import { assignmentFormSchema } from "@/features/admin/schemas/admin-schemas";
import { ADMIN_ROUTES, type AdminActionResult } from "@/features/admin/types";

function revalidateAssignments() {
  revalidatePath(ADMIN_ROUTES.assignments);
  revalidatePath(ADMIN_ROUTES.root);
}

export async function createAdminAssignmentAction(
  input: unknown
): Promise<AdminActionResult<{ id: string }>> {
  const ctx = await getAdminContext();
  if (!ctx.ok) return { success: false, error: ctx.error };

  const parsed = assignmentFormSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input.",
    };
  }

  try {
    const assignment = await new AdminAssignmentsService(ctx.supabase).create(
      parsed.data
    );
    revalidateAssignments();
    return {
      success: true,
      data: { id: assignment.id },
      message: "Assignment created.",
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create assignment.",
    };
  }
}

export async function updateAdminAssignmentAction(
  id: string,
  input: unknown
): Promise<AdminActionResult> {
  const ctx = await getAdminContext();
  if (!ctx.ok) return { success: false, error: ctx.error };

  const parsed = assignmentFormSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input.",
    };
  }

  try {
    await new AdminAssignmentsService(ctx.supabase).update(id, parsed.data);
    revalidateAssignments();
    revalidatePath(ADMIN_ROUTES.assignmentEdit(id));
    return { success: true, message: "Assignment updated." };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update assignment.",
    };
  }
}

export async function toggleAssignmentPublishAction(
  id: string,
  isPublished: boolean
): Promise<AdminActionResult> {
  const ctx = await getAdminContext();
  if (!ctx.ok) return { success: false, error: ctx.error };

  try {
    await new AdminAssignmentsService(ctx.supabase).setPublished(
      id,
      isPublished
    );
    revalidateAssignments();
    return {
      success: true,
      message: isPublished ? "Assignment published." : "Assignment unpublished.",
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update publish state.",
    };
  }
}

export async function deleteAdminAssignmentAction(
  id: string
): Promise<AdminActionResult> {
  const ctx = await getAdminContext();
  if (!ctx.ok) return { success: false, error: ctx.error };

  try {
    await new AdminAssignmentsService(ctx.supabase).delete(id);
    revalidateAssignments();
    return { success: true, message: "Assignment deleted." };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete assignment.",
    };
  }
}
