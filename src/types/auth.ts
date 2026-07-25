import type { User } from "@supabase/supabase-js";
import type { ProfileRow } from "@/types/database";

export type AuthActionSuccess<T = undefined> = {
  success: true;
  message?: string;
  data?: T;
};

export type AuthActionFailure<T = undefined> = {
  success: false;
  error: string;
  data?: T;
};

export type AuthActionResult<T = undefined> =
  | AuthActionSuccess<T>
  | AuthActionFailure<T>;

export interface AuthSessionUser {
  user: User;
  profile: ProfileRow | null;
}
