"use client";

import { Terminal } from "lucide-react";
import type { ExecutionTraceStep } from "@/learning-engine/types";

interface ExecutionOutputProps {
  exampleInput?: string;
  exampleOutput?: string;
  expectedOutput?: string;
  explanation?: string;
  executionTrace?: ExecutionTraceStep[];
}

export function ExecutionOutput({
  exampleInput,
  exampleOutput,
  expectedOutput,
  explanation,
  executionTrace,
}: ExecutionOutputProps) {
  const output = exampleOutput ?? expectedOutput;

  return (
    <div className="space-y-3">
      {(exampleInput || output) && (
        <div className="grid gap-3 sm:grid-cols-2">
          {exampleInput && (
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Input</p>
              <pre className="font-mono text-xs text-emerald-200">{exampleInput}</pre>
            </div>
          )}
          {output && (
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Output</p>
              <pre className="font-mono text-xs text-sky-200">{output}</pre>
            </div>
          )}
        </div>
      )}

      {explanation && (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-3">
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
            Line-by-Line Explanation
          </p>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-400">{explanation}</p>
        </div>
      )}

      {executionTrace && executionTrace.length > 0 && (
        <div className="overflow-hidden rounded-lg border border-zinc-800 bg-[#0a0a0b]">
          <div className="flex items-center gap-2 border-b border-zinc-800 px-3 py-1.5">
            <Terminal className="h-3.5 w-3.5 text-zinc-500" />
            <span className="text-[11px] font-medium text-zinc-400">Execution Trace</span>
          </div>
          <div className="divide-y divide-zinc-800/60">
            {executionTrace.map((step, i) => (
              <div key={i} className="grid grid-cols-[auto_1fr_1fr] gap-2 px-3 py-2 text-[11px] sm:grid-cols-[48px_1fr_1fr]">
                <span className="font-mono text-zinc-600">L{step.line}</span>
                <span className="text-zinc-400">{step.action}</span>
                <span className="font-mono text-amber-200/90">{step.state}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
