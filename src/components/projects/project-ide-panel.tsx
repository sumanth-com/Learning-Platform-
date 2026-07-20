"use client";

import { useEffect, useState } from "react";
import { Copy, Check, Play, Loader2, Terminal } from "lucide-react";
import type { InlineProjectDetail } from "@/curriculum/project-content/types";
import { cn } from "@/lib/utils";
import { learnCodeClass, learnOutputClass, learnProseClass } from "@/components/shared/learn-answer-cards";
import { Button } from "@/components/ui/button";

interface ProjectIdePanelProps {
  detail: InlineProjectDetail;
  className?: string;
}

export function ProjectIdePanel({ detail, className }: ProjectIdePanelProps) {
  const [copied, setCopied] = useState(false);
  const [running, setRunning] = useState(false);
  const [terminalOut, setTerminalOut] = useState<string | null>(null);

  const classNameFromFile = detail.filename.replace(/\.java$/, "");
  const codeLines = detail.code.trim().split("\n");
  const showOutput = running || terminalOut !== null;

  useEffect(() => {
    setTerminalOut(null);
    setRunning(false);
    setCopied(false);
  }, [detail.filename, detail.code]);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(detail.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const handleRun = () => {
    setRunning(true);
    setTerminalOut(null);
    window.setTimeout(() => {
      const input = detail.sampleInput?.trim();
      const output = detail.sampleOutput.trim();
      setTerminalOut(input ? `${input}${output.startsWith("\n") ? "" : "\n"}${output}` : output);
      setRunning(false);
    }, 800);
  };

  return (
    <div className={cn("flex h-full min-h-0 flex-col overflow-hidden", className)}>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-zinc-800 bg-[#0a0a0b]">
        <div className="flex shrink-0 items-center gap-2 border-b border-zinc-800 bg-zinc-900/90 px-2 py-1.5 sm:px-3">
          <div className="flex min-w-0 items-center gap-1 overflow-x-auto">
            <span className="shrink-0 rounded-md bg-zinc-800 px-2.5 py-1 font-mono text-[11px] font-medium text-zinc-200 ring-1 ring-zinc-700/80">
              {detail.filename}
            </span>
            <span className="hidden text-[10px] text-zinc-600 sm:inline">Java</span>
          </div>
          <div className="ml-auto flex shrink-0 items-center gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 px-2 text-[11px] text-zinc-400 hover:text-zinc-200"
              onClick={copyCode}
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy"}
            </Button>
            <Button
              size="sm"
              className="h-7 gap-1.5 bg-emerald-600 px-3 text-[11px] font-semibold text-white hover:bg-emerald-500 disabled:opacity-70"
              onClick={handleRun}
              disabled={running}
            >
              {running ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Play className="h-3.5 w-3.5 fill-current" />
              )}
              {running ? "Running…" : "Run"}
            </Button>
          </div>
        </div>

        <div className={cn("min-h-0 overflow-auto bg-[#0d1117]", showOutput ? "flex-[3]" : "flex-1")}>
          <div className="flex min-h-full font-mono text-[11px] leading-[1.55] sm:text-xs sm:leading-[1.6]">
            <div
              className="sticky left-0 shrink-0 select-none border-r border-zinc-800/80 bg-[#0d1117] py-3 pl-3 pr-2 text-right text-zinc-600"
              aria-hidden
            >
              {codeLines.map((_, i) => (
                <div key={i} className="h-[1.55em] sm:h-[1.6em]">
                  {i + 1}
                </div>
              ))}
            </div>
            <pre className="min-w-0 flex-1 overflow-x-auto py-3 pr-4">
              <code className={cn(learnCodeClass, "mt-0 block whitespace-pre text-[11px] sm:text-xs")}>
                {detail.code.trim()}
              </code>
            </pre>
          </div>
        </div>

        {showOutput && (
          <div className="flex min-h-0 flex-[2] flex-col border-t border-zinc-800 bg-[#0a0a0b]">
            <div className="flex shrink-0 items-center gap-2 border-b border-zinc-800 px-3 py-1.5">
              <Terminal className="h-3.5 w-3.5 text-emerald-500/90" />
              <span className="border-b-2 border-emerald-500 pb-0.5 text-[11px] font-semibold text-zinc-200">
                Output
              </span>
              {terminalOut && !running && (
                <span className="ml-1 rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-400">
                  Success
                </span>
              )}
            </div>
            <pre className="min-h-0 flex-1 overflow-auto px-4 py-3">
              <code className={cn(learnOutputClass, "mt-0 text-[11px] sm:text-xs")}>
                {running
                  ? `$ javac ${detail.filename}\n$ java ${classNameFromFile}\n\nRunning…`
                  : terminalOut}
              </code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

interface ProjectDescriptionProps {
  overview: string;
  explanation: string;
  footer?: React.ReactNode;
  className?: string;
}

export function ProjectDescription({ overview, explanation, footer, className }: ProjectDescriptionProps) {
  return (
    <div className={cn("min-h-0 overflow-y-auto overscroll-contain", className)}>
      <div className="space-y-5 p-4 sm:p-5">
        <section>
          <h3 className="mb-2 text-sm font-semibold text-zinc-100">Description</h3>
          <p className={cn(learnProseClass, "whitespace-pre-wrap leading-relaxed text-zinc-400")}>{overview}</p>
        </section>
        <section className="border-t border-zinc-800/60 pt-5">
          <h3 className="mb-2 text-sm font-semibold text-zinc-100">Explanation</h3>
          <p className={cn(learnProseClass, "whitespace-pre-wrap leading-relaxed text-zinc-400")}>{explanation}</p>
        </section>
        {footer && <section className="border-t border-zinc-800/60 pt-5">{footer}</section>}
      </div>
    </div>
  );
}
