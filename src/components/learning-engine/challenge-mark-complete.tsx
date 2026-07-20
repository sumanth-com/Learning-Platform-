"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Circle } from "lucide-react";
import { getLearningWeek } from "@/learning-engine/loader";
import { lessonEntityId } from "@/learning-engine/types";
import { useEntityProgress } from "@/hooks/use-curriculum";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function MarkCompleteButton({ entityId }: { entityId: string }) {
  const { isDone, toggle } = useEntityProgress(entityId);

  return (
    <Button
      variant={isDone ? "secondary" : "default"}
      size="sm"
      className={cn(
        "ml-auto h-8 shrink-0 gap-1.5 text-xs",
        !isDone && "bg-emerald-600 hover:bg-emerald-500"
      )}
      onClick={() => toggle(entityId)}
    >
      {isDone ? (
        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
      ) : (
        <Circle className="h-3.5 w-3.5" />
      )}
      {isDone ? "Solved" : "Mark as complete"}
    </Button>
  );
}

export function ChallengeMarkCompleteButton({ weekId }: { weekId: number }) {
  const searchParams = useSearchParams();
  const topicSlug = searchParams.get("topic");
  const lessonId = searchParams.get("lesson");

  const entityId = useMemo(() => {
    if (!topicSlug || !lessonId) return null;
    const week = getLearningWeek(weekId);
    if (!week) return null;
    const topic = week.topics.find((t) => t.topic.slug === topicSlug);
    const lesson = topic?.lessons.find((l) => l.id === lessonId);
    if (!lesson) return null;
    return lessonEntityId({ weekId, topicSlug, id: lesson.id });
  }, [weekId, topicSlug, lessonId]);

  if (!entityId) return null;

  return <MarkCompleteButton entityId={entityId} />;
}
