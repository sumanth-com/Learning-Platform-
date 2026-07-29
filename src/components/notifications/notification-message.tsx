"use client";

import Link from "next/link";
import {
  Award,
  BadgeCheck,
  CheckCircle2,
  Download,
  ExternalLink,
  FileText,
  Sparkles,
} from "lucide-react";
import {
  formatNotificationDate,
  notificationSender,
  type AppNotification,
} from "@/lib/notifications";
import { CERT_FLOW } from "@/features/certifications/lib/paths";
import { PORTAL_ROUTES } from "@/features/portal/types";
import Image from "next/image";
import logoLight from "@/assets/Logo.png";
import { BRAND as BRAND_TOKENS, BRAND_GRADIENT } from "@/lib/brand";
import { cn } from "@/lib/utils";

type Recipient = { name: string; email: string };

const BRAND = BRAND_TOKENS.deep;
const BRAND_BRIGHT = BRAND_TOKENS.bright;

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
    <p className="text-[14px] text-foreground">
      Hi {name.split(" ")[0] || name},
    </p>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-border/60 py-2 last:border-b-0">
      <dt className="text-[12px] text-muted-foreground">{label}</dt>
      <dd className="min-w-0 truncate text-right text-[13px] font-medium text-foreground">
        {value}
      </dd>
    </div>
  );
}

function PrimaryAction({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-[13px] font-bold text-primary-foreground shadow-sm transition hover:bg-primary/90"
    >
      {label}
      <ExternalLink className="h-3.5 w-3.5" />
    </Link>
  );
}

function SecondaryAction({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-[13px] font-medium text-foreground transition hover:bg-muted"
    >
      {label}
    </Link>
  );
}

