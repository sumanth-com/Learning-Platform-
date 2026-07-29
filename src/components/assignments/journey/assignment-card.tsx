"use client";

import Link from "next/link";
import { Lock, CheckCircle2 } from "lucide-react";
import type {
  AssignmentCardStatus,
  AssignmentListingItem,
} from "@/curriculum/assignment-catalog";
import { cn } from "@/lib/utils";

const STATUS_LABEL: Record<AssignmentCardStatus, string> = {
  locked: "Locked",
  available: "Available",
  in_progress: "In Progress",
  submitted: "Submitted",
  revision_requested: "Revision Requested",
  reviewed: "Reviewed",
  completed: "Completed",
};

type AssignmentCardProps = {
  assignment: AssignmentListingItem;
  status: AssignmentCardStatus;
  completionDate?: string;
  locked?: boolean;
};

export function AssignmentCard({
  assignment,
  status,
  completionDate,
  locked = false,
}: AssignmentCardProps) {
  const inner = (
    <article
      className={cn(
        "flex h-full min-w-0 flex-col rounded-2xl border border-border bg-card p-4 sm:p-5 transition",
        locked
          ? "cursor-not-allowed opacity-55"
          : "hover:border-muted-foreground/30 hover:shadow-md hover:shadow-black/5",
        status === "completed" && "ring-1 ring-emerald-500/25"
      )}
    >
      <div className="mb-3 flex min-w-0 flex-wrap items-center gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Assignment {String(assignment.number).padStart(2, "0")}
        </span>
        <span className="max-w-full truncate rounded-full border border-border bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
          {assignment.type}
        </span>
        <span className="ml-auto inline-flex shrink-0 items-center gap-1 text-[11px] font-medium text-muted-foreground">
          {locked ? (
            <Lock className="h-3 w-3" />
          ) : status === "completed" ? (
            <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
          ) : null}
          {STATUS_LABEL[status]}
        </span>
      </div>

      <h3 className="text-base font-bold leading-snug text-foreground">
        {assignment.title}
      </h3>
      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
        {assignment.description}
      </p>

      <div className="mt-3 flex min-w-0 flex-wrap gap-1.5">
        {assignment.skills.slice(0, 3).map((skill) => (
          <span
            key={skill}
            className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="mt-auto flex min-w-0 items-end justify-between gap-3 border-t border-border pt-4 text-[11px] text-muted-foreground">
        <div className="min-w-0 space-y-0.5">
          <p className="truncate font-medium uppercase tracking-wider">
            {assignment.displayModuleTitle}
          </p>
          <p className="truncate">{assignment.estimatedTime}</p>
          {status === "completed" && completionDate ? (
            <p className="text-emerald-700">
              ✓ Completed ·{" "}
              {new Date(completionDate).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          ) : null}
        </div>
        <span className="shrink-0 font-semibold text-foreground">
          {assignment.xp} XP
        </span>
      </div>
    </article>
  );

  if (locked) {
    return <div className="h-full min-w-0">{inner}</div>;
  }

  return (
    <Link
      href={assignment.href}
      className="block h-full min-w-0 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      {inner}
    </Link>
  );
}
