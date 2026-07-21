"use client";

import Link from "next/link";
import { ArrowRight, ClipboardList } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DifficultyBadge } from "@/components/curriculum/difficulty-badge";
import { SubmissionStatusBadge } from "@/components/assignments/submission-status-badge";
import { ASSIGNMENT_ROUTES } from "@/features/assignments/types";
import type { ModuleHubPayload } from "@/features/curriculum/actions/module-hub-actions";

export function ModuleAssignmentsPanel({
  payload,
}: {
  payload: ModuleHubPayload;
}) {
  const { assignments } = payload;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <h2 className="text-lg font-semibold text-zinc-50">Assignments</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Module deliverables, submission status, and mentor feedback live here.
        </p>
      </header>

      {assignments.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-950/30 p-8 text-center">
          <ClipboardList className="mx-auto h-6 w-6 text-zinc-600" />
          <p className="mt-3 text-sm text-zinc-400">
            No published assignments for this module yet.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {assignments.map((item) => (
            <li key={item.id}>
              <Link
                href={ASSIGNMENT_ROUTES.detail(item.id)}
                className="block rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 transition hover:border-zinc-700"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-zinc-50">
                      {item.title}
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs text-zinc-500">
                      {item.description}
                    </p>
                    <p className="mt-2 text-[11px] text-zinc-600">
                      Topic: {item.lessonTitle}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-zinc-600" />
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <DifficultyBadge difficulty={item.difficulty} />
                  <Badge variant="secondary">{item.estimatedTime}</Badge>
                  <Badge variant="secondary">{item.totalMarks} marks</Badge>
                  {item.submissionStatus ? (
                    <SubmissionStatusBadge status={item.submissionStatus} />
                  ) : (
                    <Badge variant="secondary">Not started</Badge>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <p className="text-xs text-zinc-600">
        Open an assignment for submission history, mentor feedback, and
        revisions.
      </p>
    </div>
  );
}
