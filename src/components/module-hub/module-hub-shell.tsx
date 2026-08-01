"use client";

import { usePathname } from "next/navigation";
import { PortalChrome } from "@/components/portal/portal-chrome";
import { useModuleHub } from "@/features/curriculum/hooks/use-module-hub";
import type { ModuleHubPayload } from "@/features/curriculum/actions/module-hub-actions";
import { cn } from "@/lib/utils";

type ModuleHubShellProps = {
  moduleSlug: string;
  initialData: ModuleHubPayload;
  children: React.ReactNode;
};

/**
 * Persistent module layout — seeds TanStack Query cache and keeps
 * portal chrome mounted. No hub tabs; Topic Explorer owns the module page.
 */
export function ModuleHubShell({
  moduleSlug,
  initialData,
  children,
}: ModuleHubShellProps) {
  const pathname = usePathname();
  useModuleHub(moduleSlug, initialData);
  const onChallenge = pathname.includes("/challenge/");
  const phaseTitle = initialData.detail.phase.title;

  return (
    <>
      <PortalChrome title="Roadmap" subtitle={phaseTitle} fillViewport />
      <div
        className={cn(
          "h-full min-h-0",
          onChallenge
            ? "overflow-hidden"
            : "overflow-x-hidden overflow-y-auto px-3 py-3 max-md:pb-2 sm:px-6 sm:py-4"
        )}
      >
        {children}
      </div>
    </>
  );
}
