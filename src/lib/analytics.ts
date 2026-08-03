import { sendGAEvent } from "@next/third-parties/google";

/** Production-only GA4 custom events (never fire in development). */
export const ANALYTICS_EVENTS = {
  reserve_seat_clicked: "reserve_seat_clicked",
  get_started_clicked: "get_started_clicked",
  login_clicked: "login_clicked",
  signup_completed: "signup_completed",
  email_verified: "email_verified",
  profile_completed: "profile_completed",
  course_started: "course_started",
  lesson_completed: "lesson_completed",
  project_submitted: "project_submitted",
  certificate_downloaded: "certificate_downloaded",
  mentor_chat_started: "mentor_chat_started",
  roadmap_viewed: "roadmap_viewed",
  stack_viewed: "stack_viewed",
  faq_viewed: "faq_viewed",
  contact_submitted: "contact_submitted",
} as const;

export type AnalyticsEventName =
  (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

export type AnalyticsParams = Record<
  string,
  string | number | boolean | undefined
>;

function isAnalyticsEnabled() {
  return (
    process.env.NODE_ENV === "production" &&
    Boolean(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim())
  );
}

/**
 * Fire a GA4 custom event via @next/third-parties sendGAEvent.
 * Safe no-op outside production or when GA is not configured.
 */
export function trackEvent(
  event: AnalyticsEventName | string,
  params?: AnalyticsParams
) {
  if (!isAnalyticsEnabled()) return;
  if (typeof window === "undefined") return;

  try {
    sendGAEvent("event", event, params ?? {});
  } catch {
    /* never break UX for analytics */
  }
}

export function trackReserveSeatClicked(source?: string) {
  trackEvent(ANALYTICS_EVENTS.reserve_seat_clicked, { source });
}

export function trackGetStartedClicked(source?: string) {
  trackEvent(ANALYTICS_EVENTS.get_started_clicked, { source });
}

export function trackLoginClicked(source?: string) {
  trackEvent(ANALYTICS_EVENTS.login_clicked, { source });
}
