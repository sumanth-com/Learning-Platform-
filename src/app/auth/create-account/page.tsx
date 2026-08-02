import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { CreateAccountForm } from "@/components/auth/create-account-form";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Create Password",
  description:
    "Create your SupraBase password and open your learning workspace.",
  path: "/auth/create-account",
  noIndex: true,
});

export default function CreateAccountPage() {
  return (
    <AuthShell
      title="Create your password."
      description="Set a secure password for your invited account, then continue into your workspace."
      panelVariant="signup"
    >
      <Suspense
        fallback={
          <div className="flex justify-center py-10 text-sm text-[#8b93a3]">
            Loading…
          </div>
        }
      >
        <CreateAccountForm />
      </Suspense>
    </AuthShell>
  );
}
