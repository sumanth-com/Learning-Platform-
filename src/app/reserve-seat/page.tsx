import type { Metadata } from "next";
import { ReserveSeatView } from "@/components/auth/reserve-seat-view";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Request Access — Join the AI Learning Platform",
  description:
    "Suprabase is invite-only. Request access to learn full stack development, AI engineering, system design, and earn verifiable developer certifications.",
  path: "/reserve-seat",
  keywords: [
    "AI learning platform",
    "software engineer training",
    "developer career platform",
    "learn full stack development",
  ],
});

export default function ReserveSeatPage() {
  return <ReserveSeatView />;
}
