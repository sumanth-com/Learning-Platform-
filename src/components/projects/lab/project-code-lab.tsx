"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, CheckCircle2, Copy } from "lucide-react";
import { ProjectMonacoViewer } from "@/components/projects/lab/project-monaco-viewer";
import type { LabLanguage, LabTrack, ProjectLabLesson } from "@/curriculum/project-lab/types";
import {
  BACKEND_LANGS,
  FRONTEND_LANGS,
  PROGRAMMING_LANGS,
  TRACK_OPTIONS,
} from "@/curriculum/project-lab/tracks";
import { FilterSelect } from "@/components/shared/filter-pills";
import { cn } from "@/lib/utils";

type ProjectCodeLabProps = {
  lesson: ProjectLabLesson;
  track: LabTrack;
  language: LabLanguage;
  onTrackChange: (track: LabTrack) => void;
  onLanguageChange: (language: LabLanguage) => void;
  isComplete?: boolean;
  onProjectComplete?: (done: boolean) => void;
  className?: string;
};

export function ProjectCodeLab({
  lesson,
  track,
  language,
  onTrackChange,
  onLanguageChange,
  isComplete = false,
  onProjectComplete,
  className,
}: ProjectCodeLabProps) {
  const file = lesson.files[0];
  const [copied, setCopied] = useState(false);

  const langOptions = useMemo(() => {
    if (track === "frontend") return FRONTEND_LANGS;
    if (track === "backend") return BACKEND_LANGS;
    return PROGRAMMING_LANGS;
  }, [track]);

  useEffect(() => {
    setCopied(false);
  }, [track, language, file?.filename]);

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
      <div className="shrink-0 border-b border-border bg-muted/50 px-3 py-2.5">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <label className="flex items-center gap-2">
            <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Track
            </span>
            <FilterSelect
              compact
              className="w-[13.5rem]"
              label="Track"
              value={track}
              onChange={onTrackChange}
              options={TRACK_OPTIONS.map((opt) => ({
                value: opt.id,
                label: opt.label,
              }))}
            />
          </label>

          {track === "frontend" ? (
            <div className="flex items-center gap-2">
              <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Files
              </span>
              <div className="flex h-8 items-center gap-1.5">
                {FRONTEND_LANGS.map((opt) => {
                  const active = language === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => onLanguageChange(opt.id)}
                      className={cn(
                        "h-8 min-w-[3.25rem] rounded-lg px-3 text-xs font-semibold transition-colors",
                        active
                          ? "bg-foreground text-background"
                          : "bg-card text-muted-foreground ring-1 ring-border hover:text-foreground"
                      )}
                    >
                      {opt.label === "JavaScript" ? "JS" : opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <label className="flex items-center gap-2">
              <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Language
              </span>
              <FilterSelect
                compact
                className="w-[10.5rem]"
                label="Language"
                value={language}
                onChange={(value) => onLanguageChange(value as LabLanguage)}
                options={langOptions.map((opt) => ({
                  value: opt.id,
                  label: opt.label,
                }))}
              />
            </label>
          )}

          {onProjectComplete ? (
            <button
              type="button"
              onClick={() => onProjectComplete(!isComplete)}
              aria-pressed={isComplete}
              title={
                isComplete
                  ? "Click to mark as unsolved"
                  : "Click to mark as solved"
              }
              aria-label={
                isComplete ? "Mark as unsolved" : "Mark as solved"
              }
              className={cn(
                "ml-auto inline-flex h-8 min-w-[9.75rem] cursor-pointer items-center justify-center gap-1.5 overflow-hidden rounded-full border px-3.5 text-xs font-semibold transition-all duration-300",
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
                    <motion.span
                      initial={{ scale: 0.35, rotate: -24 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 460,
                        damping: 16,
                      }}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </motion.span>
                    Solved
                  </motion.span>
                ) : (
                  <motion.span
                    key="unsolved"
                    initial={{ opacity: 0, y: 8, scale: 0.94 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.94 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="pointer-events-none inline-flex items-center gap-1.5"
                  >
                    <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-current/40" />
                    Mark as Solved
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          ) : null}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 border-b border-border bg-background px-3 py-1.5">
        <span className="rounded-md bg-muted px-2 py-1 font-mono text-[11px] text-foreground ring-1 ring-border">
          {file?.filename ?? "code"}
        </span>
        <span className="hidden text-[10px] text-muted-foreground sm:inline">
          {lesson.languageLabel} · read-only
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
                initial={{ opacity: 0, scale: 0.85, y: 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -4 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="inline-flex items-center gap-1.5"
              >
                <motion.span
                  initial={{ scale: 0.3 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 480, damping: 16 }}
                >
                  <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                </motion.span>
                Copied
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.16 }}
                className="inline-flex items-center gap-1.5"
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
