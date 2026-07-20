"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { StickyNote, Trash2 } from "lucide-react";
import { useProgressStore } from "@/store/use-progress-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/shared/empty-state";
import { cn } from "@/lib/utils";
import type { AppNote } from "@/types";

function notePreview(content: string, max = 40): string {
  const text = content.trim();
  if (!text) return "No content yet";
  return text.split("\n")[0].slice(0, max);
}

function formatNoteDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function NotesWorkspace() {
  const notes = useProgressStore((s) => s.notes);
  const addNote = useProgressStore((s) => s.addNote);
  const updateNote = useProgressStore((s) => s.updateNote);
  const deleteNote = useProgressStore((s) => s.deleteNote);

  const sortedNotes = useMemo(
    () => [...notes].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
    [notes]
  );

  const [selectedId, setSelectedId] = useState<string | null>(sortedNotes[0]?.id ?? null);
  const prevNoteCount = useRef(notes.length);

  useEffect(() => {
    if (notes.length > prevNoteCount.current) {
      setSelectedId(sortedNotes[0]?.id ?? null);
    }
    prevNoteCount.current = notes.length;
  }, [notes.length, sortedNotes]);

  const selected = sortedNotes.find((n) => n.id === selectedId);

  useEffect(() => {
    if (selectedId && !sortedNotes.some((n) => n.id === selectedId)) {
      setSelectedId(sortedNotes[0]?.id ?? null);
    }
  }, [selectedId, sortedNotes]);

  const handleCreate = useCallback(() => {
    const note: AppNote = {
      id: `note-${Date.now()}`,
      title: "Untitled Note",
      content: "",
      updatedAt: new Date().toISOString(),
    };
    addNote(note);
    setSelectedId(note.id);
  }, [addNote]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "n") {
        e.preventDefault();
        handleCreate();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleCreate]);

  const handleDelete = () => {
    if (!selected) return;
    if (notes.length > 1 && !window.confirm("Delete this note?")) return;
    const remaining = sortedNotes.filter((n) => n.id !== selected.id);
    deleteNote(selected.id);
    setSelectedId(remaining[0]?.id ?? null);
  };

  if (notes.length === 0) {
    return (
      <EmptyState
        icon={StickyNote}
        title="No notes yet"
        description="Create a note — it saves automatically and stays here whenever you come back."
        action={{ label: "New Note", onClick: handleCreate }}
      />
    );
  }

  return (
    <div className="flex h-full min-h-0 gap-3 overflow-hidden">
      <aside className="flex h-full w-[210px] shrink-0 flex-col overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-900/30">
        <div className="shrink-0 px-3 py-3">
          <p className="text-xs font-medium text-zinc-500">{sortedNotes.length} notes</p>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 pb-2">
          {sortedNotes.map((note) => {
            const active = selectedId === note.id;
            return (
              <button
                key={note.id}
                type="button"
                onClick={() => setSelectedId(note.id)}
                className={cn(
                  "mb-1 w-full rounded-lg p-2.5 text-left transition-colors last:mb-0",
                  active ? "bg-indigo-500/10 text-indigo-100" : "text-zinc-300 hover:bg-zinc-800/50"
                )}
              >
                <p className="truncate text-sm font-medium">{note.title}</p>
                <p className="mt-1 truncate text-[11px] text-zinc-500">{notePreview(note.content)}</p>
                <p className="mt-1 text-[10px] text-zinc-600">{formatNoteDate(note.updatedAt)}</p>
              </button>
            );
          })}
        </div>
      </aside>

      {selected ? (
        <section className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-900/30">
          <div className="flex shrink-0 items-center gap-3 px-5 py-4">
            <Input
              value={selected.title}
              onChange={(e) => updateNote(selected.id, { title: e.target.value })}
              className="min-w-0 flex-1 border-none bg-transparent px-0 text-lg font-semibold focus-visible:ring-0"
              placeholder="Title"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              className="h-8 w-8 shrink-0 text-zinc-500 hover:text-red-400"
              aria-label="Delete note"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <Textarea
            value={selected.content}
            onChange={(e) => updateNote(selected.id, { content: e.target.value })}
            className="min-h-0 flex-1 resize-none rounded-none border-0 bg-transparent px-5 pb-5 pt-1 text-sm leading-relaxed text-zinc-200 shadow-none focus-visible:ring-0"
            placeholder="Start writing..."
          />
        </section>
      ) : (
        <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-zinc-800/80 bg-zinc-900/20">
          <p className="text-sm text-zinc-500">Select a note</p>
        </div>
      )}
    </div>
  );
}
