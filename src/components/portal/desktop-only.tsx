"use client";

import { ContinueOnDesktop } from "@/components/portal/continue-on-desktop";
import { cn } from "@/lib/utils";

type DesktopOnlyProps = {
  children: React.ReactNode;
  /** Shown on the mobile gate card. */
  featureLabel?: string;
  /**
   * `lg` — hide real UI below large (labs / editors).
   * `md` — hide below tablet (full-route companion blocks).
   */
  breakpoint?: "md" | "lg";
  className?: string;
};

/**
 * Shows Continue-on-Desktop on small screens; mounts children only at the
 * chosen breakpoint and up so desktop layout is untouched.
 */
export function DesktopOnly({
  children,
  featureLabel,
  breakpoint = "lg",
  className,
}: DesktopOnlyProps) {
  const gateHidden =
    breakpoint === "md" ? "md:hidden" : "lg:hidden";
  const contentHidden =
    breakpoint === "md" ? "hidden md:contents" : "hidden lg:contents";

  return (
    <>
      <div className={cn(gateHidden, "min-h-0 flex-1", className)}>
        <ContinueOnDesktop featureLabel={featureLabel} />
      </div>
      <div className={contentHidden}>{children}</div>
    </>
  );
}
