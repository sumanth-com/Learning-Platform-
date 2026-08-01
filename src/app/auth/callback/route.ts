import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { EmailOtpType } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { AUTH_ROUTES } from "@/features/auth/constants";
import { sendWelcomeEmail } from "@/lib/email/send";
import { firstNameFrom } from "@/lib/email/layout";
import { logAuthEvent } from "@/lib/auth/audit";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { safeInternalPath } from "@/lib/auth/session-response";

const OTP_TYPES = new Set<EmailOtpType>([
  "signup",
  "invite",
  "magiclink",
  "recovery",
  "email_change",
  "email",
]);

function resolveRedirectPath(next: string | null) {
  return safeInternalPath(next) ?? AUTH_ROUTES.dashboard;
}

type CookieToSet = {
  name: string;
  value: string;
  options?: Parameters<NextResponse["cookies"]["set"]>[2];
};

/**
 * Handles email verification + password-recovery redirects.
 * Session cookies are written onto the redirect response itself so they
 * survive the 302 on Vercel (cookies().set + separate redirect is unreliable).
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const typeParam = searchParams.get("type");
  const next = searchParams.get("next");
  const redirectPath = resolveRedirectPath(next);

  const cookieJar: CookieToSet[] = [];
  const { url, anonKey } = getSupabaseEnv();

  const supabase = createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieJar.push({ name, value, options });
          request.cookies.set(name, value);
        });
      },
    },
  });

  let verified = false;
  let verifyError: string | null = null;

  if (tokenHash && typeParam && OTP_TYPES.has(typeParam as EmailOtpType)) {
    const { error } = await supabase.auth.verifyOtp({
      type: typeParam as EmailOtpType,
      token_hash: tokenHash,
    });
    if (error) {
      verifyError = error.message;
      await logAuthEvent("login_failed", {
        action: "verify_otp",
        type: typeParam,
        error: error.message,
      });
    } else {
      verified = true;
    }
  } else if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      verifyError = error.message;
      await logAuthEvent("login_failed", {
        action: "exchange_code",
        error: error.message,
      });
    } else {
      verified = true;
    }
  } else {
    verifyError = "missing_code_or_token";
    await logAuthEvent("login_failed", {
      action: "auth_callback",
      error: verifyError,
      query: Object.fromEntries(searchParams.entries()),
    });
  }

  if (verified) {
    await maybeSendWelcome(redirectPath, supabase);
    await logAuthEvent("login_success", {
      action: "auth_callback",
      redirectPath,
      cookieCount: cookieJar.length,
    });
    const response = NextResponse.redirect(`${origin}${redirectPath}`);
    cookieJar.forEach(({ name, value, options }) => {
      response.cookies.set(name, value, options);
    });
    return response;
  }

  const loginUrl = new URL(AUTH_ROUTES.login, origin);
  loginUrl.searchParams.set("error", "auth_callback_failed");
  if (verifyError) {
    loginUrl.searchParams.set("reason", verifyError.slice(0, 80));
  }
  const fail = NextResponse.redirect(loginUrl);
  cookieJar.forEach(({ name, value, options }) => {
    fail.cookies.set(name, value, options);
  });
  return fail;
}

async function maybeSendWelcome(
  redirectPath: string,
  supabase: ReturnType<typeof createServerClient<Database>>
) {
  if (redirectPath === AUTH_ROUTES.resetPassword) return;

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user?.email) return;

    const fullName =
      (user.user_metadata?.full_name as string | undefined) ?? "";
    const createdAt = user.created_at ? new Date(user.created_at).getTime() : 0;
    const isFresh = Date.now() - createdAt < 1000 * 60 * 60 * 24;
    if (!isFresh) return;

    await sendWelcomeEmail({
      to: user.email,
      fullName,
      firstName: firstNameFrom(fullName, user.email),
    });
    await logAuthEvent("email_sent", {
      category: "post_verify_welcome",
      email: user.email,
    });
  } catch {
    /* non-blocking */
  }
}
