import { getBrand } from "@/lib/email/env";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export type EmailLayoutProps = {
  preview: string;
  title: string;
  firstName: string;
  bodyHtml: string;
  ctaLabel?: string;
  ctaUrl?: string;
  footerNote?: string;
};

/** Shared Stripe/Linear-style transactional email chrome. */
export function renderEmailLayout({
  preview,
  title,
  firstName,
  bodyHtml,
  ctaLabel,
  ctaUrl,
  footerNote,
}: EmailLayoutProps): string {
  const brand = getBrand();
  const name = escapeHtml(firstName.trim() || "there");
  const safeTitle = escapeHtml(title);
  const safePreview = escapeHtml(preview);
  const safeCta = ctaLabel ? escapeHtml(ctaLabel) : "";
  const safeUrl = ctaUrl ? escapeHtml(ctaUrl) : "";
  const year = new Date().getFullYear();

  const ctaBlock =
    safeCta && safeUrl
      ? `
      <tr>
        <td style="padding:28px 0 8px;">
          <a href="${safeUrl}"
             style="display:inline-block;background:#4f46e5;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;padding:14px 28px;border-radius:10px;box-shadow:0 8px 24px rgba(79,70,229,0.35);">
            ${safeCta}
          </a>
        </td>
      </tr>
      <tr>
        <td style="padding:12px 0 0;font-size:12px;line-height:1.6;color:#71717a;">
          Or paste this link into your browser:<br/>
          <a href="${safeUrl}" style="color:#818cf8;word-break:break-all;">${safeUrl}</a>
        </td>
      </tr>`
      : "";

  const note = footerNote
    ? `<tr><td style="padding:24px 0 0;font-size:13px;line-height:1.6;color:#a1a1aa;">${footerNote}</td></tr>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light dark" />
  <meta name="supported-color-schemes" content="light dark" />
  <title>${safeTitle}</title>
  <style>
    :root { color-scheme: light dark; }
    @media (prefers-color-scheme: dark) {
      .email-bg { background:#09090b !important; }
      .email-card { background:#18181b !important; border-color:#27272a !important; }
      .email-title { color:#fafafa !important; }
      .email-text { color:#d4d4d8 !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;" class="email-bg">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${safePreview}</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f4f5;padding:32px 16px;" class="email-bg">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;">
          <tr>
            <td style="padding:0 0 20px;text-align:center;">
              <span style="display:inline-flex;align-items:center;gap:10px;text-decoration:none;">
                <span style="display:inline-block;width:36px;height:36px;line-height:36px;text-align:center;border-radius:10px;background:#4f46e5;color:#fff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-weight:700;font-size:14px;">${brand.logoText}</span>
                <span style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:18px;font-weight:650;color:#18181b;" class="email-title">${brand.name}</span>
              </span>
            </td>
          </tr>
          <tr>
            <td style="background:#ffffff;border:1px solid #e4e4e7;border-radius:16px;padding:36px 32px;" class="email-card">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:22px;font-weight:650;color:#18181b;padding:0 0 16px;" class="email-title">
                    ${safeTitle}
                  </td>
                </tr>
                <tr>
                  <td style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:15px;line-height:1.65;color:#3f3f46;" class="email-text">
                    Hello ${name},
                  </td>
                </tr>
                <tr>
                  <td style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:15px;line-height:1.65;color:#3f3f46;padding-top:14px;" class="email-text">
                    ${bodyHtml}
                  </td>
                </tr>
                ${ctaBlock}
                ${note}
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 8px 0;text-align:center;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:12px;line-height:1.7;color:#71717a;">
              <strong style="color:#52525b;">${brand.name}</strong><br/>
              Need help? <a href="mailto:${escapeHtml(brand.supportEmail)}" style="color:#6366f1;text-decoration:none;">${escapeHtml(brand.supportEmail)}</a><br/>
              © ${year} ${brand.name}. All rights reserved.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function firstNameFrom(fullName?: string | null, email?: string | null) {
  const fromName = fullName?.trim().split(/\s+/)[0];
  if (fromName) return fromName;
  const local = email?.split("@")[0]?.trim();
  if (local) {
    const cleaned = local.replace(/[._-]+/g, " ").split(/\s+/)[0];
    if (cleaned) return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }
  return "there";
}
