"use server";

import { revalidatePath } from "next/cache";
import { getAdminContext } from "@/features/admin/lib/require-admin";
import { AdminResourcesService } from "@/features/admin/services/resources.service";
import { resourceFormSchema } from "@/features/admin/schemas/admin-schemas";
import {
  ADMIN_ROUTES,
  type AdminActionResult,
} from "@/features/admin/types";
import type {
  AssignmentResourceType,
  ResourceType,
} from "@/types/database";

function revalidateResources() {
  revalidatePath(ADMIN_ROUTES.resources);
  revalidatePath(ADMIN_ROUTES.lessons);
  revalidatePath(ADMIN_ROUTES.assignments);
}

export async function createResourceAction(
  input: unknown
): Promise<AdminActionResult<{ id: string }>> {
  const ctx = await getAdminContext();
  if (!ctx.ok) return { success: false, error: ctx.error };

  const parsed = resourceFormSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input.",
    };
  }

  try {
    const service = new AdminResourcesService(ctx.supabase);
    if (parsed.data.scope === "lesson") {
      const row = await service.createLessonResource({
        lessonId: parsed.data.parentId,
        title: parsed.data.title,
        type: parsed.data.type as ResourceType,
        url: parsed.data.url,
      });
      revalidateResources();
      return {
        success: true,
        data: { id: row.id },
        message: "Resource created.",
      };
    }

    const row = await service.createAssignmentResource({
      assignmentId: parsed.data.parentId,
      title: parsed.data.title,
      type: parsed.data.type as AssignmentResourceType,
      url: parsed.data.url,
    });
    revalidateResources();
    return {
      success: true,
      data: { id: row.id },
      message: "Resource created.",
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create resource.",
    };
  }
}

export async function updateResourceAction(
  id: string,
  scope: "lesson" | "assignment",
  input: unknown
): Promise<AdminActionResult> {
  const ctx = await getAdminContext();
  if (!ctx.ok) return { success: false, error: ctx.error };

  const base =
    input && typeof input === "object"
      ? (input as Record<string, unknown>)
      : {};
  const parsed = resourceFormSchema.safeParse({ ...base, scope });
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input.",
    };
  }

  try {
    const service = new AdminResourcesService(ctx.supabase);
    if (scope === "lesson") {
      await service.updateLessonResource(id, {
        title: parsed.data.title,
        type: parsed.data.type as ResourceType,
        url: parsed.data.url,
      });
    } else {
      await service.updateAssignmentResource(id, {
        title: parsed.data.title,
        type: parsed.data.type as AssignmentResourceType,
        url: parsed.data.url,
      });
    }
    revalidateResources();
    return { success: true, message: "Resource updated." };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update resource.",
    };
  }
}

export async function deleteResourceAction(
  id: string,
  scope: "lesson" | "assignment"
): Promise<AdminActionResult> {
  const ctx = await getAdminContext();
  if (!ctx.ok) return { success: false, error: ctx.error };

  try {
    const service = new AdminResourcesService(ctx.supabase);
    if (scope === "lesson") {
      await service.deleteLessonResource(id);
    } else {
      await service.deleteAssignmentResource(id);
    }
    revalidateResources();
    return { success: true, message: "Resource deleted." };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete resource.",
    };
  }
}
