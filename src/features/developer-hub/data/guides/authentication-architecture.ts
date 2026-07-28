import type { HubSection } from "../../types";
import { sec } from "./_helpers";

export const authenticationArchitectureMeta = {
  overviewBody: `Auth architecture is choosing where identity lives, how it crosses trust boundaries, and what happens when tokens leak or sessions multiply across devices.

This guide is a decision matrix and operational playbook: session cookies vs JWT vs OAuth/OIDC, refresh rotation with reuse detection, cookie hardening, CSRF/XSS interaction, revocation that actually works, and multi-device SaaS patterns — not a tutorial on "what is OAuth."`,
  objectives: [
    "Pick session vs JWT vs OIDC for a given client and threat model with explicit trade-offs",
    "Implement refresh token rotation, reuse detection, and server-side revocation",
    "Configure cookies, CSRF, and XSS defenses as one coordinated story",
    "Design multi-device session management suitable for B2B SaaS",
  ],
  prerequisites: [
    "HTTP cookies, headers, and same-origin policy",
    "Basic familiarity with OAuth 2.0 / OIDC flows (authorization code + PKCE)",
    "Have shipped login at least once (even if imperfect)",
  ],
  takeaways: [
    "Browser apps: HttpOnly session cookies + CSRF tokens beat localStorage JWTs for most SaaS",
    "Refresh rotation + reuse detection is non-optional for long-lived sessions",
    "Revocation requires server-side state or extremely short access token TTL",
    "Multi-device means session inventory, not one refresh token copied everywhere",
  ],
};

