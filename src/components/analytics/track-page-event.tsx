"use client";

import { useEffect } from "react";
import { trackEvent, type AnalyticsEventName } from "@/lib/analytics";

/** Fire a one-shot page-level analytics event on mount. */
export function TrackPageEvent({
  event,
}: {
  event: AnalyticsEventName | string;
}) {
  useEffect(() => {
    trackEvent(event);
  }, [event]);

  return null;
}
