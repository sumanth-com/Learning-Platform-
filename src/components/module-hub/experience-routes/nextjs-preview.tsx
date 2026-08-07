"use client";

import { ModuleExperiencePlaceholder } from "@/components/module-hub/module-experience-placeholder";
import type { ModuleChallengeSolveProps } from "@/components/module-hub/module-challenge-solve-types";
import { findNextjsAcademyChallenge } from "@/features/curriculum/lib/nextjs-academy-challenges";
import { NextjsPlaygroundSolve } from "@/components/nextjs-academy/nextjs-playground-solve";

export default function ExperienceRoute(props: ModuleChallengeSolveProps) {
  const found = findNextjsAcademyChallenge(props.topicSlug, props.challenge.id);
  if (!found) {
    return (
      <ModuleExperiencePlaceholder
        moduleSlug={props.moduleSlug}
        topicSlug={props.topicSlug}
        moduleTitle={props.moduleTitle}
        challengeTitle={props.challenge.lesson.title}
        experience="nextjs-preview"
      />
    );
  }
  return <NextjsPlaygroundSolve {...props} challenge={found} />;
}
