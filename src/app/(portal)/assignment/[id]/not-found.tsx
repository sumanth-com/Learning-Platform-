import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CURRICULUM_ROUTES } from "@/features/curriculum/types";

export default function AssignmentNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <h1 className="text-2xl font-semibold text-zinc-50">
        Assignment not found
      </h1>
      <p className="mt-2 text-sm text-zinc-500">
        It may be unpublished, or the seed migration has not been applied.
      </p>
      <Link href={CURRICULUM_ROUTES.roadmap} className="mt-6">
        <Button variant="secondary">Back to roadmap</Button>
      </Link>
    </div>
  );
}
