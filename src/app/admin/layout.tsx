import { redirect } from "next/navigation";
import { getAdminContext } from "@/features/admin/lib/require-admin";
import { AdminShell } from "@/components/admin/admin-shell";
import { AUTH_ROUTES } from "@/features/auth/constants";
import { ADMIN_ROUTES } from "@/features/admin/types";

/**
 * Admin Portal layout — role-gated, no student navigation.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ctx = await getAdminContext();

  if (!ctx.user) {
    redirect(`${AUTH_ROUTES.login}?next=/admin`);
  }

  if (!ctx.ok) {
    redirect(ADMIN_ROUTES.forbidden);
  }

  const profile = ctx.profile as {
    full_name?: string | null;
    email?: string;
    role?: string;
  } | null;

  const userName = profile?.full_name || profile?.email || null;
  const userRole = profile?.role ?? ctx.role;

  return (
    <AdminShell userName={userName} userRole={userRole}>
      {children}
    </AdminShell>
  );
}
