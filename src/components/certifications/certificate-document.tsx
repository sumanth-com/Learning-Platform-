"use client";

import { qrImageUrl, certificateVerifyUrl } from "@/features/certifications/lib/share";
import { LEVEL_META } from "@/features/certifications/data/catalog";
import type { CertLevel, EarnedCertificate } from "@/features/certifications/types";
import { cn } from "@/lib/utils";

const PAPER = "#fdfbf7";
const SIDEBAR = "#ece6dc";
const INK = "#1c1917";
const MUTED = "#57534e";
const ACCENT = "#5b6cff";
const ACCENT_SOFT = "#8b9bff";
const SEAL_RING = "#3d3a36";

export type CertificateSheetProps = {
  recipientName: string;
  title: string;
  technology: string;
  level: CertLevel;
  score?: number;
  issuedAt?: string;
  verifyUrl?: string;
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
        "cert-sheet relative mx-auto aspect-[1.414/1] w-full overflow-hidden border border-[#d6cfc3] text-[#1c1917] shadow-[0_24px_60px_-28px_rgba(28,25,23,0.35)]",
        compact ? "max-w-md" : "max-w-4xl",
        className
      )}
      style={{
        fontFamily: "var(--font-plus-jakarta), system-ui, sans-serif",
        backgroundColor: PAPER,
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact",
      }}
    >
      <div className="relative z-10 flex h-full min-h-0">
        {/* Left rail — date + brand */}
        <aside
          className="relative flex w-[28%] shrink-0 flex-col justify-between overflow-hidden px-[4.5%] py-[6%]"
          style={{ backgroundColor: SIDEBAR }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, rgba(91,108,255,0.12), transparent 45%), radial-gradient(circle at 80% 80%, rgba(176,108,73,0.1), transparent 50%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-[10%] left-[42%] select-none overflow-hidden"
            style={{
              writingMode: "vertical-rl",
              transform: "rotate(180deg)",
              fontSize: compact ? "2.2rem" : "clamp(2.4rem, 6.5vw, 4.2rem)",
              fontWeight: 800,
              letterSpacing: "0.2em",
              color: "rgba(28,25,23,0.055)",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}
          >
            SUPRABASE
          </div>

          <div
            className="relative rounded-md border px-[10%] py-[12%]"
            style={{ borderColor: "rgba(28,25,23,0.22)" }}
          >
            <p
              className={cn(
                "leading-snug",
                compact ? "text-[7px]" : "text-[clamp(0.55rem,1.05vw,0.78rem)]"
              )}
              style={{ color: INK }}
            >
              SupraBase grants and certifies this certificate on
            </p>
            <div
              className="mt-[18%] rounded-sm border px-[8%] py-[10%] text-center"
              style={{ borderColor: "rgba(28,25,23,0.18)" }}
            >
              <p
                className={cn(
                  "font-semibold tracking-tight",
                  compact
                    ? "text-[9px]"
                    : "text-[clamp(0.7rem,1.35vw,0.95rem)]"
                )}
                style={{ color: INK }}
              >
                {issued}
              </p>
            </div>
          </div>

          <div className="relative flex flex-col items-center gap-2">
            <BrandMark size={compact ? 28 : 40} />
            <p
              className={cn(
                "font-bold tracking-tight",
                compact ? "text-[11px]" : "text-[clamp(0.85rem,1.6vw,1.15rem)]"
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
                    : "text-[clamp(1.85rem,4.6vw,3.35rem)]"
                )}
                style={{ color: ACCENT }}
              >
                Certificate
              </h1>
              <p
                className={cn(
                  "mt-1 font-extrabold leading-none tracking-tight",
                  compact
                    ? "text-[18px]"
                    : "text-[clamp(1.45rem,3.6vw,2.65rem)]"
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
              "mt-[6%] font-medium",
              compact
                ? "text-[9px]"
                : "text-[clamp(0.7rem,1.25vw,0.95rem)]"
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
                : "text-[clamp(1.85rem,4.8vw,3.4rem)]"
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
                : "text-[clamp(0.68rem,1.2vw,0.9rem)]"
            )}
            style={{ color: MUTED }}
          >
            Has successfully completed the{" "}
            <span className="font-semibold" style={{ color: INK }}>
              {title}
            </span>{" "}
            skill certification on SupraBase
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

          <div className="mt-auto flex items-end justify-between gap-4 pt-[6%]">
            <div className="min-w-0">
              <p
                className={cn(
                  "leading-none",
                  compact
                    ? "text-[16px]"
                    : "text-[clamp(1.1rem,2.4vw,1.75rem)]"
                )}
                style={{
                  color: INK,
                  fontFamily: "var(--font-cert-script), cursive",
                }}
              >
                SupraBase
              </p>
              <p
                className={cn(
                  "mt-1.5 font-bold uppercase tracking-[0.08em]",
                  compact
                    ? "text-[7px]"
                    : "text-[clamp(0.55rem,1vw,0.72rem)]"
                )}
                style={{ color: ACCENT }}
              >
                SupraBase Platform
              </p>
              <p
                className={cn(
                  "mt-0.5",
                  compact ? "text-[6px]" : "text-[clamp(0.5rem,0.9vw,0.65rem)]"
                )}
                style={{ color: MUTED }}
              >
                Learning &amp; credentials
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

function BrandMark({ size }: { size: number }) {
  const gradId = `sb-mark-${Math.round(size)}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      aria-hidden
      className="shrink-0"
      style={{
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact",
      }}
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={ACCENT} />
          <stop offset="100%" stopColor={ACCENT_SOFT} />
        </linearGradient>
      </defs>
      <circle
        cx="20"
        cy="20"
        r="18"
        fill="#fff"
        stroke="rgba(28,25,23,0.12)"
        strokeWidth="1.2"
      />
      <path
        d="M12 26 L20 10 L23.5 17 L15.5 28 Z"
        fill={`url(#${gradId})`}
      />
      <path d="M17 24 L25 12 L28.5 19 L20.5 30 Z" fill={INK} opacity="0.85" />
    </svg>
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
        compact ? "min-w-[3.2rem] px-1.5 py-1" : "min-w-[4.25rem] px-2.5 py-1.5"
      )}
      style={{ borderColor: "rgba(28,25,23,0.12)" }}
    >
      <p
        className={cn(
          "truncate font-semibold leading-tight",
          compact ? "text-[7px]" : "text-[clamp(0.55rem,1vw,0.72rem)]"
        )}
        style={{ color: INK }}
      >
        {label}
      </p>
      <p
        className={cn(
          "mt-0.5 truncate uppercase tracking-[0.12em]",
          compact ? "text-[5px]" : "text-[clamp(0.45rem,0.8vw,0.58rem)]"
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
  const size = compact ? 58 : 92;
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
      verifyUrl={certificateVerifyUrl(certificate.id)}
    />
  );
}
