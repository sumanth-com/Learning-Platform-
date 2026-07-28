import type { HubSection } from "../../types";
import { sec } from "./_helpers";

export const apiSecurityGuideMeta = {
  overviewBody: `API security is enforcing least privilege on every request — not a WAF SKU and a penetration test PDF.

This guide maps OWASP API Security Top 10 (2023) to concrete controls: authn/z patterns, rate limits, input validation, BOLA/BFLA prevention, and logging that helps incidents without leaking secrets. Written for teams shipping JSON/REST or GraphQL in production.`,
  objectives: [
    "Map each OWASP API Top 10 risk to specific middleware, schema, and test controls",
    "Implement authn/z separation with object-level checks on every mutating route",
    "Design rate limits, validation, and error responses that do not aid attackers",
    "Establish logging and alerting hygiene for API abuse detection",
  ],
  prerequisites: [
    "REST or GraphQL API design experience",
    "HTTP status codes, JWT/session auth basics",
    "Familiarity with OWASP terminology",
  ],
  takeaways: [
    "BOLA is the #1 API risk — every handler must verify resource ownership",
    "Rate limits are per-identity and per-route, not one global bucket",
    "Validation at the boundary with strict schemas beats ad-hoc if-checks",
    "Logs are for defense — never log tokens, passwords, or full PII payloads",
  ],
};

