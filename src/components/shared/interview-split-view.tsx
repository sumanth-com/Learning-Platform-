"use client";

import { useEffect, useMemo, useState } from "react";
import { Bookmark, ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";
import type { CurriculumChecklistItem } from "@/curriculum/types";
import type { CurriculumInterviewQuestion } from "@/curriculum/types";
import { InterviewAnswer } from "@/components/shared/interview-answer";
import { EntityNoteTextarea } from "@/components/shared/entity-note-textarea";
import {
  learnNavBtn,
  MarkCompleteButton,
  SidebarItemIndicator,
} from "@/components/shared/learn-mark-controls";
import { useProgressStore } from "@/store/use-progress-store";
import { cn } from "@/lib/utils";
import { useStoreHydrated } from "@/hooks/use-store-hydrated";

export interface InterviewSection {
  label: string;
  items: CurriculumChecklistItem[];
}

interface FlatItem extends CurriculumChecklistItem {
  sectionLabel: string;
  globalIndex: number;
}

interface InterviewSplitViewProps {
  sections: InterviewSection[];
  locked?: boolean;
  isDone: (id: string) => boolean;
  onToggle: (id: string) => void;
  getQuestion: (id: string) => CurriculumInterviewQuestion | undefined;
  /** @deprecated Notes persist automatically via EntityNoteTextarea */
  getNote?: (id: string) => string;
  /** @deprecated Notes persist automatically via EntityNoteTextarea */
  setNote?: (id: string, note: string) => void;
  isBookmarked?: (id: string) => boolean;
  onToggleBookmark?: (id: string) => void;
}

export function InterviewSplitView({
  sections,
  locked = false,
  isDone,
  onToggle,
  getQuestion,
  isBookmarked,
  onToggleBookmark,
}: InterviewSplitViewProps) {
  const completed = useProgressStore((s) => s.progress.completed);
  const checkDone = (id: string) => Boolean(completed[id]) || isDone(id);

  const flatItems = useMemo(() => {
    const result: FlatItem[] = [];
    let index = 0;
    for (const section of sections) {
      for (const item of section.items) {
        result.push({
          ...item,
          sectionLabel: section.label,
          globalIndex: index,
        });
        index += 1;
      }
    }
    return result;
  }, [sections]);

  const [selectedId, setSelectedId] = useState(flatItems[0]?.id ?? "");
  const [pulseId, setPulseId] = useState<string | null>(null);
  const hydrated = useStoreHydrated();

  useEffect(() => {
    if (!flatItems.some((t) => t.id === selectedId)) {
      setSelectedId(flatItems[0]?.id ?? "");
    }
  }, [flatItems, selectedId]);

  const selectedIndex = flatItems.findIndex((t) => t.id === selectedId);
  const selected = flatItems[selectedIndex] ?? flatItems[0];
  const question = selected ? getQuestion(selected.id) : undefined;
  const completedCount = flatItems.filter((t) => checkDone(t.id)).length;
  const isFirst = selectedIndex <= 0;
  const isLast = selectedIndex >= flatItems.length - 1;
  const selectedDone = selected ? checkDone(selected.id) : false;

  const goPrevious = () => {
    if (!isFirst) setSelectedId(flatItems[selectedIndex - 1].id);
  };

  const goNext = () => {
    if (!isLast) setSelectedId(flatItems[selectedIndex + 1].id);
  };

  const handleMarkComplete = () => {
    if (!selected) return;
    const wasDone = checkDone(selected.id);
    onToggle(selected.id);
    if (!wasDone) setPulseId(selected.id);
    if (!isLast && !wasDone) {
      setSelectedId(flatItems[selectedIndex + 1].id);
    }
  };

  if (!selected || !question || flatItems.length === 0) return null;

  const bookmarked = hydrated && (isBookmarked?.(selected.id) ?? false);

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/30">
      <div className="flex shrink-0 items-center justify-between border-b border-zinc-800 px-3 py-1.5 sm:px-4">
        <div className="flex min-w-0 items-center gap-2">
          <MessageSquare className="h-3.5 w-3.5 shrink-0 text-purple-400" />
          <span className="truncate text-xs font-semibold text-zinc-100 sm:text-sm">
            {selected.sectionLabel} · {selectedIndex + 1}/{flatItems.length}
          </span>
        </div>
        <span className="shrink-0 text-[11px] tabular-nums text-zinc-500">
          {completedCount}/{flatItems.length}
        </span>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[1fr_280px] xl:grid-cols-[1fr_300px]">
        <div className="flex min-h-0 flex-col gap-2 overflow-x-hidden border-b border-zinc-800 p-3 sm:p-4 lg:border-b-0 lg:border-r">
          <div className="flex shrink-0 items-start justify-between gap-2">
            <h2 className="min-w-0 flex-1 text-xl font-extrabold leading-tight tracking-tight text-white sm:text-2xl">
              {selected.title}
            </h2>
            {onToggleBookmark && (
              <button
                type="button"
                onClick={() => onToggleBookmark(selected.id)}
                className="mt-1 shrink-0 rounded-lg p-1.5 ring-1 ring-zinc-800 transition-colors hover:bg-zinc-800/60"
                aria-label={bookmarked ? "Remove bookmark" : "Bookmark question"}
              >
                <Bookmark
                  className={cn(
                    "h-4 w-4",
                    bookmarked ? "fill-amber-400 text-amber-400" : "text-zinc-500"
                  )}
                />
              </button>
            )}
          </div>

          <div className="min-h-0 flex-[3] overflow-hidden">
            <InterviewAnswer question={question} className="h-full" hideTitle />
          </div>

          <EntityNoteTextarea entityId={selected.id} disabled={locked} className="flex-[2]" />

          <div className="flex shrink-0 justify-center gap-2 pt-0.5">
            <button
              type="button"
              disabled={isFirst}
              onClick={goPrevious}
              className={cn(
                learnNavBtn,
                isFirst
                  ? "cursor-not-allowed bg-zinc-900/50 text-zinc-600 ring-zinc-800"
                  : "bg-zinc-800/80 text-zinc-200 ring-zinc-700 hover:bg-zinc-800"
              )}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Prev</span>
            </button>

            <MarkCompleteButton
              done={selectedDone}
              disabled={locked}
              labelPending="Mark mastered"
              labelDone="Mastered"
              onClick={handleMarkComplete}
              pulse={pulseId === selected.id}
            />

            <button
              type="button"
              disabled={isLast}
              onClick={goNext}
              className={cn(
                learnNavBtn,
                isLast
                  ? "cursor-not-allowed bg-zinc-900/50 text-zinc-600 ring-zinc-800"
                  : "bg-zinc-800/80 text-zinc-200 ring-zinc-700 hover:bg-zinc-800"
              )}
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex min-h-0 flex-col overflow-hidden">
          <div className="shrink-0 border-b border-zinc-800 px-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Questions
            </p>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            {sections.map((section) => (
              <div key={section.label}>
                <div className="sticky top-0 z-10 border-b border-zinc-800/80 bg-zinc-950/95 px-3 py-1.5 backdrop-blur-sm">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-purple-400/90">
                    {section.label}
                  </p>
                </div>
                {section.items.map((item) => {
                  const flat = flatItems.find((f) => f.id === item.id)!;
                  const active = item.id === selectedId;
                  const done = checkDone(item.id);
                  const displayNum = flat.globalIndex + 1;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedId(item.id)}
                      className={cn(
                        "flex w-full items-start gap-2 border-b border-zinc-800/60 px-3 py-2.5 text-left transition-colors",
                        active
                          ? "bg-indigo-500/10 ring-1 ring-inset ring-indigo-500/30"
                          : "hover:bg-zinc-800/40"
                      )}
                    >
                      <SidebarItemIndicator displayNum={displayNum} done={done} active={active} />
                      <span
                        className={cn(
                          "text-xs leading-snug sm:text-sm",
                          active ? "font-medium text-zinc-50" : done ? "text-zinc-400" : "text-zinc-300"
                        )}
                      >
                        {item.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
