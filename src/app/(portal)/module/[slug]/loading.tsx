export default function ModuleLoading() {
  return (
    <div className="flex h-full min-h-0 flex-col gap-3 p-3 sm:p-4">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 animate-pulse rounded-md bg-muted/70" />
        <div className="h-8 w-56 max-w-[50%] animate-pulse rounded-md bg-muted/70" />
      </div>
      <div className="grid min-h-0 flex-1 gap-3 lg:grid-cols-[240px_1fr]">
        <div className="hidden space-y-2 lg:block">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-9 animate-pulse rounded-lg bg-muted/50"
            />
          ))}
        </div>
        <div className="grid content-start gap-2.5 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-xl border border-border/40 bg-muted/40"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
