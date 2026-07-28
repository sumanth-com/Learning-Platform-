"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  Copy,
  Download,
  ExternalLink,
  Link2,
} from "lucide-react";
import { toast } from "sonner";
import { CertificateDocument } from "@/components/certifications/certificate-document";
import { findCertificateById } from "@/features/certifications/hooks/use-certifications";
import {
  getCertification,
  LEVEL_META,
} from "@/features/certifications/data/catalog";
import { printCertificateLandscape } from "@/features/certifications/lib/print-certificate";
import {
  certificateVerifyUrl,
  emailShareUrl,
  linkedInShareUrl,
  xShareUrl,
} from "@/features/certifications/lib/share";
import type { EarnedCertificate } from "@/features/certifications/types";
import { PORTAL_ROUTES } from "@/features/portal/types";

function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="min-w-0">
      <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
        {label}
      </p>
      <div className="mt-1.5 flex min-w-0 items-center gap-1 rounded-lg border border-[#ddd5c8] bg-[#f7f4ef] px-2 py-1.5 dark:border-border dark:bg-muted/40">
        <input
          readOnly
          value={value}
          className="min-w-0 flex-1 truncate bg-transparent text-[11px] text-foreground outline-none"
          onFocus={(e) => e.currentTarget.select()}
        />
        <button
          type="button"
          title="Copy"
          onClick={async () => {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            toast.success("Copied");
            window.setTimeout(() => setCopied(false), 1500);
          }}
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition hover:bg-[#ebe4d8] hover:text-foreground dark:hover:bg-muted"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-[#1f8f55]" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
    </div>
  );
}

