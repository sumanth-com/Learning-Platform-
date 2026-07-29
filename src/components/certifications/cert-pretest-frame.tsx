"use client";

import type { ReactNode } from "react";
import { CertTechLogo } from "@/components/certifications/cert-tech-logos";
import { categoryMeta } from "@/features/certifications/data/catalog";
import type { Certification } from "@/features/certifications/types";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: "welcome", label: "Brief" },
  { id: "sections", label: "Plan" },
  { id: "declaration", label: "Honor" },
  { id: "environment", label: "Ready" },
] as const;

export type PretestStep = (typeof STEPS)[number]["id"];

export function CertPretestFrame({
  certification,
  greeting,
  step,
  children,
  footer,
}: {
  certification: Certification;
  greeting?: string;
  step: PretestStep;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const meta = categoryMeta(certification.categoryId);
  const stepIndex = STEPS.findIndex((s) => s.id === step);

  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden bg-background text-foreground">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 60% 40% at 50% 0%, ${meta.accent}14, transparent 55%)`,
        }}
      />

      <div className="relative mx-auto flex h-full min-h-0 w-full max-w-3xl flex-col px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex shrink-0 items-center justify-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-card p-2 shadow-sm">
            <CertTechLogo id={certification.categoryId} size={28} />
          </div>
          <div className="min-w-0 text-left">
            <p className="text-[14px] font-semibold tracking-tight text-foreground">
              {certification.shortTitle}
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Skills certification
            </p>
          </div>
        </div>

        <nav className="mt-4 flex shrink-0 items-center justify-center gap-1.5 sm:mt-5 sm:gap-2">
          {STEPS.map((s, i) => {
            const done = i < stepIndex;
            const active = i === stepIndex;
            return (
              <div
                key={s.id}
                className="flex min-w-0 items-center gap-1.5 sm:gap-2"
              >
                <div
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold",
                    active && "bg-primary text-primary-foreground",
                    done && "bg-primary/25 text-primary",
                    !active &&
                      !done &&
                      "bg-muted text-muted-foreground"
                  )}
                >
                  {i + 1}
                </div>
                <span
                  className={cn(
                    "hidden text-[11px] sm:inline",
                    active ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {s.label}
                </span>
                {i < STEPS.length - 1 ? (
                  <div
                    className={cn(
                      "mx-1 hidden h-px w-8 sm:block sm:w-10",
                      done ? "bg-primary/40" : "bg-border"
                    )}
                  />
                ) : null}
              </div>
            );
          })}
        </nav>

        <div className="mt-4 flex min-h-0 flex-1 flex-col sm:mt-5">
          <div className="min-h-0 flex-1 overflow-y-auto rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
            {greeting ? (
              <p className="text-[13px] text-muted-foreground">
                Hey {greeting},
              </p>
            ) : null}
            {children}
          </div>

          {footer ? (
            <div className="mt-4 shrink-0 pb-1 sm:mt-5">{footer}</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function PretestStatRow({
  durationMinutes,
  questionCount,
}: {
  durationMinutes: number;
  questionCount: number;
}) {
  return (
    <div className="mt-5 grid grid-cols-2 gap-3 sm:mt-6">
      <div className="rounded-xl border border-border bg-muted/60 px-4 py-3">
        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
          Duration
        </p>
        <p className="mt-1 text-[18px] font-semibold text-foreground">
          {durationMinutes} min
        </p>
      </div>
      <div className="rounded-xl border border-border bg-muted/60 px-4 py-3">
        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
          Questions
        </p>
        <p className="mt-1 text-[18px] font-semibold text-foreground">
          {questionCount}
        </p>
      </div>
    </div>
  );
}

export function PretestPrimaryButton({
  children,
  onClick,
  disabled,
}: {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "rounded-xl bg-primary px-6 py-2.5 text-[14px] font-bold text-primary-foreground transition hover:bg-primary/90",
        disabled && "cursor-not-allowed opacity-40 hover:bg-primary"
      )}
    >
      {children}
    </button>
  );
}

export function PretestGhostButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-xl border border-border px-5 py-2.5 text-[14px] font-medium text-foreground transition hover:border-foreground/30 hover:bg-foreground/5"
    >
      {children}
    </button>
  );
}
