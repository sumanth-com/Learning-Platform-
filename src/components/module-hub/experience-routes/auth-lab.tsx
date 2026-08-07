"use client";

import { ModuleExperiencePlaceholder } from "@/components/module-hub/module-experience-placeholder";
import type { ModuleChallengeSolveProps } from "@/components/module-hub/module-challenge-solve-types";
import { findAuthAcademyChallenge } from "@/features/curriculum/lib/auth-academy-challenges";
import { AuthPlaygroundSolve } from "@/components/auth-academy/auth-playground-solve";

export default function ExperienceRoute(props: ModuleChallengeSolveProps) {
  const found = findAuthAcademyChallenge(props.topicSlug, props.challenge.id);
  if (!found) {
    return (
      <ModuleExperiencePlaceholder
        moduleSlug={props.moduleSlug}
        topicSlug={props.topicSlug}
        moduleTitle={props.moduleTitle}
        challengeTitle={props.challenge.lesson.title}
        experience="auth-lab"
      />
    );
  }
  return <AuthPlaygroundSolve {...props} challenge={found} />;
}
