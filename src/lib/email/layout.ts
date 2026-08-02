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

const FONT =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

/**
 * Premium transactional email chrome (Linear / Stripe / Vercel style).
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
  const trimmedName = firstName.trim();
  const greeting = trimmedName
    ? `Hello ${escapeHtml(trimmedName)},`
    : "Hello,";
  const safeTitle = escapeHtml(title);
  const safePreview = escapeHtml(preview);
  const safeCta = ctaLabel ? escapeHtml(ctaLabel) : "";
  const safeUrl = ctaUrl ? escapeHtml(ctaUrl) : "";
  const safeLogoUrl = escapeHtml(brand.logoUrl);
  const safeBrand = escapeHtml(brand.name);
  const safeSupport = escapeHtml(brand.supportEmail);
  const safePrivacy = escapeHtml(`${brand.appUrl}/privacy`);
  const safeTerms = escapeHtml(`${brand.appUrl}/terms`);
  const year = new Date().getFullYear();

  const ctaBlock =
    safeCta && safeUrl
      ? `
      <tr>
        <td align="center" style="padding:28px 0 8px;text-align:center;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:0 auto;">
            <tr>
              <td bgcolor="#5f3435" style="border-radius:10px;background:#5f3435;">
                <!--[if mso]>
                <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" href="${safeUrl}" style="height:46px;v-text-anchor:middle;width:200px;" arcsize="12%" stroke="f" fillcolor="#5f3435">
                  <w:anchorlock/>
                  <center style="color:#ffffff;font-family:Arial,sans-serif;font-size:15px;font-weight:600;">
                    ${safeCta}
                  </center>
                </v:roundrect>
                <![endif]-->
                <!--[if !mso]><!-->
                <a href="${safeUrl}"
                   target="_blank"
                   style="display:inline-block;padding:14px 28px;font-family:${FONT};font-size:15px;font-weight:600;line-height:1.2;color:#ffffff;text-decoration:none;border-radius:10px;background:#5f3435;">
                  ${safeCta}
                </a>
                <!--<![endif]-->
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td align="center" style="padding:16px 0 0;font-family:${FONT};font-size:12px;line-height:1.65;color:#71717a;text-align:center;">
          Or open this link in your browser:<br/>
          <a href="${safeUrl}" style="color:#5f3435;word-break:break-all;text-decoration:underline;">${safeUrl}</a>
        </td>
      </tr>`
      : "";

  const note = footerNote
    ? `<tr><td style="padding:24px 0 0;font-family:${FONT};font-size:13px;line-height:1.65;color:#71717a;">${footerNote}</td></tr>`
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
    img { border: 0 !important; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
    a { color: #5f3435; }
    @media (prefers-color-scheme: dark) {
      .email-bg { background:#09090b !important; }
      .email-card { background:#18181b !important; }
      .email-title { color:#fafafa !important; }
      .email-text { color:#d4d4d8 !important; }
      .email-muted { color:#a1a1aa !important; }
      .brand-name { color:#fafafa !important; }
      .email-rule { border-color:#27272a !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;width:100%;" class="email-bg">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;opacity:0;color:transparent;">
    ${safePreview}
  </div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f4f4f5;width:100%;" class="email-bg">
    <tr>
      <td align="center" style="padding:36px 16px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:520px;width:100%;">

          <!-- Brand header: centered logo + name -->
          <tr>
            <td align="center" style="padding:0 0 20px;text-align:center;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:0 auto;">
                <tr>
                  <td valign="middle" style="vertical-align:middle;padding:0;line-height:0;">
                    <img src="${safeLogoUrl}" width="36" height="36" alt="${safeBrand}"
                         style="display:block;width:36px;height:36px;border:0;outline:none;text-decoration:none;border-radius:10px;" />
                  </td>
                  <td valign="middle" style="vertical-align:middle;padding:0 0 0 12px;">
                    <div style="font-family:${FONT};font-size:18px;font-weight:650;letter-spacing:-0.03em;line-height:1;color:#18181b;" class="brand-name">
                      ${safeBrand}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content card -->
          <tr>
            <td bgcolor="#ffffff" style="background:#ffffff;border-radius:14px;padding:32px 28px;box-shadow:0 1px 2px rgba(24,24,27,0.04),0 8px 24px rgba(24,24,27,0.06);" class="email-card">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="font-family:${FONT};font-size:22px;font-weight:650;letter-spacing:-0.03em;line-height:1.3;color:#18181b;padding:0 0 18px;" class="email-title">
                    ${safeTitle}
                  </td>
                </tr>
                <tr>
                  <td style="font-family:${FONT};font-size:15px;line-height:1.7;color:#3f3f46;" class="email-text">
                    ${greeting}
                  </td>
                </tr>
                <tr>
                  <td style="font-family:${FONT};font-size:15px;line-height:1.7;color:#3f3f46;padding-top:12px;" class="email-text">
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
            <td align="center" style="padding:28px 4px 0;font-family:${FONT};font-size:12px;line-height:1.75;color:#71717a;text-align:center;" class="email-muted">
              <strong style="color:#52525b;font-weight:600;">${safeBrand}</strong><br/>
              <a href="mailto:${safeSupport}" style="color:#5f3435;text-decoration:none;">${safeSupport}</a>
              <span style="color:#d4d4d8;"> · </span>
              <a href="${safePrivacy}" style="color:#71717a;text-decoration:none;">Privacy Policy</a>
              <span style="color:#d4d4d8;"> · </span>
              <a href="${safeTerms}" style="color:#71717a;text-decoration:none;">Terms</a><br/>
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

const HONORIFIC =
  /^(mr|mrs|ms|miss|dr|prof|sir|madam|mx)\.?$/i;

/** Prefer a real given name. Skip honorifics. Empty when unknown. */
export function firstNameFrom(fullName?: string | null, email?: string | null) {
  const parts = (fullName?.trim() || "").split(/\s+/).filter(Boolean);
  const firstReal = parts.find((part) => !HONORIFIC.test(part));
  if (firstReal) return firstReal;

  const local = email?.split("@")[0]?.trim();
  if (local) {
    const cleaned = local.replace(/[._+-]+/g, " ").split(/\s+/)[0];
    if (cleaned && cleaned.length >= 2 && !/^\d+$/.test(cleaned)) {
      return cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase();
    }
  }
  return "";
}
