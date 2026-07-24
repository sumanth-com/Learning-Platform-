import { CertLandingScreen } from "@/components/certifications/cert-flow-screens";
import { getCertification } from "@/features/certifications/data/catalog";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ certId: string }>;
}) {
  const { certId } = await params;
  const cert = getCertification(certId);
  return {
    title: cert ? cert.title : "Assessment",
  };
}

export default function CertificationLandingPage() {
  return <CertLandingScreen />;
}
