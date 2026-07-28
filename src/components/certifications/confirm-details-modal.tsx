"use client";

import { useEffect, useState } from "react";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

function splitName(full: string) {
  const parts = full.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { first: "", last: "" };
  if (parts.length === 1) return { first: parts[0]!, last: "" };
  return {
    first: parts[0]!,
    last: parts.slice(1).join(" "),
  };
}

const fieldClass =
  "mt-1.5 h-11 w-full rounded-xl border border-border bg-background px-3.5 text-[14px] text-foreground outline-none placeholder:text-muted-foreground/70 transition focus:border-[#27d17c]/60 focus:ring-2 focus:ring-[#27d17c]/20";

export function ConfirmDetailsModal({
  open,
  defaultFullName,
  onCancel,
  onStart,
}: {
  open: boolean;
  defaultFullName: string;
  onCancel: () => void;
  onStart: (fullName: string) => void;
}) {
  const initial = splitName(defaultFullName);
  const [firstName, setFirstName] = useState(initial.first);
  const [lastName, setLastName] = useState(initial.last);

  useEffect(() => {
    if (!open) return;
    const next = splitName(defaultFullName);
    setFirstName(next.first);
    setLastName(next.last);
  }, [open, defaultFullName]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  const first = firstName.trim();
  const last = lastName.trim();
  const valid = first.length >= 1 && last.length >= 1;
  const previewName = valid ? `${first} ${last}` : "Your full name";

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-foreground/30 backdrop-blur-[2px]"
        aria-label="Close dialog"
        onClick={onCancel}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-details-title"
        className="relative w-full max-w-md rounded-2xl border border-border bg-popover p-6 text-popover-foreground shadow-[0_24px_60px_-28px_rgba(15,23,42,0.45)] sm:p-7"
      >
        <h2
          id="confirm-details-title"
          className="text-[20px] font-semibold tracking-tight text-foreground"
        >
          Confirm your details
        </h2>
        <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
          This name appears on your certificate and can&apos;t be changed later.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="block text-[13px] font-medium text-foreground">
            First name <span className="text-rose-500">*</span>
            <input
              autoFocus
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={fieldClass}
              placeholder="First name"
              autoComplete="given-name"
              required
            />
          </label>

          <label className="block text-[13px] font-medium text-foreground">
            Last name <span className="text-rose-500">*</span>
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className={fieldClass}
              placeholder="Last name"
              autoComplete="family-name"
              required
            />
          </label>
        </div>

        <div className="mt-4 rounded-xl border border-border/80 bg-muted/50 px-3.5 py-3">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            On your certificate
          </p>
          <p
            className={cn(
              "mt-1 text-[15px] font-semibold tracking-tight",
              valid ? "text-foreground" : "text-muted-foreground/70"
            )}
          >
            {previewName}
          </p>
        </div>

        <div className="mt-4 flex gap-2.5 rounded-xl border border-border/80 bg-muted/40 px-3.5 py-3">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#1f8f55]" />
          <p className="text-[12.5px] leading-relaxed text-muted-foreground">
            Find a quiet spot with a stable connection before you start. Good
            luck.
          </p>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2.5 border-t border-border pt-5">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-border px-4 py-2.5 text-[13px] font-medium text-foreground transition hover:bg-muted"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!valid}
            onClick={() => {
              if (!valid) return;
              onStart(`${first} ${last}`);
            }}
            className={cn(
              "rounded-xl bg-[#27d17c] px-5 py-2.5 text-[13px] font-bold text-zinc-950 transition hover:bg-[#3ee08d]",
              !valid && "cursor-not-allowed opacity-40 hover:bg-[#27d17c]"
            )}
          >
            Start test
          </button>
        </div>
      </div>
    </div>
  );
}
