"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  Check,
  Copy,
  Highlighter,
  List,
  Loader2,
  Pin,
  PinOff,
  Plus,
  Search,
  StickyNote,
  Trash2,
  Type,
} from "lucide-react";
import { useProgressStore } from "@/store/use-progress-store";
import { useStoreHydrated } from "@/hooks/use-store-hydrated";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AppNote, NoteAccent } from "@/types";

const SAVE_DELAY_MS = 400;

const ACCENTS: {
  id: NoteAccent;
  label: string;
  dot: string;
  soft: string;
  ring: string;
}[] = [
  {
    id: "indigo",
    label: "Indigo",
    dot: "bg-indigo-500",
    soft: "bg-indigo-500/12",
    ring: "ring-indigo-500/40",
  },
  {
    id: "emerald",
    label: "Emerald",
    dot: "bg-emerald-500",
    soft: "bg-emerald-500/12",
    ring: "ring-emerald-500/40",
  },
  {
    id: "amber",
    label: "Amber",
    dot: "bg-amber-500",
    soft: "bg-amber-500/12",
    ring: "ring-amber-500/40",
  },
  {
    id: "rose",
    label: "Rose",
    dot: "bg-rose-500",
    soft: "bg-rose-500/12",
    ring: "ring-rose-500/40",
  },
  {
    id: "sky",
    label: "Sky",
    dot: "bg-sky-500",
    soft: "bg-sky-500/12",
    ring: "ring-sky-500/40",
  },
];

function accentMeta(accent?: NoteAccent) {
  return ACCENTS.find((a) => a.id === accent) ?? ACCENTS[0];
}

