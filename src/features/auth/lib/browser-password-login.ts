"use client";

import { createClient } from "@/lib/supabase/client";
import { AUTH_MESSAGES } from "@/features/auth/constants";
import { resolvePostLoginPath } from "@/features/auth/lib/post-login-path";

function mapBrowserAuthError(message: string | undefined): string {
  const msg = (message ?? "").toLowerCase();
  if (msg.includes("email not confirmed")) {
    return AUTH_MESSAGES.emailNotVerified;
  }
  if (msg.includes("invalid login credentials") || msg.includes("invalid_credentials")) {
    return AUTH_MESSAGES.invalidCredentials;
  }
  if (msg.includes("rate limit")) {
    return "Too many attempts. Please wait a minute and try again.";
  }
  return message?.trim() || "Something went wrong. Please try again.";
}

export type BrowserLoginResult =
  | { success: true; redirectTo: string; email: string; userId: string }
  | { success: false; error: string };

/**
 * Establish the session in the browser.
 *
 * Server Action cookie writes are unreliable on Vercel with Next.js App Router.
 * Browser sign-in writes the sb-* cookies via document storage, then a full
 * navigation guarantees proxy/middleware sees the session on the next request.
 */
export async function browserPasswordLogin(input: {
  email: string;
  password: string;
  next?: string | null;
}): Promise<BrowserLoginResult> {
  const email = input.email.trim().toLowerCase();
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: input.password,
  });

  if (error || !data.user) {
    return {
      success: false,
      error: mapBrowserAuthError(error?.message),
    };
  }

  // Confirm the session was persisted to cookies before navigating.
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    return {
      success: false,
      error: "Signed in, but the session could not be saved. Please try again.",
    };
  }

  let role: string | undefined;
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .maybeSingle();
  role = (profile as { role?: string } | null)?.role;

  const redirectTo = resolvePostLoginPath(role, input.next);

  return {
    success: true,
    redirectTo,
    email,
    userId: data.user.id,
  };
}

/** Full document navigation so the first protected request includes auth cookies. */
export function hardNavigate(path: string) {
  window.location.assign(path);
}
