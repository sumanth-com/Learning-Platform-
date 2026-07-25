import { notFound } from "next/navigation";
import { PortalChrome } from "@/components/portal/portal-chrome";
import { RetestCooldownPage } from "@/components/certifications/retest-cooldown-page";
import { getCertCardMeta } from "@/features/certifications/data/catalog";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ certId: string }>;
}) {
  const { certId } = await params;
  const meta = getCertCardMeta(certId);
  return {
    title: meta ? `Retest · ${meta.shortTitle}` : "Retest",
  };
}

export default async function CertificationRetestPage({
  params,
}: {
  params: Promise<{ certId: string }>;
}) {
  const { certId } = await params;
  const meta = getCertCardMeta(certId);
  if (!meta) notFound();

  return (
    <>
      <PortalChrome title={`${meta.shortTitle} · Retest`} fillViewport />
      <RetestCooldownPage meta={meta} />
    </>
  );
}
