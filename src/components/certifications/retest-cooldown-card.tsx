"use client";

import { AnimatePresence, motion } from "framer-motion";
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
          "relative flex h-12 w-[2.75rem] items-center justify-center overflow-hidden rounded-lg border border-border",
          "bg-zinc-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
        )}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={value}
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute font-mono text-[1.35rem] font-semibold tabular-nums tracking-tight text-[#27d17c]"
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
    <div className="flex h-12 items-center pb-4">
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
        "w-full rounded-2xl border border-border/80 bg-muted/20 p-4 text-left",
        className
      )}
    >
      <p className="text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {unlocked ? "Retest available" : "Retest unlocks in"}
      </p>

      <div className="mt-3.5 flex items-end justify-center gap-2">
        <DigitCard value={unlocked ? "00" : hours} label="Hrs" />
        <Colon />
        <DigitCard value={unlocked ? "00" : minutes} label="Min" />
        <Colon />
        <DigitCard value={unlocked ? "00" : seconds} label="Sec" />
      </div>

      <div className="mt-4 rounded-xl border border-border/70 bg-background/90 px-4 py-3.5">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#27d17c]/12">
            <Shield className="h-3.5 w-3.5 text-[#27d17c]" />
          </span>
          <p className="text-[12px] font-semibold tracking-tight text-foreground">
            Cooldown policy
          </p>
        </div>
        <ul className="mt-2.5 space-y-1.5 text-[12px] leading-relaxed text-muted-foreground">
          <li className="flex gap-2">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#27d17c]/70" />
            <span>
              A {CERT_RETRY_COOLDOWN_HOURS}-hour wait applies after an
              unsuccessful attempt.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#27d17c]/70" />
            <span>
              Use this time to review concepts and practice related problems.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#27d17c]/70" />
            <span>
              Cooldowns protect credential quality and keep passes meaningful
              for hiring.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
