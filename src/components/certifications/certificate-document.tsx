"use client";

import { qrImageUrl, certificateVerifyUrl } from "@/features/certifications/lib/share";
import type { EarnedCertificate } from "@/features/certifications/types";
import { LEVEL_META } from "@/features/certifications/data/catalog";

const CREAM = "#f6f1e8";
const CHARCOAL = "#1f1f1f";
const MAROON = "#a31d2d";
const GOLD = "#c5a572";

export function CertificateDocument({
  certificate,
  id,
}: {
  certificate: EarnedCertificate;
  id?: string;
}) {
  const verify = certificateVerifyUrl(certificate.id);
  const issuedDate = new Date(certificate.issuedAt);
  const issued = issuedDate
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
    .replace(/ /g, ". ");

  return (
    <div
      id={id}
      className="cert-sheet relative mx-auto aspect-[1.414/1] w-full max-w-4xl overflow-hidden border-[3px] border-black text-[#1f1f1f] shadow-2xl"
      style={{
        fontFamily: "var(--font-plus-jakarta), system-ui, sans-serif",
        backgroundColor: CREAM,
      }}
    >
      <CertificateDecor />

      <div className="relative z-10 flex h-full flex-col items-center px-[10%] pb-[5%] pt-[5.5%]">
        <OrnamentRule />

        <div className="mt-3 flex items-center gap-2.5">
          <CertBrandMark />
          <span
            className="text-[15px] font-semibold tracking-[0.06em] sm:text-[17px]"
            style={{ color: CHARCOAL }}
          >
            SupraBase
          </span>
        </div>

        <div className="mt-4 flex items-center gap-3 sm:mt-5">
          <span className="h-px w-8 sm:w-12" style={{ backgroundColor: GOLD }} />
          <span
            className="text-[9px] font-semibold uppercase tracking-[0.35em]"
            style={{ color: MAROON }}
          >
            Verified skill
          </span>
          <span className="h-px w-8 sm:w-12" style={{ backgroundColor: GOLD }} />
        </div>

        <h1
          className="mt-3 text-[clamp(1.85rem,4.4vw,2.85rem)] font-extrabold uppercase leading-none tracking-[0.14em]"
          style={{ color: CHARCOAL }}
        >
          Certificate
        </h1>
        <p
          className="mt-1.5 text-[clamp(0.7rem,1.5vw,0.95rem)] font-medium uppercase tracking-[0.32em]"
          style={{ color: CHARCOAL }}
        >
          Of Achievement
        </p>

        <DiamondDivider className="mt-5 sm:mt-6" />

        <p
          className="mt-4 text-[10px] font-medium uppercase tracking-[0.28em] text-[#5c5c5c] sm:text-[11px]"
        >
          Presented to
        </p>
        <p
          className="mt-1 max-w-[80%] text-center text-[clamp(2rem,4.8vw,3.25rem)] leading-[1.05]"
          style={{
            color: MAROON,
            fontFamily: "var(--font-cert-script), cursive",
          }}
        >
          {certificate.recipientName}
        </p>
        <div
          className="mt-2 h-px w-[min(40%,13rem)]"
          style={{
            background: `linear-gradient(90deg, transparent, ${CHARCOAL}, transparent)`,
          }}
        />

        <p className="mt-4 max-w-[68%] text-center text-[clamp(0.7rem,1.2vw,0.85rem)] leading-relaxed text-[#3d3d3d] sm:mt-5">
          Successfully completed the{" "}
          <span className="font-semibold" style={{ color: CHARCOAL }}>
            {certificate.title}
          </span>{" "}
          skill certification on SupraBase — {certificate.technology} ·{" "}
          {LEVEL_META[certificate.level].label} · Score {certificate.score}%
        </p>

        <div className="mt-auto flex w-full max-w-[82%] items-end justify-between gap-4 pt-7">
          <div className="min-w-[7.5rem] text-center">
            <p className="text-[clamp(0.7rem,1.2vw,0.85rem)] font-medium">
              {issued}
            </p>
            <div
              className="mx-auto mt-1.5 h-px w-full max-w-[9.5rem]"
              style={{ backgroundColor: CHARCOAL }}
            />
            <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-[#5c5c5c]">
              Date
            </p>
          </div>

          <div className="hidden flex-col items-center sm:flex">
            <div className="rounded-sm border border-black/10 bg-white/80 p-1 shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrImageUrl(verify)}
                alt="Verification QR"
                width={58}
                height={58}
              />
            </div>
            <p className="mt-1.5 text-[8px] uppercase tracking-[0.18em] text-[#6b6b6b]">
              Verify
            </p>
          </div>

          <div className="min-w-[7.5rem] text-center">
            <p
              className="text-[clamp(1.15rem,2.3vw,1.6rem)] leading-none"
              style={{
                color: MAROON,
                fontFamily: "var(--font-cert-script), cursive",
              }}
            >
              SupraBase
            </p>
            <div
              className="mx-auto mt-1.5 h-px w-full max-w-[9.5rem]"
              style={{ backgroundColor: CHARCOAL }}
            />
            <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-[#5c5c5c]">
              Platform
            </p>
          </div>
        </div>

        <OrnamentRule className="mt-4" />
      </div>
    </div>
  );
}

function OrnamentRule({ className }: { className?: string }) {
  return (
    <div className={`flex w-[min(52%,18rem)] items-center gap-2 ${className ?? ""}`}>
      <div
        className="h-px flex-1"
        style={{
          background: `linear-gradient(90deg, transparent, ${MAROON})`,
        }}
      />
      <svg viewBox="0 0 20 12" className="h-3 w-5 shrink-0" aria-hidden>
        <path d="M1 6 H7 L10 2 L13 6 H19" fill="none" stroke={GOLD} strokeWidth="1.2" />
        <path d="M7 6 L10 10 L13 6" fill="none" stroke={MAROON} strokeWidth="1.2" />
      </svg>
      <div
        className="h-px flex-1"
        style={{
          background: `linear-gradient(90deg, ${MAROON}, transparent)`,
        }}
      />
    </div>
  );
}

function DiamondDivider({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`} aria-hidden>
      <span className="h-px w-10" style={{ backgroundColor: `${GOLD}99` }} />
      <span
        className="h-1.5 w-1.5 rotate-45"
        style={{ backgroundColor: MAROON }}
      />
      <span
        className="h-2 w-2 rotate-45 border"
        style={{ borderColor: GOLD }}
      />
      <span
        className="h-1.5 w-1.5 rotate-45"
        style={{ backgroundColor: MAROON }}
      />
      <span className="h-px w-10" style={{ backgroundColor: `${GOLD}99` }} />
    </div>
  );
}

function CertBrandMark() {
  return (
    <svg
      viewBox="0 0 36 36"
      className="h-8 w-8 shrink-0 sm:h-9 sm:w-9"
      aria-hidden
    >
      <path d="M8 26 L18 6 L22 14 L12 28 Z" fill={MAROON} />
      <path d="M14 22 L24 8 L28 16 L18 30 Z" fill={CHARCOAL} />
    </svg>
  );
}

function CertificateDecor() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      {/* Soft paper wash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 42%, #fffdf8 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 15% 85%, #ebe3d4 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 85% 15%, #ebe3d4 0%, transparent 60%)",
        }}
      />

      {/* Inner double frame */}
      <div className="absolute inset-[10px] border border-black/80" />
      <div
        className="absolute inset-[16px] border"
        style={{ borderColor: `${GOLD}aa` }}
      />
      <div
        className="absolute inset-[22px] border border-dashed"
        style={{ borderColor: `${MAROON}33` }}
      />

      {/* Corner flourishes */}
      <CornerFlourish className="left-[28px] top-[28px]" />
      <CornerFlourish className="right-[28px] top-[28px] scale-x-[-1]" />
      <CornerFlourish className="bottom-[28px] left-[28px] scale-y-[-1]" />
      <CornerFlourish className="bottom-[28px] right-[28px] scale-[-1]" />

      {/* Faint centered watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.045]">
        <svg viewBox="0 0 120 120" className="h-[55%] w-auto">
          <path d="M30 90 L60 20 L72 44 L42 96 Z" fill={MAROON} />
          <path d="M48 78 L78 28 L90 52 L60 102 Z" fill={CHARCOAL} />
        </svg>
      </div>

      {/* Side accent rails — thin, away from text */}
      <div
        className="absolute bottom-[18%] left-[34px] top-[18%] w-px"
        style={{
          background: `linear-gradient(180deg, transparent, ${GOLD}88, ${MAROON}55, ${GOLD}88, transparent)`,
        }}
      />
      <div
        className="absolute bottom-[18%] right-[34px] top-[18%] w-px"
        style={{
          background: `linear-gradient(180deg, transparent, ${GOLD}88, ${MAROON}55, ${GOLD}88, transparent)`,
        }}
      />
    </div>
  );
}

function CornerFlourish({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={`absolute h-14 w-14 sm:h-16 sm:w-16 ${className ?? ""}`}
    >
      <path
        d="M4 4 H36 M4 4 V36"
        fill="none"
        stroke={CHARCOAL}
        strokeWidth="1.4"
      />
      <path
        d="M8 8 H28 M8 8 V28"
        fill="none"
        stroke={MAROON}
        strokeWidth="1.1"
      />
      <path
        d="M12 4 C22 12, 28 18, 36 28"
        fill="none"
        stroke={GOLD}
        strokeWidth="1.2"
      />
      <circle cx="12" cy="12" r="1.6" fill={MAROON} />
      <path
        d="M18 8 L22 12 L18 16 L14 12 Z"
        fill="none"
        stroke={GOLD}
        strokeWidth="1"
      />
    </svg>
  );
}
