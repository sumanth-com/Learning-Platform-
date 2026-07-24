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

  if (!open) return null;

  const first = firstName.trim();
  const last = lastName.trim();
  const valid = first.length >= 1 && last.length >= 1;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal
        aria-labelledby="confirm-details-title"
        className="w-full max-w-md rounded-2xl border border-zinc-700/80 bg-card p-6 shadow-2xl sm:p-7"
      >
        <h2
          id="confirm-details-title"
          className="text-[22px] font-semibold tracking-tight text-foreground"
        >
          Confirm your details
        </h2>
        <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-400">
          This will be displayed on your certificate and cannot be changed later
        </p>

        <label className="mt-6 block text-[13px] font-medium text-zinc-300">
          First Name <span className="text-rose-400">*</span>
          <input
            autoFocus
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="mt-1.5 h-11 w-full rounded-xl border border-zinc-600/80 bg-muted px-3 text-[14px] text-foreground outline-none placeholder:text-zinc-600 focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400/40"
            placeholder="First name"
            required
          />
        </label>

        <label className="mt-4 block text-[13px] font-medium text-zinc-300">
          Last Name <span className="text-rose-400">*</span>
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="mt-1.5 h-11 w-full rounded-xl border border-zinc-600/80 bg-muted px-3 text-[14px] text-foreground outline-none placeholder:text-zinc-600 focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400/40"
            placeholder="Last name"
            required
          />
        </label>

        <div className="mt-5 flex gap-2.5 rounded-xl border border-zinc-700/60 bg-muted/80 px-3.5 py-3">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" />
          <p className="text-[12.5px] leading-relaxed text-zinc-400">
            Make sure you&apos;re in a quiet environment with a stable internet
            connection. Good Luck!
          </p>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2.5 border-t border-zinc-800 pt-5">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-zinc-600 px-4 py-2.5 text-[13px] font-medium text-zinc-200 transition hover:bg-zinc-800"
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
              "rounded-xl bg-[#c8f542] px-5 py-2.5 text-[13px] font-bold text-zinc-950 transition hover:bg-[#d4ff5c]",
              !valid && "cursor-not-allowed opacity-40"
            )}
          >
            Start Test
          </button>
        </div>
      </div>
    </div>
  );
}
