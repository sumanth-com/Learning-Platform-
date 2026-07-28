import type { HubSection } from "../../types";
import { sec } from "./_helpers";

export const buildSaasFromScratchMeta = {
  overviewBody: `Shipping SaaS is tenancy + identity + billing + operability under one product. The MVP is not "auth and a landing page" — it is the smallest system where a stranger can sign up, pay, use the core value, and you can debug their session at 2am.

This guide covers tenancy models, authz, Stripe webhooks with idempotency, environment strategy, observability minimums, and where to cut scope without painting yourself into a migration corner.`,
  objectives: [
    "Choose a tenancy model and enforce it at the data layer, not only middleware",
    "Design RBAC and org switching suitable for B2B",
    "Integrate Stripe billing with idempotent webhooks and entitlement sync",
    "Define MVP cut line, environments, and ops baseline before feature sprawl",
  ],
  prerequisites: [
    "Full-stack web development (React/Next + SQL backend)",
    "Basic Stripe Checkout or Billing API exposure",
    "Understand multi-tenant data isolation concepts",
  ],
  takeaways: [
    "tenant_id on every row + scoped queries beats schema-per-tenant until scale forces otherwise",
    "Billing state lives in your DB; Stripe is source of payment truth, you are source of entitlements",
    "Webhook idempotency and signature verification are day-one, not post-launch",
    "MVP = signup → pay → core loop → admin can see tenant health — everything else waits",
  ],
};

