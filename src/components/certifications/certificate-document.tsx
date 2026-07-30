"use client";

import Image from "next/image";
import logoMark from "@/assets/Logo.png";
import { qrImageUrl, certificateVerifyUrl } from "@/features/certifications/lib/share";
import { LEVEL_META } from "@/features/certifications/data/catalog";
import type { CertLevel, EarnedCertificate } from "@/features/certifications/types";
import { cn } from "@/lib/utils";

const PAPER = "#fdfbf7";
const SIDEBAR = "#ece6dc";
const INK = "#1c1917";
const MUTED = "#57534e";
const ACCENT = "var(--color-brand)";
const SEAL_RING = "#3d3a36";

export type CertificateSheetProps = {
  recipientName: string;
  title: string;
  technology: string;
  level: CertLevel;
  score?: number;
  issuedAt?: string;
  verifyUrl?: string;
  certificateId?: string;
  id?: string;
  className?: string;
  compact?: boolean;
};

function formatIssuedDate(iso?: string) {
  if (!iso) return "—.—.—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function CertificateSheet({
  recipientName,
  title,
  technology,
  level,
  score,
  issuedAt,
  verifyUrl,
  certificateId,
  id,
  className,
  compact,
}: CertificateSheetProps) {
  const issued = formatIssuedDate(issuedAt);
  const levelLabel = LEVEL_META[level].label;

  return (
    <div
      id={id}
      className={cn(
        "cert-sheet relative mx-auto aspect-[1.414/1] w-full overflow-hidden rounded-[1.15rem] border border-[#d6cfc3] text-[#1c1917] shadow-[0_24px_60px_-28px_rgba(28,25,23,0.35)]",
        compact ? "max-w-md rounded-xl" : "max-w-4xl",
        className
      )}
      style={{
        fontFamily: "var(--font-plus-jakarta), system-ui, sans-serif",
        backgroundColor: PAPER,
        containerType: "inline-size",
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact",
      }}
    >
      <div className="relative z-10 flex h-full min-h-0">
        {/* Left rail — one quiet brand anchor, date and verification mark */}
        <aside
          className="relative flex w-[24%] shrink-0 flex-col justify-between overflow-hidden px-[5%] py-[5.5%]"
          style={{ backgroundColor: SIDEBAR }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.3]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, rgba(91,108,255,0.1), transparent 45%), radial-gradient(circle at 80% 80%, rgba(176,108,73,0.08), transparent 50%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-[14%] left-1/2 select-none"
            style={{
              writingMode: "vertical-rl",
              transform: "translateX(-50%) rotate(180deg)",
              fontSize: compact ? "1.65rem" : "clamp(1.9rem, 6.5cqw, 3rem)",
              fontWeight: 800,
              letterSpacing: "0.14em",
              color: "rgba(28,25,23,0.055)",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}
          >
            VERIFIED
          </div>

          <div className="relative z-10 flex flex-col gap-[10%]">
            <p
              className={cn(
                "leading-snug",
                compact ? "text-[7px]" : "text-[clamp(0.55rem,1.55cqw,0.76rem)]"
              )}
              style={{ color: MUTED }}
            >
              Issued and verified on
            </p>
            <div
              className="rounded-lg border bg-white/55 px-[10%] py-[12%] text-center"
              style={{ borderColor: "rgba(28,25,23,0.16)" }}
            >
              <p
                className={cn(
                  "font-bold tracking-tight",
                  compact
                    ? "text-[10px]"
                    : "text-[clamp(0.78rem,2.2cqw,1.05rem)]"
                )}
                style={{ color: INK }}
              >
                {issued}
              </p>
            </div>
          </div>

          <div className="relative z-10 flex flex-col items-center gap-1.5 text-center">
            <BrandMark size={compact ? 26 : 36} />
            <p
              className={cn(
                "font-bold tracking-tight",
                compact ? "text-[10px]" : "text-[clamp(0.8rem,2.2cqw,1.05rem)]"
              )}
              style={{ color: INK }}
            >
              SupraBase
            </p>
          </div>
        </aside>

        {/* Main panel */}
        <div
          className="relative flex min-w-0 flex-1 flex-col px-[5.5%] py-[5%]"
          style={{
            background:
              "radial-gradient(ellipse 70% 80% at 100% 50%, rgba(91,108,255,0.08), transparent 55%), linear-gradient(165deg, #ffffff 0%, #fdfbf7 55%, #f7f3ee 100%)",
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 pt-1">
              <h1
                className={cn(
                  "font-extrabold leading-[0.95] tracking-tight",
                  compact
                    ? "text-[22px]"
                    : "text-[clamp(1.8rem,6cqw,3.2rem)]"
                )}
                style={{ color: ACCENT }}
              >
                Certificate
              </h1>
              <p
                className={cn(
                  "mt-1 whitespace-nowrap font-extrabold leading-none tracking-tight",
                  compact
                    ? "text-[18px]"
                    : "text-[clamp(1.35rem,4.5cqw,2.4rem)]"
                )}
                style={{ color: INK }}
              >
                Of Achievement
              </p>
            </div>

            <div className="flex shrink-0 items-start gap-2 sm:gap-3">
              <CornerBadge
                compact={compact}
                label="Verified"
                sub="Skill"
              />
              <CornerBadge
                compact={compact}
                label={technology}
                sub={levelLabel}
              />
            </div>
          </div>

          <p
            className={cn(
              "mt-[5%] font-medium",
              compact
                ? "text-[9px]"
                : "text-[clamp(0.7rem,1.9cqw,0.95rem)]"
            )}
            style={{ color: MUTED }}
          >
            This Certificate Is Given To
          </p>
          <p
            className={cn(
              "mt-1 max-w-[92%] leading-[1.05]",
              compact
                ? "text-[26px]"
                : "text-[clamp(1.8rem,6.2cqw,3.2rem)]"
            )}
            style={{
              color: ACCENT,
              fontFamily: "var(--font-cert-script), cursive",
            }}
          >
            {recipientName}
          </p>

          <p
            className={cn(
              "mt-[4%] max-w-[92%] leading-relaxed",
              compact
                ? "text-[8px]"
                : "text-[clamp(0.68rem,1.8cqw,0.9rem)]"
            )}
            style={{ color: MUTED }}
          >
            Has successfully completed the{" "}
            <span className="font-semibold" style={{ color: INK }}>
              {title}
            </span>{" "}
            skill certification
            {typeof score === "number" ? (
              <>
                {" "}
                — score{" "}
                <span className="font-semibold" style={{ color: INK }}>
                  {score}%
                </span>
              </>
            ) : null}
            , showcasing excellence and dedication.
          </p>

          <div
            className="mt-[5%] grid grid-cols-3 divide-x rounded-lg border bg-white/45"
            style={{ borderColor: "rgba(28,25,23,0.1)" }}
          >
            <CredentialFact
              compact={compact}
              label="Credential"
              value="Verified"
            />
            <CredentialFact
              compact={compact}
              label="Skill"
              value={technology}
            />
            <CredentialFact
              compact={compact}
              label="Result"
              value={typeof score === "number" ? `${score}%` : "Passed"}
            />
          </div>

          <div className="mt-auto flex items-end justify-between gap-4 pt-[4%]">
            <div className="min-w-0">
              <p
                className={cn(
                  "font-semibold uppercase tracking-[0.14em]",
                  compact
                    ? "text-[5px]"
                    : "text-[clamp(0.42rem,1.05cqw,0.58rem)]"
                )}
                style={{ color: MUTED }}
              >
                Credential ID
              </p>
              <p
                className={cn(
                  "mt-1 font-mono font-semibold tracking-wide",
                  compact
                    ? "text-[6px]"
                    : "text-[clamp(0.48rem,1.2cqw,0.68rem)]"
                )}
                style={{ color: INK }}
              >
                {certificateId ?? "Pending issuance"}
              </p>
              <p
                className={cn(
                  "mt-1.5",
                  compact
                    ? "text-[5px]"
                    : "text-[clamp(0.45rem,1.15cqw,0.6rem)]"
                )}
                style={{ color: MUTED }}
              >
                Scan the seal to verify this credential.
              </p>
            </div>

            <CertSeal
              compact={compact}
              verifyUrl={verifyUrl}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function CredentialFact({
  label,
  value,
  compact,
}: {
  label: string;
  value: string;
  compact?: boolean;
}) {
  return (
    <div className="min-w-0 px-[8%] py-[7%] text-center">
      <p
        className={cn(
          "uppercase tracking-[0.12em]",
          compact ? "text-[5px]" : "text-[clamp(0.42rem,1cqw,0.56rem)]"
        )}
        style={{ color: MUTED }}
      >
        {label}
      </p>
      <p
        className={cn(
          "mt-1 truncate font-semibold",
          compact ? "text-[7px]" : "text-[clamp(0.6rem,1.45cqw,0.76rem)]"
        )}
        style={{ color: INK }}
      >
        {value}
      </p>
    </div>
  );
}

function BrandMark({ size }: { size: number }) {
  return (
    <span
      aria-hidden
      className="relative block shrink-0 overflow-hidden rounded-[28%]"
      style={{
        width: size,
        height: size,
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact",
      }}
    >
      <Image
        src={logoMark}
        alt=""
        fill
        sizes={`${size}px`}
        className="object-cover"
        priority
      />
    </span>
  );
}

function CornerBadge({
  label,
  sub,
  compact,
}: {
  label: string;
  sub: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-md border bg-white/80 text-center shadow-sm",
        compact
          ? "min-w-[3.2rem] px-1.5 py-1"
          : "min-w-[4.5rem] px-3 py-1.5"
      )}
      style={{ borderColor: "rgba(28,25,23,0.12)" }}
    >
      <p
        className={cn(
          "whitespace-nowrap font-semibold leading-tight",
        compact ? "text-[7px]" : "text-[clamp(0.55rem,1.5cqw,0.72rem)]"
        )}
        style={{ color: INK }}
      >
        {label}
      </p>
      <p
        className={cn(
          "mt-0.5 truncate uppercase tracking-[0.12em]",
          compact ? "text-[5px]" : "text-[clamp(0.45rem,1.2cqw,0.58rem)]"
        )}
        style={{ color: MUTED }}
      >
        {sub}
      </p>
    </div>
  );
}

function CertSeal({
  compact,
  verifyUrl,
}: {
  compact?: boolean;
  verifyUrl?: string;
}) {
  const size = compact ? "56px" : "clamp(56px, 9cqw, 78px)";
  return (
    <div
      className="relative flex shrink-0 items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <circle
          cx="50"
          cy="50"
          r="47"
          fill="#fff"
          stroke={SEAL_RING}
          strokeWidth="2.2"
        />
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke={ACCENT}
          strokeWidth="1.2"
          strokeDasharray="2.5 2"
        />
        <defs>
          <path
            id="seal-arc"
            d="M50,50 m-33,0 a33,33 0 1,1 66,0 a33,33 0 1,1 -66,0"
          />
        </defs>
        <text
          fill={MUTED}
          fontSize="5.2"
          fontWeight="600"
          letterSpacing="1.4"
        >
          <textPath href="#seal-arc" startOffset="0%">
            VERIFIED SKILL · SUPRABASE CREDENTIALS ·
          </textPath>
        </text>
      </svg>
      <div className="relative z-10 flex flex-col items-center justify-center">
        {verifyUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={qrImageUrl(verifyUrl)}
            alt="Verification QR"
            width={compact ? 28 : 42}
            height={compact ? 28 : 42}
            className="rounded-sm"
          />
        ) : (
          <BrandMark size={compact ? 22 : 32} />
        )}
      </div>
    </div>
  );
}

export function CertificateDocument({
  certificate,
  id,
  className,
}: {
  certificate: EarnedCertificate;
  id?: string;
  className?: string;
}) {
  return (
    <CertificateSheet
      id={id}
      className={className}
      recipientName={certificate.recipientName}
      title={certificate.title}
      technology={certificate.technology}
      level={certificate.level}
      score={certificate.score}
      issuedAt={certificate.issuedAt}
      certificateId={certificate.id}
      verifyUrl={certificateVerifyUrl(certificate.id)}
    />
  );
}
