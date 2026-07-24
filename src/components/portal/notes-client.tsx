"use client";

import { NotesWorkspace } from "@/components/notes/notes-workspace";

export function NotesClient() {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-background">
      <NotesWorkspace />
    </div>
  );
}
