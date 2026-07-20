"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2, Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AuthShell } from "@/components/auth/auth-shell";
import { resendConfirmationAction } from "@/features/auth/actions/auth-actions";
import { AUTH_ROUTES } from "@/features/auth/constants";

export function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const [isPending, startTransition] = useTransition();

  return (
    <AuthShell
      title="Verify your email"
      description="Supabase requires email confirmation before you can sign in."
      footer={
        <>
          Already verified?{" "}
          <Link
            href={AUTH_ROUTES.login}
            className="font-medium text-indigo-400 hover:text-indigo-300"
          >
            Sign in
          </Link>
        </>
      }
    >
      <div className="space-y-5">
        <div className="flex items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <Mail className="mt-0.5 h-5 w-5 shrink-0 text-indigo-400" />
          <div className="text-sm text-zinc-400">
            <p>
              We sent a verification link
              {email ? (
                <>
                  {" "}
                  to <span className="font-medium text-zinc-200">{email}</span>
                </>
              ) : null}
              . Open it, then come back and sign in.
            </p>
            <p className="mt-2 text-xs text-zinc-500">
              For local development you can also disable{" "}
              <span className="text-zinc-400">Confirm email</span> in Supabase →
              Authentication → Providers → Email, then sign up again.
            </p>
          </div>
        </div>

        {email ? (
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            disabled={isPending}
            onClick={() => {
              startTransition(async () => {
                const result = await resendConfirmationAction({ email });
                if (!result.success) {
                  toast.error(result.error);
                  return;
                }
                toast.success(result.message);
              });
            }}
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending…
              </>
            ) : (
              "Resend verification email"
            )}
          </Button>
        ) : null}

        <Link href={AUTH_ROUTES.login} className="block">
          <Button variant="outline" className="w-full">
            Back to sign in
          </Button>
        </Link>
      </div>
    </AuthShell>
  );
}
