"use client";

import { ModuleExperiencePlaceholder } from "@/components/module-hub/module-experience-placeholder";
import type { ModuleChallengeSolveProps } from "@/components/module-hub/module-challenge-solve-types";
import { findDeploymentAcademyChallenge } from "@/features/curriculum/lib/deployment-academy-challenges";
import { DeploymentPlaygroundSolve } from "@/components/deployment-academy/deployment-playground-solve";

export default function ExperienceRoute(props: ModuleChallengeSolveProps) {
  const found = findDeploymentAcademyChallenge(props.topicSlug, props.challenge.id);
  if (!found) {
    return (
      <ModuleExperiencePlaceholder
        moduleSlug={props.moduleSlug}
        topicSlug={props.topicSlug}
        moduleTitle={props.moduleTitle}
        challengeTitle={props.challenge.lesson.title}
        experience="deploy-lab"
      />
    );
  }
  return <DeploymentPlaygroundSolve {...props} challenge={found} />;
}
