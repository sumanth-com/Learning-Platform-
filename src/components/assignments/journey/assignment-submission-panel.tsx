"use client";

import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import type { AssignmentProgressMeta } from "@/store/progress-types";
import type { AssignmentSubmissionStatus } from "@/curriculum/assignment-catalog";
import type { AssignmentListingItem } from "@/curriculum/assignment-catalog";
import type {
  JourneyAssignmentSubmissionRow,
  SubmissionStatus,
} from "@/types/database";
import {
  getMyJourneySubmissionAction,
  submitJourneyAssignmentAction,
} from "@/features/assignments/actions/journey-assignment-actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STATUS_LABEL: Record<AssignmentSubmissionStatus, string> = {
  not_started: "Not started",
  in_progress: "In progress",
  submitted: "Submitted",
  pending_review: "Pending Review",
  revision_requested: "Revision Requested",
  reviewed: "Reviewed",
  approved: "Approved",
  completed: "Completed",
};

function mapDbStatusToLocal(
  status: SubmissionStatus
): AssignmentSubmissionStatus {
  switch (status) {
    case "revision_requested":
      return "revision_requested";
    case "approved":
      return "approved";
    case "under_review":
      return "reviewed";
    case "submitted":
      return "pending_review";
    case "pending":
    default:
      return "in_progress";
  }
}

function serverRowToMeta(
  row: JourneyAssignmentSubmissionRow
): Partial<AssignmentProgressMeta> {
  return {
    githubUrl: row.github_url,
    liveUrl: row.live_url,
    screenshots: row.screenshots,
    notes: row.notes,
    reflection: row.reflection,
    status: mapDbStatusToLocal(row.status),
    submittedAt: row.submitted_at ?? undefined,
    feedback: row.feedback ?? undefined,
    marks: row.marks ?? undefined,
  };
}

type AssignmentSubmissionPanelProps = {
  listing: AssignmentListingItem;
  meta?: AssignmentProgressMeta;
  onSave: (updates: Partial<AssignmentProgressMeta>) => void;
};

