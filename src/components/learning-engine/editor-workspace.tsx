"use client";

import { useEffect, useState } from "react";
import { Copy, Check, Play, Loader2, Terminal } from "lucide-react";
import type { LearnLesson } from "@/learning-engine/types";
import { isJavaLike } from "@/learning-engine/types";
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

interface WorkspaceConfig {
  language: EditorLanguage;
  filename: string;
  code: string;
  expectedOutput: string;
  sampleInput?: string;
  runLabel?: string;
  solutionLabel?: string;
}

export function getWorkspaceConfig(lesson: LearnLesson): WorkspaceConfig | null {
  if (isJavaLike(lesson)) {
    return {
      language: "java",
      filename: lesson.filename ?? "Solution.java",
      code: lesson.code ?? "",
      expectedOutput: lesson.expectedOutput ?? "",
      sampleInput: lesson.exampleInput,
      runLabel: "Run Code",
      solutionLabel: "Your Solution (Java)",
    };
  }
  if (lesson.category === "sql") {
    const rows = lesson.expectedResult?.rows ?? [];
    return {
      language: "sql",
      filename: `${lesson.topicSlug}.sql`,
      code: lesson.query ?? "-- SQL query",
      expectedOutput: rows.map((r) => r.join(" | ")).join("\n"),
      runLabel: "Execute",
      solutionLabel: "SQL Query",
    };
  }
  if (lesson.category === "rest-api") {
    return {
      language: "json",
      filename: "response.json",
      code: lesson.responseBody,
      expectedOutput: `HTTP ${lesson.statusCode} ${lesson.method} ${lesson.endpoint}`,
      runLabel: "Send Request",
      solutionLabel: "Response JSON",
    };
  }
  if (lesson.category === "git") {
    return {
      language: "bash",
      filename: "terminal",
      code: lesson.command,
      expectedOutput: lesson.terminalOutput,
      runLabel: "Run Command",
      solutionLabel: "Terminal",
    };
  }
  if (lesson.category === "ai") {
    return {
      language: "prompt",
      filename: "prompt.txt",
      code: lesson.prompt,
      expectedOutput: lesson.aiOutput,
      runLabel: "Simulate AI",
      solutionLabel: "Prompt",
    };
  }
  if (lesson.category === "security") {
    const code = lesson.code ?? JSON.stringify(lesson.headers, null, 2);
    return {
      language: lesson.editorLanguage === "java" ? "java" : "json",
      filename: lesson.filename ?? "security.json",
      code,
      expectedOutput: lesson.exampleApi,
      solutionLabel: "Security Config",
    };
  }
  if (lesson.category === "mongodb") {
    return {
      language: "json",
      filename: `${lesson.collection}.mongodb`,
      code: lesson.query,
      expectedOutput: lesson.expectedOutput,
      runLabel: "Run Query",
      solutionLabel: "MongoDB Query",
    };
  }
  return null;
}

export function lessonHasWorkspace(lesson: LearnLesson): boolean {
  return getWorkspaceConfig(lesson) !== null;
}

export function EditorWorkspace({ lesson }: { lesson: LearnLesson }) {
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
      <div className="flex h-full items-center justify-center p-8 text-center text-sm text-zinc-500">
        No code workspace for this lesson type.
      </div>
    );
  }

  const safeCode = editorCode ?? "";
  const lines = safeCode.trim() ? safeCode.trim().split("\n") : [""];
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

  const handleRun = () => {
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
      <div className="flex shrink-0 items-center gap-2 border-b border-zinc-800 bg-zinc-900/90 px-3 py-2">
        <span className="text-xs font-medium text-zinc-300">{config.solutionLabel}</span>
        <span className={cn("text-[10px] font-medium uppercase", langClass)}>
          {LANG_LABELS[config.language]}
        </span>
        <div className="ml-auto flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={copyCode}>
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          </Button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-3">
        <pre className="font-mono text-[12px] leading-relaxed sm:text-[13px]">
          {lines.map((line, i) => (
            <div key={i} className="flex">
              <span className="mr-4 w-6 shrink-0 select-none text-right text-zinc-600">{i + 1}</span>
              <code className={cn("whitespace-pre", langClass)}>{line || " "}</code>
            </div>
          ))}
        </pre>
      </div>

      <div className="flex shrink-0 border-t border-zinc-800 bg-zinc-950/80 px-3 py-2.5">
        <Button
          size="sm"
          className="h-8 gap-1.5 bg-emerald-600 px-6 text-xs font-semibold hover:bg-emerald-500"
          onClick={handleRun}
          disabled={running}
        >
          {running ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5 fill-current" />}
          {config.runLabel ?? "Run Code"}
        </Button>
      </div>

      <div className="flex h-[220px] shrink-0 flex-col border-t border-zinc-800 bg-zinc-950/90">
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
            <pre className="whitespace-pre-wrap font-mono text-xs text-zinc-300">{output}</pre>
          ) : (
            <p className="text-xs text-zinc-600">Run your code to see output here.</p>
          )}
        </div>
      </div>
    </div>
  );
}
