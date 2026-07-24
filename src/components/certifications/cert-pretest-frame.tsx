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
    <div className="relative flex h-full min-h-0 flex-col overflow-y-auto bg-background text-foreground">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 60% 40% at 50% 0%, ${meta.accent}14, transparent 55%)`,
        }}
      />

      <div className="relative mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-8 sm:px-6 sm:py-10">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-800 bg-card p-2">
            <CertTechLogo id={certification.categoryId} size={28} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-medium text-zinc-200">
              {certification.shortTitle}
            </p>
            <p className="text-[11px] text-zinc-500">Skills certification</p>
          </div>
        </div>

        <nav className="mt-8 flex items-center gap-1.5 sm:gap-2">
          {STEPS.map((s, i) => {
            const done = i < stepIndex;
            const active = i === stepIndex;
            return (
              <div key={s.id} className="flex min-w-0 flex-1 items-center gap-1.5 sm:gap-2">
                <div
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold",
                    active && "bg-[#27d17c] text-zinc-950",
                    done && "bg-[#27d17c]/25 text-[#27d17c]",
                    !active && !done && "bg-zinc-800 text-zinc-500"
                  )}
                >
                  {i + 1}
                </div>
                <span
                  className={cn(
                    "hidden truncate text-[11px] sm:inline",
                    active ? "text-zinc-200" : "text-zinc-600"
                  )}
                >
                  {s.label}
                </span>
                {i < STEPS.length - 1 ? (
                  <div
                    className={cn(
                      "mx-1 hidden h-px flex-1 sm:block",
                      done ? "bg-[#27d17c]/40" : "bg-zinc-800"
                    )}
                  />
                ) : null}
              </div>
            );
          })}
        </nav>

        <div className="mt-8 rounded-2xl border border-zinc-800/90 bg-card p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:p-8">
          {greeting ? (
            <p className="text-[13px] text-zinc-500">Hey {greeting},</p>
          ) : null}
          {children}
        </div>

        {footer ? <div className="mt-6 pb-4">{footer}</div> : null}
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
    <div className="mt-8 grid grid-cols-2 gap-3">
      <div className="rounded-xl border border-zinc-800 bg-muted/80 px-4 py-3">
        <p className="text-[11px] uppercase tracking-wide text-zinc-500">
          Duration
        </p>
        <p className="mt-1 text-[18px] font-semibold text-foreground">
          {durationMinutes} min
        </p>
      </div>
      <div className="rounded-xl border border-zinc-800 bg-muted/80 px-4 py-3">
        <p className="text-[11px] uppercase tracking-wide text-zinc-500">
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
        "rounded-xl bg-[#27d17c] px-6 py-3 text-[14px] font-bold text-zinc-950 transition hover:bg-[#3ee08d]",
        disabled && "cursor-not-allowed opacity-40 hover:bg-[#27d17c]"
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
      className="rounded-xl border border-zinc-600 px-5 py-3 text-[14px] font-medium text-zinc-200 transition hover:border-zinc-400 hover:bg-foreground/5"
    >
      {children}
    </button>
  );
}
