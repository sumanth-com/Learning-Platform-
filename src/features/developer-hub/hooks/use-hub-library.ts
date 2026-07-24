"use client";

import { useCallback, useEffect, useState } from "react";
import type { HubLibraryState } from "../types";

const KEY = "SupraBase.developer-hub.library";

const EMPTY: HubLibraryState = {
  bookmarks: [],
  recent: [],
  liked: [],
};

function read(): HubLibraryState {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    return { ...EMPTY, ...JSON.parse(raw) } as HubLibraryState;
  } catch {
    return EMPTY;
  }
}

function write(next: HubLibraryState) {
  localStorage.setItem(KEY, JSON.stringify(next));
}

export function useHubLibrary() {
  const [state, setState] = useState<HubLibraryState>(EMPTY);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(read());
    setHydrated(true);
  }, []);

  const persist = useCallback((updater: (prev: HubLibraryState) => HubLibraryState) => {
    setState((prev) => {
      const next = updater(prev);
      write(next);
      return next;
    });
  }, []);

  const toggleBookmark = useCallback(
    (slug: string) => {
      persist((prev) => {
        const has = prev.bookmarks.includes(slug);
        return {
          ...prev,
          bookmarks: has
            ? prev.bookmarks.filter((s) => s !== slug)
            : [slug, ...prev.bookmarks],
        };
      });
    },
    [persist]
  );

  const toggleLike = useCallback(
    (slug: string) => {
      persist((prev) => {
        const has = prev.liked.includes(slug);
        return {
          ...prev,
          liked: has
            ? prev.liked.filter((s) => s !== slug)
            : [slug, ...prev.liked],
        };
      });
    },
    [persist]
  );

  const trackView = useCallback(
    (slug: string, progress = 0) => {
      persist((prev) => {
        const rest = prev.recent.filter((r) => r.slug !== slug);
        return {
          ...prev,
          recent: [{ slug, at: Date.now(), progress }, ...rest].slice(0, 24),
        };
      });
    },
    [persist]
  );

  const setProgress = useCallback(
    (slug: string, progress: number) => {
      persist((prev) => {
        const existing = prev.recent.find((r) => r.slug === slug);
        const rest = prev.recent.filter((r) => r.slug !== slug);
        return {
          ...prev,
          recent: [
            {
              slug,
              at: Date.now(),
              progress: Math.max(existing?.progress ?? 0, progress),
            },
            ...rest,
          ].slice(0, 24),
        };
      });
    },
    [persist]
  );

  return {
    hydrated,
    bookmarks: state.bookmarks,
    recent: state.recent,
    liked: state.liked,
    isBookmarked: (slug: string) => state.bookmarks.includes(slug),
    isLiked: (slug: string) => state.liked.includes(slug),
    toggleBookmark,
    toggleLike,
    trackView,
    setProgress,
  };
}

export function hubAskAiHref(title: string, description: string) {
  const prompt = `I'm studying this Developer Hub guide:\n\nTitle: ${title}\n\n${description}\n\nExplain the key ideas clearly, give practical examples, and quiz me at the end.`;
  return `/ai-mentor?q=${encodeURIComponent(prompt)}`;
}
