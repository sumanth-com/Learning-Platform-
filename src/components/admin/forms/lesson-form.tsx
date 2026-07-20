"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import {
  createLessonAction,
  updateLessonAction,
} from "@/features/admin/actions/lesson-actions";
import { ADMIN_ROUTES } from "@/features/admin/types";
import { slugify } from "@/features/admin/lib/slugify";
import type { LessonRow, ModuleRow } from "@/types/database";

type LessonFormProps = {
  lesson?: LessonRow;
  modules: ModuleRow[];
};

export function LessonForm({ lesson, modules }: LessonFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [title, setTitle] = useState(lesson?.title ?? "");
  const [slug, setSlug] = useState(lesson?.slug ?? "");
  const [autoSlug, setAutoSlug] = useState(!lesson);
  const [content, setContent] = useState(lesson?.content ?? "");
  const [objectivesText, setObjectivesText] = useState(
    (lesson?.learning_objectives ?? []).join("\n")
  );
  const [isPreview, setIsPreview] = useState(lesson?.is_preview ?? false);

  return (
    <form
      className="mx-auto max-w-3xl space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const payload = {
          moduleId: String(fd.get("moduleId") ?? ""),
          title: String(fd.get("title") ?? ""),
          slug: String(fd.get("slug") ?? ""),
          description: String(fd.get("description") ?? ""),
          content,
          durationMinutes: Number(fd.get("durationMinutes") ?? 15),
          difficulty: String(fd.get("difficulty") ?? "beginner") as
            | "beginner"
            | "intermediate"
            | "advanced",
          videoUrl: String(fd.get("videoUrl") ?? "") || null,
          isPreview,
          learningObjectives: objectivesText
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean),
        };
        startTransition(async () => {
          const result = lesson
            ? await updateLessonAction(lesson.id, payload)
            : await createLessonAction(payload);
          if (!result.success) {
            toast.error(result.error);
            return;
          }
          toast.success(result.message);
          router.push(ADMIN_ROUTES.lessons);
          router.refresh();
        });
      }}
    >
      <div className="space-y-2">
        <Label htmlFor="moduleId">Module</Label>
        <select
          id="moduleId"
          name="moduleId"
          required
          defaultValue={lesson?.module_id ?? ""}
          className="flex h-10 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 text-sm"
        >
          <option value="" disabled>
            Select module
          </option>
          {modules.map((m) => (
            <option key={m.id} value={m.id}>
              {m.title}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
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
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          rows={2}
          defaultValue={lesson?.description ?? ""}
        />
      </div>
      <RichTextEditor value={content} onChange={setContent} />
      <div className="space-y-2">
        <Label htmlFor="videoUrl">Video URL</Label>
        <Input
          id="videoUrl"
          name="videoUrl"
          placeholder="https://…"
          defaultValue={lesson?.video_url ?? ""}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="difficulty">Difficulty</Label>
          <select
            id="difficulty"
            name="difficulty"
            defaultValue={lesson?.difficulty ?? "beginner"}
            className="flex h-10 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 text-sm"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="durationMinutes">Duration (minutes)</Label>
          <Input
            id="durationMinutes"
            name="durationMinutes"
            type="number"
            min={1}
            defaultValue={lesson?.duration_minutes ?? 15}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="objectives">Learning objectives</Label>
        <Textarea
          id="objectives"
          rows={4}
          value={objectivesText}
          onChange={(e) => setObjectivesText(e.target.value)}
          placeholder="One objective per line"
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-zinc-300">
        <Checkbox
          checked={isPreview}
          onCheckedChange={(v) => setIsPreview(v === true)}
        />
        Preview lesson (visible without full access)
      </label>
      <p className="text-xs text-zinc-500">
        Attach resources from the Resources section after saving.
      </p>
      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>
          {lesson ? "Save changes" : "Create lesson"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(ADMIN_ROUTES.lessons)}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
