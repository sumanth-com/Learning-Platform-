"use client";

import { useEffect, useState } from "react";
import { Copy, Check, Play, Loader2, Terminal } from "lucide-react";
import type { EditorLanguage } from "@/learning-engine/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const LANG_LABELS: Record<EditorLanguage, string> = {
  java: "Java",
  sql: "SQL",
  json: "JSON",
  bash: "Terminal",
  text: "Plain Text",
  prompt: "Prompt",
};

interface CodeWorkspaceProps {
  language: EditorLanguage;
  filename: string;
  code: string;
  expectedOutput: string;
  sampleInput?: string;
  className?: string;
  runLabel?: string;
  /** When true, editor fills remaining column height (Java IDE layout). */
  fillHeight?: boolean;
}

export function CodeWorkspace({
  language,
  filename,
  code,
  expectedOutput,
  sampleInput,
  className,
  runLabel = "Run",
  fillHeight = false,
}: CodeWorkspaceProps) {
  const [copied, setCopied] = useState(false);
  const [running, setRunning] = useState(false);
  const [output, setOutput] = useState<string | null>(null);

  useEffect(() => {
    setOutput(null);
    setRunning(false);
    setCopied(false);
  }, [filename, code]);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(safeCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const handleRun = () => {
    setRunning(true);
    setOutput(null);
    window.setTimeout(() => {
      const input = sampleInput?.trim();
      const out = (expectedOutput ?? "").trim();
      setOutput(input ? `${input}${out.startsWith("\n") ? "" : "\n"}${out}` : out);
      setRunning(false);
    }, language === "sql" ? 600 : 800);
  };

  const safeCode = code ?? "";
  const lines = safeCode.trim() ? safeCode.trim().split("\n") : [""];
  const langClass =
    language === "sql"
      ? "text-sky-300"
      : language === "json"
        ? "text-amber-200"
        : language === "bash"
          ? "text-emerald-300"
          : language === "prompt"
            ? "text-violet-200"
            : "text-orange-200";

  return (
    <div
      className={cn(
        "flex min-h-0 flex-col",
        fillHeight ? "h-full flex-1 overflow-hidden" : "h-auto shrink-0",
        className
      )}
    >
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-zinc-800 bg-[#0a0a0b]">
        <div className="flex shrink-0 items-center gap-2 border-b border-zinc-800 bg-zinc-900/90 px-2 py-1.5 sm:px-3">
          <span className="shrink-0 rounded-md bg-zinc-800 px-2.5 py-1 font-mono text-[11px] font-medium text-zinc-200 ring-1 ring-zinc-700/80">
            {filename}
          </span>
          <span className={cn("text-[10px] font-medium uppercase tracking-wide", langClass)}>
            {LANG_LABELS[language]}
          </span>
          <div className="ml-auto flex shrink-0 items-center gap-1.5">
            <Button variant="ghost" size="sm" className="h-7 gap-1 px-2 text-[11px]" onClick={copyCode}>
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy"}
            </Button>
            <Button
              size="sm"
              className="h-7 gap-1.5 bg-emerald-600 px-3 text-[11px] font-semibold text-white hover:bg-emerald-500"
              onClick={handleRun}
              disabled={running}
            >
              {running ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5 fill-current" />}
              {runLabel}
            </Button>
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-auto p-3 sm:p-4">
          <pre className="font-mono text-[12px] leading-relaxed sm:text-[13px]">
            {lines.map((line, i) => (
              <div key={i} className="flex">
                <span className="mr-4 w-6 shrink-0 select-none text-right text-zinc-600">{i + 1}</span>
                <code className={cn("whitespace-pre", langClass)}>{line || " "}</code>
              </div>
            ))}
          </pre>
        </div>
      </div>

      {(running || output !== null) && (
        <div className="mt-3 shrink-0 overflow-hidden rounded-lg border border-zinc-800 bg-[#0a0a0b]">
          <div className="flex items-center gap-2 border-b border-zinc-800 px-3 py-1.5">
            <Terminal className="h-3.5 w-3.5 text-zinc-500" />
            <span className="text-[11px] font-medium text-zinc-400">
              {language === "sql" ? "Query Result" : language === "bash" ? "Terminal Output" : "Output"}
            </span>
            {!running && output && (
              <span className="ml-auto rounded bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-medium text-emerald-400">
                Success
              </span>
            )}
          </div>
          <pre className="max-h-40 overflow-auto p-3 font-mono text-[12px] text-zinc-300">
            {running ? "Running…" : output}
          </pre>
        </div>
      )}
    </div>
  );
}
