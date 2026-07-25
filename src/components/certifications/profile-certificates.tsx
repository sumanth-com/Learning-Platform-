"use client";

import Link from "next/link";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  Medal,
  Sparkles,
  Trophy,
} from "lucide-react";
import { useCertifications } from "@/features/certifications/hooks/use-certifications";
import { LEVEL_META } from "@/features/certifications/data/catalog";
import { cn } from "@/lib/utils";

export function ProfileCertificates() {
  const { state, ready } = useCertifications();

  if (!ready) {
    return (
      <div className="rounded-[1.75rem] border border-border/60 bg-card/60 px-6 py-10 text-center text-sm text-muted-foreground">
        Loading certificates…
      </div>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-[1.75rem] border border-border/70 bg-card shadow-[0_20px_60px_-34px_rgba(15,23,42,0.4)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_at_top,_rgba(197,165,114,0.16),_transparent_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 top-8 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl"
      />

      <div className="relative flex flex-wrap items-start justify-between gap-4 border-b border-border/60 px-6 py-5 sm:px-8">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#e8d5a3] via-[#C5A572] to-[#8c6d1f] text-[#1a1408] shadow-md shadow-[#C5A572]/25">
            <Award className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Certifications
            </h2>
            <p className="mt-1 text-[13px] text-muted-foreground">
              Credentials you’ve earned on SupraBase — verify and share anytime.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C5A572]/30 bg-[#C5A572]/10 px-3 py-1.5 text-[12px] font-medium text-foreground">
            <Sparkles className="h-3.5 w-3.5 text-[#C5A572]" />
            {state.xp} XP
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-muted/40 px-3 py-1.5 text-[12px] font-medium text-foreground">
            <Medal className="h-3.5 w-3.5 text-muted-foreground" />
            {state.badges.length} badges
          </span>
        </div>
      </div>

      <div className="relative px-6 py-6 sm:px-8 sm:py-7">
        {state.certificates.length === 0 ? (
          <div className="relative overflow-hidden rounded-2xl border border-dashed border-[#C5A572]/35 bg-gradient-to-br from-[#C5A572]/[0.07] via-transparent to-indigo-500/[0.05] px-6 py-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#C5A572]/30 bg-[#C5A572]/10 text-[#C5A572] shadow-sm">
              <Trophy className="h-7 w-7" />
            </div>
            <p className="mt-4 text-[15px] font-semibold text-foreground">
              No certificates yet
            </p>
            <p className="mx-auto mt-1.5 max-w-md text-[13px] leading-relaxed text-muted-foreground">
              Pass an assessment to unlock your first credential and show it on
              your profile.
            </p>
            <Link
              href="/certifications"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-[13px] font-semibold text-white shadow-lg shadow-zinc-900/20 transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
            >
              Start a certification
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {state.certificates.map((c) => (
              <Link
                key={c.id}
                href={`/verify/${c.id}`}
                className={cn(
                  "group relative overflow-hidden rounded-2xl border border-border/70 bg-background/70 p-4 transition",
                  "hover:border-[#C5A572]/45 hover:shadow-[0_12px_30px_-18px_rgba(197,165,114,0.55)]"
                )}
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-[#C5A572]/10 blur-2xl transition group-hover:bg-[#C5A572]/20"
                />
                <div className="relative flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#C5A572]/15 text-[#C5A572] ring-1 ring-[#C5A572]/25">
                    <BadgeCheck className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-semibold text-foreground">
                      {c.title}
                    </p>
                    <p className="mt-1 text-[12px] text-muted-foreground">
                      {LEVEL_META[c.level].label} · Score {c.score}% ·{" "}
                      {new Date(c.issuedAt).toLocaleDateString()}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1 text-[12px] font-medium text-[#8c6d1f] transition group-hover:gap-1.5 dark:text-[#C5A572]">
                      Verify certificate
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {state.badges.length > 0 ? (
          <div className="mt-6">
            <h3 className="text-[12px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Badges
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {state.badges.map((b) => (
                <span
                  key={b}
                  className="rounded-full border border-[#C5A572]/35 bg-[#C5A572]/10 px-3 py-1.5 text-[12px] font-medium text-foreground"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
