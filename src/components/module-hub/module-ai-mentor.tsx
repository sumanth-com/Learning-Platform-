"use client";

import { Bot, MessageSquare } from "lucide-react";
import type { ModuleHubPayload } from "@/features/curriculum/actions/module-hub-actions";

export function ModuleAiMentor({ payload }: { payload: ModuleHubPayload }) {
  const { detail } = payload;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <h2 className="text-lg font-semibold text-zinc-50">AI Mentor</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Context-aware help for <span className="text-zinc-300">{detail.module.title}</span>.
          Integration hooks are ready — chat ships without changing curriculum
          tables.
        </p>
      </header>

      <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/40 p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-500/30 bg-indigo-500/10">
          <Bot className="h-6 w-6 text-indigo-300" />
        </div>
        <p className="mt-4 text-sm font-medium text-zinc-200">
          Module-aware mentor coming soon
        </p>
        <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-zinc-500">
          Ask about topics you’ve opened, stuck explanations, or assignment
          rubrics — scoped to this module’s lessons and resources.
        </p>
        <div className="mx-auto mt-6 flex max-w-lg items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/50 px-3 py-2.5 text-left text-xs text-zinc-600">
          <MessageSquare className="h-3.5 w-3.5 shrink-0" />
          Ask anything about {detail.module.title}…
        </div>
      </div>
    </div>
  );
}
