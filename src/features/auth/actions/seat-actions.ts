"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getAppUrl } from "@/lib/supabase/env";
import type { AuthActionResult } from "@/types/auth";
import type { SeatRequestRow } from "@/types/database";
import {
  createAccountSchema,
  seatRequestSchema,
} from "@/features/auth/schemas/auth-schemas";
import { AUTH_RATE_LIMITS, checkRateLimit } from "@/lib/auth/rate-limit";
import { logAuthEvent } from "@/lib/auth/audit";
import { AUTH_ROUTES } from "@/features/auth/constants";
import { ADMIN_ROUTES, isAdminRole } from "@/features/admin/types";
import { sendSeatApprovedEmail } from "@/lib/email/send";
import { firstNameFrom } from "@/lib/email/layout";
import {
  formatInternationalPhone,
  getPhoneCountry,
} from "@/lib/phone-countries";
import {
  authAdminApi,
  generateInviteToken,
  generateTempPassword,
  hashInviteToken,
  serviceRest,
} from "@/lib/auth/service-admin";

const INVITE_TTL_MS = 24 * 60 * 60 * 1000;

export async function submitSeatRequestAction(
  input: unknown
): Promise<AuthActionResult> {
  const parsed = seatRequestSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input.",
    };
  }

  const name = parsed.data.name.trim();
  const email = parsed.data.email.trim().toLowerCase();
  const countryMeta = getPhoneCountry(parsed.data.countryCode);
  const phone = formatInternationalPhone(
    parsed.data.countryCode,
    parsed.data.phone
  );
  const country = countryMeta?.name ?? parsed.data.countryCode;


  const limit = checkRateLimit(
    `seat:${email}`,
    AUTH_RATE_LIMITS.seatRequest
  );
  if (!limit.allowed) {
    await logAuthEvent("rate_limited", { action: "seat_request", email });
    return {
      success: false,
      error: `Too many requests. Try again in ${limit.retryAfterSec}s.`,
    };
  }

  try {
    const existing = await serviceRest<SeatRequestRow[]>(
      `/seat_requests?email=eq.${encodeURIComponent(email)}&select=id,status&limit=1`
    );

    if (existing?.[0]) {
      const status = existing[0].status;
      if (status === "pending" || status === "contacted") {
        return {
          success: true,
          message:
            "We already have your access request. We'll contact you once it's reviewed.",
        };
      }
      if (status === "approved" || status === "joined") {
        return {
          success: false,
          error:
            "This email already has an approved seat. Check your inbox for the activation link, or sign in.",
        };
      }
      return {
        success: false,
        error:
          "This email was previously rejected. Contact support if you believe this is a mistake.",
      };
    }

    // Block if an auth profile already exists
    const profiles = await serviceRest<{ id: string }[]>(
      `/profiles?email=eq.${encodeURIComponent(email)}&select=id&limit=1`
    );
    if (profiles?.[0]) {
      return {
        success: false,
        error: "An account already exists for this email. Please sign in.",
      };
    }

    await serviceRest("/seat_requests", {
      method: "POST",
      prefer: "return=minimal",
      body: JSON.stringify({
        name,
        email,
        phone,
        country,
        applicant_status: null,
        college_name: null,
        message: null,
        source: "reserve_access",
        status: "pending",
      }),
    });

    await logAuthEvent("seat_request_created", { email });
    return {
      success: true,
      message:
        "Your request has been received successfully. Our team will review it and contact you soon.",
    };
  } catch (err) {
    const messageText = err instanceof Error ? err.message : "Request failed.";
    // Unique violation
    if (
      messageText.toLowerCase().includes("duplicate") ||
      messageText.includes("23505")
    ) {
      return {
        success: true,
        message:
          "We already have your access request. We'll contact you once it's reviewed.",
      };
    }
    await logAuthEvent("seat_request_failed", { email, error: messageText });
    return { success: false, error: "Could not submit your request. Try again." };
  }
}

async function requireSuperAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, error: "Sign in required." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, email, full_name")
    .eq("id", user.id)
    .maybeSingle();

  const role = (profile as { role?: string } | null)?.role;
  if (!isAdminRole(role as "super_admin")) {
    return { ok: false as const, error: "Super admin access required." };
  }

  return { ok: true as const, user, profile, supabase };
}

export async function listSeatRequestsAction(): Promise<
  AuthActionResult<{ items: SeatRequestRow[] }>
