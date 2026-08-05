import type { Metadata } from "next";
import { StudentShell } from "@/components/portal/student-shell";
import { getPortalUser } from "@/features/portal/lib/get-portal-data";
import { redirect } from "next/navigation";
import { AUTH_ROUTES } from "@/features/auth/constants";
import { PRIVATE_ROBOTS } from "@/lib/seo";

export const metadata: Metadata = {
  robots: PRIVATE_ROBOTS,
};

/**
 * Persistent student chrome — Super Admin never enters this shell.
 * Only loads session user (not full journey) so navigations stay snappy.
 */
export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getPortalUser();

  if (user.role === "super_admin") {
    redirect(AUTH_ROUTES.admin);
  }

  return <StudentShell user={user}>{children}</StudentShell>;
}
