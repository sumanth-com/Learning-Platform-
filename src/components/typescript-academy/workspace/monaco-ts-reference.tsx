"use client";

import { memo, useEffect, useRef } from "react";
import Editor, { type OnMount } from "@monaco-editor/react";
import type { editor as MonacoEditor } from "monaco-editor";
import { cn } from "@/lib/utils";

type MonacoTsReferenceProps = {
  value: string;
  className?: string;
};

function MonacoTsReferenceInner({
  value,
  className,
}: MonacoTsReferenceProps) {
  const instanceRef = useRef<MonacoEditor.IStandaloneCodeEditor | null>(null);

  const handleMount: OnMount = (editor) => {
    instanceRef.current = editor;

    editor.updateOptions({
      readOnly: true,
      domReadOnly: true,
      readOnlyMessage: { value: "This is a code reference - copy only." },
      fontSize: 13,
      fontFamily:
        "'Cascadia Code', 'Fira Code', 'JetBrains Mono', Menlo, Monaco, Consolas, monospace",
      fontLigatures: true,
      lineNumbers: "on",
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      insertSpaces: true,
      wordWrap: "on",
      bracketPairColorization: { enabled: true },
      matchBrackets: "near",
      padding: { top: 14, bottom: 14 },
      renderLineHighlight: "none",
      cursorStyle: "line-thin",
      cursorBlinking: "solid",
      smoothScrolling: true,
      mouseWheelZoom: false,
      contextmenu: false,
      dragAndDrop: false,
      dropIntoEditor: { enabled: false },
      links: false,
      quickSuggestions: false,
      suggestOnTriggerCharacters: false,
      parameterHints: { enabled: false },
      fixedOverflowWidgets: true,
      hover: {
        enabled: "on",
        delay: 280,
        sticky: true,
        above: true,
      },
      folding: true,
      renderWhitespace: "none",
      scrollbar: {
        verticalScrollbarSize: 10,
        horizontalScrollbarSize: 10,
      },
    });

    void editor.getAction("editor.action.formatDocument")?.run();
  };

  useEffect(() => {
    const editor = instanceRef.current;
    if (!editor) return;
    const current = editor.getValue();
    if (current !== value) {
      editor.setValue(value);
      void editor.getAction("editor.action.formatDocument")?.run();
    }
  }, [value]);

  return (
    <div className={cn("relative h-full min-h-0 overflow-visible bg-[#1e1e1e]", className)}>
      <Editor
        language="typescript"
        theme="vs-dark"
        value={value}
        onMount={handleMount}
        loading={
          <div className="flex h-full items-center justify-center bg-[#1e1e1e] text-sm text-zinc-500">
            Loading TypeScript...
          </div>
        }
        options={{
          readOnly: true,
          domReadOnly: true,
          fixedOverflowWidgets: true,
          ariaLabel: "TypeScript code reference",
        }}
      />
    </div>
  );
}

export const MonacoTsReference = memo(MonacoTsReferenceInner);
