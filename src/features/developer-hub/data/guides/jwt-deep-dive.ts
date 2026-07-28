import type { HubSection } from "../../types";
import { sec } from "./_helpers";

export const jwtDeepDiveMeta = {
  overviewBody: `JWTs are self-contained, signed claims — not sessions, not encryption, and not a substitute for authorization. Production auth fails on algorithm confusion, missing revocation, refresh token leakage, and treating the access token like a database row you never have to look up.

This guide covers claim design, signing algorithm pitfalls, key rotation without logging everyone out, revocation strategies that match your threat model, and when opaque server-side tokens beat JWT access tokens entirely.`,
  objectives: [
    "Design access and refresh token claims with minimal payload and explicit expiry",
    "Avoid alg=none, HS256/RS256 confusion, and key-id rotation footguns",
    "Implement rotation and revocation appropriate to session length and risk",
    "Choose between JWT and opaque access tokens based on introspection cost and logout requirements",
  ],
  prerequisites: [
    "Implemented login/logout in a web or mobile app",
    "Basic understanding of HTTP cookies and Authorization headers",
    "Familiar with symmetric vs asymmetric cryptography at a high level",
  ],
  takeaways: [
    "Validate alg, iss, aud, exp on every request — reject before trusting claims",
    "Short-lived access JWT + rotating refresh + server-side session record for revoke",
    "Never put secrets or PII in JWT payload — it is base64, not encrypted",
    "Opaque access tokens + introspection when immediate revoke and small audience beat stateless scale",
  ],
};

