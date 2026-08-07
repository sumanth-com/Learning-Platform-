"use client";

import { ModuleExperiencePlaceholder } from "@/components/module-hub/module-experience-placeholder";
import type { ModuleChallengeSolveProps } from "@/components/module-hub/module-challenge-solve-types";
import { findTypescriptAcademyChallenge } from "@/features/curriculum/lib/typescript-academy-challenges";
import { TypescriptPlaygroundSolve } from "@/components/typescript-academy/typescript-playground-solve";

export default function ExperienceRoute(props: ModuleChallengeSolveProps) {
  const found = findTypescriptAcademyChallenge(props.topicSlug, props.challenge.id);
  if (!found) {
    return (
      <ModuleExperiencePlaceholder
        moduleSlug={props.moduleSlug}
        topicSlug={props.topicSlug}
        moduleTitle={props.moduleTitle}
        challengeTitle={props.challenge.lesson.title}
        experience="typescript-console"
      />
    );
  }
  return <TypescriptPlaygroundSolve {...props} challenge={found} />;
}
