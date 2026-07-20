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
  createCourseAction,
  updateCourseAction,
} from "@/features/admin/actions/course-actions";
import { ADMIN_ROUTES } from "@/features/admin/types";
import { slugify } from "@/features/admin/lib/slugify";
import type { CourseRow } from "@/types/database";

type CourseFormProps = {
  course?: CourseRow;
};

export function CourseForm({ course }: CourseFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [title, setTitle] = useState(course?.title ?? "");
  const [slug, setSlug] = useState(course?.slug ?? "");
  const [autoSlug, setAutoSlug] = useState(!course);
  const [isPublished, setIsPublished] = useState(course?.is_published ?? false);

  return (
    <form
      className="mx-auto max-w-2xl space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const payload = {
          title: String(fd.get("title") ?? ""),
          slug: String(fd.get("slug") ?? ""),
          description: String(fd.get("description") ?? ""),
          thumbnail: String(fd.get("thumbnail") ?? "") || null,
          difficulty: String(fd.get("difficulty") ?? "beginner") as
            | "beginner"
            | "intermediate"
            | "advanced",
          estimatedDuration: String(fd.get("estimatedDuration") ?? ""),
          isPublished,
        };

        startTransition(async () => {
          const result = course
            ? await updateCourseAction(course.id, payload)
            : await createCourseAction(payload);
          if (!result.success) {
            toast.error(result.error);
            return;
          }
          toast.success(result.message);
          router.push(ADMIN_ROUTES.courses);
          router.refresh();
        });
      }}
    >
      <Field label="Title" htmlFor="title">
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
      </Field>
      <Field label="Slug" htmlFor="slug">
        <Input
          id="slug"
          name="slug"
          value={slug}
          onChange={(e) => {
            setAutoSlug(false);
            setSlug(e.target.value);
          }}
        />
      </Field>
      <Field label="Description" htmlFor="description">
        <Textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={course?.description ?? ""}
        />
      </Field>
      <Field label="Thumbnail URL" htmlFor="thumbnail">
        <Input
          id="thumbnail"
          name="thumbnail"
          defaultValue={course?.thumbnail ?? ""}
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Difficulty" htmlFor="difficulty">
          <select
            id="difficulty"
            name="difficulty"
            defaultValue={course?.difficulty ?? "beginner"}
            className="flex h-10 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 text-sm"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </Field>
        <Field label="Estimated duration" htmlFor="estimatedDuration">
          <Input
            id="estimatedDuration"
            name="estimatedDuration"
            placeholder="e.g. 12 weeks"
            defaultValue={course?.estimated_duration ?? ""}
          />
        </Field>
      </div>
      <label className="flex items-center gap-2 text-sm text-zinc-300">
        <Checkbox
          checked={isPublished}
          onCheckedChange={(v) => setIsPublished(v === true)}
        />
        Published
      </label>
      <div className="flex gap-2 pt-2">
        <Button type="submit" disabled={pending}>
          {course ? "Save changes" : "Create course"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(ADMIN_ROUTES.courses)}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}