export const authenticationArchitectureSections: HubSection[] = [
  sec(
    "matrix",
    "1. Session vs JWT vs OAuth/OIDC — choice matrix",
    `Pick based on client type, logout requirements, and who issues identity.

| Pattern | Best for | Pros | Cons |
|---------|----------|------|------|
| Server session (cookie) | Browser-first SaaS | Instant revoke, simple authz, HttpOnly | Stateful, sticky sessions or shared store |
| JWT access (short TTL) | Mobile/API/microservices | Stateless verify, cross-service | Hard revoke, payload bloat, clock skew |
| OAuth/OIDC (IdP) | Enterprise SSO, social login | Delegated trust, MFA at IdP | Integration complexity, claim mapping |
| PAT / API keys | Scripts, CI, server-to-server | Simple | No user context, rotation burden |

Decision rules:
• Primary UX is web app + you control backend → opaque session ID in HttpOnly cookie, session data in Redis/DB
• Mobile/native + your API → short-lived JWT (5–15 min) + refresh with rotation; consider DPoP or mTLS for high assurance
• "Login with Google/Okta" → OIDC authorization code + PKCE; your app session is still server-side or paired JWT
• Never store refresh tokens in localStorage on web — XSS wins the game

Hybrid that scales: OIDC for login → establish server session for browser; issue JWT access tokens only for API clients that need them.`,
    {
      checklist: [
        "Client types enumerated (web, mobile, machine)",
        "Logout = revoke server session AND clear cookies",
        "Token TTL documented with rationale",
      ],
    }
  ),
  sec(
    "refresh",
    "2. Refresh rotation & reuse detection",
    `Long-lived access is the problem; refresh tokens are the controlled fix — if rotated correctly.

Rotation flow:
1. Client presents refresh_token_v1
2. Server validates, issues new access + refresh_token_v2, invalidates v1
3. Grace window (0–30s) for concurrent tab refresh — use family id, not infinite duplicate acceptance

Reuse detection (critical):
• Store refresh token family_id + version/hash server-side
• If a revoked refresh token is presented → compromise signal
• Response: revoke entire family (all sessions from that login), force re-auth, alert user

Numbers:
• Access token: 5–15 min (web API), 15–60 min (low-risk mobile if no refresh abuse)
• Refresh token: 7–30 days sliding, absolute max 90 days
• Rotation on every refresh — not "rotate daily"

Storage:
• Web: refresh in HttpOnly Secure SameSite cookie (path-scoped) or server-only with BFF pattern
• Mobile: Keychain/Keystore — never logs, never analytics`,
    {
      bullets: [
        "Hash refresh tokens at rest (SHA-256 of raw token)",
        "Bind refresh to client_id + device_id where feasible",
        "Log reuse events as security incidents, not 401 noise",
      ],
    }
  ),
  sec(
    "cookies",
    "3. Cookie flags & transport",
    `Cookies are your session carrier — misconfiguration is a CVE.

Required for session cookies:
• HttpOnly — JS cannot read (mitigates XSS token theft)
• Secure — HTTPS only
• SameSite=Lax (default UX) or Strict (high security, breaks some flows)
• Path=/ or narrow path for refresh vs session split
• __Host- prefix when possible (Secure, Path=/, no Domain attribute)

Split cookie pattern (common in production):
• session_id — short-lived session binding, Lax
• refresh — separate cookie, Strict, limited path (/api/auth/refresh)

Domain scoping:
• Avoid Domain=.parent.com unless subdomains truly share auth
• Staging cookies must not leak to production domain

Session fixation: rotate session ID on privilege change (login, MFA step-up, password reset).`,
    {
      checklist: [
        "Set-Cookie attributes verified in staging with browser devtools",
        "No sensitive tokens in non-HttpOnly cookies or URL params",
        "Cookie size < 4KB — store IDs, not JWT payloads",
      ],
    }
  ),
  sec(
    "csrf-xss",
    "4. CSRF, XSS, and auth interaction",
    `CSRF and XSS are different attacks; cookie-based auth must address both.

CSRF (cookie auto-sent):
• SameSite=Lax/Strict blocks most cross-site POST
• Double-submit or synchronizer token for state-changing requests if SameSite=None (embedded widgets)
• Require custom header (X-Requested-With or Authorization) on API mutations — simple CSRF filter
• Never use GET for mutations

XSS (script runs as user):
• HttpOnly limits exfiltration of session cookie but attacker can still act in-browser
• CSP: default-src 'self'; script-src with nonces; no unsafe-inline in production
• Sanitize HTML if rendered; treat all user content as hostile
• Short access TTL limits window even if XSS exists

JWT in localStorage: XSS steals token directly — worse than HttpOnly session for browser apps.

BFF pattern: browser talks only to same-origin BFF; BFF holds refresh and talks to API — shrinks XSS blast radius.`,
    {
      bullets: [
        "State-changing API: POST/PUT/PATCH/DELETE only",
        "CSRF token on forms if not fully SameSite-protected",
        "Security headers: CSP, X-Frame-Options, Referrer-Policy",
      ],
    }
  ),
  sec(
    "revocation",
    "5. Revocation that works",
    `Stateless JWT alone cannot revoke until expiry — plan for server-side deny.

Revocation mechanisms:
• Session store delete — immediate for opaque sessions
• Token blocklist (jti → exp) in Redis — for JWT access tokens when needed
• Refresh family revoke — kills all derived sessions
• User-level version stamp — embed session_version in token; bump on password change/global logout

When to revoke:
• Logout (this device vs all devices)
• Password change / MFA reset
• Admin suspend user / org offboarding
• Detected reuse or impossible travel

Operational detail:
• Blocklist TTL = remaining token lifetime (auto-expire entries)
• Global logout: increment user.session_epoch in DB; reject tokens with old epoch
• Webhook from IdP (Okta session revoked) → propagate to your sessions`,
    {
      checklist: [
        "Logout invalidates server state, not just client storage",
        "Password reset kills other sessions by default",
        "Revocation path tested in integration tests",
      ],
    }
  ),
  sec(
    "multidevice",
    "6. SaaS multi-device sessions",
    `Users have laptop + phone + shared machine. Model sessions as rows, not a single token.

Session inventory table (conceptual):
• session_id, user_id, device_label, ip_asn, created_at, last_seen_at, refresh_family_id
• UI: "Active sessions" with revoke per row
• Cap concurrent sessions per plan tier if abuse matters

Device binding (optional, trade privacy):
• Soft fingerprint (user agent + app instance id)
• Step-up MFA on new device or risky geo/ASN

Org / tenant context:
• session carries active_org_id — switching org rotates authz context, not necessarily session id
• RBAC claims resolved server-side per request — not trusted from JWT alone without validation

Enterprise SSO:
• Shorter session TTL + IdP SLO
• SCIM deprovision → immediate session kill job`,
    {
      bullets: [
        "Refresh per device family, not one refresh copied to all devices",
        "Last_seen_at updated throttled (e.g., every 5 min) to reduce write load",
        "Email alert on new device login for B2B products",
      ],
    }
  ),
  sec(
    "authz",
    "7. Authn vs authz boundary",
    `Authentication proves who; authorization proves what. Do not merge them in middleware soup.

Pattern:
• Authn middleware: resolve user_id + session_id
• Authz layer: load roles/permissions for resource + action (RBAC, ABAC, or ReBAC)
• Resource handlers check ownership (tenant_id, object owner) — BOLA lives here

JWT claims:
• Keep minimal: sub, sid, org_id, session_epoch
• Permissions in token only if short-lived and invalidated on role change — else DB lookup

Service-to-service:
• mTLS or signed service JWT with audience restriction
• Never forward user's cookie to internal services — exchange for internal identity`,
  ),
  sec(
    "antipatterns",
    "8. Anti-patterns",
    `• JWT in localStorage for SPA "because it's easier"
• Refresh tokens without rotation or reuse detection
• SameSite=None without understanding CSRF surface
• Logout that only deletes client cookie
• Trusting role claims from JWT without re-check on sensitive actions
• OAuth implicit flow or password grant in new code (deprecated / forbidden)
• Session IDs in URLs
• 30-day access tokens "to reduce refresh complexity"
• Shared refresh token across tabs/devices via localStorage sync

Auth is boring when correct — exciting when wrong.`,
  ),
];
