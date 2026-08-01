"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Check, ChevronDown, Loader2, Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AuthFormField } from "@/components/auth/auth-form-field";
import { authPrimaryBtnClass } from "@/components/auth/auth-shell";
import { submitSeatRequestAction } from "@/features/auth/actions/seat-actions";
import {
  seatRequestSchema,
  type SeatRequestInput,
} from "@/features/auth/schemas/auth-schemas";
import { AUTH_ROUTES } from "@/features/auth/constants";
import {
  DEFAULT_PHONE_COUNTRY_ISO,
  PHONE_COUNTRIES,
  digitsOnly,
  getPhoneCountry,
} from "@/lib/phone-countries";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

function RequestSubmittedSuccess() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="flex flex-col items-center px-1 py-2 text-center"
      initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: EASE }}
    >
      <div className="relative mb-5 flex h-[4.25rem] w-[4.25rem] items-center justify-center">
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-full bg-[#5f3435]/10"
          initial={reduceMotion ? false : { scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: EASE }}
        />
        <motion.span
          aria-hidden
          className="absolute inset-[6px] rounded-full border border-[#5f3435]/15"
          initial={reduceMotion ? false : { scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.55, delay: 0.05, ease: EASE }}
        />
        <motion.div
          className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[#5f3435] text-white shadow-[0_12px_28px_-12px_rgba(95,52,53,0.65)]"
          initial={reduceMotion ? false : { scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.08, ease: EASE }}
        >
          <motion.span
            initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.22 }}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              aria-hidden
            >
              <motion.path
                d="M5 13l4 4L19 7"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={
                  reduceMotion ? { pathLength: 1 } : { pathLength: 0 }
                }
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.45, delay: 0.28, ease: EASE }}
              />
            </svg>
          </motion.span>
        </motion.div>
      </div>

      <motion.div
        className="space-y-2"
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.18, ease: EASE }}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#5f3435]/80">
          Request received
        </p>
        <h2 className="text-[1.35rem] font-semibold tracking-[-0.03em] text-[#14151a]">
          We&apos;ll review your application
        </h2>
        <p className="mx-auto max-w-[20rem] text-[13.5px] leading-6 text-[#5a6170]">
          Thanks for requesting access. Our team will review your details and
          reach out by email if you&apos;re approved.
        </p>
      </motion.div>

      <motion.div
        className="mt-5 w-full rounded-2xl bg-[#f5f1ee] px-4 py-3.5 text-left"
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.28, ease: EASE }}
      >
        <div className="flex gap-3">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-[#5f3435] shadow-sm">
            <Mail className="h-3.5 w-3.5" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="text-[12.5px] font-semibold text-[#14151a]">
              Watch your inbox
            </p>
            <p className="mt-0.5 text-[12px] leading-5 text-[#6b7285]">
              If approved, you&apos;ll get an activation link to set your
              password and enter the portal. No account is created until then.
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="mt-6 w-full"
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.38, ease: EASE }}
      >
        <Link
          href={AUTH_ROUTES.login}
          className={cn("inline-flex w-full items-center justify-center", authPrimaryBtnClass)}
        >
          Back to sign in
        </Link>
        <p className="mt-3 text-[12px] leading-5 text-[#8b93a3]">
          Already invited?{" "}
          <Link
            href={AUTH_ROUTES.login}
            className="font-medium text-[#5f3435] underline-offset-2 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
}

