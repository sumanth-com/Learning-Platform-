import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { LessonForm } from "@/components/admin/forms/lesson-form";
import { getAdminContext } from "@/features/admin/lib/require-admin";
import { AdminModulesService } from "@/features/admin/services/modules.service";

export default async function NewLessonPage() {
  const ctx = await getAdminContext();
  if (!ctx.ok) return null;
  const modules = await new AdminModulesService(ctx.supabase).listAll();

  return (
    <div>
      <AdminPageHeader
        title="New lesson"
        description="Write content with the rich text editor."
      />
      <LessonForm modules={modules} />
    </div>
  );
}