export const apiSecurityGuideSections: HubSection[] = [
  sec(
    "owasp-map",
    "1. OWASP API Top 10 → controls",
    `Use this as your security review checklist — each item needs a named control in code or infra.

| Risk | Control |
|------|---------|
| API1 BOLA | Object-level authz on every id parameter |
| API2 Broken auth | Short-lived tokens, rotation, lockout, MFA for admin |
| API3 Property auth | Allowlist response fields; reject mass assignment |
| API4 Resource consumption | Rate limits, pagination caps, timeout budgets |
| API5 BFLA | Role checks on admin/function endpoints |
| API6 Business flow | Idempotency, step-up auth on sensitive flows |
| API7 SSRF | Blocklist internal IPs; no raw user URLs in server fetch |
| API8 Misconfig | Security headers, disable debug, hardened defaults |
| API9 Inventory | OpenAPI catalog, deprecate zombie endpoints |
| API10 Unsafe consumption | Validate third-party API responses like user input |

Ship gate: no new endpoint merges without authz test proving cross-tenant denial.`,
    {
      checklist: [
        "OpenAPI/spec lists auth scope per operation",
        "Security review template attached to admin routes",
        "Dependency scan in CI (SCA)",
      ],
    }
  ),
  sec(
    "authn",
    "2. Authentication hardening",
    `Authn proves identity — do it once, consistently, at the edge or first middleware.

Controls:
• OAuth2 authorization code + PKCE for user delegation; no password grant
• API keys for automation — scoped, rotatable, hashed at rest, never in query strings
• mTLS or signed service tokens for internal east-west traffic
• Brute-force: exponential backoff + CAPTCHA after N failures; lockout alerts
• Constant-time compare for secrets and API keys

Token transport:
• Authorization: Bearer for APIs
• Never accept access tokens in URL query params (logs, Referer leakage)

Session/API key rotation:
• Document rotation runbook; dual-active keys during grace window
• Revoke on employee offboarding same day`,
    {
      bullets: [
        "401 vs 403: unauthenticated vs authenticated-but-denied",
        "Clock skew tolerance ±60s on JWT exp",
        "Admin routes require separate role + optional IP allowlist",
      ],
    }
  ),
  sec(
    "authz-bola",
    "3. Authorization, BOLA & BFLA",
    `Broken Object Level Authorization: attacker changes id=123 to id=124 and reads your invoice.

Fix pattern (every route):
\`\`\`
resource = repo.get(id)
if (!policy.can(user, "read", resource)) return 404 // not 403 if enumeration matters
\`\`\`

Rules:
• Never trust client-supplied tenant_id — derive from session
• Use UUIDs or non-sequential ids for sensitive resources ( obscurity is not authz )
• 404 vs 403: 404 hides existence for cross-tenant; 403 OK within same tenant role denial
• GraphQL: field-level auth + batch loader must not skip per-node checks

BFLA (Broken Function Level Authorization):
• /admin/* requires admin role server-side — not hidden UI
• HTTP method matters: GET reader cannot POST delete
• Separate admin API surface or gateway with stricter MFA

Automated tests:
• User A token → User B resource id → expect 404/403
• Member role → admin endpoint → 403`,
    {
      checklist: [
        "Every :id route has ownership test",
        "Bulk endpoints verify each item in batch",
        "Export/download endpoints same authz as single get",
      ],
    }
  ),
  sec(
    "ratelimit",
    "4. Rate limits & resource caps",
    `Rate limits protect availability and raise cost of credential stuffing / scraping.

Dimensions:
• Per IP — anonymous/public endpoints (100–300 req/min starting point)
• Per user/API key — authenticated (1000–10000 req/min by tier)
• Per route — expensive ops (search, export, LLM) get tight limits (10–60/min)
• Global emergency brake — feature flag

Response contract:
• 429 with Retry-After header
• Consistent error body { code, message, retry_after_ms }
• Do not rate-limit health checks from load balancer IPs (allowlist)

Pagination & query caps:
• max limit=100 (even if client asks 10000)
• max filter complexity on GraphQL (depth/cost limits)
• Request body size cap (1–10MB typical; separate upload path for files)

Cost-based limits for AI/search endpoints: token budget per org per day.`,
  ),
  sec(
    "validation",
    "5. Input validation & output shaping",
    `Validate at boundary; treat everything inside as typed and trusted-ish.

Tools:
• JSON Schema / Zod / OpenAPI request validators on ingress
• Reject unknown fields (additionalProperties: false) — stops mass assignment
• Enum allowlists for sort, order, status fields — no raw SQL sort injection
• Normalize Unicode, trim, max lengths on strings

Output:
• Response DTOs — do not serialize ORM models directly (password_hash leaks)
• Redact internal ids in public APIs if alternate public_id exists
• Error messages: "Invalid input" + field errors in dev; generic in prod

File upload:
• Content-type sniff + extension allowlist
• Virus scan async; store outside web root; signed URLs for download`,
    {
      code: [
        {
          language: "typescript",
          title: "Reject unknown fields",
          code: `const CreateUserSchema = z.object({
  email: z.string().email().max(255),
  name: z.string().min(1).max(100),
}).strict(); // throws on role: "admin" injection`,
        },
      ],
    }
  ),
  sec(
    "ssrf-flows",
    "6. SSRF & unsafe business flows",
    `SSRF: user supplies URL, server fetches internal metadata (169.254.169.254).

Controls:
• Block private IP ranges, link-local, localhost
• Resolve DNS then check IP — no TOCTOU bypass
• Allowlist domains for webhook callbacks if product requires user URLs
• No redirect following to internal hosts

Business flow abuse (API6):
• Checkout: server computes price — never trust client amount
• Coupon stacking: enforce rules server-side
• Password reset / invite tokens: single-use, short TTL, rate limited
• Idempotency-Key header on POST that creates money or scarce resources`,
    {
      bullets: [
        "Webhook outbound retries with exponential backoff",
        "Captcha on signup/login after anomaly score",
        "Monitor velocity: same card, many accounts",
      ],
    }
  ),
  sec(
    "logging",
    "7. Logging hygiene & detection",
    `Logs enable response; they also create breach surface if sloppy.

Log (structured JSON):
• request_id, trace_id, method, path, status, duration_ms
• authenticated user_id, org_id (not email in hot path)
• auth failure reason code (invalid_signature, expired)
• rate_limit.hit, idempotency.replay

Never log:
• Authorization headers, cookies, API keys, passwords
• Full credit card, SSN, health data
• Request bodies containing secrets (mask known fields)

Detection alerts:
• Spike 401/403 from single IP/ASN
• BOLA probe pattern: sequential id scanning
• 429 sustained on login — credential stuffing
• Unusual admin API usage off-hours

Retention: 30–90 days hot; PII-minimized archives for compliance.`,
    {
      checklist: [
        "Log scrubber unit tests for token patterns",
        "SIEM or log query saved for top 5 abuse patterns",
        "Incident runbook linked from alert pages",
      ],
    }
  ),
  sec(
    "transport-config",
    "8. Transport, headers & misconfiguration",
    `TLS everywhere; HSTS on public domains (max-age ≥ 31536000 with preload consideration).

Security headers (API + web):
• Strict-Transport-Security
• X-Content-Type-Options: nosniff
• Cache-Control: no-store on authenticated responses
• CORS: explicit allowlist origins — never * with credentials

Disable:
• Stack traces in prod JSON errors
• Directory listing, default cloud storage public ACLs
• Debug endpoints (/metrics unauthenticated — protect or network-restrict)

API inventory:
• Monthly crawl of routes vs OpenAPI; delete unused
• Deprecation headers: Sunset, Link replacement`,
  ),
  sec(
    "antipatterns",
    "9. Anti-patterns",
    `• Authz only in frontend router guards
• Sequential integer ids on private resources without ownership check
• Logging full request JSON "for debug"
• Global rate limit 1000/s that expensive endpoint shares with health check
• Trusting JWT role claim without session revocation check
• CORS * because "mobile app might need it"
• GraphQL introspection enabled on production internet
• Returning 200 with { success: false } — breaks monitoring and caches errors

Secure APIs are boring: consistent gates, tested denials, observable abuse.`,
  ),
];
