"use client";

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
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal
        aria-labelledby="submit-test-title"
        className="w-full max-w-md rounded-2xl border border-zinc-700/80 bg-card p-6 shadow-2xl"
      >
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/15">
            <AlertTriangle className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <h2
              id="submit-test-title"
              className="text-[18px] font-semibold tracking-tight text-foreground"
            >
              Submit this test?
            </h2>
            <p className="mt-1 text-[13px] text-zinc-400">
              Please read these before you confirm.
            </p>
          </div>
        </div>

        <ul className="mt-5 space-y-2.5 text-[13px] leading-relaxed text-zinc-300">
          <li className="rounded-xl border border-zinc-800 bg-muted/80 px-3.5 py-2.5">
            Your answers for all {questionCount} questions will be graded as they
            are now
            {unansweredCount > 0
              ? ` (${unansweredCount} look unfinished).`
              : "."}
          </li>
          <li className="rounded-xl border border-zinc-800 bg-muted/80 px-3.5 py-2.5">
            The timer stops and you can’t edit this attempt after submit.
          </li>
          <li className="rounded-xl border border-zinc-800 bg-muted/80 px-3.5 py-2.5">
            Passing score is required to earn the certificate.
          </li>
          <li className="rounded-xl border border-zinc-800 bg-muted/80 px-3.5 py-2.5">
            If you don’t pass, you can retest after{" "}
            {CERT_RETRY_COOLDOWN_HOURS} hours — not immediately.
          </li>
        </ul>

        <div className="mt-6 flex items-center justify-end gap-2.5 border-t border-zinc-800 pt-5">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-zinc-600 px-4 py-2.5 text-[13px] font-medium text-zinc-200 transition hover:bg-zinc-800"
          >
            Keep working
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={cn(
              "rounded-xl bg-[#27d17c] px-5 py-2.5 text-[13px] font-bold text-zinc-950 transition hover:bg-[#3ee08d]"
            )}
          >
            Confirm submit
          </button>
        </div>
      </div>
    </div>
  );
}
