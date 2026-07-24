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
      <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        Verifying certificate…
      </div>
    );
  }

  if (!cert) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
        <Shield className="h-10 w-10 text-muted-foreground" />
        <h1 className="text-xl font-semibold">Certificate not found</h1>
        <p className="max-w-md text-sm text-muted-foreground">
          ID <span className="font-mono">{id}</span> is not in this browser&apos;s
          certificate store. Open the link on the device where it was earned, or
          ask the recipient to share a valid verification URL.
        </p>
        <Link href="/certifications" className="text-sm font-medium underline">
          Go to Certifications
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0C] px-4 py-10 text-foreground">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wider text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              Verified authentic
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">
              Certificate verification
            </h1>
          </div>
          <Link
            href="/certifications"
            className="rounded-xl border border-white/15 px-3 py-2 text-[13px] hover:bg-white/5"
          >
            SupraBase Certifications
          </Link>
        </div>

        <div className="mb-6 grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm sm:grid-cols-2">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-white/50">
              Recipient
            </p>
            <p className="font-medium">{cert.recipientName}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wide text-white/50">
              Technology
            </p>
            <p className="font-medium">{cert.technology}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wide text-white/50">
              Level
            </p>
            <p className="font-medium">{LEVEL_META[cert.level].label}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wide text-white/50">
              Issue date
            </p>
            <p className="font-medium">
              {new Date(cert.issuedAt).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wide text-white/50">
              Status
            </p>
            <p className="font-medium text-emerald-400">Valid</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wide text-white/50">
              Certificate ID
            </p>
            <p className="font-mono text-[12px]">{cert.id}</p>
          </div>
        </div>

        <CertificateDocument certificate={cert} />
      </div>
    </div>
  );
}
