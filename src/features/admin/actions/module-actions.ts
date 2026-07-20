"use server";

import { revalidatePath } from "next/cache";
import { getAdminContext } from "@/features/admin/lib/require-admin";
import { AdminModulesService } from "@/features/admin/services/modules.service";
import { moduleFormSchema } from "@/features/admin/schemas/admin-schemas";
import { ADMIN_ROUTES, type AdminActionResult } from "@/features/admin/types";

function revalidateModules() {
  revalidatePath(ADMIN_ROUTES.modules);
  revalidatePath(ADMIN_ROUTES.root);
}

export async function createModuleAction(
  input: unknown
): Promise<AdminActionResult<{ id: string }>> {
  const ctx = await getAdminContext();
  if (!ctx.ok) return { success: false, error: ctx.error };

  const parsed = moduleFormSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input.",
    };
  }

  try {
    const mod = await new AdminModulesService(ctx.supabase).create(parsed.data);
    revalidateModules();
    return {
      success: true,
      data: { id: mod.id },
      message: "Module created.",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create module.",
    };
  }
}

export async function updateModuleAction(
  id: string,
  input: unknown
): Promise<AdminActionResult> {
  const ctx = await getAdminContext();
  if (!ctx.ok) return { success: false, error: ctx.error };

  const parsed = moduleFormSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input.",
    };
  }

  try {
    await new AdminModulesService(ctx.supabase).update(id, parsed.data);
    revalidateModules();
    revalidatePath(ADMIN_ROUTES.moduleEdit(id));
    return { success: true, message: "Module updated." };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update module.",
    };
  }
}

export async function deleteModuleAction(
  id: string
): Promise<AdminActionResult> {
  const ctx = await getAdminContext();
  if (!ctx.ok) return { success: false, error: ctx.error };

  try {
    await new AdminModulesService(ctx.supabase).delete(id);
    revalidateModules();
    return { success: true, message: "Module deleted." };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete module.",
    };
  }
}
