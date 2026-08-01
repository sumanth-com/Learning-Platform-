import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { AuthShell, authLinkClass } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";
import { AUTH_ROUTES } from "@/features/auth/constants";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Sign In",
  description:
    "Sign in to Suprabase to continue your full stack and AI engineering learning path, projects, and certifications.",
  path: "/login",
  noIndex: true,
});

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      description="Enter your details to access your dashboard."
      panelVariant="login"
      footer={
        <>
          Want to join?{" "}
          <Link href={AUTH_ROUTES.signup} className={authLinkClass}>
            Reserve your seat
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
