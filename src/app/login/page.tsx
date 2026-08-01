import { Suspense } from "react";
import Link from "next/link";
import { AuthShell, authLinkClass } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";
import { AUTH_ROUTES } from "@/features/auth/constants";

export const metadata = {
  title: "Sign in",
};

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      description="Enter your details to access your dashboard."
      panelVariant="login"
      footer={
        <>
          Don&apos;t have an account yet?{" "}
          <Link href={AUTH_ROUTES.signup} className={authLinkClass}>
            Sign up
          </Link>
        </>
      }
    >
      <Suspense
        fallback={
          <div className="flex justify-center py-10 text-sm text-[#8b93a3]">
            Loading…
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
