"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { reviewSubmissionAction } from "@/features/assignments/actions/assignment-actions";
import {
  reviewSubmissionSchema,
  type ReviewSubmissionFormValues,
} from "@/features/assignments/schemas/assignment-schemas";
import { SubmissionStatusBadge } from "@/components/assignments/submission-status-badge";
import type { AssignmentSubmissionRow } from "@/types/database";

interface MentorReviewPanelProps {
  assignmentId: string;
  totalMarks: number;
  submissions: AssignmentSubmissionRow[];
}

export function MentorReviewPanel({
  assignmentId,
  totalMarks,
  submissions,
}: MentorReviewPanelProps) {
  if (submissions.length === 0) {
    return (
      <section className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/40 p-6">
        <h2 className="text-sm font-semibold text-zinc-100">Mentor review</h2>
        <p className="mt-2 text-sm text-zinc-500">No submissions yet.</p>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold tracking-tight text-zinc-50">
        Mentor review
      </h2>
      <div className="space-y-4">
        {submissions.map((submission) => (
          <ReviewCard
            key={submission.id}
            assignmentId={assignmentId}
            totalMarks={totalMarks}
            submission={submission}
          />
        ))}
      </div>
    </section>
  );
}

function ReviewCard({
  assignmentId,
  totalMarks,
  submission,
}: {
  assignmentId: string;
  totalMarks: number;
  submission: AssignmentSubmissionRow;
}) {
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReviewSubmissionFormValues>({
    resolver: zodResolver(reviewSubmissionSchema),
    defaultValues: {
      submissionId: submission.id,
      status:
        submission.status === "approved" ||
        submission.status === "revision_requested" ||
        submission.status === "under_review"
          ? submission.status
          : "under_review",
      marks: submission.marks ?? undefined,
      feedback: submission.feedback ?? "",
    },
  });

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      const result = await reviewSubmissionAction(assignmentId, values);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success(result.message);
    });
  });

  return (
    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm text-zinc-400">
          <p className="font-medium text-zinc-200">
            Student · {submission.profile_id.slice(0, 8)}…
          </p>
          <a
            href={submission.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-300 hover:text-indigo-200"
          >
            {submission.github_url}
          </a>
        </div>
        <SubmissionStatusBadge status={submission.status} />
      </div>

      <form onSubmit={onSubmit} className="space-y-3" noValidate>
        <input type="hidden" {...register("submissionId")} />

        <div className="space-y-2">
          <Label htmlFor={`status-${submission.id}`}>Status</Label>
          <select
            id={`status-${submission.id}`}
            className="flex h-10 w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-3 text-sm text-zinc-100"
            disabled={isPending}
            {...register("status")}
          >
            <option value="under_review">Under review</option>
            <option value="revision_requested">Revision requested</option>
            <option value="approved">Approved</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`marks-${submission.id}`}>
            Marks (max {totalMarks})
          </Label>
          <Input
            id={`marks-${submission.id}`}
            type="number"
            min={0}
            max={totalMarks}
            disabled={isPending}
            {...register("marks", { valueAsNumber: true })}
          />
          {errors.marks ? (
            <p className="text-xs text-red-400">{errors.marks.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor={`feedback-${submission.id}`}>Feedback</Label>
          <Textarea
            id={`feedback-${submission.id}`}
            rows={3}
            disabled={isPending}
            {...register("feedback")}
          />
        </div>

        <Button type="submit" size="sm" disabled={isPending} className="gap-2">
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving…
            </>
          ) : (
            "Save review"
          )}
        </Button>
      </form>
    </div>
  );
}
