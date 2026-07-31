"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2, Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AuthShell,
  authLinkClass,
  authPrimaryBtnClass,
  authSecondaryBtnClass,
} from "@/components/auth/auth-shell";
import { resendConfirmationAction } from "@/features/auth/actions/auth-actions";
import { AUTH_ROUTES } from "@/features/auth/constants";

export function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const [isPending, startTransition] = useTransition();
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  return (
    <AuthShell
      title="Verify your email"
      description="Confirm your address to unlock your Suprabase account."
      footer={
        <>
          Already verified?{" "}
          <Link href={AUTH_ROUTES.login} className={authLinkClass}>
            Sign in
          </Link>
        </>
      }
    >
      <div className="space-y-5">
        <div className="flex items-start gap-3 rounded-2xl border border-[#e6ebf2] bg-[#f4f6fa] p-4">
          <Mail className="mt-0.5 h-5 w-5 shrink-0 text-[#5f3435]" />
          <div className="text-sm text-[#6b7285]">
            <p>
              We sent a verification link
              {email ? (
                <>
                  {" "}
                  to{" "}
                  <span className="font-medium text-[#14151a]">{email}</span>
                </>
              ) : null}
              . Open it, then come back and sign in.
            </p>
            <p className="mt-2 text-xs text-[#8b93a3]">
              The link expires in 24 hours. Check spam if you don’t see it.
            </p>
          </div>
        </div>

        {email ? (
          <div className="space-y-2">
            <Button
              type="button"
              variant="secondary"
              className={`w-full ${authSecondaryBtnClass}`}
              disabled={isPending || cooldown > 0}
              onClick={() => {
                startTransition(async () => {
                  const result = await resendConfirmationAction({ email });
                  if (!result.success) {
                    toast.error(result.error);
                    if (result.data?.retryAfterSec) {
                      setCooldown(result.data.retryAfterSec);
                    }
                    return;
                  }
                  toast.success(result.message ?? "Email sent successfully.");
                  setCooldown(result.data?.retryAfterSec ?? 60);
                });
              }}
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending…
                </>
              ) : cooldown > 0 ? (
                `Resend in ${cooldown}s`
              ) : (
                "Resend verification email"
              )}
            </Button>
            {cooldown > 0 ? (
              <p className="text-center text-[11px] text-[#8b93a3]">
                Email sent successfully. You can request another in {cooldown}s.
              </p>
            ) : null}
          </div>
        ) : null}

        <Link href={AUTH_ROUTES.login} className="block">
          <Button
            variant="outline"
            className={`w-full ${authPrimaryBtnClass}`}
          >
            Back to sign in
          </Button>
        </Link>
      </div>
    </AuthShell>
  );
}
