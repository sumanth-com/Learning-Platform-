"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";
import { trackEvent, type AnalyticsEventName } from "@/lib/analytics";

type TrackedLinkProps = ComponentProps<typeof Link> & {
  event: AnalyticsEventName | string;
  eventParams?: Record<string, string | number | boolean | undefined>;
};

/** Next.js Link that emits a GA4 event on click without changing navigation. */
export function TrackedLink({
  event,
  eventParams,
  onClick,
  ...props
}: TrackedLinkProps) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    trackEvent(event, eventParams);
    onClick?.(e);
  };

  return <Link {...props} onClick={handleClick} />;
}
