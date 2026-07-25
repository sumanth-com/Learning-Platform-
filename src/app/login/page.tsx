import { Suspense } from "react";
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
      description="Sign in to continue your learning path on SupraBase."
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
      <Suspense
        fallback={
          <div className="flex justify-center py-10 text-sm text-zinc-500">
            Loading…
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
