"use client";

import { ModuleExperiencePlaceholder } from "@/components/module-hub/module-experience-placeholder";
import type { ModuleChallengeSolveProps } from "@/components/module-hub/module-challenge-solve-types";
import { findModelingAcademyChallenge } from "@/features/curriculum/lib/modeling-academy-challenges";
import { ModelingPlaygroundSolve } from "@/components/modeling-academy/modeling-playground-solve";

export default function ExperienceRoute(props: ModuleChallengeSolveProps) {
  const found = findModelingAcademyChallenge(props.topicSlug, props.challenge.id);
  if (!found) {
    return (
      <ModuleExperiencePlaceholder
        moduleSlug={props.moduleSlug}
        topicSlug={props.topicSlug}
        moduleTitle={props.moduleTitle}
        challengeTitle={props.challenge.lesson.title}
        experience="modeling-lab"
      />
    );
  }
  return <ModelingPlaygroundSolve {...props} challenge={found} />;
}
