import Link from "next/link";
import { AuthShell, authLinkClass } from "@/components/auth/auth-shell";
import { SignupForm } from "@/components/auth/signup-form";
import { AUTH_ROUTES } from "@/features/auth/constants";

export const metadata = {
  title: "Create account",
};

export default function SignupPage() {
  return (
    <AuthShell
      title="Create your account"
      description="Join Suprabase and start shipping with structure."
      footer={
        <>
          Already have an account?{" "}
          <Link href={AUTH_ROUTES.login} className={authLinkClass}>
            Sign in
          </Link>
        </>
      }
    >
      <SignupForm />
    </AuthShell>
  );
}