function notePreview(content: string, max = 48): string {
  const text = content.trim().replace(/\s+/g, " ");
  if (!text) return "Empty note";
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function wordCount(text: string) {
  const words = text.trim().match(/\S+/g);
  return words?.length ?? 0;
}

function createBlankNote(): AppNote {
  return {
    id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title: "Untitled Note",
    content: "",
    updatedAt: new Date().toISOString(),
    pinned: false,
    accent: "indigo",
  };
}

type SaveStatus = "idle" | "saving" | "saved" | "unsaved";

export function NotesWorkspace() {
  const hydrated = useStoreHydrated();
  const notes = useProgressStore((s) => s.notes);
  const addNote = useProgressStore((s) => s.addNote);
  const updateNote = useProgressStore((s) => s.updateNote);
  const deleteNote = useProgressStore((s) => s.deleteNote);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [draftTitle, setDraftTitle] = useState("");
  const [draftContent, setDraftContent] = useState("");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [copied, setCopied] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const draftRef = useRef({ id: "", title: "", content: "" });
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initialized = useRef(false);

  const sortedNotes = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? notes.filter(
          (n) =>
            n.title.toLowerCase().includes(q) ||
            n.content.toLowerCase().includes(q)
        )
      : notes;
    return [...filtered].sort((a, b) => {
      const pin = Number(Boolean(b.pinned)) - Number(Boolean(a.pinned));
      if (pin !== 0) return pin;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [notes, query]);

  const selected = notes.find((n) => n.id === selectedId) ?? null;

  const flushSave = useCallback(
    (id: string, title: string, content: string) => {
      if (saveTimer.current) {
        clearTimeout(saveTimer.current);
        saveTimer.current = null;
      }
      const current = useProgressStore.getState().notes.find((n) => n.id === id);
      if (!current) return;
      if (current.title === title && current.content === content) {
        setSaveStatus("saved");
        return;
      }
      setSaveStatus("saving");
      updateNote(id, { title: title || "Untitled Note", content });
      setSaveStatus("saved");
    },
    [updateNote]
  );

  const scheduleSave = useCallback(
    (id: string, title: string, content: string) => {
      draftRef.current = { id, title, content };
      setSaveStatus("unsaved");
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        flushSave(id, title, content);
      }, SAVE_DELAY_MS);
    },
    [flushSave]
  );

  // Hydrate selection once store is ready
  useEffect(() => {
    if (!hydrated || initialized.current) return;
    initialized.current = true;
    if (notes.length > 0) {
      const first = [...notes].sort(
        (a, b) =>
          Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)) ||
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )[0];
      setSelectedId(first.id);
    }
  }, [hydrated, notes]);

  // Load draft when switching notes
  useEffect(() => {
    if (!selected) {
      setDraftTitle("");
      setDraftContent("");
      setSaveStatus("idle");
      return;
    }
    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
      saveTimer.current = null;
    }
    setDraftTitle(selected.title);
    setDraftContent(selected.content);
    draftRef.current = {
      id: selected.id,
      title: selected.title,
      content: selected.content,
    };
    setSaveStatus("saved");
  }, [selected?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Keep selection valid
  useEffect(() => {
    if (!selectedId) return;
    if (!notes.some((n) => n.id === selectedId)) {
      setSelectedId(sortedNotes[0]?.id ?? notes[0]?.id ?? null);
    }
  }, [notes, selectedId, sortedNotes]);

  // Flush on unmount
  useEffect(() => {
    return () => {
      const d = draftRef.current;
      if (d.id) flushSave(d.id, d.title, d.content);
    };
  }, [flushSave]);

  const handleCreate = useCallback(() => {
    if (selectedId) {
      const d = draftRef.current;
      if (d.id === selectedId) flushSave(d.id, d.title, d.content);
    }
    const note = createBlankNote();
    addNote(note);
    setSelectedId(note.id);
    setQuery("");
    requestAnimationFrame(() => titleRef.current?.focus());
  }, [addNote, flushSave, selectedId]);

  const selectNote = useCallback(
    (id: string) => {
      if (id === selectedId) return;
      const d = draftRef.current;
      if (d.id) flushSave(d.id, d.title, d.content);
      setSelectedId(id);
    },
    [flushSave, selectedId]
  );

  const handleDelete = useCallback(() => {
    if (!selected) return;
    if (notes.length > 1 && !window.confirm("Delete this note?")) return;
    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
      saveTimer.current = null;
    }
    const remaining = notes.filter((n) => n.id !== selected.id);
    deleteNote(selected.id);
    draftRef.current = { id: "", title: "", content: "" };
    setSelectedId(remaining[0]?.id ?? null);
  }, [deleteNote, notes, selected]);

  const togglePin = useCallback(() => {
    if (!selected) return;
    updateNote(selected.id, { pinned: !selected.pinned });
  }, [selected, updateNote]);

  const setAccent = useCallback(
    (accent: NoteAccent) => {
      if (!selected) return;
      updateNote(selected.id, { accent });
    },
    [selected, updateNote]
  );

  const copyNote = useCallback(async () => {
    const text = `${draftTitle}\n\n${draftContent}`.trim();
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* ignore */
    }
  }, [draftContent, draftTitle]);

  const insertSnippet = useCallback(
    (before: string, after = "") => {
      const el = textareaRef.current;
      if (!el || !selectedId) return;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const selectedText = draftContent.slice(start, end);
      const next =
        draftContent.slice(0, start) +
        before +
        selectedText +
        after +
        draftContent.slice(end);
      setDraftContent(next);
      scheduleSave(selectedId, draftTitle, next);
      requestAnimationFrame(() => {
        el.focus();
        const pos = start + before.length + selectedText.length + after.length;
        el.setSelectionRange(pos, pos);
      });
    },
    [draftContent, draftTitle, scheduleSave, selectedId]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "n") {
        e.preventDefault();
        handleCreate();
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        const d = draftRef.current;
        if (d.id) flushSave(d.id, d.title, d.content);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [flushSave, handleCreate]);

  if (!hydrated) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading notes…
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      {/* Header */}
      <div className="relative shrink-0 overflow-hidden border-b border-border bg-muted/40 px-4 py-4 sm:px-6 lg:px-8">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-6 bottom-0 h-28 w-28 rounded-full bg-emerald-500/10 blur-3xl"
        />
        <div className="relative flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-background shadow-sm">
                <StickyNote className="h-4 w-4 text-indigo-500" />
              </span>
              <div>
                <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                  Notes
                </h1>
                <SaveStatusLine status={saveStatus} hasNotes={notes.length > 0} />
              </div>
            </div>
          </div>
          <Button
            size="sm"
            onClick={handleCreate}
            className="h-9 gap-1.5 bg-indigo-600 px-4 text-white hover:bg-indigo-500"
          >
            <Plus className="h-4 w-4" />
            New note
          </Button>
        </div>
      </div>

      {notes.length === 0 ? (
        <EmptyNotes onCreate={handleCreate} />
      ) : (
        <div className="mx-auto grid min-h-0 w-full max-w-6xl flex-1 grid-cols-1 gap-0 overflow-hidden p-3 sm:p-4 lg:grid-cols-[minmax(240px,280px)_1fr] lg:gap-4 lg:p-5">
          {/* List */}
          <aside className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="shrink-0 border-b border-border p-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search notes…"
                  className="h-9 w-full rounded-xl border border-border bg-muted/60 pl-9 pr-3 text-[13px] text-foreground outline-none placeholder:text-muted-foreground focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <p className="mt-2.5 px-0.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                {sortedNotes.length} of {notes.length}
              </p>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-2">
              {sortedNotes.length === 0 ? (
                <p className="px-3 py-8 text-center text-[13px] text-muted-foreground">
                  No matches for “{query}”
                </p>
              ) : (
                sortedNotes.map((note) => {
                  const active = selectedId === note.id;
                  const meta = accentMeta(note.accent);
                  return (
                    <button
                      key={note.id}
                      type="button"
                      onClick={() => selectNote(note.id)}
                      className={cn(
                        "mb-1.5 flex w-full gap-2.5 rounded-xl border p-3 text-left transition last:mb-0",
                        active
                          ? cn(
                              "border-transparent shadow-sm ring-1",
                              meta.soft,
                              meta.ring
                            )
                          : "border-transparent hover:border-border hover:bg-muted/70"
                      )}
                    >
                      <span
                        className={cn(
                          "mt-1 h-2.5 w-2.5 shrink-0 rounded-full",
                          meta.dot
                        )}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-1.5">
                          <span className="truncate text-[13px] font-semibold text-foreground">
                            {note.id === selectedId
                              ? draftTitle || "Untitled Note"
                              : note.title}
                          </span>
                          {note.pinned ? (
                            <Pin className="h-3 w-3 shrink-0 text-amber-500" />
                          ) : null}
                        </span>
                        <span className="mt-1 line-clamp-2 text-[11px] leading-snug text-muted-foreground">
                          {note.id === selectedId
                            ? notePreview(draftContent)
                            : notePreview(note.content)}
                        </span>
                        <span className="mt-1.5 block text-[10px] text-muted-foreground/80">
                          {formatRelative(note.updatedAt)}
                        </span>
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </aside>

          {/* Editor */}
          {selected ? (
            <section className="mt-3 flex min-h-[52vh] min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm lg:mt-0 lg:min-h-0">
              <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-border bg-muted/30 px-3 py-2.5 sm:px-4">
                <div className="flex items-center gap-1">
                  {ACCENTS.map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      title={a.label}
                      onClick={() => setAccent(a.id)}
                      className={cn(
                        "h-4 w-4 rounded-full transition",
                        a.dot,
                        selected.accent === a.id ||
                          (!selected.accent && a.id === "indigo")
                          ? "ring-2 ring-offset-2 ring-offset-card ring-foreground/30 scale-110"
                          : "opacity-55 hover:opacity-100"
                      )}
                    />
                  ))}
                </div>

                <div className="mx-1 hidden h-4 w-px bg-border sm:block" />

                <ToolbarButton
                  title="Heading"
                  onClick={() => insertSnippet("## ", "")}
                >
                  <Type className="h-3.5 w-3.5" />
                </ToolbarButton>
                <ToolbarButton
                  title="Bullet list"
                  onClick={() => insertSnippet("- ", "")}
                >
                  <List className="h-3.5 w-3.5" />
                </ToolbarButton>
                <ToolbarButton
                  title="Highlight"
                  onClick={() => insertSnippet("**", "**")}
                >
                  <Highlighter className="h-3.5 w-3.5" />
                </ToolbarButton>

                <div className="ml-auto flex items-center gap-1">
                  <ToolbarButton
                    title={selected.pinned ? "Unpin" : "Pin note"}
                    onClick={togglePin}
                  >
                    {selected.pinned ? (
                      <PinOff className="h-3.5 w-3.5" />
                    ) : (
                      <Pin className="h-3.5 w-3.5" />
                    )}
                  </ToolbarButton>
                  <ToolbarButton title="Copy note" onClick={copyNote}>
                    {copied ? (
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </ToolbarButton>
                  <ToolbarButton
                    title="Delete"
                    onClick={handleDelete}
                    danger
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </ToolbarButton>
                </div>
              </div>

              <div className="shrink-0 border-b border-border px-4 py-3 sm:px-5">
                <input
                  ref={titleRef}
                  value={draftTitle}
                  onChange={(e) => {
                    const title = e.target.value;
                    setDraftTitle(title);
                    scheduleSave(selected.id, title, draftContent);
                  }}
                  onBlur={() =>
                    flushSave(selected.id, draftTitle, draftContent)
                  }
                  placeholder="Note title"
                  className="w-full bg-transparent text-lg font-semibold tracking-tight text-foreground outline-none placeholder:text-muted-foreground/60 sm:text-xl"
                />
              </div>

              <textarea
                ref={textareaRef}
                value={draftContent}
                onChange={(e) => {
                  const content = e.target.value;
                  setDraftContent(content);
                  scheduleSave(selected.id, draftTitle, content);
                }}
                onBlur={() => flushSave(selected.id, draftTitle, draftContent)}
                placeholder="Start writing… autosaves as you type."
                className="min-h-0 flex-1 resize-none bg-transparent px-4 py-4 text-[15px] leading-7 text-foreground outline-none placeholder:text-muted-foreground/55 sm:px-5 sm:py-5"
              />

              <div className="flex shrink-0 items-center justify-between gap-3 border-t border-border bg-muted/25 px-4 py-2.5 text-[11px] text-muted-foreground sm:px-5">
                <span>
                  {wordCount(draftContent)} words · {draftContent.length} chars
                </span>
                <span className="hidden sm:inline">
                  Ctrl/⌘ N new · Ctrl/⌘ S save now
                </span>
              </div>
            </section>
          ) : (
            <div className="mt-3 flex min-h-[40vh] items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 text-sm text-muted-foreground lg:mt-0">
              Select a note to edit
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SaveStatusLine({
  status,
  hasNotes,
}: {
  status: SaveStatus;
  hasNotes: boolean;
}) {
  if (!hasNotes) {
    return (
      <p className="text-[12px] text-muted-foreground">
        Capture ideas — they save as you type
      </p>
    );
  }
  if (status === "saving" || status === "unsaved") {
    return (
      <p className="flex items-center gap-1.5 text-[12px] text-amber-500">
        <Loader2 className="h-3 w-3 animate-spin" />
        Saving…
      </p>
    );
  }
  if (status === "saved") {
    return (
      <p className="flex items-center gap-1.5 text-[12px] text-emerald-500">
        <Check className="h-3 w-3" />
        Saved automatically
      </p>
    );
  }
  return (
    <p className="text-[12px] text-muted-foreground">Saved automatically</p>
  );
}

function ToolbarButton({
  children,
  onClick,
  title,
  danger,
}: {
  children: ReactNode;
  onClick: () => void;
  title: string;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={cn(
        "inline-flex h-7 w-7 items-center justify-center rounded-lg border border-transparent text-muted-foreground transition hover:border-border hover:bg-background hover:text-foreground",
        danger && "hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-500"
      )}
    >
      {children}
    </button>
  );
}

function EmptyNotes({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex min-h-0 flex-1 items-center justify-center p-6">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-indigo-500/10 to-transparent"
        />
        <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-muted shadow-sm">
          <StickyNote className="h-6 w-6 text-indigo-500" />
        </div>
        <h2 className="relative mt-5 text-lg font-semibold text-foreground">
          Your notebook is empty
        </h2>
        <p className="relative mt-2 text-[13px] leading-relaxed text-muted-foreground">
          Start a note and keep typing — every change saves automatically so
          nothing gets lost.
        </p>
        <Button
          onClick={onCreate}
          className="relative mt-6 gap-1.5 bg-indigo-600 text-white hover:bg-indigo-500"
        >
          <Plus className="h-4 w-4" />
          Create first note
        </Button>
      </div>
    </div>
  );
}
