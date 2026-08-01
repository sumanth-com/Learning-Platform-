"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AuthFormField } from "@/components/auth/auth-form-field";
import { authPrimaryBtnClass, authSecondaryBtnClass } from "@/components/auth/auth-shell";
import {
  loginAction,
  resendConfirmationAction,
} from "@/features/auth/actions/auth-actions";
import {
  loginSchema,
  type LoginInput,
} from "@/features/auth/schemas/auth-schemas";
import { AUTH_ROUTES } from "@/features/auth/constants";

export function LoginForm() {
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [isResending, startResend] = useTransition();
  const [showResend, setShowResend] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: true },
  });

  useEffect(() => {
    const err = searchParams.get("error");
    if (err === "auth_callback_failed") {
      toast.error(
        "That verification or reset link is invalid or expired. Request a new one."
      );
    }
  }, [searchParams]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      const result = await loginAction(values);
      if (result && !result.success) {
        toast.error(result.error);
        const msg = result.error.toLowerCase();
        if (
          msg.includes("verify") ||
          msg.includes("not been verified") ||
          msg.includes("incorrect email or password")
        ) {
          setShowResend(true);
        }
      }
    });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-2.5" noValidate>
      <AuthFormField
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="Enter email"
        error={errors.email}
        {...register("email")}
      />
      <AuthFormField
        label="Password"
        type="password"
        autoComplete="current-password"
        placeholder="Enter password"
        error={errors.password}
        {...register("password")}
      />

      <div className="flex items-center justify-between gap-3">
        <label className="inline-flex items-center gap-2 text-[12.5px] text-[#5f3435]/80">
          <input
            type="checkbox"
            className="h-3.5 w-3.5 rounded border-[#5f3435]/25"
            {...register("rememberMe")}
          />
          Remember me
        </label>
        <Link
          href={AUTH_ROUTES.forgotPassword}
          className="text-[12.5px] font-medium text-[#5f3435] transition hover:text-[#3f2223] hover:underline hover:underline-offset-2"
        >
          Forgot password?
        </Link>
      </div>

      <Button
        type="submit"
        className={`w-full ${authPrimaryBtnClass}`}
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Signing in…
          </>
        ) : (
          "Sign in"
        )}
      </Button>

      {showResend ? (
        <div className="space-y-2">
          <Button
            type="button"
            variant="outline"
            className={`w-full ${authSecondaryBtnClass}`}
            disabled={isResending || cooldown > 0}
            onClick={() => {
              const email = getValues("email");
              startResend(async () => {
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
            {isResending ? (
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
    </form>
  );
}
