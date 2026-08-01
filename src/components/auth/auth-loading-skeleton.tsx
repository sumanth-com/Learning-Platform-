import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading placeholder that mirrors AuthShell proportions.
 */
export function AuthLoadingSkeleton() {
  return (
    <div className="relative flex h-svh items-center justify-center overflow-hidden bg-[#0c0d0e] p-4">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 12% 20%, rgba(229,107,104,0.3), transparent 55%), radial-gradient(ellipse 55% 50% at 88% 15%, rgba(233,158,214,0.18), transparent 52%), #0c0d0e",
        }}
      />
      <div className="relative w-full max-w-[400px] space-y-4 rounded-[1.5rem] bg-white p-6 shadow-[0_28px_70px_-30px_rgba(40,30,40,0.4)]">
        <Skeleton className="h-7 w-48 bg-[#ebe7e4]" />
        <Skeleton className="h-4 w-64 bg-[#ebe7e4]" />
        <Skeleton className="h-10 w-full rounded-xl bg-[#ebe7e4]" />
        <Skeleton className="h-10 w-full rounded-xl bg-[#ebe7e4]" />
        <Skeleton className="h-10 w-full rounded-xl bg-[#ebe7e4]" />
      </div>
    </div>
  );
}
