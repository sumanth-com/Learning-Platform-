"use client";

import { ModuleExperiencePlaceholder } from "@/components/module-hub/module-experience-placeholder";
import type { ModuleChallengeSolveProps } from "@/components/module-hub/module-challenge-solve-types";
import { findCssAcademyChallenge } from "@/features/curriculum/lib/css-academy-challenges";
import { CssPlaygroundSolve } from "@/components/css-academy/css-playground-solve";

export default function ExperienceRoute(props: ModuleChallengeSolveProps) {
  const found = findCssAcademyChallenge(props.topicSlug, props.challenge.id);
  if (!found) {
    return (
      <ModuleExperiencePlaceholder
        moduleSlug={props.moduleSlug}
        topicSlug={props.topicSlug}
        moduleTitle={props.moduleTitle}
        challengeTitle={props.challenge.lesson.title}
        experience="css-live"
      />
    );
  }
  return <CssPlaygroundSolve {...props} challenge={found} />;
}
