import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { CreateAccountForm } from "@/components/auth/create-account-form";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Activate Account",
  description:
    "Activate your invite to join Suprabase — set your password and open the learning portal.",
  path: "/auth/create-account",
  noIndex: true,
});

export default function CreateAccountPage() {
  return (
    <AuthShell
      title="Set your password."
      description="Create a password for your invited account, then continue into the portal."
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
