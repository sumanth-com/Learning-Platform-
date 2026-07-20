import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { LessonForm } from "@/components/admin/forms/lesson-form";
import { getAdminContext } from "@/features/admin/lib/require-admin";
import { AdminLessonsService } from "@/features/admin/services/lessons.service";
import { AdminModulesService } from "@/features/admin/services/modules.service";

export default async function EditLessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ctx = await getAdminContext();
  if (!ctx.ok) return null;

  const [lesson, modules] = await Promise.all([
    new AdminLessonsService(ctx.supabase).getById(id),
    new AdminModulesService(ctx.supabase).listAll(),
  ]);
  if (!lesson) notFound();

  return (
    <div>
      <AdminPageHeader title="Edit lesson" description={lesson.title} />
      <LessonForm lesson={lesson} modules={modules} />
    </div>
  );
}
