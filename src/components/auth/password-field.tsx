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
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium text-zinc-200">
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
            "flex h-10 w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-3 py-2 pr-10 text-sm text-zinc-100 placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
            error && "border-red-500/70 focus-visible:ring-red-500"
          )}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-zinc-500 transition hover:text-zinc-200"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>

      {showStrength && value ? (
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between gap-3">
            <div className="flex h-1.5 flex-1 gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    "h-full flex-1 rounded-full bg-zinc-800",
                    i < score && meterColor
                  )}
                />
              ))}
            </div>
            <span className="text-[11px] font-medium text-zinc-400">
              {labelStrength}
            </span>
          </div>
          <ul className="grid gap-1.5 sm:grid-cols-2">
            {checks.map((rule) => (
              <li
                key={rule.id}
                className={cn(
                  "flex items-center gap-1.5 text-[11px]",
                  rule.passed ? "text-emerald-400" : "text-zinc-500"
                )}
              >
                {rule.passed ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <X className="h-3 w-3" />
                )}
                {rule.label}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {error ? (
        <p className="text-xs text-red-400" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
