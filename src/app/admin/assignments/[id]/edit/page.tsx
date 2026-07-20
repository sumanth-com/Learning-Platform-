import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AssignmentForm } from "@/components/admin/forms/assignment-form";
import { getAdminContext } from "@/features/admin/lib/require-admin";
import { AdminAssignmentsService } from "@/features/admin/services/assignments.service";
import { AdminLessonsService } from "@/features/admin/services/lessons.service";

export default async function EditAssignmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ctx = await getAdminContext();
  if (!ctx.ok) return null;

  const [assignment, lessons] = await Promise.all([
    new AdminAssignmentsService(ctx.supabase).getById(id),
    new AdminLessonsService(ctx.supabase).listAll(),
  ]);
  if (!assignment) notFound();

  return (
    <div>
      <AdminPageHeader
        title="Edit assignment"
        description={assignment.title}
      />
      <AssignmentForm assignment={assignment} lessons={lessons} />
    </div>
  );
}
