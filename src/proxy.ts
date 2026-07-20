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

function isPathMatch(pathname: string, routes: readonly string[]) {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

/**
 * Next.js 16 network boundary (formerly middleware.ts).
 * Refreshes the Supabase session and enforces auth + learning route rules.
 */
export async function proxy(request: NextRequest) {
  const { user, supabaseResponse } = await updateSession(request);
  const { pathname } = request.nextUrl;

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
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
