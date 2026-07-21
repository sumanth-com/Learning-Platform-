"use client";

import type { VisualGitStage } from "@/features/tooling/terminal/commands";
import { cn } from "@/lib/utils";

const BOXES = [
  { key: "working" as const, label: "Working Directory", hint: "files you edit" },
  { key: "staging" as const, label: "Staging Area", hint: "git add" },
  { key: "local" as const, label: "Local Repository", hint: "git commit" },
  { key: "remote" as const, label: "Remote", hint: "git push / pull" },
];

export function VisualGit({ stage }: { stage: VisualGitStage }) {
  const last = stage.lastAction?.toLowerCase() ?? "";
  const active = last.includes("git add")
    ? "staging"
    : last.includes("git commit")
      ? "local"
      : last.includes("git push") || last.includes("git pull") || last.includes("git fetch")
        ? "remote"
        : last.includes("git")
          ? "working"
          : null;

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
          Visual Git
        </p>
        <p className="truncate text-[11px] text-zinc-500">
          branch <span className="text-emerald-400">{stage.branch}</span>
          {stage.lastAction ? (
            <>
              {" "}
              · last <span className="text-zinc-400">{stage.lastAction}</span>
            </>
          ) : null}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {BOXES.map((box, i) => {
          const count = stage[box.key];
          const isActive = active === box.key;
          return (
            <div key={box.key} className="relative">
              {i < BOXES.length - 1 ? (
                <div className="pointer-events-none absolute -right-2 top-1/2 hidden h-px w-4 -translate-y-1/2 bg-zinc-700 sm:block" />
              ) : null}
              <div
                className={cn(
                  "rounded-lg border px-2.5 py-2 transition",
                  isActive
                    ? "border-emerald-500/50 bg-emerald-500/10 shadow-[0_0_20px_-8px_rgba(16,185,129,0.5)]"
                    : "border-zinc-800 bg-zinc-900/50"
                )}
              >
                <p className="text-[11px] font-medium text-zinc-200">{box.label}</p>
                <p className="text-[10px] text-zinc-500">{box.hint}</p>
                <p className="mt-1 text-lg font-semibold tabular-nums text-zinc-100">
                  {count}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
