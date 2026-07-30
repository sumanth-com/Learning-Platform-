"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Download,
  ExternalLink,
  FileText,
  Sparkles,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { CertificateDocument } from "@/components/certifications/certificate-document";
import { issueCertificateAction } from "@/features/certifications/actions/certificate-actions";
import {
  formatNotificationDate,
  type AppNotification,
} from "@/lib/notifications";
import { CERT_FLOW } from "@/features/certifications/lib/paths";
import {
  cacheIssuedCertificate,
  findCertificateById,
  listPublicCertificates,
} from "@/features/certifications/hooks/use-certifications";
import { printCertificateLandscape } from "@/features/certifications/lib/print-certificate";
import type { EarnedCertificate } from "@/features/certifications/types";
import { PORTAL_ROUTES } from "@/features/portal/types";
import { cn } from "@/lib/utils";

type Recipient = { name: string; email: string };

function certTitleFromItem(item: AppNotification, fallback = "certification") {
  if (item.meta?.certTitle?.trim()) return item.meta.certTitle.trim();
  const fromSubject = item.title
    .replace(/^your\s+/i, "")
    .replace(/\s+certificate\s+is\s+ready$/i, "")
    .replace(/^you\s+passed\s+the\s+/i, "")
    .replace(/\s+certification\s+test$/i, "")
    .trim();
  if (
    fromSubject &&
    !/^certificate is ready$/i.test(fromSubject) &&
    fromSubject.toLowerCase() !== "certificate"
  ) {
    return fromSubject;
  }
  return fallback;
}

function Greeting({ name }: { name: string }) {
  return (
    <p className="text-[15px] leading-relaxed text-foreground">
      Hi {name.split(" ")[0] || name},
    </p>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-b border-border/60 py-2.5 last:border-b-0">
      <dt className="shrink-0 text-[13px] text-muted-foreground">{label}</dt>
      <dd className="min-w-0 truncate text-right text-[13px] font-medium tracking-tight text-foreground">
        {value}
      </dd>
    </div>
  );
}

function PrimaryAction({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-[13px] font-semibold text-primary-foreground transition hover:opacity-90"
    >
      {label}
      <ExternalLink className="h-3.5 w-3.5 opacity-80" />
    </Link>
  );
}

function SecondaryAction({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-[13px] font-medium text-foreground transition hover:bg-muted"
    >
      {label}
    </Link>
  );
}

