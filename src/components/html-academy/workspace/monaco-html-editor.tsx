"use client";

import {
  memo,
  useEffect,
  useRef,
  type MutableRefObject,
} from "react";
import Editor, { type OnMount } from "@monaco-editor/react";
import type { editor as MonacoEditor } from "monaco-editor";
import { emmetHTML } from "emmet-monaco-es";
import { cn } from "@/lib/utils";

export type MonacoHtmlEditorHandle = {
  format: () => Promise<void>;
  focus: () => void;
  getValue: () => string;
  layout: () => void;
};

type MonacoHtmlEditorProps = {
  value: string;
  onChange: (value: string) => void;
  visible: boolean;
  editorRef: MutableRefObject<MonacoHtmlEditorHandle | null>;
  className?: string;
};

let emmetRegistered = false;

function MonacoHtmlEditorInner({
  value,
  onChange,
  visible,
  editorRef,
  className,
}: MonacoHtmlEditorProps) {
  const instanceRef = useRef<MonacoEditor.IStandaloneCodeEditor | null>(null);

  const handleMount: OnMount = (editor, monaco) => {
    instanceRef.current = editor;

    if (!emmetRegistered) {
      try {
        emmetHTML(monaco);
        emmetRegistered = true;
      } catch {
        // Emmet is additive — continue without it if registration fails
      }
    }

    monaco.languages.html.htmlDefaults.setOptions({
      format: {
        tabSize: 2,
        insertSpaces: true,
        wrapLineLength: 120,
        unformatted: "",
        contentUnformatted: "pre",
        indentInnerHtml: true,
        preserveNewLines: true,
        maxPreserveNewLines: 2,
        indentHandlebars: false,
        endWithNewline: true,
        extraLiners: "head, body, /html",
        wrapAttributes: "auto",
      },
      suggest: { html5: true },
    });

    editor.updateOptions({
      fontSize: 13,
      fontFamily:
        "'Cascadia Code', 'Fira Code', 'JetBrains Mono', Menlo, Monaco, Consolas, monospace",
      fontLigatures: true,
      lineNumbers: "on",
      minimap: { enabled: true, scale: 1, showSlider: "mouseover" },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      insertSpaces: true,
      wordWrap: "on",
      bracketPairColorization: { enabled: true },
      matchBrackets: "always",
      autoClosingBrackets: "languageDefined",
      autoClosingQuotes: "languageDefined",
      autoIndent: "full",
      formatOnPaste: true,
      suggestOnTriggerCharacters: true,
      quickSuggestions: true,
      padding: { top: 12, bottom: 12 },
      renderLineHighlight: "line",
      cursorBlinking: "smooth",
      smoothScrolling: true,
      mouseWheelZoom: true,
    });

    editorRef.current = {
      format: async () => {
        await editor.getAction("editor.action.formatDocument")?.run();
      },
      focus: () => editor.focus(),
      getValue: () => editor.getValue(),
      layout: () => editor.layout(),
    };

    editor.focus();
  };

  useEffect(() => {
    if (visible) {
      requestAnimationFrame(() => {
        instanceRef.current?.layout();
        editorRef.current?.layout();
      });
    }
  }, [visible, editorRef]);

  useEffect(() => {
    return () => {
      editorRef.current = null;
    };
  }, [editorRef]);

  return (
    <div
      className={cn(
        "absolute inset-0 bg-[#1e1e1e]",
        visible ? "z-10" : "pointer-events-none z-0 opacity-0",
        className
      )}
      aria-hidden={!visible}
    >
      <Editor
        language="html"
        theme="vs-dark"
        value={value}
        onChange={(next) => onChange(next ?? "")}
        onMount={handleMount}
        loading={
          <div className="flex h-full items-center justify-center bg-[#1e1e1e] text-sm text-zinc-500">
            Loading editor…
          </div>
        }
        options={{
          ariaLabel: "HTML editor",
        }}
      />
    </div>
  );
}

export const MonacoHtmlEditor = memo(MonacoHtmlEditorInner);
