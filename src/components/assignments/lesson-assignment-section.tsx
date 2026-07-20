import Link from "next/link";
import { ArrowRight, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DifficultyBadge } from "@/components/curriculum/difficulty-badge";
import { SubmissionStatusBadge } from "@/components/assignments/submission-status-badge";
import { ASSIGNMENT_ROUTES } from "@/features/assignments/types";
import type { AssignmentSummary } from "@/features/assignments/types";

interface LessonAssignmentSectionProps {
  assignments: AssignmentSummary[];
}

export function LessonAssignmentSection({
  assignments,
}: LessonAssignmentSectionProps) {
  if (assignments.length === 0) {
    return (
      <section className="mt-12 rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/40 p-6">
        <h2 className="text-sm font-semibold text-zinc-100">Assignment</h2>
        <p className="mt-2 text-sm text-zinc-500">
          No published assignment for this lesson yet.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-12 space-y-4">
      <div className="flex items-center gap-2">
        <ClipboardList className="h-4 w-4 text-indigo-400" />
        <h2 className="text-xl font-semibold tracking-tight text-zinc-50">
          Assignment
        </h2>
      </div>

      <div className="space-y-3">
        {assignments.map((assignment) => (
          <div
            key={assignment.id}
            className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 space-y-2">
                <h3 className="text-base font-semibold text-zinc-100">
                  {assignment.title}
                </h3>
                <p className="text-sm text-zinc-400">{assignment.description}</p>
                <div className="flex flex-wrap items-center gap-2">
                  <DifficultyBadge difficulty={assignment.difficulty} />
                  <span className="text-xs text-zinc-500">
                    {assignment.estimatedTime} · {assignment.totalMarks} marks ·{" "}
                    {assignment.dueDays} days
                  </span>
                  {assignment.submissionStatus ? (
                    <SubmissionStatusBadge
                      status={assignment.submissionStatus}
                    />
                  ) : null}
                </div>
              </div>
              <Link href={ASSIGNMENT_ROUTES.detail(assignment.id)}>
                <Button className="gap-2">
                  Open assignment
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
