"use client";

import { cn } from "@/lib/utils";

type AssignmentProgressStripProps = {
  completed: number;
  remaining: number;
  xpEarned: number;
  streak: number;
  completionPct: number;
};

export function AssignmentProgressStrip({
  completed,
  remaining,
  xpEarned,
  streak,
  completionPct,
}: AssignmentProgressStripProps) {
  const items = [
    { label: "Completed", value: String(completed) },
    { label: "Remaining", value: String(remaining) },
    { label: "XP earned", value: xpEarned.toLocaleString() },
    { label: "Streak", value: `${streak}d` },
    { label: "Completion", value: `${completionPct}%` },
  ];

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
      {items.map((item) => (
        <div
          key={item.label}
          className={cn(
            "rounded-xl border border-border bg-card px-3 py-2.5",
            "shadow-sm shadow-black/5"
          )}
        >
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {item.label}
          </p>
          <p className="mt-1 text-lg font-semibold tabular-nums text-foreground">
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}
