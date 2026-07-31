import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading placeholder that mirrors AuthShell proportions.
 */
export function AuthLoadingSkeleton() {
  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-[#e8f1fb] px-4 py-12">
      <div className="w-full max-w-[420px] space-y-6 rounded-[2rem] border border-white/70 bg-white/75 p-8 shadow-[0_30px_80px_-28px_rgba(40,70,120,0.35)] backdrop-blur-2xl">
        <div className="flex flex-col items-center gap-3">
          <Skeleton className="h-11 w-11 rounded-2xl bg-[#e8ecf3]" />
          <Skeleton className="h-7 w-48 bg-[#e8ecf3]" />
          <Skeleton className="h-4 w-64 bg-[#e8ecf3]" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-11 w-full rounded-xl bg-[#e8ecf3]" />
          <Skeleton className="h-11 w-full rounded-xl bg-[#e8ecf3]" />
          <Skeleton className="h-11 w-full rounded-xl bg-[#e8ecf3]" />
        </div>
      </div>
    </div>
  );
}
