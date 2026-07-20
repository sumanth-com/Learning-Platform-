import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { CourseForm } from "@/components/admin/forms/course-form";
import { getAdminContext } from "@/features/admin/lib/require-admin";
import { AdminCoursesService } from "@/features/admin/services/courses.service";

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ctx = await getAdminContext();
  if (!ctx.ok) return null;

  const course = await new AdminCoursesService(ctx.supabase).getById(id);
  if (!course) notFound();

  return (
    <div>
      <AdminPageHeader
        title="Edit course"
        description={course.title}
      />
      <CourseForm course={course} />
    </div>
  );
}
