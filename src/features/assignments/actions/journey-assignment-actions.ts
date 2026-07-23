"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { JourneySubmissionService } from "@/features/assignments/services/journey-submission.service";
import {
  reviewJourneySubmissionSchema,
  submitJourneyAssignmentSchema,
} from "@/features/assignments/schemas/journey-assignment-schemas";
import { isMentorRole } from "@/features/assignments/types";
import { ADMIN_ROUTES } from "@/features/admin/types";
import type {
  JourneyAssignmentSubmissionRow,
  UserRole,
} from "@/types/database";

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
    .select("role, full_name, email")
    .eq("id", user.id)
    .maybeSingle();

  const row = profile as {
    role?: UserRole;
    full_name?: string | null;
    email?: string;
  } | null;

  return {
    supabase,
    user,
    role: row?.role ?? ("student" as UserRole),
    fullName: row?.full_name ?? "",
    email: row?.email ?? user.email ?? "",
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

export async function submitJourneyAssignmentAction(
  input: unknown
): Promise<ActionResult<{ submission: JourneyAssignmentSubmissionRow }>> {
  const ctx = await requireUser();
  if (!ctx.user) return { success: false, error: "Sign in required." };

  const parsed = submitJourneyAssignmentSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input.",
    };
  }

  try {
    const service = new JourneySubmissionService(ctx.supabase);
    const submission = await service.submit(
      ctx.user.id,
      {
        name: ctx.fullName || "Student",
        email: ctx.email,
      },
      parsed.data
    );

    revalidatePath(ADMIN_ROUTES.submissions);
    revalidatePath(
      `/assignments/${parsed.data.moduleSlug}`
    );
    return {
      success: true,
      data: { submission },
      message: "Submitted for review. An admin will see it shortly.",
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to submit assignment.",
    };
  }
}

export async function getMyJourneySubmissionAction(
  catalogId: string
): Promise<ActionResult<{ submission: JourneyAssignmentSubmissionRow | null }>> {
  const ctx = await requireUser();
  if (!ctx.user) return { success: false, error: "Sign in required." };

  try {
    const service = new JourneySubmissionService(ctx.supabase);
    const submission = await service.findMine(catalogId, ctx.user.id);
    return { success: true, data: { submission } };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to load submission.",
    };
  }
}

export async function reviewJourneySubmissionAction(
  input: unknown
): Promise<ActionResult> {
  const mentor = await requireMentor();
  if (!mentor.ok) return { success: false, error: mentor.error };

  const parsed = reviewJourneySubmissionSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input.",
    };
  }

  try {
    const service = new JourneySubmissionService(mentor.supabase);
    await service.review({
      submissionId: parsed.data.submissionId,
      status: parsed.data.status,
      marks: parsed.data.marks,
      feedback: parsed.data.feedback,
    });

    revalidatePath(ADMIN_ROUTES.submissions);
    revalidatePath(ADMIN_ROUTES.submissionDetail(parsed.data.submissionId));
    return { success: true, message: "Review saved." };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save review.",
    };
  }
}
