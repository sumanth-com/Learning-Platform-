"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function CertificateNameModal({
  open,
  defaultName,
  onCancel,
  onGenerate,
}: {
  open: boolean;
  defaultName: string;
  onCancel: () => void;
  onGenerate: (name: string) => void;
}) {
  const [name, setName] = useState(defaultName);

  useEffect(() => {
    if (open) setName(defaultName);
  }, [open, defaultName]);

  if (!open) return null;

  const trimmed = name.trim();
  const valid = trimmed.length >= 3 && trimmed.length <= 100;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal
        aria-labelledby="cert-name-title"
        className="w-full max-w-md rounded-2xl border border-border/70 bg-card p-6 shadow-2xl"
      >
        <h2
          id="cert-name-title"
          className="text-[18px] font-semibold tracking-tight text-foreground"
        >
          Generate Certificate
        </h2>
        <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
          Please confirm the name exactly as you want it to appear on your
          certificate.
        </p>
        <label className="mt-5 block text-[12px] font-medium text-muted-foreground">
          Certificate Name
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={100}
            className="mt-1.5 h-11 w-full rounded-xl border border-border/70 bg-background px-3 text-[14px] text-foreground outline-none focus:ring-2 focus:ring-[#C5A572]/35"
          />
        </label>
        <p className="mt-1.5 text-[11px] text-muted-foreground">
          {trimmed.length}/100 · minimum 3 characters
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-border/70 px-4 py-2 text-[13px] font-medium hover:bg-muted"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!valid}
            onClick={() => {
              if (!valid) {
                toast.error("Name must be 3–100 characters");
                return;
              }
              onGenerate(trimmed);
            }}
            className={cn(
              "rounded-xl bg-foreground px-4 py-2 text-[13px] font-semibold text-background",
              !valid && "opacity-40"
            )}
          >
            Generate Certificate
          </button>
        </div>
      </div>
    </div>
  );
}
