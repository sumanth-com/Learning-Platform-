import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ResourceForm } from "@/components/admin/forms/resource-form";
import { getAdminContext } from "@/features/admin/lib/require-admin";
import { AdminLessonsService } from "@/features/admin/services/lessons.service";
import { AdminAssignmentsService } from "@/features/admin/services/assignments.service";
import { AdminResourcesService } from "@/features/admin/services/resources.service";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function EditResourcePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: SearchParams;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const scope =
    typeof sp.scope === "string" && sp.scope === "assignment"
      ? "assignment"
      : "lesson";

  const ctx = await getAdminContext();
  if (!ctx.ok) return null;

  const resources = new AdminResourcesService(ctx.supabase);
  const [lessons, assignmentsResult, lessonRes, assignmentRes] =
    await Promise.all([
      new AdminLessonsService(ctx.supabase).listAll(),
      new AdminAssignmentsService(ctx.supabase).list({ pageSize: 100 }),
      scope === "lesson" ? resources.getLessonResource(id) : Promise.resolve(null),
      scope === "assignment"
        ? resources.getAssignmentResource(id)
        : Promise.resolve(null),
    ]);

  const row = scope === "lesson" ? lessonRes : assignmentRes;
  if (!row) notFound();

  const initial =
    scope === "lesson" && lessonRes
      ? {
          scope: "lesson" as const,
          parentId: lessonRes.lesson_id,
          title: lessonRes.title,
          type: lessonRes.type,
          url: lessonRes.url,
        }
      : assignmentRes
        ? {
            scope: "assignment" as const,
            parentId: assignmentRes.assignment_id,
            title: assignmentRes.title,
            type: assignmentRes.type,
            url: assignmentRes.url,
          }
        : null;

  if (!initial) notFound();

  return (
    <div>
      <AdminPageHeader title="Edit resource" description={initial.title} />
      <ResourceForm
        mode="edit"
        resourceId={id}
        initial={initial}
        lessons={lessons}
        assignments={assignmentsResult.items}
      />
    </div>
  );
}
