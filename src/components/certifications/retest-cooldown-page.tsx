"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Clock3, Shield } from "lucide-react";
import { CertTechLogo } from "@/components/certifications/cert-tech-logos";
import { LEVEL_META } from "@/features/certifications/data/catalog";
import { useCertifications } from "@/features/certifications/hooks/use-certifications";
import { CERT_FLOW } from "@/features/certifications/lib/paths";
import {
  CERT_RETRY_COOLDOWN_HOURS,
  msUntilRetry,
  splitCooldown,
} from "@/features/certifications/lib/retry-cooldown";
import type { CertCategoryId, CertLevel } from "@/features/certifications/types";
import { cn } from "@/lib/utils";

type CertMeta = {
  id: string;
  categoryId: CertCategoryId;
  shortTitle: string;
  level: CertLevel;
  durationMinutes: number;
  questionCount: number;
};

function DigitCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className={cn(
          "relative flex h-14 w-12 items-center justify-center overflow-hidden rounded-xl border border-border",
          "bg-card shadow-sm"
        )}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={value}
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -14, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="absolute font-mono text-[1.45rem] font-semibold tabular-nums tracking-tight text-primary"
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

function Colon() {
  return (
    <div className="flex h-14 items-center pb-5">
      <motion.span
        className="font-mono text-[1.25rem] font-bold text-muted-foreground/50"
        animate={{ opacity: [0.35, 1, 0.35] }}
        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
      >
        :
      </motion.span>
    </div>
  );
}

export function RetestCooldownPage({ meta }: { meta: CertMeta }) {
  const router = useRouter();
  const { state, ready, clearAttempt } = useCertifications();
  const [now, setNow] = useState(() => Date.now());

  const attempt = state.attempts[meta.id];
  const isFailed = attempt?.status === "failed";
  const cooldownMs = isFailed ? msUntilRetry(attempt?.finishedAt, now) : 0;
  const unlocked = isFailed && cooldownMs <= 0;
  const { hours, minutes, seconds } = splitCooldown(cooldownMs);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (!isFailed) {
      router.replace("/certifications");
    }
  }, [ready, isFailed, router]);

  const startRetest = () => {
    clearAttempt(meta.id);
    router.push(CERT_FLOW.root(meta.id));
  };

  if (!ready) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }

  if (!isFailed) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        Opening…
      </div>
    );
  }

  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_color-mix(in_srgb,var(--color-primary)_8%,transparent),_transparent_55%)]"
      />

      <div className="relative mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center px-5 py-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative w-full overflow-hidden rounded-[1.5rem] border border-border/70 bg-card p-6 shadow-[0_20px_50px_-28px_rgba(15,23,42,0.35)] sm:p-8"
        >
          {/* Subtle right-edge waterfall accent */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-4 right-3 w-[2px] overflow-hidden rounded-full bg-emerald-500/10"
          >
            <motion.div
              className="absolute left-0 right-0 h-1/3 rounded-full"
              style={{
                background:
                  "linear-gradient(to bottom, transparent, color-mix(in srgb, var(--color-primary) 85%, transparent), transparent)",
                boxShadow:
                  "0 0 10px color-mix(in srgb, var(--color-primary) 45%, transparent)",
              }}
              animate={{ top: ["-35%", "110%"] }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </div>

          <div className="flex items-center gap-3.5 pr-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border bg-background p-2">
              <CertTechLogo id={meta.categoryId} size={32} />
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-[17px] font-semibold tracking-tight text-foreground">
                {meta.shortTitle}
              </h1>
              <p className="mt-1 flex items-center gap-1.5 text-[12px] text-muted-foreground">
                <Clock3 className="h-3.5 w-3.5 shrink-0" />
                <span>
                  {LEVEL_META[meta.level].label} · {meta.durationMinutes} min ·{" "}
                  {meta.questionCount} questions
                </span>
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-border/80 bg-muted/20 p-5">
            {unlocked ? (
              <div className="text-center">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
                  Ready to certify
                </p>
                <h2 className="mt-3 text-[18px] font-semibold tracking-tight text-foreground">
                  Start fresh
                </h2>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
                  Your cooldown is over. Take the assessment again when you&apos;re
                  ready — same flow as getting certified for the first time.
                </p>
              </div>
            ) : (
              <>
                <p className="text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Retest unlocks in
                </p>

                <div className="mt-4 flex items-end justify-center gap-2.5">
                  <DigitCard value={hours} label="Hrs" />
                  <Colon />
                  <DigitCard value={minutes} label="Min" />
                  <Colon />
                  <DigitCard value={seconds} label="Sec" />
                </div>

                <div className="mt-5 rounded-xl border border-border/70 bg-background/90 px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/12">
                      <Shield className="h-3.5 w-3.5 text-primary" />
                    </span>
                    <p className="text-[12px] font-semibold tracking-tight text-foreground">
                      Cooldown policy
                    </p>
                  </div>
                  <ul className="mt-2.5 space-y-1.5 pl-0.5 text-[12px] leading-relaxed text-muted-foreground">
                    <li className="flex gap-2">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary/70" />
                      <span>
                        A {CERT_RETRY_COOLDOWN_HOURS}-hour wait applies after an
                        unsuccessful attempt.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary/70" />
                      <span>
                        Use this time to review concepts and practice related
                        problems.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary/70" />
                      <span>
                        Cooldowns protect credential quality and keep passes
                        meaningful for hiring.
                      </span>
                    </li>
                  </ul>
                </div>
              </>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-2.5">
            <AnimatePresence>
              {unlocked ? (
                <motion.button
                  type="button"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  onClick={startRetest}
                  className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-[13px] font-bold text-primary-foreground transition hover:brightness-110"
                >
                  Get Certified
                </motion.button>
              ) : null}
            </AnimatePresence>
            <Link
              href="/certifications"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-[13px] font-medium text-foreground transition hover:bg-muted/50"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to certifications
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
