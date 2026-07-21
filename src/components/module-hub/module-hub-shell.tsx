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

  return (
    <>
      <PortalChrome fillViewport />
      <div
        className={cn(
          "h-full min-h-0",
          onChallenge ? "overflow-hidden" : "overflow-y-auto px-4 py-4 sm:px-6"
        )}
      >
        {children}
      </div>
    </>
  );
}
