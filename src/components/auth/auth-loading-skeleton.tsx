import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading placeholder that mirrors AuthShell proportions.
 */
export function AuthLoadingSkeleton() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-xl" />
          <Skeleton className="h-6 w-36" />
        </div>
        <div className="space-y-4 rounded-2xl border border-zinc-800/80 bg-zinc-950/50 p-8">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-11 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
