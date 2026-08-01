"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getAppUrl } from "@/lib/supabase/env";
import { ensureProfile } from "@/lib/supabase/ensure-profile";
import type { AuthActionResult, AuthSessionUser } from "@/types/auth";
import {
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
} from "@/features/auth/schemas/auth-schemas";
import { AUTH_MESSAGES, AUTH_ROUTES } from "@/features/auth/constants";
import { isCustomEmailEnabled } from "@/lib/email/env";
import {
  sendPasswordResetEmail,
  sendVerificationEmail,
} from "@/lib/email/send";
import {
  generateMagicLink,
  generateRecoveryLink,
  resolveUserDisplayName,
} from "@/lib/auth/links";
import { AUTH_RATE_LIMITS, checkRateLimit } from "@/lib/auth/rate-limit";
import { logAuthEvent } from "@/lib/auth/audit";
import { safeInternalPath } from "@/lib/auth/session-response";

function mapAuthError(
  error: { message: string; code?: string; status?: number } | null
): string {
  if (!error) return "Something went wrong. Please try again.";

  const message = error.message.toLowerCase();
  const code = error.code?.toLowerCase() ?? "";

  if (
    code === "email_not_confirmed" ||
    message.includes("email not confirmed")
  ) {
    return AUTH_MESSAGES.emailNotVerified;
  }

  if (
    message.includes("invalid login credentials") ||
    code === "invalid_credentials"
  ) {
    return AUTH_MESSAGES.invalidCredentials;
  }

  if (
    message.includes("user already registered") ||
    code === "user_already_exists" ||
    message.includes("already been registered")
  ) {
    return AUTH_MESSAGES.accountExists;
  }

  if (message.includes("password should be") || message.includes("password")) {
    return error.message;
  }

  if (message.includes("rate limit") || code.includes("over_request")) {
    return "Too many attempts. Please wait a minute and try again.";
  }

  return "Something went wrong. Please try again.";
}

function resolvePostLoginPath(
  role: string | undefined,
  nextPath: string | null | undefined
): string {
  const next = safeInternalPath(nextPath ?? null);
  if (role === "super_admin") {
    if (next?.startsWith("/admin")) return next;
    return AUTH_ROUTES.admin;
  }
  if (next) return next;
  return AUTH_ROUTES.dashboard;
}

/**
 * Password sign-in.
 *
 * IMPORTANT: Do NOT call redirect() after signInWithPassword.
 * On Vercel, Set-Cookie from a Server Action often does not attach to the
 * NEXT_REDIRECT response, so the next document request has no session and
 * proxy sends the user back to /login. Return the destination and let the
 * client navigate after cookies are committed on the action response.
 */
export async function loginAction(
  input: unknown,
  options?: { next?: string | null }
): Promise<AuthActionResult<{ redirectTo: string }>> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input.",
    };
  }

  const email = parsed.data.email.trim().toLowerCase();
  const limit = checkRateLimit(`login:${email}`, AUTH_RATE_LIMITS.login);
  if (!limit.allowed) {
    await logAuthEvent("rate_limited", { action: "login", email });
    return {
      success: false,
      error: `Too many sign-in attempts. Try again in ${limit.retryAfterSec}s.`,
    };
  }

  const supabase = await createClient();
  const { data: signInData, error } = await supabase.auth.signInWithPassword({
    email,
    password: parsed.data.password,
  });

  if (error) {
    await logAuthEvent("login_failed", {
      email,
      code: error.code,
    });
    return { success: false, error: mapAuthError(error) };
  }

  const user = signInData.user;
  let role: string | undefined;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    role = (profile as { role?: string } | null)?.role;
  }

  const redirectTo = resolvePostLoginPath(role, options?.next);

  await logAuthEvent("login_success", {
    email,
    userId: user?.id ?? null,
    role: role ?? null,
    redirectTo,
    hasSession: Boolean(signInData.session),
  });
  revalidatePath("/", "layout");

  return {
    success: true,
    message: AUTH_MESSAGES.loginSuccess,
    data: { redirectTo },
  };
}

export async function signupAction(
  _input: unknown
): Promise<AuthActionResult<{ email: string; needsVerification: boolean }>> {
  await logAuthEvent("signup_blocked", { reason: "invite_only" });
  return {
    success: false,
    error:
      "Public registration is closed. Reserve your seat to request an invitation.",
  };
}

const resendSchema = z.object({
  email: z.string().trim().email(),
});

