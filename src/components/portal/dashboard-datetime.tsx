"use client";

import { useEffect, useState } from "react";
import { Clock3 } from "lucide-react";

/**
 * Little desk-calendar + clock. Rendered client-side only so the timezone is
 * the user's; the box keeps a fixed footprint so nothing shifts after mount.
 */
export function DashboardDateTime() {
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
    <div className="flex w-full shrink-0 items-center gap-3 rounded-2xl border border-border/70 bg-background/70 px-3.5 py-3 sm:w-auto sm:min-w-[15rem]">
      <div className="relative shrink-0">
        <span
          aria-hidden
          className="absolute -top-[3px] left-2.5 h-1.5 w-1.5 rounded-full bg-border"
        />
        <span
          aria-hidden
          className="absolute -top-[3px] right-2.5 h-1.5 w-1.5 rounded-full bg-border"
        />
        <div className="flex h-[3.1rem] w-[3.1rem] flex-col overflow-hidden rounded-xl border border-border/70 bg-card shadow-[0_2px_8px_-4px_rgba(20,20,25,0.25)]">
          <span className="flex h-[1.05rem] items-center justify-center bg-brand text-[8.5px] font-bold uppercase tracking-[0.14em] text-white">
            {month || "\u00A0"}
          </span>
          <span className="flex flex-1 items-center justify-center text-[17px] font-semibold tabular-nums leading-none text-foreground">
            {day || "\u00A0"}
          </span>
        </div>
      </div>

      <div className="min-w-0">
        <p className="truncate text-[13px] font-semibold leading-none text-foreground">
          {weekday || "\u00A0"}
        </p>
        <p className="mt-1.5 truncate text-[11.5px] leading-none text-muted-foreground">
          {fullDate || "\u00A0"}
        </p>
        <p className="mt-2 inline-flex items-center gap-1.5 text-[11.5px] font-medium leading-none tabular-nums text-foreground">
          <Clock3 className="h-3.5 w-3.5 text-brand" />
          {time || "\u00A0"}
        </p>
      </div>
    </div>
  );
}
