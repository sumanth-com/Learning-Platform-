"use client";

import { useProgressStore } from "@/store/use-progress-store";
import { useStoreHydrated } from "@/hooks/use-store-hydrated";
import { cn } from "@/lib/utils";

/** Classic cut diamond (gem silhouette). */
export function DiamondGem({
  className,
  filled,
}: {
  className?: string;
  filled?: boolean;
}) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path
        d="M7.2 4.2h9.6L21 9.2H3l4.2-5Z"
        fill="currentColor"
        fillOpacity={filled ? 0.4 : 0.08}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M3 9.2h18L12 21.2 3 9.2Z"
        fill="currentColor"
        fillOpacity={filled ? 1 : 0.12}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M7.2 4.2 12 9.2 16.8 4.2M3 9.2h18M8.2 9.2 12 21.2 15.8 9.2"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={filled ? 0.95 : 0.7}
      />
    </svg>
  );
}

type SaveDiamondButtonProps = {
  entityId: string;
  className?: string;
  /** When true, show a compact Unsave control next to the diamond. */
  showUnsaveAction?: boolean;
};

/**
 * Card save toggle. Bookmark state is ignored until the progress store
 * hydrates so SSR + client markup stay in sync.
 */
export function SaveDiamondButton({
  entityId,
  className,
  showUnsaveAction = false,
}: SaveDiamondButtonProps) {
  const hydrated = useStoreHydrated();
  const saved = useProgressStore(
    (s) => hydrated && Boolean(s.progress.bookmarks[entityId])
  );
  const toggleBookmark = useProgressStore((s) => s.toggleBookmark);

  return (
    <div className={cn("inline-flex shrink-0 items-center gap-1.5", className)}>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleBookmark(entityId);
        }}
        className={cn(
          "inline-flex h-7 w-7 items-center justify-center rounded-full transition-all duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C3A21]/40",
          saved
            ? "bg-[#5C3A21] text-[#f5efe8] shadow-md shadow-[#5C3A21]/30"
            : "bg-zinc-900/60 text-zinc-500 ring-1 ring-zinc-700/80 hover:text-[#5C3A21] hover:ring-[#5C3A21]/45"
        )}
        aria-pressed={saved}
        aria-label={saved ? "Unsave challenge" : "Save challenge"}
        title={saved ? "Click to unsave" : "Save for later"}
      >
        <DiamondGem filled={saved} className="h-3.5 w-3.5" />
      </button>
      {showUnsaveAction && saved ? (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleBookmark(entityId);
          }}
          className="text-[11px] font-semibold text-[#5C3A21] underline-offset-2 hover:underline"
        >
          Unsave
        </button>
      ) : null}
    </div>
  );
}

type TrackSavedDiamondProps = {
  active: boolean;
  count?: number;
  onClick: () => void;
  className?: string;
};

/** Track-bar diamond — toggles the saved challenges filter (no popup). */
export function TrackSavedDiamond({
  active,
  count = 0,
  onClick,
  className,
}: TrackSavedDiamondProps) {
  const hydrated = useStoreHydrated();
  const safeCount = hydrated ? count : 0;
  const filled = active || safeCount > 0;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C3A21]/40",
        active
          ? "bg-[#5C3A21] text-[#f5efe8] shadow-md shadow-[#5C3A21]/35"
          : "bg-zinc-900 text-zinc-400 ring-1 ring-zinc-600 hover:text-[#5C3A21] hover:ring-[#5C3A21]/50",
        className
      )}
      aria-pressed={active}
      aria-label={
        active
          ? "Showing saved challenges — click to show all"
          : `Show saved challenges${safeCount ? ` (${safeCount})` : ""}`
      }
      title={
        active
          ? "Showing saved — click to clear"
          : safeCount > 0
            ? `Saved (${safeCount})`
            : "View saved challenges"
      }
    >
      <DiamondGem filled={filled} className="h-4 w-4" />
    </button>
  );
}
