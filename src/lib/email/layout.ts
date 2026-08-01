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

/**
 * Centered transactional email chrome — logo, title, body, CTA.
 * Table-based for Outlook / Gmail / Apple Mail compatibility.
 */
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
  const safeLogoUrl = escapeHtml(brand.logoUrl);
  const safeBrand = escapeHtml(brand.name);
  const safeSupport = escapeHtml(brand.supportEmail);
  const year = new Date().getFullYear();

  const ctaBlock =
    safeCta && safeUrl
      ? `
      <tr>
        <td align="center" style="padding:32px 0 8px;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0">
            <tr>
              <td align="center" bgcolor="#d83a32" style="border-radius:12px;background:#d83a32;">
                <a href="${safeUrl}"
                   target="_blank"
                   style="display:inline-block;padding:15px 32px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:15px;font-weight:600;line-height:1;color:#ffffff;text-decoration:none;border-radius:12px;">
                  ${safeCta}
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td align="center" style="padding:16px 8px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:12px;line-height:1.65;color:#71717a;">
          Or copy this link into your browser:<br/>
          <a href="${safeUrl}" style="color:#d83a32;word-break:break-all;text-decoration:underline;">${safeUrl}</a>
        </td>
      </tr>`
      : "";

  const note = footerNote
    ? `<tr><td align="center" style="padding:28px 12px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:13px;line-height:1.65;color:#a1a1aa;">${footerNote}</td></tr>`
    : "";

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light dark" />
  <meta name="supported-color-schemes" content="light dark" />
  <title>${safeTitle}</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td { font-family: Arial, Helvetica, sans-serif !important; }
  </style>
  <![endif]-->
  <style type="text/css">
    :root { color-scheme: light dark; }
    body { margin: 0 !important; padding: 0 !important; }
    img { border: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
    a { color: #d83a32; }
    @media (prefers-color-scheme: dark) {
      .email-bg { background:#0c0c0e !important; }
      .email-card { background:#18181b !important; border-color:#27272a !important; }
      .email-title { color:#fafafa !important; }
      .email-text { color:#d4d4d8 !important; }
      .email-muted { color:#a1a1aa !important; }
      .brand-name { color:#fafafa !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;width:100%;" class="email-bg">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;opacity:0;color:transparent;">
    ${safePreview}
  </div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f4f4f5;width:100%;" class="email-bg">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:560px;width:100%;">
          <!-- Logo + brand (centered) -->
          <tr>
            <td align="center" style="padding:0 0 28px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="center">
                    <img src="${safeLogoUrl}" width="56" height="56" alt="${safeBrand}" style="display:block;margin:0 auto;width:56px;height:56px;border:0;border-radius:14px;" />
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top:14px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:20px;font-weight:700;letter-spacing:-0.02em;color:#18181b;" class="brand-name">
                    ${safeBrand}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td align="center" bgcolor="#ffffff" style="background:#ffffff;border:1px solid #e4e4e7;border-radius:18px;padding:40px 36px;" class="email-card">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="center" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:24px;font-weight:700;letter-spacing:-0.03em;line-height:1.25;color:#18181b;padding:0 0 18px;" class="email-title">
                    ${safeTitle}
                  </td>
                </tr>
                <tr>
                  <td align="center" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.7;color:#3f3f46;" class="email-text">
                    Hello ${name},
                  </td>
                </tr>
                <tr>
                  <td align="center" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.7;color:#3f3f46;padding-top:14px;" class="email-text">
                    ${bodyHtml}
                  </td>
                </tr>
                ${ctaBlock}
                ${note}
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:28px 12px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:12px;line-height:1.75;color:#71717a;" class="email-muted">
              <strong style="color:#52525b;">${safeBrand}</strong><br/>
              Need help? <a href="mailto:${safeSupport}" style="color:#d83a32;text-decoration:none;">${safeSupport}</a><br/>
              &copy; ${year} ${safeBrand}. All rights reserved.
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
