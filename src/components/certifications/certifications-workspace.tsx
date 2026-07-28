"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Info } from "lucide-react";
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
  const { state, isPassed, ready, clearAttempt } = useCertifications();
  const [focus, setFocus] = useState<CertCategoryId | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const earned = ready ? state.certificates.length : 0;

  const list = useMemo(() => {
    if (!focus) return CERTIFICATIONS;
    return CERTIFICATIONS.filter((c) => c.categoryId === focus);
  }, [focus]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("done");
    if (id) setHighlightId(id);
  }, []);

  useEffect(() => {
    if (!highlightId) return;
    const el = document.getElementById(`cert-card-${highlightId}`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    const t = window.setTimeout(() => setHighlightId(null), 4200);
    return () => window.clearTimeout(t);
  }, [highlightId]);

  // Keep cooldown labels live, and clear expired fails so cards look fresh
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!ready) return;
    for (const [id, attempt] of Object.entries(state.attempts)) {
      if (
        attempt.status === "failed" &&
        msUntilRetry(attempt.finishedAt, now) <= 0
      ) {
        clearAttempt(id);
      }
    }
  }, [ready, state.attempts, now, clearAttempt]);

  // Duplicate for seamless marquee
  const marquee = [...SHOWCASE, ...SHOWCASE];

  return (
    <>
      <PortalChrome title="Certifications" fillViewport />
      <div className="h-full min-h-0 overflow-y-auto bg-background">
        <section className="relative overflow-hidden border-b border-border">
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
              <p className="text-[12px] text-muted-foreground">
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
                        : "border-border hover:border-foreground/25 hover:-translate-y-1"
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
                    <span className="relative text-[11px] font-medium text-muted-foreground group-hover:text-foreground">
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
              const hasCertificate = state.certificates.some(
                (c) => c.certificationId === cert.id
              );
              const cooldown =
                attempt?.status === "failed"
                  ? msUntilRetry(attempt.finishedAt, now)
                  : 0;
              const onCooldown = cooldown > 0;
              const inProgress = attempt?.status === "in-progress";
              const highlighted = highlightId === cert.id;

              return (
                <article
                  id={`cert-card-${cert.id}`}
                  key={cert.id}
                  className={cn(
                    "relative overflow-hidden rounded-xl border bg-card p-5 transition",
                    passed
                      ? "border-[#27d17c]/40"
                      : "border-border hover:border-foreground/20",
                    highlighted &&
                      "ring-2 ring-[#27d17c]/45 ring-offset-2 ring-offset-background"
                  )}
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-3 -top-3 h-28 w-28 rounded-full opacity-[0.12] blur-2xl"
                    style={{ background: meta.accent }}
                  />
                  <div className="relative flex items-start gap-3.5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border bg-background/80 p-2">
                      <CertTechLogo id={cert.categoryId} size={32} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-[16px] font-semibold leading-snug text-foreground">
                              {cert.shortTitle}
                            </h2>
                            {passed ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-[#27d17c]/12 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#1f8f55]">
                                <CheckCircle2 className="h-3 w-3" />
                                Done
                              </span>
                            ) : null}
                            {onCooldown && !passed ? (
                              <span className="inline-flex items-center rounded-full bg-amber-500/12 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
                                Cooling down
                              </span>
                            ) : null}
                            {inProgress && !passed ? (
                              <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                                In progress
                              </span>
                            ) : null}
                          </div>
                          <p className="mt-1.5 text-[12px] text-muted-foreground">
                            {LEVEL_META[cert.level].label} ·{" "}
                            {cert.durationMinutes} min · {cert.questionCount}{" "}
                            questions
                            {passed && attempt?.score != null
                              ? ` · Score ${attempt.score}%`
                              : ""}
                            {onCooldown
                              ? ` · Retest in ${formatCooldown(cooldown)}`
                              : ""}
                          </p>
                        </div>
                        <button
                          type="button"
                          className="shrink-0 rounded-full p-1 text-muted-foreground hover:text-foreground"
                          title={`${cert.durationMinutes} min · ${cert.questionCount} questions · Pass ${cert.passingScore}%`}
                        >
                          <Info className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <Link
                    href={
                      passed
                        ? hasCertificate
                          ? CERT_FLOW.certificate(cert.id)
                          : CERT_FLOW.results(cert.id)
                        : onCooldown
                          ? CERT_FLOW.retest(cert.id)
                          : inProgress
                            ? continueHref(cert.id, attempt?.lastPath)
                            : CERT_FLOW.root(cert.id)
                    }
                    className={cn(
                      "relative mt-6 inline-flex rounded-md border px-3.5 py-1.5 text-[13px] font-medium transition",
                      passed
                        ? "border-[#27d17c]/45 bg-[#27d17c]/10 text-[#1f8f55] hover:bg-[#27d17c]/16"
                        : onCooldown
                          ? "border-border text-muted-foreground hover:border-foreground/30"
                          : "border-border text-foreground hover:border-foreground hover:bg-foreground/5"
                    )}
                  >
                    {passed
                      ? hasCertificate
                        ? "Download PDF"
                        : "Generate certificate"
                      : inProgress
                        ? "Continue"
                        : onCooldown
                          ? `Retest in ${formatCooldown(cooldown)}`
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
