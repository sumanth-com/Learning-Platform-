"use client";

import type { LearnCategory, LearnLesson } from "@/learning-engine/types";

const CATEGORY_VISUAL_HINT: Partial<Record<LearnCategory, string>> = {
  dsa: "Pointer / index movement across the data structure",
  java: "Loop iteration and variable state changes",
  sql: "Query execution → result table",
  "rest-api": "Client → Controller → Service → Repository → DB",
  security: "JWT: Login → Token → Validate → Authorize",
  mongodb: "Document collection scan / aggregation pipeline",
  git: "Working tree → stage → commit → push",
};

interface VisualizationPanelProps {
  lesson: LearnLesson;
}

export function VisualizationPanel({ lesson }: VisualizationPanelProps) {
  const text = lesson.visualization ?? CATEGORY_VISUAL_HINT[lesson.category];
  const pattern = "patternPreview" in lesson ? lesson.patternPreview : undefined;

  if (!text && !pattern) return null;

  return (
    <div className="rounded-lg border border-violet-500/20 bg-violet-500/5 p-3">
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-violet-400">Visualization</p>
      {pattern && (
        <pre className="mb-2 overflow-x-auto rounded-md bg-zinc-950/80 p-2 font-mono text-xs leading-relaxed text-violet-200">
          {pattern}
        </pre>
      )}
      {text && (
        <pre className="whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-violet-200/90">{text}</pre>
      )}
    </div>
  );
}
