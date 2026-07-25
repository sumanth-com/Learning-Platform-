import { getAppUrl, getSupabaseEnv } from "@/lib/supabase/env";
import { AUTH_ROUTES } from "@/features/auth/constants";
import { firstNameFrom } from "@/lib/email/layout";
import type { User } from "@supabase/supabase-js";

export type AuthEmailLinkType =
  | "recovery"
  | "signup"
  | "magiclink"
  | "invite"
  | "email";

export function callbackUrl(next: string) {
  return `${getAppUrl()}${AUTH_ROUTES.callback}?next=${encodeURIComponent(next)}`;
}

function getServiceRole() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!key) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY. Required for branded auth emails."
    );
  }
  return key;
}

/**
 * Auth Admin REST helper — avoids realtime/WebSocket requirements on Node 20.
 */
async function authAdmin<T = Record<string, unknown>>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const { url } = getSupabaseEnv();
  const serviceRole = getServiceRole();
  const res = await fetch(`${url}/auth/v1${path}`, {
    ...init,
    headers: {
      apikey: serviceRole,
      Authorization: `Bearer ${serviceRole}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  const body = (await res.json().catch(() => ({}))) as T & {
    message?: string;
    error?: string;
    msg?: string;
  };
  if (!res.ok) {
    throw new Error(
      body.message || body.error || body.msg || `Auth admin error ${res.status}`
    );
  }
  return body;
}

type GenerateLinkResponse = {
  action_link?: string;
  email_otp?: string;
  hashed_token?: string;
  redirect_to?: string;
  verification_type?: string;
  properties?: {
    action_link?: string;
    hashed_token?: string;
    email_otp?: string;
    verification_type?: string;
  };
  user?: User;
};

/**
 * Prefer an app-hosted token_hash link so /auth/callback can verifyOtp.
 * Supabase-hosted action_link often returns to our app without a PKCE code
 * (tokens in the URL hash), which server routes cannot read → auth_callback_failed.
 */
function buildAppAuthLink(
  data: GenerateLinkResponse,
  type: AuthEmailLinkType,
  next: string
) {
  const tokenHash =
    data.hashed_token || data.properties?.hashed_token || null;

  if (tokenHash) {
    const url = new URL(`${getAppUrl()}${AUTH_ROUTES.callback}`);
    url.searchParams.set("token_hash", tokenHash);
    url.searchParams.set("type", type);
    url.searchParams.set("next", next);
    return url.toString();
  }

  const actionLink = data.action_link || data.properties?.action_link || null;
  if (!actionLink) return null;
  return actionLink;
}

export async function generateRecoveryLink(email: string) {
  const data = await authAdmin<GenerateLinkResponse>("/admin/generate_link", {
    method: "POST",
    body: JSON.stringify({
      type: "recovery",
      email,
      redirect_to: callbackUrl(AUTH_ROUTES.resetPassword),
    }),
  });
  const actionLink = buildAppAuthLink(
    data,
    "recovery",
    AUTH_ROUTES.resetPassword
  );
  if (!actionLink) throw new Error("Could not create password reset link.");
  return { actionLink, user: data.user };
}

export async function generateSignupLink(input: {
  email: string;
  password: string;
  fullName: string;
}) {
  const data = await authAdmin<GenerateLinkResponse>("/admin/generate_link", {
    method: "POST",
    body: JSON.stringify({
      type: "signup",
      email: input.email,
      password: input.password,
      data: { full_name: input.fullName },
      redirect_to: callbackUrl(AUTH_ROUTES.dashboard),
    }),
  });
  const actionLink = buildAppAuthLink(data, "signup", AUTH_ROUTES.dashboard);
  if (!actionLink) throw new Error("Could not create verification link.");
  return { actionLink, user: data.user };
}

/** Resend verification for an existing unconfirmed user. */
export async function generateMagicLink(email: string) {
  const data = await authAdmin<GenerateLinkResponse>("/admin/generate_link", {
    method: "POST",
    body: JSON.stringify({
      type: "magiclink",
      email,
      redirect_to: callbackUrl(AUTH_ROUTES.dashboard),
    }),
  });
  const actionLink = buildAppAuthLink(
    data,
    "magiclink",
    AUTH_ROUTES.dashboard
  );
  if (!actionLink) throw new Error("Could not create verification link.");
  return { actionLink, user: data.user };
}

export async function resolveUserDisplayName(
  email: string,
  fallbackName?: string
) {
  try {
    const { url } = getSupabaseEnv();
    const serviceRole = getServiceRole();
    const res = await fetch(
      `${url}/rest/v1/profiles?email=eq.${encodeURIComponent(email)}&select=full_name&limit=1`,
      {
        headers: {
          apikey: serviceRole,
          Authorization: `Bearer ${serviceRole}`,
        },
      }
    );
    const rows = (await res.json().catch(() => [])) as { full_name?: string }[];
    const fullName = rows?.[0]?.full_name || fallbackName || "";
    return {
      fullName,
      firstName: firstNameFrom(fullName, email),
    };
  } catch {
    return {
      fullName: fallbackName || "",
      firstName: firstNameFrom(fallbackName, email),
    };
  }
}
