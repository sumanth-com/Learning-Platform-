"use client";

import { memo, useEffect, useRef } from "react";
import Editor, { type OnMount } from "@monaco-editor/react";
import type { editor as MonacoEditor } from "monaco-editor";
import { cn } from "@/lib/utils";

type MonacoHtmlReferenceProps = {
  value: string;
  className?: string;
};

const HOVER_STYLE_ID = "supra-monaco-html-hover-style";

function ensureHoverStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById(HOVER_STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = HOVER_STYLE_ID;
  style.textContent = `
    .monaco-editor .monaco-hover,
    .monaco-hover {
      z-index: 100 !important;
      max-width: min(440px, calc(100vw - 2rem)) !important;
      min-width: 280px !important;
      border-radius: 10px !important;
      border: 1px solid rgba(63, 63, 70, 0.95) !important;
      box-shadow:
        0 12px 40px rgba(0, 0, 0, 0.55),
        0 0 0 1px rgba(255, 255, 255, 0.04) !important;
      overflow: visible !important;
    }
    .monaco-editor .monaco-hover .monaco-hover-content,
    .monaco-hover .monaco-hover-content {
      max-width: min(440px, calc(100vw - 2rem)) !important;
      width: max-content !important;
      min-width: 260px !important;
      padding: 10px 12px !important;
      font-size: 13px !important;
      line-height: 1.55 !important;
      word-wrap: break-word !important;
      overflow-wrap: anywhere !important;
      white-space: normal !important;
    }
    .monaco-hover .hover-row,
    .monaco-hover .hover-row.status-bar,
    .monaco-hover .markdown-hover,
    .monaco-hover .hover-contents {
      max-width: 100% !important;
      white-space: normal !important;
    }
    .monaco-hover a {
      color: #7dd3fc !important;
    }
  `;
  document.head.appendChild(style);
}

/**
 * Read-only Monaco viewer for theory lessons — scroll + select/copy only.
 */
function MonacoHtmlReferenceInner({
  value,
  className,
}: MonacoHtmlReferenceProps) {
  const instanceRef = useRef<MonacoEditor.IStandaloneCodeEditor | null>(null);

  const handleMount: OnMount = (editor, monaco) => {
    instanceRef.current = editor;
    ensureHoverStyles();

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
      suggest: { html5: false },
    });

    editor.updateOptions({
      readOnly: true,
      domReadOnly: true,
      readOnlyMessage: { value: "This is a code reference — copy only." },
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
      /** Render hover outside overflow:hidden parents so MDN tips aren’t clipped. */
      fixedOverflowWidgets: true,
      hover: {
        enabled: true,
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
        language="html"
        theme="vs-dark"
        value={value}
        onMount={handleMount}
        loading={
          <div className="flex h-full items-center justify-center bg-[#1e1e1e] text-sm text-zinc-500">
            Loading code…
          </div>
        }
        options={{
          readOnly: true,
          domReadOnly: true,
          fixedOverflowWidgets: true,
          ariaLabel: "HTML code reference",
        }}
      />
    </div>
  );
}

export const MonacoHtmlReference = memo(MonacoHtmlReferenceInner);
