"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  createModuleAction,
  updateModuleAction,
} from "@/features/admin/actions/module-actions";
import {
  ADMIN_ROUTES,
  MODULE_COLOR_OPTIONS,
  MODULE_ICON_OPTIONS,
} from "@/features/admin/types";
import { slugify } from "@/features/admin/lib/slugify";
import type { ModuleRow, PhaseRow } from "@/types/database";

type ModuleFormProps = {
  module?: ModuleRow;
  phases: PhaseRow[];
};

export function ModuleForm({ module, phases }: ModuleFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [title, setTitle] = useState(module?.title ?? "");
  const [slug, setSlug] = useState(module?.slug ?? "");
  const [autoSlug, setAutoSlug] = useState(!module);
  const [icon, setIcon] = useState(module?.icon ?? "book-open");
  const [color, setColor] = useState(module?.color ?? "indigo");

  return (
    <form
      className="mx-auto max-w-2xl space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const payload = {
          phaseId: String(fd.get("phaseId") ?? ""),
          title: String(fd.get("title") ?? ""),
          slug: String(fd.get("slug") ?? ""),
          description: String(fd.get("description") ?? ""),
          icon,
          color,
          estimatedDuration: String(fd.get("estimatedDuration") ?? ""),
        };
        startTransition(async () => {
          const result = module
            ? await updateModuleAction(module.id, payload)
            : await createModuleAction(payload);
          if (!result.success) {
            toast.error(result.error);
            return;
          }
          toast.success(result.message);
          router.push(ADMIN_ROUTES.modules);
          router.refresh();
        });
      }}
    >
      <div className="space-y-2">
        <Label htmlFor="phaseId">Phase</Label>
        <select
          id="phaseId"
          name="phaseId"
          required
          defaultValue={module?.phase_id ?? ""}
          className="flex h-10 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 text-sm"
        >
          <option value="" disabled>
            Assign to phase
          </option>
          {phases.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
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
          rows={3}
          defaultValue={module?.description ?? ""}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="icon">Icon</Label>
          <select
            id="icon"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            className="flex h-10 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 text-sm"
          >
            {MODULE_ICON_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <p className="text-xs text-zinc-500">
            Lucide icon name stored on the module.
          </p>
        </div>
        <div className="space-y-2">
          <Label>Color</Label>
          <div className="flex flex-wrap gap-2">
            {MODULE_COLOR_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                title={opt.label}
                onClick={() => setColor(opt.value)}
                className={`h-8 w-8 rounded-full border-2 ${
                  color === opt.value ? "border-white" : "border-transparent"
                }`}
                style={{ backgroundColor: opt.hex }}
              />
            ))}
          </div>
          <input type="hidden" name="color" value={color} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="estimatedDuration">Estimated duration</Label>
        <Input
          id="estimatedDuration"
          name="estimatedDuration"
          placeholder="e.g. 2 weeks"
          defaultValue={module?.estimated_duration ?? ""}
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>
          {module ? "Save changes" : "Create module"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(ADMIN_ROUTES.modules)}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
