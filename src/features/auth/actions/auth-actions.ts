"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAppUrl } from "@/lib/supabase/env";
import type { AuthActionResult, AuthSessionUser } from "@/types/auth";
import {
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
  signupSchema,
} from "@/features/auth/schemas/auth-schemas";
import { AUTH_MESSAGES, AUTH_ROUTES } from "@/features/auth/constants";
import { z } from "zod";

function mapAuthError(error: { message: string; code?: string; status?: number } | null): string {
  if (!error) return "Something went wrong. Please try again.";

  const message = error.message.toLowerCase();
  const code = error.code?.toLowerCase() ?? "";

  if (
    code === "email_not_confirmed" ||
    message.includes("email not confirmed")
  ) {
    return "Please verify your email before signing in. Check your inbox (and spam) for the link from Supabase.";
  }

  if (message.includes("invalid login credentials") || code === "invalid_credentials") {
    return "Invalid email or password. If you just signed up, verify your email first — or turn off Confirm email in Supabase Auth for local development.";
  }

  if (
    message.includes("user already registered") ||
    code === "user_already_exists"
  ) {
    return AUTH_MESSAGES.accountExists;
  }

  if (message.includes("password")) {
    return error.message;
  }

  return error.message || "Something went wrong. Please try again.";
}

export async function loginAction(
  input: unknown
): Promise<AuthActionResult> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email.trim().toLowerCase(),
    password: parsed.data.password,
  });

  if (error) {
    return { success: false, error: mapAuthError(error) };
  }

  revalidatePath("/", "layout");
  redirect(AUTH_ROUTES.dashboard);
}

export async function signupAction(
  input: unknown
): Promise<AuthActionResult<{ email: string; needsVerification: boolean }>> {
  const parsed = signupSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input.",
    };
  }

  const email = parsed.data.email.trim().toLowerCase();
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.fullName,
      },
      emailRedirectTo: `${getAppUrl()}${AUTH_ROUTES.callback}?next=${AUTH_ROUTES.dashboard}`,
    },
  });

  if (error) {
    return { success: false, error: mapAuthError(error) };
  }

  // Supabase returns a user with empty identities when the email is already registered
  // (anti-enumeration). Treat that as an existing account.
  const identities = data.user?.identities ?? [];
  if (data.user && identities.length === 0) {
    return {
      success: false,
      error: AUTH_MESSAGES.accountExists,
    };
  }

  // Confirm email disabled → session present → go straight in.
  if (data.session) {
    revalidatePath("/", "layout");
    redirect(AUTH_ROUTES.dashboard);
  }

  // Confirm email enabled → no session until the user clicks the link.
  return {
    success: true,
    message: AUTH_MESSAGES.signupNeedsVerification,
    data: { email, needsVerification: true },
  };
}

const resendSchema = z.object({
  email: z.string().trim().email(),
});

export async function resendConfirmationAction(
  input: unknown
): Promise<AuthActionResult> {
  const parsed = resendSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Enter a valid email address." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resend({
    type: "signup",
    email: parsed.data.email.trim().toLowerCase(),
    options: {
      emailRedirectTo: `${getAppUrl()}${AUTH_ROUTES.callback}?next=${AUTH_ROUTES.dashboard}`,
    },
  });

  if (error) {
    return { success: false, error: mapAuthError(error) };
  }

  return {
    success: true,
    message: AUTH_MESSAGES.confirmationResent,
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

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(
    parsed.data.email.trim().toLowerCase(),
    {
      redirectTo: `${getAppUrl()}${AUTH_ROUTES.callback}?next=${AUTH_ROUTES.resetPassword}`,
    }
  );

  if (error) {
    return { success: false, error: mapAuthError(error) };
  }

  return {
    success: true,
    message: AUTH_MESSAGES.forgotPasswordSuccess,
  };
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

  await supabase.auth.signOut();
  revalidatePath("/", "layout");

  return {
    success: true,
    message: AUTH_MESSAGES.resetPasswordSuccess,
  };
}

export async function logoutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect(AUTH_ROUTES.login);
}

export async function getCurrentUser(): Promise<AuthSessionUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return { user, profile };
}
