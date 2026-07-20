/** SSR-safe placeholder — matches WeekChallengeHub outer layout to avoid hydration mismatch. */
export function WeekChallengeHubSkeleton() {
  return (
    <div
      className="mx-auto max-w-6xl space-y-6 pb-10"
      aria-busy="true"
      aria-label="Loading week challenges"
    >
      <div className="h-4 w-40 animate-pulse rounded bg-zinc-800/80" />
      <div className="h-10 animate-pulse rounded-lg border border-zinc-800 bg-zinc-900/40" />
      <div className="h-24 animate-pulse rounded-xl border border-zinc-800 bg-zinc-900/50" />
      <div className="h-10 animate-pulse rounded bg-zinc-800/60" />
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-xl border border-zinc-800/90 bg-zinc-900/40"
          />
        ))}
      </div>
    </div>
  );
}
