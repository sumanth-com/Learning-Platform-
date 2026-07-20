import type { ProfileRow, UserRole } from "@/types/database";

export type { ProfileRow, UserRole };

export interface AuthFormState {
  isSubmitting: boolean;
  error: string | null;
}
