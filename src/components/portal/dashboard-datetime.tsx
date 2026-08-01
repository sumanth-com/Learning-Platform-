"use client";

import { useEffect, useState } from "react";
import { Clock3 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Desk calendar + clock. Client-only so the timezone is the user's;
 * keeps a stable footprint so nothing shifts after mount.
 *
 * Mobile: flat strip under the greeting (no nested card).
 * sm+: compact side card.
 */
export function DashboardDateTime({ className }: { className?: string }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = window.setInterval(tick, 20_000);
    return () => window.clearInterval(id);
  }, []);

  const month = now
    ? now.toLocaleDateString(undefined, { month: "short" }).toUpperCase()
    : "";
  const day = now ? String(now.getDate()) : "";
  const weekday = now
    ? now.toLocaleDateString(undefined, { weekday: "long" })
    : "";
  const fullDate = now
    ? now.toLocaleDateString(undefined, {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";
  const time = now
    ? now.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })
    : "";

  return (
    <div
      className={cn(
        // Mobile strip
        "flex w-full min-w-0 items-center gap-3 border-t border-border/50 pt-3",
        // Desktop side card
        "sm:w-auto sm:min-w-[15rem] sm:gap-3 sm:rounded-2xl sm:border sm:border-border/60 sm:bg-background/70 sm:px-3.5 sm:py-3 sm:pt-3",
        className
      )}
    >
      <div
        className={cn(
          "flex shrink-0 flex-col overflow-hidden rounded-xl border border-border/60",
          "h-11 w-11 bg-muted/40",
          "sm:h-[3.1rem] sm:w-[3.1rem] sm:bg-card"
        )}
      >
        <span className="flex h-4 items-center justify-center bg-primary/90 text-[8px] font-bold uppercase tracking-[0.12em] text-primary-foreground sm:h-[1.05rem] sm:bg-primary sm:text-[8.5px]">
          {month || "\u00A0"}
        </span>
        <span className="flex flex-1 items-center justify-center text-[15px] font-semibold tabular-nums leading-none tracking-tight text-foreground sm:text-[17px]">
          {day || "\u00A0"}
        </span>
      </div>

      <div className="min-w-0 flex-1 sm:flex-none">
        <p className="truncate text-[13px] font-semibold tracking-[-0.02em] text-foreground">
          {weekday || "\u00A0"}
        </p>
        <p className="mt-0.5 truncate text-[11.5px] leading-snug text-muted-foreground sm:mt-1 sm:leading-none">
          {fullDate || "\u00A0"}
        </p>
        <p className="mt-2 hidden items-center gap-1.5 text-[11.5px] font-medium leading-none tabular-nums tracking-tight text-foreground sm:inline-flex">
          <Clock3 className="h-3.5 w-3.5 text-primary" strokeWidth={2} />
          {time || "\u00A0"}
        </p>
      </div>

      <p className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-muted/60 px-2.5 py-1.5 text-[11.5px] font-medium tabular-nums tracking-tight text-foreground sm:hidden">
        <Clock3 className="h-3.5 w-3.5 text-primary" strokeWidth={2} />
        {time || "\u00A0"}
      </p>
    </div>
  );
}
