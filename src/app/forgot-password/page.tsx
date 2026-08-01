import Link from "next/link";
import type { Metadata } from "next";
import { AuthShell, authLinkClass } from "@/components/auth/auth-shell";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { AUTH_ROUTES } from "@/features/auth/constants";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Forgot Password",
  description: "Reset your Suprabase account password with a secure email link.",
  path: "/forgot-password",
  noIndex: true,
});

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Reset your password"
      description="Enter your email and we’ll send a secure reset link."
      footer={
        <>
          Remembered it?{" "}
          <Link href={AUTH_ROUTES.login} className={authLinkClass}>
            Back to sign in
          </Link>
        </>
      }
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
