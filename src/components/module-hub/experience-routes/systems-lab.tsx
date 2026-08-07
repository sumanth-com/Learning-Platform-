"use client";

import { ModuleExperiencePlaceholder } from "@/components/module-hub/module-experience-placeholder";
import type { ModuleChallengeSolveProps } from "@/components/module-hub/module-challenge-solve-types";
import { findSystemsAcademyChallenge } from "@/features/curriculum/lib/systems-academy-challenges";
import { SystemsPlaygroundSolve } from "@/components/systems-academy/systems-playground-solve";

export default function ExperienceRoute(props: ModuleChallengeSolveProps) {
  const found = findSystemsAcademyChallenge(props.topicSlug, props.challenge.id);
  if (!found) {
    return (
      <ModuleExperiencePlaceholder
        moduleSlug={props.moduleSlug}
        topicSlug={props.topicSlug}
        moduleTitle={props.moduleTitle}
        challengeTitle={props.challenge.lesson.title}
        experience="systems-lab"
      />
    );
  }
  return <SystemsPlaygroundSolve {...props} challenge={found} />;
}