export async function resendConfirmationAction(
  input: unknown
): Promise<AuthActionResult<{ retryAfterSec?: number }>> {
  const parsed = resendSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Enter a valid email address." };
  }

  const email = parsed.data.email.trim().toLowerCase();
  const limit = checkRateLimit(
    `resend:${email}`,
    AUTH_RATE_LIMITS.resendVerification
  );
  if (!limit.allowed) {
    await logAuthEvent("rate_limited", { action: "resend", email });
    return {
      success: false,
      error: `Please wait ${limit.retryAfterSec}s before requesting another email.`,
      data: { retryAfterSec: limit.retryAfterSec },
    };
  }

  if (isCustomEmailEnabled()) {
    try {
      const { actionLink, user } = await generateMagicLink(email);
      const display = await resolveUserDisplayName(
        email,
        (user?.user_metadata?.full_name as string | undefined) ?? undefined
      );
      const send = await sendVerificationEmail({
        to: email,
        verifyUrl: actionLink,
        fullName: display.fullName,
        firstName: display.firstName,
      });
      if (!send.ok) {
        return {
          success: false,
          error: "Couldn't send verification email. Try again shortly.",
        };
      }
      await logAuthEvent("verification_resent", { email, mode: "resend" });
      return {
        success: true,
        message: AUTH_MESSAGES.confirmationResent,
        data: { retryAfterSec: 60 },
      };
    } catch (err) {
      // Enumeration protection — always look successful-ish for unknown emails.
      await logAuthEvent("verification_resent", {
        email,
        mode: "resend",
        softFail: err instanceof Error ? err.message : "error",
      });
      return {
        success: true,
        message: AUTH_MESSAGES.confirmationResent,
        data: { retryAfterSec: 60 },
      };
    }
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: {
      emailRedirectTo: `${getAppUrl()}${AUTH_ROUTES.callback}?next=${AUTH_ROUTES.dashboard}`,
    },
  });

  if (error) {
    // Still return success-ish for unknown emails when possible.
    const msg = error.message.toLowerCase();
    if (msg.includes("already") || msg.includes("not found")) {
      return {
        success: true,
        message: AUTH_MESSAGES.confirmationResent,
        data: { retryAfterSec: 60 },
      };
    }
    return { success: false, error: mapAuthError(error) };
  }

  await logAuthEvent("verification_resent", { email, mode: "supabase" });
  return {
    success: true,
    message: AUTH_MESSAGES.confirmationResent,
    data: { retryAfterSec: 60 },
  };
}

export async function forgotPasswordAction(
  input: unknown
): Promise<AuthActionResult> {
  const parsed = forgotPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input.",
    };
  }

  const email = parsed.data.email.trim().toLowerCase();
  const limit = checkRateLimit(
    `forgot:${email}`,
    AUTH_RATE_LIMITS.forgotPassword
  );

  // Always return the same message (email enumeration protection).
  const ok = {
    success: true as const,
    message: AUTH_MESSAGES.forgotPasswordSuccess,
  };

  if (!limit.allowed) {
    await logAuthEvent("rate_limited", { action: "forgot", email });
    return ok;
  }

  if (isCustomEmailEnabled()) {
    try {
      const { actionLink, user } = await generateRecoveryLink(email);
      const display = await resolveUserDisplayName(
        email,
        (user?.user_metadata?.full_name as string | undefined) ?? undefined
      );
      await sendPasswordResetEmail({
        to: email,
        resetUrl: actionLink,
        fullName: display.fullName,
        firstName: display.firstName,
      });
      await logAuthEvent("password_reset_requested", {
        email,
        mode: "resend",
      });
    } catch (err) {
      await logAuthEvent("password_reset_requested", {
        email,
        mode: "resend",
        softFail: err instanceof Error ? err.message : "error",
      });
    }
    return ok;
  }

  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${getAppUrl()}${AUTH_ROUTES.callback}?next=${AUTH_ROUTES.resetPassword}`,
  });
  await logAuthEvent("password_reset_requested", { email, mode: "supabase" });
  return ok;
}

export async function resetPasswordAction(
  input: unknown
): Promise<AuthActionResult> {
  const parsed = resetPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input.",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: "Your reset link is invalid or has expired. Request a new one.",
    };
  }

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    return { success: false, error: mapAuthError(error) };
  }

  await logAuthEvent("password_reset_completed", { userId: user.id });
  await supabase.auth.signOut();
  revalidatePath("/", "layout");

  return {
    success: true,
    message: AUTH_MESSAGES.resetPasswordSuccess,
  };
}

/** Update password while signed in (settings). Stays logged in. */
export async function changePasswordAction(
  input: unknown
): Promise<AuthActionResult> {
  const parsed = resetPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input.",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: AUTH_MESSAGES.unauthorized,
    };
  }

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    return { success: false, error: mapAuthError(error) };
  }

  await logAuthEvent("password_changed", { userId: user.id });

  return {
    success: true,
    message: AUTH_MESSAGES.changePasswordSuccess,
  };
}

/**
 * Sign out and clear session cookies on the action response.
 * Client must navigate after this returns so cleared cookies are applied.
 */
export async function logoutAction(): Promise<
  AuthActionResult<{ redirectTo: string }>
> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  await supabase.auth.signOut();
  await logAuthEvent("logout", {
    userId: user?.id ?? null,
  });
  revalidatePath("/", "layout");
  return {
    success: true,
    message: AUTH_MESSAGES.logoutSuccess,
    data: { redirectTo: AUTH_ROUTES.login },
  };
}

export async function getCurrentUser(): Promise<AuthSessionUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  try {
    const profile = await ensureProfile(supabase, user);
    return { user, profile };
  } catch {
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();
    return { user, profile };
  }
}
