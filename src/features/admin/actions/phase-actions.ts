"use server";

import { revalidatePath } from "next/cache";
import { getAdminContext } from "@/features/admin/lib/require-admin";
import { AdminPhasesService } from "@/features/admin/services/phases.service";
import {
  phaseFormSchema,
  reorderPhasesSchema,
} from "@/features/admin/schemas/admin-schemas";
import { ADMIN_ROUTES, type AdminActionResult } from "@/features/admin/types";

function revalidatePhases() {
  revalidatePath(ADMIN_ROUTES.phases);
  revalidatePath(ADMIN_ROUTES.root);
}

export async function createPhaseAction(
  input: unknown
): Promise<AdminActionResult<{ id: string }>> {
  const ctx = await getAdminContext();
  if (!ctx.ok) return { success: false, error: ctx.error };

  const parsed = phaseFormSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input.",
    };
  }

  try {
    const phase = await new AdminPhasesService(ctx.supabase).create(
      parsed.data
    );
    revalidatePhases();
    return {
      success: true,
      data: { id: phase.id },
      message: "Phase created.",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create phase.",
    };
  }
}

export async function updatePhaseAction(
  id: string,
  input: unknown
): Promise<AdminActionResult> {
  const ctx = await getAdminContext();
  if (!ctx.ok) return { success: false, error: ctx.error };

  const parsed = phaseFormSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input.",
    };
  }

  try {
    await new AdminPhasesService(ctx.supabase).update(id, parsed.data);
    revalidatePhases();
    revalidatePath(ADMIN_ROUTES.phaseEdit(id));
    return { success: true, message: "Phase updated." };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update phase.",
    };
  }
}

export async function reorderPhasesAction(
  input: unknown
): Promise<AdminActionResult> {
  const ctx = await getAdminContext();
  if (!ctx.ok) return { success: false, error: ctx.error };

  const parsed = reorderPhasesSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input.",
    };
  }

  try {
    await new AdminPhasesService(ctx.supabase).reorder(parsed.data.orderedIds);
    revalidatePhases();
    return { success: true, message: "Phase order saved." };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to reorder phases.",
    };
  }
}

export async function deletePhaseAction(
  id: string
): Promise<AdminActionResult> {
  const ctx = await getAdminContext();
  if (!ctx.ok) return { success: false, error: ctx.error };

  try {
    await new AdminPhasesService(ctx.supabase).delete(id);
    revalidatePhases();
    return { success: true, message: "Phase deleted." };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete phase.",
    };
  }
}
