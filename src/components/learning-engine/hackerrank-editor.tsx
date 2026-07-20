"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Loader2, Play, Terminal } from "lucide-react";
import type { LearnLesson } from "@/learning-engine/types";
import type { EditorLanguage } from "@/learning-engine/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { getWorkspaceConfig } from "./editor-workspace";

const LANG_LABELS: Record<EditorLanguage, string> = {
  java: "Java",
  sql: "SQL",
  json: "JSON",
  bash: "Terminal",
  text: "Plain Text",
  prompt: "Prompt",
};

interface HackerrankEditorProps {
  lesson: LearnLesson;
}

export function HackerrankEditor({ lesson }: HackerrankEditorProps) {
  const config = getWorkspaceConfig(lesson);
  const [editorCode, setEditorCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [running, setRunning] = useState(false);
  const [output, setOutput] = useState<string | null>(null);

  useEffect(() => {
    if (config) {
      setEditorCode(config.code);
      setOutput(null);
      setRunning(false);
    }
  }, [lesson.id, config?.code]);

  if (!config) {
    return (
      <div className="flex h-full items-center justify-center bg-[#0a0a0b] text-sm text-zinc-500">
        No editor available for this challenge type.
      </div>
    );
  }

  const safeCode = editorCode ?? "";
  const lines = safeCode.trim() ? safeCode.split("\n") : [""];
  const lineCount = lines.length;
  const colCount = (lines[lineCount - 1] ?? "").length + 1;

  const langClass =
    config.language === "sql"
      ? "text-sky-300"
      : config.language === "json"
        ? "text-amber-200"
        : config.language === "bash"
          ? "text-emerald-300"
          : config.language === "prompt"
            ? "text-violet-200"
            : "text-orange-200";

  const runCode = () => {
    setRunning(true);
    setOutput(null);
    window.setTimeout(() => {
      const input = config.sampleInput?.trim();
      const out = (config.expectedOutput ?? "").trim();
      setOutput(input ? `${input}${out.startsWith("\n") ? "" : "\n"}${out}` : out);
      setRunning(false);
    }, config.language === "sql" ? 600 : 800);
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(safeCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[#0a0a0b]">
      <div className="flex shrink-0 items-center gap-3 border-b border-zinc-800 bg-zinc-900/90 px-3 py-2">
        <span className="text-xs text-zinc-400">Language</span>
        <div className="rounded border border-zinc-700 bg-zinc-900 px-2.5 py-1 text-xs font-medium text-zinc-200">
          {LANG_LABELS[config.language]}
        </div>
        <div className="ml-auto flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-[11px] text-zinc-400 hover:text-zinc-200"
            onClick={copyCode}
          >
            {copied ? <Check className="mr-1 h-3 w-3" /> : <Copy className="mr-1 h-3 w-3" />}
            Copy
          </Button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto bg-[#0a0a0b] p-3">
        <pre className="font-mono text-[12px] leading-relaxed sm:text-[13px]">
          {lines.map((line, i) => (
            <div key={i} className="flex hover:bg-zinc-900/40">
              <span className="mr-4 w-8 shrink-0 select-none border-r border-zinc-800 pr-3 text-right text-[11px] text-zinc-600">
                {i + 1}
              </span>
              <code className={cn("block flex-1 whitespace-pre pl-3", langClass)}>{line || " "}</code>
            </div>
          ))}
        </pre>
      </div>

      <div className="shrink-0 border-t border-zinc-800 bg-zinc-950/80 px-3 py-0.5 text-[10px] text-zinc-600">
        Line: {lineCount} Col: {colCount}
      </div>

      <div className="flex shrink-0 border-t border-zinc-800 bg-zinc-950/80 px-3 py-2.5">
        <Button
          size="sm"
          className="ml-auto h-8 gap-1.5 bg-emerald-600 px-6 text-xs font-semibold hover:bg-emerald-500"
          onClick={runCode}
          disabled={running}
        >
          {running ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5 fill-current" />}
          {config.runLabel ?? "Run Code"}
        </Button>
      </div>

      <div className="flex h-[200px] shrink-0 flex-col border-t border-zinc-800 bg-zinc-950/90">
        <div className="flex shrink-0 items-center gap-2 border-b border-zinc-800 px-3 py-2">
          <Terminal className="h-3.5 w-3.5 text-zinc-500" />
          <span className="text-[11px] font-medium text-zinc-400">Output</span>
          {!running && output && (
            <span className="ml-auto rounded bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
              Accepted
            </span>
          )}
        </div>
        <div className="min-h-0 flex-1 overflow-auto p-3">
          {running ? (
            <p className="font-mono text-xs text-zinc-500">Running…</p>
          ) : output ? (
            <pre className="whitespace-pre-wrap font-mono text-xs text-emerald-300">{output}</pre>
          ) : (
            <p className="text-xs text-zinc-600">Run your code to see output here.</p>
          )}
        </div>
      </div>
    </div>
  );
}
