"use client";

import { useEffect, useRef } from "react";
import Editor, { type OnMount } from "@monaco-editor/react";
import type { editor as MonacoEditor } from "monaco-editor";
import { languageMeta } from "@/features/certifications/lib/editor-languages";
import { cn } from "@/lib/utils";

export function CertMonacoEditor({
  value,
  language = "javascript",
  onChange,
  className,
  height = "100%",
}: {
  value: string;
  language?: string;
  onChange: (value: string) => void;
  className?: string;
  height?: string | number;
}) {
  const ref = useRef<MonacoEditor.IStandaloneCodeEditor | null>(null);
  const meta = languageMeta(language);

  useEffect(() => {
    const ed = ref.current;
    if (!ed) return;
    const current = ed.getValue();
    if (value !== current) {
      ed.setValue(value);
    }
  }, [value]);

  const handleMount: OnMount = (editor) => {
    ref.current = editor;
    editor.updateOptions({
      fontSize: 14,
      fontFamily:
        "'Cascadia Code', 'Fira Code', 'JetBrains Mono', Menlo, Monaco, Consolas, monospace",
      fontLigatures: true,
      lineNumbers: "on",
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: language === "python" ? 4 : 2,
      insertSpaces: true,
      wordWrap: "on",
      bracketPairColorization: { enabled: true },
      padding: { top: 12, bottom: 12 },
      renderLineHighlight: "line",
      cursorBlinking: "smooth",
      smoothScrolling: true,
    });
    editor.focus();
  };

  return (
    <div
      className={cn(
        "flex h-full min-h-[320px] flex-col overflow-hidden rounded-xl border border-zinc-800 bg-[#0d1117]",
        className
      )}
    >
      <div className="flex shrink-0 items-center justify-between border-b border-zinc-800 bg-[#161b22] px-3 py-1.5">
        <span className="font-mono text-[11px] text-zinc-400">
          solution.{meta.ext}
        </span>
        <span className="text-[10px] uppercase tracking-wide text-zinc-500">
          Monaco · {meta.label}
        </span>
      </div>
      <div className="min-h-0 flex-1">
        <Editor
          key={meta.monaco}
          height={typeof height === "number" ? height : "100%"}
          theme="vs-dark"
          language={meta.monaco}
          defaultValue={value}
          onMount={handleMount}
          onChange={(v) => onChange(v ?? "")}
          loading={
            <div className="flex h-full items-center justify-center bg-[#0d1117] text-[12px] text-zinc-500">
              Loading code editor…
            </div>
          }
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  );
}
