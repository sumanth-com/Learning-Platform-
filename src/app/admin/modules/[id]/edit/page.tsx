import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ModuleForm } from "@/components/admin/forms/module-form";
import { getAdminContext } from "@/features/admin/lib/require-admin";
import { AdminModulesService } from "@/features/admin/services/modules.service";
import { AdminPhasesService } from "@/features/admin/services/phases.service";

export default async function EditModulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ctx = await getAdminContext();
  if (!ctx.ok) return null;

  const [module, phases] = await Promise.all([
    new AdminModulesService(ctx.supabase).getById(id),
    new AdminPhasesService(ctx.supabase).listAll(),
  ]);
  if (!module) notFound();

  return (
    <div>
      <AdminPageHeader title="Edit module" description={module.title} />
      <ModuleForm module={module} phases={phases} />
    </div>
  );
}
