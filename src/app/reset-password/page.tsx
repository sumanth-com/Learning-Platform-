import Link from "next/link";
import { AuthShell, authLinkClass } from "@/components/auth/auth-shell";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { AUTH_ROUTES } from "@/features/auth/constants";

export const metadata = {
  title: "Set new password",
};

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
