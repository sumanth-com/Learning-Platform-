import { Suspense } from "react";
import type { Metadata } from "next";
import { VerifyEmailContent } from "@/components/auth/verify-email-content";
import { AuthLoadingSkeleton } from "@/components/auth/auth-loading-skeleton";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Verify Email",
  description: "Confirm your email address to activate your Suprabase account.",
  path: "/verify-email",
  noIndex: true,
});

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<AuthLoadingSkeleton />}>
      <VerifyEmailContent />
    </Suspense>
  );
}
