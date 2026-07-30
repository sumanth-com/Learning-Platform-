import type { CourseJourney, ContinueLearningState } from "@/features/curriculum/types";
import { DEFAULT_COURSE_SLUG, CURRICULUM_ROUTES } from "@/features/curriculum/types";
import { AUTH_ROUTES } from "@/features/auth/constants";

export const PORTAL_SIDEBAR_WIDTH = 280;

export const PORTAL_ROUTES = {
  dashboard: AUTH_ROUTES.dashboard,
  roadmap: CURRICULUM_ROUTES.roadmap,
  learningPath: CURRICULUM_ROUTES.learn(DEFAULT_COURSE_SLUG),
  /** @deprecated Use learningPath */
  courses: CURRICULUM_ROUTES.learn(DEFAULT_COURSE_SLUG),
  projects: "/projects",
  assignments: "/assignments",
  aiMentor: "/ai-mentor",
  interview: "/interview",
  resources: "/resources",
  notes: "/notes",
  certifications: "/certifications",
  notifications: "/notifications",
  profile: AUTH_ROUTES.profile,
  settings: "/settings",
  help: "/help",
} as const;

export type PortalNavId =
  | "dashboard"
  | "roadmap"
  | "projects"
  | "assignments"
  | "ai-mentor"
  | "resources"
  | "notes"
  | "certifications"
  | "notifications"
  | "profile"
  | "settings";

export type PortalNavItem = {
  id: PortalNavId;
  label: string;
  href: string;
  match?: (pathname: string) => boolean;
};

export const PORTAL_NAV: PortalNavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: PORTAL_ROUTES.dashboard,
    match: (p) => p === "/dashboard",
  },
  {
    id: "roadmap",
    label: "Roadmap",
    href: PORTAL_ROUTES.roadmap,
    match: (p) =>
      p === "/roadmap" || p.startsWith("/module/") || p.startsWith("/learn"),
  },
  {
    id: "projects",
    label: "Projects",
    href: PORTAL_ROUTES.projects,
    match: (p) => p.startsWith("/projects"),
  },
  {
    id: "assignments",
    label: "Assignments",
    href: PORTAL_ROUTES.assignments,
    match: (p) => p.startsWith("/assignments") || p.startsWith("/assignment/"),
  },
  {
    id: "ai-mentor",
    label: "AI Mentor",
    href: PORTAL_ROUTES.aiMentor,
  },
  {
    id: "resources",
    label: "Dev Forge",
    href: PORTAL_ROUTES.resources,
  },
  {
    id: "notes",
    label: "Notes",
    href: PORTAL_ROUTES.notes,
    match: (p) => p.startsWith("/notes"),
  },
  {
    id: "certifications",
    label: "Certifications",
    href: PORTAL_ROUTES.certifications,
    match: (p) =>
      p.startsWith("/certifications") ||
      p.startsWith("/community") ||
      p.startsWith("/communication"),
  },
  {
    id: "notifications",
    label: "Notifications",
    href: PORTAL_ROUTES.notifications,
    match: (p) => p.startsWith("/notifications"),
  },
  {
    id: "profile",
    label: "Profile",
    href: PORTAL_ROUTES.profile,
    match: (p) => p === "/profile" || p.startsWith("/profile/"),
  },
  {
    id: "settings",
    label: "Settings",
    href: PORTAL_ROUTES.settings,
  },
];

export type PortalUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export type PortalData = {
  user: PortalUser;
  journey: CourseJourney | null;
  continueState: ContinueLearningState | null;
};
