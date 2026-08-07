"use client";

import { ModuleExperiencePlaceholder } from "@/components/module-hub/module-experience-placeholder";
import type { ModuleChallengeSolveProps } from "@/components/module-hub/module-challenge-solve-types";
import { findInterviewAcademyChallenge } from "@/features/curriculum/lib/interview-academy-challenges";
import { InterviewPlaygroundSolve } from "@/components/interview-academy/interview-playground-solve";

export default function ExperienceRoute(props: ModuleChallengeSolveProps) {
  const found = findInterviewAcademyChallenge(props.topicSlug, props.challenge.id);
  if (!found) {
    return (
      <ModuleExperiencePlaceholder
        moduleSlug={props.moduleSlug}
        topicSlug={props.topicSlug}
        moduleTitle={props.moduleTitle}
        challengeTitle={props.challenge.lesson.title}
        experience="interview-lab"
      />
    );
  }
  return <InterviewPlaygroundSolve {...props} challenge={found} />;
}
