import { z } from "zod";
import { isStrongPassword } from "@/lib/auth/password-strength";

const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required")
  .email("Enter a valid email address");

const strongPasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password must be at most 72 characters")
  .refine(isStrongPassword, {
    message:
      "Use 8+ characters with uppercase, lowercase, a number, and a special character.",
  });

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

/** @deprecated Public signup removed — kept for type compatibility during migration. */
export const signupSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Full name must be at least 2 characters")
      .max(80, "Full name must be at most 80 characters"),
    email: emailSchema,
    password: strongPasswordSchema,
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const seatRequestSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name must be at most 80 characters"),
  email: emailSchema,
  phone: z
    .string()
    .trim()
    .min(7, "Enter a valid phone number")
    .max(20, "Phone number is too long"),
  country: z
    .string()
    .trim()
    .min(2, "Country is required")
    .max(80, "Country name is too long"),
  applicantStatus: z.enum(
    ["student", "working_professional", "career_switcher"],
    { message: "Select your current status" }
  ),
  collegeName: z
    .string()
    .trim()
    .max(120, "College name is too long")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .trim()
    .max(800, "Message must be at most 800 characters")
    .optional()
    .or(z.literal("")),
});

export const createAccountSchema = z
  .object({
    token: z.string().min(20, "Invalid invitation link"),
    fullName: z
      .string()
      .trim()
      .min(2, "Full name must be at least 2 characters")
      .max(80, "Full name must be at most 80 characters"),
    password: strongPasswordSchema,
    confirmPassword: z.string().min(1, "Confirm your password"),
    acceptTerms: z.boolean().refine((v) => v === true, {
      message: "You must accept the Terms to continue",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    password: strongPasswordSchema,
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type SeatRequestInput = z.infer<typeof seatRequestSchema>;
export type CreateAccountInput = z.infer<typeof createAccountSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
