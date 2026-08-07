"use client";

import { ModuleExperiencePlaceholder } from "@/components/module-hub/module-experience-placeholder";
import type { ModuleChallengeSolveProps } from "@/components/module-hub/module-challenge-solve-types";
import { findHtmlAcademyChallenge } from "@/features/curriculum/lib/html-academy-challenges";
import { HtmlPlaygroundSolve } from "@/components/html-academy/html-playground-solve";

export default function ExperienceRoute(props: ModuleChallengeSolveProps) {
  const found = findHtmlAcademyChallenge(props.topicSlug, props.challenge.id);
  if (!found) {
    return (
      <ModuleExperiencePlaceholder
        moduleSlug={props.moduleSlug}
        topicSlug={props.topicSlug}
        moduleTitle={props.moduleTitle}
        challengeTitle={props.challenge.lesson.title}
        experience="html-live"
      />
    );
  }
  return <HtmlPlaygroundSolve {...props} challenge={found} />;
}
