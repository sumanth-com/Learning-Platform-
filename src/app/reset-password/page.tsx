import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { AUTH_ROUTES } from "@/features/auth/constants";

export const metadata = {
  title: "Set new password",
};

export default function ResetPasswordPage() {
  return (
    <AuthShell
      title="Choose a new password"
      description="Enter a strong password to secure your SupraLearn account."
      footer={
        <>
          Need a new link?{" "}
          <Link
            href={AUTH_ROUTES.forgotPassword}
            className="font-medium text-indigo-400 hover:text-indigo-300"
          >
            Request again
          </Link>
        </>
      }
    >
      <ResetPasswordForm />
    </AuthShell>
  );
}
