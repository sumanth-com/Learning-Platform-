import { Skeleton } from "@/components/ui/skeleton";

export default function LearnLoading() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 px-6 py-12">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-10 w-96" />
      <Skeleton className="h-4 w-full max-w-xl" />
      <Skeleton className="h-2 w-80" />
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    </div>
  );
}
