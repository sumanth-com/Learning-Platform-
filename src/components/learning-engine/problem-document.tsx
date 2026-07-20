"use client";

import type { LearnLesson, LearnProblemRich } from "@/learning-engine/types";
import { problemTypeLabel, DIFFICULTY_LABELS } from "@/learning-engine/labels";
import { cn } from "@/lib/utils";

const DIFFICULTY_BADGE: Record<string, string> = {
  easy: "text-emerald-400",
  medium: "text-amber-400",
  hard: "text-rose-400",
};

function DocSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-b border-zinc-800/50 px-6 py-5 last:border-0">
      <h3 className="mb-3 text-[15px] font-bold text-zinc-100">{title}</h3>
      {children}
    </section>
  );
}

function RichProblemDocument({ lesson }: { lesson: LearnLesson & LearnProblemRich }) {
  const explanation =
    lesson.stepByStepExplanation ??
    ("explanation" in lesson ? (lesson as { explanation?: string }).explanation : "");

  return (
    <div className="pb-8">
      <div className="border-b border-zinc-800/50 px-6 py-5">
        <h1 className="text-xl font-bold text-zinc-50">{lesson.title}</h1>
        <p className="mt-2 text-xs text-zinc-500">
          <span className={cn("font-semibold uppercase", DIFFICULTY_BADGE[lesson.difficulty])}>
            {DIFFICULTY_LABELS[lesson.difficulty]}
          </span>
          {lesson.problemType && (
            <>
              {" · "}
              {problemTypeLabel(lesson.problemType)}
            </>
          )}
        </p>
      </div>

      {lesson.problemStatement && (
        <DocSection title="">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-300">
            {lesson.problemStatement}
          </p>
        </DocSection>
      )}

      {(lesson.exampleInput || lesson.exampleOutput) && (
        <DocSection title="Example">
          {lesson.exampleInput && (
            <div className="mb-4">
              <p className="mb-1 text-xs font-medium text-zinc-500">Input</p>
              <pre className="overflow-x-auto rounded border border-zinc-700/80 bg-zinc-900/80 p-3 font-mono text-xs text-emerald-200/90">
                {lesson.exampleInput}
              </pre>
            </div>
          )}
          {lesson.exampleOutput && (
            <div>
              <p className="mb-1 text-xs font-medium text-zinc-500">Output</p>
              <pre className="overflow-x-auto whitespace-pre-wrap rounded border border-zinc-700/80 bg-zinc-900/80 p-3 font-mono text-xs text-sky-200/90">
                {lesson.exampleOutput}
              </pre>
            </div>
          )}
        </DocSection>
      )}

      {explanation && (
        <DocSection title="Explanation">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-400">{explanation}</p>
        </DocSection>
      )}

      {lesson.constraints && lesson.constraints.length > 0 && (
        <DocSection title="Constraints">
          <ul className="space-y-1.5">
            {lesson.constraints.map((c, i) => (
              <li key={i} className="font-mono text-xs text-zinc-400">
                • {c}
              </li>
            ))}
          </ul>
        </DocSection>
      )}
    </div>
  );
}

function HintsDocument({ lesson }: { lesson: LearnLesson & LearnProblemRich }) {
  const hints = lesson.hints ?? [];
  if (!hints.length) {
    return <p className="px-6 py-8 text-sm text-zinc-500">No hints for this challenge.</p>;
  }
  return (
    <div className="space-y-3 px-6 py-5">
      {hints.map((h, i) => (
        <div key={i} className="rounded border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm text-zinc-300">
          <span className="font-semibold text-emerald-400">Hint {i + 1}:</span> {h}
        </div>
      ))}
    </div>
  );
}

export function ProblemDocument({
  lesson,
  tab,
}: {
  lesson: LearnLesson;
  tab: "problem" | "hints";
}) {
  if (tab === "hints") {
    return <HintsDocument lesson={lesson as LearnLesson & LearnProblemRich} />;
  }

  return <RichProblemDocument lesson={lesson as LearnLesson & LearnProblemRich} />;
}
