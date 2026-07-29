import { notFound } from "next/navigation";
import { PortalChrome } from "@/components/portal/portal-chrome";
import { CertSessionProvider } from "@/features/certifications/hooks/use-cert-session";
import { getCertification } from "@/features/certifications/data/catalog";
import { getCurrentUser } from "@/features/auth/actions/auth-actions";

export default async function CertificationFlowLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ certId: string }>;
}) {
  const { certId } = await params;
  const cert = getCertification(certId);
  if (!cert) notFound();

  const session = await getCurrentUser();
  const profileName =
    session?.profile?.full_name?.trim() ||
    session?.user?.email?.split("@")[0] ||
    "SupraBase Learner";

  return (
    <>
      <PortalChrome title={cert.title} fillViewport />
      <CertSessionProvider
        certification={cert}
        profileName={profileName}
        userId={session?.user?.id}
      >
        <div className="h-full min-h-0 overflow-hidden bg-background">
          {children}
        </div>
      </CertSessionProvider>
    </>
  );
}
