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
      {open ? (
        <div className="mt-2 space-y-2 text-[13px] leading-relaxed text-muted-foreground">
          {children}
        </div>
      ) : null}
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
          <h2 className="text-lg font-semibold text-foreground">
            Assignment brief
          </h2>
        </header>

        <Section title="1. Objective">
          <p className="whitespace-pre-wrap">{teach.objective}</p>
        </Section>
        <Section title="2. Instructions">
          <p className="whitespace-pre-wrap">{teach.instructions}</p>
        </Section>
        <Section title="3. Notes">
          <Bullets items={teach.notes} />
        </Section>
        <Section title="4. Project Structure">
          <p>
            Create a folder named{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[12px] text-foreground">
              {teach.projectStructure.folderName}
            </code>
          </p>
          <p className="pt-1">Inside the folder create:</p>
          <ul className="list-none space-y-1 font-mono text-[12px] text-foreground/90">
            {teach.projectStructure.files.map((file) => (
              <li key={file}>{file}</li>
            ))}
          </ul>
        </Section>
        <Section title="5. Requirements">
          <div className="space-y-4">
            {teach.requirementSections.map((section) => (
              <div key={section.title} className="space-y-1.5">
                <p className="font-semibold text-foreground">{section.title}</p>
                <Bullets items={section.items} />
                {section.note ? (
                  <p className="text-xs italic text-muted-foreground">
                    {section.note}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </Section>
        <Section title="6. Submission Requirements">
          <Bullets items={teach.submissionRequirements} />
        </Section>
        <Section title="7. Evaluation Criteria">
          <ul className="list-disc space-y-1.5 pl-5">
            {teach.evaluationCriteria.map((item) => (
              <li key={item.criteria}>
                {item.criteria}{" "}
                <span className="text-foreground/70">({item.marks} marks)</span>
              </li>
            ))}
          </ul>
        </Section>
        <Section title="8. Submission Checklist">
          <Bullets items={teach.submissionChecklist} />
        </Section>
      </div>
    </div>
  );
}
