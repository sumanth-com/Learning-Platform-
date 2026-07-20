"use client";

import { Textarea } from "@/components/ui/textarea";
import { useDebouncedEntityNote } from "@/hooks/use-debounced-entity-note";
import { cn } from "@/lib/utils";

interface EntityNoteTextareaProps {
  entityId: string;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  textareaClassName?: string;
  showHeader?: boolean;
}

export function EntityNoteTextarea({
  entityId,
  disabled = false,
  placeholder = "Write your learnings here — saved automatically...",
  className,
  textareaClassName,
  showHeader = true,
}: EntityNoteTextareaProps) {
  const { value, onChange, hydrated, savedFlash } = useDebouncedEntityNote(entityId);

  return (
    <div
      className={cn(
        "flex min-h-0 flex-col overflow-hidden rounded-lg border border-zinc-800/80 bg-zinc-900/40",
        className
      )}
    >
      {showHeader && (
        <div className="flex shrink-0 items-center justify-between border-b border-zinc-800/60 px-3 py-1.5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Notes</p>
          {savedFlash && (
            <span className="text-[10px] font-medium text-emerald-400/90 animate-in fade-in duration-200">
              Saved
            </span>
          )}
        </div>
      )}
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={hydrated ? placeholder : "Loading notes…"}
        disabled={disabled || !hydrated}
        className={cn(
          "!min-h-0 min-h-0 flex-1 resize-none rounded-none border-0 bg-transparent px-3 py-2 text-sm focus-visible:ring-0",
          textareaClassName
        )}
      />
    </div>
  );
}
