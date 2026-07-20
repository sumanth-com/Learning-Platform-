import { Badge } from "@/components/ui/badge";
import type { LessonDifficulty } from "@/types/database";

const DIFFICULTY_VARIANT: Record<
  LessonDifficulty,
  "success" | "warning" | "destructive"
> = {
  beginner: "success",
  intermediate: "warning",
  advanced: "destructive",
};

export function DifficultyBadge({
  difficulty,
}: {
  difficulty: LessonDifficulty;
}) {
  return (
    <Badge variant={DIFFICULTY_VARIANT[difficulty]} className="capitalize">
      {difficulty}
    </Badge>
  );
}
