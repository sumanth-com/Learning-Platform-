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
      <p style="margin:0;">Click the button below to create a new password.</p>
    `,
    ctaLabel: "Reset Password",
    ctaUrl: props.resetUrl,
    footerNote: `
      <p style="margin:0 0 10px;">This link expires in <strong>${mins} minutes</strong> and can only be used once.</p>
      <p style="margin:0;">If you did not request this, you can safely ignore this email. Your password will stay the same.</p>
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
    title: "Verify your email",
    firstName: nameOf(props),
    bodyHtml: `
      <p style="margin:0 0 12px;">Confirm your email address to finish setting up your ${brand.name} account.</p>
      <p style="margin:0;">Click the button below to verify and continue.</p>
    `,
    ctaLabel: "Verify Email",
    ctaUrl: props.verifyUrl,
    footerNote: `
      <p style="margin:0 0 10px;">This link expires in <strong>${hours} hours</strong>.</p>
      <p style="margin:0;">If you did not create an account, you can safely ignore this email.</p>
    `,
  });
}

export function welcomeEmailHtml(props: PersonEmailProps) {
  const brand = getBrand();
  return renderEmailLayout({
    preview: `Welcome to ${brand.name}`,
    title: `Welcome to ${brand.name}`,
    firstName: nameOf(props),
    bodyHtml: `
      <p style="margin:0 0 12px;">Your account is ready. Explore roadmaps, projects, certifications, and your AI mentor in one workspace.</p>
      <p style="margin:0;">Open your dashboard to get started.</p>
    `,
    ctaLabel: "Open Dashboard",
    ctaUrl: `${brand.appUrl}/dashboard`,
    footerNote: `
      <p style="margin:0;">Thank you,<br/>The ${brand.name} Team</p>
    `,
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
    title: `You are invited to ${brand.name}`,
    firstName: nameOf(props),
    bodyHtml: `
      <p style="margin:0 0 12px;"><strong>${inviter}</strong> invited you to join ${brand.name}.</p>
      <p style="margin:0;">Accept the invitation to create your account and access your learning workspace.</p>
    `,
    ctaLabel: "Accept Invitation",
    ctaUrl: props.inviteUrl,
    footerNote: `<p style="margin:0;">If you did not expect this invitation, you can safely ignore this email.</p>`,
  });
}

/** Account approved / create password email. */
export function seatApprovedEmailHtml(
  props: PersonEmailProps & { activateUrl: string; expiresInHours?: number }
) {
  const brand = getBrand();
  const hours = props.expiresInHours ?? 24;
  return renderEmailLayout({
    preview: `Your access request has been approved on ${brand.name}`,
    title: `Welcome to ${brand.name}`,
    firstName: nameOf(props),
    bodyHtml: `
      <p style="margin:0 0 12px;">Your access request has been approved.</p>
      <p style="margin:0 0 12px;">You can now create your password and access your learning workspace.</p>
      <p style="margin:0;">Click the button below to continue.</p>
    `,
    ctaLabel: "Create Password",
    ctaUrl: props.activateUrl,
    footerNote: `
      <p style="margin:0 0 10px;">This link works once and expires in <strong>${hours} hours</strong>.</p>
      <p style="margin:0 0 10px;">If you did not request this invitation, you can safely ignore this email.</p>
      <p style="margin:0;">Thank you,<br/>The ${brand.name} Team</p>
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
    ctaLabel: "Join Team",
    ctaUrl: props.inviteUrl,
    footerNote: `<p style="margin:0;">If you did not expect this invitation, you can safely ignore this email.</p>`,
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
    title: "Certificate ready",
    firstName: nameOf(props),
    bodyHtml: `
      <p style="margin:0 0 12px;">Congratulations. You passed <strong>${cert}</strong>.</p>
      <p style="margin:0;">Your verified ${brand.name} certificate is ready to download and share.</p>
    `,
    ctaLabel: "View Certificate",
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
      <p style="margin:0 0 12px;">Great news. You passed <strong>${title}</strong> with a score of <strong>${props.score}%</strong>.</p>
      <p style="margin:0;">Review your results and continue building your skills.</p>
    `,
    ctaLabel: "View Results",
    ctaUrl: props.resultsUrl,
  });
}
