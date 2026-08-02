"use client";

import { useMemo, useState } from "react";
import { Check, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getPasswordChecks,
  passwordStrengthLabel,
  passwordStrengthScore,
} from "@/lib/auth/password-strength";

export function PasswordField({
  id,
  label,
  value,
  onChange,
  error,
  placeholder,
  autoComplete = "new-password",
  showStrength = true,
  matchStatus = null,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  autoComplete?: string;
  showStrength?: boolean;
  /** Live confirm-password feedback */
  matchStatus?: "match" | "mismatch" | null;
}) {
  const [visible, setVisible] = useState(false);
  const checks = useMemo(() => getPasswordChecks(value), [value]);
  const score = passwordStrengthScore(value);
  const labelStrength = passwordStrengthLabel(score);

  const meterColor =
    score <= 1
      ? "bg-rose-500"
      : score === 2
        ? "bg-amber-500"
        : score === 3
          ? "bg-yellow-400"
          : score === 4
            ? "bg-emerald-400"
            : "bg-emerald-500";

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-[12.5px] font-medium text-[#3a3f4b]">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          placeholder={placeholder}
          aria-invalid={Boolean(error) || matchStatus === "mismatch"}
          aria-describedby={
            showStrength && value
              ? `${id}-strength ${id}-rules`
              : matchStatus
                ? `${id}-match`
                : undefined
          }
          className={cn(
            "flex h-10 w-full rounded-xl border-0 bg-[#f0ece9] px-3 py-2 pr-11 text-[13.5px] text-[#14151a] placeholder:text-[#6b7285] shadow-none transition duration-200 focus-visible:bg-[#ebe6e2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5f3435]/20",
            (error || matchStatus === "mismatch") &&
              "bg-red-50 focus-visible:bg-red-50 focus-visible:ring-red-400/30"
          )}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-[#8b93a3] transition duration-200 hover:bg-white/80 hover:text-[#3a3f4b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5f3435]/25"
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
        >
          <span className="relative block h-4 w-4">
            <Eye
              className={cn(
                "absolute inset-0 h-4 w-4 transition duration-200",
                visible ? "scale-75 opacity-0" : "scale-100 opacity-100"
              )}
              aria-hidden
            />
            <EyeOff
              className={cn(
                "absolute inset-0 h-4 w-4 transition duration-200",
                visible ? "scale-100 opacity-100" : "scale-75 opacity-0"
              )}
              aria-hidden
            />
          </span>
        </button>
      </div>

      {showStrength && value ? (
        <div className="space-y-2 pt-0.5" id={`${id}-strength`}>
          <div className="flex items-center justify-between gap-3">
            <div
              className="flex h-1.5 flex-1 gap-1"
              role="meter"
              aria-valuemin={0}
              aria-valuemax={5}
              aria-valuenow={score}
              aria-label={`Password strength: ${labelStrength}`}
            >
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    "h-full flex-1 rounded-full bg-[#e8ecf3] transition-all duration-300 ease-out",
                    i < score && meterColor
                  )}
                />
              ))}
            </div>
            <span
              className={cn(
                "min-w-[4.5rem] text-right text-[11px] font-medium transition-colors duration-300",
                score <= 1
                  ? "text-rose-600"
                  : score === 2
                    ? "text-amber-600"
                    : score === 3
                      ? "text-yellow-700"
                      : "text-emerald-600"
              )}
            >
              {labelStrength}
            </span>
          </div>
          <ul
            id={`${id}-rules`}
            className="space-y-1"
            aria-label="Password requirements"
          >
            {checks.map((rule) => (
              <li
                key={rule.id}
                className={cn(
                  "flex items-center gap-2 text-[11.5px] transition-colors duration-200",
                  rule.passed ? "text-emerald-600" : "text-[#9aa3b2]"
                )}
              >
                <span
                  className={cn(
                    "flex h-4 w-4 shrink-0 items-center justify-center rounded-full transition-all duration-200",
                    rule.passed
                      ? "bg-emerald-500/15 text-emerald-600"
                      : "bg-[#e8ecf3] text-[#9aa3b2]"
                  )}
                  aria-hidden
                >
                  <Check
                    className={cn(
                      "h-2.5 w-2.5 transition-transform duration-200",
                      rule.passed ? "scale-100" : "scale-75 opacity-50"
                    )}
                  />
                </span>
                <span>
                  <span className="sr-only">
                    {rule.passed ? "Satisfied: " : "Required: "}
                  </span>
                  {rule.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {matchStatus ? (
        <p
          id={`${id}-match`}
          className={cn(
            "text-[11.5px] font-medium transition-colors duration-200",
            matchStatus === "match" ? "text-emerald-600" : "text-rose-500"
          )}
          role="status"
          aria-live="polite"
        >
          {matchStatus === "match"
            ? "Passwords match"
            : "Passwords do not match"}
        </p>
      ) : null}

      {error ? (
        <p className="text-[11px] text-red-500" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
