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
    defaultValues: { email: "", password: "" },
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
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <AuthFormField
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="you@company.com"
        error={errors.email}
        {...register("email")}
      />
      <AuthFormField
        label="Password"
        type="password"
        autoComplete="current-password"
        placeholder="••••••••"
        error={errors.password}
        {...register("password")}
      />

      <div className="flex justify-end">
        <Link
          href={AUTH_ROUTES.forgotPassword}
          className="text-xs font-medium text-indigo-400 transition hover:text-indigo-300"
        >
          Forgot password?
        </Link>
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={isPending}>
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
            className="w-full"
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
            <p className="text-center text-[11px] text-zinc-500">
              Email sent successfully. You can request another in {cooldown}s.
            </p>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}
