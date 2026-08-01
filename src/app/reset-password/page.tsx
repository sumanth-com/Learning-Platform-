import Link from "next/link";
import type { Metadata } from "next";
import { AuthShell, authLinkClass } from "@/components/auth/auth-shell";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { AUTH_ROUTES } from "@/features/auth/constants";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Set New Password",
  description: "Choose a new password to secure your Suprabase account.",
  path: "/reset-password",
  noIndex: true,
});

export default function ResetPasswordPage() {
  return (
    <AuthShell
      title="Choose a new password"
      description="Pick a strong password to secure your Suprabase account."
      footer={
        <>
          Need a new link?{" "}
          <Link href={AUTH_ROUTES.forgotPassword} className={authLinkClass}>
            Request again
          </Link>
        </>
      }
    >
      <ResetPasswordForm />
    </AuthShell>
  );
}
