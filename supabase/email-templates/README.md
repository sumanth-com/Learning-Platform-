# Supabase Auth email templates (SupraBase)

Paste each file into **Authentication → Email Templates** in the Supabase Dashboard.

| Dashboard template | File | Subject |
|---|---|---|
| Confirm signup | `1-confirm-signup.html` | Verify your email for SupraBase |
| Invite user | `2-invite-user.html` | You're invited to join SupraBase |
| Magic Link | `3-magic-link.html` | Your secure sign-in link |
| Change Email Address | `4-change-email.html` | Confirm your new email address |
| Reset Password | `5-reset-password.html` | Reset your SupraBase password |
| Reauthentication | `6-reauthentication.html` | Verify your identity |

## Compatible variables used

- `{{ .ConfirmationURL }}`
- `{{ .Email }}`
- `{{ .SiteURL }}`
- `{{ .Token }}` (Magic Link + Reauthentication)

## Before production

1. Replace `https://yourdomain.com/email/suprabas-logo.png` with your hosted logo URL.
2. Replace `support@yourdomain.com` with your real support address.
3. Ensure Site URL + redirect URLs include your `/auth/callback` route.
