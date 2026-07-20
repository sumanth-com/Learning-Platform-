"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  createPhaseAction,
  updatePhaseAction,
} from "@/features/admin/actions/phase-actions";
import { ADMIN_ROUTES } from "@/features/admin/types";
import { slugify } from "@/features/admin/lib/slugify";
import type { CourseRow, PhaseRow } from "@/types/database";

type PhaseFormProps = {
  phase?: PhaseRow;
  courses: CourseRow[];
};

export function PhaseForm({ phase, courses }: PhaseFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [title, setTitle] = useState(phase?.title ?? "");
  const [slug, setSlug] = useState(phase?.slug ?? "");
  const [autoSlug, setAutoSlug] = useState(!phase);

  return (
    <form
      className="mx-auto max-w-2xl space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const payload = {
          courseId: String(fd.get("courseId") ?? ""),
          title: String(fd.get("title") ?? ""),
          slug: String(fd.get("slug") ?? ""),
          description: String(fd.get("description") ?? ""),
        };
        startTransition(async () => {
          const result = phase
            ? await updatePhaseAction(phase.id, payload)
            : await createPhaseAction(payload);
          if (!result.success) {
            toast.error(result.error);
            return;
          }
          toast.success(result.message);
          router.push(ADMIN_ROUTES.phases);
          router.refresh();
        });
      }}
    >
      <div className="space-y-2">
        <Label htmlFor="courseId">Course</Label>
        <select
          id="courseId"
          name="courseId"
          required
          defaultValue={phase?.course_id ?? ""}
          className="flex h-10 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 text-sm"
        >
          <option value="" disabled>
            Select course
          </option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
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
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (autoSlug) setSlug(slugify(e.target.value));
          }}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          name="slug"
          value={slug}
          onChange={(e) => {
            setAutoSlug(false);
            setSlug(e.target.value);
          }}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={phase?.description ?? ""}
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>
          {phase ? "Save changes" : "Create phase"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(ADMIN_ROUTES.phases)}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
