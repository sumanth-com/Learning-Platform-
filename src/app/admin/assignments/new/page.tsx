import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AssignmentForm } from "@/components/admin/forms/assignment-form";
import { getAdminContext } from "@/features/admin/lib/require-admin";
import { AdminLessonsService } from "@/features/admin/services/lessons.service";

export default async function NewAssignmentPage() {
  const ctx = await getAdminContext();
  if (!ctx.ok) return null;
  const lessons = await new AdminLessonsService(ctx.supabase).listAll();

  return (
    <div>
      <AdminPageHeader
        title="New assignment"
        description="Attach to a lesson and set marks / due days."
      />
      <AssignmentForm lessons={lessons} />
    </div>
  );
}
