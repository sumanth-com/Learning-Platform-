import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  ClipboardList,
  ExternalLink,
  Trophy,
} from "lucide-react";
import { DifficultyBadge } from "@/components/curriculum/difficulty-badge";
import { SubmissionForm } from "@/components/assignments/submission-form";
import { SubmissionStatusBadge } from "@/components/assignments/submission-status-badge";
import { MentorReviewPanel } from "@/components/assignments/mentor-review-panel";
import { CURRICULUM_ROUTES } from "@/features/curriculum/types";
import type { AssignmentDetail } from "@/features/assignments/types";

interface AssignmentViewProps {
  detail: AssignmentDetail;
  isMentor: boolean;
}

export function AssignmentView({ detail, isMentor }: AssignmentViewProps) {
  const { assignment, resources, lesson, deadline, submission, submissions } =
    detail;

  return (
    <article className="mx-auto max-w-3xl space-y-10">
      <Link
        href={CURRICULUM_ROUTES.lesson(lesson.slug)}
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition hover:text-zinc-300"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to {lesson.title}
      </Link>

      <header className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-indigo-300/80">
          <ClipboardList className="h-3.5 w-3.5" />
          Assignment
        </div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
          {assignment.title}
        </h1>
        <p className="text-base text-zinc-400">{assignment.description}</p>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <DifficultyBadge difficulty={assignment.difficulty} />
          <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500">
            <Trophy className="h-3.5 w-3.5" />
            {assignment.total_marks} marks
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500">
            <Calendar className="h-3.5 w-3.5" />
            Due {deadline.toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}{" "}
            ({assignment.due_days} days)
          </span>
          <span className="text-xs text-zinc-500">
            {assignment.estimated_time}
          </span>
          {submission ? (
            <SubmissionStatusBadge status={submission.status} />
          ) : null}
        </div>
      </header>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-zinc-50">Instructions</h2>
        <div className="space-y-3 text-sm leading-relaxed text-zinc-400">
          {renderMarkdownLite(assignment.instructions)}
        </div>
      </section>

      {resources.length > 0 ? (
        <section className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6">
          <h2 className="text-sm font-semibold text-zinc-100">Resources</h2>
          <ul className="mt-4 space-y-3">
            {resources.map((resource) => (
              <li key={resource.id}>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-indigo-300 hover:text-indigo-200"
                >
                  {resource.title}
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span className="text-xs capitalize text-zinc-600">
                    {resource.type}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {submission &&
      (submission.marks != null || submission.feedback) ? (
        <section className="rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-6">
          <h2 className="text-sm font-semibold text-emerald-200">
            Marks &amp; feedback
          </h2>
          {submission.marks != null ? (
            <p className="mt-2 text-2xl font-semibold text-zinc-50">
              {submission.marks}
              <span className="text-base font-normal text-zinc-500">
                /{assignment.total_marks}
              </span>
            </p>
          ) : null}
          {submission.feedback ? (
            <p className="mt-3 text-sm leading-relaxed text-zinc-300">
              {submission.feedback}
            </p>
          ) : null}
        </section>
      ) : null}

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-zinc-50">Your submission</h2>
        <SubmissionForm
          assignmentId={assignment.id}
          submission={submission}
        />
      </section>

      {isMentor ? (
        <MentorReviewPanel
          assignmentId={assignment.id}
          totalMarks={assignment.total_marks}
          submissions={submissions}
        />
      ) : null}
    </article>
  );
}

function renderMarkdownLite(content: string) {
  return content.split(/\n\n+/).map((block, index) => {
    const trimmed = block.trim();
    if (!trimmed) return null;
    if (trimmed.startsWith("## ")) {
      return (
        <h3 key={index} className="text-base font-semibold text-zinc-100">
          {trimmed.replace(/^##\s+/, "")}
        </h3>
      );
    }
    if (trimmed.startsWith("### ")) {
      return (
        <h4 key={index} className="text-sm font-semibold text-zinc-200">
          {trimmed.replace(/^###\s+/, "")}
        </h4>
      );
    }
    if (trimmed.startsWith("- ") || /^\d+\.\s/.test(trimmed)) {
      const items = trimmed.split("\n");
      return (
        <ul key={index} className="list-disc space-y-1 pl-5">
          {items.map((item) => (
            <li key={item}>{item.replace(/^(-|\d+\.)\s+/, "")}</li>
          ))}
        </ul>
      );
    }
    return <p key={index}>{trimmed}</p>;
  });
}
