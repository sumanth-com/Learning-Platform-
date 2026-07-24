import { notFound } from "next/navigation";
import { CertProblemScreen } from "@/components/certifications/cert-flow-screens";
import { getCertification } from "@/features/certifications/data/catalog";
import { findQuestionBySlug } from "@/features/certifications/lib/paths";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ certId: string; slug: string }>;
}) {
  const { certId, slug } = await params;
  const cert = getCertification(certId);
  const found = cert ? findQuestionBySlug(cert, slug) : null;
  return {
    title: found?.question.title ?? "Problem",
  };
}

export default async function CertProblemPage({
  params,
  searchParams,
}: {
  params: Promise<{ certId: string; slug: string }>;
  searchParams: Promise<{ sample?: string }>;
}) {
  const { certId, slug } = await params;
  const { sample } = await searchParams;
  const cert = getCertification(certId);
  if (!cert) notFound();
  const found = findQuestionBySlug(cert, slug);
  if (!found) notFound();

  return (
    <CertProblemScreen
      question={found.question}
      index={found.index}
      sample={sample === "1"}
    />
  );
}
