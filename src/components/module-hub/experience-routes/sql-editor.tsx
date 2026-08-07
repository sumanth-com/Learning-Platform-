"use client";

import { ModuleExperiencePlaceholder } from "@/components/module-hub/module-experience-placeholder";
import type { ModuleChallengeSolveProps } from "@/components/module-hub/module-challenge-solve-types";
import { findSqlAcademyChallenge } from "@/features/curriculum/lib/sql-academy-challenges";
import { SqlPlaygroundSolve } from "@/components/sql-academy/sql-playground-solve";

export default function ExperienceRoute(props: ModuleChallengeSolveProps) {
  const found = findSqlAcademyChallenge(props.topicSlug, props.challenge.id);
  if (!found) {
    return (
      <ModuleExperiencePlaceholder
        moduleSlug={props.moduleSlug}
        topicSlug={props.topicSlug}
        moduleTitle={props.moduleTitle}
        challengeTitle={props.challenge.lesson.title}
        experience="sql-editor"
      />
    );
  }
  return <SqlPlaygroundSolve {...props} challenge={found} />;
}