> {
  const ctx = await requireSuperAdmin();
  if (!ctx.ok) return { success: false, error: ctx.error };

  const { data, error } = await ctx.supabase
    .from("seat_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return { success: false, error: error.message };
  return {
    success: true,
    data: { items: (data ?? []) as SeatRequestRow[] },
  };
}

export async function approveSeatRequestAction(
  requestId: string
): Promise<AuthActionResult> {
  const ctx = await requireSuperAdmin();
  if (!ctx.ok) return { success: false, error: ctx.error };

  const rows = await serviceRest<SeatRequestRow[]>(
    `/seat_requests?id=eq.${encodeURIComponent(requestId)}&select=*&limit=1`
  );
  const request = rows?.[0];
  if (!request) return { success: false, error: "Seat request not found." };
  if (request.status === "approved" && request.user_id) {
    return { success: false, error: "This request is already approved." };
  }
  if (request.status === "rejected") {
    return { success: false, error: "Rejected requests cannot be approved." };
  }

  const email = request.email.toLowerCase();
  const name = request.name;

  try {
    // Create auth user (confirmed). Password is temporary until activation.
    const created = await authAdminApi<{
      id?: string;
      user?: { id: string };
    }>("/admin/users", {
      method: "POST",
      body: JSON.stringify({
        email,
        password: generateTempPassword(),
        email_confirm: true,
        user_metadata: { full_name: name },
      }),
    });

    const userId = created.id || created.user?.id;
    if (!userId) throw new Error("Failed to create auth user.");

    // Ensure profile is student
    await serviceRest(`/profiles?id=eq.${userId}`, {
      method: "PATCH",
      prefer: "return=minimal",
      body: JSON.stringify({
        full_name: name,
        email,
        role: "student",
      }),
    });

    const token = generateInviteToken();
    const tokenHash = hashInviteToken(token);
    const expiresAt = new Date(Date.now() + INVITE_TTL_MS).toISOString();

    // Replace any prior invite for this request
    await serviceRest(
      `/seat_invitations?seat_request_id=eq.${encodeURIComponent(requestId)}`,
      { method: "DELETE", prefer: "return=minimal" }
    );

    await serviceRest("/seat_invitations", {
      method: "POST",
      prefer: "return=minimal",
      body: JSON.stringify({
        seat_request_id: requestId,
        user_id: userId,
        email,
        token_hash: tokenHash,
        expires_at: expiresAt,
      }),
    });

    await serviceRest(`/seat_requests?id=eq.${encodeURIComponent(requestId)}`, {
      method: "PATCH",
      prefer: "return=minimal",
      body: JSON.stringify({
        status: "approved",
        approved_by: ctx.user.id,
        approved_at: new Date().toISOString(),
        user_id: userId,
      }),
    });

    const activateUrl = `${getAppUrl()}${AUTH_ROUTES.createAccount}?token=${encodeURIComponent(token)}`;
    const send = await sendSeatApprovedEmail({
      to: email,
      activateUrl,
      fullName: name,
      firstName: firstNameFrom(name, email),
    });

    if (!send.ok && !send.skipped) {
      await logAuthEvent("seat_approve_email_failed", {
        email,
        error: send.error,
      });
      await logAuthEvent("seat_approved", { email, requestId, userId });
      revalidatePath(ADMIN_ROUTES.accessRequests);
      revalidatePath(ADMIN_ROUTES.root);
      return {
        success: true,
        message: `Approved, but the email failed (${send.error}). Use “Resend invite”.`,
      };
    }

    await logAuthEvent("seat_approved", { email, requestId, userId });
    try {
      await ctx.supabase.from("audit_events").insert({
        profile_id: userId,
        actor_id: ctx.user.id,
        event_type: "account_approved",
        entity_type: "seat_request",
        entity_id: requestId,
        payload: { email },
      } as never);
      await ctx.supabase.rpc("ensure_learner_workspace", {
        p_profile_id: userId,
      } as never);
    } catch {
      /* non-blocking */
    }
    revalidatePath(ADMIN_ROUTES.accessRequests);
    revalidatePath(ADMIN_ROUTES.root);
    return {
      success: true,
      message:
        !send.ok && send.skipped
          ? "Approved. Configure Resend, then use “Resend invite”."
          : "Approved. Invitation email sent.",
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Approve failed.";
    await logAuthEvent("seat_approve_failed", { email, error: message });
    if (
      message.toLowerCase().includes("already") ||
      message.toLowerCase().includes("registered")
    ) {
      return {
        success: false,
        error: "An account already exists for this email.",
      };
    }
    return { success: false, error: message };
  }
}

/**
 * Resend activation email for an already-approved request
 * (new token, 24h TTL). Use when Resend failed or the link expired.
 */
export async function resendSeatInviteAction(
  requestId: string
): Promise<AuthActionResult> {
  const ctx = await requireSuperAdmin();
  if (!ctx.ok) return { success: false, error: ctx.error };

  const rows = await serviceRest<SeatRequestRow[]>(
    `/seat_requests?id=eq.${encodeURIComponent(requestId)}&select=*&limit=1`
  );
  const request = rows?.[0];
  if (!request) return { success: false, error: "Seat request not found." };
  if (request.status !== "approved" || !request.user_id) {
    return {
      success: false,
      error: "Only approved (not yet joined) requests can resend an invite.",
    };
  }

  const email = request.email.toLowerCase();
  const name = request.name;
  const userId = request.user_id;

  try {
    const token = generateInviteToken();
    const tokenHash = hashInviteToken(token);
    const expiresAt = new Date(Date.now() + INVITE_TTL_MS).toISOString();

    await serviceRest(
      `/seat_invitations?seat_request_id=eq.${encodeURIComponent(requestId)}`,
      { method: "DELETE", prefer: "return=minimal" }
    );

    await serviceRest("/seat_invitations", {
      method: "POST",
      prefer: "return=minimal",
      body: JSON.stringify({
        seat_request_id: requestId,
        user_id: userId,
        email,
        token_hash: tokenHash,
        expires_at: expiresAt,
      }),
    });

    const activateUrl = `${getAppUrl()}${AUTH_ROUTES.createAccount}?token=${encodeURIComponent(token)}`;
    const send = await sendSeatApprovedEmail({
      to: email,
      activateUrl,
      fullName: name,
      firstName: firstNameFrom(name, email),
    });

    if (!send.ok) {
      await logAuthEvent("seat_invite_resend_failed", {
        email,
        error: send.error,
        skipped: send.skipped,
      });
      return {
        success: false,
        error: send.skipped
          ? "Configure Resend (RESEND_API_KEY) to send invitation emails."
          : `Could not send email: ${send.error}`,
      };
    }

    await logAuthEvent("seat_invite_resent", { email, requestId, userId });
    revalidatePath(ADMIN_ROUTES.accessRequests);
    return { success: true, message: "Invitation email resent." };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Resend failed.";
    await logAuthEvent("seat_invite_resend_failed", { email, error: message });
    return { success: false, error: message };
  }
}

export async function rejectSeatRequestAction(
  requestId: string
): Promise<AuthActionResult> {
  const ctx = await requireSuperAdmin();
  if (!ctx.ok) return { success: false, error: ctx.error };

  await serviceRest(`/seat_requests?id=eq.${encodeURIComponent(requestId)}`, {
    method: "PATCH",
    prefer: "return=minimal",
    body: JSON.stringify({
      status: "rejected",
      approved_by: ctx.user.id,
      approved_at: new Date().toISOString(),
    }),
  });

  await logAuthEvent("seat_rejected", { requestId });
  revalidatePath(ADMIN_ROUTES.accessRequests);
  revalidatePath(ADMIN_ROUTES.root);
  return { success: true, message: "Request rejected." };
}

export async function contactSeatRequestAction(
  requestId: string
): Promise<AuthActionResult> {
  const ctx = await requireSuperAdmin();
  if (!ctx.ok) return { success: false, error: ctx.error };

  await serviceRest(`/seat_requests?id=eq.${encodeURIComponent(requestId)}`, {
    method: "PATCH",
    prefer: "return=minimal",
    body: JSON.stringify({ status: "contacted" }),
  });

  await logAuthEvent("seat_contacted", { requestId });
  revalidatePath(ADMIN_ROUTES.accessRequests);
  return { success: true, message: "Marked as contacted." };
}

export async function updateSeatRequestNotesAction(
  requestId: string,
  notes: string
): Promise<AuthActionResult> {
  const ctx = await requireSuperAdmin();
  if (!ctx.ok) return { success: false, error: ctx.error };

  await serviceRest(`/seat_requests?id=eq.${encodeURIComponent(requestId)}`, {
    method: "PATCH",
    prefer: "return=minimal",
    body: JSON.stringify({ notes: notes.trim() || null }),
  });

  revalidatePath(ADMIN_ROUTES.accessRequests);
  return { success: true, message: "Notes saved." };
}

export async function deleteSeatRequestAction(
  requestId: string
): Promise<AuthActionResult> {
  const ctx = await requireSuperAdmin();
  if (!ctx.ok) return { success: false, error: ctx.error };

  await serviceRest(`/seat_requests?id=eq.${encodeURIComponent(requestId)}`, {
    method: "DELETE",
    prefer: "return=minimal",
  });

  await logAuthEvent("seat_deleted", { requestId });
  revalidatePath(ADMIN_ROUTES.accessRequests);
  revalidatePath(ADMIN_ROUTES.root);
  return { success: true, message: "Request deleted." };
}

export async function getInvitePreviewAction(token: string): Promise<
  AuthActionResult<{ email: string; name: string }>
> {
  if (!token || token.length < 20) {
    return { success: false, error: "Invalid invitation link." };
  }

  const tokenHash = hashInviteToken(token);
  const invites = await serviceRest<
    {
      email: string;
      expires_at: string;
      used_at: string | null;
      seat_request_id: string;
    }[]
  >(
    `/seat_invitations?token_hash=eq.${encodeURIComponent(tokenHash)}&select=email,expires_at,used_at,seat_request_id&limit=1`
  );

  const invite = invites?.[0];
  if (!invite) return { success: false, error: "Invalid invitation link." };
  if (invite.used_at) {
    return { success: false, error: "This invitation has already been used." };
  }
  if (new Date(invite.expires_at).getTime() < Date.now()) {
    return { success: false, error: "This invitation has expired." };
  }

  const requests = await serviceRest<{ name: string }[]>(
    `/seat_requests?id=eq.${encodeURIComponent(invite.seat_request_id)}&select=name&limit=1`
  );

  return {
    success: true,
    data: {
      email: invite.email,
      name: requests?.[0]?.name ?? "",
    },
  };
}

export async function completeInviteAccountAction(
  input: unknown
): Promise<AuthActionResult<{ redirectTo: string; email: string }>> {
  const parsed = createAccountSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input.",
    };
  }

  const limit = checkRateLimit(
    `create-account:${parsed.data.token.slice(0, 12)}`,
    AUTH_RATE_LIMITS.createAccount
  );
  if (!limit.allowed) {
    return {
      success: false,
      error: `Too many attempts. Try again in ${limit.retryAfterSec}s.`,
    };
  }

  const tokenHash = hashInviteToken(parsed.data.token);
  const invites = await serviceRest<
    {
      id: string;
      user_id: string;
      email: string;
      expires_at: string;
      used_at: string | null;
      seat_request_id: string;
    }[]
  >(
    `/seat_invitations?token_hash=eq.${encodeURIComponent(tokenHash)}&select=*&limit=1`
  );

  const invite = invites?.[0];
  if (!invite) return { success: false, error: "Invalid invitation link." };
  if (invite.used_at) {
    return { success: false, error: "This invitation has already been used." };
  }
  if (new Date(invite.expires_at).getTime() < Date.now()) {
    return { success: false, error: "This invitation has expired." };
  }

  try {
    await authAdminApi(`/admin/users/${invite.user_id}`, {
      method: "PUT",
      body: JSON.stringify({
        password: parsed.data.password,
        email_confirm: true,
        user_metadata: { full_name: parsed.data.fullName.trim() },
      }),
    });

    await serviceRest(`/profiles?id=eq.${invite.user_id}`, {
      method: "PATCH",
      prefer: "return=minimal",
      body: JSON.stringify({
        full_name: parsed.data.fullName.trim(),
        role: "student",
      }),
    });

    await serviceRest(`/seat_invitations?id=eq.${invite.id}`, {
      method: "PATCH",
      prefer: "return=minimal",
      body: JSON.stringify({ used_at: new Date().toISOString() }),
    });

    if (invite.seat_request_id) {
      await serviceRest(
        `/seat_requests?id=eq.${encodeURIComponent(invite.seat_request_id)}`,
        {
          method: "PATCH",
          prefer: "return=minimal",
          body: JSON.stringify({ status: "joined" }),
        }
      );
    }

    // Password is set — browser will sign the user in so cookies stick on Vercel.
    await logAuthEvent("invite_account_activated", {
      email: invite.email,
      userId: invite.user_id,
      autoSignedIn: false,
    });

    revalidatePath(ADMIN_ROUTES.accessRequests);
    revalidatePath("/", "layout");

    return {
      success: true,
      message: "Welcome to Suprabase — your account is ready.",
      data: {
        redirectTo: AUTH_ROUTES.dashboard,
        email: invite.email,
      },
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Activation failed.";
    await logAuthEvent("invite_account_failed", {
      email: invite.email,
      error: message,
    });
    return { success: false, error: message };
  }
}
