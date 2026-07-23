"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, CheckCircle2, Copy } from "lucide-react";
import { ProjectMonacoViewer } from "@/components/projects/lab/project-monaco-viewer";
import type { AssignmentStarterFile } from "@/curriculum/assignment-catalog";
import { cn } from "@/lib/utils";

type AssignmentCodePanelProps = {
  files: AssignmentStarterFile[];
  isComplete: boolean;
  onToggleComplete: (done: boolean) => void;
  className?: string;
};

export function AssignmentCodePanel({
  files,
  isComplete,
  onToggleComplete,
  className,
}: AssignmentCodePanelProps) {
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const file = files[active] ?? files[0];

  useEffect(() => {
    setActive(0);
    setCopied(false);
  }, [files]);

  const copyCode = async () => {
    if (!file || copied) return;
    try {
      await navigator.clipboard.writeText(file.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  };

  return (
    <div
      className={cn(
        "flex h-full min-h-0 flex-col overflow-hidden bg-background",
        className
      )}
    >
      <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-border bg-muted/50 px-3 py-2">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
          {files.map((f, index) => {
            const selected = index === active;
            return (
              <button
                key={f.filename}
                type="button"
                onClick={() => setActive(index)}
                className={cn(
                  "h-8 rounded-lg px-2.5 font-mono text-[11px] font-semibold transition-colors",
                  selected
                    ? "bg-foreground text-background"
                    : "bg-card text-muted-foreground ring-1 ring-border hover:text-foreground"
                )}
              >
                {f.filename}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => onToggleComplete(!isComplete)}
          aria-pressed={isComplete}
          title={
            isComplete
              ? "Click to mark as unsolved"
              : "Click to mark as solved"
          }
          className={cn(
            "inline-flex h-8 min-w-[9.75rem] cursor-pointer items-center justify-center gap-1.5 overflow-hidden rounded-full border px-3.5 text-xs font-semibold transition-all duration-300",
            isComplete
              ? "border-emerald-500/45 bg-emerald-500/12 text-emerald-700 shadow-sm shadow-emerald-500/10 hover:bg-emerald-500/18"
              : "border-border bg-card text-foreground hover:border-muted-foreground/35 hover:bg-muted/60"
          )}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isComplete ? (
              <motion.span
                key="solved"
                initial={{ opacity: 0, y: 8, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.9 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="pointer-events-none inline-flex items-center gap-1.5"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Solved
              </motion.span>
            ) : (
              <motion.span
                key="unsolved"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="pointer-events-none inline-flex items-center gap-1.5"
              >
                <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-current/40" />
                Mark as Solved
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      <div className="flex shrink-0 items-center gap-2 border-b border-border px-3 py-1.5">
        <span className="rounded-md bg-muted px-2 py-1 font-mono text-[11px] text-foreground ring-1 ring-border">
          {file?.filename ?? "starter"}
        </span>
        <span className="hidden text-[10px] text-muted-foreground sm:inline">
          Read-only starter · copy freely
        </span>
        <button
          type="button"
          onClick={copyCode}
          className={cn(
            "ml-auto inline-flex h-7 min-w-[5.25rem] items-center justify-center gap-1.5 overflow-hidden rounded-lg px-2.5 text-[11px] font-medium transition-all duration-300",
            copied
              ? "bg-emerald-500/12 text-emerald-700 ring-1 ring-emerald-500/30"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <AnimatePresence mode="wait" initial={false}>
            {copied ? (
              <motion.span
                key="copied"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="pointer-events-none inline-flex items-center gap-1.5"
              >
                <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                Copied
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="pointer-events-none inline-flex items-center gap-1.5"
              >
                <Copy className="h-3.5 w-3.5" />
                Copy
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      <div className="min-h-0 flex-1">
        <ProjectMonacoViewer
          value={file?.code ?? ""}
          language={file?.language ?? "plaintext"}
        />
      </div>
    </div>
  );
}
