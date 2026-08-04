export default function PortalLoading() {
  return (
    <div className="flex h-full min-h-0 flex-1 flex-col gap-3 p-4 sm:p-6">
      <div className="h-10 w-48 max-w-full animate-pulse rounded-lg bg-muted/70" />
      <div className="grid flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-2xl border border-border/50 bg-muted/40"
          />
        ))}
      </div>
    </div>
  );
}
