"use client";

import type { FieldError } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface AuthFormFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: FieldError;
  hint?: string;
}

/**
 * Reusable labeled input with validation message for auth forms.
 */
export function AuthFormField({
  id,
  label,
  error,
  hint,
  className,
  ...props
}: AuthFormFieldProps) {
  const fieldId = id ?? props.name;

  return (
    <div className="space-y-1">
      <Label
        htmlFor={fieldId}
        className="text-[12.5px] font-medium text-[#3a3f4b]"
      >
        {label}
      </Label>
      <Input
        id={fieldId}
        aria-invalid={Boolean(error)}
        aria-describedby={
          error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined
        }
        className={cn(
          "h-10 rounded-xl border-[#e2e7ef] bg-[#f4f6fa] px-3 text-[13.5px] text-[#14151a] placeholder:text-[#9aa3b2] shadow-none transition focus-visible:border-[#c9d2e0] focus-visible:bg-white focus-visible:ring-[#5f3435]/25",
          error &&
            "border-red-400/80 focus-visible:border-red-400 focus-visible:ring-red-400/30",
          className
        )}
        {...props}
      />
      {hint && !error ? (
        <p id={`${fieldId}-hint`} className="text-[11px] text-[#8b93a3]">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p
          id={`${fieldId}-error`}
          className="text-[11px] text-red-500"
          role="alert"
        >
          {error.message}
        </p>
      ) : null}
    </div>
  );
}
