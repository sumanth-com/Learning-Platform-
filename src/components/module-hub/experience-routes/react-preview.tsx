"use client";

import { ModuleExperiencePlaceholder } from "@/components/module-hub/module-experience-placeholder";
import type { ModuleChallengeSolveProps } from "@/components/module-hub/module-challenge-solve-types";
import { findReactAcademyChallenge } from "@/features/curriculum/lib/react-academy-challenges";
import { ReactPlaygroundSolve } from "@/components/react-academy/react-playground-solve";

export default function ExperienceRoute(props: ModuleChallengeSolveProps) {
  const found = findReactAcademyChallenge(props.topicSlug, props.challenge.id);
  if (!found) {
    return (
      <ModuleExperiencePlaceholder
        moduleSlug={props.moduleSlug}
        topicSlug={props.topicSlug}
        moduleTitle={props.moduleTitle}
        challengeTitle={props.challenge.lesson.title}
        experience="react-preview"
      />
    );
  }
  return <ReactPlaygroundSolve {...props} challenge={found} />;
}
