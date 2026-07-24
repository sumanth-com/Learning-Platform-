"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Info } from "lucide-react";
import { PortalChrome } from "@/components/portal/portal-chrome";
import { CertTechLogo } from "@/components/certifications/cert-tech-logos";
import {
  CERT_CATEGORIES,
  CERTIFICATIONS,
  LEVEL_META,
  categoryMeta,
} from "@/features/certifications/data/catalog";
import { useCertifications } from "@/features/certifications/hooks/use-certifications";
import { CERT_FLOW } from "@/features/certifications/lib/paths";
import {
  formatCooldown,
  msUntilRetry,
} from "@/features/certifications/lib/retry-cooldown";
import type { CertCategoryId } from "@/features/certifications/types";
import { cn } from "@/lib/utils";

const SHOWCASE = CERT_CATEGORIES.slice(0, 14);

function continueHref(certId: string, lastPath?: string) {
  if (!lastPath || lastPath === "landing") return CERT_FLOW.root(certId);
  if (lastPath.startsWith("problems/")) {
    return `/certifications/${certId}/${lastPath}`;
  }
  const map: Record<string, string> = {
    brief: CERT_FLOW.brief(certId),
    plan: CERT_FLOW.plan(certId),
    confirm: CERT_FLOW.confirm(certId),
    honor: CERT_FLOW.honor(certId),
    ready: CERT_FLOW.ready(certId),
    lobby: CERT_FLOW.lobby(certId),
    results: CERT_FLOW.results(certId),
    certificate: CERT_FLOW.certificate(certId),
  };
  return map[lastPath] ?? CERT_FLOW.lobby(certId);
}

export function CertificationsWorkspace() {
  const { state, isPassed, ready } = useCertifications();
  const [focus, setFocus] = useState<CertCategoryId | null>(null);
  const earned = ready ? state.certificates.length : 0;

  const list = useMemo(() => {
    if (!focus) return CERTIFICATIONS;
    return CERTIFICATIONS.filter((c) => c.categoryId === focus);
  }, [focus]);

  // Duplicate for seamless marquee
  const marquee = [...SHOWCASE, ...SHOWCASE];

  return (
    <>
      <PortalChrome title="Certifications" fillViewport />
      <div className="h-full min-h-0 overflow-y-auto bg-background">
        <section className="relative overflow-hidden border-b border-zinc-800/70">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 70% 80% at 20% 0%, rgba(39,209,124,0.08), transparent 50%), radial-gradient(ellipse 50% 60% at 90% 20%, rgba(97,218,251,0.06), transparent 45%)",
            }}
          />

          <div className="relative mx-auto max-w-6xl px-4 pt-8 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[12px] text-zinc-500">
                {focus
                  ? SHOWCASE.find((c) => c.id === focus)?.label
                  : `${CERTIFICATIONS.length} certifications`}
                {earned > 0 ? ` · ${earned} earned` : ""}
              </p>
              {focus ? (
                <button
                  type="button"
                  onClick={() => setFocus(null)}
                  className="text-[12px] text-[#27d17c] hover:underline"
                >
                  Show all
                </button>
              ) : null}
            </div>
          </div>

          {/* Creative logo card marquee */}
          <div className="relative mt-5 pb-8">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-background to-transparent sm:w-20" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-background to-transparent sm:w-20" />

            <div className="cert-marquee flex w-max gap-3 px-4 sm:gap-4 sm:px-6">
              {marquee.map((cat, i) => {
                const active = focus === cat.id;
                return (
                  <button
                    key={`${cat.id}-${i}`}
                    type="button"
                    onClick={() =>
                      setFocus((prev) => (prev === cat.id ? null : cat.id))
                    }
                    className={cn(
                      "group relative flex h-[92px] w-[108px] shrink-0 flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border bg-card transition duration-300 sm:h-[100px] sm:w-[120px]",
                      active
                        ? "border-[#27d17c]/60 shadow-[0_0_0_1px_rgba(39,209,124,0.25)]"
                        : "border-zinc-800 hover:border-zinc-600 hover:-translate-y-1"
                    )}
                    title={cat.label}
                  >
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100"
                      style={{
                        background: `radial-gradient(circle at 50% 30%, ${cat.accent}22, transparent 65%)`,
                      }}
                    />
                    <span className="relative flex h-10 w-10 items-center justify-center sm:h-11 sm:w-11">
                      <CertTechLogo id={cat.id} size={40} />
                    </span>
                    <span className="relative text-[11px] font-medium text-zinc-400 group-hover:text-zinc-200">
                      {cat.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((cert) => {
              const meta = categoryMeta(cert.categoryId);
              const passed = isPassed(cert.id);
              const attempt = state.attempts[cert.id];
              const cooldown =
                attempt?.status === "failed"
                  ? msUntilRetry(attempt.finishedAt)
                  : 0;
              const onCooldown = cooldown > 0;
              return (
                <article
                  key={cert.id}
                  className="relative overflow-hidden rounded-xl border border-zinc-800 bg-card p-5 transition hover:border-zinc-700"
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-3 -top-3 h-28 w-28 rounded-full opacity-[0.12] blur-2xl"
                    style={{ background: meta.accent }}
                  />
                  <div className="relative flex items-start gap-3.5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-zinc-800 bg-background/80 p-2">
                      <CertTechLogo id={cert.categoryId} size={32} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h2 className="text-[16px] font-semibold leading-snug text-foreground">
                          {cert.shortTitle}
                        </h2>
                        <button
                          type="button"
                          className="shrink-0 rounded-full p-1 text-zinc-500 hover:text-zinc-300"
                          title={`${cert.durationMinutes} min · ${cert.questionCount} questions · Pass ${cert.passingScore}%`}
                        >
                          <Info className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="mt-1.5 text-[12px] text-zinc-500">
                        {LEVEL_META[cert.level].label} · {cert.durationMinutes}{" "}
                        min · {cert.questionCount} questions
                        {passed ? " · Certified" : ""}
                        {attempt?.status === "in-progress"
                          ? " · In progress"
                          : ""}
                        {onCooldown
                          ? ` · Retest in ${formatCooldown(cooldown)}`
                          : attempt?.status === "failed"
                            ? " · Retest open"
                            : ""}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={
                      passed
                        ? CERT_FLOW.certificate(cert.id)
                        : attempt?.status === "in-progress"
                          ? continueHref(cert.id, attempt.lastPath)
                          : attempt?.status === "failed"
                            ? CERT_FLOW.results(cert.id)
                            : CERT_FLOW.root(cert.id)
                    }
                    className={cn(
                      "relative mt-6 inline-flex rounded-md border px-3.5 py-1.5 text-[13px] font-medium transition",
                      onCooldown && !passed
                        ? "border-zinc-700 text-zinc-400 hover:border-zinc-500"
                        : "border-zinc-500 text-foreground hover:border-foreground hover:bg-foreground/5"
                    )}
                  >
                    {passed
                      ? "View certificate"
                      : attempt?.status === "in-progress"
                        ? "Continue"
                        : onCooldown
                          ? `Retest in ${formatCooldown(cooldown)}`
                          : attempt?.status === "failed"
                            ? "Retest"
                            : "Get Certified"}
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes certMarquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .cert-marquee {
          animation: certMarquee 42s linear infinite;
        }
        .cert-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </>
  );
}
