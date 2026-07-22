export type AuthDifficulty = "beginner" | "intermediate" | "advanced";

export type AuthTopicDef = {
  slug: string;
  title: string;
  summary: string;
  estimatedMinutes: number;
  difficulty: AuthDifficulty;
  keywords: string[];
  challengeWeight: number;
  explanation: string;
  a11yNotes: string[];
  commonMistakes: string[];
  bestPractices: string[];
  interviewQuestions: string[];
  /** Auth and security APIs / concepts for the reference panel */
  cheatSheet: Array<{ tag: string; desc: string }>;
};

export type AuthSectionDef = {
  slug: string;
  title: string;
  description: string;
  topics: AuthTopicDef[];
};

function t(partial: AuthTopicDef): AuthTopicDef {
  return partial;
}

export const AUTH_ACADEMY_SECTIONS: AuthSectionDef[] = [
  {
    slug: "auth-fundamentals",
    title: "Auth Fundamentals",
    description: "Core concepts of authentication, authorization, sessions, tokens, and password security.",
    topics: [
      t({
        slug: "what-is-authentication",
        title: "What is Authentication?",
        summary: "Authentication verifies who a user is before granting access to protected resources.",
        estimatedMinutes: 12,
        difficulty: "beginner",
        keywords: ["authentication", "identity", "login", "verify"],
        challengeWeight: 4,
        explanation:
          "Authentication (authn) answers the question: who are you? Common methods include passwords, one-time codes, biometrics, and federated login through an identity provider. After successful authentication, the application creates a session or issues a token that represents the user on subsequent requests. Authentication is distinct from authorization, which decides what an authenticated user is allowed to do. Strong authentication reduces impersonation and account takeover risk.",
        a11yNotes: [
          "Login forms must have labeled fields, clear error messages, and keyboard-accessible submit controls.",
          "Do not rely on color alone to indicate authentication success or failure.",
        ],
        commonMistakes: [
          "Confusing authentication with authorization",
          "Treating a username alone as proof of identity without verification",
          "Storing passwords in plain text instead of hashing them",
        ],
        bestPractices: [
          "Require proof of identity through a secret, token, or trusted provider",
          "Use multi-factor authentication for sensitive accounts",
          "Log authentication events without logging secrets",
        ],
        interviewQuestions: [
          "What is authentication and how does it differ from authorization?",
          "What are common authentication factors?",
          "What happens after a user successfully authenticates?",
        ],
        cheatSheet: [
          { tag: "authn", desc: "Authentication — verifying identity" },
          { tag: "identity", desc: "Who the user claims to be (username, email, subject ID)" },
          { tag: "credential", desc: "Proof used to authenticate (password, OTP, key)" },
        ],
      }),
      t({
        slug: "authn-vs-authz",
        title: "Authentication vs Authorization",
        summary: "Authentication proves identity; authorization decides what that identity may access.",
        estimatedMinutes: 10,
        difficulty: "beginner",
        keywords: ["authorization", "permissions", "access", "roles"],
        challengeWeight: 4,
        explanation:
          "Authentication confirms you are Alice. Authorization decides whether Alice may read a document, delete a record, or access an admin panel. A user can be authenticated but unauthorized for a specific action — for example, a logged-in customer trying to access another user's order. Authorization checks often use roles, permissions, ownership, or policy engines. Design systems so authn and authz are enforced on the server for every protected operation, not only in the UI.",
        a11yNotes: [
          "When access is denied, show a clear message that does not leak sensitive details about other users or resources.",
        ],
        commonMistakes: [
          "Hiding admin buttons in the UI without server-side authorization checks",
          "Assuming a valid session token implies permission for all actions",
          "Checking authorization only at login time instead of per request",
        ],
        bestPractices: [
          "Enforce authorization on the server for every sensitive endpoint",
          "Use least privilege: grant only the permissions required for a role",
          "Separate identity (authn) from access rules (authz) in code and data models",
        ],
        interviewQuestions: [
          "Give an example where a user is authenticated but not authorized.",
          "Where should authorization checks run in a web application?",
          "How do roles and permissions relate to authorization?",
        ],
        cheatSheet: [
          { tag: "authz", desc: "Authorization — deciding allowed actions" },
          { tag: "403 Forbidden", desc: "Authenticated user lacks permission for the resource" },
          { tag: "401 Unauthorized", desc: "Request lacks valid authentication credentials" },
        ],
      }),
      t({
        slug: "sessions-vs-tokens",
        title: "Sessions vs Tokens",
        summary: "Sessions store state on the server; tokens carry claims that clients present on each request.",
        estimatedMinutes: 14,
        difficulty: "beginner",
        keywords: ["session", "token", "stateful", "stateless"],
        challengeWeight: 4,
        explanation:
          "Session-based auth stores user state on the server and sends a session identifier in a cookie. The server looks up the session on each request. Token-based auth embeds claims in a signed token (often JWT) that the client sends with each request; the server validates the signature without a database lookup. Sessions simplify revocation and server-side invalidation. Tokens scale well across services but require careful expiry, refresh, and storage strategies. Many production apps combine both: short-lived access tokens plus server-side refresh token storage.",
        a11yNotes: [],
        commonMistakes: [
          "Choosing tokens solely because they are trendy without considering revocation needs",
          "Storing large session payloads in cookies instead of server-side stores",
          "Treating JWTs as encrypted when they are only signed and often readable",
        ],
        bestPractices: [
          "Pick sessions when you need immediate server-side logout and simple revocation",
          "Pick tokens when building APIs consumed by multiple clients or microservices",
          "Always set expiration regardless of session or token approach",
        ],
        interviewQuestions: [
          "What is the main difference between session and token authentication?",
          "When is a session cookie preferable to a JWT?",
          "How does the server validate each approach on incoming requests?",
        ],
        cheatSheet: [
          { tag: "session ID", desc: "Opaque identifier mapped to server-side session data" },
          { tag: "JWT", desc: "Self-contained signed token with claims" },
          { tag: "stateless", desc: "Server validates token without session store lookup" },
        ],
      }),
      t({
        slug: "passwords-hashing",
        title: "Password Hashing",
        summary: "Never store plain-text passwords; hash them with a slow, salted algorithm like bcrypt.",
        estimatedMinutes: 16,
        difficulty: "intermediate",
        keywords: ["password", "hashing", "bcrypt", "salt"],
        challengeWeight: 5,
        explanation:
          "Passwords must never be stored in plain text or reversible encryption. Use a password hashing function designed to be slow and memory-hard, such as bcrypt, scrypt, or Argon2. A unique random salt per password prevents rainbow table attacks. On login, hash the submitted password with the stored salt and compare using a constant-time function to avoid timing leaks. Configure work factors high enough to resist brute force but low enough for acceptable login latency. Password reset flows should invalidate old sessions and issue new credentials securely.",
        a11yNotes: [
          "Password fields should support paste for password managers.",
          "Provide a show/hide toggle that does not disable screen reader labels.",
        ],
        commonMistakes: [
          "Using fast hashes like MD5 or SHA-256 alone for passwords",
          "Reusing the same salt for every user",
          "Implementing custom password hashing instead of a vetted library",
        ],
        bestPractices: [
          "Use bcrypt, scrypt, or Argon2 with per-user salts",
          "Compare hashes with timing-safe equality checks",
          "Encourage strong passwords and support MFA for high-value accounts",
        ],
        interviewQuestions: [
          "Why should you not store passwords in plain text?",
          "What is a salt and why is it needed?",
          "How does bcrypt differ from a general-purpose hash?",
        ],
        cheatSheet: [
          { tag: "bcrypt", desc: "Adaptive password hash with built-in salt and cost factor" },
          { tag: "salt", desc: "Random value mixed into hash to defeat precomputed tables" },
          { tag: "timingSafeEqual", desc: "Compare secrets without leaking length via timing" },
        ],
      }),
    ],
  },
  {
    slug: "sessions",
    title: "Sessions",
    description: "Cookie-based sessions, server-side storage, CSRF basics, and secure logout.",
    topics: [
      t({
        slug: "cookie-sessions",
        title: "Cookie-Based Sessions",
        summary: "The server issues a session cookie that maps to user state stored on the server.",
        estimatedMinutes: 14,
        difficulty: "beginner",
        keywords: ["cookie", "session", "Set-Cookie", "httpOnly"],
        challengeWeight: 4,
        explanation:
          "After login, the server creates a session record (user ID, roles, expiry) and sends a Set-Cookie header with a session ID. The browser automatically sends that cookie on subsequent requests to the same site. The server loads session data from memory, Redis, or a database using the ID. Session IDs must be long, random, and unguessable. Configure cookies with HttpOnly, Secure, and SameSite flags. Regenerate the session ID after login to prevent session fixation attacks.",
        a11yNotes: [],
        commonMistakes: [
          "Using predictable session IDs like sequential integers",
          "Storing sensitive data directly inside the cookie payload without encryption",
          "Forgetting to regenerate session ID after privilege elevation",
        ],
        bestPractices: [
          "Store session data server-side; keep the cookie value opaque",
          "Set HttpOnly, Secure, and appropriate SameSite on session cookies",
          "Regenerate session ID on login and role changes",
        ],
        interviewQuestions: [
          "How does a cookie-based session work step by step?",
          "Why should session IDs be regenerated after login?",
          "What cookie flags protect session cookies?",
        ],
        cheatSheet: [
          { tag: "Set-Cookie", desc: "Response header that stores session ID in the browser" },
          { tag: "HttpOnly", desc: "Prevents JavaScript from reading the cookie" },
          { tag: "session fixation", desc: "Attacker sets victim session ID before login" },
        ],
      }),
      t({
        slug: "session-storage",
        title: "Session Storage",
        summary: "Persist sessions in memory, Redis, or a database depending on scale and durability needs.",
        estimatedMinutes: 12,
        difficulty: "intermediate",
        keywords: ["redis", "store", "persistence", "scalability"],
        challengeWeight: 4,
        explanation:
          "In-memory session stores are simple for development but do not survive restarts or scale across multiple servers. Redis is a common choice: fast, TTL support, and shared across app instances. Database-backed sessions add durability and auditability at the cost of latency. Store minimal data in the session: user ID, roles, and metadata — not full user profiles or secrets. Set TTL aligned with idle timeout and absolute expiry policies. Use sticky sessions only as a temporary crutch; prefer a shared store for horizontal scaling.",
        a11yNotes: [],
        commonMistakes: [
          "Storing large objects in sessions and bloating memory",
          "Relying on in-memory sessions in a multi-instance production deployment",
          "Never expiring sessions, allowing indefinite hijacked access",
        ],
        bestPractices: [
          "Use Redis or a database for production session storage",
          "Keep session payloads small and reference user data by ID",
          "Configure idle timeout and maximum session lifetime",
        ],
        interviewQuestions: [
          "Why is in-memory session storage problematic in production?",
          "What data should you store in a session versus fetch from a database?",
          "How do TTL and idle timeout differ for sessions?",
        ],
        cheatSheet: [
          { tag: "Redis", desc: "In-memory data store often used for shared sessions" },
          { tag: "TTL", desc: "Time-to-live before session record expires" },
          { tag: "sticky session", desc: "Route user to same server; avoid when possible" },
        ],
      }),
      t({
        slug: "csrf-basics",
        title: "CSRF Basics",
        summary: "Cross-site request forgery tricks a logged-in browser into sending unwanted authenticated requests.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["csrf", "token", "same-site", "form"],
        challengeWeight: 4,
        explanation:
          "CSRF exploits the browser's habit of sending cookies automatically. An attacker site can trigger a form POST or fetch to your app while the victim is logged in, and the session cookie goes along. Defenses include CSRF tokens (random value in form or header verified server-side), SameSite cookies (Lax or Strict), and requiring custom headers for state-changing API calls. GET requests must never change state. Double-submit cookie patterns are weaker than synchronizer tokens stored server-side.",
        a11yNotes: [],
        commonMistakes: [
          "Protecting only HTML forms but not JSON API endpoints that use cookies",
          "Using GET links for logout or delete actions",
          "Assuming CORS alone prevents CSRF",
        ],
        bestPractices: [
          "Use CSRF tokens for cookie-authenticated state-changing requests",
          "Set SameSite=Lax or Strict on session cookies",
          "Require non-simple headers or custom tokens for sensitive API mutations",
        ],
        interviewQuestions: [
          "What is a CSRF attack and how does the browser enable it?",
          "How does a CSRF token defend against forgery?",
          "Why does SameSite help but not replace CSRF tokens in all cases?",
        ],
        cheatSheet: [
          { tag: "CSRF", desc: "Cross-Site Request Forgery — forged authenticated request" },
          { tag: "CSRF token", desc: "Secret value validated on state-changing requests" },
          { tag: "SameSite", desc: "Cookie attribute limiting cross-site sending" },
        ],
      }),
      t({
        slug: "logout-and-expiry",
        title: "Logout and Session Expiry",
        summary: "Invalidate sessions on logout and enforce idle and absolute timeouts.",
        estimatedMinutes: 12,
        difficulty: "beginner",
        keywords: ["logout", "expiry", "timeout", "invalidate"],
        challengeWeight: 3,
        explanation:
          "Logout must destroy the server-side session and clear the session cookie on the client. Set the cookie Max-Age to 0 or Expires in the past. Implement idle timeout: extend activity resets a timer; inactivity ends the session. Absolute timeout caps total session length regardless of activity. On password change or suspicious activity, revoke all sessions for the user. Provide a visible logout control and confirm on shared devices. Expired sessions should redirect to login with a clear message, not a generic error.",
        a11yNotes: [
          "Logout controls must be keyboard reachable and have an accessible name.",
          "Session expiry messages should explain that the user must sign in again.",
        ],
        commonMistakes: [
          "Clearing the client cookie but leaving the server session valid",
          "No idle timeout on sensitive applications",
          "Silent failure when session expires mid-form submission",
        ],
        bestPractices: [
          "Delete server session and clear cookie on logout",
          "Apply both idle and absolute session timeouts",
          "Revoke all sessions on password reset and account compromise",
        ],
        interviewQuestions: [
          "What steps are required for secure server-side logout?",
          "What is the difference between idle and absolute session timeout?",
          "When should you invalidate all user sessions at once?",
        ],
        cheatSheet: [
          { tag: "Max-Age=0", desc: "Clears cookie by setting zero lifetime" },
          { tag: "idle timeout", desc: "Session ends after period of inactivity" },
          { tag: "session revocation", desc: "Server-side invalidation of active sessions" },
        ],
      }),
    ],
  },
  {
    slug: "tokens",
    title: "Tokens",
    description: "JWT fundamentals, access and refresh tokens, bearer headers, and client storage risks.",
    topics: [
      t({
        slug: "jwt-basics",
        title: "JWT Basics",
        summary: "A JSON Web Token encodes claims in a signed, URL-safe string with header, payload, and signature.",
        estimatedMinutes: 16,
        difficulty: "intermediate",
        keywords: ["jwt", "claims", "signature", "json"],
        challengeWeight: 5,
        explanation:
          "A JWT has three Base64url-encoded parts separated by dots: header (algorithm), payload (claims like sub, exp, iat), and signature. The server signs with a secret (HS256) or private key (RS256); recipients verify with the secret or public key. JWTs are not encrypted by default — anyone can read the payload. Never put secrets in JWT claims. Always validate signature, expiration (exp), and issuer (iss) on every request. Use short lifetimes for access tokens. Prefer asymmetric signing when multiple services verify tokens.",
        a11yNotes: [],
        commonMistakes: [
          "Storing sensitive data in JWT payload because it feels private",
          "Skipping signature verification or accepting alg=none",
          "Using JWTs where opaque server-side tokens would simplify revocation",
        ],
        bestPractices: [
          "Keep JWT payloads minimal: subject, roles, expiry, issuer",
          "Verify signature, exp, and iss on every protected request",
          "Use RS256 or ES256 when verifiers do not hold the signing secret",
        ],
        interviewQuestions: [
          "What are the three parts of a JWT?",
          "Is JWT payload encrypted or only signed?",
          "What claims should you always validate?",
        ],
        cheatSheet: [
          { tag: "JWT", desc: "JSON Web Token — header.payload.signature" },
          { tag: "exp", desc: "Expiration claim — reject tokens past this time" },
          { tag: "HS256", desc: "HMAC-SHA256 symmetric signing algorithm" },
        ],
      }),
      t({
        slug: "access-refresh-tokens",
        title: "Access and Refresh Tokens",
        summary: "Short-lived access tokens authorize requests; refresh tokens obtain new access tokens without re-login.",
        estimatedMinutes: 16,
        difficulty: "intermediate",
        keywords: ["access token", "refresh token", "rotation", "expiry"],
        challengeWeight: 5,
        explanation:
          "Access tokens are short-lived (minutes) and sent with API requests. Refresh tokens are long-lived and used only at a dedicated token endpoint to get new access tokens. Store refresh tokens securely server-side or in HttpOnly cookies; never expose them to JavaScript if avoidable. Rotate refresh tokens on each use and detect reuse to spot theft. Revoke refresh tokens on logout and password change. This pattern limits damage from a stolen access token while keeping good user experience.",
        a11yNotes: [],
        commonMistakes: [
          "Long-lived access tokens with no refresh flow",
          "Storing refresh tokens in localStorage",
          "Not revoking refresh tokens on logout",
        ],
        bestPractices: [
          "Keep access token lifetime short (5-15 minutes)",
          "Rotate refresh tokens and bind them to client or device when possible",
          "Maintain a revocation list or store for refresh token families",
        ],
        interviewQuestions: [
          "Why use separate access and refresh tokens?",
          "Where should refresh tokens be stored on the client?",
          "What is refresh token rotation?",
        ],
        cheatSheet: [
          { tag: "access token", desc: "Short-lived credential for API authorization" },
          { tag: "refresh token", desc: "Long-lived credential to obtain new access tokens" },
          { tag: "token rotation", desc: "Issue new refresh token and invalidate old one on use" },
        ],
      }),
      t({
        slug: "bearer-header",
        title: "Bearer Authorization Header",
        summary: "Send tokens in the Authorization header using the Bearer scheme for API authentication.",
        estimatedMinutes: 10,
        difficulty: "beginner",
        keywords: ["bearer", "authorization", "header", "api"],
        challengeWeight: 3,
        explanation:
          "Clients attach tokens with Authorization: Bearer <token>. The server parses the header, extracts the token, and validates it. Bearer means whoever holds the token is granted access — treat it like a password. Always use HTTPS so headers are not intercepted. Do not send bearer tokens in URL query strings where they leak via logs and Referer headers. For cookie-based APIs, consider double-submit or same-site protections instead of bearer in browsers.",
        a11yNotes: [],
        commonMistakes: [
          "Putting JWTs in URL query parameters",
          "Logging full Authorization headers in application logs",
          "Accepting tokens from multiple locations inconsistently",
        ],
        bestPractices: [
          "Use Authorization: Bearer only over HTTPS",
          "Reject tokens passed in query strings for authenticated APIs",
          "Return 401 with WWW-Authenticate when token is missing or invalid",
        ],
        interviewQuestions: [
          "What is the Bearer authorization scheme?",
          "Why should bearer tokens never appear in URLs?",
          "What HTTP status code indicates missing or invalid authentication?",
        ],
        cheatSheet: [
          { tag: "Authorization", desc: "Request header carrying Bearer token" },
          { tag: "Bearer", desc: "Scheme indicating token possession grants access" },
          { tag: "WWW-Authenticate", desc: "Response header hinting auth method on 401" },
        ],
      }),
      t({
        slug: "token-storage-risks",
        title: "Token Storage Risks",
        summary: "Where you store tokens on the client determines exposure to XSS, CSRF, and theft.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["localStorage", "memory", "xss", "storage"],
        challengeWeight: 4,
        explanation:
          "localStorage and sessionStorage are readable by any JavaScript on the page — a single XSS flaw exfiltrates all tokens stored there. HttpOnly cookies are not accessible to JS but require CSRF defenses for cookie-authenticated mutations. In-memory storage (JavaScript variable) minimizes persistence but tokens vanish on refresh unless paired with refresh tokens in HttpOnly cookies. Mobile apps use secure enclaves or keychains. There is no perfect browser storage; combine short-lived access tokens, strict CSP, and HttpOnly refresh cookies for SPAs when possible.",
        a11yNotes: [],
        commonMistakes: [
          "Storing long-lived JWTs in localStorage for convenience",
          "Assuming HttpOnly cookies alone solve all frontend auth security",
          "Ignoring XSS because tokens are in memory while innerHTML is used elsewhere",
        ],
        bestPractices: [
          "Avoid localStorage for sensitive tokens when XSS is a concern",
          "Prefer HttpOnly Secure SameSite cookies for refresh tokens",
          "Keep access tokens in memory with short expiry in SPA architectures",
        ],
        interviewQuestions: [
          "Why is localStorage risky for JWT storage?",
          "Compare cookie vs memory storage for access tokens.",
          "How does XSS interact with token storage choices?",
        ],
        cheatSheet: [
          { tag: "localStorage", desc: "Persistent browser storage accessible to all page scripts" },
          { tag: "HttpOnly cookie", desc: "Not readable by document.cookie or JS" },
          { tag: "in-memory token", desc: "Variable-held token cleared on page unload" },
        ],
      }),
    ],
  },
  {
    slug: "oauth-sso-intro",
    title: "OAuth and SSO Intro",
    description: "OAuth 2.0 flows, OpenID Connect, and patterns for social and enterprise login.",
    topics: [
      t({
        slug: "oauth2-flows-intro",
        title: "OAuth 2.0 Flows Intro",
        summary: "OAuth 2.0 delegates access through authorization codes, tokens, and registered clients.",
        estimatedMinutes: 18,
        difficulty: "intermediate",
        keywords: ["oauth2", "authorization code", "client", "redirect"],
        challengeWeight: 5,
        explanation:
          "OAuth 2.0 lets a user grant a client limited access without sharing their password with the client. The authorization code flow is preferred for web apps: user authenticates at the provider, provider redirects back with a code, client exchanges code for tokens server-side using client secret. PKCE extends this for public clients (SPAs, mobile) by adding a code verifier. Implicit and password grants are deprecated or discouraged. Scopes limit what the token can do. Always validate redirect URIs exactly against a registered allowlist.",
        a11yNotes: [
          "OAuth consent screens must be readable, keyboard navigable, and clearly state what access is granted.",
        ],
        commonMistakes: [
          "Using implicit flow or storing tokens from URL fragments in SPAs",
          "Skipping PKCE for public clients",
          "Allowing open redirect URIs during OAuth registration",
        ],
        bestPractices: [
          "Use authorization code flow with PKCE for browser and mobile apps",
          "Exchange codes on the server, never expose client secrets in frontend code",
          "Register exact redirect URIs and validate state parameter against CSRF",
        ],
        interviewQuestions: [
          "What problem does OAuth 2.0 solve?",
          "Why is authorization code flow preferred over implicit flow?",
          "What is PKCE and when is it required?",
        ],
        cheatSheet: [
          { tag: "authorization code", desc: "Short-lived code exchanged server-side for tokens" },
          { tag: "PKCE", desc: "Proof Key for Code Exchange — protects public clients" },
          { tag: "scope", desc: "Permission string limiting token access (e.g. read:profile)" },
        ],
      }),
      t({
        slug: "oidc-basics",
        title: "OpenID Connect Basics",
        summary: "OpenID Connect adds identity layers on OAuth 2.0 with ID tokens and standardized user info.",
        estimatedMinutes: 16,
        difficulty: "intermediate",
        keywords: ["oidc", "id token", "openid", "identity"],
        challengeWeight: 4,
        explanation:
          "OpenID Connect (OIDC) is an identity layer on top of OAuth 2.0. Clients request openid scope and receive an ID token (JWT) asserting who the user is, plus optionally an access token for APIs. Standard claims include sub (subject), email, and name. UserInfo endpoint returns profile claims. Validate ID token signature, iss, aud, and exp. Use OIDC for login (authentication); use OAuth scopes for API access (authorization). Discovery document (.well-known/openid-configuration) lists endpoints and keys.",
        a11yNotes: [],
        commonMistakes: [
          "Treating OAuth access token as proof of identity without openid scope",
          "Not validating aud (audience) on ID tokens",
          "Confusing ID token with access token purposes",
        ],
        bestPractices: [
          "Request openid scope when you need authenticated login",
          "Validate ID token claims including nonce for replay protection",
          "Use provider JWKS endpoint for signature verification",
        ],
        interviewQuestions: [
          "How does OIDC differ from plain OAuth 2.0?",
          "What is an ID token and what claims does it carry?",
          "Which ID token claims must you validate?",
        ],
        cheatSheet: [
          { tag: "ID token", desc: "JWT asserting authenticated user identity" },
          { tag: "sub", desc: "Subject claim — stable user identifier at provider" },
          { tag: "JWKS", desc: "JSON Web Key Set — public keys for token verification" },
        ],
      }),
      t({
        slug: "social-login-patterns",
        title: "Social Login Patterns",
        summary: "Let users sign in with Google, GitHub, or other providers using OIDC or OAuth carefully.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["social login", "google", "github", "federated"],
        challengeWeight: 4,
        explanation:
          "Social login delegates authentication to a trusted provider. Flow: redirect to provider, user consents, callback with code, server exchanges for tokens, map provider sub to local user record. Link accounts by email only with verified email from provider. Offer password login as fallback where appropriate. Display which provider was used last. Handle provider outages gracefully. Store provider subject ID, not access tokens long term unless needed for API calls. Comply with provider branding guidelines.",
        a11yNotes: [
          "Social login buttons need clear text labels, not icon-only controls without accessible names.",
          "Do not rely on color alone to distinguish provider buttons.",
        ],
        commonMistakes: [
          "Auto-creating accounts from unverified email addresses",
          "Merging accounts incorrectly when emails collide across providers",
          "Embedding provider secrets in frontend social login SDK config",
        ],
        bestPractices: [
          "Map provider sub to internal user ID; support account linking explicitly",
          "Request minimal scopes (openid, email, profile)",
          "Show users which identity provider they used and support unlinking",
        ],
        interviewQuestions: [
          "How do you safely link a social login to an existing local account?",
          "What identifier should you store from the identity provider?",
          "What scopes are typically needed for basic social login?",
        ],
        cheatSheet: [
          { tag: "federated login", desc: "Authentication delegated to external identity provider" },
          { tag: "account linking", desc: "Associate provider identity with local user record" },
          { tag: "verified email", desc: "Provider-attested email safe for account matching" },
        ],
      }),
    ],
  },
  {
    slug: "web-security",
    title: "Web Security",
    description: "XSS, CSRF in depth, CORS with credentials, and clickjacking defenses.",
    topics: [
      t({
        slug: "xss-basics",
        title: "XSS Basics",
        summary: "Cross-site scripting injects malicious scripts that run in the victim browser under your origin.",
        estimatedMinutes: 16,
        difficulty: "intermediate",
        keywords: ["xss", "injection", "sanitize", "escape"],
        challengeWeight: 5,
        explanation:
          "XSS occurs when untrusted input is rendered as executable script. Reflected XSS echoes input in a response; stored XSS saves payload in a database; DOM XSS manipulates client-side rendering. Attackers steal cookies, tokens, or perform actions as the user. Defenses: output encoding for HTML context, Content-Security-Policy, avoid innerHTML with user data, use framework auto-escaping, sanitize rich text with vetted libraries. HttpOnly cookies limit cookie theft but not actions taken via injected JS.",
        a11yNotes: [
          "Sanitize user-generated content without stripping semantic structure needed for accessibility.",
        ],
        commonMistakes: [
          "Using innerHTML or dangerouslySetInnerHTML with unsanitized user input",
          "Believing HttpOnly cookies eliminate all XSS impact",
          "Only validating input on the client",
        ],
        bestPractices: [
          "Encode output in the correct context (HTML, attribute, JavaScript, URL)",
          "Deploy a strict Content-Security-Policy",
          "Use templating frameworks that escape by default",
        ],
        interviewQuestions: [
          "What are reflected, stored, and DOM XSS?",
          "How does XSS relate to token theft in SPAs?",
          "Name three defenses against XSS.",
        ],
        cheatSheet: [
          { tag: "XSS", desc: "Cross-Site Scripting — injected script in victim page" },
          { tag: "output encoding", desc: "Escape user data before rendering in HTML" },
          { tag: "dangerouslySetInnerHTML", desc: "React API that bypasses auto-escaping — use with care" },
        ],
      }),
      t({
        slug: "csrf-deep-dive",
        title: "CSRF Deep Dive",
        summary: "Advanced CSRF defenses for SPAs, APIs, and cross-origin cookie scenarios.",
        estimatedMinutes: 16,
        difficulty: "advanced",
        keywords: ["csrf", "double-submit", "origin", "custom header"],
        challengeWeight: 5,
        explanation:
          "Modern CSRF attacks target JSON endpoints, multipart forms, and cross-site images. SameSite=Lax blocks cross-site POST cookies in many cases but not all (top-level GET navigations, some embedded flows). For SPAs using cookies, combine SameSite, CSRF tokens in headers (X-CSRF-Token), and Origin/Referer validation. Custom headers like X-Requested-With trigger CORS preflight, blocking simple cross-site form posts. Double-submit cookie pattern stores token in cookie and header — weaker if subdomains are compromised. Prefer server-side synchronizer tokens for highest assurance.",
        a11yNotes: [],
        commonMistakes: [
          "Assuming JSON Content-Type alone prevents CSRF without preflight",
          "Validating Referer with brittle string contains checks",
          "Disabling CSRF protection on API routes because they accept JSON",
        ],
        bestPractices: [
          "Validate Origin or Referer on state-changing cookie-authenticated requests",
          "Require custom headers or CSRF tokens for mutations",
          "Use SameSite=Strict for high-risk admin sessions when UX allows",
        ],
        interviewQuestions: [
          "Why might SameSite=Lax not stop every CSRF attack?",
          "How does a custom header defend against simple CSRF?",
          "Compare synchronizer token vs double-submit cookie patterns.",
        ],
        cheatSheet: [
          { tag: "Origin header", desc: "Request source origin validated against allowlist" },
          { tag: "X-CSRF-Token", desc: "Custom header carrying CSRF token for APIs" },
          { tag: "preflight", desc: "CORS OPTIONS check before non-simple cross-origin request" },
        ],
      }),
      t({
        slug: "cors-and-credentials",
        title: "CORS and Credentials",
        summary: "Cross-Origin Resource Sharing controls which origins may read responses and send cookies.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["cors", "credentials", "origin", "preflight"],
        challengeWeight: 4,
        explanation:
          "Browsers enforce same-origin policy. CORS headers let servers opt in to cross-origin access. Access-Control-Allow-Origin must echo a specific origin (not *) when credentials (cookies) are sent. Client uses credentials: include in fetch. Access-Control-Allow-Credentials: true required on server. Preflight OPTIONS requests validate methods and headers for non-simple requests. CORS is not auth — it only relaxes browser read restrictions. Attackers cannot read responses cross-origin without proper Allow-Origin, but CSRF can still send requests.",
        a11yNotes: [],
        commonMistakes: [
          "Using Access-Control-Allow-Origin: * with credentials: include",
          "Treating CORS as a substitute for authentication",
          "Reflecting any Origin header without an allowlist check",
        ],
        bestPractices: [
          "Maintain an explicit allowlist of trusted origins",
          "Never reflect arbitrary Origin values in production",
          "Combine CORS policy with authn, authz, and CSRF defenses",
        ],
        interviewQuestions: [
          "Why cannot Allow-Origin be * when cookies are included?",
          "What triggers a CORS preflight request?",
          "Does CORS prevent CSRF?",
        ],
        cheatSheet: [
          { tag: "Access-Control-Allow-Origin", desc: "Permitted origin for cross-origin response read" },
          { tag: "credentials: include", desc: "Fetch option to send cookies cross-origin" },
          { tag: "Allow-Credentials", desc: "Server header permitting cookie cross-origin requests" },
        ],
      }),
      t({
        slug: "clickjacking-headers",
        title: "Clickjacking and Security Headers",
        summary: "Prevent your site from being framed for UI redress attacks using X-Frame-Options and CSP frame-ancestors.",
        estimatedMinutes: 12,
        difficulty: "intermediate",
        keywords: ["clickjacking", "x-frame-options", "frame-ancestors", "headers"],
        challengeWeight: 3,
        explanation:
          "Clickjacking embeds your site in a transparent iframe and tricks users into clicking hidden buttons. Defenses: X-Frame-Options: DENY or SAMEORIGIN, and Content-Security-Policy frame-ancestors directive (preferred modern approach). For intentional embeds (widgets), use frame-ancestors with specific partner origins. Combine with X-Content-Type-Options: nosniff and Referrer-Policy for defense in depth. Test that payment and admin pages cannot be framed.",
        a11yNotes: [],
        commonMistakes: [
          "Allowing all origins to frame sensitive pages",
          "Setting conflicting X-Frame-Options and CSP frame-ancestors values",
          "Forgetting clickjacking protection on OAuth consent pages",
        ],
        bestPractices: [
          "Set frame-ancestors in CSP for fine-grained control",
          "Use DENY or SAMEORIGIN for admin and account settings pages",
          "Audit third-party embed requirements before relaxing frame policy",
        ],
        interviewQuestions: [
          "What is a clickjacking attack?",
          "How does frame-ancestors differ from X-Frame-Options?",
          "When might you allow specific origins to frame your app?",
        ],
        cheatSheet: [
          { tag: "X-Frame-Options", desc: "Legacy header controlling whether page may be framed" },
          { tag: "frame-ancestors", desc: "CSP directive listing allowed embedding origins" },
          { tag: "clickjacking", desc: "Tricking clicks on invisible overlaid iframe" },
        ],
      }),
    ],
  },
  {
    slug: "secure-defaults",
    title: "Secure Defaults",
    description: "HTTPS, HSTS, secure cookies, SameSite, and Content Security Policy fundamentals.",
    topics: [
      t({
        slug: "https-hsts",
        title: "HTTPS and HSTS",
        summary: "Encrypt traffic with TLS and use HTTP Strict Transport Security to prevent downgrade attacks.",
        estimatedMinutes: 14,
        difficulty: "beginner",
        keywords: ["https", "tls", "hsts", "certificate"],
        challengeWeight: 4,
        explanation:
          "HTTPS encrypts data in transit between client and server using TLS. Without it, passwords and tokens are visible on the network. Redirect all HTTP to HTTPS. HSTS (Strict-Transport-Security) tells browsers to use HTTPS only for your domain for a max-age period, blocking sslstrip downgrade. Use includeSubDomains and preload carefully after full HTTPS coverage. Terminate TLS at load balancer or app with valid certificates from a trusted CA. Enable modern TLS versions and disable weak ciphers.",
        a11yNotes: [],
        commonMistakes: [
          "Serving login pages over HTTP on public Wi-Fi",
          "Enabling HSTS preload before all subdomains support HTTPS",
          "Mixed content: HTTPS page loading HTTP scripts or images",
        ],
        bestPractices: [
          "Force HTTPS for all routes including static assets",
          "Set Strict-Transport-Security with appropriate max-age in production",
          "Use automated certificate renewal (e.g. Let's Encrypt)",
        ],
        interviewQuestions: [
          "Why is HTTPS required for authentication?",
          "What does the HSTS header do?",
          "What is a mixed content warning?",
        ],
        cheatSheet: [
          { tag: "TLS", desc: "Transport Layer Security — encrypts HTTP traffic" },
          { tag: "Strict-Transport-Security", desc: "HSTS header forcing HTTPS for max-age" },
          { tag: "mixed content", desc: "HTTPS page loading insecure HTTP subresources" },
        ],
      }),
      t({
        slug: "secure-cookie-flags",
        title: "Secure Cookie Flags",
        summary: "Configure HttpOnly, Secure, Path, and Domain on cookies to limit exposure and scope.",
        estimatedMinutes: 12,
        difficulty: "beginner",
        keywords: ["secure", "httpOnly", "cookie", "flags"],
        challengeWeight: 4,
        explanation:
          "Secure flag sends cookie only over HTTPS. HttpOnly prevents JavaScript access, reducing XSS cookie theft. Path and Domain limit which URLs receive the cookie — use the narrowest scope that works. Avoid setting Domain to parent domain unless all subdomains are equally trusted. Max-Age or Expires controls lifetime. __Host- prefix cookies require Secure, Path=/, and no Domain — strongest session cookie pattern. Review every Set-Cookie in your app and third-party integrations.",
        a11yNotes: [],
        commonMistakes: [
          "Missing Secure flag on production session cookies",
          "Overly broad Domain=.example.com exposing cookies to all subdomains",
          "Storing non-session data in cookies without considering size limits",
        ],
        bestPractices: [
          "Set Secure and HttpOnly on all authentication cookies",
          "Use __Host- prefix for primary session cookies when supported",
          "Keep cookie scope as narrow as possible",
        ],
        interviewQuestions: [
          "What do Secure and HttpOnly cookie flags do?",
          "When would you use the __Host- cookie prefix?",
          "How do Path and Domain affect cookie sending?",
        ],
        cheatSheet: [
          { tag: "Secure", desc: "Cookie sent only over HTTPS connections" },
          { tag: "HttpOnly", desc: "Cookie inaccessible to document.cookie and JS APIs" },
          { tag: "__Host-", desc: "Cookie prefix requiring Secure, Path=/, no Domain" },
        ],
      }),
      t({
        slug: "sameSite",
        title: "SameSite Cookie Attribute",
        summary: "SameSite controls whether cookies are sent on cross-site requests, mitigating CSRF and tracking.",
        estimatedMinutes: 12,
        difficulty: "intermediate",
        keywords: ["sameSite", "lax", "strict", "cross-site"],
        challengeWeight: 4,
        explanation:
          "SameSite has three values: Strict (never sent on cross-site navigation), Lax (sent on top-level GET navigations), None (sent cross-site, requires Secure). Modern browsers default new cookies to Lax. Use Lax for most session cookies. Use Strict for high-security admin panels when full cross-site navigation is not needed. SameSite=None with Secure is required for embedded cross-site flows (iframes, OAuth callbacks on POST). Test OAuth and payment flows after tightening SameSite.",
        a11yNotes: [],
        commonMistakes: [
          "Setting SameSite=Strict and breaking OAuth redirect flows",
          "Forgetting Secure when using SameSite=None",
          "Assuming SameSite replaces all CSRF protections",
        ],
        bestPractices: [
          "Default session cookies to SameSite=Lax in application code",
          "Use SameSite=None; Secure only when cross-site cookie is required",
          "Test third-party integrations after SameSite policy changes",
        ],
        interviewQuestions: [
          "Explain SameSite Strict, Lax, and None.",
          "Why does SameSite=None require the Secure flag?",
          "How does SameSite help mitigate CSRF?",
        ],
        cheatSheet: [
          { tag: "SameSite", desc: "Cookie attribute limiting cross-site request inclusion" },
          { tag: "SameSite=Lax", desc: "Default-safe mode; allows top-level GET cross-site" },
          { tag: "SameSite=None", desc: "Allows cross-site cookies; must pair with Secure" },
        ],
      }),
      t({
        slug: "content-security-policy-intro",
        title: "Content Security Policy Intro",
        summary: "CSP restricts which scripts, styles, and resources may load, reducing XSS impact.",
        estimatedMinutes: 16,
        difficulty: "intermediate",
        keywords: ["csp", "content-security-policy", "nonce", "inline"],
        challengeWeight: 4,
        explanation:
          "Content-Security-Policy is an HTTP header (or meta tag) listing allowed sources for scripts, styles, images, connections, and frames. Example: default-src 'self'; script-src 'self' 'nonce-abc'. Block inline scripts unless nonced or hashed. Start with Content-Security-Policy-Report-Only to collect violations without breaking the site. Avoid unsafe-inline and unsafe-eval in production. Combine with Subresource Integrity for CDN scripts. CSP complements escaping — it limits damage when XSS slips through.",
        a11yNotes: [
          "Ensure CSP allows fonts and styles needed for accessible typography and focus indicators.",
        ],
        commonMistakes: [
          "Deploying strict CSP without report-only testing and breaking production",
          "Using unsafe-inline broadly and defeating CSP purpose",
          "Forgetting connect-src and blocking API or WebSocket calls",
        ],
        bestPractices: [
          "Roll out CSP in Report-Only mode first",
          "Use nonces or hashes for required inline scripts",
          "Define explicit directives: script-src, style-src, connect-src, frame-ancestors",
        ],
        interviewQuestions: [
          "What problem does Content Security Policy solve?",
          "What is the difference between enforcing and Report-Only CSP?",
          "How do script nonces work with CSP?",
        ],
        cheatSheet: [
          { tag: "CSP", desc: "Content-Security-Policy — allowlist for page resources" },
          { tag: "script-src", desc: "Directive controlling JavaScript load sources" },
          { tag: "nonce", desc: "One-time token authorizing specific inline script block" },
        ],
      }),
    ],
  },
  {
    slug: "access-control",
    title: "Access Control",
    description: "Role-based access, least privilege, route protection, and insecure direct object reference prevention.",
    topics: [
      t({
        slug: "rbac-basics",
        title: "RBAC Basics",
        summary: "Role-Based Access Control assigns permissions to roles and roles to users.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["rbac", "roles", "permissions", "access"],
        challengeWeight: 4,
        explanation:
          "RBAC models users, roles, and permissions. Users receive roles (admin, editor, viewer); roles bundle permissions (posts:write, users:delete). Check permissions at the resource or endpoint level. Avoid hardcoding role strings throughout the codebase — centralize policy. Support role hierarchy where senior roles inherit junior permissions. Separate authentication (who) from role assignment (what hat they wear). Audit role changes. For fine-grained cases, combine RBAC with attribute-based checks (ownership, department).",
        a11yNotes: [],
        commonMistakes: [
          "Checking only isAdmin boolean instead of granular permissions",
          "Granting admin role by default to first registered user in production",
          "Duplicating authorization logic in frontend and backend inconsistently",
        ],
        bestPractices: [
          "Model permissions explicitly and assign them to roles",
          "Enforce RBAC checks server-side on every protected action",
          "Log and review role elevation and permission changes",
        ],
        interviewQuestions: [
          "How do users, roles, and permissions relate in RBAC?",
          "Where should RBAC checks run in a web application?",
          "When might RBAC alone be insufficient?",
        ],
        cheatSheet: [
          { tag: "RBAC", desc: "Role-Based Access Control — permissions via roles" },
          { tag: "permission", desc: "Atomic action allowed on a resource type" },
          { tag: "role hierarchy", desc: "Senior roles inherit junior role permissions" },
        ],
      }),
      t({
        slug: "least-privilege",
        title: "Principle of Least Privilege",
        summary: "Grant every user and service only the minimum access required to perform their job.",
        estimatedMinutes: 12,
        difficulty: "intermediate",
        keywords: ["least privilege", "minimal access", "principle", "scope"],
        challengeWeight: 3,
        explanation:
          "Least privilege limits blast radius when accounts are compromised or misconfigured. Users get default deny; permissions are added explicitly. Service accounts for cron jobs or APIs receive narrow scopes. Database users for the app should not have DROP or SUPER privileges. Temporary elevation (just-in-time admin) beats standing admin access. Review permissions periodically and remove stale grants. OAuth scopes should request minimum needed, not full account access.",
        a11yNotes: [],
        commonMistakes: [
          "Shared admin credentials across team members",
          "Production database using root credentials in application config",
          "Never revoking access after role change or offboarding",
        ],
        bestPractices: [
          "Start from deny-all and add permissions explicitly",
          "Use separate credentials per environment and service",
          "Automate access reviews and deprovisioning on offboarding",
        ],
        interviewQuestions: [
          "What is the principle of least privilege?",
          "Give an example of violating least privilege in a web app.",
          "How does least privilege apply to OAuth scopes?",
        ],
        cheatSheet: [
          { tag: "least privilege", desc: "Minimum access needed — nothing more" },
          { tag: "default deny", desc: "Block all access until explicitly granted" },
          { tag: "JIT access", desc: "Just-in-time temporary elevation for admin tasks" },
        ],
      }),
      t({
        slug: "protecting-routes",
        title: "Protecting Routes and Endpoints",
        summary: "Guard pages and APIs with middleware that verifies authentication and authorization before handlers run.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["middleware", "guard", "route", "endpoint"],
        challengeWeight: 4,
        explanation:
          "Apply auth middleware at the framework level: Next.js middleware, Express routers, or API gateway rules. Unauthenticated requests redirect to login or receive 401 JSON. Authorization middleware checks roles or permissions before controller logic. Fail closed: missing middleware means deny, not allow. Protect static routes, server actions, and background jobs consistently. Client-side route guards improve UX but are not security boundaries. Document which routes are public, authenticated, or admin-only.",
        a11yNotes: [
          "Redirect to login should preserve a clear page title and focus management for screen reader users.",
        ],
        commonMistakes: [
          "Protecting pages but leaving corresponding API routes public",
          "Opt-in auth middleware instead of default-protect with explicit public exceptions",
          "Returning 200 with empty data instead of 403 for unauthorized API calls",
        ],
        bestPractices: [
          "Default-deny: require auth unless route is explicitly public",
          "Use centralized middleware or decorators for consistent checks",
          "Return correct status codes: 401 unauthenticated, 403 unauthorized",
        ],
        interviewQuestions: [
          "Why are client-side route guards insufficient for security?",
          "What is fail-closed authorization design?",
          "How do middleware and handler-level checks work together?",
        ],
        cheatSheet: [
          { tag: "auth middleware", desc: "Layer verifying identity before route handler" },
          { tag: "fail closed", desc: "Deny access when check is missing or ambiguous" },
          { tag: "public allowlist", desc: "Explicit list of routes requiring no authentication" },
        ],
      }),
      t({
        slug: "idor-basics",
        title: "IDOR Basics",
        summary: "Insecure Direct Object Reference lets users access resources by changing IDs without authorization checks.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["idor", "object reference", "authorization", "uuid"],
        challengeWeight: 5,
        explanation:
          "IDOR occurs when /api/orders/123 returns any order if the user changes 123 to 124 without verifying ownership. Never rely on obscurity of sequential IDs. Always check that the authenticated user may access the requested resource ID. Use unpredictable UUIDs to reduce scanning but still enforce authorization. Include user or tenant ID in queries: WHERE id = ? AND user_id = ?. Test with two user accounts swapping resource IDs. Log repeated IDOR probes as potential abuse.",
        a11yNotes: [],
        commonMistakes: [
          "Assuming UUIDs alone prevent unauthorized access",
          "Checking authentication but not resource ownership",
          "Exposing internal sequential IDs in public URLs without access checks",
        ],
        bestPractices: [
          "Authorize every read and write against the specific resource instance",
          "Scope database queries by authenticated user or tenant",
          "Add automated tests that attempt cross-user resource access",
        ],
        interviewQuestions: [
          "What is an IDOR vulnerability?",
          "Why are UUIDs not a substitute for authorization?",
          "How do you fix IDOR in a REST API?",
        ],
        cheatSheet: [
          { tag: "IDOR", desc: "Insecure Direct Object Reference — access via ID manipulation" },
          { tag: "ownership check", desc: "Verify resource belongs to requesting user" },
          { tag: "tenant scope", desc: "Filter queries by organization or user context" },
        ],
      }),
    ],
  },
  {
    slug: "secrets-ops",
    title: "Secrets and Ops",
    description: "Environment secrets, key rotation, and introductory audit logging for security operations.",
    topics: [
      t({
        slug: "env-secrets",
        title: "Environment Secrets",
        summary: "Store API keys, database passwords, and signing secrets in environment variables or a secret manager.",
        estimatedMinutes: 12,
        difficulty: "beginner",
        keywords: ["env", "secrets", "dotenv", "manager"],
        challengeWeight: 4,
        explanation:
          "Secrets must not live in source code or client bundles. Use environment variables injected at deploy time or a secret manager (AWS Secrets Manager, HashiCorp Vault, Doppler). .env files are for local development only — add .env to .gitignore. Never prefix server secrets with NEXT_PUBLIC_ or VITE_ — those embed in client JavaScript. Rotate secrets when team members leave. Separate dev, staging, and production credentials. Scan repositories for accidental commits with tools like git-secrets or GitHub secret scanning.",
        a11yNotes: [],
        commonMistakes: [
          "Committing .env files with production keys to Git",
          "Exposing JWT signing secrets via NEXT_PUBLIC_ environment variables",
          "Sharing one production API key across all developers",
        ],
        bestPractices: [
          "Use a secret manager or CI-injected env vars in production",
          "Keep .env out of version control; provide .env.example without values",
          "Audit client bundles to ensure no server secrets are included",
        ],
        interviewQuestions: [
          "Where should database passwords be stored in a Node app?",
          "Why must JWT secrets not use NEXT_PUBLIC_ prefix in Next.js?",
          "What is the purpose of .env.example?",
        ],
        cheatSheet: [
          { tag: ".env", desc: "Local env file — never commit with real secrets" },
          { tag: "secret manager", desc: "Centralized secure storage for credentials" },
          { tag: "NEXT_PUBLIC_", desc: "Next.js prefix exposing var to client bundle" },
        ],
      }),
      t({
        slug: "rotating-keys",
        title: "Rotating Keys and Credentials",
        summary: "Periodically replace signing keys, API tokens, and passwords to limit exposure window.",
        estimatedMinutes: 14,
        difficulty: "advanced",
        keywords: ["rotation", "keys", "revocation", "jwks"],
        challengeWeight: 4,
        explanation:
          "Rotation replaces compromised or aged credentials before attackers exploit long-lived leaks. For JWT asymmetric keys, publish multiple keys in JWKS and sign with the new key while verifying with both during overlap. Invalidate all sessions on signing key compromise. Automate rotation schedules for database passwords and API keys. Support graceful rollover without downtime. Document emergency rotation runbooks. After rotation, monitor for auth failures indicating clients still using old credentials.",
        a11yNotes: [],
        commonMistakes: [
          "Never rotating JWT signing keys for years",
          "Instantly removing old verification key before all tokens expire",
          "Manual rotation without automation leading to skipped cycles",
        ],
        bestPractices: [
          "Support multiple active verification keys during rotation window",
          "Automate rotation with secret manager versioning",
          "Maintain a runbook for emergency key compromise response",
        ],
        interviewQuestions: [
          "Why rotate signing keys and API credentials?",
          "How do you rotate JWT keys without logging everyone out instantly?",
          "What steps follow a suspected key leak?",
        ],
        cheatSheet: [
          { tag: "key rotation", desc: "Periodic replacement of cryptographic or API keys" },
          { tag: "JWKS overlap", desc: "Publish old and new public keys during transition" },
          { tag: "revocation", desc: "Immediate invalidation after confirmed compromise" },
        ],
      }),
      t({
        slug: "audit-logging-intro",
        title: "Audit Logging Intro",
        summary: "Record security-relevant events for detection, forensics, and compliance without logging secrets.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["audit", "logging", "forensics", "compliance"],
        challengeWeight: 3,
        explanation:
          "Audit logs capture who did what, when, and from where: logins, failed logins, password changes, role updates, data exports, and admin actions. Include timestamp, actor ID, action, resource ID, IP, and user agent. Never log passwords, tokens, or full credit card numbers. Ship logs to immutable or centralized storage (SIEM). Set alerts on suspicious patterns: brute force, privilege escalation, mass data access. Retention policies balance investigation needs and privacy regulations.",
        a11yNotes: [],
        commonMistakes: [
          "Logging Authorization headers or session cookies",
          "No logging of failed authentication attempts",
          "Mutable local log files that attackers can delete after compromise",
        ],
        bestPractices: [
          "Log security events with structured JSON and correlation IDs",
          "Exclude secrets and PII beyond what investigation requires",
          "Forward audit logs to tamper-resistant centralized storage",
        ],
        interviewQuestions: [
          "What events should an authentication audit log capture?",
          "What must never appear in security audit logs?",
          "How do audit logs support incident response?",
        ],
        cheatSheet: [
          { tag: "audit log", desc: "Tamper-aware record of security-sensitive actions" },
          { tag: "correlation ID", desc: "Trace ID linking related requests across services" },
          { tag: "SIEM", desc: "Security Information and Event Management aggregation" },
        ],
      }),
    ],
  },
  {
    slug: "best-practices",
    title: "Best Practices",
    description: "Avoid custom crypto, lightweight threat modeling, and daily secure coding habits.",
    topics: [
      t({
        slug: "never-roll-your-own-crypto",
        title: "Never Roll Your Own Crypto",
        summary: "Use vetted libraries and standards for hashing, encryption, and token signing.",
        estimatedMinutes: 12,
        difficulty: "intermediate",
        keywords: ["crypto", "library", "standards", "bcrypt"],
        challengeWeight: 4,
        explanation:
          "Cryptography is easy to get wrong. Custom ciphers, homemade random generators, and DIY JWT libraries introduce subtle flaws attackers exploit. Use platform and community-vetted tools: bcrypt or Argon2 for passwords, crypto.randomBytes for tokens, jsonwebtoken or jose for JWT, TLS libraries for transport. Follow OWASP and RFC guidance. When you need encryption at rest, use AES-GCM via established libraries with random IVs. Have security-sensitive code reviewed by experts.",
        a11yNotes: [],
        commonMistakes: [
          "Implementing password hashing with a single SHA-256 pass",
          "Using Math.random for session or CSRF tokens",
          "Parsing JWT manually without signature verification library",
        ],
        bestPractices: [
          "Depend on maintained cryptographic libraries",
          "Use randomBytes or Web Crypto for unpredictable tokens",
          "Follow OWASP Cryptographic Storage Cheat Sheet",
        ],
        interviewQuestions: [
          "Why should developers avoid custom cryptography?",
          "What should you use instead of Math.random for security tokens?",
          "Name vetted tools for password hashing and JWT handling.",
        ],
        cheatSheet: [
          { tag: "crypto.randomBytes", desc: "CSPRNG for session and CSRF tokens" },
          { tag: "Argon2", desc: "Modern password hashing winner of PHC" },
          { tag: "OWASP", desc: "Open guidance on secure coding and crypto storage" },
        ],
      }),
      t({
        slug: "threat-modeling-lite",
        title: "Threat Modeling Lite",
        summary: "Identify assets, trust boundaries, and likely attacks before building auth features.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["threat model", "stride", "assets", "boundaries"],
        challengeWeight: 3,
        explanation:
          "Lightweight threat modeling asks: what are we protecting, who might attack, and how? List assets (user data, admin panel, API keys). Draw trust boundaries (browser, server, database, third-party OAuth). Use STRIDE lightly: Spoofing, Tampering, Repetition, Information disclosure, Denial of service, Elevation. For each feature (login, file upload), name one abuse case and one mitigation. Run a 30-minute session before major auth changes. No formal diagrams required — a whiteboard list suffices for small teams.",
        a11yNotes: [],
        commonMistakes: [
          "Shipping auth features without considering abuse cases",
          "Threat modeling only after a security incident",
          "Focusing only on external hackers and ignoring insider threats",
        ],
        bestPractices: [
          "Run a short threat review for every new auth or payment feature",
          "Document top threats and mitigations in ticket or design doc",
          "Revisit model when architecture changes (new API, mobile client)",
        ],
        interviewQuestions: [
          "What is a trust boundary in threat modeling?",
          "Name two STRIDE categories relevant to login flows.",
          "How would you threat-model a password reset feature?",
        ],
        cheatSheet: [
          { tag: "STRIDE", desc: "Spoofing, Tampering, Repudiation, Info disclosure, DoS, Elevation" },
          { tag: "trust boundary", desc: "Line where data crosses between components" },
          { tag: "abuse case", desc: "Scenario describing how a feature could be misused" },
        ],
      }),
      t({
        slug: "secure-coding-habits",
        title: "Secure Coding Habits",
        summary: "Daily practices that reduce vulnerabilities: validate input, parameterize queries, and keep dependencies updated.",
        estimatedMinutes: 12,
        difficulty: "beginner",
        keywords: ["secure coding", "validation", "dependencies", "owasp"],
        challengeWeight: 3,
        explanation:
          "Security is a habit, not a one-time audit. Validate and sanitize all input on the server. Use parameterized queries or ORMs to prevent SQL injection. Encode output for the correct context. Keep frameworks and npm packages updated; enable Dependabot or npm audit in CI. Use type-safe APIs and lint rules. Review pull requests for auth bypass and secret leaks. Practice responsible disclosure if you find bugs. Read OWASP Top 10 yearly and map each item to your stack.",
        a11yNotes: [],
        commonMistakes: [
          "Client-only validation for security-sensitive fields",
          "Ignoring npm audit warnings in production dependencies",
          "Copy-pasting Stack Overflow auth snippets without understanding",
        ],
        bestPractices: [
          "Validate on server; treat client validation as UX only",
          "Automate dependency scanning in CI pipeline",
          "Include security checklist items in code review templates",
        ],
        interviewQuestions: [
          "Why must validation happen on the server?",
          "How do parameterized queries prevent SQL injection?",
          "What is the OWASP Top 10?",
        ],
        cheatSheet: [
          { tag: "parameterized query", desc: "SQL with bound params — prevents injection" },
          { tag: "npm audit", desc: "Scan dependencies for known vulnerabilities" },
          { tag: "OWASP Top 10", desc: "Common web application security risks list" },
        ],
      }),
    ],
  },
  {
    slug: "mini-projects",
    title: "Mini Projects",
    description: "Hands-on projects building session login and JWT-protected API patterns.",
    topics: [
      t({
        slug: "project-login-session",
        title: "Project: Login with Session Cookies",
        summary: "Build a complete login flow with hashed passwords, server sessions, CSRF protection, and secure logout.",
        estimatedMinutes: 45,
        difficulty: "intermediate",
        keywords: ["project", "login", "session", "csrf"],
        challengeWeight: 5,
        explanation:
          "Implement registration and login against a database with bcrypt password hashing. On success, create a server-side session (Redis or in-memory for dev) and set an HttpOnly, Secure, SameSite=Lax session cookie. Add CSRF token to login and logout forms or API mutations. Regenerate session ID after login. Implement idle timeout and explicit logout that destroys server session and clears cookie. Protect at least one route requiring authentication. Return 401 for unauthenticated API access. Test with two browsers to verify session isolation.",
        a11yNotes: [
          "Login and registration forms need associated labels, error summaries, and keyboard-submit support.",
          "Announce authentication errors in a live region without exposing whether username exists.",
        ],
        commonMistakes: [
          "Skipping CSRF protection on the logout endpoint",
          "Storing plaintext passwords for demo convenience",
          "Forgetting to regenerate session ID after successful login",
        ],
        bestPractices: [
          "Use bcrypt with appropriate cost factor for password storage",
          "Apply all secure cookie flags in production configuration",
          "Write integration tests for login, protected route, and logout flows",
        ],
        interviewQuestions: [
          "Walk through your session login project architecture.",
          "How did you protect against CSRF in your login project?",
          "What cookie flags did you set and why?",
        ],
        cheatSheet: [
          { tag: "bcrypt", desc: "Hash passwords before storing in database" },
          { tag: "Set-Cookie", desc: "Issue HttpOnly session cookie on login" },
          { tag: "CSRF token", desc: "Validate on logout and state-changing forms" },
        ],
      }),
      t({
        slug: "project-jwt-protected-api",
        title: "Project: JWT Protected API",
        summary: "Create an API that issues JWT access tokens and protects routes with bearer authentication middleware.",
        estimatedMinutes: 50,
        difficulty: "advanced",
        keywords: ["project", "jwt", "api", "bearer"],
        challengeWeight: 5,
        explanation:
          "Build POST /auth/login returning a short-lived JWT access token and optional refresh token. Sign with HS256 (dev) or RS256 (production pattern). Protect GET /profile and other routes with middleware verifying Authorization: Bearer token, signature, and exp claim. Reject expired and malformed tokens with 401. Store refresh tokens server-side if implemented; rotate on use. Do not store access tokens in localStorage if demo runs in browser — use memory or document tradeoffs. Add rate limiting on login. Document API with example curl commands.",
        a11yNotes: [],
        commonMistakes: [
          "Skipping exp validation in JWT middleware",
          "Using alg none or accepting tokens without signature verify",
          "Long-lived access tokens with no refresh or revocation strategy",
        ],
        bestPractices: [
          "Centralize JWT verify logic in reusable middleware",
          "Keep access token TTL under 15 minutes",
          "Return consistent 401 JSON body for auth failures",
        ],
        interviewQuestions: [
          "Describe your JWT protected API authentication flow.",
          "How does your middleware validate incoming bearer tokens?",
          "How would you add refresh token rotation to your project?",
        ],
        cheatSheet: [
          { tag: "JWT", desc: "Sign access token with secret or private key" },
          { tag: "Bearer", desc: "Clients send Authorization: Bearer <token>" },
          { tag: "middleware", desc: "Verify signature and exp before route handler" },
        ],
      }),
    ],
  },
];

export function flattenAuthTopics(): AuthTopicDef[] {
  return AUTH_ACADEMY_SECTIONS.flatMap((section) => section.topics);
}
