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
import { authPrimaryBtnClass } from "@/components/auth/auth-shell";
import {
  completeInviteAccountAction,
  getInvitePreviewAction,
} from "@/features/auth/actions/seat-actions";
import {
  browserPasswordLogin,
  hardNavigate,
} from "@/features/auth/lib/browser-password-login";
import { createAccountSchema } from "@/features/auth/schemas/auth-schemas";
import { AUTH_ROUTES } from "@/features/auth/constants";
import { SITE_ROUTES } from "@/lib/site-routes";
import { z } from "zod";

type FormValues = z.infer<typeof createAccountSchema>;

export function CreateAccountForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [isPending, startTransition] = useTransition();
  const [preview, setPreview] = useState<{ email: string; name: string } | null>(
    null
  );
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: {
      token,
      fullName: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  useEffect(() => {
    setValue("token", token);
  }, [token, setValue]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadingPreview(true);
      const result = await getInvitePreviewAction(token);
      if (cancelled) return;
      if (!result.success || !result.data) {
        setPreviewError(
          !result.success ? result.error : "Invalid invitation."
        );
        setPreview(null);
      } else {
        setPreview(result.data);
        setValue("fullName", result.data.name);
        setPreviewError(null);
      }
      setLoadingPreview(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [token, setValue]);

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      const result = await completeInviteAccountAction(values);
      if (!result.success) {
        toast.error(result.error);
        return;
      }

      const email = result.data?.email ?? preview?.email;
      if (!email) {
        toast.success(result.message ?? "Account created. Please sign in.");
        hardNavigate(AUTH_ROUTES.login);
        return;
      }

      const login = await browserPasswordLogin({
        email,
        password: values.password,
      });

      if (!login.success) {
        toast.success("Account ready. Please sign in with your new password.");
        hardNavigate(AUTH_ROUTES.login);
        return;
      }

      toast.success(result.message ?? "Welcome to Suprabase.");
      hardNavigate(login.redirectTo);
    });
  });

  if (loadingPreview) {
    return (
      <div className="flex justify-center py-10 text-sm text-[#8b93a3]">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  if (previewError || !preview) {
    return (
      <div className="space-y-3 text-center">
        <p className="text-[14px] text-white/70">
          {previewError ?? "Invalid invitation link."}
        </p>
        <Button
          type="button"
          className={authPrimaryBtnClass}
          onClick={() => hardNavigate(AUTH_ROUTES.login)}
        >
          Go to sign in
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-2.5" noValidate>
      <input type="hidden" {...register("token")} />
      <div className="rounded-xl border border-white/8 bg-white/[0.03] px-3.5 py-2.5 text-left">
        <p className="text-[11px] uppercase tracking-[0.12em] text-white/35">
          Invited email
        </p>
        <p className="mt-0.5 text-[13.5px] font-medium text-white/80">
          {preview.email}
        </p>
      </div>
      <AuthFormField
        label="Full name"
        autoComplete="name"
        placeholder="Your full name"
        error={errors.fullName}
        {...register("fullName")}
      />
      <AuthFormField
        label="Password"
        type="password"
        autoComplete="new-password"
        placeholder="Create a strong password"
        error={errors.password}
        {...register("password")}
      />
      <AuthFormField
        label="Confirm password"
        type="password"
        autoComplete="new-password"
        placeholder="Confirm password"
        error={errors.confirmPassword}
        {...register("confirmPassword")}
      />
      <label className="flex items-start gap-2.5 pt-1 text-left text-[12.5px] text-white/55">
        <input
          type="checkbox"
          className="mt-0.5 h-4 w-4 rounded border-white/20 bg-transparent"
          {...register("acceptTerms")}
        />
        <span>
          I accept the{" "}
          <Link
            href={SITE_ROUTES.terms}
            target="_blank"
            className="text-[#f3b7ac] underline underline-offset-2 hover:text-white"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href={SITE_ROUTES.privacy}
            target="_blank"
            className="text-[#f3b7ac] underline underline-offset-2 hover:text-white"
          >
            Privacy Policy
          </Link>
          .
          {errors.acceptTerms ? (
            <span className="mt-1 block text-[12px] text-[#f3aaa0]">
              {errors.acceptTerms.message}
            </span>
          ) : null}
        </span>
      </label>
      <Button
        type="submit"
        className={`w-full ${authPrimaryBtnClass}`}
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Activating…
          </>
        ) : (
          "Set password & continue"
        )}
      </Button>
    </form>
  );
}
