"use client";

import Link from "next/link";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  FilePlus2,
  Medal,
  Sparkles,
} from "lucide-react";
import { useCertifications } from "@/features/certifications/hooks/use-certifications";
import { CERT_FLOW } from "@/features/certifications/lib/paths";
import { cn } from "@/lib/utils";

/** Soft collectible-card palettes: playful, readable, and professional. */
const CARD_TONES = [
  {
    face: "linear-gradient(145deg, #f0fff9 0%, #dcfced 55%, #c7f3df 100%)",
    accent: "#16865b",
    accentSoft: "#b8ecd5",
    border: "#b7e5d1",
    orb: "color-mix(in srgb, var(--color-primary) 20%, transparent)",
    tag: "bg-[#d7f7e8] text-[#126c49]",
  },
  {
    face: "linear-gradient(145deg, #f5f3ff 0%, #e9e5ff 55%, #ddd7ff 100%)",
    accent: "#6855c7",
    accentSoft: "#d7d0ff",
    border: "#d3cbf5",
    orb: "rgba(124,105,220,0.18)",
    tag: "bg-[#e5e0ff] text-[#5947b1]",
  },
  {
    face: "linear-gradient(145deg, #fff9ed 0%, #ffefd0 55%, #ffe3b0 100%)",
    accent: "#a96420",
    accentSoft: "#f7d6a4",
    border: "#efd4a8",
    orb: "rgba(245,158,11,0.16)",
    tag: "bg-[#ffebc9] text-[#955719]",
  },
  {
    face: "linear-gradient(145deg, #effaff 0%, #dff4ff 55%, #cceaff 100%)",
    accent: "#277aa5",
    accentSoft: "#c0e4f6",
    border: "#b9def0",
    orb: "rgba(14,165,233,0.17)",
    tag: "bg-[#d6f0fc] text-[#216b91]",
  },
] as const;

function toneFor(id: string) {
  let n = 0;
  for (let i = 0; i < id.length; i++) n += id.charCodeAt(i);
  return CARD_TONES[n % CARD_TONES.length]!;
}

function levelLabel(level: "basic" | "intermediate") {
  return level === "basic" ? "Basic" : "Intermediate";
}

