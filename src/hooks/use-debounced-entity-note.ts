"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useProgressStore } from "@/store/use-progress-store";
import { useStoreHydrated } from "@/hooks/use-store-hydrated";

const SAVE_DELAY_MS = 350;

/** Local draft + debounced persist to progress store (IndexedDB). */
export function useDebouncedEntityNote(entityId: string) {
  const hydrated = useStoreHydrated();
  const storedNote = useProgressStore((s) => s.progress.notes[entityId] ?? "");
  const setNote = useProgressStore((s) => s.setNote);
  const [draft, setDraft] = useState("");
  const [savedFlash, setSavedFlash] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const draftRef = useRef("");
  const entityRef = useRef(entityId);

  useEffect(() => {
    entityRef.current = entityId;
    if (hydrated) {
      setDraft(storedNote);
      draftRef.current = storedNote;
    }
  }, [entityId, storedNote, hydrated]);

  const flush = useCallback(
    (id: string, value: string) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      setNote(id, value);
    },
    [setNote]
  );

  const onChange = useCallback(
    (value: string) => {
      setDraft(value);
      draftRef.current = value;
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setNote(entityRef.current, value);
        setSavedFlash(true);
        setTimeout(() => setSavedFlash(false), 1500);
      }, SAVE_DELAY_MS);
    },
    [setNote]
  );

  useEffect(() => {
    const id = entityId;
    return () => {
      flush(id, draftRef.current);
    };
  }, [entityId, flush]);

  return {
    value: hydrated ? draft : "",
    onChange,
    hydrated,
    savedFlash,
  };
}
