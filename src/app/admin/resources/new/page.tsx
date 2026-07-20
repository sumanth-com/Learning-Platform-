import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ResourceForm } from "@/components/admin/forms/resource-form";
import { getAdminContext } from "@/features/admin/lib/require-admin";
import { AdminLessonsService } from "@/features/admin/services/lessons.service";
import { AdminAssignmentsService } from "@/features/admin/services/assignments.service";

export default async function NewResourcePage() {
  const ctx = await getAdminContext();
  if (!ctx.ok) return null;

  const [lessons, assignmentsResult] = await Promise.all([
    new AdminLessonsService(ctx.supabase).listAll(),
    new AdminAssignmentsService(ctx.supabase).list({ pageSize: 100 }),
  ]);

  return (
    <div>
      <AdminPageHeader
        title="New resource"
        description="Attach a PDF, video, article, GitHub, docs, or external link."
      />
      <ResourceForm
        lessons={lessons}
        assignments={assignmentsResult.items}
      />
    </div>
  );
}
