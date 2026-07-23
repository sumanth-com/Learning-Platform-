"use client";

import { memo, useEffect, useRef } from "react";
import Editor, { type OnMount } from "@monaco-editor/react";
import type { editor as MonacoEditor } from "monaco-editor";
import { useTheme } from "@/components/theme/theme-provider";
import { cn } from "@/lib/utils";

type ProjectMonacoViewerProps = {
  value: string;
  language: string;
  className?: string;
};

function ProjectMonacoViewerInner({
  value,
  language,
  className,
}: ProjectMonacoViewerProps) {
  const { theme } = useTheme();
  const monacoTheme = theme === "light" ? "light" : "vs-dark";
  const instanceRef = useRef<MonacoEditor.IStandaloneCodeEditor | null>(null);

  const handleMount: OnMount = (editor, monaco) => {
    instanceRef.current = editor;
    monaco.editor.setTheme(monacoTheme);
    editor.updateOptions({
      readOnly: true,
      domReadOnly: true,
      readOnlyMessage: { value: "Read-only lab reference — copy is fine." },
      fontSize: 13,
      fontFamily:
        "'Cascadia Code', 'Fira Code', 'JetBrains Mono', Menlo, Monaco, Consolas, monospace",
      fontLigatures: true,
      lineNumbers: "on",
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      wordWrap: "on",
      folding: true,
      find: { addExtraSpaceOnTop: false },
      contextmenu: true,
      quickSuggestions: false,
      suggestOnTriggerCharacters: false,
      parameterHints: { enabled: false },
      hover: { enabled: "on", delay: 250 },
      renderLineHighlight: "none",
      padding: { top: 14, bottom: 14 },
      scrollbar: {
        verticalScrollbarSize: 10,
        horizontalScrollbarSize: 10,
      },
    });
  };

  useEffect(() => {
    const editor = instanceRef.current;
    if (!editor) return;
    if (editor.getValue() !== value) {
      editor.setValue(value);
    }
  }, [value]);

  useEffect(() => {
    void import("monaco-editor").then((monaco) => {
      monaco.editor.setTheme(monacoTheme);
    });
  }, [monacoTheme]);

  return (
    <div
      className={cn(
        "relative h-full min-h-0 bg-background",
        theme === "dark" && "bg-[#1e1e1e]",
        className
      )}
    >
      <Editor
        language={language}
        theme={monacoTheme}
        value={value}
        path={`lab-${language}.${language}`}
        onMount={handleMount}
        loading={
          <div
            className={cn(
              "flex h-full items-center justify-center bg-background text-sm text-muted-foreground",
              theme === "dark" && "bg-[#1e1e1e]"
            )}
          >
            Loading editor…
          </div>
        }
        options={{
          readOnly: true,
          domReadOnly: true,
          ariaLabel: "Project lab code reference",
        }}
      />
    </div>
  );
}

export const ProjectMonacoViewer = memo(ProjectMonacoViewerInner);
