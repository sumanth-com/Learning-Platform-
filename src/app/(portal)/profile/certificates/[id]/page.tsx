import { PortalChrome } from "@/components/portal/portal-chrome";
import { CertificateShowcase } from "@/components/certifications/certificate-showcase";

export const metadata = {
  title: "Certificate",
};

export default async function ProfileCertificatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <>
      <PortalChrome title="Certificate" />
      <CertificateShowcase certificateId={id} />
    </>
  );
}
