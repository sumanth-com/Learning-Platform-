import { getPortalData } from "@/features/portal/lib/get-portal-data";
import { StudentShell } from "@/components/portal/student-shell";
import type { PortalData } from "@/features/portal/types";

type PortalPageProps = {
  title?: string;
  subtitle?: string;
  children: React.ReactNode | ((data: PortalData) => React.ReactNode);
};

/**
 * Server wrapper — loads portal data and renders the student application chrome.
 */
export async function PortalPage({
  title,
  subtitle,
  children,
}: PortalPageProps) {
  const data = await getPortalData();

  return (
    <StudentShell data={data} title={title} subtitle={subtitle}>
      {typeof children === "function" ? children(data) : children}
    </StudentShell>
  );
}
