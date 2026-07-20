"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
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
  const [isPending, startTransition] = useTransition();
  const [isResending, startResend] = useTransition();
  const [showResend, setShowResend] = useState(false);
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      const result = await loginAction(values);
      if (result && !result.success) {
        toast.error(result.error);
        const msg = result.error.toLowerCase();
        if (
          msg.includes("verify") ||
          msg.includes("confirm") ||
          msg.includes("invalid email or password")
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
        <Button
          type="button"
          variant="outline"
          className="w-full"
          disabled={isResending}
          onClick={() => {
            const email = getValues("email");
            startResend(async () => {
              const result = await resendConfirmationAction({ email });
              if (!result.success) {
                toast.error(result.error);
                return;
              }
              toast.success(result.message);
            });
          }}
        >
          {isResending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending…
            </>
          ) : (
            "Resend verification email"
          )}
        </Button>
      ) : null}
    </form>
  );
}
