"use client";

import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

type CommandChecklistProps = {
  goals: string[];
  completed: string[];
  cwd?: string;
  tip?: string;
};

export function CommandChecklist({
  goals,
  completed,
  cwd,
  tip,
}: CommandChecklistProps) {
  const doneSet = new Set(completed.map((g) => g.toLowerCase()));
  const allDone =
    goals.length > 0 &&
    goals.every((g) => doneSet.has(g.toLowerCase()));

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
          Command checklist
        </p>
        {cwd ? (
          <p className="truncate font-mono text-[11px] text-zinc-500">
            {cwd}
          </p>
        ) : null}
      </div>
      <ul className="space-y-1.5">
        {goals.map((goal) => {
          const done = doneSet.has(goal.toLowerCase());
          return (
            <li
              key={goal}
              className={cn(
                "flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-sm transition",
                done
                  ? "border-emerald-500/35 bg-emerald-500/10 text-emerald-300"
                  : "border-zinc-800 bg-zinc-900/40 text-zinc-400"
              )}
            >
              {done ? (
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
              ) : (
                <Circle className="h-3.5 w-3.5 shrink-0 text-zinc-600" />
              )}
              <code className="font-mono text-[12px]">{goal}</code>
            </li>
          );
        })}
      </ul>
      <p className="mt-2 text-[11px] text-zinc-500">
        {allDone
          ? "All steps done. You can submit on the left."
          : tip ?? "Run each command in the terminal below."}
      </p>
    </div>
  );
}
