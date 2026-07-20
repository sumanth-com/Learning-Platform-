"use client";

import { useMemo } from "react";
import type { CurriculumInterviewCategory } from "@/curriculum/types";
import { InterviewSplitView } from "@/components/shared/interview-split-view";

interface InterviewWeekContentProps {
  categories: CurriculumInterviewCategory[];
  locked?: boolean;
  isDone: (id: string) => boolean;
  onToggle: (id: string) => void;
  isBookmarked: (id: string) => boolean;
  onToggleBookmark: (id: string) => void;
}

export function InterviewWeekContent({
  categories,
  locked,
  isDone,
  onToggle,
  isBookmarked,
  onToggleBookmark,
}: InterviewWeekContentProps) {
  const sections = useMemo(
    () =>
      categories.map((cat) => ({
        label: cat.category,
        items: cat.questions.map((q) => ({ id: q.id, title: q.question })),
      })),
    [categories]
  );

  const questionById = useMemo(() => {
    const map = new Map<string, (typeof categories)[0]["questions"][0]>();
    categories.forEach((cat) => {
      cat.questions.forEach((q) => map.set(q.id, q));
    });
    return map;
  }, [categories]);

  return (
    <div className="h-full min-h-0">
      <InterviewSplitView
        sections={sections}
        locked={locked}
        isDone={isDone}
        onToggle={onToggle}
        getQuestion={(id) => questionById.get(id)}
        isBookmarked={isBookmarked}
        onToggleBookmark={onToggleBookmark}
      />
    </div>
  );
}

export function countInterviewItems(categories: CurriculumInterviewCategory[]) {
  return categories.reduce((sum, cat) => sum + cat.questions.length, 0);
}

export function countInterviewDone(
  categories: CurriculumInterviewCategory[],
  isDone: (id: string) => boolean
) {
  return categories.reduce(
    (sum, cat) => sum + cat.questions.filter((q) => isDone(q.id)).length,
    0
  );
}
