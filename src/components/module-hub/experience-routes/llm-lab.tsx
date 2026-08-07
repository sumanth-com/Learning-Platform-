"use client";

import { ModuleExperiencePlaceholder } from "@/components/module-hub/module-experience-placeholder";
import type { ModuleChallengeSolveProps } from "@/components/module-hub/module-challenge-solve-types";
import { findLlmAcademyChallenge } from "@/features/curriculum/lib/llm-academy-challenges";
import { LlmPlaygroundSolve } from "@/components/llm-academy/llm-playground-solve";

export default function ExperienceRoute(props: ModuleChallengeSolveProps) {
  const found = findLlmAcademyChallenge(props.topicSlug, props.challenge.id);
  if (!found) {
    return (
      <ModuleExperiencePlaceholder
        moduleSlug={props.moduleSlug}
        topicSlug={props.topicSlug}
        moduleTitle={props.moduleTitle}
        challengeTitle={props.challenge.lesson.title}
        experience="llm-lab"
      />
    );
  }
  return <LlmPlaygroundSolve {...props} challenge={found} />;
}
