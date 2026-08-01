export {
  loginAction,
  prepareLoginAction,
  recordLoginSuccessAction,
  signupAction,
  forgotPasswordAction,
  resetPasswordAction,
  changePasswordAction,
  resendConfirmationAction,
  logoutAction,
  getCurrentUser,
} from "@/features/auth/actions/auth-actions";

export {
  loginSchema,
  signupSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@/features/auth/schemas/auth-schemas";

export type {
  LoginInput,
  SignupInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from "@/features/auth/schemas/auth-schemas";

export { AUTH_ROUTES, AUTH_MESSAGES, PROTECTED_ROUTES, AUTH_GUEST_ROUTES } from "@/features/auth/constants";
