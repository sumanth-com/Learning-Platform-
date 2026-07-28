"use client";

import { useMemo } from "react";
import { InterviewPrepSession } from "@/components/interview-prep/interview-prep-session";
import {
  listInterviewAcademyChallenges,
  type InterviewChallenge,
} from "@/features/curriculum/lib/interview-academy-challenges";

type InterviewPlaygroundSolveProps = {
  moduleSlug: string;
  topicSlug: string;
  topicTitle: string;
  moduleTitle: string;
  challenge: InterviewChallenge;
};

export function InterviewPlaygroundSolve({
  moduleSlug,
  topicSlug,
  topicTitle,
  moduleTitle,
  challenge,
}: InterviewPlaygroundSolveProps) {
  const siblings = useMemo(
    () => listInterviewAcademyChallenges(topicSlug),
    [topicSlug]
  );

  return (
    <InterviewPrepSession
      moduleSlug={moduleSlug}
      topicSlug={topicSlug}
      topicTitle={topicTitle}
      moduleTitle={moduleTitle}
      variant="coding"
      siblings={siblings}
      defaultSummary="Coding patterns and communication under pressure."
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
