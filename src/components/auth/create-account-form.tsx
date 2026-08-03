"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AuthFormField } from "@/components/auth/auth-form-field";
import { PasswordField } from "@/components/auth/password-field";
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
  const [succeeded, setSucceeded] = useState(false);
  const [redirectTo, setRedirectTo] = useState<string | null>(null);
  const [preview, setPreview] = useState<{ email: string; name: string } | null>(
    null
  );
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(true);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
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
    mode: "onChange",
  });

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  const matchStatus = useMemo(() => {
    if (!confirmPassword) return null;
    return password === confirmPassword ? "match" : "mismatch";
  }, [password, confirmPassword]);

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

  useEffect(() => {
    if (!succeeded || !redirectTo) return;
    const t = setTimeout(() => hardNavigate(redirectTo), 1600);
    return () => clearTimeout(t);
  }, [succeeded, redirectTo]);

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

      void import("@/lib/analytics").then(({ trackEvent, ANALYTICS_EVENTS }) => {
        trackEvent(ANALYTICS_EVENTS.signup_completed, {
          source: "create_account",
        });
      });

      const email = result.data?.email ?? preview?.email;
      if (!email) {
        setSucceeded(true);
        setRedirectTo(AUTH_ROUTES.login);
        return;
      }

      const login = await signInViaRoute({
        email,
        password: values.password,
      });

      if (!login.success) {
        setSucceeded(true);
        setRedirectTo(AUTH_ROUTES.login);
        return;
      }

      setSucceeded(true);
      setRedirectTo(login.redirectTo);
    });
  });

  if (loadingPreview) {
    return (
      <div className="flex justify-center py-10 text-sm text-[#8b93a3]">
        <Loader2 className="h-5 w-5 animate-spin" aria-label="Loading invitation" />
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
    <div className="relative">
      <AnimatePresence>
        {succeeded ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 24 }}
            className="flex flex-col items-center gap-3 py-8 text-center"
            role="status"
            aria-live="polite"
          >
            <motion.div
              initial={{ scale: 0.55, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 280, damping: 16 }}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600"
            >
              <CheckCircle2 className="h-8 w-8" aria-hidden />
            </motion.div>
            <h2 className="text-lg font-semibold tracking-tight text-[#14151a]">
              Account Ready
            </h2>
            <p className="max-w-xs text-sm leading-relaxed text-[#6b7285]">
              Your account has been created successfully.
              <br />
              Redirecting to your dashboard…
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {!succeeded ? (
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

          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <PasswordField
                id="create-password"
                label="Password"
                value={field.value}
                onChange={field.onChange}
                error={errors.password?.message}
                placeholder="Create a strong password"
                autoComplete="new-password"
                showStrength
              />
            )}
          />

          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <PasswordField
                id="confirm-password"
                label="Confirm password"
                value={field.value}
                onChange={field.onChange}
                error={
                  matchStatus === "mismatch"
                    ? undefined
                    : errors.confirmPassword?.message
                }
                placeholder="Confirm password"
                autoComplete="new-password"
                showStrength={false}
                matchStatus={matchStatus}
              />
            )}
          />

          <Button
            type="submit"
            className={`w-full ${authPrimaryBtnClass}`}
            disabled={isPending || matchStatus === "mismatch"}
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Activating…
              </>
            ) : (
              "Create password & continue"
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
      ) : null}
    </div>
  );
}
