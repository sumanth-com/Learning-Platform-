import type { LessonSummary } from "@/features/curriculum/types";
import { isProgrammingFundamentalsModule } from "@/features/curriculum/lib/programming-fundamentals";

export type TopicCardStatus = "completed" | "current" | "locked";

export type TopicCardModel = LessonSummary & {
  index: number;
  status: TopicCardStatus;
};

/**
 * Sequential unlock within a module:
 * completed → first incomplete is current → everything after is locked
 * (preview lessons stay reachable even when after the frontier).
 * Module 1 (programming-fundamentals) unlocks all topics at once.
 */
export function buildTopicCards(
  lessons: LessonSummary[],
  moduleSlug?: string
): TopicCardModel[] {
  if (moduleSlug && isProgrammingFundamentalsModule(moduleSlug)) {
    return lessons.map((lesson, index) => ({
      ...lesson,
      index,
      status: lesson.isCompleted
        ? ("completed" as const)
        : ("current" as const),
    }));
  }

  const frontier = lessons.findIndex((l) => !l.isCompleted);

  return lessons.map((lesson, index) => {
    if (lesson.isCompleted) {
      return { ...lesson, index, status: "completed" as const };
    }

    if (frontier === -1) {
      return { ...lesson, index, status: "completed" as const };
    }

    if (index === frontier) {
      return { ...lesson, index, status: "current" as const };
    }

    if (index < frontier) {
      return { ...lesson, index, status: "current" as const };
    }

    if (lesson.isPreview) {
      return { ...lesson, index, status: "current" as const };
    }

    return { ...lesson, index, status: "locked" as const };
  });
}

export function findResumeTopicCard(
  cards: TopicCardModel[]
): TopicCardModel | null {
  return (
    cards.find((c) => c.status === "current" && !c.isCompleted) ??
    cards.find((c) => c.status === "current") ??
    cards.find((c) => c.status === "completed") ??
    cards[0] ??
    null
  );
}
