"use client";

import { Shield } from "lucide-react";
import {
  CERT_RETRY_COOLDOWN_HOURS,
  splitCooldown,
} from "@/features/certifications/lib/retry-cooldown";
import { cn } from "@/lib/utils";

function DigitCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className={cn(
          "relative flex h-12 w-[2.75rem] items-center justify-center overflow-hidden rounded-lg border border-zinc-700/90",
          "bg-gradient-to-b from-[#1c2330] to-[#0d1117] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
        )}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-black/50"
        />
        <span className="font-mono text-[1.35rem] font-semibold tabular-nums tracking-tight text-[#27d17c]">
          {value}
        </span>
      </div>
      <span className="text-[9px] font-medium uppercase tracking-[0.16em] text-zinc-500">
        {label}
      </span>
    </div>
  );
}

function Colon() {
  return (
    <div className="flex h-12 items-center pb-4">
      <span className="animate-pulse font-mono text-[1.25rem] font-bold text-zinc-600">
        :
      </span>
    </div>
  );
}

export function RetestCooldownCard({
  cooldownMs,
  className,
}: {
  cooldownMs: number;
  className?: string;
}) {
  const { hours, minutes, seconds } = splitCooldown(cooldownMs);
  const unlocked = cooldownMs <= 0;

  return (
    <div
      className={cn(
        "w-full rounded-2xl border border-zinc-800 bg-card p-4 text-left",
        className
      )}
    >
      <p className="text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
        {unlocked ? "Retest available" : "Retest unlocks in"}
      </p>

      <div className="mt-3.5 flex items-end justify-center gap-2">
        <DigitCard value={unlocked ? "00" : hours} label="Hrs" />
        <Colon />
        <DigitCard value={unlocked ? "00" : minutes} label="Min" />
        <Colon />
        <DigitCard value={unlocked ? "00" : seconds} label="Sec" />
      </div>

      <div className="mt-4 flex gap-2.5 rounded-xl border border-zinc-800/90 bg-background/80 px-3 py-2.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#27d17c]/10">
          <Shield className="h-3.5 w-3.5 text-[#27d17c]" />
        </div>
        <div>
          <p className="text-[12px] font-medium text-zinc-200">Why the wait?</p>
          <p className="mt-0.5 text-[11.5px] leading-snug text-zinc-500">
            A {CERT_RETRY_COOLDOWN_HOURS}-hour cooldown keeps certifications
            meaningful — it stops rapid retries, gives you time to practice, and
            protects the value of a pass.
          </p>
        </div>
      </div>
    </div>
  );
}
