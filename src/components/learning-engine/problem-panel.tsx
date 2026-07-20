"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type {
  AiLesson,
  DatabaseDesignLesson,
  GitLesson,
  JavaLikeLesson,
  LearnLesson,
  LearnProblemRich,
  MongoDbLesson,
  ProblemApproach,
  RestApiLesson,
  SecurityLesson,
  SqlLesson,
} from "@/learning-engine/types";
import { isJavaLike } from "@/learning-engine/types";
import { problemTypeLabel } from "@/learning-engine/labels";
import { cn } from "@/lib/utils";

const DIFFICULTY_BADGE: Record<string, string> = {
  easy: "bg-emerald-500/15 text-emerald-400 ring-emerald-500/30",
  medium: "bg-amber-500/15 text-amber-400 ring-amber-500/30",
  hard: "bg-rose-500/15 text-rose-400 ring-rose-500/30",
};

function AccordionSection({
  title,
  count,
  defaultOpen = false,
  children,
}: {
  title: string;
  count?: number;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-zinc-800/60 last:border-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-zinc-900/40"
      >
        <span className="text-xs font-semibold text-zinc-300">
          {title}
          {count !== undefined && count > 0 && (
            <span className="ml-1.5 text-zinc-500">({count})</span>
          )}
        </span>
        <ChevronDown
          className={cn("h-4 w-4 text-zinc-500 transition-transform", open && "rotate-180")}
        />
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  if (!items?.length) return null;
  return (
    <ul className="space-y-1.5">
      {items.map((item, i) => (
        <li key={`${item}-${i}`} className="flex gap-2 text-sm text-zinc-400">
          <span className="text-violet-400">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function CompanyTags({ tags }: { tags?: string[] }) {
  if (!tags?.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <span
          key={tag}
          className="rounded-md bg-zinc-800/80 px-2 py-0.5 text-[10px] font-medium text-zinc-400 ring-1 ring-zinc-700/60"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

function ApproachesList({ approaches }: { approaches?: ProblemApproach[] }) {
  if (!approaches?.length) return null;
  return (
    <div className="space-y-3">
      {approaches.map((a) => (
        <div key={a.name} className="rounded-md border border-zinc-800 bg-zinc-900/50 p-3">
          <p className="text-xs font-semibold text-sky-300">{a.name}</p>
          <p className="mt-1 text-sm text-zinc-400">{a.description}</p>
          <p className="mt-1.5 font-mono text-[11px] text-zinc-500">
            Time: {a.timeComplexity} · Space: {a.spaceComplexity}
          </p>
        </div>
      ))}
    </div>
  );
}

function ComplexitySection({ approaches }: { approaches?: ProblemApproach[] }) {
  const optimal = approaches?.find((a) => a.name === "Optimal") ?? approaches?.[approaches.length - 1];
  if (!optimal) return <p className="text-sm text-zinc-500">See approach section for complexity analysis.</p>;
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <div className="rounded-md border border-zinc-800 bg-zinc-900/50 p-3">
        <p className="text-[10px] font-semibold uppercase text-zinc-500">Time Complexity</p>
        <p className="mt-1 font-mono text-sm text-emerald-300">{optimal.timeComplexity}</p>
      </div>
      <div className="rounded-md border border-zinc-800 bg-zinc-900/50 p-3">
        <p className="text-[10px] font-semibold uppercase text-zinc-500">Space Complexity</p>
        <p className="mt-1 font-mono text-sm text-sky-300">{optimal.spaceComplexity}</p>
      </div>
    </div>
  );
}

function RichProblemContent({
  lesson,
  extra,
}: {
  lesson: LearnLesson & LearnProblemRich;
  extra?: React.ReactNode;
}) {
  const explanation =
    lesson.stepByStepExplanation ??
    ("explanation" in lesson ? (lesson as { explanation?: string }).explanation : "");

  return (
    <>
      <div className="border-b border-zinc-800/60 px-4 py-4">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase ring-1",
              DIFFICULTY_BADGE[lesson.difficulty]
            )}
          >
            {lesson.difficulty}
          </span>
          {lesson.problemType && (
            <span className="rounded-md bg-violet-500/10 px-2 py-0.5 text-[10px] font-medium text-violet-300 ring-1 ring-violet-500/20">
              {problemTypeLabel(lesson.problemType)}
            </span>
          )}
        </div>
        <h2 className="text-base font-semibold leading-snug text-zinc-50">{lesson.title}</h2>
        <div className="mt-3">
          <CompanyTags tags={lesson.companyTags} />
        </div>
      </div>

      {lesson.problemStatement && (
        <AccordionSection title="Problem Statement" defaultOpen>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-300">
            {lesson.problemStatement}
          </p>
        </AccordionSection>
      )}

      {(lesson.exampleInput || lesson.exampleOutput) && (
        <AccordionSection title="Example" defaultOpen>
          {lesson.exampleInput && (
            <div className="mb-3">
              <p className="mb-1.5 text-[10px] font-semibold uppercase text-zinc-500">Input</p>
              <pre className="overflow-x-auto rounded-md border border-zinc-800 bg-zinc-900 p-3 font-mono text-xs text-emerald-200">
                {lesson.exampleInput}
              </pre>
            </div>
          )}
          {lesson.exampleOutput && (
            <div>
              <p className="mb-1.5 text-[10px] font-semibold uppercase text-zinc-500">Output</p>
              <pre className="overflow-x-auto rounded-md border border-zinc-800 bg-zinc-900 p-3 font-mono text-xs text-sky-200 whitespace-pre-wrap">
                {lesson.exampleOutput}
              </pre>
            </div>
          )}
        </AccordionSection>
      )}

      {explanation && (
        <AccordionSection title="Explanation">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-400">{explanation}</p>
        </AccordionSection>
      )}

      {lesson.constraints && lesson.constraints.length > 0 && (
        <AccordionSection title="Constraints">
          <BulletList items={lesson.constraints} />
        </AccordionSection>
      )}

      {lesson.hints && lesson.hints.length > 0 && (
        <AccordionSection title="Hints" count={lesson.hints.length}>
          <ul className="space-y-2">
            {lesson.hints.map((h, i) => (
              <li key={i} className="rounded-md border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-400">
                <span className="font-semibold text-violet-400">Hint {i + 1}:</span> {h}
              </li>
            ))}
          </ul>
        </AccordionSection>
      )}

      {lesson.approaches && lesson.approaches.length > 0 && (
        <AccordionSection title="Approach">
          <ApproachesList approaches={lesson.approaches} />
        </AccordionSection>
      )}

      {lesson.approaches && lesson.approaches.length > 0 && (
        <AccordionSection title="Time & Space Complexity">
          <ComplexitySection approaches={lesson.approaches} />
        </AccordionSection>
      )}

      {"commonMistakes" in lesson && lesson.commonMistakes && lesson.commonMistakes.length > 0 && (
        <AccordionSection title="Common Mistakes">
          <BulletList items={lesson.commonMistakes} />
        </AccordionSection>
      )}

      {"interviewTips" in lesson && lesson.interviewTips && lesson.interviewTips.length > 0 && (
        <AccordionSection title="Interview Tips">
          <BulletList items={lesson.interviewTips} />
        </AccordionSection>
      )}

      {lesson.followUpQuestions && lesson.followUpQuestions.length > 0 && (
        <AccordionSection title="Follow-up Questions" count={lesson.followUpQuestions.length}>
          <BulletList items={lesson.followUpQuestions} />
        </AccordionSection>
      )}

      {lesson.alternativeSolutions && lesson.alternativeSolutions.length > 0 && (
        <AccordionSection title="Alternative Solutions">
          <BulletList items={lesson.alternativeSolutions} />
        </AccordionSection>
      )}

      {lesson.practiceVariations && lesson.practiceVariations.length > 0 && (
        <AccordionSection title="Practice Variations">
          <BulletList items={lesson.practiceVariations} />
        </AccordionSection>
      )}

      {extra}
    </>
  );
}

function SqlExtras({ lesson }: { lesson: SqlLesson }) {
  return (
    <>
      <AccordionSection title="Schema">
        {(lesson.schema ?? []).map((t) => (
          <div key={t.table} className="mb-2 rounded-md bg-zinc-900/80 p-2">
            <p className="font-mono text-xs text-sky-300">{t.table}</p>
            <p className="mt-1 font-mono text-[11px] text-zinc-500">
              ({t.columns.map((c) => `${c.name} ${c.type}`).join(", ")})
            </p>
          </div>
        ))}
      </AccordionSection>
      <AccordionSection title="Sample Data">
        {(lesson.sampleData ?? []).map((t) => (
          <div key={t.table} className="mb-2">
            <p className="mb-1 text-xs text-zinc-500">{t.table}</p>
            <pre className="overflow-x-auto rounded-md bg-zinc-900 p-2 font-mono text-[11px] text-zinc-400">
              {t.rows.map((r) => r.join(" | ")).join("\n")}
            </pre>
          </div>
        ))}
      </AccordionSection>
    </>
  );
}

export function ProblemPanel({ lesson }: { lesson: LearnLesson }) {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-zinc-950/50">
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        {isJavaLike(lesson) && (
          <RichProblemContent
            lesson={lesson as JavaLikeLesson}
            extra={
              <>
                {"syntax" in lesson && lesson.syntax && (
                  <AccordionSection title="Syntax Reference">
                    <pre className="overflow-x-auto rounded-md bg-zinc-900 p-2 font-mono text-xs text-orange-200">
                      {lesson.syntax}
                    </pre>
                  </AccordionSection>
                )}
                {"memoryDiagram" in lesson && lesson.memoryDiagram && (
                  <AccordionSection title="Memory Diagram">{lesson.memoryDiagram}</AccordionSection>
                )}
              </>
            }
          />
        )}

        {lesson.category === "sql" && (
          <RichProblemContent lesson={lesson as SqlLesson} extra={<SqlExtras lesson={lesson as SqlLesson} />} />
        )}

        {lesson.category === "rest-api" && (
          <RichProblemContent lesson={lesson as RestApiLesson} />
        )}

        {lesson.category === "git" && (
          <RichProblemContent lesson={lesson as GitLesson} />
        )}

        {lesson.category === "ai" && (
          <RichProblemContent lesson={lesson as AiLesson} />
        )}

        {lesson.category === "database-design" && (
          <RichProblemContent lesson={lesson as DatabaseDesignLesson} />
        )}

        {lesson.category === "security" && (
          <RichProblemContent lesson={lesson as SecurityLesson} />
        )}

        {lesson.category === "mongodb" && (
          <RichProblemContent lesson={lesson as MongoDbLesson} />
        )}
      </div>
    </div>
  );
}
