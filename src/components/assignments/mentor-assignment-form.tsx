"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  createAssignmentAction,
  publishAssignmentAction,
} from "@/features/assignments/actions/assignment-actions";
import {
  createAssignmentSchema,
  type CreateAssignmentFormValues,
} from "@/features/assignments/schemas/assignment-schemas";
import { ASSIGNMENT_ROUTES } from "@/features/assignments/types";

interface MentorAssignmentFormProps {
  lessonId: string;
}

/**
 * Minimal mentor create + publish form shown on the lesson page for instructors.
 */
export function MentorAssignmentForm({ lessonId }: MentorAssignmentFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateAssignmentFormValues>({
    resolver: zodResolver(createAssignmentSchema),
    defaultValues: {
      lessonId,
      title: "",
      description: "",
      instructions: "",
      difficulty: "beginner",
      estimatedTime: "1 hour",
      totalMarks: 100,
      dueDays: 7,
      isPublished: true,
    },
  });

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      const result = await createAssignmentAction(values);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      if (values.isPublished && result.data?.id) {
        await publishAssignmentAction(result.data.id, true);
      }
      toast.success(result.message);
      reset();
      if (result.data?.id) {
        router.push(ASSIGNMENT_ROUTES.detail(result.data.id));
      }
    });
  });

  return (
    <section className="mt-10 rounded-2xl border border-indigo-500/20 bg-indigo-950/20 p-6">
      <h2 className="text-sm font-semibold text-indigo-200">
        Mentor · Create assignment
      </h2>
      <form onSubmit={onSubmit} className="mt-4 space-y-3" noValidate>
        <input type="hidden" {...register("lessonId")} />
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" disabled={isPending} {...register("title")} />
          {errors.title ? (
            <p className="text-xs text-red-400">{errors.title.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            rows={2}
            disabled={isPending}
            {...register("description")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="instructions">Instructions</Label>
          <Textarea
            id="instructions"
            rows={4}
            disabled={isPending}
            {...register("instructions")}
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="difficulty">Difficulty</Label>
            <select
              id="difficulty"
              className="flex h-10 w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-3 text-sm"
              disabled={isPending}
              {...register("difficulty")}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="totalMarks">Marks</Label>
            <Input
              id="totalMarks"
              type="number"
              disabled={isPending}
              {...register("totalMarks", { valueAsNumber: true })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dueDays">Due days</Label>
            <Input
              id="dueDays"
              type="number"
              disabled={isPending}
              {...register("dueDays", { valueAsNumber: true })}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="estimatedTime">Estimated time</Label>
          <Input
            id="estimatedTime"
            disabled={isPending}
            {...register("estimatedTime")}
          />
        </div>
        <Button type="submit" disabled={isPending} className="gap-2">
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating…
            </>
          ) : (
            "Create & publish"
          )}
        </Button>
      </form>
    </section>
  );
}
