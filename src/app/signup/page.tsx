import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignupForm } from "@/components/auth/signup-form";
import { AUTH_ROUTES } from "@/features/auth/constants";

export const metadata = {
  title: "Create account",
};

export default function SignupPage() {
  return (
    <AuthShell
      title="Create your account"
      description="Join SupraBase and start building with structure."
      footer={
        <>
          Already have an account?{" "}
          <Link
            href={AUTH_ROUTES.login}
            className="font-medium text-indigo-400 hover:text-indigo-300"
          >
            Sign in
          </Link>
        </>
      }
    >
      <SignupForm />
    </AuthShell>
  );
}
