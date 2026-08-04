"use client";

import { useEffect, useRef, useState } from "react";
import Editor, { type BeforeMount, type OnMount } from "@monaco-editor/react";
import { useTheme } from "@/components/theme/theme-provider";
import { languageMeta } from "@/features/certifications/lib/editor-languages";
import { cn } from "@/lib/utils";

const LIGHT_THEME = "suprabase-light";
const DARK_THEME = "suprabase-dark";

type MonacoApi = Parameters<BeforeMount>[0];
type MonacoEditorInstance = Parameters<OnMount>[0];

function readDomTheme(): "light" | "dark" {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.classList.contains("light")
    ? "light"
    : "dark";
}

function defineCertThemes(monaco: MonacoApi) {
  monaco.editor.defineTheme(LIGHT_THEME, {
    base: "vs",
    inherit: true,
    rules: [
      { token: "", foreground: "18181B" },
      { token: "comment", foreground: "71717A", fontStyle: "italic" },
      { token: "string", foreground: "0F766E" },
      { token: "keyword", foreground: "7C2D12" },
      { token: "number", foreground: "9A3412" },
      { token: "type", foreground: "1D4ED8" },
      { token: "delimiter", foreground: "52525B" },
      { token: "identifier", foreground: "18181B" },
    ],
    colors: {
      "editor.background": "#FAFAFA",
      "editor.foreground": "#18181B",
      "editorLineNumber.foreground": "#A1A1AA",
      "editorLineNumber.activeForeground": "#52525B",
      "editorCursor.foreground": "#5F3435",
      "editor.selectionBackground": "#E4E4E7",
      "editor.inactiveSelectionBackground": "#F4F4F5",
      "editor.lineHighlightBackground": "#00000000",
      "editor.lineHighlightBorder": "#00000000",
      "editorIndentGuide.background": "#E4E4E7",
      "editorIndentGuide.activeBackground": "#D4D4D8",
      "editorWidget.background": "#FFFFFF",
      "editorWidget.border": "#E4E4E7",
      "editorGutter.background": "#FAFAFA",
      "scrollbarSlider.background": "#A1A1AA55",
      "scrollbarSlider.hoverBackground": "#A1A1AA88",
      "scrollbarSlider.activeBackground": "#A1A1AAaa",
    },
  });

  monaco.editor.defineTheme(DARK_THEME, {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "6B7280", fontStyle: "italic" },
    ],
    colors: {
      "editor.background": "#0B0D10",
      "editor.foreground": "#E4E4E7",
      "editorLineNumber.foreground": "#52525B",
      "editorLineNumber.activeForeground": "#A1A1AA",
      "editorGutter.background": "#0B0D10",
      "editor.lineHighlightBackground": "#00000000",
      "editor.lineHighlightBorder": "#00000000",
    },
  });
}

const EDITOR_OPTIONS = {
  fontSize: 13.5,
  fontFamily:
    "'Cascadia Code', 'Fira Code', 'JetBrains Mono', Menlo, Monaco, Consolas, monospace",
  fontLigatures: true,
  lineNumbers: "on" as const,
  lineNumbersMinChars: 3,
  glyphMargin: false,
  folding: true,
  foldingHighlight: false,
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  automaticLayout: true,
  insertSpaces: true,
  wordWrap: "on" as const,
  bracketPairColorization: { enabled: true },
  matchBrackets: "near" as const,
  padding: { top: 14, bottom: 14 },
  renderLineHighlight: "none" as const,
  cursorBlinking: "smooth" as const,
  smoothScrolling: true,
  overviewRulerLanes: 0,
  overviewRulerBorder: false,
  hideCursorInOverviewRuler: true,
  renderValidationDecorations: "off" as const,
  fixedOverflowWidgets: true,
  contextmenu: true,
  accessibilitySupport: "off" as const,
  guides: {
    indentation: true,
    highlightActiveIndentation: false,
    bracketPairs: false,
  },
  scrollbar: {
    vertical: "auto" as const,
    horizontal: "auto" as const,
    verticalScrollbarSize: 8,
    horizontalScrollbarSize: 8,
    useShadows: false,
    alwaysConsumeMouseWheel: false,
  },
};

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
  const { theme: contextTheme } = useTheme();
  const [domTheme, setDomTheme] = useState<"light" | "dark">(readDomTheme);
  const resolved =
    domTheme === "light" || contextTheme === "light" ? "light" : "dark";
  const isLight = resolved === "light";
  const monacoTheme = isLight ? LIGHT_THEME : DARK_THEME;
  const editorRef = useRef<MonacoEditorInstance | null>(null);
  const monacoRef = useRef<MonacoApi | null>(null);
  const meta = languageMeta(language);

  useEffect(() => {
    setDomTheme(readDomTheme());
    const root = document.documentElement;
    const sync = () => setDomTheme(readDomTheme());
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const ed = editorRef.current;
    if (!ed) return;
    if (value !== ed.getValue()) ed.setValue(value);
  }, [value]);

  useEffect(() => {
    const ed = editorRef.current;
    if (!ed) return;
    ed.updateOptions({ tabSize: language === "python" ? 4 : 2 });
    requestAnimationFrame(() => ed.layout());
  }, [language]);

  useEffect(() => {
    monacoRef.current?.editor.setTheme(monacoTheme);
  }, [monacoTheme]);

  const handleBeforeMount: BeforeMount = (monaco) => {
    monacoRef.current = monaco;
    defineCertThemes(monaco);
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
    });
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
    });
    monaco.editor.setTheme(monacoTheme);
  };

  const handleMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    defineCertThemes(monaco);
    monaco.editor.setTheme(monacoTheme);
    editor.updateOptions({
      ...EDITOR_OPTIONS,
      tabSize: language === "python" ? 4 : 2,
    });
    requestAnimationFrame(() => {
      editor.layout();
      monaco.editor.setTheme(monacoTheme);
      editor.focus();
    });
  };

  return (
    <div
      className={cn(
        "cert-monaco-shell flex h-full min-h-0 flex-col overflow-hidden",
        isLight ? "bg-[#fafafa]" : "bg-[#0b0d10]",
        className
      )}
      data-editor-theme={isLight ? "light" : "dark"}
    >
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <Editor
          key={`${meta.monaco}-${monacoTheme}`}
          height={typeof height === "number" ? height : "100%"}
          theme={monacoTheme}
          language={meta.monaco}
          defaultValue={value}
          beforeMount={handleBeforeMount}
          onMount={handleMount}
          onChange={(v) => onChange(v ?? "")}
          loading={
            <div
              className={cn(
                "flex h-full items-center justify-center text-[12px]",
                isLight
                  ? "bg-[#fafafa] text-zinc-400"
                  : "bg-[#0b0d10] text-zinc-500"
              )}
            >
              Loading editor…
            </div>
          }
          options={{
            ...EDITOR_OPTIONS,
            tabSize: language === "python" ? 4 : 2,
          }}
        />
      </div>
    </div>
  );
}
