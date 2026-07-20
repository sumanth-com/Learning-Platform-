import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";
import { AUTH_ROUTES } from "@/features/auth/constants";

export const metadata = {
  title: "Sign in",
};

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      description="Sign in to continue your learning path."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link
            href={AUTH_ROUTES.signup}
            className="font-medium text-indigo-400 hover:text-indigo-300"
          >
            Create one
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthShell>
  );
}
