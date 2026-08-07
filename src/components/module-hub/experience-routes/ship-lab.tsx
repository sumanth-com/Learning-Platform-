"use client";

import { ModuleExperiencePlaceholder } from "@/components/module-hub/module-experience-placeholder";
import type { ModuleChallengeSolveProps } from "@/components/module-hub/module-challenge-solve-types";
import { findShipAcademyChallenge } from "@/features/curriculum/lib/ship-academy-challenges";
import { ShipPlaygroundSolve } from "@/components/ship-academy/ship-playground-solve";

export default function ExperienceRoute(props: ModuleChallengeSolveProps) {
  const found = findShipAcademyChallenge(props.topicSlug, props.challenge.id);
  if (!found) {
    return (
      <ModuleExperiencePlaceholder
        moduleSlug={props.moduleSlug}
        topicSlug={props.topicSlug}
        moduleTitle={props.moduleTitle}
        challengeTitle={props.challenge.lesson.title}
        experience="ship-lab"
      />
    );
  }
  return <ShipPlaygroundSolve {...props} challenge={found} />;
}
