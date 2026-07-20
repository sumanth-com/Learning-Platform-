import { Suspense } from "react";
import { VerifyEmailContent } from "@/components/auth/verify-email-content";
import { AuthLoadingSkeleton } from "@/components/auth/auth-loading-skeleton";

export const metadata = {
  title: "Verify email",
};

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<AuthLoadingSkeleton />}>
      <VerifyEmailContent />
    </Suspense>
  );
}
