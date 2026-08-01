import { type NextRequest, NextResponse } from "next/server";

/**
 * Copy Set-Cookie headers from a session response onto another response.
 * Required whenever proxy creates a fresh redirect — otherwise refreshed
 * auth cookies never reach the browser and users bounce /login ↔ /dashboard.
 */
export function copyCookies(
  from: NextResponse,
  to: NextResponse
): NextResponse {
  from.cookies.getAll().forEach((cookie) => {
    to.cookies.set(cookie.name, cookie.value);
  });
  return to;
}

/** Redirect while preserving Supabase session cookies from updateSession. */
export function redirectWithSessionCookies(
  url: URL,
  sessionResponse: NextResponse
): NextResponse {
  return copyCookies(sessionResponse, NextResponse.redirect(url));
}

export function hasSupabaseAuthCookie(request: NextRequest) {
  return request.cookies
    .getAll()
    .some(
      (cookie) =>
        cookie.name.includes("-auth-token") ||
        (cookie.name.startsWith("sb-") && cookie.name.includes("auth"))
    );
}
