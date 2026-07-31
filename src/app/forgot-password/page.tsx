import Link from "next/link";
import { AuthShell, authLinkClass } from "@/components/auth/auth-shell";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { AUTH_ROUTES } from "@/features/auth/constants";

export const metadata = {
  title: "Forgot password",
};

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