export const jwtDeepDiveSections: HubSection[] = [
  sec(
    "claims",
    "1. Claims — minimal, purposeful, validated",
    `Registered claims (use them):
• sub — stable user id (not email — emails change)
• exp — expiry (access: 5–15 min typical)
• iat — issued at (detect token reuse anomalies)
• iss — your auth server URL/id
• aud — intended resource (api.yourapp.com) — prevents token replay across services
• jti — unique token id for revocation lists and replay detection

Private claims — only what resource servers need without DB hit:
• scope or permissions (keep small; large role matrices belong in DB lookup)
• tenant_id for multi-tenant routing
• session_id linking to server-side session row

Never embed:
• Password hashes, credit cards, full PII
• "isAdmin: true" without server-side re-check for sensitive actions

Validation checklist on every request:
signature valid → alg allowed → iss/aud match → exp/nbf window → optional jti not revoked`,
    {
      checklist: [
        "sub is immutable user identifier",
        "aud and iss validated in API middleware",
        "Payload < 1KB; no sensitive data",
      ],
    }
  ),
  sec(
    "algorithms",
    "2. Algorithm pitfalls — where JWT libraries hurt you",
    `HS256 (symmetric) — one secret signs and verifies. Fine for monolith where same service issues and validates. Secret rotation requires coordinated deploy.

RS256 / ES256 (asymmetric) — private key signs, public key verifies. Auth server holds private; APIs fetch JWKS public keys. Standard for microservices and third-party clients.

Critical vulnerabilities:
• alg=none attack — attacker sets header alg to none. Fix: allowlist algorithms in verifier; reject none.
• HS256 with public key — if server expects RS256 but accepts HS256 and uses RSA public key as HMAC secret. Fix: strict alg allowlist per token type.
• Key confusion — mixing symmetric verification for asymmetric tokens.

JWKS endpoint:
• Publish /.well-known/jwks.json with kid per key
• Verifier caches keys with TTL; refresh on unknown kid

Library config (conceptual):
algorithms: ['RS256'] only
complete: true before trusting payload
clockTolerance: small skew (30s) for exp`,
    {
      bullets: [
        "Explicit algorithms allowlist — never 'accept what header says'",
        "JWKS with kid for key rotation",
        "Separate secrets/keys for access vs refresh if using HS256",
      ],
    }
  ),
  sec(
    "access-refresh",
    "3. Access + refresh — lifetimes and storage",
    `Access token — short-lived JWT or opaque, sent per API request (Authorization: Bearer or cookie).

Refresh token — long-lived, used only at token endpoint to get new access token.

Storage rules:
• SPA: access in memory; refresh in HttpOnly Secure SameSite cookie (not localStorage)
• Mobile: secure enclave / keychain
• Never localStorage for access if XSS is in threat model

Refresh rotation:
• Each refresh use issues new refresh token, invalidates old (detect reuse → revoke family)
• Reuse detection: if old refresh presented after rotation, assume theft — revoke all sessions for user

PKCE for public clients (SPAs, mobile) on authorization code flow — no client secret in browser.

BFF pattern: browser talks to same-origin backend; BFF holds tokens — simplifies cookie policy and hides refresh from JS.`,
    {
      checklist: [
        "Access TTL ≤ 15 min for web; adjust for mobile offline",
        "Refresh in HttpOnly cookie or secure storage",
        "Refresh rotation + reuse detection enabled",
      ],
    }
  ),
  sec(
    "rotation",
    "4. Key rotation without mass logout",
    `Signing keys should rotate on schedule (e.g., 90 days) and on compromise.

Asymmetric rotation:
1. Generate new key pair with new kid
2. Publish both keys in JWKS (old + new)
3. Sign new tokens with new kid only
4. Verifiers accept both during overlap window
5. Remove old key after max(access TTL, overlap)

Symmetric rotation:
• Support two secrets briefly; verify with either; sign with new only
• Requires all verifiers updated before old secret removed

Do not rotate by invalidating all sessions unless incident — users hate it; have break-glass revoke instead.

Automate: store keys in KMS/Vault; CI publishes JWKS; alert on verification failures spike after rotation.`,
  ),
  sec(
    "revocation",
    "5. Revocation strategies — pick for your threat model",
    `JWT access tokens are stateless — you cannot "delete" them until exp without extra machinery.

Options:

Short TTL only — accept token valid until exp. OK for low-risk read APIs with 5-min access.

Denylist (jti blocklist) — store revoked jti until exp. Redis SET with TTL = remaining token life. Good for logout and admin revoke; scales with revocation rate not total users.

Session store — access token carries session_id; API checks session active in Redis/DB on each request (semi-stateless). Immediate revoke; adds latency and dependency.

Refresh-only revoke — logout invalidates refresh; access dies naturally. Simple; window = access TTL (unacceptable for high-security).

Push version claim — token has session_version; user row has version; bump on password change/logout-all. One DB read per request — cheap invalidation.

High-security (banking): opaque access + introspection endpoint or session store always.

Document: "logout is effective within X minutes" — set X via access TTL or real revoke mechanism.`,
    {
      bullets: [
        "Threat model written: XSS, stolen laptop, admin revoke",
        "Revocation mechanism matches max acceptable exposure window",
        "Logout-all bumps session_version or revokes refresh family",
      ],
    }
  ),
  sec(
    "opaque-vs-jwt",
    "6. Opaque vs JWT access tokens",
    `JWT access pros:
• No central lookup — scales horizontally
• Works across services with JWKS
• Good for microservices, edge validation

JWT access cons:
• Hard immediate revoke (without session/version/checklist)
• Payload visible to client (base64)
• Size overhead on every request

Opaque access pros:
• Revoke instantly in DB/Redis
• No claim leakage
• Smaller on wire (random id)

Opaque cons:
• Every resource server calls auth introspection or shared session store
• Hot path dependency on auth DB/cache

Hybrid common at scale:
• JWT with 5-min exp + session_id checked in Redis for sensitive routes only
• Opaque for first-party; JWT for service-to-service

OAuth 2.0 reference tokens (opaque) vs self-contained (JWT) — same trade-off.`,
    {
      checklist: [
        "Decision documented: JWT, opaque, or hybrid",
        "If opaque: introspection SLO and cache strategy defined",
        "If JWT: revoke story not 'wait for exp' unless accepted",
      ],
    }
  ),
  sec(
    "implementation",
    "7. Implementation hardening",
    `Middleware order:
1. Extract token (header, cookie)
2. Verify signature + claims
3. Load authorization context (roles from DB if not in token)
4. Attach user to request scope

Cookies for tokens:
• HttpOnly, Secure, SameSite=Lax or Strict
• __Host- prefix when all conditions met
• Separate cookies for access vs refresh if both cookie-based

CSRF: if cookies carry access, use SameSite + CSRF token on mutating requests or double-submit cookie.

Logging: never log full token; log sub, jti, session_id on auth failures.

Testing: expired token, wrong aud, rotated key, revoked jti, refresh reuse, clock skew.`,
  ),
  sec(
    "incidents",
    "8. Incident and migration playbook",
    `Key compromise:
• Rotate signing keys immediately
• Shorten access TTL temporarily
• Revoke all refresh tokens (force re-login)
• Audit jti/session logs for anomaly

Algorithm migration HS256 → RS256:
• Dual-issue period or hard cutover with forced re-login — plan comms

Third-party IdP (Auth0, Cognito, Clerk):
• Still validate aud/iss locally
• Understand their rotation schedule and JWKS caching
• Do not disable validation because "vendor handles it"

Senior review question: "User clicks logout — how long until a stolen access token stops working?" If answer is vague, design is not done.`,
    {
      bullets: [
        "Compromise runbook: rotate keys, revoke refresh, comms template",
        "Logout effectiveness quantified in minutes",
        "Auth middleware covered by integration tests for negative cases",
      ],
    }
  ),
];
