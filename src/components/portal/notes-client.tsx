"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotesWorkspace } from "@/components/notes/notes-workspace";
import { useProgressStore } from "@/store/use-progress-store";
import type { AppNote } from "@/types";

export function NotesClient() {
  const addNote = useProgressStore((s) => s.addNote);

  const handleCreate = () => {
    const note: AppNote = {
      id: `note-${Date.now()}`,
      title: "Untitled Note",
      content: "",
      updatedAt: new Date().toISOString(),
    };
    addNote(note);
  };

  return (
    <div className="-mx-4 -my-2 flex h-[calc(100dvh-8rem)] flex-col overflow-hidden sm:-mx-6 lg:-mx-8">
      <div className="flex shrink-0 items-center justify-between gap-4 px-4 pb-4 sm:px-6 lg:px-8">
        <div>
          <h1 className="font-display text-2xl text-zinc-50">Notes</h1>
          <p className="text-sm text-zinc-500">Saved automatically</p>
        </div>
        <Button
          variant="default"
          size="sm"
          onClick={handleCreate}
          className="h-9 gap-1.5 px-4"
        >
          <Plus className="h-4 w-4" /> New Note
        </Button>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden px-4 pb-3 sm:px-6 lg:px-8">
        <NotesWorkspace />
      </div>
    </div>
  );
}
