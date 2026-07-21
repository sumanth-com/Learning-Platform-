"use client";

import { FolderKanban } from "lucide-react";
import type { ModuleHubPayload } from "@/features/curriculum/actions/module-hub-actions";

export function ModuleProjects({ payload }: { payload: ModuleHubPayload }) {
  const isProjectModule = /project/i.test(payload.detail.module.title);

  const tiers = [
    {
      title: "Mini project",
      body: isProjectModule
        ? `Ship a small build for ${payload.detail.module.title}.`
        : "Short builds that reinforce this module’s core topics.",
    },
    {
      title: "Intermediate project",
      body: "Combine multiple topics from this module into one deliverable.",
    },
    {
      title: "Capstone",
      body: /capstone/i.test(payload.detail.phase.title)
        ? "Phase-level capstone — design, build, and present."
        : "Available when this module sits in a capstone phase.",
    },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <h2 className="text-lg font-semibold text-zinc-50">Projects</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Project tracks for this module. Content expands as mentors publish
          project briefs.
        </p>
      </header>

      <div className="grid gap-3">
        {tiers.map((tier) => (
          <div
            key={tier.title}
            className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4"
          >
            <div className="flex items-center gap-2">
              <FolderKanban className="h-4 w-4 text-indigo-400" />
              <h3 className="text-sm font-semibold text-zinc-100">
                {tier.title}
              </h3>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-zinc-500">
              {tier.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
