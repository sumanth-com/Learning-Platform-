"use client";

import { ModuleExperiencePlaceholder } from "@/components/module-hub/module-experience-placeholder";
import type { ModuleChallengeSolveProps } from "@/components/module-hub/module-challenge-solve-types";
import { findDeveloperToolingChallenge } from "@/features/curriculum/lib/developer-tooling-challenges";
import { ToolingChallengeSolve } from "@/components/tooling/tooling-challenge-solve";

export default function ToolingExperienceRoute(props: ModuleChallengeSolveProps) {
  const tooling = findDeveloperToolingChallenge(
    props.topicSlug,
    props.challenge.id
  );
  if (!tooling) {
    return (
      <ModuleExperiencePlaceholder
        moduleSlug={props.moduleSlug}
        topicSlug={props.topicSlug}
        moduleTitle={props.moduleTitle}
        challengeTitle={props.challenge.lesson.title}
        experience="tooling"
      />
    );
  }
  return <ToolingChallengeSolve {...props} challenge={tooling} />;
}