export function ReserveSeatForm({
  onSubmitted,
  submitted = false,
}: {
  onSubmitted?: () => void;
  submitted?: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(submitted);
  const [codeOpen, setCodeOpen] = useState(false);
  const codeWrapRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<SeatRequestInput>({
    resolver: zodResolver(seatRequestSchema),
    defaultValues: {
      name: "",
      email: "",
      countryCode: DEFAULT_PHONE_COUNTRY_ISO,
      phone: "",
    },
  });

  const countryCode = useWatch({ control, name: "countryCode" });
  const selected = useMemo(
    () =>
      getPhoneCountry(countryCode) ??
      getPhoneCountry(DEFAULT_PHONE_COUNTRY_ISO)!,
    [countryCode]
  );

  useEffect(() => {
    if (!codeOpen) return;
    const onPointer = (event: MouseEvent) => {
      if (!codeWrapRef.current?.contains(event.target as Node)) {
        setCodeOpen(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setCodeOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [codeOpen]);

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      const result = await submitSeatRequestAction(values);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      setDone(true);
      onSubmitted?.();
    });
  });

  if (done || submitted) {
    return <RequestSubmittedSuccess />;
  }

  const phoneReg = register("phone");

  return (
    <form onSubmit={onSubmit} className="space-y-4 pt-1" noValidate>
      <input type="hidden" {...register("countryCode")} />

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

      <div className="space-y-1">
        <Label
          htmlFor="phone"
          className="text-[12.5px] font-medium text-[#3a3f4b]"
        >
          Contact Number
        </Label>
        <div className="flex gap-2">
          <div ref={codeWrapRef} className="relative shrink-0">
            <button
              type="button"
              aria-label="Country code"
              aria-haspopup="listbox"
              aria-expanded={codeOpen}
              onClick={() => setCodeOpen((open) => !open)}
              className={cn(
                "inline-flex h-10 w-[7.75rem] items-center justify-between gap-1 rounded-xl bg-[#f0ece9] px-2.5 text-[12.5px] font-medium text-[#14151a] outline-none transition hover:bg-[#ebe6e2] focus-visible:ring-2 focus-visible:ring-[#5f3435]/20",
                errors.countryCode &&
                  "bg-red-50 focus-visible:ring-red-400/30",
                codeOpen && "ring-2 ring-[#5f3435]/20"
              )}
            >
              <span className="truncate">
                {selected.flag} +{selected.dial}
              </span>
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 shrink-0 text-[#6b7285] transition-transform",
                  codeOpen && "rotate-180"
                )}
              />
            </button>

            {codeOpen ? (
              <ul
                role="listbox"
                aria-label="Country codes"
                className="absolute left-0 top-[calc(100%+6px)] z-50 max-h-52 w-[13.5rem] overflow-y-auto rounded-xl border border-[#e8e2dd] bg-white py-1.5 shadow-[0_16px_40px_-20px_rgba(40,30,40,0.45)]"
              >
                {PHONE_COUNTRIES.map((country) => {
                  const active = country.iso === selected.iso;
                  return (
                    <li key={country.iso} role="option" aria-selected={active}>
                      <button
                        type="button"
                        className={cn(
                          "flex w-full items-center gap-2 px-3 py-2 text-left text-[12.5px] text-[#14151a] transition hover:bg-[#f5f1ee]",
                          active && "bg-[#f0ece9] font-medium"
                        )}
                        onClick={() => {
                          setValue("countryCode", country.iso, {
                            shouldValidate: true,
                            shouldDirty: true,
                          });
                          setValue("phone", "", { shouldValidate: false });
                          setCodeOpen(false);
                        }}
                      >
                        <span className="w-5 shrink-0 text-center">
                          {country.flag}
                        </span>
                        <span className="min-w-[2.75rem] tabular-nums text-[#3a3f4b]">
                          +{country.dial}
                        </span>
                        <span className="min-w-0 flex-1 truncate text-[#6b7285]">
                          {country.name}
                        </span>
                        {active ? (
                          <Check className="h-3.5 w-3.5 shrink-0 text-[#5f3435]" />
                        ) : null}
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>

          <Input
            id="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            placeholder={`${selected.digits}-digit number`}
            maxLength={selected.digits}
            aria-invalid={Boolean(errors.phone)}
            className={cn(
              "h-10 flex-1 rounded-xl border-0 bg-[#f0ece9] px-3 text-[13.5px] text-[#14151a] placeholder:text-[#6b7285] shadow-none transition focus-visible:bg-[#ebe6e2] focus-visible:ring-2 focus-visible:ring-[#5f3435]/20",
              errors.phone &&
                "bg-red-50 focus-visible:bg-red-50 focus-visible:ring-red-400/30"
            )}
            {...phoneReg}
            onChange={(e) => {
              const next = digitsOnly(e.target.value).slice(0, selected.digits);
              e.target.value = next;
              void phoneReg.onChange(e);
            }}
          />
        </div>
        <p className="text-[11px] text-[#8b93a3]">
          {selected.name} (+{selected.dial}) · enter {selected.digits} digits
        </p>
        {errors.countryCode ? (
          <p className="text-[11px] text-red-500" role="alert">
            {errors.countryCode.message}
          </p>
        ) : null}
        {errors.phone ? (
          <p className="text-[11px] text-red-500" role="alert">
            {errors.phone.message}
          </p>
        ) : null}
      </div>

      <Button
        type="submit"
        className={`mt-1 w-full ${authPrimaryBtnClass}`}
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