export const buildSaasFromScratchSections: HubSection[] = [
  sec(
    "tenancy",
    "1. Tenancy models",
    `Tenancy is how you isolate customer data. Choose for ops cost and query simplicity, not resume keywords.

Models:
• Row-level (shared schema, tenant_id column) — default for B2B SaaS MVP→scale
• Schema-per-tenant — stronger isolation, migration nightmare at 500+ tenants
• DB-per-tenant — enterprise/regulated; heavy ops, best blast-radius isolation
• Silo via account/org — user belongs to org; org is billing + data boundary

Row-level requirements:
• tenant_id (or org_id) on every tenant-owned table — FK enforced
• Composite indexes leading with tenant_id
• Middleware sets request.tenant from session — never from client body alone
• Integration tests that prove cross-tenant reads return 404, not 403 leak

Signup flow:
• User creates account → default org created → user is owner
• Invite flow: email token → accept → membership row with role

Migration path: row-level → schema-per-tenant only when legal/compliance or noisy-neighbor DB load demands it — not at 10 customers.`,
    {
      checklist: [
        "Every query scoped by tenant_id — lint or CI check",
        "Cross-tenant integration test in CI",
        "Soft-delete tenant with retention policy documented",
      ],
    }
  ),
  sec(
    "authz",
    "2. Authn, authz & roles",
    `B2B SaaS authz is org-scoped RBAC with a small role set that actually maps to product permissions.

Starter roles:
• owner — billing, delete org, manage members
• admin — settings, invites, integrations
• member — use product features
• viewer — read-only (if product supports)

Implementation:
• memberships(user_id, org_id, role) — unique (user_id, org_id)
• permissions resolved server-side: can(user, org, action, resource)
• UI hides buttons; API enforces — always

Org switching:
• session.active_org_id updated on switch; audit log entry
• Resources fetched only within active org unless super-admin support tools

Enterprise later:
• SSO (SAML/OIDC) per org, domain verification, SCIM provisioning
• Custom roles — only when standard four roles break sales deals`,
    {
      bullets: [
        "Seed default roles on org creation",
        "Last owner cannot leave without transfer",
        "Service accounts for API keys with scoped permissions",
      ],
    }
  ),
  sec(
    "billing",
    "3. Stripe billing & webhooks",
    `Stripe handles cards; you handle entitlements. Desync between them is a support ticket factory.

Core objects:
• customers — Stripe customer id ↔ org_id
• subscriptions — plan, status, current_period_end
• prices/products — defined in Stripe, mirrored in config

Checkout flow:
• Create Checkout Session with client_reference_id = org_id
• Success URL → poll or webhook before unlocking features

Webhook essentials:
• Verify signature (raw body, stripe-signature header)
• Idempotency: store event.id processed; skip duplicates
• Handle at minimum: checkout.session.completed, customer.subscription.updated, customer.subscription.deleted, invoice.payment_failed

Entitlement sync pattern:
• Webhook handler updates subscriptions table → emits internal event → feature flags read DB
• Never call Stripe API on every request for plan check — cache in DB

Trials & proration:
• trial_end on subscription row; cron or webhook clears trial features
• Document upgrade/downgrade: immediate vs period-end (Stripe proration_behavior)`,
    {
      code: [
        {
          language: "typescript",
          title: "Webhook idempotency sketch",
          code: `async function handleStripeEvent(event: Stripe.Event) {
  const inserted = await db.stripeEvents.insert({
    id: event.id,
    type: event.type,
    payload: event,
  }).onConflict('id').ignore();

  if (!inserted) return; // duplicate delivery

  switch (event.type) {
    case 'customer.subscription.updated':
      await syncSubscription(event.data.object);
      break;
  }
}`,
        },
      ],
      checklist: [
        "Webhook endpoint returns 2xx only after durable write",
        "Stripe CLI used in local dev",
        "Failed payment degrades gracefully with grace period policy",
      ],
    }
  ),
  sec(
    "environments",
    "4. Environments & config",
    `Minimum four logical environments; three deployable.

• local — dev machines, Stripe test mode, fake email
• staging — prod-like, test mode or isolated live keys in restricted account
• production — live keys, real money, real PII

Rules:
• Separate Stripe webhooks + API keys per environment
• Database never shared staging↔prod
• Feature flags default off in prod; kill switch for billing and signup
• Secrets in vault/SSM — not .env in repo

Config hierarchy:
• defaults → env vars → per-tenant overrides (enterprise only)

Seed data: one-click demo org in staging for sales — reset nightly.`,
    {
      bullets: [
        "DATABASE_URL distinct per env",
        "Robots/noindex on staging URLs",
        "Production deploy requires migration plan attached",
      ],
    }
  ),
  sec(
    "observability",
    "5. Observability baseline",
    `You cannot support SaaS without knowing which tenant broke.

Minimum viable ops:
• Structured logs: request_id, user_id, org_id, route, status, duration_ms
• Metrics: signup funnel, checkout conversion, API error rate by route, webhook lag
• Alerts: webhook processing failures, payment_failed spike, 5xx rate, DB connection exhaustion
• Admin internal page: org lookup → subscription status, last errors, feature flags

Support tooling:
• Impersonation (audit logged, time-boxed) or read-only tenant view
• Export org audit trail for enterprise customers

SLO starting point:
• API p99 < 500ms for core read paths
• Webhook processing < 30s p99
• 99.9% monthly for auth + billing paths`,
    {
      checklist: [
        "Log aggregation searchable by org_id",
        "On-call runbook: failed payment, stuck signup, webhook backlog",
        "Status page for external comms before first enterprise deal",
      ],
    }
  ),
  sec(
    "mvp",
    "6. MVP cut line",
    `Ship the money path and core value loop. Defer everything that does not block a paying user.

Week 1–2 (must ship):
• Email/password or OAuth signup + email verify
• Org creation + invite one teammate
• Stripe checkout + webhook → unlock paid tier
• One core feature that delivers promised value end-to-end
• Settings: profile, billing portal link, logout all devices

Defer (explicit non-goals for MVP):
• Custom domains, white-label
• Fine-grained custom roles
• Usage-based metering (unless pricing requires day one)
• SOC2 paperwork (start logging/architecture now, audit later)
• Mobile apps — responsive web first
• Multi-region

Cut line test: can a founder complete signup → pay $X → get value in <10 minutes without your help?

Technical debt you cannot defer:
• tenant scoping, webhook idempotency, migration tooling, backups`,
  ),
  sec(
    "data-lifecycle",
    "7. Data lifecycle & compliance hooks",
    `Even pre-enterprise, design delete/export paths.

• account deletion → soft delete → hard delete job at 30 days
• export org data JSON/CSV — manual request OK at MVP
• PII map: what you store, retention, subprocessors list for privacy policy
• Backups: daily automated, test restore quarterly

Email:
• transactional only at MVP (Postmark/SES); marketing separate provider with unsubscribe`,
  ),
  sec(
    "antipatterns",
    "8. Anti-patterns",
    `• tenant_id optional "we'll add it later"
• Plan check via Stripe API per HTTP request
• Webhook handler that crashes on unknown event types (log + ack)
• Single shared Stripe webhook secret across envs
• Building admin superpowers before customer-facing core loop
• Schema-per-tenant at 5 customers because "enterprise might ask"
• No grace period on failed payment — instant hard lock without email
• Feature flags with no org_id dimension

SaaS succeeds on reliability of the boring path: login, pay, use, bill again.`,
  ),
];
