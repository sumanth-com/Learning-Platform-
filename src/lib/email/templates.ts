import { firstNameFrom, renderEmailLayout } from "@/lib/email/layout";
import { getBrand } from "@/lib/email/env";

export type PersonEmailProps = {
  firstName?: string | null;
  email?: string | null;
  fullName?: string | null;
};

function nameOf(props: PersonEmailProps) {
  return firstNameFrom(props.fullName ?? props.firstName, props.email);
}

export function passwordResetEmailHtml(
  props: PersonEmailProps & { resetUrl: string; expiresInMinutes?: number }
) {
  const brand = getBrand();
  const mins = props.expiresInMinutes ?? 60;
  return renderEmailLayout({
    preview: `Reset your ${brand.name} password`,
    title: "Reset your password",
    firstName: nameOf(props),
    bodyHtml: `
      <p style="margin:0 0 12px;">We received a request to reset the password for your ${brand.name} account.</p>
      <p style="margin:0;">Click the button below to securely create a new password.</p>
    `,
    ctaLabel: "Reset Password",
    ctaUrl: props.resetUrl,
    footerNote: `
      <p style="margin:0 0 10px;">This link expires in <strong>${mins} minutes</strong> and can only be used once.</p>
      <p style="margin:0;">If you didn't request this, you can safely ignore this email. Your password will stay the same.</p>
    `,
  });
}

export function verifyEmailHtml(
  props: PersonEmailProps & { verifyUrl: string; expiresInHours?: number }
) {
  const brand = getBrand();
  const hours = props.expiresInHours ?? 24;
  return renderEmailLayout({
    preview: `Verify your email for ${brand.name}`,
    title: `Welcome to ${brand.name}`,
    firstName: nameOf(props),
    bodyHtml: `
      <p style="margin:0 0 12px;">Thanks for joining ${brand.name}. Confirm your email so we know it's really you.</p>
      <p style="margin:0;">Click below to verify your address and start learning.</p>
    `,
    ctaLabel: "Verify Email",
    ctaUrl: props.verifyUrl,
    footerNote: `
      <p style="margin:0 0 10px;">This link expires in <strong>${hours} hours</strong>.</p>
      <p style="margin:0;">If you didn't create an account, you can ignore this message.</p>
    `,
  });
}

export function welcomeEmailHtml(props: PersonEmailProps) {
  const brand = getBrand();
  return renderEmailLayout({
    preview: `You're in — welcome to ${brand.name}`,
    title: `Welcome to ${brand.name}`,
    firstName: nameOf(props),
    bodyHtml: `
      <p style="margin:0 0 12px;">Your account is ready. Explore roadmaps, projects, certifications, and your AI mentor — all in one place.</p>
      <p style="margin:0;">We're glad you're here.</p>
    `,
    ctaLabel: "Open dashboard",
    ctaUrl: `${brand.appUrl}/dashboard`,
  });
}

export function invitationEmailHtml(
  props: PersonEmailProps & {
    inviteUrl: string;
    inviterName: string;
  }
) {
  const brand = getBrand();
  const inviter = props.inviterName.trim() || "A teammate";
  return renderEmailLayout({
    preview: `${inviter} invited you to ${brand.name}`,
    title: "You're invited",
    firstName: nameOf(props),
    bodyHtml: `
      <p style="margin:0 0 12px;"><strong>${inviter}</strong> invited you to join ${brand.name}.</p>
      <p style="margin:0;">Accept the invite to create your account and get started.</p>
    `,
    ctaLabel: "Accept invitation",
    ctaUrl: props.inviteUrl,
    footerNote: `<p style="margin:0;">If you weren't expecting this invite, you can ignore this email.</p>`,
  });
}

/** Branded seat-approval / activate-account email. */
export function seatApprovedEmailHtml(
  props: PersonEmailProps & { activateUrl: string; expiresInHours?: number }
) {
  const brand = getBrand();
  const hours = props.expiresInHours ?? 24;
  const support = "support@suprabase.com";
  return renderEmailLayout({
    preview: `Your seat is ready on ${brand.name}`,
    title: `Welcome to ${brand.name}`,
    firstName: nameOf(props),
    bodyHtml: `
      <p style="margin:0 0 12px;">Your seat request has been approved.</p>
      <p style="margin:0;">Click below to activate your account and set your password.</p>
    `,
    ctaLabel: "Activate Account",
    ctaUrl: props.activateUrl,
    footerNote: `
      <p style="margin:0 0 10px;">This link expires in <strong>${hours} hours</strong> and can only be used once.</p>
      <p style="margin:0;">Need help? <a href="mailto:${support}" style="color:#e56b68;text-decoration:none;">${support}</a></p>
    `,
  });
}

export function teamInviteEmailHtml(
  props: PersonEmailProps & {
    inviteUrl: string;
    inviterName: string;
    teamName: string;
  }
) {
  const brand = getBrand();
  const inviter = props.inviterName.trim() || "A teammate";
  const team = props.teamName.trim() || "their team";
  return renderEmailLayout({
    preview: `${inviter} invited you to ${team} on ${brand.name}`,
    title: `Join ${team}`,
    firstName: nameOf(props),
    bodyHtml: `
      <p style="margin:0 0 12px;"><strong>${inviter}</strong> invited you to <strong>${team}</strong> on ${brand.name}.</p>
      <p style="margin:0;">Join the team to collaborate on learning and projects.</p>
    `,
    ctaLabel: "Join team",
    ctaUrl: props.inviteUrl,
  });
}

export function certificateEarnedEmailHtml(
  props: PersonEmailProps & {
    certificateTitle: string;
    certificateUrl: string;
  }
) {
  const brand = getBrand();
  const cert = props.certificateTitle.trim() || "your certification";
  return renderEmailLayout({
    preview: `You earned ${cert} on ${brand.name}`,
    title: "Certificate earned",
    firstName: nameOf(props),
    bodyHtml: `
      <p style="margin:0 0 12px;">Congratulations — you passed <strong>${cert}</strong>.</p>
      <p style="margin:0;">Your verified ${brand.name} certificate is ready to share.</p>
    `,
    ctaLabel: "View certificate",
    ctaUrl: props.certificateUrl,
  });
}

export function assessmentPassedEmailHtml(
  props: PersonEmailProps & {
    assessmentTitle: string;
    score: number;
    resultsUrl: string;
  }
) {
  const brand = getBrand();
  const title = props.assessmentTitle.trim() || "your assessment";
  return renderEmailLayout({
    preview: `You passed ${title} (${props.score}%)`,
    title: "Assessment passed",
    firstName: nameOf(props),
    bodyHtml: `
      <p style="margin:0 0 12px;">Nice work — you passed <strong>${title}</strong> with a score of <strong>${props.score}%</strong>.</p>
      <p style="margin:0;">Review your results and keep building momentum.</p>
    `,
    ctaLabel: "View results",
    ctaUrl: props.resultsUrl,
  });
}
