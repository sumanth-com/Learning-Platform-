"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { ProjectLabLesson } from "@/curriculum/project-lab/types";
import { cn } from "@/lib/utils";

function Paragraphs({ text }: { text: string }) {
  const blocks = text.split(/\n\n+/);
  return (
    <div className="space-y-3">
      {blocks.map((block, i) => {
        const lines = block.split("\n");
        const isList = lines.every(
          (l) => !l.trim() || l.trim().startsWith("- ") || /^\d+\./.test(l.trim())
        );
        if (lines[0]?.startsWith("### ")) {
          return (
            <div key={i} className="space-y-2">
              <h4 className="text-[13px] font-semibold text-foreground">
                {lines[0].replace(/^###\s+/, "")}
              </h4>
              {lines.slice(1).length > 0 ? (
                <p className="whitespace-pre-wrap text-[13px] leading-relaxed text-muted-foreground">
                  {lines.slice(1).join("\n").replace(/\*\*([^*]+)\*\*/g, "$1")}
                </p>
              ) : null}
            </div>
          );
        }
        if (isList) {
          return (
            <ul
              key={i}
              className="list-disc space-y-1.5 pl-5 text-[13px] leading-relaxed text-muted-foreground"
            >
              {lines
                .filter((l) => l.trim())
                .map((l, j) => (
                  <li key={j}>
                    {l
                      .replace(/^\s*(?:-|\d+\.)\s+/, "")
                      .replace(/\*\*([^*]+)\*\*/g, "$1")}
                  </li>
                ))}
            </ul>
          );
        }
        return (
          <p
            key={i}
            className="whitespace-pre-wrap text-[13px] leading-relaxed text-muted-foreground"
          >
            {block.replace(/\*\*([^*]+)\*\*/g, "$1")}
          </p>
        );
      })}
    </div>
  );
}

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3 border-b border-border pb-6 last:border-b-0">
      {eyebrow ? (
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
          {eyebrow}
        </p>
      ) : null}
      <h3 className="text-base font-semibold tracking-tight text-foreground">
        {title}
      </h3>
      {children}
    </section>
  );
}

function InterviewAccordion({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      {items.map((item, index) => {
        const open = openIndex === index;
        return (
          <div
            key={item.question}
            className="overflow-hidden rounded-xl border border-border bg-muted/60"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : index)}
              aria-expanded={open}
              className="flex w-full items-start gap-2 px-3 py-3 text-left transition-colors hover:bg-muted"
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-secondary text-[10px] font-bold text-secondary-foreground">
                {index + 1}
              </span>
              <span className="min-w-0 flex-1 text-[13px] font-medium leading-snug text-foreground">
                {item.question}
              </span>
              <ChevronDown
                className={cn(
                  "mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-transform",
                  open && "rotate-180 text-primary"
                )}
              />
            </button>
            {open ? (
              <div className="border-t border-border px-3 py-3">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-primary">
                  Pro-level answer
                </p>
                <div className="whitespace-pre-wrap text-[13px] leading-relaxed text-muted-foreground">
                  {item.answer}
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export function ProjectTeachPanel({
  lesson,
  className,
}: {
  lesson: ProjectLabLesson;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "min-h-0 overflow-y-auto overscroll-contain bg-background",
        className
      )}
    >
      <div className="space-y-6 p-4 sm:p-5">
        <header className="space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Teacher explanation · {lesson.languageLabel}
          </p>
          <h2 className="text-lg font-semibold leading-snug text-foreground">
            {lesson.greeting}
          </h2>
          <p className="text-[13px] leading-relaxed text-muted-foreground">
            Listen first, then read the code. We&apos;ll build the thinking muscle
            companies actually pay for.
          </p>
        </header>

        {lesson.sections
          .filter((section) => section.id === "overview")
          .map((section) => (
            <Section key={section.id} title={section.title}>
              <Paragraphs text={section.body} />
            </Section>
          ))}

        <Section title="Common Mistakes">
          <ul className="list-disc space-y-1.5 pl-5 text-[13px] leading-relaxed text-muted-foreground">
            {lesson.commonMistakes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Section>

        <Section title="Interview Questions">
          <p className="text-[13px] leading-relaxed text-muted-foreground">
            Click a question to reveal a pro-level answer you can practice out loud.
          </p>
          <InterviewAccordion items={lesson.interviewQuestions} />
        </Section>

        <Section title="Project Summary">
          <div className="space-y-3 text-[13px] leading-relaxed text-muted-foreground">
            <div>
              <h4 className="font-semibold text-foreground">What was learned</h4>
              <ul className="mt-1 list-disc space-y-1 pl-5">
                {lesson.summary.learned.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Skills gained</h4>
              <ul className="mt-1 list-disc space-y-1 pl-5">
                {lesson.summary.skills.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground">
                Next recommended project
              </h4>
              <p className="mt-1">{lesson.summary.nextProject}</p>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}
