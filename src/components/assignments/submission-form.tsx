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
import { submitAssignmentAction } from "@/features/assignments/actions/assignment-actions";
import {
  submitAssignmentSchema,
  type SubmitAssignmentFormValues,
} from "@/features/assignments/schemas/assignment-schemas";
import type { AssignmentSubmissionRow } from "@/types/database";
import { canStudentEditSubmission } from "@/features/assignments/types";

interface SubmissionFormProps {
  assignmentId: string;
  submission: AssignmentSubmissionRow | null;
}

export function SubmissionForm({
  assignmentId,
  submission,
}: SubmissionFormProps) {
  const editable = !submission || canStudentEditSubmission(submission.status);
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SubmitAssignmentFormValues>({
    resolver: zodResolver(submitAssignmentSchema),
    defaultValues: {
      githubUrl: submission?.github_url ?? "",
      demoUrl: submission?.demo_url ?? "",
      notes: submission?.notes ?? "",
    },
  });

  if (!editable) {
    return (
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5 text-sm text-zinc-400">
        This submission is locked ({submission?.status.replaceAll("_", " ")}
        ). You can view marks and feedback below.
      </div>
    );
  }

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      const result = await submitAssignmentAction(assignmentId, values);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success(result.message);
    });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="space-y-2">
        <Label htmlFor="githubUrl">GitHub repository</Label>
        <Input
          id="githubUrl"
          placeholder="https://github.com/you/repo"
          disabled={isPending}
          {...register("githubUrl")}
        />
        {errors.githubUrl ? (
          <p className="text-xs text-red-400">{errors.githubUrl.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="demoUrl">Demo URL (optional)</Label>
        <Input
          id="demoUrl"
          placeholder="https://your-demo.vercel.app"
          disabled={isPending}
          {...register("demoUrl")}
        />
        {errors.demoUrl ? (
          <p className="text-xs text-red-400">{errors.demoUrl.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          rows={4}
          placeholder="Anything the reviewer should know…"
          disabled={isPending}
          {...register("notes")}
        />
      </div>

      <Button type="submit" disabled={isPending} className="gap-2">
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Submitting…
          </>
        ) : submission ? (
          "Update submission"
        ) : (
          "Submit assignment"
        )}
      </Button>
    </form>
  );
}
