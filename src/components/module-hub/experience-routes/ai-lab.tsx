"use client";

import { ModuleExperiencePlaceholder } from "@/components/module-hub/module-experience-placeholder";
import type { ModuleChallengeSolveProps } from "@/components/module-hub/module-challenge-solve-types";
import { findAiFeaturesAcademyChallenge } from "@/features/curriculum/lib/ai-features-academy-challenges";
import { AiFeaturesPlaygroundSolve } from "@/components/ai-features-academy/ai-features-playground-solve";

export default function ExperienceRoute(props: ModuleChallengeSolveProps) {
  const found = findAiFeaturesAcademyChallenge(props.topicSlug, props.challenge.id);
  if (!found) {
    return (
      <ModuleExperiencePlaceholder
        moduleSlug={props.moduleSlug}
        topicSlug={props.topicSlug}
        moduleTitle={props.moduleTitle}
        challengeTitle={props.challenge.lesson.title}
        experience="ai-lab"
      />
    );
  }
  return <AiFeaturesPlaygroundSolve {...props} challenge={found} />;
}
