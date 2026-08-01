import { StudentShell } from "@/components/portal/student-shell";
import { getPortalData } from "@/features/portal/lib/get-portal-data";
import { redirect } from "next/navigation";
import { AUTH_ROUTES } from "@/features/auth/constants";

/**
 * Persistent student chrome — Super Admin never enters this shell.
 */
export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await getPortalData();

  if (data.user.role === "super_admin") {
    redirect(AUTH_ROUTES.admin);
  }

  return <StudentShell data={data}>{children}</StudentShell>;
}
