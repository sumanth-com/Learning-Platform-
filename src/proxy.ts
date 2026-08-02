import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import {
  AUTH_GUEST_ROUTES,
  AUTH_ROUTES,
  PROTECTED_ROUTES,
} from "@/features/auth/constants";
import { CURRICULUM_PROTECTED_ROUTES } from "@/features/curriculum/types";
import { ASSIGNMENT_PROTECTED_ROUTES } from "@/features/assignments/types";
import { ADMIN_PROTECTED_ROUTES } from "@/features/admin/types";
import { SITE_ROUTES } from "@/lib/site-routes";
import {
  hasSupabaseAuthCookie,
  redirectWithSessionCookies,
} from "@/lib/auth/session-response";

function isPathMatch(pathname: string, routes: readonly string[]) {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

/** Public marketing / legal / verify — no auth round-trip unless a session cookie exists. */
const PUBLIC_FAST_PATHS = new Set<string>([
  SITE_ROUTES.home,
  SITE_ROUTES.mentor,
  SITE_ROUTES.platform,
  SITE_ROUTES.certifications,
  SITE_ROUTES.stack,
  SITE_ROUTES.faq,
  SITE_ROUTES.journey,
  SITE_ROUTES.about,
  SITE_ROUTES.contact,
  SITE_ROUTES.manual,
  SITE_ROUTES.terms,
  SITE_ROUTES.privacy,
  "/robots.txt",
  "/sitemap.xml",
  "/manifest.json",
  "/sw.js",
  "/opengraph-image",
  "/twitter-image",
]);

function isPublicFastPath(pathname: string) {
  if (PUBLIC_FAST_PATHS.has(pathname)) return true;
  if (pathname.startsWith("/verify/")) return true;
  if (pathname.startsWith("/icons/")) return true;
  if (pathname.startsWith("/brand/")) return true;
  if (pathname.startsWith("/images/")) return true;
  if (pathname.startsWith("/hub-brands/")) return true;
  // Auth API routes manage their own cookies — do not refresh/redirect here.
  if (pathname === "/auth/sign-in" || pathname === "/auth/sign-out") return true;
  return false;
}

function logProxy(
  reason: string,
  meta: Record<string, unknown> = {}
) {
  console.info(
    "[auth-proxy]",
    JSON.stringify({ reason, at: new Date().toISOString(), ...meta })
  );
}

/**
 * Next.js 16 network boundary (formerly middleware.ts).
 * Refreshes the Supabase session and enforces auth + learning route rules.
 *
 * CRITICAL: every redirect must preserve cookies from updateSession.
 * Dropping them causes production-only /login ↔ /dashboard loops.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasCookie = hasSupabaseAuthCookie(request);

  try {
    // Fast path: marketing/static without a session cookie — skip Supabase getUser.
    if (isPublicFastPath(pathname) && !hasCookie) {
      return NextResponse.next();
    }

    // Root: guests go straight to marketing without a second page-level auth call.
    if (pathname === "/" && !hasCookie) {
      const url = request.nextUrl.clone();
      url.pathname = AUTH_ROUTES.public;
      return NextResponse.redirect(url);
    }

    const { user, supabaseResponse } = await updateSession(request);

    if (pathname === "/") {
      const url = request.nextUrl.clone();
      url.pathname = user ? AUTH_ROUTES.dashboard : AUTH_ROUTES.public;
      url.search = "";
      logProxy(user ? "root_to_dashboard" : "root_to_public", {
        pathname,
        hasCookie,
        userId: user?.id ?? null,
      });
      return redirectWithSessionCookies(url, supabaseResponse);
    }

    const protectedRoutes = [
      ...PROTECTED_ROUTES,
      ...CURRICULUM_PROTECTED_ROUTES,
      ...ASSIGNMENT_PROTECTED_ROUTES,
      ...ADMIN_PROTECTED_ROUTES,
    ];
    const isProtected = isPathMatch(pathname, protectedRoutes);
    const isGuestOnly = isPathMatch(pathname, AUTH_GUEST_ROUTES);

    if (isProtected && !user) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = AUTH_ROUTES.login;
      loginUrl.searchParams.set("next", pathname);
      logProxy("protected_requires_auth", {
        pathname,
        hasCookie,
        cookieNames: request.cookies
          .getAll()
          .map((c) => c.name)
          .filter((n) => n.includes("sb-") || n.includes("auth")),
      });
      return redirectWithSessionCookies(loginUrl, supabaseResponse);
    }

    if (isGuestOnly && user) {
      const dashboardUrl = request.nextUrl.clone();
      dashboardUrl.pathname = AUTH_ROUTES.dashboard;
      dashboardUrl.search = "";
      logProxy("guest_route_already_authed", {
        pathname,
        userId: user.id,
        to: AUTH_ROUTES.dashboard,
      });
      return redirectWithSessionCookies(dashboardUrl, supabaseResponse);
    }

    return supabaseResponse;
  } catch (error) {
    console.error("[auth-proxy] unexpected failure", pathname, error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static assets and Next internals.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|jfif|ico)$).*)",
  ],
};
