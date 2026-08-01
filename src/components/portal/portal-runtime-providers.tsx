"use client";

import { ProgressBootstrap, ModuleCompletionWatcher } from "@/components/shared/progress-bootstrap";
import { WeekCompletionCelebration } from "@/components/shared/week-completion-celebration";

/** Student-only progress sync + celebration — keep off marketing pages. */
export function PortalRuntimeProviders() {
  return (
    <>
      <ProgressBootstrap />
      <ModuleCompletionWatcher />
      <WeekCompletionCelebration />
    </>
  );
}
