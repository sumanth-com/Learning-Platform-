"use client";

/**
 * Client helpers for the production Route Handler auth endpoints.
 * Cookies are applied from Set-Cookie on the fetch response, then we
 * hard-navigate so the first portal document request includes them.
 */

import { clearClientWorkspace } from "@/lib/client-workspace";

export type SignInApiResult =
  | { success: true; redirectTo: string; message?: string }
  | { success: false; error: string };

export async function signInViaRoute(input: {
  email: string;
  password: string;
  rememberMe?: boolean;
  next?: string | null;
}): Promise<SignInApiResult> {
  const res = await fetch("/auth/sign-in", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify({
      email: input.email,
      password: input.password,
      rememberMe: input.rememberMe ?? true,
      next: input.next ?? null,
    }),
  });

  let payload: SignInApiResult;
  try {
    payload = (await res.json()) as SignInApiResult;
  } catch {
    return {
      success: false,
      error: "Sign-in failed. Please try again.",
    };
  }

  if (!res.ok || !payload.success) {
    return {
      success: false,
      error:
        !payload.success && "error" in payload
          ? payload.error
          : "Sign-in failed. Please try again.",
    };
  }

  return payload;
}

export async function signOutViaRoute(): Promise<{
  success: boolean;
  redirectTo: string;
  message?: string;
}> {
  try {
    await clearClientWorkspace();
    const res = await fetch("/auth/sign-out", {
      method: "POST",
      credentials: "same-origin",
    });
    const payload = (await res.json()) as {
      success?: boolean;
      redirectTo?: string;
      message?: string;
    };
    return {
      success: Boolean(payload.success),
      redirectTo: payload.redirectTo ?? "/login",
      message: payload.message,
    };
  } catch {
    return { success: false, redirectTo: "/login" };
  }
}

export function hardNavigate(path: string) {
  window.location.assign(path);
}
