"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PasswordField } from "@/components/auth/password-field";
import { authPrimaryBtnClass } from "@/components/auth/auth-shell";
import { resetPasswordAction } from "@/features/auth/actions/auth-actions";
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "@/features/auth/schemas/auth-schemas";
import { AUTH_ROUTES } from "@/features/auth/constants";

export function ResetPasswordForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [succeeded, setSucceeded] = useState(false);
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
    mode: "onChange",
  });

  const password = watch("password");

  useEffect(() => {
    if (!succeeded) return;
    const t = setTimeout(() => router.push(AUTH_ROUTES.login), 1800);
    return () => clearTimeout(t);
  }, [succeeded, router]);

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      const result = await resetPasswordAction(values);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      setSucceeded(true);
      toast.success(result.message);
    });
  });

  return (
    <div className="relative">
      <AnimatePresence>
        {succeeded ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-3 py-8 text-center"
          >
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600"
            >
              <CheckCircle2 className="h-8 w-8" />
            </motion.div>
            <h2 className="text-lg font-semibold text-[#14151a]">
              Password updated
            </h2>
            <p className="text-sm text-[#6b7285]">
              Redirecting you to sign in…
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {!succeeded ? (
        <form onSubmit={onSubmit} className="space-y-2.5" noValidate>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <PasswordField
                id="new-password"
                label="New password"
                value={field.value}
                onChange={field.onChange}
                error={errors.password?.message}
                placeholder="Create a strong password"
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
                error={errors.confirmPassword?.message}
                placeholder="Repeat password"
                showStrength={false}
              />
            )}
          />

          <Button
            type="submit"
            className={`w-full ${authPrimaryBtnClass}`}
            disabled={isPending || !password}
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Updating password…
              </>
            ) : (
              "Update password"
            )}
          </Button>
        </form>
      ) : null}
    </div>
  );
}
