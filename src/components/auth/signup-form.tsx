"use client";

import { useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AuthFormField } from "@/components/auth/auth-form-field";
import { PasswordField } from "@/components/auth/password-field";
import { authPrimaryBtnClass } from "@/components/auth/auth-shell";
import { signupAction } from "@/features/auth/actions/auth-actions";
import {
  signupSchema,
  type SignupInput,
} from "@/features/auth/schemas/auth-schemas";
import { AUTH_ROUTES } from "@/features/auth/constants";

export function SignupForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      const result = await signupAction(values);

      if (!result) return;

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success(result.message);

      if (result.data?.needsVerification) {
        router.push(
          `${AUTH_ROUTES.verifyEmail}?email=${encodeURIComponent(result.data.email)}`
        );
        return;
      }

      router.push(AUTH_ROUTES.login);
    });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-2.5" noValidate>
      <AuthFormField
        label="Full name"
        type="text"
        autoComplete="name"
        placeholder="Alex Rivera"
        error={errors.fullName}
        {...register("fullName")}
      />
      <AuthFormField
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="you@company.com"
        error={errors.email}
        {...register("email")}
      />
      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <PasswordField
            id="signup-password"
            label="Password"
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
            id="signup-confirm"
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
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Creating account…
          </>
        ) : (
          "Create account"
        )}
      </Button>
    </form>
  );
}
