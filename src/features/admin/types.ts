import type { UserRole } from "@/types/database";

export const ADMIN_ROUTES = {
  root: "/admin",
  students: "/admin/students",
  studentDetail: (id: string) => `/admin/students/${id}`,
  accessRequests: "/admin/access-requests",
  /** @deprecated Use accessRequests */
  seatRequests: "/admin/access-requests",
  learning: "/admin/learning",
  courses: "/admin/courses",
  courseNew: "/admin/courses/new",
  courseEdit: (id: string) => `/admin/courses/${id}/edit`,
  phases: "/admin/phases",
  phaseNew: "/admin/phases/new",
  phaseEdit: (id: string) => `/admin/phases/${id}/edit`,
  modules: "/admin/modules",
  moduleNew: "/admin/modules/new",
  moduleEdit: (id: string) => `/admin/modules/${id}/edit`,
  lessons: "/admin/lessons",
  lessonNew: "/admin/lessons/new",
  lessonEdit: (id: string) => `/admin/lessons/${id}/edit`,
  assignments: "/admin/assignments",
  assignmentNew: "/admin/assignments/new",
  assignmentEdit: (id: string) => `/admin/assignments/${id}/edit`,
  resources: "/admin/resources",
  resourceNew: "/admin/resources/new",
  resourceEdit: (id: string) => `/admin/resources/${id}/edit`,
  developerHub: "/admin/developer-hub",
  certifications: "/admin/certifications",
  submissions: "/admin/submissions",
  submissionDetail: (id: string) => `/admin/submissions/${id}`,
  analytics: "/admin/analytics",
  notifications: "/admin/notifications",
  settings: "/admin/settings",
  forbidden: "/forbidden",
} as const;

export const ADMIN_NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/students", label: "Students" },
  { href: "/admin/access-requests", label: "Access Requests" },
  { href: "/admin/learning", label: "Learning Management" },
  { href: "/admin/certifications", label: "Certifications" },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/notifications", label: "Notifications" },
  { href: "/admin/settings", label: "Settings" },
] as const;

export const ADMIN_PROTECTED_ROUTES = ["/admin"] as const;

export const ADMIN_ROLES: UserRole[] = ["super_admin"];

export function isAdminRole(role: UserRole | null | undefined): boolean {
  return role === "super_admin";
}

export const MODULE_ICON_OPTIONS = [
  "book-open",
  "code-2",
  "braces",
  "layout",
  "database",
  "server",
  "cpu",
  "sparkles",
  "terminal",
  "globe",
  "layers",
  "file-code",
] as const;

export const MODULE_COLOR_OPTIONS = [
  { value: "indigo", label: "Indigo", hex: "#6366f1" },
  { value: "blue", label: "Blue", hex: "#3b82f6" },
  { value: "cyan", label: "Cyan", hex: "#06b6d4" },
  { value: "emerald", label: "Emerald", hex: "#10b981" },
  { value: "amber", label: "Amber", hex: "#f59e0b" },
  { value: "rose", label: "Rose", hex: "#f43f5e" },
  { value: "violet", label: "Violet", hex: "#8b5cf6" },
  { value: "orange", label: "Orange", hex: "#f97316" },
] as const;

export const LESSON_RESOURCE_TYPES = [
  { value: "pdf", label: "PDF" },
  { value: "video", label: "Video" },
  { value: "article", label: "Article" },
  { value: "github", label: "GitHub" },
  { value: "docs", label: "Documentation" },
  { value: "other", label: "External Link" },
] as const;

export const ASSIGNMENT_RESOURCE_TYPES = [
  { value: "article", label: "Article" },
  { value: "docs", label: "Documentation" },
  { value: "video", label: "Video" },
  { value: "github", label: "GitHub" },
  { value: "figma", label: "Figma" },
  { value: "other", label: "External Link" },
] as const;

export type AdminListQuery = {
  q?: string;
  page?: number;
  pageSize?: number;
  sort?: string;
  order?: "asc" | "desc";
  filter?: string;
};

export type PaginatedResult<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type AdminStats = {
  courses: number;
  phases: number;
  modules: number;
  lessons: number;
  assignments: number;
  students: number;
  submissions: number;
};

export type BusinessOverview = {
  totalStudents: number;
  activeStudents: number;
  pendingRequests: number;
  approvedThisWeek: number;
  rejectedRequests: number;
  certificatesIssued: number;
  weeklyActiveUsers: number;
  monthlyActiveUsers: number;
  completionRate: number;
  revenue: null;
  recentSignups: Array<{
    id: string;
    full_name: string | null;
    email: string;
    created_at: string;
    avatar_url: string | null;
  }>;
  learningProgress: {
    completedLessons: number;
    totalProgressRows: number;
  };
};

export type AdminActionResult<T = undefined> =
  | { success: true; data?: T; message?: string }
  | { success: false; error: string };
