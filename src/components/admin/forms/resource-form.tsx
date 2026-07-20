"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  createResourceAction,
  updateResourceAction,
} from "@/features/admin/actions/resource-actions";
import {
  ADMIN_ROUTES,
  ASSIGNMENT_RESOURCE_TYPES,
  LESSON_RESOURCE_TYPES,
} from "@/features/admin/types";
import type { AssignmentRow, LessonRow } from "@/types/database";

type ResourceFormProps = {
  mode?: "create" | "edit";
  resourceId?: string;
  initial?: {
    scope: "lesson" | "assignment";
    parentId: string;
    title: string;
    type: string;
    url: string;
  };
  lessons: LessonRow[];
  assignments: AssignmentRow[];
};

export function ResourceForm({
  mode = "create",
  resourceId,
  initial,
  lessons,
  assignments,
}: ResourceFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [scope, setScope] = useState<"lesson" | "assignment">(
    initial?.scope ?? "lesson"
  );

  const typeOptions =
    scope === "lesson" ? LESSON_RESOURCE_TYPES : ASSIGNMENT_RESOURCE_TYPES;

  return (
    <form
      className="mx-auto max-w-2xl space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const payload = {
          scope,
          parentId: String(fd.get("parentId") ?? ""),
          title: String(fd.get("title") ?? ""),
          type: String(fd.get("type") ?? ""),
          url: String(fd.get("url") ?? ""),
        };
        startTransition(async () => {
          const result =
            mode === "edit" && resourceId
              ? await updateResourceAction(resourceId, scope, payload)
              : await createResourceAction(payload);
          if (!result.success) {
            toast.error(result.error);
            return;
          }
          toast.success(result.message);
          router.push(ADMIN_ROUTES.resources);
          router.refresh();
        });
      }}
    >
      <div className="space-y-2">
        <Label>Scope</Label>
        <div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            variant={scope === "lesson" ? "default" : "outline"}
            disabled={mode === "edit"}
            onClick={() => setScope("lesson")}
          >
            Lesson
          </Button>
          <Button
            type="button"
            size="sm"
            variant={scope === "assignment" ? "default" : "outline"}
            disabled={mode === "edit"}
            onClick={() => setScope("assignment")}
          >
            Assignment
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="parentId">
          {scope === "lesson" ? "Lesson" : "Assignment"}
        </Label>
        <select
          id="parentId"
          name="parentId"
          required
          disabled={mode === "edit"}
          defaultValue={initial?.parentId ?? ""}
          className="flex h-10 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 text-sm disabled:opacity-60"
        >
          <option value="" disabled>
            Select parent
          </option>
          {scope === "lesson"
            ? lessons.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.title}
                </option>
              ))
            : assignments.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.title}
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
          defaultValue={initial?.title ?? ""}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="type">Type</Label>
        <select
          id="type"
          name="type"
          required
          defaultValue={initial?.type ?? typeOptions[0]?.value}
          className="flex h-10 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 text-sm"
        >
          {typeOptions.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="url">URL</Label>
        <Input
          id="url"
          name="url"
          type="url"
          required
          placeholder="https://…"
          defaultValue={initial?.url ?? ""}
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>
          {mode === "edit" ? "Save changes" : "Create resource"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(ADMIN_ROUTES.resources)}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
