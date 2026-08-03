"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { sendGAEvent } from "@next/third-parties/google";

/**
 * Sends a GA4 page_view on App Router client navigations.
 * Skips the first render — initial page_view comes from <GoogleAnalytics />.
 */
export function GaPageViews() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const query = searchParams?.toString();
    const pagePath = query ? `${pathname}?${query}` : pathname;
    sendGAEvent("event", "page_view", {
      page_path: pagePath,
      page_location:
        typeof window !== "undefined" ? window.location.href : pagePath,
      page_title: typeof document !== "undefined" ? document.title : undefined,
    });
  }, [pathname, searchParams]);

  return null;
}
