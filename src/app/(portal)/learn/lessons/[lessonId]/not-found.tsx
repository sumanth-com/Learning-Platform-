import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CURRICULUM_ROUTES } from "@/features/curriculum/types";

export default function LessonNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <h1 className="text-2xl font-semibold text-zinc-50">Lesson not found</h1>
      <p className="mt-2 max-w-md text-sm text-zinc-500">
        This lesson may have been moved or the curriculum seed has not been
        applied yet.
      </p>
      <Link href={CURRICULUM_ROUTES.roadmap} className="mt-6">
        <Button variant="secondary" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to roadmap
        </Button>
      </Link>
    </div>
  );
}
