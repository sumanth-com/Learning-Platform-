"use client";

import { useMemo, useState } from "react";
import { Check, Eye, EyeOff, X } from "lucide-react";
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
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  autoComplete?: string;
  showStrength?: boolean;
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
    <div className="space-y-1">
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
          aria-invalid={Boolean(error)}
          className={cn(
            "flex h-10 w-full rounded-xl border border-[#e2e7ef] bg-[#f4f6fa] px-3 py-2 pr-10 text-[13.5px] text-[#14151a] placeholder:text-[#9aa3b2] shadow-none transition focus-visible:border-[#c9d2e0] focus-visible:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5f3435]/25",
            error &&
              "border-red-400/80 focus-visible:border-red-400 focus-visible:ring-red-400/30"
          )}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-[#8b93a3] transition hover:bg-white hover:text-[#3a3f4b]"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>

      {showStrength && value ? (
        <div className="space-y-1.5 pt-0.5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex h-1 flex-1 gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    "h-full flex-1 rounded-full bg-[#e8ecf3]",
                    i < score && meterColor
                  )}
                />
              ))}
            </div>
            <span className="text-[10.5px] font-medium text-[#8b93a3]">
              {labelStrength}
            </span>
          </div>
          <ul className="grid grid-cols-2 gap-x-2 gap-y-0.5">
            {checks.map((rule) => (
              <li
                key={rule.id}
                className={cn(
                  "flex items-center gap-1 text-[10.5px]",
                  rule.passed ? "text-emerald-600" : "text-[#9aa3b2]"
                )}
              >
                {rule.passed ? (
                  <Check className="h-2.5 w-2.5 shrink-0" />
                ) : (
                  <X className="h-2.5 w-2.5 shrink-0" />
                )}
                {rule.label}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {error ? (
        <p className="text-[11px] text-red-500" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
