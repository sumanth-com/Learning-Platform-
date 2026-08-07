"use client";

import { ModuleExperiencePlaceholder } from "@/components/module-hub/module-experience-placeholder";
import type { ModuleChallengeSolveProps } from "@/components/module-hub/module-challenge-solve-types";
import { findCapstoneAcademyChallenge } from "@/features/curriculum/lib/capstone-academy-challenges";
import { CapstonePlaygroundSolve } from "@/components/capstone-academy/capstone-playground-solve";

export default function ExperienceRoute(props: ModuleChallengeSolveProps) {
  const found = findCapstoneAcademyChallenge(props.topicSlug, props.challenge.id);
  if (!found) {
    return (
      <ModuleExperiencePlaceholder
        moduleSlug={props.moduleSlug}
        topicSlug={props.topicSlug}
        moduleTitle={props.moduleTitle}
        challengeTitle={props.challenge.lesson.title}
        experience="capstone-lab"
      />
    );
  }
  return <CapstonePlaygroundSolve {...props} challenge={found} />;
}
