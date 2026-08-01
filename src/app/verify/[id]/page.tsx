import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import type { SupabaseClient } from "@supabase/supabase-js";
import logoMark from "@/assets/Logo.png";
import { CertificateDocument } from "@/components/certifications/certificate-document";
import { JsonLd } from "@/components/seo/json-ld";
import type { EarnedCertificate } from "@/features/certifications/types";
import { createClient } from "@/lib/supabase/server";
import type { PublicCertificateRow } from "@/types/database";
import { buildPageMetadata } from "@/lib/seo";
import {
  educationalCredentialSchema,
  graphSchema,
  organizationSchema,
} from "@/lib/seo-schema";
import { SITE_ROUTES } from "@/lib/site-routes";

export const dynamic = "force-dynamic";

async function loadCertificate(id: string) {
  const supabase = await createClient();
  const { data, error } = await (
    supabase as unknown as SupabaseClient
  ).rpc("verify_certificate", {
    cert_id: decodeURIComponent(id),
  });
  const row = !error ? (data?.[0] as PublicCertificateRow | undefined) : null;
  if (!row) return null;
  return {
    id: row.id,
    certificationId: row.certification_id,
    recipientName: row.recipient_name,
    issuedAt: row.issued_at,
    score: row.score,
    level: row.level,
    technology: row.technology,
    title: row.title,
    verifyPath: `/verify/${encodeURIComponent(row.id)}`,
  } satisfies EarnedCertificate;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const cert = await loadCertificate(id);
  if (!cert) {
    return buildPageMetadata({
      title: "Credential Not Found",
      description:
        "This Suprabase credential could not be verified. It may be invalid, revoked, or not yet published.",
      path: `/verify/${encodeURIComponent(id)}`,
      noIndex: true,
    });
  }

  return buildPageMetadata({
    title: `${cert.title} — Verified Credential`,
    description: `Verified ${cert.title} credential for ${cert.recipientName}. Issued by Suprabase — confirm authenticity without an account.`,
    path: cert.verifyPath,
    keywords: [
      "developer certification",
      "programming certification",
      "verifiable credential",
      cert.technology,
    ],
  });
}

export default async function VerifyCertificatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cert = await loadCertificate(id);

  if (!cert) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-[#f7f4ef] px-4 py-10 text-[#1c1917]">
        <div className="w-full max-w-md rounded-[1.75rem] border border-[#ded6ca] bg-[#fdfbf7] p-7 text-center shadow-[0_20px_70px_-45px_rgba(28,25,23,0.45)] sm:p-9">
          <Image
            src={logoMark}
            alt="Suprabase"
            width={48}
            height={48}
            className="mx-auto rounded-xl"
            priority
          />
          <ShieldCheck className="mx-auto mt-6 h-9 w-9 text-[#78716c]" aria-hidden />
          <h1 className="mt-4 text-xl font-semibold">Credential not found</h1>
          <p className="mx-auto mt-2 max-w-sm text-[13px] leading-relaxed text-[#57534e]">
            We could not verify this credential. It may be invalid, revoked, or
            not yet published.
          </p>
          <div className="mt-5 rounded-xl border border-[#e4ddd2] bg-white px-3 py-2.5">
            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#78716c]">
              Credential ID
            </p>
            <p className="mt-1 break-all font-mono text-[11px] font-semibold">
              {decodeURIComponent(id)}
            </p>
          </div>
          <Link
            href={SITE_ROUTES.home}
            className="mt-6 inline-flex text-[13px] font-semibold underline underline-offset-4"
          >
            Visit Suprabase
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-[#f7f4ef] text-[#1c1917]">
      <JsonLd
        data={graphSchema([
          organizationSchema(),
          educationalCredentialSchema({
            name: cert.title,
            description: `Verified ${cert.title} credential for ${cert.recipientName}.`,
            credentialId: cert.id,
            recipientName: cert.recipientName,
            dateIssued: cert.issuedAt,
            url: cert.verifyPath,
          }),
        ])}
      />
      <header className="border-b border-[#e4ddd2] bg-[#fdfbf7]/95">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <Image
              src={logoMark}
              alt="Suprabase"
              width={34}
              height={34}
              className="rounded-lg"
              priority
            />
            <div>
              <p className="text-[13px] font-semibold leading-none">Suprabase</p>
              <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#78716c]">
                Credential verification
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-800">
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
            Verified
          </span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1440px] p-3 sm:p-5">
        <section className="overflow-hidden rounded-[1.5rem] border border-[#d7cfc2] bg-white shadow-[0_20px_70px_-50px_rgba(28,25,23,0.45)]">
          <div className="border-b border-[#ebe4d8] bg-[#fdfbf7] px-5 py-5 sm:px-7">
            <p className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-700">
              <ShieldCheck className="h-4 w-4" aria-hidden />
              Authentic credential
            </p>
            <h1 className="mt-2 text-[22px] font-semibold tracking-tight sm:text-[27px]">
              {cert.recipientName}
            </h1>
            <p className="mt-1 text-[13px] leading-relaxed text-[#57534e]">
              Successfully earned the{" "}
              <span className="font-semibold text-[#1c1917]">{cert.title}</span>{" "}
              skill credential.
            </p>
          </div>

          <dl className="grid grid-cols-2 border-b border-[#ebe4d8] px-5 py-2 sm:grid-cols-4 sm:px-7">
            <MetaRow label="Status" value="Verified · Active" />
            <MetaRow
              label="Issued"
              value={new Date(cert.issuedAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            />
            <MetaRow label="Score" value={`${cert.score}%`} />
            <MetaRow
              label="Credential ID"
              value={cert.id}
              mono
            />
          </dl>

          <div className="bg-[#f7f4ef] p-2.5 sm:p-5">
            <CertificateDocument
              certificate={cert}
              className="!mx-auto !max-w-5xl !shadow-none"
            />
          </div>
        </section>
        <p className="px-3 py-5 text-center text-[11px] leading-relaxed text-[#78716c]">
          This page confirms that the credential ID above is valid and was
          issued by Suprabase to the named recipient.
        </p>
      </main>
    </div>
  );
}

function MetaRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="min-w-0 py-3 pr-3 sm:pr-5">
      <dt className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#78716c]">
        {label}
      </dt>
      <dd
        className={`mt-1 min-w-0 text-[12px] font-semibold text-[#1c1917] ${
          mono ? "break-all font-mono text-[9.5px]" : "truncate"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}
