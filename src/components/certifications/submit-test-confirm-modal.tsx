"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { CERT_RETRY_COOLDOWN_HOURS } from "@/features/certifications/lib/retry-cooldown";
import { cn } from "@/lib/utils";

export function SubmitTestConfirmModal({
  open,
  questionCount,
  unansweredCount,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  questionCount: number;
  unansweredCount: number;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-foreground/30 backdrop-blur-[2px]"
        aria-label="Close dialog"
        onClick={onCancel}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="submit-test-title"
        className="relative w-full max-w-md rounded-2xl border border-border bg-popover p-6 text-popover-foreground shadow-[0_24px_60px_-28px_rgba(15,23,42,0.45)]"
      >
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500/12">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
          </div>
          <div className="min-w-0">
            <h2
              id="submit-test-title"
              className="text-[18px] font-semibold tracking-tight text-foreground"
            >
              Submit this test?
            </h2>
            <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
              Please read these before you confirm.
            </p>
          </div>
        </div>

        <ul className="mt-5 space-y-2 text-[13px] leading-relaxed text-muted-foreground">
          <li className="rounded-xl border border-border/80 bg-muted/50 px-3.5 py-2.5 text-foreground/90">
            Your answers for all {questionCount} questions will be graded as they
            are now
            {unansweredCount > 0
              ? ` (${unansweredCount} look unfinished).`
              : "."}
          </li>
          <li className="rounded-xl border border-border/80 bg-muted/50 px-3.5 py-2.5 text-foreground/90">
            The timer stops and you can&apos;t edit this attempt after submit.
          </li>
          <li className="rounded-xl border border-border/80 bg-muted/50 px-3.5 py-2.5 text-foreground/90">
            Passing score is required to earn the certificate.
          </li>
          <li className="rounded-xl border border-border/80 bg-muted/50 px-3.5 py-2.5 text-foreground/90">
            If you don&apos;t pass, you can retest after{" "}
            {CERT_RETRY_COOLDOWN_HOURS} hours — not immediately.
          </li>
        </ul>

        <div className="mt-6 flex items-center justify-end gap-2.5 border-t border-border pt-5">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-border px-4 py-2.5 text-[13px] font-medium text-foreground transition hover:bg-muted"
          >
            Keep working
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={cn(
              "rounded-xl bg-primary px-5 py-2.5 text-[13px] font-bold text-primary-foreground transition hover:bg-primary/90"
            )}
          >
            Confirm submit
          </button>
        </div>
      </div>
    </div>
  );
}
