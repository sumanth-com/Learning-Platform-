"use client";

import Link from "next/link";
import { Building2, Layers, Sparkles, Target } from "lucide-react";
import { DifficultyBadge } from "@/components/curriculum/difficulty-badge";
import { CURRICULUM_ROUTES } from "@/features/curriculum/types";
import type { ModuleHubPayload } from "@/features/curriculum/actions/module-hub-actions";

export function ModulePractice({ payload }: { payload: ModuleHubPayload }) {
  const { detail } = payload;
  const easy = detail.lessons.filter((l) => l.difficulty === "beginner");
  const medium = detail.lessons.filter((l) => l.difficulty === "intermediate");
  const hard = detail.lessons.filter((l) => l.difficulty === "advanced");

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header>
        <h2 className="text-lg font-semibold text-zinc-50">Practice hub</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Topics grouped by difficulty. Interactive playgrounds and company-style
          sets will plug in here without schema changes.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Bucket
          title="Easy"
          icon={Sparkles}
          accent="text-emerald-400"
          items={easy}
          moduleSlug={detail.module.slug}
        />
        <Bucket
          title="Medium"
          icon={Target}
          accent="text-amber-400"
          items={medium}
          moduleSlug={detail.module.slug}
        />
        <Bucket
          title="Hard"
          icon={Layers}
          accent="text-rose-400"
          items={hard}
          moduleSlug={detail.module.slug}
        />
      </div>

      <section className="grid gap-3 md:grid-cols-2">
        <PlaceholderCard
          icon={Building2}
          title="Company style"
          body="Curated interview-style drills for this module — coming soon."
        />
        <PlaceholderCard
          icon={Target}
          title="Real-world scenarios"
          body="Applied scenarios tied to this module’s outcomes — coming soon."
        />
      </section>
    </div>
  );
}

function Bucket({
  title,
  icon: Icon,
  accent,
  items,
  moduleSlug,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
  items: ModuleHubPayload["detail"]["lessons"];
  moduleSlug: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4">
      <div className="mb-3 flex items-center gap-2">
        <Icon className={`h-4 w-4 ${accent}`} />
        <h3 className="text-sm font-semibold text-zinc-100">{title}</h3>
        <span className="text-[11px] text-zinc-600">{items.length}</span>
      </div>
      {items.length === 0 ? (
        <p className="text-xs text-zinc-600">No topics in this band yet.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((lesson) => (
            <li key={lesson.id}>
              <Link
                href={CURRICULUM_ROUTES.moduleTopic(moduleSlug, lesson.slug)}
                className="block rounded-lg border border-zinc-800/60 bg-zinc-950/40 px-3 py-2 transition hover:border-zinc-700"
              >
                <p className="truncate text-xs font-medium text-zinc-200">
                  {lesson.title}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <DifficultyBadge difficulty={lesson.difficulty} />
                  <span className="text-[10px] text-zinc-600">
                    {lesson.durationMinutes}m
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function PlaceholderCard({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-950/30 p-4">
      <Icon className="h-4 w-4 text-indigo-400" />
      <p className="mt-2 text-sm font-semibold text-zinc-200">{title}</p>
      <p className="mt-1 text-xs text-zinc-500">{body}</p>
    </div>
  );
}
