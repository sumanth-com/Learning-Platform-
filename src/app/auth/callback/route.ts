import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { AUTH_ROUTES } from "@/features/auth/constants";
import { sendWelcomeEmail } from "@/lib/email/send";
import { firstNameFrom } from "@/lib/email/layout";
import { logAuthEvent } from "@/lib/auth/audit";

const OTP_TYPES = new Set<EmailOtpType>([
  "signup",
  "invite",
  "magiclink",
  "recovery",
  "email_change",
  "email",
]);

function resolveRedirectPath(next: string | null) {
  if (next && next.startsWith("/")) return next;
  return AUTH_ROUTES.dashboard;
}

async function maybeSendWelcome(
  redirectPath: string,
  supabase: Awaited<ReturnType<typeof createClient>>
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

/**
 * Handles email verification + password-recovery redirects.
 * Supports:
 * - PKCE `?code=`
 * - Custom Resend links `?token_hash=&type=` (verifyOtp)
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const typeParam = searchParams.get("type");
  const next = searchParams.get("next");
  const redirectPath = resolveRedirectPath(next);

  const supabase = await createClient();
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
    return NextResponse.redirect(`${origin}${redirectPath}`);
  }

  const loginUrl = new URL(AUTH_ROUTES.login, origin);
  loginUrl.searchParams.set("error", "auth_callback_failed");
  if (verifyError) {
    loginUrl.searchParams.set("reason", verifyError.slice(0, 80));
  }
  return NextResponse.redirect(loginUrl);
}
