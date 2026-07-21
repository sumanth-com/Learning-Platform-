import { getPortalData } from "@/features/portal/lib/get-portal-data";
import type { PortalData } from "@/features/portal/types";

type PortalPageProps = {
  title?: string;
  subtitle?: string;
  fillViewport?: boolean;
  children: React.ReactNode | ((data: PortalData) => React.ReactNode);
};

/**
 * @deprecated Prefer the persistent `(portal)/layout` + `PortalChrome`.
 * Kept as a thin data helper for pages that still need portal data in RSC.
 */
export async function PortalPage({ children }: PortalPageProps) {
  const data = await getPortalData();
  return typeof children === "function" ? children(data) : children;
}