export function AssignmentSubmissionPanel({
  listing,
  meta,
  onSave,
}: AssignmentSubmissionPanelProps) {
  const [githubUrl, setGithubUrl] = useState(meta?.githubUrl ?? "");
  const [liveUrl, setLiveUrl] = useState(meta?.liveUrl ?? "");
  const [screenshots, setScreenshots] = useState(meta?.screenshots ?? "");
  const [notes, setNotes] = useState(meta?.notes ?? "");
  const [reflection, setReflection] = useState(meta?.reflection ?? "");
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState(meta?.feedback ?? "");
  const [marks, setMarks] = useState<number | null>(meta?.marks ?? null);

  useEffect(() => {
    setGithubUrl(meta?.githubUrl ?? "");
    setLiveUrl(meta?.liveUrl ?? "");
    setScreenshots(meta?.screenshots ?? "");
    setNotes(meta?.notes ?? "");
    setReflection(meta?.reflection ?? "");
    setFeedback(meta?.feedback ?? "");
    setMarks(meta?.marks ?? null);
  }, [meta]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const result = await getMyJourneySubmissionAction(listing.id);
      if (cancelled || !result.success || !result.data?.submission) return;
      const updates = serverRowToMeta(result.data.submission);
      onSave(updates);
      setGithubUrl(updates.githubUrl ?? "");
      setLiveUrl(updates.liveUrl ?? "");
      setScreenshots(updates.screenshots ?? "");
      setNotes(updates.notes ?? "");
      setReflection(updates.reflection ?? "");
      setFeedback(updates.feedback ?? "");
      setMarks(updates.marks ?? null);
    })();
    return () => {
      cancelled = true;
    };
    // Sync once per assignment open
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listing.id]);

  const status = meta?.status ?? "not_started";
  const canEdit =
    status === "not_started" ||
    status === "in_progress" ||
    status === "revision_requested" ||
    status === "submitted" ||
    status === "pending_review";

  const submit = () => {
    if (!githubUrl.trim() && !liveUrl.trim()) {
      toast.error("Add a GitHub repo or live URL before submitting.");
      return;
    }

    startTransition(async () => {
      const result = await submitJourneyAssignmentAction({
        catalogId: listing.id,
        assignmentNumber: listing.number,
        assignmentTitle: listing.title,
        moduleSlug: listing.moduleSlug,
        moduleTitle: listing.displayModuleTitle,
        githubUrl: githubUrl.trim(),
        liveUrl: liveUrl.trim(),
        screenshots: screenshots.trim(),
        notes: notes.trim(),
        reflection: reflection.trim(),
      });

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      const submission = result.data?.submission;
      onSave(
        submission
          ? serverRowToMeta(submission)
          : {
              githubUrl: githubUrl.trim(),
              liveUrl: liveUrl.trim(),
              screenshots: screenshots.trim(),
              notes: notes.trim(),
              reflection: reflection.trim(),
              status: "pending_review",
              submittedAt: new Date().toISOString(),
            }
      );
      toast.success(result.message ?? "Submitted for review.");
    });
  };

  const saveDraft = () => {
    onSave({
      githubUrl: githubUrl.trim(),
      liveUrl: liveUrl.trim(),
      screenshots: screenshots.trim(),
      notes: notes.trim(),
      reflection: reflection.trim(),
      status: status === "not_started" ? "in_progress" : status,
    });
    toast.success("Draft saved.");
  };

  return (
    <div className="space-y-3 rounded-xl border border-border bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-foreground">Submission</h3>
        <span
          className={cn(
            "rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
            status === "pending_review" || status === "submitted"
              ? "border-amber-500/35 bg-amber-500/10 text-amber-700"
              : status === "approved" || status === "completed"
                ? "border-emerald-500/35 bg-emerald-500/10 text-emerald-700"
                : status === "revision_requested"
                  ? "border-rose-500/35 bg-rose-500/10 text-rose-700"
                  : "border-border bg-muted text-muted-foreground"
          )}
        >
          {STATUS_LABEL[status]}
        </span>
      </div>

      {(feedback || marks != null) && (
        <div className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm">
          {marks != null ? (
            <p className="font-medium text-foreground">Marks: {marks}</p>
          ) : null}
          {feedback ? (
            <p className="mt-1 text-muted-foreground">{feedback}</p>
          ) : null}
        </div>
      )}

      <label className="block space-y-1">
        <span className="text-[11px] font-medium text-muted-foreground">
          GitHub Repository
        </span>
        <input
          value={githubUrl}
          onChange={(e) => setGithubUrl(e.target.value)}
          disabled={!canEdit || isPending}
          placeholder="https://github.com/you/repo"
          className="h-9 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary/50"
        />
      </label>
      <label className="block space-y-1">
        <span className="text-[11px] font-medium text-muted-foreground">
          Live URL
        </span>
        <input
          value={liveUrl}
          onChange={(e) => setLiveUrl(e.target.value)}
          disabled={!canEdit || isPending}
          placeholder="https://…"
          className="h-9 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary/50"
        />
      </label>
      <label className="block space-y-1">
        <span className="text-[11px] font-medium text-muted-foreground">
          Screenshots (URLs, comma-separated)
        </span>
        <input
          value={screenshots}
          onChange={(e) => setScreenshots(e.target.value)}
          disabled={!canEdit || isPending}
          placeholder="https://…"
          className="h-9 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary/50"
        />
      </label>
      <label className="block space-y-1">
        <span className="text-[11px] font-medium text-muted-foreground">Notes</span>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          disabled={!canEdit || isPending}
          rows={2}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50"
        />
      </label>
      <label className="block space-y-1">
        <span className="text-[11px] font-medium text-muted-foreground">
          Reflection
        </span>
        <textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          disabled={!canEdit || isPending}
          rows={2}
          placeholder="What was hard? What would you improve?"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50"
        />
      </label>

      {canEdit ? (
        <div className="flex flex-wrap gap-2 pt-1">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={saveDraft}
            disabled={isPending}
          >
            Save draft
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={submit}
            disabled={isPending}
          >
            {isPending ? "Submitting…" : "Submit for review"}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
