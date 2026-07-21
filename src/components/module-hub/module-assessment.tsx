"use client";

import { Award, Code2, HelpCircle, ListChecks } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { ModuleHubPayload } from "@/features/curriculum/actions/module-hub-actions";

export function ModuleAssessment({ payload }: { payload: ModuleHubPayload }) {
  const { detail } = payload;
  const ready = detail.progressPercent >= 100;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <h2 className="text-lg font-semibold text-zinc-50">Assessment</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Check mastery when you finish the module roadmap. Assessment content
          plugs into these slots without schema changes.
        </p>
      </header>

      <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4">
        <div className="flex justify-between text-xs text-zinc-500">
          <span>Module completion</span>
          <span className="tabular-nums text-zinc-300">
            {detail.progressPercent}%
          </span>
        </div>
        <Progress value={detail.progressPercent} className="mt-2 h-1.5" />
        <p className="mt-2 text-xs text-zinc-600">
          {ready
            ? "You’re ready for the module assessment."
            : "Finish topics to unlock the completion certificate path."}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Slot icon={ListChecks} title="MCQs" body="Concept checks for this module." />
        <Slot icon={Code2} title="Coding assessment" body="Hands-on coding tasks." />
        <Slot
          icon={HelpCircle}
          title="Scenario questions"
          body="Apply topics to realistic situations."
        />
        <Slot
          icon={Award}
          title="Completion certificate"
          body={
            ready
              ? "Certificate eligibility unlocked."
              : "Available after 100% module progress."
          }
        />
      </div>
    </div>
  );
}

function Slot({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4">
      <Icon className="h-4 w-4 text-indigo-400" />
      <p className="mt-2 text-sm font-semibold text-zinc-100">{title}</p>
      <p className="mt-1 text-xs text-zinc-500">{body}</p>
    </div>
  );
}
