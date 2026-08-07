"use client";

import { ModuleExperiencePlaceholder } from "@/components/module-hub/module-experience-placeholder";
import type { ModuleChallengeSolveProps } from "@/components/module-hub/module-challenge-solve-types";
import { findJsAcademyChallenge } from "@/features/curriculum/lib/js-academy-challenges";
import { JsPlaygroundSolve } from "@/components/js-academy/js-playground-solve";

export default function ExperienceRoute(props: ModuleChallengeSolveProps) {
  const found = findJsAcademyChallenge(props.topicSlug, props.challenge.id);
  if (!found) {
    return (
      <ModuleExperiencePlaceholder
        moduleSlug={props.moduleSlug}
        topicSlug={props.topicSlug}
        moduleTitle={props.moduleTitle}
        challengeTitle={props.challenge.lesson.title}
        experience="javascript-console"
      />
    );
  }
  return <JsPlaygroundSolve {...props} challenge={found} />;
}
