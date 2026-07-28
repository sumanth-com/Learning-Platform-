"use client";

import Link from "next/link";
import { ArrowRight, Award, FilePlus2, Medal, Sparkles } from "lucide-react";
import { useCertifications } from "@/features/certifications/hooks/use-certifications";
import { CERT_FLOW } from "@/features/certifications/lib/paths";
import { cn } from "@/lib/utils";

/** Fresh skill-card palettes — clear greens / teals (not flat navy). */
const CARD_TONES = [
  {
    face: "linear-gradient(135deg, #2dd4a0 0%, #12a56e 42%, #0b7a52 100%)",
    fold: "#9af0c8",
    ring: "rgba(255,255,255,0.28)",
    tag: "bg-white text-[#0b7a52]",
  },
  {
    face: "linear-gradient(135deg, #3ecfcf 0%, #1aa3b5 45%, #0d7a8a 100%)",
    fold: "#b8f3f3",
    ring: "rgba(255,255,255,0.28)",
    tag: "bg-white text-[#0d7a8a]",
  },
  {
    face: "linear-gradient(135deg, #5ee09a 0%, #27d17c 40%, #14965a 100%)",
    fold: "#d4ffe6",
    ring: "rgba(255,255,255,0.3)",
    tag: "bg-white text-[#14965a]",
  },
  {
    face: "linear-gradient(135deg, #7dd3c0 0%, #3ba89a 48%, #1f7a6e 100%)",
    fold: "#d8f5ee",
    ring: "rgba(255,255,255,0.28)",
    tag: "bg-white text-[#1f7a6e]",
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
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#27d17c]/30 bg-[#27d17c]/[0.08] px-3.5 py-2.5"
            >
              <p className="text-[13px] text-foreground">
                Assessment passed
                {a.score != null ? ` · ${a.score}%` : ""} — generate your
                certificate
              </p>
              <Link
                href={CERT_FLOW.results(a.certificationId)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#27d17c] px-3 py-1.5 text-[12px] font-bold text-zinc-950 hover:bg-[#3ee08d]"
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
              <li key={c.id} className="w-[min(100%,14.25rem)] shrink-0">
                <Link
                  href={`/profile/certificates/${c.id}`}
                  className={cn(
                    "group relative flex aspect-[5/3.4] w-full flex-col overflow-hidden rounded-2xl p-3.5 text-white outline-none transition duration-300",
                    "shadow-[0_14px_32px_-14px_rgba(16,100,70,0.55)]",
                    "hover:-translate-y-1 hover:shadow-[0_20px_40px_-12px_rgba(16,100,70,0.6)]",
                    "focus-visible:ring-2 focus-visible:ring-[#27d17c]/55 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                  )}
                  style={{ background: tone.face }}
                >
                  {/* Gloss */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-80"
                    style={{
                      background:
                        "linear-gradient(125deg, rgba(255,255,255,0.28) 0%, transparent 42%, transparent 60%, rgba(255,255,255,0.08) 100%)",
                    }}
                  />

                  {/* Soft orbs */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -right-4 -top-6 h-20 w-20 rounded-full bg-white/20 blur-2xl transition duration-300 group-hover:bg-white/30"
                  />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -bottom-8 -left-4 h-16 w-16 rounded-full bg-black/10 blur-xl"
                  />

                  {/* Dog-ear */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute right-0 top-0 h-5 w-5"
                    style={{
                      background: `linear-gradient(225deg, ${tone.fold} 49%, rgba(0,0,0,0.12) 51%)`,
                      clipPath: "polygon(0 0, 100% 0, 100% 100%)",
                    }}
                  />

                  <div className="relative flex items-start justify-between gap-2">
                    <span
                      className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/15 backdrop-blur-[2px]"
                      style={{ boxShadow: `inset 0 0 0 1px ${tone.ring}` }}
                    >
                      <Medal className="h-4 w-4" strokeWidth={1.9} />
                    </span>
                    {typeof c.score === "number" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-black/15 px-2 py-0.5 text-[10px] font-bold tabular-nums tracking-wide text-white ring-1 ring-white/20">
                        <Sparkles className="h-3 w-3" />
                        {c.score}%
                      </span>
                    ) : null}
                  </div>

                  <div className="relative mt-auto space-y-2.5">
                    <p className="line-clamp-2 text-[14px] font-semibold leading-snug tracking-tight drop-shadow-sm">
                      {label}
                    </p>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-semibold tracking-[0.04em] text-white/95">
                        Verified
                      </span>
                      <span
                        className={cn(
                          "rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] shadow-sm",
                          tone.tag
                        )}
                      >
                        Skill
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
