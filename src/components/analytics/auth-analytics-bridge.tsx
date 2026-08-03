"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics";

/** Converts auth callback flags into GA4 events, then strips the query params. */
export function AuthAnalyticsBridge() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const emailVerified = searchParams.get("email_verified");
    if (emailVerified !== "1") return;

    trackEvent(ANALYTICS_EVENTS.email_verified, { source: "auth_callback" });

    const next = new URLSearchParams(searchParams.toString());
    next.delete("email_verified");
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  }, [searchParams, pathname, router]);

  return null;
}
