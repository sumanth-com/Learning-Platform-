"use client";

import { useMemo } from "react";
import type { CurriculumAISkill } from "@/curriculum/types";
import { getAiTopicDetail } from "@/curriculum/ai-topics";
import { getAiExerciseDetail } from "@/curriculum/ai-exercises";
import { AiLearnSplitView } from "@/components/shared/ai-learn-split-view";

interface AISkillWeekContentProps {
  skill: CurriculumAISkill;
  locked: boolean;
  isDone: (id: string) => boolean;
  onToggle: (id: string) => void;
}

export function getAiSkillStats(skill: CurriculumAISkill, isDone: (id: string) => boolean) {
  const topicsDone = skill.learningTopics.filter((t) => isDone(t.id)).length;
  const exercisesDone = skill.exercises.filter((e) => isDone(e.id)).length;
  const promptsDone = (skill.promptExercises ?? []).filter((p) => isDone(p.id)).length;
  const totalItems =
    skill.learningTopics.length + skill.exercises.length + (skill.promptExercises?.length ?? 0);
  const doneItems = topicsDone + exercisesDone + promptsDone;

  return {
    topicsDone,
    exercisesDone,
    promptsDone,
    totalItems,
    doneItems,
    topicsTotal: skill.learningTopics.length,
    exercisesTotal: skill.exercises.length,
    overallPct: totalItems ? Math.round((doneItems / totalItems) * 100) : 0,
    topicsPct: skill.learningTopics.length
      ? Math.round((topicsDone / skill.learningTopics.length) * 100)
      : 0,
    practicePct: skill.exercises.length
      ? Math.round((exercisesDone / skill.exercises.length) * 100)
      : 0,
  };
}

export type AiSkillStats = ReturnType<typeof getAiSkillStats>;

export function AISkillWeekContent({ skill, locked, isDone, onToggle }: AISkillWeekContentProps) {
  const sections = useMemo(
    () => [
      { label: "Learning Topics", kind: "topic" as const, items: skill.learningTopics },
      { label: "Practice", kind: "practice" as const, items: skill.exercises },
    ],
    [skill.learningTopics, skill.exercises]
  );

  return (
    <div className="h-full min-h-0">
      <AiLearnSplitView
        sections={sections}
        locked={locked}
        isDone={isDone}
        onToggle={onToggle}
        getDetail={(id, title, kind) =>
          kind === "topic" ? getAiTopicDetail(id, title) : getAiExerciseDetail(id, title)
        }
        sidebarTitle="Topics"
      />
    </div>
  );
}