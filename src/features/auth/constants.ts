export const AUTH_ROUTES = {
  public: "/public",
  login: "/login",
  signup: "/signup",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  verifyEmail: "/verify-email",
  callback: "/auth/callback",
  dashboard: "/dashboard",
  profile: "/profile",
} as const;

/** Routes that require an authenticated session. */
export const PROTECTED_ROUTES = [
  AUTH_ROUTES.dashboard,
  AUTH_ROUTES.profile,
  "/assignments",
  "/practice",
  "/ai-mentor",
  "/resources",
  "/settings",
  "/projects",
  "/interview",
  "/communication",
  "/community",
  "/certifications",
  "/notifications",
  "/notes",
  "/ai-skills",
  "/roadmap",
  "/live",
] as const;

/**
 * Auth pages where authenticated users should be redirected away
 * (except recovery flow on reset-password).
 */
export const AUTH_GUEST_ROUTES = [
  AUTH_ROUTES.login,
  AUTH_ROUTES.signup,
  AUTH_ROUTES.forgotPassword,
  AUTH_ROUTES.verifyEmail,
] as const;

export const AUTH_MESSAGES = {
  loginSuccess: "Welcome back to SupraBase.",
  signupSuccess:
    "Account created. Check your email to verify your address before signing in.",
  signupNeedsVerification:
    "We sent a verification link to your email. Verify it, then sign in.",
  accountExists:
    "An account with this email already exists. Sign in, or use Forgot password if you need a reset.",
  forgotPasswordSuccess:
    "If an account exists for that email, a reset link has been sent.",
  resetPasswordSuccess: "Your password has been updated. You can sign in now.",
  changePasswordSuccess: "Your password has been updated.",
  logoutSuccess: "You have been signed out.",
  emailVerified: "Email verified successfully. You are signed in.",
  unauthorized: "You must be signed in to continue.",
  confirmationResent:
    "Verification email sent. Check your inbox and spam folder.",
  invalidCredentials:
    "Incorrect email or password. Reset your password if you've forgotten it.",
  emailNotVerified:
    "Your email address has not been verified yet. Check your inbox, or resend the verification email below.",
} as const;
