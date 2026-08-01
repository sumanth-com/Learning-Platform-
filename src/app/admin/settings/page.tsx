import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminSettingsWorkspace } from "@/components/admin/admin-settings-workspace";
import { getAdminContext } from "@/features/admin/lib/require-admin";
import { AdminSystemService } from "@/features/admin/services/system.service";

export const metadata = {
  title: "Settings",
};

export default async function AdminSettingsPage() {
  const ctx = await getAdminContext();
  if (!ctx.ok) return null;

  const profile = ctx.profile as {
    full_name?: string | null;
    email?: string;
    role?: string;
  } | null;

  const health = await new AdminSystemService(ctx.supabase).getSystemHealth();

  return (
    <div>
      <AdminPageHeader
        title="Settings"
        description="Appearance, security, database health, integrations, and platform controls."
      />
      <AdminSettingsWorkspace
        email={profile?.email || ""}
        fullName={profile?.full_name ?? undefined}
        role={profile?.role || ctx.role || "super_admin"}
        health={health}
      />
    </div>
  );
}
