import { ADMIN_ROUTES } from "@/features/admin/types";

export type AdminBreadcrumb = {
  label: string;
  href?: string;
};

const SEGMENT_LABELS: Record<string, string> = {
  admin: "Admin",
  courses: "Courses",
  phases: "Phases",
  modules: "Modules",
  lessons: "Lessons",
  assignments: "Assignments",
  resources: "Resources",
  students: "Students",
  analytics: "Analytics",
  settings: "Settings",
  new: "New",
  edit: "Edit",
};

/**
 * Builds breadcrumb trail from an /admin pathname.
 */
export function getAdminBreadcrumbs(pathname: string): AdminBreadcrumb[] {
  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] !== "admin") {
    return [{ label: "Admin", href: ADMIN_ROUTES.root }];
  }

  const crumbs: AdminBreadcrumb[] = [
    { label: "Admin", href: ADMIN_ROUTES.root },
  ];

  if (parts.length === 1) {
    crumbs.push({ label: "Dashboard" });
    return crumbs;
  }

  let href = "/admin";
  for (let i = 1; i < parts.length; i++) {
    const segment = parts[i];
    href += `/${segment}`;
    const isLast = i === parts.length - 1;
    const isId =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        segment
      );

    let label = SEGMENT_LABELS[segment];
    if (!label) {
      label = isId ? "Details" : segment;
    }

    crumbs.push({
      label,
      href: isLast ? undefined : href,
    });
  }

  return crumbs;
}

export function getAdminPageTitle(pathname: string): string {
  const crumbs = getAdminBreadcrumbs(pathname);
  return crumbs[crumbs.length - 1]?.label ?? "Admin";
}
