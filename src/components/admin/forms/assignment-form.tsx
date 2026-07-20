"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  createAdminAssignmentAction,
  updateAdminAssignmentAction,
} from "@/features/admin/actions/assignment-actions";
import { ADMIN_ROUTES } from "@/features/admin/types";
import type { AssignmentRow, LessonRow } from "@/types/database";

type AssignmentFormProps = {
  assignment?: AssignmentRow;
  lessons: LessonRow[];
};

export function AssignmentForm({ assignment, lessons }: AssignmentFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [isPublished, setIsPublished] = useState(
    assignment?.is_published ?? false
  );

  return (
    <form
      className="mx-auto max-w-2xl space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const payload = {
          lessonId: String(fd.get("lessonId") ?? ""),
          title: String(fd.get("title") ?? ""),
          description: String(fd.get("description") ?? ""),
          instructions: String(fd.get("instructions") ?? ""),
          difficulty: String(fd.get("difficulty") ?? "beginner") as
            | "beginner"
            | "intermediate"
            | "advanced",
          estimatedTime: String(fd.get("estimatedTime") ?? ""),
          totalMarks: Number(fd.get("totalMarks") ?? 100),
          dueDays: Number(fd.get("dueDays") ?? 7),
          isPublished,
        };
        startTransition(async () => {
          const result = assignment
            ? await updateAdminAssignmentAction(assignment.id, payload)
            : await createAdminAssignmentAction(payload);
          if (!result.success) {
            toast.error(result.error);
            return;
          }
          toast.success(result.message);
          router.push(ADMIN_ROUTES.assignments);
          router.refresh();
        });
      }}
    >
      <div className="space-y-2">
        <Label htmlFor="lessonId">Lesson</Label>
        <select
          id="lessonId"
          name="lessonId"
          required
          defaultValue={assignment?.lesson_id ?? ""}
          className="flex h-10 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 text-sm"
        >
          <option value="" disabled>
            Select lesson
          </option>
          {lessons.map((l) => (
            <option key={l.id} value={l.id}>
              {l.title}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          required
          defaultValue={assignment?.title ?? ""}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={assignment?.description ?? ""}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="instructions">Instructions</Label>
        <Textarea
          id="instructions"
          name="instructions"
          rows={6}
          defaultValue={assignment?.instructions ?? ""}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="difficulty">Difficulty</Label>
          <select
            id="difficulty"
            name="difficulty"
            defaultValue={assignment?.difficulty ?? "beginner"}
            className="flex h-10 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 text-sm"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="estimatedTime">Estimated time</Label>
          <Input
            id="estimatedTime"
            name="estimatedTime"
            placeholder="e.g. 3 hours"
            defaultValue={assignment?.estimated_time ?? ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="totalMarks">Marks</Label>
          <Input
            id="totalMarks"
            name="totalMarks"
            type="number"
            min={1}
            defaultValue={assignment?.total_marks ?? 100}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dueDays">Due days</Label>
          <Input
            id="dueDays"
            name="dueDays"
            type="number"
            min={1}
            defaultValue={assignment?.due_days ?? 7}
          />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm text-zinc-300">
        <Checkbox
          checked={isPublished}
          onCheckedChange={(v) => setIsPublished(v === true)}
        />
        Published
      </label>
      <p className="text-xs text-zinc-500">
        Attach resources from the Resources section after saving.
      </p>
      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>
          {assignment ? "Save changes" : "Create assignment"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(ADMIN_ROUTES.assignments)}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
