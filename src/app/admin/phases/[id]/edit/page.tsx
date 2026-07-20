import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { PhaseForm } from "@/components/admin/forms/phase-form";
import { getAdminContext } from "@/features/admin/lib/require-admin";
import { AdminCoursesService } from "@/features/admin/services/courses.service";
import { AdminPhasesService } from "@/features/admin/services/phases.service";

export default async function EditPhasePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ctx = await getAdminContext();
  if (!ctx.ok) return null;

  const [phase, courses] = await Promise.all([
    new AdminPhasesService(ctx.supabase).getById(id),
    new AdminCoursesService(ctx.supabase).listAll(),
  ]);
  if (!phase) notFound();

  return (
    <div>
      <AdminPageHeader title="Edit phase" description={phase.title} />
      <PhaseForm phase={phase} courses={courses} />
    </div>
  );
}
