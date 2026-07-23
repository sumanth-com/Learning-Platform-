"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { AssignmentTeachContent } from "@/curriculum/assignment-catalog";
import { cn } from "@/lib/utils";

function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="border-b border-border pb-4 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 py-1 text-left"
      >
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180"
          )}
        />
      </button>
      {open ? <div className="mt-2 space-y-2 text-[13px] leading-relaxed text-muted-foreground">{children}</div> : null}
    </section>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-1.5 pl-5">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function AssignmentTeachPanel({
  teach,
  languageLabel,
  className,
}: {
  teach: AssignmentTeachContent;
  languageLabel: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "min-h-0 overflow-y-auto overscroll-contain bg-background p-4 sm:p-5",
        className
      )}
    >
      <div className="space-y-5">
        <header className="space-y-1.5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Teacher explanation · {languageLabel}
          </p>
          <h2 className="text-lg font-semibold text-foreground">Assignment brief</h2>
        </header>

        <Section title="1. Introduction">
          <p className="whitespace-pre-wrap">{teach.introduction}</p>
        </Section>
        <Section title="2. Learning Goals">
          <Bullets items={teach.learningGoals} />
        </Section>
        <Section title="3. Real-world Scenario">
          <p className="whitespace-pre-wrap">{teach.realWorldScenario}</p>
        </Section>
        <Section title="4. Requirements">
          <Bullets items={teach.requirements} />
        </Section>
        <Section title="5. Expected Output">
          <p className="whitespace-pre-wrap">{teach.expectedOutput}</p>
        </Section>
        <Section title="6. Acceptance Criteria">
          <Bullets items={teach.acceptanceCriteria} />
        </Section>
        <Section title="7. Hints" defaultOpen={false}>
          <Bullets items={teach.hints} />
        </Section>
        <Section title="8. Common Mistakes">
          <Bullets items={teach.commonMistakes} />
        </Section>
        <Section title="9. Best Practices">
          <Bullets items={teach.bestPractices} />
        </Section>
        <Section title="10. Submission Checklist">
          <Bullets items={teach.submissionChecklist} />
        </Section>
      </div>
    </div>
  );
}
