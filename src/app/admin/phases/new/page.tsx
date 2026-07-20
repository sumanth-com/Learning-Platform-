import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { PhaseForm } from "@/components/admin/forms/phase-form";
import { getAdminContext } from "@/features/admin/lib/require-admin";
import { AdminCoursesService } from "@/features/admin/services/courses.service";

export default async function NewPhasePage() {
  const ctx = await getAdminContext();
  if (!ctx.ok) return null;
  const courses = await new AdminCoursesService(ctx.supabase).listAll();

  return (
    <div>
      <AdminPageHeader title="New phase" description="Add a phase to a course." />
      <PhaseForm courses={courses} />
    </div>
  );
}