export function CertificateShowcase({
  certificateId,
}: {
  certificateId: string;
}) {
  const router = useRouter();
  const [cert, setCert] = useState<EarnedCertificate | null | undefined>(
    undefined
  );

  useEffect(() => {
    setCert(findCertificateById(certificateId));
  }, [certificateId]);

  if (cert === undefined) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground">
        Loading certificate…
      </div>
    );
  }

  if (!cert) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-16 text-center">
        <p className="text-[16px] font-semibold text-foreground">
          Certificate not found
        </p>
        <p className="mt-2 text-[13px] text-muted-foreground">
          This credential isn’t saved on this device.
        </p>
        <button
          type="button"
          onClick={() => router.push(PORTAL_ROUTES.profile)}
          className="mt-5 text-[13px] font-medium text-[#1f8f55] underline underline-offset-4"
        >
          Back to profile
        </button>
      </div>
    );
  }

  const catalog = getCertification(cert.certificationId);
  const verifyUrl = certificateVerifyUrl(cert.id);
  const embedSnippet = `<iframe src="${verifyUrl}" width="100%" height="420" frameborder="0" allowfullscreen></iframe>`;
  const shortName = `${cert.technology} (${LEVEL_META[cert.level].label})`;

  const downloadPdf = async () => {
    try {
      toast.message("Preparing landscape PDF…");
      await printCertificateLandscape("certificate-print");
    } catch (err) {
      document.body.classList.add("printing-certificate");
      const cleanup = () => {
        document.body.classList.remove("printing-certificate");
        window.removeEventListener("afterprint", cleanup);
      };
      window.addEventListener("afterprint", cleanup);
      window.setTimeout(() => window.print(), 80);
      toast.message(
        err instanceof Error ? err.message : "Use landscape in the print dialog"
      );
    }
  };

  return (
    <div className="w-full text-foreground">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-4 pb-6 sm:gap-5">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <Link
              href={PORTAL_ROUTES.profile}
              className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground transition hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Profile
            </Link>
            <h1 className="mt-1 truncate text-[18px] font-semibold tracking-tight text-foreground sm:text-[20px]">
              {shortName}{" "}
              <span className="font-medium text-muted-foreground">
                Certificate
              </span>
            </h1>
          </div>
          <button
            type="button"
            onClick={() => void downloadPdf()}
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-[#27d17c] px-3.5 py-2 text-[12px] font-bold text-zinc-950 transition hover:bg-[#3ee08d] sm:px-4 sm:text-[13px]"
          >
            <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Download PDF
          </button>
        </header>

        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_310px] xl:grid-cols-[minmax(0,1fr)_330px]">
          {/* Certificate frame */}
          <div className="cert-print-area min-w-0">
            <div className="rounded-2xl border border-[#ddd5c8] bg-[#fdfbf7] p-3 sm:p-4 dark:border-border dark:bg-card">
              <CertificateDocument
                certificate={cert}
                id="certificate-print"
                className="!mx-auto !max-w-full !shadow-none"
              />
            </div>
          </div>

          {/* One solid side panel — clean edges, no split backside */}
          <aside className="cert-no-print min-w-0 lg:sticky lg:top-4">
            <div className="overflow-hidden rounded-2xl border border-[#ddd5c8] bg-[#fdfbf7] dark:border-border dark:bg-card">
              <div className="border-b border-[#ebe4d8] p-4 dark:border-border">
                <h2 className="flex items-center gap-2 text-[13px] font-semibold text-foreground">
                  <Link2 className="h-3.5 w-3.5 text-muted-foreground" />
                  Share this certificate
                </h2>
                <div className="mt-3 space-y-2.5">
                  <CopyField label="Public link" value={verifyUrl} />
                  <CopyField label="Embed" value={embedSnippet} />
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {[
                    { href: linkedInShareUrl(cert), label: "LinkedIn" },
                    { href: xShareUrl(cert), label: "X" },
                    { href: emailShareUrl(cert), label: "Email" },
                  ].map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      target={item.label === "Email" ? undefined : "_blank"}
                      rel={item.label === "Email" ? undefined : "noreferrer"}
                      className="rounded-md border border-[#ddd5c8] bg-white px-2.5 py-1.5 text-[11px] font-medium text-foreground transition hover:bg-[#f5f1ea] dark:border-border dark:bg-background dark:hover:bg-muted"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-[14px] font-semibold text-foreground">
                  {shortName}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                  {catalog?.description ??
                    `Verified skill credential for ${cert.technology} on SupraBase.`}
                </p>

                <dl className="mt-4 grid grid-cols-2 gap-2.5 text-[12px]">
                  <div className="rounded-lg border border-[#ebe4d8] bg-[#f7f4ef] px-2.5 py-2 dark:border-border dark:bg-muted/40">
                    <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">
                      Earned on
                    </dt>
                    <dd className="mt-0.5 font-medium text-foreground">
                      {new Date(cert.issuedAt).toLocaleDateString(undefined, {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </dd>
                  </div>
                  <div className="rounded-lg border border-[#ebe4d8] bg-[#f7f4ef] px-2.5 py-2 dark:border-border dark:bg-muted/40">
                    <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">
                      Score
                    </dt>
                    <dd className="mt-0.5 font-medium text-foreground">
                      {cert.score}%
                    </dd>
                  </div>
                  <div className="col-span-2 rounded-lg border border-[#ebe4d8] bg-[#f7f4ef] px-2.5 py-2 dark:border-border dark:bg-muted/40">
                    <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">
                      Certificate ID
                    </dt>
                    <dd className="mt-0.5 break-all font-mono text-[11px] text-foreground">
                      {cert.id}
                    </dd>
                  </div>
                </dl>

                <Link
                  href={`/verify/${cert.id}`}
                  className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-medium text-[#1f8f55] hover:underline"
                >
                  Open public verify page
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>

                <Link
                  href="/certifications"
                  className="mt-4 flex w-full items-center justify-center rounded-lg bg-[#27d17c] px-3 py-2.5 text-[12px] font-bold text-zinc-950 hover:bg-[#3ee08d]"
                >
                  Browse more certifications
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
