"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { AssignmentSubmissionPanel } from "@/components/assignments/journey/assignment-submission-panel";
import type { AssignmentListingItem } from "@/curriculum/assignment-catalog";
import type { AssignmentProgressMeta } from "@/store/progress-types";
import { cn } from "@/lib/utils";

type AssignmentLabWorkspaceProps = {
  listing: AssignmentListingItem;
  isComplete: boolean;
  meta?: AssignmentProgressMeta;
  onToggleComplete: (done: boolean) => void;
  onSaveSubmission: (updates: Partial<AssignmentProgressMeta>) => void;
};

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[15px] font-bold uppercase tracking-wide text-foreground">
      {children}
    </h2>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-1.5 pl-5 text-[15px] leading-relaxed text-foreground/90">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function AssignmentLabWorkspace({
  listing,
  isComplete,
  meta,
  onToggleComplete,
  onSaveSubmission,
}: AssignmentLabWorkspaceProps) {
  const { teach } = listing;
  const assignmentLabel = `Assignment ${String(listing.number).padStart(2, "0")} – ${listing.title}`;

  return (
    <div
      data-assignment-lab
      className="h-full min-h-0 overflow-y-auto overscroll-contain bg-background"
    >
      <div className="mx-auto w-full max-w-none px-3 pb-16 pt-2 sm:px-4 lg:px-5">
        <div className="mb-3 flex justify-end">
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
              "inline-flex h-9 min-w-[10.25rem] cursor-pointer items-center justify-center gap-1.5 overflow-hidden rounded-full border-2 px-4 text-xs font-bold shadow-sm transition-all duration-300",
              isComplete
                ? "border-[#047857] bg-[#059669] text-white hover:bg-[#047857]"
                : "border-[#111113] bg-[#111113] text-white hover:bg-[#27272a]"
            )}
          >
            <AnimatePresence mode="wait" initial={false}>
              {isComplete ? (
                <motion.span
                  key="solved"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="pointer-events-none inline-flex items-center gap-1.5 text-white"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                  Solved
                </motion.span>
              ) : (
                <motion.span
                  key="unsolved"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="pointer-events-none inline-flex items-center gap-1.5 text-white"
                >
                  <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-white" />
                  Mark as Solved
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>

        <article className="w-full rounded-sm border border-border bg-white px-6 py-8 text-foreground shadow-sm sm:px-10 sm:py-10 lg:px-12 dark:bg-card">
          <header className="space-y-5 border-b border-border pb-6 text-center">
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
              {assignmentLabel}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[15px] leading-relaxed">
              <p>
                <span className="font-semibold">Estimated Duration:</span>{" "}
                {listing.estimatedTime}
              </p>
              <p>
                <span className="font-semibold">Module:</span>{" "}
                {listing.displayModuleTitle}
              </p>
              <p>
                <span className="font-semibold">Type:</span> {listing.type}
              </p>
            </div>
          </header>

          <div className="space-y-8 pt-7">
            <section className="space-y-2">
              <Heading>Objective</Heading>
              <p className="text-[15px] leading-relaxed text-foreground/90">
                {teach.objective}
              </p>
            </section>

            <section className="space-y-2">
              <Heading>Instructions</Heading>
              <p className="text-[15px] leading-relaxed text-foreground/90">
                {teach.instructions}
              </p>
              <div className="space-y-2 pt-1">
                <p className="font-semibold text-foreground">Note:</p>
                <Bullets items={teach.notes} />
              </div>
            </section>

            <section className="space-y-2">
              <Heading>Project Structure</Heading>
              <p className="text-[15px] leading-relaxed text-foreground/90">
                Create a folder named:
              </p>
              <p className="rounded-md border border-border bg-muted/40 px-3 py-2 font-mono text-sm">
                {teach.projectStructure.folderName}
              </p>
              <p className="pt-1 text-[15px] leading-relaxed text-foreground/90">
                Inside the folder create:
              </p>
              <ul className="list-none space-y-1 pl-0 font-mono text-sm text-foreground/90">
                {teach.projectStructure.files.map((file) => (
                  <li key={file}>{file}</li>
                ))}
              </ul>
            </section>

            <section className="space-y-5">
              <Heading>Assignment Requirements</Heading>
              {teach.requirementSections.map((section, index) => (
                <div key={section.title} className="space-y-2">
                  <h3 className="text-[15px] font-semibold text-foreground">
                    {index + 1}. {section.title}
                  </h3>
                  <Bullets items={section.items} />
                  {section.note ? (
                    <p className="text-sm italic text-muted-foreground">
                      {section.note}
                    </p>
                  ) : null}
                </div>
              ))}
            </section>

            <section className="space-y-2">
              <Heading>Submission Requirements</Heading>
              <Bullets items={teach.submissionRequirements} />
            </section>

            <section className="space-y-2">
              <Heading>Submission Checklist</Heading>
              <p className="text-[15px] text-foreground/90">
                Before submitting, ensure that:
              </p>
              <Bullets items={teach.submissionChecklist} />
            </section>

            <p className="pt-2 text-center text-base font-semibold tracking-wide text-foreground">
              Good Luck!
            </p>
          </div>
        </article>

        <div className="mt-6">
          <AssignmentSubmissionPanel
            listing={listing}
            meta={meta}
            onSave={onSaveSubmission}
          />
        </div>
      </div>
    </div>
  );
}
