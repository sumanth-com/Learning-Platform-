"use client";

import { useEffect, useRef, useState } from "react";
import {
  createInitialTerminalState,
  runCommand,
  type TerminalState,
} from "@/features/tooling/terminal/commands";
import { CommandChecklist } from "@/components/tooling/command-checklist";
import { cn } from "@/lib/utils";

type Line = { type: "in" | "out" | "err"; text: string };

type TerminalSimulatorProps = {
  className?: string;
  /** When true, show command checklist above the terminal */
  showChecklist?: boolean;
  goals?: string[];
  tip?: string;
  onCommand?: (command: string, state: TerminalState) => void;
  expectIncludes?: string[];
  onPracticeSuccess?: () => void;
  onGoalsProgress?: (completed: string[]) => void;
};

export function TerminalSimulator({
  className,
  showChecklist = false,
  goals = [],
  tip,
  onCommand,
  expectIncludes,
  onPracticeSuccess,
  onGoalsProgress,
}: TerminalSimulatorProps) {
  const checklistGoals =
    showChecklist && (goals.length > 0 || (expectIncludes?.length ?? 0) > 0)
      ? goals.length > 0
        ? goals
        : (expectIncludes ?? [])
      : [];

  const [state, setState] = useState<TerminalState>(() =>
    createInitialTerminalState()
  );
  const [lines, setLines] = useState<Line[]>([
    { type: "out", text: "SupraLearn Terminal — type help to begin." },
  ]);
  const [input, setInput] = useState("");
  const [historyIdx, setHistoryIdx] = useState<number | null>(null);
  const [completedGoals, setCompletedGoals] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  const markGoals = (command: string) => {
    const lower = command.toLowerCase();
    const newly = checklistGoals.filter((g) =>
      lower.includes(g.toLowerCase())
    );
    if (!newly.length) return completedGoals;
    const next = Array.from(new Set([...completedGoals, ...newly]));
    setCompletedGoals(next);
    onGoalsProgress?.(next);
    return next;
  };

  const submit = (raw: string) => {
    const command = raw.trim();
    if (!command) return;
    const result = runCommand(state, command);
    const nextLines: Line[] = [
      ...lines,
      { type: "in", text: `${state.cwd} $ ${command}` },
      ...result.lines.map((text) => ({
        type: (text.startsWith("fatal:") ||
        text.startsWith("error:") ||
        text.includes("not found")
          ? "err"
          : "out") as Line["type"],
        text,
      })),
    ];
    if (result.clear) {
      setLines([{ type: "out", text: "SupraLearn Terminal — screen cleared." }]);
    } else {
      setLines(nextLines);
    }
    setState(result.state);
    setInput("");
    setHistoryIdx(null);
    onCommand?.(command, result.state);

    const done = markGoals(command);
    const required = expectIncludes ?? checklistGoals;
    if (
      required.length &&
      required.every((frag) =>
        done.some((d) => d.toLowerCase() === frag.toLowerCase()) ||
        command.toLowerCase().includes(frag.toLowerCase())
      )
    ) {
      // Prefer cumulative checklist completion
      const allHit = required.every((frag) =>
        done.some((d) => d.toLowerCase() === frag.toLowerCase()) ||
        [...done, command].some((c) =>
          c.toLowerCase().includes(frag.toLowerCase())
        )
      );
      if (allHit) onPracticeSuccess?.();
    }
  };

  return (
    <div className={cn("flex min-h-0 flex-col gap-3", className)}>
      {checklistGoals.length > 0 ? (
        <CommandChecklist
          goals={checklistGoals}
          completed={completedGoals}
          cwd={state.cwd}
          tip={tip}
        />
      ) : null}
      <div
        className="flex min-h-[280px] flex-1 flex-col overflow-hidden rounded-xl border border-zinc-800 bg-[#0a0a0b] font-mono text-[13px] shadow-inner"
        onClick={() => inputRef.current?.focus()}
      >
        <div className="flex items-center gap-2 border-b border-zinc-800/80 px-3 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
          <span className="ml-2 text-[11px] text-zinc-500">
            bash — academy simulator
          </span>
        </div>
        <div className="min-h-0 flex-1 space-y-0.5 overflow-y-auto px-3 py-2 text-zinc-300">
          {lines.map((line, i) => (
            <div
              key={`${i}-${line.text.slice(0, 12)}`}
              className={cn(
                "whitespace-pre-wrap break-all",
                line.type === "in" && "text-emerald-400",
                line.type === "err" && "text-rose-400",
                line.type === "out" && "text-zinc-400"
              )}
            >
              {line.text}
            </div>
          ))}
          <div className="flex items-center gap-2 text-zinc-200">
            <span className="shrink-0 text-emerald-500">{state.cwd} $</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  submit(input);
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  const hist = state.history;
                  if (!hist.length) return;
                  const next =
                    historyIdx === null
                      ? hist.length - 1
                      : Math.max(0, historyIdx - 1);
                  setHistoryIdx(next);
                  setInput(hist[next] ?? "");
                } else if (e.key === "ArrowDown") {
                  e.preventDefault();
                  if (historyIdx === null) return;
                  const next = historyIdx + 1;
                  if (next >= state.history.length) {
                    setHistoryIdx(null);
                    setInput("");
                  } else {
                    setHistoryIdx(next);
                    setInput(state.history[next] ?? "");
                  }
                }
              }}
              className="min-w-0 flex-1 bg-transparent outline-none"
              spellCheck={false}
              autoComplete="off"
              aria-label="Terminal input"
            />
          </div>
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}
