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
import { hardNavigate, signInViaRoute } from "@/features/auth/lib/route-auth";
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
      acceptTerms: true,
    },
  });

  useEffect(() => {
    setValue("token", token);
    setValue("acceptTerms", true);
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
      const result = await completeInviteAccountAction({
        ...values,
        acceptTerms: true,
      });
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

      const login = await signInViaRoute({
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
        <p className="text-[14px] text-[#4b5160]">
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
    <form onSubmit={onSubmit} className="space-y-3" noValidate>
      <input type="hidden" {...register("token")} />
      <input type="hidden" {...register("acceptTerms")} />

      <div className="rounded-xl bg-[#f0ece9] px-3.5 py-2.5 text-left">
        <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#8b93a3]">
          Invited email
        </p>
        <p className="mt-0.5 text-[13.5px] font-medium text-[#14151a]">
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

      <p className="pt-0.5 text-center text-[11px] leading-relaxed text-[#8b93a3]">
        By continuing, you agree to our{" "}
        <Link
          href={SITE_ROUTES.terms}
          target="_blank"
          className="font-medium text-[#5f3435] underline underline-offset-2 hover:text-[#3f2223]"
        >
          Terms
        </Link>{" "}
        and{" "}
        <Link
          href={SITE_ROUTES.privacy}
          target="_blank"
          className="font-medium text-[#5f3435] underline underline-offset-2 hover:text-[#3f2223]"
        >
          Privacy Policy
        </Link>
        .
      </p>
    </form>
  );
}
