import { Suspense } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { CreateAccountForm } from "@/components/auth/create-account-form";

export const metadata = {
  title: "Activate account",
};

export default function CreateAccountPage() {
  return (
    <AuthShell
      title="Activate your account."
      description="Set your name and password to join Suprabase."
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
