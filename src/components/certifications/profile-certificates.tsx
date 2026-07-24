"use client";

import Link from "next/link";
import { Award, Trophy } from "lucide-react";
import { useCertifications } from "@/features/certifications/hooks/use-certifications";
import { LEVEL_META } from "@/features/certifications/data/catalog";

export function ProfileCertificates() {
  const { state, ready } = useCertifications();

  if (!ready) {
    return (
      <p className="text-sm text-muted-foreground">Loading certificates…</p>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="inline-flex items-center gap-2 text-[16px] font-semibold tracking-tight">
          <Award className="h-4 w-4 text-[#C5A572]" />
          Certificates
        </h2>
        <p className="text-[12px] text-muted-foreground">
          {state.xp} XP · {state.badges.length} badges
        </p>
      </div>

      {state.certificates.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/70 px-5 py-8 text-center">
          <Trophy className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-[14px] font-medium">No certificates yet</p>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Pass an assessment to earn your first credential.
          </p>
          <Link
            href="/certifications"
            className="mt-4 inline-flex rounded-xl bg-foreground px-4 py-2 text-[12px] font-semibold text-background"
          >
            Start a certification
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {state.certificates.map((c) => (
            <Link
              key={c.id}
              href={`/verify/${c.id}`}
              className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-card px-4 py-3 transition hover:border-[#C5A572]/40"
            >
              <div>
                <p className="text-[14px] font-semibold">{c.title}</p>
                <p className="text-[12px] text-muted-foreground">
                  {LEVEL_META[c.level].label} · Score {c.score}% ·{" "}
                  {new Date(c.issuedAt).toLocaleDateString()}
                </p>
              </div>
              <span className="text-[12px] text-muted-foreground">Verify →</span>
            </Link>
          ))}
        </div>
      )}

      {state.badges.length > 0 ? (
        <div>
          <h3 className="text-[13px] font-semibold text-muted-foreground">
            Badges
          </h3>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {state.badges.map((b) => (
              <span
                key={b}
                className="rounded-full border border-[#C5A572]/35 bg-[#C5A572]/10 px-2.5 py-1 text-[11px] text-foreground"
              >
                {b}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
