"use client";

import { useMemo } from "react";
import { InterviewPrepSession } from "@/components/interview-prep/interview-prep-session";
import {
  listSystemsAcademyChallenges,
  type SystemsChallenge,
} from "@/features/curriculum/lib/systems-academy-challenges";

type SystemsPlaygroundSolveProps = {
  moduleSlug: string;
  topicSlug: string;
  topicTitle: string;
  moduleTitle: string;
  challenge: SystemsChallenge;
};

export function SystemsPlaygroundSolve({
  moduleSlug,
  topicSlug,
  topicTitle,
  moduleTitle,
  challenge,
}: SystemsPlaygroundSolveProps) {
  const siblings = useMemo(
    () => listSystemsAcademyChallenges(topicSlug),
    [topicSlug]
  );

  return (
    <InterviewPrepSession
      moduleSlug={moduleSlug}
      topicSlug={topicSlug}
      topicTitle={topicTitle}
      moduleTitle={moduleTitle}
      variant="systems"
      siblings={siblings}
      defaultSummary="Design interviews and storytelling for behavioral rounds."
      challenge={{
        id: challenge.id,
        topicSlug: challenge.topicSlug,
        title: challenge.title,
        difficulty: challenge.difficulty,
        minutes: challenge.minutes,
        scenario: challenge.scenario,
        task: challenge.task,
        hints: challenge.hints,
        takeaways: challenge.takeaways,
        acceptanceCriteria: challenge.acceptanceCriteria,
        modelAnswer: challenge.prep.talkTrack,
        talkingPoints: challenge.task,
        prep: challenge.prep,
        lesson: challenge.lesson,
        weekId: challenge.weekId,
      }}
    />
  );
}
