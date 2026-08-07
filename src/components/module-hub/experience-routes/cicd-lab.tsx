"use client";

import { ModuleExperiencePlaceholder } from "@/components/module-hub/module-experience-placeholder";
import type { ModuleChallengeSolveProps } from "@/components/module-hub/module-challenge-solve-types";
import { findCicdAcademyChallenge } from "@/features/curriculum/lib/cicd-academy-challenges";
import { CicdPlaygroundSolve } from "@/components/cicd-academy/cicd-playground-solve";

export default function ExperienceRoute(props: ModuleChallengeSolveProps) {
  const found = findCicdAcademyChallenge(props.topicSlug, props.challenge.id);
  if (!found) {
    return (
      <ModuleExperiencePlaceholder
        moduleSlug={props.moduleSlug}
        topicSlug={props.topicSlug}
        moduleTitle={props.moduleTitle}
        challengeTitle={props.challenge.lesson.title}
        experience="cicd-lab"
      />
    );
  }
  return <CicdPlaygroundSolve {...props} challenge={found} />;
}
