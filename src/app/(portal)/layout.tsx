import { StudentShell } from "@/components/portal/student-shell";
import { getPortalData } from "@/features/portal/lib/get-portal-data";

/**
 * Persistent student chrome — sidebar + header stay mounted across portal routes.
 */
export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await getPortalData();

  return <StudentShell data={data}>{children}</StudentShell>;
}
