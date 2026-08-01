"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AuthFormField } from "@/components/auth/auth-form-field";
import { authPrimaryBtnClass, authLinkClass } from "@/components/auth/auth-shell";
import { submitSeatRequestAction } from "@/features/auth/actions/seat-actions";
import {
  seatRequestSchema,
  type SeatRequestInput,
} from "@/features/auth/schemas/auth-schemas";
import { AUTH_ROUTES } from "@/features/auth/constants";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS: Array<{
  value: SeatRequestInput["applicantStatus"];
  label: string;
}> = [
  { value: "student", label: "Student" },
  { value: "working_professional", label: "Working Professional" },
  { value: "career_switcher", label: "Career Switcher" },
];

export function ReserveSeatForm() {
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SeatRequestInput>({
    resolver: zodResolver(seatRequestSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      country: "",
      applicantStatus: undefined,
      collegeName: "",
      message: "",
    },
  });

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      const result = await submitSeatRequestAction(values);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      setDone(true);
      toast.success(result.message ?? "Request received.");
    });
  });

  if (done) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-3xl" aria-hidden>
          🎉
        </p>
        <div className="space-y-2">
          <h2 className="text-[1.15rem] font-semibold tracking-[-0.02em] text-white">
            Thank you!
          </h2>
          <p className="text-[13.5px] leading-6 text-white/55">
            Your request has been received successfully.
          </p>
          <p className="text-[13.5px] leading-6 text-white/55">
            Our team will review your request and contact you soon through your
            email or phone number.
          </p>
          <p className="text-[13.5px] leading-6 text-white/55">
            Please keep an eye on your inbox.
          </p>
          <p className="pt-1 text-[12.5px] leading-5 text-white/40">
            No account is created until approved by the Super Admin.
          </p>
        </div>
        <Link href={AUTH_ROUTES.login} className={authLinkClass}>
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-2.5" noValidate>
      <AuthFormField
        label="Full Name"
        autoComplete="name"
        placeholder="Your full name"
        error={errors.name}
        {...register("name")}
      />
      <AuthFormField
        label="Email Address"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        error={errors.email}
        {...register("email")}
      />
      <AuthFormField
        label="Phone Number"
        type="tel"
        autoComplete="tel"
        placeholder="+91 98765 43210"
        error={errors.phone}
        {...register("phone")}
      />
      <AuthFormField
        label="Country"
        autoComplete="country-name"
        placeholder="India"
        error={errors.country}
        {...register("country")}
      />

      <div className="space-y-1">
        <Label
          htmlFor="applicantStatus"
          className="text-[12.5px] font-medium text-[#3a3f4b]"
        >
          Current Status
        </Label>
        <select
          id="applicantStatus"
          className={cn(
            "flex h-10 w-full rounded-xl border-0 bg-[#f0ece9] px-3 text-[13.5px] text-[#14151a] shadow-none outline-none transition focus-visible:bg-[#ebe6e2] focus-visible:ring-2 focus-visible:ring-[#5f3435]/20",
            errors.applicantStatus &&
              "bg-red-50 focus-visible:bg-red-50 focus-visible:ring-red-400/30"
          )}
          defaultValue=""
          {...register("applicantStatus")}
        >
          <option value="" disabled>
            Select status
          </option>
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {errors.applicantStatus ? (
          <p className="text-[11px] text-red-500" role="alert">
            {errors.applicantStatus.message}
          </p>
        ) : null}
      </div>

      <AuthFormField
        label="College Name (optional)"
        autoComplete="organization"
        placeholder="Your college or university"
        error={errors.collegeName}
        {...register("collegeName")}
      />

      <div className="space-y-1">
        <Label
          htmlFor="message"
          className="text-[12.5px] font-medium text-[#3a3f4b]"
        >
          Message (optional)
        </Label>
        <textarea
          id="message"
          rows={3}
          placeholder="Tell us briefly why you want to join"
          className={cn(
            "w-full resize-none rounded-xl border-0 bg-[#f0ece9] px-3 py-2.5 text-[13.5px] text-[#14151a] placeholder:text-[#6b7285] shadow-none outline-none transition focus-visible:bg-[#ebe6e2] focus-visible:ring-2 focus-visible:ring-[#5f3435]/20",
            errors.message &&
              "bg-red-50 focus-visible:bg-red-50 focus-visible:ring-red-400/30"
          )}
          {...register("message")}
        />
        {errors.message ? (
          <p className="text-[11px] text-red-500" role="alert">
            {errors.message.message}
          </p>
        ) : null}
      </div>

      <Button
        type="submit"
        className={`w-full ${authPrimaryBtnClass}`}
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Submitting…
          </>
        ) : (
          "Request Access"
        )}
      </Button>
    </form>
  );
}
