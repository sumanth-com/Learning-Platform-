import type { Metadata } from "next";
import { ReserveSeatView } from "@/components/auth/reserve-seat-view";
import { JsonLd } from "@/components/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo";
import { SITE_ROUTES } from "@/lib/site-routes";
import {
  breadcrumbSchema,
  graphSchema,
  organizationSchema,
} from "@/lib/seo-schema";

export const metadata: Metadata = buildPageMetadata({
  title: "Request Access — Join the AI Learning Platform",
  description:
    "Suprabase is invite-only. Request access to learn full stack development, AI engineering, system design, and earn verifiable developer certifications.",
  path: SITE_ROUTES.reserveSeat,
  keywords: [
    "AI learning platform",
    "software engineer training",
    "developer career platform",
    "learn full stack development",
  ],
});

export default function ReserveSeatPage() {
  return (
    <>
      <JsonLd
        id="json-ld-reserve-seat"
        data={graphSchema([
          organizationSchema(),
          breadcrumbSchema([
            { name: "Home", path: SITE_ROUTES.home },
            { name: "Request Access", path: SITE_ROUTES.reserveSeat },
          ]),
        ])}
      />
      <ReserveSeatView />
    </>
  );
}
