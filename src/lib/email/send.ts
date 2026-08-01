import { Resend } from "resend";
import { getBrand, getEmailEnv, isCustomEmailEnabled } from "@/lib/email/env";
import {
  assessmentPassedEmailHtml,
  certificateEarnedEmailHtml,
  invitationEmailHtml,
  passwordResetEmailHtml,
  seatApprovedEmailHtml,
  teamInviteEmailHtml,
  verifyEmailHtml,
  welcomeEmailHtml,
} from "@/lib/email/templates";
import { logAuthEvent } from "@/lib/auth/audit";

export type SendEmailResult =
  | { ok: true; id?: string }
  | { ok: false; error: string; skipped?: boolean };

function getResend() {
  const { apiKey } = getEmailEnv();
  if (!apiKey) return null;
  return new Resend(apiKey);
}

async function sendHtmlEmail(input: {
  to: string;
  subject: string;
  html: string;
  tags?: { name: string; value: string }[];
  replyTo?: string;
}): Promise<SendEmailResult> {
  const resend = getResend();
  const { from, replyTo: defaultReplyTo } = getEmailEnv();
  const replyTo = input.replyTo || defaultReplyTo;

  if (!resend) {
    return {
      ok: false,
      skipped: true,
      error: "RESEND_API_KEY is not configured.",
    };
  }

  try {
    const { data, error } = await resend.emails.send({
      from,
      to: input.to,
      subject: input.subject,
      html: input.html,
      replyTo,
      tags: input.tags,
    });

    if (error) {
      await logAuthEvent("email_send_failed", {
        to: input.to,
        subject: input.subject,
        error: error.message,
      });
      return { ok: false, error: error.message };
    }

    await logAuthEvent("email_sent", {
      to: input.to,
      subject: input.subject,
      id: data?.id,
    });

    return { ok: true, id: data?.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to send email";
    await logAuthEvent("email_send_failed", {
      to: input.to,
      subject: input.subject,
      error: message,
    });
    return { ok: false, error: message };
  }
}

export async function sendPasswordResetEmail(input: {
  to: string;
  resetUrl: string;
  firstName?: string | null;
  fullName?: string | null;
}) {
  const brand = getBrand();
  return sendHtmlEmail({
    to: input.to,
    subject: `Reset your ${brand.name} password`,
    html: passwordResetEmailHtml({
      email: input.to,
      firstName: input.firstName,
      fullName: input.fullName,
      resetUrl: input.resetUrl,
      expiresInMinutes: 60,
    }),
    tags: [{ name: "category", value: "password_reset" }],
  });
}

export async function sendVerificationEmail(input: {
  to: string;
  verifyUrl: string;
  firstName?: string | null;
  fullName?: string | null;
}) {
  const brand = getBrand();
  return sendHtmlEmail({
    to: input.to,
    subject: `Verify your email for ${brand.name}`,
    html: verifyEmailHtml({
      email: input.to,
      firstName: input.firstName,
      fullName: input.fullName,
      verifyUrl: input.verifyUrl,
    }),
    tags: [{ name: "category", value: "email_verification" }],
  });
}

export async function sendWelcomeEmail(input: {
  to: string;
  firstName?: string | null;
  fullName?: string | null;
}) {
  const brand = getBrand();
  return sendHtmlEmail({
    to: input.to,
    subject: `Welcome to ${brand.name}`,
    html: welcomeEmailHtml({
      email: input.to,
      firstName: input.firstName,
      fullName: input.fullName,
    }),
    tags: [{ name: "category", value: "welcome" }],
  });
}

export async function sendInvitationEmail(input: {
  to: string;
  inviteUrl: string;
  inviterName: string;
  firstName?: string | null;
}) {
  const brand = getBrand();
  return sendHtmlEmail({
    to: input.to,
    subject: `${input.inviterName} invited you to ${brand.name}`,
    html: invitationEmailHtml(input),
    tags: [{ name: "category", value: "invitation" }],
  });
}

export async function sendSeatApprovedEmail(input: {
  to: string;
  activateUrl: string;
  firstName?: string | null;
  fullName?: string | null;
}) {
  const brand = getBrand();
  return sendHtmlEmail({
    to: input.to,
    subject: `Welcome to ${brand.name} — your seat is ready`,
    html: seatApprovedEmailHtml({
      email: input.to,
      firstName: input.firstName,
      fullName: input.fullName,
      activateUrl: input.activateUrl,
      expiresInHours: 24,
    }),
    tags: [{ name: "category", value: "seat_approved" }],
  });
}

export async function sendTeamInviteEmail(input: {
  to: string;
  inviteUrl: string;
  inviterName: string;
  teamName: string;
  firstName?: string | null;
}) {
  const brand = getBrand();
  return sendHtmlEmail({
    to: input.to,
    subject: `Join ${input.teamName} on ${brand.name}`,
    html: teamInviteEmailHtml(input),
    tags: [{ name: "category", value: "team_invite" }],
  });
}

export async function sendCertificateEarnedEmail(input: {
  to: string;
  certificateTitle: string;
  certificateUrl: string;
  firstName?: string | null;
  fullName?: string | null;
}) {
  return sendHtmlEmail({
    to: input.to,
    subject: `You earned ${input.certificateTitle}`,
    html: certificateEarnedEmailHtml(input),
    tags: [{ name: "category", value: "certificate_earned" }],
  });
}

export async function sendAssessmentPassedEmail(input: {
  to: string;
  assessmentTitle: string;
  score: number;
  resultsUrl: string;
  firstName?: string | null;
  fullName?: string | null;
}) {
  return sendHtmlEmail({
    to: input.to,
    subject: `You passed ${input.assessmentTitle}`,
    html: assessmentPassedEmailHtml(input),
    tags: [{ name: "category", value: "assessment_passed" }],
  });
}

export async function sendHelpReportEmail(input: {
  reporterEmail: string;
  reporterName?: string | null;
  category: string;
  subject: string;
  message: string;
}) {
  const brand = getBrand();
  const { support } = getEmailEnv();
  const name = input.reporterName?.trim() || "Learner";
  const category = input.category.trim() || "General";
  const subject = input.subject.trim();
  const message = input.message.trim();
  const safe = (value: string) =>
    value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  return sendHtmlEmail({
    to: support,
    replyTo: input.reporterEmail,
    subject: `[Help Report] ${category}: ${subject}`,
    html: `
      <div style="font-family:Segoe UI,Arial,sans-serif;line-height:1.6;color:#18181b;">
        <h2 style="margin:0 0 12px;font-size:18px;">New help report</h2>
        <p style="margin:0 0 8px;"><strong>From:</strong> ${safe(name)} &lt;${safe(input.reporterEmail)}&gt;</p>
        <p style="margin:0 0 8px;"><strong>Category:</strong> ${safe(category)}</p>
        <p style="margin:0 0 16px;"><strong>Subject:</strong> ${safe(subject)}</p>
        <div style="padding:14px 16px;border:1px solid #e4e4e7;border-radius:12px;background:#fafafa;white-space:pre-wrap;">${safe(message)}</div>
        <p style="margin:16px 0 0;font-size:12px;color:#71717a;">Sent from ${brand.name} Help</p>
      </div>
    `,
    tags: [{ name: "category", value: "help_report" }],
  });
}

export { isCustomEmailEnabled };
