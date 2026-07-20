"use client";

import { useEffect, useRef } from "react";
import { useProgressStore } from "@/store/use-progress-store";

/** Auto-save and restore vertical scroll for a scrollable element. */
export function usePersistScroll(scrollKey: string, enabled = true) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const setScrollPosition = useProgressStore((s) => s.setScrollPosition);
  const savedY = useProgressStore((s) => s.progress.scrollPositions[scrollKey] ?? 0);
  const restoredRef = useRef(false);

  useEffect(() => {
    if (!enabled || !scrollRef.current || restoredRef.current) return;
    const el = scrollRef.current;
    if (savedY > 0) {
      el.scrollTop = savedY;
    }
    restoredRef.current = true;
  }, [enabled, savedY, scrollKey]);

  useEffect(() => {
    if (!enabled) return;
    const el = scrollRef.current;
    if (!el) return;

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setScrollPosition(scrollKey, el.scrollTop);
      });
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("scroll", onScroll);
    };
  }, [enabled, scrollKey, setScrollPosition]);

  return scrollRef;
}
