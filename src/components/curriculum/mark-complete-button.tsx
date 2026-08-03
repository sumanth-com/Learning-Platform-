"use client";

import { useTransition } from "react";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { toggleLessonCompleteAction } from "@/features/curriculum/actions/progress-actions";

interface MarkCompleteButtonProps {
  lessonId: string;
  isCompleted: boolean;
}

export function MarkCompleteButton({
  lessonId,
  isCompleted,
}: MarkCompleteButtonProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant={isCompleted ? "secondary" : "default"}
      size="lg"
      className="gap-2"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          const result = await toggleLessonCompleteAction(
            lessonId,
            isCompleted
          );
          if (!result.success) {
            toast.error(result.error);
            return;
          }
          if (result.completed) {
            void import("@/lib/analytics").then(({ trackEvent, ANALYTICS_EVENTS }) => {
              trackEvent(ANALYTICS_EVENTS.lesson_completed, {
                lesson_id: lessonId,
              });
            });
          }
          toast.success(
            result.completed
              ? "Lesson marked complete."
              : "Lesson marked incomplete."
          );
        });
      }}
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isCompleted ? (
        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
      ) : (
        <Circle className="h-4 w-4" />
      )}
      {isCompleted ? "Completed" : "Mark complete"}
    </Button>
  );
}
