import { PORTAL_ROUTES } from "@/features/portal/types";

export type MobileBottomNavId =
  | "home"
  | "learn"
  | "mentor"
  | "certs"
  | "profile";

export type MobileBottomNavItem = {
  id: MobileBottomNavId;
  label: string;
  href: string;
  match: (pathname: string) => boolean;
};

/** Compact companion nav — 5 items only. */
export const MOBILE_BOTTOM_NAV: MobileBottomNavItem[] = [
  {
    id: "home",
    label: "Home",
    href: PORTAL_ROUTES.dashboard,
    match: (p) => p === "/dashboard",
  },
  {
    id: "learn",
    label: "Learn",
    href: PORTAL_ROUTES.roadmap,
    match: (p) =>
      p === "/roadmap" ||
      p.startsWith("/module/") ||
      p.startsWith("/learn") ||
      p.startsWith("/lesson/"),
  },
  {
    id: "mentor",
    label: "AI Mentor",
    href: PORTAL_ROUTES.aiMentor,
    match: (p) => p.startsWith("/ai-mentor"),
  },
  {
    id: "certs",
    label: "Certs",
    href: PORTAL_ROUTES.certifications,
    match: (p) =>
      p === "/certifications" ||
      p.startsWith("/certifications/") ||
      p.startsWith("/profile/certificates"),
  },
  {
    id: "profile",
    label: "Profile",
    href: PORTAL_ROUTES.profile,
    match: (p) =>
      p === "/profile" ||
      p.startsWith("/settings") ||
      p.startsWith("/help"),
  },
];

/** How many roadmap modules stay open on companion mobile (1-indexed count). */
export const MOBILE_LEARN_MODULE_LIMIT = 2;

/** Module slugs for the first N learn modules — must stay in roadmap order. */
export const MOBILE_LEARN_MODULE_SLUGS = [
  "programming-fundamentals",
  "developer-tooling",
] as const;

export function isMobileAllowedLearnModuleSlug(
  slug: string | null | undefined
): boolean {
  if (!slug) return false;
  return (MOBILE_LEARN_MODULE_SLUGS as readonly string[]).includes(slug);
}

/**
 * Routes that should show the Continue-on-Desktop companion gate on small screens.
 * Cert browse/earned stay open; exam/coding sessions are gated separately via UI wrappers.
 */
export function isDesktopOnlyPath(pathname: string): boolean {
  if (pathname.startsWith("/projects")) return true;
  if (pathname.startsWith("/assignments") || pathname.startsWith("/assignment/"))
    return true;
  // Standalone + in-module challenge solve workspaces
  if (pathname.startsWith("/challenge/") || pathname.includes("/challenge/"))
    return true;
  if (pathname.startsWith("/notes")) return true;
  if (pathname.startsWith("/interview")) return true;
  if (pathname === "/practice" || pathname.startsWith("/practice/")) return true;

  // Learn modules beyond 1–2 (hub + nested routes)
  const moduleSlug = pathname.match(/^\/module\/([^/]+)/)?.[1];
  if (moduleSlug && !isMobileAllowedLearnModuleSlug(moduleSlug)) return true;

  // Certification exam / coding flow (not list, certificate view, or results share)
  if (pathname.startsWith("/certifications/")) {
    // Per-cert landing (start assessment) — companion uses list + desktop message
    if (/^\/certifications\/[^/]+\/?$/.test(pathname)) return true;
    if (pathname.includes("/problems/")) return true;
    if (/\/certifications\/[^/]+\/(lobby|ready|honor|confirm|brief|plan)\/?$/.test(pathname))
      return true;
    if (/\/certifications\/retest\//.test(pathname)) return true;
  }

  return false;
}

/** Hide bottom nav on deep lab / exam sessions; keep it on list-level gates. */
export function shouldHideBottomNav(pathname: string): boolean {
  if (!isDesktopOnlyPath(pathname)) return false;

  // Companion stays navigable on top-level desktop-only hubs
  if (
    pathname === "/projects" ||
    pathname === "/assignments" ||
    pathname === "/notes" ||
    pathname === "/interview" ||
    pathname === "/practice"
  ) {
    return false;
  }

  // Cert landing interstitial — keep companion nav visible
  if (/^\/certifications\/[^/]+\/?$/.test(pathname)) return false;

  // Module hub desktop-only interstitial — keep companion nav visible
  if (/^\/module\/[^/]+/.test(pathname) && !pathname.includes("/challenge/"))
    return false;

  return true;
}