function NextSteps({ items }: { items: string[] }) {
  return (
    <div className="rounded-xl border border-border/70 bg-muted/40 px-4 py-4">
      <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        <Sparkles className="h-3.5 w-3.5" />
        What you can do next
      </p>
      <ul className="mt-3 space-y-2.5">
        {items.map((item) => (
          <li
            key={item}
            className="flex gap-2.5 text-[13.5px] leading-relaxed text-foreground/80"
          >
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Attachment({
  label,
  onDownload,
  className,
}: {
  label: string;
  onDownload?: () => void;
  className?: string;
}) {
  const content = (
    <>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/60 text-muted-foreground">
        <FileText className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1 text-left">
        <p className="truncate text-[13px] font-medium text-foreground">
          {label}
        </p>
        <p className="mt-0.5 text-[12px] text-muted-foreground">
          PDF · generated on download
        </p>
      </div>
      <Download className="h-4 w-4 shrink-0 text-muted-foreground" />
    </>
  );

  const base = cn(
    "flex items-center gap-3 rounded-xl border border-border bg-background px-3.5 py-2.5",
    className
  );

  if (onDownload) {
    return (
      <button
        type="button"
        onClick={onDownload}
        className={cn(base, "transition hover:border-foreground/25 hover:bg-muted/40")}
      >
        {content}
      </button>
    );
  }

  return <div className={base}>{content}</div>;
}

function Signature() {
  return (
    <div className="space-y-1 border-t border-border/60 pt-5">
      <p className="text-[13.5px] leading-relaxed text-muted-foreground">
        Keep building — we’re rooting for you.
      </p>
      <p className="text-[13.5px] font-semibold text-foreground">
        The SupraBase Certifications Team
      </p>
    </div>
  );
}

function CertPassedBody({
  item,
  recipient,
}: {
  item: AppNotification;
  recipient: Recipient;
}) {
  const title = certTitleFromItem(item);
  const score = item.meta?.score;
  const passing = item.meta?.passingScore ?? 70;
  const certId = item.meta?.certificationId;

  return (
    <>
      <Greeting name={item.meta?.recipientName || recipient.name} />

      <p className="text-[15px] leading-[1.7] text-foreground/80">
        Congratulations — you cleared the{" "}
        <span className="font-semibold text-foreground">{title}</span> Skills
        Certification Test. Your submission met the passing criteria and is
        ready for certificate issuance.
      </p>

      <div className="rounded-xl border border-border px-4">
        <dl>
          <DetailRow label="Assessment" value={title} />
          <DetailRow label="Passing score" value={`${passing}%`} />
          {score != null ? (
            <DetailRow label="Your score" value={`${score}%`} />
          ) : null}
          <DetailRow
            label="Completed on"
            value={formatNotificationDate(item.createdAt)}
          />
        </dl>
      </div>

      <p className="text-[15px] leading-[1.7] text-foreground/80">
        Generate your certificate next. After that you can download the
        landscape PDF, share the verified link, or add the credential to your
        profile.
      </p>

      <div className="flex flex-wrap gap-2.5">
        <PrimaryAction
          href={
            certId ? CERT_FLOW.results(certId) : PORTAL_ROUTES.certifications
          }
          label="Generate certificate"
        />
        <SecondaryAction
          href={PORTAL_ROUTES.certifications}
          label="Browse certifications"
        />
      </div>

      <NextSteps
        items={[
          "Generate your certificate and download the PDF.",
          "Share the verified credential link with recruiters.",
          "Find it anytime under My certifications on your profile.",
        ]}
      />

      <Signature />
    </>
  );
}

function CertEarnedBody({
  item,
  recipient,
}: {
  item: AppNotification;
  recipient: Recipient;
}) {
  const title = certTitleFromItem(item);
  const hasSpecificTitle =
    Boolean(item.meta?.certTitle?.trim()) || title !== "certification";
  const holder = item.meta?.recipientName || recipient.name;
  const score = item.meta?.score;
  const certificateId = item.meta?.certificateId;
  const [certificate, setCertificate] = useState<
    EarnedCertificate | null | undefined
  >(undefined);
  const [showCertificate, setShowCertificate] = useState(false);

  useEffect(() => {
    let active = true;
    const localCertificate =
      (certificateId ? findCertificateById(certificateId) : null) ??
      listPublicCertificates().find(
        (current) =>
          current.certificationId === item.meta?.certificationId
      ) ??
      null;
    setCertificate(localCertificate);
    setShowCertificate(false);

    if (localCertificate) {
      void issueCertificateAction({
        certificationId: localCertificate.certificationId,
        recipientName: localCertificate.recipientName,
        score: localCertificate.score,
      }).then((result) => {
        if (active && result.success) {
          cacheIssuedCertificate(result.certificate);
          setCertificate(result.certificate);
        }
      });
    }

    return () => {
      active = false;
    };
  }, [certificateId, item.meta?.certificationId]);
  const verifiedCertificateId = certificate?.id ?? certificateId;

  const viewCertificate = () => {
    if (!certificate) {
      toast.error("This certificate is not available on this device");
      return;
    }
    setShowCertificate(true);
  };

  const downloadCertificate = async () => {
    if (!certificate) {
      toast.error("This certificate is not available on this device");
      return;
    }
    try {
      const filename = hasSpecificTitle
        ? `SupraBase-${title.replace(/[^\w]+/g, "-")}-Certificate.pdf`
        : "SupraBase-Certificate.pdf";
      toast.message("Preparing your PDF…");
      await printCertificateLandscape(
        "notification-certificate-print",
        filename
      );
      toast.success("Certificate downloaded");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to prepare the certificate PDF"
      );
    }
  };

  return (
    <>
      <Greeting name={holder} />

      <p className="text-[15px] leading-[1.7] text-foreground/80">
        {hasSpecificTitle ? (
          <>
            Your <span className="font-semibold text-foreground">{title}</span>{" "}
            certificate has been issued and added to your SupraBase profile. It
            includes a unique credential ID that anyone can verify online.
          </>
        ) : (
          <>
            Your verified certificate has been issued and added to your
            SupraBase profile. It includes a unique credential ID that anyone
            can verify online.
          </>
        )}
      </p>

      <div className="rounded-xl border border-border px-4">
        <dl>
          <DetailRow label="Issued to" value={holder} />
          {score != null ? (
            <DetailRow label="Score" value={`${score}%`} />
          ) : null}
          <DetailRow
            label="Issued on"
            value={formatNotificationDate(item.createdAt)}
          />
          {verifiedCertificateId ? (
            <DetailRow label="Credential ID" value={verifiedCertificateId} />
          ) : null}
        </dl>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <Attachment
          className="min-w-[16rem] flex-1"
          onDownload={() => void downloadCertificate()}
          label={
            hasSpecificTitle
              ? `SupraBase-${title.replace(/[^\w]+/g, "-")}-Certificate.pdf`
              : "SupraBase-Certificate.pdf"
          }
        />
        <button
          type="button"
          onClick={viewCertificate}
          disabled={certificate === undefined}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-[13px] font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
        >
          View certificate
          <ExternalLink className="h-3.5 w-3.5 opacity-80" />
        </button>
        {verifiedCertificateId ? (
          <SecondaryAction
            href={`/verify/${verifiedCertificateId}`}
            label="Verify credential"
          />
        ) : null}
      </div>

      {showCertificate && certificate ? (
        <section className="overflow-hidden rounded-xl border border-border bg-[#fdfbf7]">
          <div className="flex items-center justify-between border-b border-border/70 bg-card px-3.5 py-2.5">
            <p className="text-[12.5px] font-semibold text-foreground">
              Your certificate
            </p>
            <button
              type="button"
              onClick={() => setShowCertificate(false)}
              aria-label="Close certificate preview"
              className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-2.5 sm:p-3">
            <CertificateDocument
              certificate={certificate}
              id="notification-certificate-print"
              className="!mx-auto !max-w-full !rounded-lg !shadow-none"
            />
          </div>
        </section>
      ) : certificate ? (
        <div className="sr-only" aria-hidden>
          <CertificateDocument
            certificate={certificate}
            id="notification-certificate-print"
          />
        </div>
      ) : null}

      <NextSteps
        items={[
          "Download the landscape PDF.",
          "Share your public verify link.",
          "Find the certificate under My certifications on your profile.",
        ]}
      />

      <Signature />
    </>
  );
}

function GenericBody({
  item,
  recipient,
}: {
  item: AppNotification;
  recipient: Recipient;
}) {
  return (
    <>
      <Greeting name={recipient.name} />
      <p className="text-[15px] leading-[1.7] text-foreground/80">
        {item.body}
      </p>
      {item.href ? (
        <div className="flex flex-wrap gap-2.5">
          <PrimaryAction href={item.href} label="Open" />
        </div>
      ) : null}
      <Signature />
    </>
  );
}

export function NotificationMessage({
  item,
  recipient,
  className,
}: {
  item: AppNotification;
  recipient: Recipient;
  className?: string;
}) {
  const kind = item.kind ?? "generic";

  return (
    <article className={cn("mx-auto w-full max-w-[640px]", className)}>
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="space-y-5 px-6 py-7 sm:px-8 sm:py-8">
          {kind === "cert-passed" ? (
            <CertPassedBody item={item} recipient={recipient} />
          ) : kind === "cert-earned" ? (
            <CertEarnedBody item={item} recipient={recipient} />
          ) : (
            <GenericBody item={item} recipient={recipient} />
          )}
        </div>
      </div>
    </article>
  );
}