export function ProfileCertificates() {
  const { state, ready } = useCertifications();

  if (!ready) {
    return (
      <div className="rounded-2xl border border-border/60 bg-card/90 px-5 py-8 text-center text-sm text-muted-foreground backdrop-blur-[2px]">
        Loading certificates…
      </div>
    );
  }

  const earnedIds = new Set(state.certificates.map((c) => c.certificationId));
  const pendingGenerate = Object.values(state.attempts).filter(
    (a) => a.status === "passed" && !earnedIds.has(a.certificationId)
  );

  return (
    <section className="w-full">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/70 bg-card/90 text-foreground shadow-sm">
            <Award className="h-4 w-4" />
          </span>
          <div>
            <h2 className="text-[16px] font-semibold tracking-tight text-foreground">
              My certifications
            </h2>
            <p className="text-[12px] text-muted-foreground">
              {state.certificates.length === 0
                ? "Skills you’ve verified on SupraBase"
                : `${state.certificates.length} verified · ${state.xp} XP`}
            </p>
          </div>
        </div>
        <Link
          href="/certifications"
          className="text-[12px] font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          Browse more →
        </Link>
      </div>

      {pendingGenerate.length > 0 ? (
        <div className="mb-4 space-y-2">
          {pendingGenerate.map((a) => (
            <div
              key={a.certificationId}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/30 bg-primary/[0.08] px-3.5 py-2.5"
            >
              <p className="text-[13px] text-foreground">
                Assessment passed
                {a.score != null ? ` · ${a.score}%` : ""} — generate your
                certificate
              </p>
              <Link
                href={CERT_FLOW.results(a.certificationId)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-[12px] font-bold text-primary-foreground hover:bg-primary/90"
              >
                <FilePlus2 className="h-3.5 w-3.5" />
                Generate
              </Link>
            </div>
          ))}
        </div>
      ) : null}

      {state.certificates.length === 0 && pendingGenerate.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/80 bg-card/70 px-5 py-9 text-center backdrop-blur-[2px]">
          <Medal className="mx-auto h-7 w-7 text-muted-foreground" />
          <p className="mt-3 text-[14px] font-semibold text-foreground">
            No certifications yet
          </p>
          <p className="mx-auto mt-1 max-w-sm text-[12px] text-muted-foreground">
            Clear a skill test to unlock a verified credential on your profile.
          </p>
          <Link
            href="/certifications"
            className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-foreground underline-offset-4 hover:underline"
          >
            Start a certification
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      ) : null}

      {state.certificates.length > 0 ? (
        <ul className="flex flex-wrap gap-4">
          {state.certificates.map((c) => {
            const tone = toneFor(c.id);
            const label = `${c.technology} (${levelLabel(c.level)})`;
            return (
              <li key={c.id} className="w-[min(100%,15.25rem)] shrink-0">
                <Link
                  href={`/profile/certificates/${c.id}`}
                  className="group relative flex aspect-[1.58/1] w-full flex-col overflow-hidden rounded-[1.35rem] border p-4 text-[#1f2925] outline-none transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_-20px_rgba(31,41,37,0.35)] focus-visible:ring-2 focus-visible:ring-primary/45 focus-visible:ring-offset-2"
                  style={{
                    background: tone.face,
                    borderColor: tone.border,
                    boxShadow:
                      "0 10px 25px -20px rgba(31,41,37,0.38), inset 0 1px 0 rgba(255,255,255,0.75)",
                  }}
                >
                  {/* Subtle collectible-card decoration */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -right-8 -top-9 h-28 w-28 rounded-full blur-2xl"
                    style={{
                      background: tone.orb,
                    }}
                  />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute bottom-4 right-5 h-1.5 w-1.5 rounded-full opacity-50"
                    style={{ backgroundColor: tone.accent }}
                  />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute bottom-7 right-9 h-1 w-1 rounded-full opacity-30"
                    style={{ backgroundColor: tone.accent }}
                  />

                  <div className="relative flex items-start justify-between gap-2">
                    <span
                      className="flex h-10 w-10 items-center justify-center rounded-2xl border bg-white/70"
                      style={{
                        color: tone.accent,
                        borderColor: tone.accentSoft,
                      }}
                    >
                      <Medal className="h-[18px] w-[18px]" strokeWidth={1.8} />
                    </span>
                    {typeof c.score === "number" ? (
                      <span
                        className="inline-flex items-center gap-1 rounded-full border bg-white/65 px-2.5 py-1 text-[10px] font-bold tabular-nums tracking-wide"
                        style={{
                          color: tone.accent,
                          borderColor: tone.accentSoft,
                        }}
                      >
                        <Sparkles className="h-3 w-3" strokeWidth={1.8} />
                        {c.score}%
                      </span>
                    ) : null}
                  </div>

                  <div className="relative mt-auto">
                    <p
                      className="text-[9px] font-bold uppercase tracking-[0.16em]"
                      style={{ color: tone.accent }}
                    >
                      SupraBase credential
                    </p>
                    <p className="mt-1 line-clamp-2 text-[14px] font-semibold leading-snug tracking-tight text-[#1f2925]">
                      {label}
                    </p>
                    <div className="mt-3 flex items-center justify-between gap-2 border-t pt-2.5"
                      style={{ borderColor: tone.accentSoft }}
                    >
                      <span
                        className="inline-flex items-center gap-1 text-[10.5px] font-semibold"
                        style={{ color: tone.accent }}
                      >
                        <BadgeCheck className="h-3.5 w-3.5" />
                        Verified skill
                      </span>
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.13em]",
                          tone.tag
                        )}
                      >
                        {levelLabel(c.level)}
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : null}
    </section>
  );
}
