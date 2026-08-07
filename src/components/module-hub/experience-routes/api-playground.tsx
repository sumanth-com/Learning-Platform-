"use client";

import { ModuleExperiencePlaceholder } from "@/components/module-hub/module-experience-placeholder";
import type { ModuleChallengeSolveProps } from "@/components/module-hub/module-challenge-solve-types";
import { findApisAcademyChallenge } from "@/features/curriculum/lib/apis-academy-challenges";
import { ApiPlaygroundSolve } from "@/components/apis-academy/api-playground-solve";

export default function ExperienceRoute(props: ModuleChallengeSolveProps) {
  const found = findApisAcademyChallenge(props.topicSlug, props.challenge.id);
  if (!found) {
    return (
      <ModuleExperiencePlaceholder
        moduleSlug={props.moduleSlug}
        topicSlug={props.topicSlug}
        moduleTitle={props.moduleTitle}
        challengeTitle={props.challenge.lesson.title}
        experience="api-playground"
      />
    );
  }
  return <ApiPlaygroundSolve {...props} challenge={found} />;
}
