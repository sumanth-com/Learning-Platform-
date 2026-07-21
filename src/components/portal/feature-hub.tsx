"use client";

/**
 * Feature hub pages are client wrappers so PortalChrome can set header titles
 * inside the persistent portal layout.
 */
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PortalChrome } from "@/components/portal/portal-chrome";
import { PORTAL_ROUTES } from "@/features/portal/types";

type FeatureHubProps = {
  title: string;
  description: string;
  bullets?: string[];
  primaryHref?: string;
  primaryLabel?: string;
};

export function FeatureHub({
  title,
  description,
  bullets = [],
  primaryHref = PORTAL_ROUTES.journey,
  primaryLabel = "Open Journey",
}: FeatureHubProps) {
  return (
    <>
      <PortalChrome title={title} subtitle={description} />
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-8">
          {bullets.length > 0 ? (
            <ul className="space-y-2 text-sm text-zinc-400">
              {bullets.map((b) => (
                <li key={b} className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
                  {b}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm leading-relaxed text-zinc-400">{description}</p>
          )}
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild className="gap-2">
              <Link href={primaryHref}>
                {primaryLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={PORTAL_ROUTES.dashboard}>Back to dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
