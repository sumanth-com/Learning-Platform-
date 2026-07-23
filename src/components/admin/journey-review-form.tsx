"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { reviewJourneySubmissionAction } from "@/features/assignments/actions/journey-assignment-actions";
import { reviewJourneySubmissionSchema } from "@/features/assignments/schemas/journey-assignment-schemas";
import { SubmissionStatusBadge } from "@/components/assignments/submission-status-badge";
import type { JourneyAssignmentSubmissionRow } from "@/types/database";

type FormValues = z.infer<typeof reviewJourneySubmissionSchema>;

export function JourneyReviewForm({
  submission,
}: {
  submission: JourneyAssignmentSubmissionRow;
}) {
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(reviewJourneySubmissionSchema),
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
      const result = await reviewJourneySubmissionAction(values);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success(result.message ?? "Review saved.");
    });
  });

  return (
    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1 text-sm">
          <p className="font-medium text-zinc-100">
            {submission.student_name || "Student"}
          </p>
          <p className="text-zinc-500">{submission.student_email}</p>
          <p className="text-zinc-300">
            A{submission.assignment_number}: {submission.assignment_title}
          </p>
          <p className="text-xs text-zinc-500">{submission.module_title}</p>
        </div>
        <SubmissionStatusBadge status={submission.status} />
      </div>

      <div className="mb-4 space-y-1.5 text-sm">
        {submission.github_url ? (
          <p>
            <span className="text-zinc-500">GitHub: </span>
            <a
              href={submission.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-300 hover:text-indigo-200"
            >
              {submission.github_url}
            </a>
          </p>
        ) : null}
        {submission.live_url ? (
          <p>
            <span className="text-zinc-500">Live: </span>
            <a
              href={submission.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-300 hover:text-indigo-200"
            >
              {submission.live_url}
            </a>
          </p>
        ) : null}
        {submission.screenshots ? (
          <p className="text-zinc-400">
            <span className="text-zinc-500">Screenshots: </span>
            {submission.screenshots}
          </p>
        ) : null}
        {submission.notes ? (
          <p className="text-zinc-400">
            <span className="text-zinc-500">Notes: </span>
            {submission.notes}
          </p>
        ) : null}
        {submission.reflection ? (
          <p className="text-zinc-400">
            <span className="text-zinc-500">Reflection: </span>
            {submission.reflection}
          </p>
        ) : null}
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
          <Label htmlFor={`marks-${submission.id}`}>Marks (0–1000)</Label>
          <Input
            id={`marks-${submission.id}`}
            type="number"
            min={0}
            max={1000}
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
