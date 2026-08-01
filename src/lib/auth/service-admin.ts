import { createHash, randomBytes } from "crypto";
import { getSupabaseEnv } from "@/lib/supabase/env";

function getServiceRole() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!key) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY.");
  }
  return key;
}

/** Service-role REST helper (no realtime / WebSocket). */
export async function serviceRest<T = unknown>(
  path: string,
  init?: RequestInit & { prefer?: string }
): Promise<T> {
  const { url } = getSupabaseEnv();
  const serviceRole = getServiceRole();
  const prefer = init?.prefer;
  const res = await fetch(`${url}/rest/v1${path}`, {
    ...init,
    headers: {
      apikey: serviceRole,
      Authorization: `Bearer ${serviceRole}`,
      "Content-Type": "application/json",
      Prefer: prefer ?? "return=representation",
      ...(init?.headers ?? {}),
    },
  });
  if (res.status === 204) return undefined as T;
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      (body as { message?: string; error?: string })?.message ||
      (body as { error?: string })?.error ||
      `REST error ${res.status}`;
    throw new Error(message);
  }
  return body as T;
}

export async function authAdminApi<T = Record<string, unknown>>(
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

export function hashInviteToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function generateInviteToken() {
  return randomBytes(32).toString("base64url");
}

export function generateTempPassword() {
  return `${randomBytes(24).toString("base64url")}Aa1!`;
}
