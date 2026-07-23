"use client";

import {
  BookOpen,
  ChevronRight,
  PanelRightClose,
  PanelRightOpen,
  Sparkles,
} from "lucide-react";
import type { LearningContext } from "@/features/ai-mentor/types";
import { formatLearningContextSummary } from "@/features/ai-mentor/lib/learning-context";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type MentorContextPanelProps = {
  open: boolean;
  onToggle: () => void;
  context: LearningContext | null;
};

const SUGGESTIONS = [
  "Explain this topic like I’m new",
  "Quiz me on what I’m learning",
  "Review my approach before I submit",
  "Suggest a mini project for this module",
  "Create flashcards from this lesson",
];

export function MentorContextPanel({
  open,
  onToggle,
  context,
}: MentorContextPanelProps) {
  const summary = formatLearningContextSummary(context);

  if (!open) {
    return (
      <div className="flex h-full w-12 shrink-0 flex-col items-center border-l border-border bg-card/30 py-3">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="h-9 w-9"
          onClick={onToggle}
          title="Open context panel"
        >
          <PanelRightOpen className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <aside className="flex h-full w-full min-w-0 flex-col border-l border-border bg-card/40">
      <div className="flex h-14 items-center justify-between border-b border-border px-3">
        <p className="text-sm font-semibold text-foreground">Context</p>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="h-8 w-8"
          onClick={onToggle}
          title="Collapse"
        >
          <PanelRightClose className="h-4 w-4" />
        </Button>
      </div>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-3">
        <section className="rounded-xl border border-border bg-background p-3">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <BookOpen className="h-3.5 w-3.5" />
            Learning context
          </div>
          {summary ? (
            <div className="space-y-1.5 text-sm text-foreground">
              {context?.moduleTitle ? (
                <p>
                  <span className="text-muted-foreground">Module · </span>
                  {context.moduleTitle}
                </p>
              ) : null}
              {context?.topicTitle ? (
                <p>
                  <span className="text-muted-foreground">Topic · </span>
                  {context.topicTitle}
                </p>
              ) : null}
              {context?.lessonTitle ? (
                <p>
                  <span className="text-muted-foreground">Lesson · </span>
                  {context.lessonTitle}
                </p>
              ) : null}
              {context?.assignmentTitle ? (
                <p>
                  <span className="text-muted-foreground">Assignment · </span>
                  {context.assignmentTitle}
                </p>
              ) : null}
              {context?.projectTitle ? (
                <p>
                  <span className="text-muted-foreground">Project · </span>
                  {context.projectTitle}
                </p>
              ) : null}
              {context?.progressSummary ? (
                <p className="pt-1 text-xs text-muted-foreground">
                  {context.progressSummary}
                </p>
              ) : null}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No active module context. The mentor still answers any engineering
              question.
            </p>
          )}
        </section>

        <section className="rounded-xl border border-border bg-background p-3">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" />
            Try asking
          </div>
          <ul className="space-y-1.5">
            {SUGGESTIONS.map((item) => (
              <li
                key={item}
                className={cn(
                  "flex items-start gap-1.5 rounded-lg px-2 py-1.5 text-sm text-foreground"
                )}
              >
                <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-dashed border-border bg-background/60 p-3 text-xs text-muted-foreground">
          Attachments, GitHub review, and resume tools are coming next. Paste
          code, errors, or file contents into chat anytime.
        </section>
      </div>
    </aside>
  );
}
