/**
 * Email + auth environment helpers.
 * Custom branded email requires RESEND_API_KEY + EMAIL_FROM + SUPABASE_SERVICE_ROLE_KEY.
 */

import { getAppUrl } from "@/lib/supabase/env";

function stripQuotes(value: string) {
  const t = value.trim();
  if (
    (t.startsWith('"') && t.endsWith('"')) ||
    (t.startsWith("'") && t.endsWith("'"))
  ) {
    return t.slice(1, -1);
  }
  return t;
}

export function getEmailEnv() {
  const apiKey = process.env.RESEND_API_KEY?.trim() || "";
  const from =
    stripQuotes(process.env.EMAIL_FROM || "") ||
    "SupraBase <onboarding@resend.dev>";
  const support =
    process.env.EMAIL_SUPPORT?.trim() || "support.suprabase@gmail.com";
  const replyTo = process.env.EMAIL_REPLY_TO?.trim() || support;

  return { apiKey, from, support, replyTo } as const;
}

export function isCustomEmailEnabled() {
  const { apiKey } = getEmailEnv();
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  return Boolean(apiKey && serviceRole);
}

export function getBrand() {
  const appUrl = getAppUrl();
  return {
    name: "Suprabase",
    appUrl,
    supportEmail: getEmailEnv().support,
    /**
     * Absolute production URL — email clients cannot load localhost icons.
     * Use 512 PNG served from the live app origin.
     */
    logoUrl: `${appUrl}/icons/icon-512.png`,
  } as const;
}

