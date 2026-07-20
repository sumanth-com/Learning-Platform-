export {
  ADMIN_ROUTES,
  ADMIN_PROTECTED_ROUTES,
  ADMIN_ROLES,
  ADMIN_NAV_ITEMS,
  isAdminRole,
} from "@/features/admin/types";

export { getAdminContext } from "@/features/admin/lib/require-admin";
export { slugify } from "@/features/admin/lib/slugify";
export {
  getAdminBreadcrumbs,
  getAdminPageTitle,
} from "@/features/admin/lib/breadcrumbs";

export { AdminStatsService } from "@/features/admin/services/stats.service";
export { AdminCoursesService } from "@/features/admin/services/courses.service";
export { AdminPhasesService } from "@/features/admin/services/phases.service";
export { AdminModulesService } from "@/features/admin/services/modules.service";
export { AdminLessonsService } from "@/features/admin/services/lessons.service";
export { AdminAssignmentsService } from "@/features/admin/services/assignments.service";
export { AdminResourcesService } from "@/features/admin/services/resources.service";
export { AdminStudentsService } from "@/features/admin/services/students.service";
