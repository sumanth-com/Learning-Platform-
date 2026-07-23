"use client";

import type {
  AssignmentCardStatus,
  AssignmentListingItem,
} from "@/curriculum/assignment-catalog";
import { AssignmentCard } from "@/components/assignments/journey/assignment-card";

type AssignmentModuleSectionProps = {
  moduleNumber: number;
  title: string;
  unlocked: boolean;
  assignments: Array<{
    assignment: AssignmentListingItem;
    status: AssignmentCardStatus;
    completionDate?: string;
  }>;
};

export function AssignmentModuleSection({
  moduleNumber,
  title,
  unlocked: _unlocked,
  assignments,
}: AssignmentModuleSectionProps) {
  return (
    <section className="w-full min-w-0 space-y-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-sm font-semibold text-foreground">
          <span className="text-muted-foreground">Module {moduleNumber}</span>
          <span className="mx-2 text-border">·</span>
          {title}
        </h2>
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {assignments.length} assignment{assignments.length === 1 ? "" : "s"}
        </p>
      </div>
      <div className="grid w-full min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
        {assignments.map(({ assignment, status, completionDate }) => (
          <div key={assignment.id} className="min-w-0">
            <AssignmentCard
              assignment={assignment}
              status={status}
              completionDate={completionDate}
              locked={false}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
