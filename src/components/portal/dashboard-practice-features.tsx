"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Code2, Share2 } from "lucide-react";
import { toast } from "sonner";
import { useProgressStore } from "@/store/use-progress-store";
import { useStoreHydrated } from "@/hooks/use-store-hydrated";
import { useMinWidth } from "@/hooks/use-min-width";
import { isMobileAllowedLearnModuleSlug } from "@/lib/portal-mobile";
import { cn } from "@/lib/utils";

export type ResumeModuleCard = {
  slug: string;
  title: string;
  phaseTitle: string;
  progressPercent: number;
  href: string;
  cta: string;
};

type DashboardPracticeFeaturesProps = {
  modules: ResumeModuleCard[];
};

const LEVEL_COLORS = [
  "bg-muted/70",
  "bg-[#f1a379]/70",
  "bg-[#e56b68]/55",
  "bg-emerald-400/80",
  "bg-emerald-600",
] as const;

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

const CELL_GAP = "3px";
const DAY_COL = "2.4rem";
const MOBILE_DAY_COL = "1.6rem";

export function DashboardPracticeFeatures({
  modules,
}: DashboardPracticeFeaturesProps) {
  const hydrated = useStoreHydrated();
  const isMdUp = useMinWidth(768);
  const companionMobile = isMdUp === false;
  const completionDates = useProgressStore((s) => s.progress.completionDates);

  const visibleModules = useMemo(() => {
    if (!companionMobile) return modules;
    return modules
      .filter((m) => isMobileAllowedLearnModuleSlug(m.slug))
      .slice(0, 1);
  }, [companionMobile, modules]);

  const { cells, monthLabels, maxCount, weekCount, activeDays } = useMemo(
    () =>
      buildHeatmap(Object.values(completionDates), companionMobile ? 13 : null),
    [completionDates, companionMobile]
  );

  const shareStreak = async () => {
    const text = `I've practiced on ${activeDays} days this year on Suprabase.`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Practice streak", text });
        return;
      }
      await navigator.clipboard.writeText(text);
      toast.success("Streak summary copied");
    } catch {
      /* ignore cancel */
    }
  };

  const dayCol = companionMobile ? MOBILE_DAY_COL : DAY_COL;

  return (
    <div className="flex w-full shrink-0 flex-col gap-2.5 sm:gap-3">
      {visibleModules.length > 0 ? (
        <div className="flex flex-col gap-2.5">
          {visibleModules.map((mod) => (
            <article
              key={mod.slug}
              className="flex flex-col gap-3 overflow-hidden rounded-2xl border border-border/60 bg-card p-3.5 sm:flex-row sm:items-center sm:gap-4 sm:p-4 max-md:p-3"
            >
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary max-md:h-9 max-md:w-9">
                  <Code2 className="h-4 w-4" strokeWidth={2} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <h3 className="truncate text-[14px] font-semibold tracking-tight text-foreground max-md:text-[13.5px]">
                      {mod.title}
                    </h3>
                    <span className="truncate text-[11px] text-muted-foreground">
                      {mod.phaseTitle}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-2.5">
                    <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-[width] duration-500"
                        style={{
                          width: `${Math.max(0, Math.min(100, mod.progressPercent))}%`,
                        }}
                      />
                    </div>
                    <span className="shrink-0 text-[11px] font-medium tabular-nums text-muted-foreground">
                      {mod.progressPercent}%
                    </span>
                  </div>
                </div>
              </div>
              <Link
                href={mod.href}
                className="inline-flex h-9 shrink-0 items-center justify-center rounded-xl bg-primary px-4 text-[12.5px] font-semibold tracking-tight text-primary-foreground transition hover:opacity-90 max-md:h-10 max-md:w-full"
              >
                {mod.cta}
              </Link>
            </article>
          ))}
        </div>
      ) : null}

      <section className="w-full overflow-hidden rounded-2xl border border-border/60 bg-card p-3.5 sm:p-5 max-md:p-3">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-[14px] font-semibold tracking-tight text-foreground max-md:text-[13.5px]">
              Practice streak
            </h3>
            {companionMobile && hydrated ? (
              <p className="mt-0.5 text-[11.5px] text-muted-foreground">
                {activeDays} active day{activeDays === 1 ? "" : "s"} · last{" "}
                {weekCount} weeks
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => void shareStreak()}
            aria-label="Share practice streak"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <Share2 className="h-3.5 w-3.5" />
          </button>
        </div>

        {!hydrated ? (
          <div className="mt-4 h-[7rem] w-full animate-pulse rounded-xl bg-muted/40 sm:mt-5 sm:h-[8rem]" />
        ) : (
          <div className="mt-4 w-full min-w-0 overflow-hidden sm:mt-5">
            <div
              className="mb-1.5 grid w-full"
              style={{
                gap: CELL_GAP,
                gridTemplateColumns: `${dayCol} repeat(${weekCount}, minmax(0, 1fr))`,
              }}
            >
              <span aria-hidden />
              {monthLabels.map((label, i) => (
                <span
                  key={`m-${i}`}
                  className="overflow-hidden whitespace-nowrap text-left text-[9.5px] font-medium leading-none text-muted-foreground sm:text-[10px]"
                >
                  {label || "\u00A0"}
                </span>
              ))}
            </div>

            <div
              className="grid w-full"
              style={{
                gap: CELL_GAP,
                gridTemplateColumns: `${dayCol} repeat(${weekCount}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(7, minmax(0, 1fr))`,
                aspectRatio: `${1.8 + weekCount} / 7`,
                maxHeight: companionMobile ? "6.75rem" : "9.5rem",
              }}
            >
              {WEEKDAYS.map((day, row) => (
                <span
                  key={day}
                  style={{ gridColumn: 1, gridRow: row + 1 }}
                  className="flex items-center text-[9.5px] font-medium leading-none text-muted-foreground sm:text-[10px]"
                >
                  {companionMobile ? day.slice(0, 1) : day}
                </span>
              ))}

              {cells.map((cell, index) => {
                const week = Math.floor(index / 7);
                const weekday = index % 7;
                return (
                  <div
                    key={cell.date}
                    title={
                      cell.pad
                        ? undefined
                        : `${cell.date}: ${cell.count} completion${cell.count === 1 ? "" : "s"}`
                    }
                    style={{
                      gridColumn: week + 2,
                      gridRow: weekday + 1,
                    }}
                    className={cn(
                      "min-h-0 min-w-0 rounded-[3px] sm:rounded-[4px]",
                      cell.pad ? "bg-transparent" : LEVEL_COLORS[cell.level]
                    )}
                  />
                );
              })}
            </div>

            <div className="mt-3 flex items-center justify-end gap-1.5 text-[10px] text-muted-foreground">
              <span>Less</span>
              {LEVEL_COLORS.map((color, i) => (
                <span
                  key={color}
                  className={cn("h-2.5 w-2.5 rounded-[3px]", color)}
                  title={
                    i === 0
                      ? "No practice"
                      : `Level ${i}${maxCount ? ` · up to ${maxCount}/day` : ""}`
                  }
                />
              ))}
              <span>More</span>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

type HeatCell = {
  date: string;
  count: number;
  level: number;
  pad?: boolean;
};

function buildHeatmap(rawDates: string[], weekLimit: number | null) {
  const counts = new Map<string, number>();
  for (const raw of rawDates) {
    const day = toDayKey(raw);
    if (!day) continue;
    counts.set(day, (counts.get(day) ?? 0) + 1);
  }

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const start = new Date(end);
  if (weekLimit != null) {
    start.setDate(start.getDate() - weekLimit * 7 + 1);
  } else {
    start.setDate(start.getDate() - 364);
  }
  start.setHours(0, 0, 0, 0);
  while (start.getDay() !== 1) {
    start.setDate(start.getDate() - 1);
  }

  const cells: HeatCell[] = [];
  const cursor = new Date(start);
  let maxCount = 0;

  while (cursor <= end) {
    const key = toDayKey(localIso(cursor))!;
    const count = counts.get(key) ?? 0;
    maxCount = Math.max(maxCount, count);
    cells.push({ date: key, count, level: 0 });
    cursor.setDate(cursor.getDate() + 1);
  }

  while (cells.length % 7 !== 0) {
    const key = toDayKey(localIso(cursor))!;
    cells.push({ date: `pad-${key}`, count: 0, level: 0, pad: true });
    cursor.setDate(cursor.getDate() + 1);
  }

  for (const cell of cells) {
    if (cell.pad) continue;
    cell.level = intensityLevel(cell.count, maxCount);
  }

  const weekCount = cells.length / 7;
  const monthLabels = Array.from({ length: weekCount }, () => "");
  const activeDays = cells.filter((c) => c.count > 0 && !c.pad).length;

  for (let w = 0; w < weekCount; w++) {
    const week = cells.slice(w * 7, w * 7 + 7);
    const firstOfMonth = week.find((c) => {
      if (c.pad) return false;
      return parseLocal(c.date).getDate() === 1;
    });

    if (firstOfMonth) {
      monthLabels[w] = parseLocal(firstOfMonth.date).toLocaleString(undefined, {
        month: "short",
      });
      continue;
    }

    if (w === 0) {
      const first = week.find((c) => !c.pad);
      if (first) {
        monthLabels[w] = parseLocal(first.date).toLocaleString(undefined, {
          month: "short",
        });
      }
    }
  }

  return { cells, monthLabels, maxCount, weekCount, activeDays };
}

function intensityLevel(count: number, max: number) {
  if (count <= 0) return 0;
  if (max <= 1) return 4;
  const ratio = count / max;
  if (ratio <= 0.25) return 1;
  if (ratio <= 0.5) return 2;
  if (ratio <= 0.75) return 3;
  return 4;
}

function localIso(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function toDayKey(value: string) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return localIso(d);
}

function parseLocal(dayKey: string) {
  return new Date(`${dayKey}T12:00:00`);
}
