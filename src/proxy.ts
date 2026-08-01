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
  if (pathname.startsWith("/images/")) return true;
  if (pathname.startsWith("/hub-brands/")) return true;
  return false;
}

function hasSupabaseAuthCookie(request: NextRequest) {
  return request.cookies
    .getAll()
    .some(
      (cookie) =>
        cookie.name.includes("-auth-token") ||
        (cookie.name.startsWith("sb-") && cookie.name.includes("auth"))
    );
}

/**
 * Next.js 16 network boundary (formerly middleware.ts).
 * Refreshes the Supabase session and enforces auth + learning route rules.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Fast path: marketing/static without a session cookie — skip Supabase getUser.
  if (isPublicFastPath(pathname) && !hasSupabaseAuthCookie(request)) {
    return NextResponse.next();
  }

  // Root: guests go straight to marketing without a second page-level auth call.
  if (pathname === "/" && !hasSupabaseAuthCookie(request)) {
    const url = request.nextUrl.clone();
    url.pathname = AUTH_ROUTES.public;
    return NextResponse.redirect(url);
  }

  const { user, supabaseResponse } = await updateSession(request);

  if (pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = user ? AUTH_ROUTES.dashboard : AUTH_ROUTES.public;
    url.search = "";
    return NextResponse.redirect(url);
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
    return NextResponse.redirect(loginUrl);
  }

  if (isGuestOnly && user) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = AUTH_ROUTES.dashboard;
    dashboardUrl.search = "";
    return NextResponse.redirect(dashboardUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static assets and Next internals.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|jfif|ico)$).*)",
  ],
};
