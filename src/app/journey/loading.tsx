import { Skeleton } from "@/components/ui/skeleton";

export default function JourneyLoading() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 px-6 py-12">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-10 w-96" />
      <Skeleton className="h-64 w-full rounded-2xl" />
    </div>
  );
}
