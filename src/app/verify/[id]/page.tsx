"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Shield } from "lucide-react";
import { CertificateDocument } from "@/components/certifications/certificate-document";
import { findCertificateById } from "@/features/certifications/hooks/use-certifications";
import { LEVEL_META } from "@/features/certifications/data/catalog";
import type { EarnedCertificate } from "@/features/certifications/types";

export default function VerifyCertificatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [cert, setCert] = useState<EarnedCertificate | null | undefined>(
    undefined
  );

  useEffect(() => {
    setCert(findCertificateById(id));
  }, [id]);

  if (cert === undefined) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-[#f7f4ef] text-sm text-[#57534e]">
        Verifying certificate…
      </div>
    );
  }

  if (!cert) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 bg-[#f7f4ef] px-4 text-center text-[#1c1917]">
        <Shield className="h-10 w-10 text-[#78716c]" />
        <h1 className="text-xl font-semibold">Certificate not found</h1>
        <p className="max-w-md text-sm text-[#57534e]">
          ID <span className="font-mono">{id}</span> is not in this browser&apos;s
          certificate store. Open the link on the device where it was earned, or
          ask the recipient to share a valid verification URL.
        </p>
        <Link
          href="/certifications"
          className="text-sm font-medium text-[#1c1917] underline underline-offset-4"
        >
          Go to Certifications
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-[#f7f4ef] text-[#1c1917]">
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-[#e4ddd2] bg-[#fdfbf7]/90 px-4 py-3 backdrop-blur sm:px-6">
        <div className="min-w-0">
          <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Verified authentic
          </p>
          <h1 className="mt-0.5 text-[17px] font-semibold tracking-tight text-[#1c1917] sm:text-[19px]">
            Certificate verification
          </h1>
        </div>
        <Link
          href="/certifications"
          className="rounded-xl border border-[#d7cfc2] bg-white px-3 py-2 text-[12px] font-medium text-[#1c1917] shadow-sm transition hover:bg-[#f7f4ef]"
        >
          SupraBase Certifications
        </Link>
      </header>

      <div className="mx-auto grid min-h-0 w-full max-w-[1440px] flex-1 grid-cols-1 gap-4 p-3 sm:p-4 lg:grid-cols-[320px_minmax(0,1fr)] xl:grid-cols-[340px_minmax(0,1fr)]">
        {/* Left — details */}
        <aside className="flex min-h-0 flex-col overflow-hidden rounded-[1.5rem] border border-[#d7cfc2] bg-white">
          <div className="border-b border-[#ebe4d8] px-4 py-3.5">
            <h2 className="text-[14px] font-semibold text-[#1c1917]">
              {cert.technology} ({LEVEL_META[cert.level].label})
            </h2>
            <p className="mt-1 text-[12px] leading-relaxed text-[#57534e]">
              Verified skill credential issued by SupraBase.
            </p>
          </div>

          <dl className="min-h-0 flex-1 space-y-0 overflow-y-auto p-3.5">
            <MetaRow label="Recipient" value={cert.recipientName} />
            <MetaRow label="Technology" value={cert.technology} />
            <MetaRow label="Level" value={LEVEL_META[cert.level].label} />
            <MetaRow
              label="Issue date"
              value={new Date(cert.issuedAt).toLocaleDateString(undefined, {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            />
            <MetaRow label="Status" value="Valid" />
            {typeof cert.score === "number" ? (
              <MetaRow label="Score" value={`${cert.score}%`} />
            ) : null}
            <MetaRow
              label="Certificate ID"
              value={cert.id}
              mono
            />
          </dl>

          <div className="border-t border-[#ebe4d8] p-3.5">
            <Link
              href="/certifications"
              className="flex w-full items-center justify-center rounded-xl bg-primary px-3 py-2.5 text-[12px] font-bold text-primary-foreground transition hover:bg-primary/90"
            >
              Browse more certifications
            </Link>
          </div>
        </aside>

        {/* Right — certificate */}
        <section className="flex min-h-0 min-w-0 items-center justify-center overflow-hidden rounded-[1.5rem] border border-[#d7cfc2] bg-[#fdfbf7] p-2.5 sm:p-3">
          <div className="flex h-full w-full max-w-full items-center justify-center">
            <div className="w-full max-w-[min(100%,calc((100dvh-7.5rem)*1.414))]">
              <CertificateDocument
                certificate={cert}
                className="!mx-auto !max-w-full !rounded-[1.15rem] !shadow-none"
              />
            </div>
          </div>
        </section>
      </div>
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
    <div className="flex items-baseline justify-between gap-3 border-b border-[#ebe4d8] py-2.5 last:border-b-0">
      <dt className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#78716c]">
        {label}
      </dt>
      <dd
        className={`min-w-0 text-right text-[13px] font-medium text-[#1c1917] ${
          mono ? "break-all font-mono text-[11px]" : "truncate"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}