function NextSteps({ items }: { items: string[] }) {
  return (
    <div className="rounded-xl border border-border/70 bg-muted/30 p-4">
      <p className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
        <Sparkles className="h-3.5 w-3.5" style={{ color: BRAND }} />
        What you can do next
      </p>
      <ul className="mt-2.5 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-[13px] leading-relaxed text-muted-foreground">
            <CheckCircle2
              className="mt-0.5 h-3.5 w-3.5 shrink-0"
              style={{ color: BRAND }}
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Attachment({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-border/70 bg-background px-3 py-2.5">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-muted/50 text-muted-foreground">
        <FileText className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-[12.5px] font-medium text-foreground">
          {label}
        </p>
        <p className="text-[11px] text-muted-foreground">
          PDF · generated on download
        </p>
      </div>
      <Download className="ml-auto h-3.5 w-3.5 text-muted-foreground" />
    </div>
  );
}

function Signature() {
  return (
    <div className="space-y-1 border-t border-border/60 pt-4">
      <p className="text-[13px] text-muted-foreground">
        Keep building — we’re rooting for you.
      </p>
      <p className="text-[13px] font-semibold text-foreground">
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

      <p className="text-[14px] leading-relaxed text-muted-foreground">
        Congratulations — you have successfully cleared the{" "}
        <span className="font-semibold text-foreground">{title}</span> Skills
        Certification Test on SupraBase. Your submission was evaluated against
        the full hidden test suite and met the passing criteria.
      </p>

      <div className="overflow-hidden rounded-xl border border-primary/30 bg-primary/[0.07]">
        <div className="flex items-center gap-3 border-b border-primary/20 px-4 py-3">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-xl text-white"
            style={{ background: BRAND }}
          >
            <Award className="h-4 w-4" />
          </span>
          <div>
            <p className="text-[13px] font-semibold text-foreground">
              Assessment passed
            </p>
            <p className="text-[11.5px] text-muted-foreground">
              Result verified by SupraBase
            </p>
          </div>
          {score != null ? (
            <span
              className="ml-auto rounded-lg px-2.5 py-1 text-[13px] font-bold text-white"
              style={{ background: BRAND_BRIGHT, color: BRAND_TOKENS.onBright }}
            >
              {score}%
            </span>
          ) : null}
        </div>
        <dl className="px-4 py-1">
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

      <p className="text-[14px] leading-relaxed text-muted-foreground">
        Your certificate is ready to be generated. Once generated you can
        download it as a landscape PDF, share the verified link, or add the
        credential to your résumé and LinkedIn profile.
      </p>

      <div className="flex flex-wrap gap-2.5">
        <PrimaryAction
          href={certId ? CERT_FLOW.results(certId) : PORTAL_ROUTES.certifications}
          label="Generate certificate"
        />
        <SecondaryAction
          href={PORTAL_ROUTES.certifications}
          label="Browse certifications"
        />
      </div>

      <NextSteps
        items={[
          "Generate your certificate and download the PDF — it stays available anytime from your profile.",
          "Share the verified credential link with recruiters or add it to LinkedIn.",
          "Level up by attempting the Intermediate track in the same technology.",
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
  const hasSpecificTitle = Boolean(item.meta?.certTitle?.trim()) || title !== "certification";
  const holder = item.meta?.recipientName || recipient.name;
  const score = item.meta?.score;
  const certId = item.meta?.certificationId;
  const certificateId = item.meta?.certificateId;

  return (
    <>
      <Greeting name={holder} />

      <p className="text-[14px] leading-relaxed text-muted-foreground">
        {hasSpecificTitle ? (
          <>
            Your{" "}
            <span className="font-semibold text-foreground">{title}</span>{" "}
            certificate has been issued and added to your SupraBase profile. It
            carries a unique credential ID that anyone can verify online.
          </>
        ) : (
          <>
            Your verified certificate has been issued and added to your
            SupraBase profile. It carries a unique credential ID that anyone can
            verify online.
          </>
        )}
      </p>

      <div className="overflow-hidden rounded-xl border border-border/70 bg-muted/25">
        <div className="flex items-center gap-3 border-b border-border/60 px-4 py-3">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-xl text-white"
            style={{ background: BRAND }}
          >
            <BadgeCheck className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold text-foreground">
              {hasSpecificTitle ? `${title} Certificate` : "Verified certificate"}
            </p>
            <p className="text-[11.5px] text-muted-foreground">
              Verified credential
            </p>
          </div>
        </div>
        <dl className="px-4 py-1">
          <DetailRow label="Issued to" value={holder} />
          {score != null ? <DetailRow label="Score" value={`${score}%`} /> : null}
          <DetailRow
            label="Issued on"
            value={formatNotificationDate(item.createdAt)}
          />
          {certificateId ? (
            <DetailRow label="Credential ID" value={certificateId} />
          ) : null}
        </dl>
      </div>

      <Attachment
        label={
          hasSpecificTitle
            ? `SupraBase-${title.replace(/[^\w]+/g, "-")}-Certificate.pdf`
            : "SupraBase-Certificate.pdf"
        }
      />

      <div className="flex flex-wrap gap-2.5">
        <PrimaryAction
          href={
            certId ? CERT_FLOW.certificate(certId) : PORTAL_ROUTES.certifications
          }
          label="View certificate"
        />
        {certificateId ? (
          <SecondaryAction
            href={`/verify/${certificateId}`}
            label="Verify credential"
          />
        ) : null}
      </div>

      <NextSteps
        items={[
          "Download the landscape PDF — it matches the on-screen certificate exactly.",
          "Share your public verify link so employers can confirm the credential.",
          "Find the certificate anytime under My certifications on your profile.",
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
      <p className="text-[14px] leading-relaxed text-muted-foreground">
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
  const sender = notificationSender(item.channel);
  const kind = item.kind ?? "generic";

  return (
    <article className={cn("mx-auto w-full max-w-[720px]", className)}>
      <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
        {/* Branded email banner */}
        <div
          className="flex items-center gap-3 px-5 py-4"
          style={{
            background: BRAND_GRADIENT,
          }}
        >
          <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-[28%] ring-1 ring-white/25">
            <Image
              src={logoLight}
              alt=""
              fill
              sizes="36px"
              className="object-cover"
            />
          </span>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold tracking-tight text-white">
              SupraBase
            </p>
            <p className="text-[11px] uppercase tracking-[0.14em] text-white/70">
              Learn · Build · Ship
            </p>
          </div>
        </div>

        <div className="space-y-4 px-5 py-6 sm:px-7 sm:py-7">
          {kind === "cert-passed" ? (
            <CertPassedBody item={item} recipient={recipient} />
          ) : kind === "cert-earned" ? (
            <CertEarnedBody item={item} recipient={recipient} />
          ) : (
            <GenericBody item={item} recipient={recipient} />
          )}
        </div>

        <div className="border-t border-border/60 bg-muted/25 px-5 py-4 sm:px-7">
          <p className="text-[11.5px] leading-relaxed text-muted-foreground">
            This message was sent to{" "}
            <span className="font-medium text-foreground">
              {recipient.email}
            </span>{" "}
            from {sender.email} because you have certification updates turned
            on.{" "}
            <Link
              href={PORTAL_ROUTES.settings}
              className="font-medium underline underline-offset-2 hover:text-foreground"
            >
              Manage notification preferences
            </Link>
            .
          </p>
        </div>
      </div>
    </article>
  );
}
