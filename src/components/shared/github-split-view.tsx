"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getGitHubFileDetail } from "@/curriculum/github-content";
import { GitHubFileAnswer } from "@/components/shared/github-file-answer";
import { EntityNoteTextarea } from "@/components/shared/entity-note-textarea";
import { MarkCompleteButton, SidebarItemIndicator } from "@/components/shared/learn-mark-controls";
import { useProgressStore } from "@/store/use-progress-store";
import { cn } from "@/lib/utils";

export interface GitHubSplitItem {
  id: string;
  title: string;
  subtitle?: string;
}

interface GitHubSplitViewProps {
  items: GitHubSplitItem[];
  repo: string;
  locked?: boolean;
  isDone: (id: string) => boolean;
  onToggle: (id: string) => void;
}

const navBtn =
  "inline-flex h-9 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-4 text-xs font-medium transition-colors sm:text-sm";

const markBtn = "min-w-[8.5rem] px-4";

export function GitHubSplitView({
  items,
  repo,
  locked = false,
  isDone,
  onToggle,
}: GitHubSplitViewProps) {
  const completed = useProgressStore((s) => s.progress.completed);
  const checkDone = (id: string) => Boolean(completed[id]) || isDone(id);
  const [selectedId, setSelectedId] = useState(items[0]?.id ?? "");
  const [pulseId, setPulseId] = useState<string | null>(null);

  useEffect(() => {
    if (!items.some((t) => t.id === selectedId)) {
      setSelectedId(items[0]?.id ?? "");
    }
  }, [items, selectedId]);

  const selectedIndex = items.findIndex((t) => t.id === selectedId);
  const selected = items[selectedIndex] ?? items[0];
  const completedCount = items.filter((t) => checkDone(t.id)).length;
  const isFirst = selectedIndex <= 0;
  const isLast = selectedIndex >= items.length - 1;

  const detail = useMemo(
    () => (selected ? getGitHubFileDetail(selected.id, selected.title, repo) : null),
    [selected, repo]
  );

  const goPrevious = useCallback(() => {
    if (!isFirst) setSelectedId(items[selectedIndex - 1].id);
  }, [isFirst, items, selectedIndex]);

  const goNext = useCallback(() => {
    if (!isLast) setSelectedId(items[selectedIndex + 1].id);
  }, [isLast, items, selectedIndex]);

  const handleMarkComplete = useCallback(() => {
    if (!selected) return;
    const wasDone = checkDone(selected.id);
    onToggle(selected.id);
    if (!wasDone) setPulseId(selected.id);
    if (!isLast && !wasDone) {
      setSelectedId(items[selectedIndex + 1].id);
    }
  }, [selected, onToggle, isLast, checkDone, items, selectedIndex]);

  if (!selected || !detail || items.length === 0) return null;

  return (
    <div className="flex h-full min-h-0 overflow-hidden bg-zinc-950">
      <div className="grid min-h-0 min-w-0 flex-1 grid-rows-[auto_minmax(0,1fr)_auto_auto] overflow-hidden lg:grid-rows-[auto_minmax(0,1fr)_auto]">
        <div className="shrink-0 border-b border-zinc-800/60 px-5 py-5 sm:px-8 sm:py-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="mb-1.5 text-[11px] font-medium tabular-nums text-zinc-500">
                File {selectedIndex + 1} of {items.length}
              </p>
              <h2 className="truncate font-mono text-xl font-bold tracking-tight text-zinc-50 sm:text-2xl">
                {selected.title}
              </h2>
              {selected.subtitle && (
                <p className="mt-1 text-sm text-zinc-500">{selected.subtitle}</p>
              )}
            </div>
            <span className="shrink-0 rounded-md bg-zinc-900 px-2.5 py-1 text-[11px] font-medium tabular-nums text-zinc-400 ring-1 ring-zinc-800">
              {completedCount}/{items.length} pushed
            </span>
          </div>
        </div>

        <div className="min-h-0 overflow-hidden px-5 sm:px-8">
          <GitHubFileAnswer detail={detail} className="h-full pb-6" />
        </div>

        <div className="shrink-0 border-t border-zinc-800/60 px-5 py-3 sm:px-8">
          <EntityNoteTextarea
            entityId={selected.id}
            disabled={locked}
            placeholder="Notes — saved automatically"
            showHeader={false}
            textareaClassName="min-h-[4rem] rounded-md border border-zinc-800/80 bg-zinc-900/30 px-3 py-2 focus-visible:ring-indigo-500/30"
          />
        </div>

        <div className="flex shrink-0 items-center justify-center gap-3 border-t border-zinc-800/60 px-5 py-3 sm:px-8">
          <button
            type="button"
            disabled={isFirst}
            onClick={goPrevious}
            className={cn(
              navBtn,
              "ring-1",
              isFirst
                ? "cursor-not-allowed text-zinc-600 ring-zinc-800/80"
                : "text-zinc-300 ring-zinc-700 hover:bg-zinc-900 hover:text-zinc-100"
            )}
          >
            <ChevronLeft className="h-4 w-4" />
            Prev
          </button>

          <MarkCompleteButton
            done={checkDone(selected.id)}
            disabled={locked}
            labelPending="Mark pushed"
            labelDone="Pushed"
            onClick={handleMarkComplete}
            pulse={pulseId === selected.id}
            className={cn(
              "h-9 rounded-md px-4 text-xs sm:text-sm",
              checkDone(selected.id)
                ? "bg-emerald-500/10 text-emerald-400 ring-emerald-500/25"
                : "bg-indigo-500/10 text-indigo-300 ring-indigo-500/25 hover:bg-indigo-500/15"
            )}
          />

          <button
            type="button"
            disabled={isLast}
            onClick={goNext}
            className={cn(
              navBtn,
              "ring-1",
              isLast
                ? "cursor-not-allowed text-zinc-600 ring-zinc-800/80"
                : "text-zinc-300 ring-zinc-700 hover:bg-zinc-900 hover:text-zinc-100"
            )}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="flex min-h-0 flex-col overflow-hidden border-t border-zinc-800/60 lg:hidden">
          <div className="shrink-0 px-4 py-2">
            <p className="text-[11px] font-medium text-zinc-500">All files</p>
          </div>
          <FileList
            items={items}
            selectedId={selectedId}
            isDone={checkDone}
            onSelect={setSelectedId}
            compact
          />
        </div>
      </div>

      <aside className="hidden w-[280px] shrink-0 flex-col border-l border-zinc-800/60 xl:w-[300px] lg:flex">
        <div className="flex shrink-0 items-center justify-between border-b border-zinc-800/60 px-4 py-3">
          <p className="text-xs font-medium text-zinc-400">Files</p>
          <p className="text-[11px] tabular-nums text-zinc-600">{items.length} total</p>
        </div>
        <FileList
          items={items}
          selectedId={selectedId}
          isDone={checkDone}
          onSelect={setSelectedId}
        />
      </aside>
    </div>
  );
}

function FileList({
  items,
  selectedId,
  isDone,
  onSelect,
  compact = false,
}: {
  items: GitHubSplitItem[];
  selectedId: string;
  isDone: (id: string) => boolean;
  onSelect: (id: string) => void;
  compact?: boolean;
}) {
  return (
    <div className={cn("min-h-0 flex-1 overflow-y-auto overscroll-contain", compact && "max-h-40")}>
      {items.map((item, index) => {
        const active = item.id === selectedId;
        const done = isDone(item.id);

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            className={cn(
              "flex w-full items-center gap-3 border-b border-zinc-800/40 px-4 text-left transition-colors",
              compact ? "py-2" : "py-3",
              active
                ? "border-l-2 border-l-indigo-500 bg-zinc-900/60 pl-[14px]"
                : "border-l-2 border-l-transparent hover:bg-zinc-900/40"
            )}
          >
            <SidebarItemIndicator displayNum={index + 1} done={done} active={active} />
            <span
              className={cn(
                "min-w-0 truncate font-mono text-xs leading-snug sm:text-[13px]",
                active ? "font-medium text-zinc-100" : done ? "text-zinc-500" : "text-zinc-400"
              )}
            >
              {item.title}
            </span>
          </button>
        );
      })}
    </div>
  );
}
