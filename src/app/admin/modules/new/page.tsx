import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ModuleForm } from "@/components/admin/forms/module-form";
import { getAdminContext } from "@/features/admin/lib/require-admin";
import { AdminPhasesService } from "@/features/admin/services/phases.service";

export default async function NewModulePage() {
  const ctx = await getAdminContext();
  if (!ctx.ok) return null;
  const phases = await new AdminPhasesService(ctx.supabase).listAll();

  return (
    <div>
      <AdminPageHeader title="New module" description="Assign to a phase." />
      <ModuleForm phases={phases} />
    </div>
  );
}
