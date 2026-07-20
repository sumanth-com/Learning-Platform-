import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { AUTH_ROUTES } from "@/features/auth/constants";

/**
 * Handles email verification + password-recovery redirects from Supabase.
 * Exchanges the auth code for a session, then redirects to `next`.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? AUTH_ROUTES.dashboard;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const redirectPath = next.startsWith("/") ? next : AUTH_ROUTES.dashboard;
      return NextResponse.redirect(`${origin}${redirectPath}`);
    }
  }

  const loginUrl = new URL(AUTH_ROUTES.login, origin);
  loginUrl.searchParams.set("error", "auth_callback_failed");
  return NextResponse.redirect(loginUrl);
}
