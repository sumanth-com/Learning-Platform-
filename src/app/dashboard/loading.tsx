import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 px-6 py-16">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-10 w-80" />
      <Skeleton className="h-4 w-96" />
      <div className="grid gap-4 sm:grid-cols-2">
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-32 rounded-2xl" />
      </div>
    </div>
  );
}
