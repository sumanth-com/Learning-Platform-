export type PasswordRuleId =
  | "length"
  | "upper"
  | "lower"
  | "number"
  | "special";

export type PasswordRule = {
  id: PasswordRuleId;
  label: string;
  test: (password: string) => boolean;
};

export const PASSWORD_RULES: PasswordRule[] = [
  {
    id: "length",
    label: "At least 8 characters",
    test: (p) => p.length >= 8,
  },
  {
    id: "upper",
    label: "One uppercase letter",
    test: (p) => /[A-Z]/.test(p),
  },
  {
    id: "lower",
    label: "One lowercase letter",
    test: (p) => /[a-z]/.test(p),
  },
  {
    id: "number",
    label: "One number",
    test: (p) => /\d/.test(p),
  },
  {
    id: "special",
    label: "One special character",
    test: (p) => /[^A-Za-z0-9]/.test(p),
  },
];

export function getPasswordChecks(password: string) {
  return PASSWORD_RULES.map((rule) => ({
    ...rule,
    passed: rule.test(password),
  }));
}

export function passwordStrengthScore(password: string) {
  return getPasswordChecks(password).filter((r) => r.passed).length;
}

export function isStrongPassword(password: string) {
  return PASSWORD_RULES.every((rule) => rule.test(password));
}

export function passwordStrengthLabel(score: number) {
  if (score <= 0) return "Weak";
  if (score === 1) return "Weak";
  if (score === 2) return "Fair";
  if (score === 3) return "Good";
  if (score === 4) return "Strong";
  return "Very Strong";
}
