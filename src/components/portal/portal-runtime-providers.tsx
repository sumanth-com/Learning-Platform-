"use client";

import dynamic from "next/dynamic";
import { ProgressBootstrap } from "@/components/shared/progress-bootstrap";
import { WeekCompletionCelebration } from "@/components/shared/week-completion-celebration";
import type { PortalUser } from "@/features/portal/types";

const ModuleCompletionWatcher = dynamic(
  () =>
    import("@/components/shared/progress-bootstrap").then(
      (m) => m.ModuleCompletionWatcher
    ),
  { ssr: false }
);

/** Student-only progress sync + celebration — keep off marketing pages. */
export function PortalRuntimeProviders({
  seedUser,
}: {
  seedUser?: PortalUser;
}) {
  return (
    <>
      <ProgressBootstrap seedUser={seedUser} />
      <ModuleCompletionWatcher />
      <WeekCompletionCelebration />
    </>
  );
}
