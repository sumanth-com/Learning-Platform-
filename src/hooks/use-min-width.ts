"use client";

import { useEffect, useState } from "react";

/**
 * Returns whether `(min-width: px)` matches.
 * `null` until mounted so SSR/hydration can use CSS dual-render safely.
 */
export function useMinWidth(px: number): boolean | null {
  const [matches, setMatches] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${px}px)`);
    const apply = () => setMatches(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [px]);

  return matches;
}
