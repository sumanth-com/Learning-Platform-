import type { HubSection } from "../../types";
import { sec } from "./_helpers";

export const designPatternsCatalogMeta = {
  overviewBody: `Design patterns are shared vocabulary for recurring structure — not a checklist to apply until every class ends in FactoryFactory. Senior engineers use Strategy, Adapter, Factory, and Observer when the problem shape matches; juniors spray patterns when one if/else would do.

This catalog maps each pattern to product code you have actually seen — payment providers, analytics hooks, plugin systems — plus anti cargo-cult rules so your abstractions earn their lines.`,
  objectives: [
    "Recognize problem shapes that fit Strategy, Adapter, Factory, and Observer",
    "Implement each pattern minimally in TypeScript/product context",
    "Avoid over-abstraction when a function or discriminated union suffices",
    "Refactor toward a pattern when the second implementation appears, not before",
  ],
  prerequisites: [
    "Comfortable with interfaces and dependency injection in TypeScript",
    "Maintained code with third-party integrations",
    "Read at least one codebase with multiple payment or notification providers",
  ],
  takeaways: [
    "Strategy — interchangeable algorithms selected at runtime (pricing rules, export formats)",
    "Adapter — translate foreign interface to your port (Stripe webhooks → domain events)",
    "Factory — centralize complex construction (entity from DTO, test fixtures)",
    "Observer — decouple publishers from subscribers (domain events, analytics) — don't confuse with React",
  ],
};

export const designPatternsCatalogSections: HubSection[] = [
  sec(
    "strategy",
    "1. Strategy — swap behavior without conditionals everywhere",
    `Problem: same workflow, different algorithms — shipping cost, tax, discount eligibility, export CSV vs PDF.

Shape:
interface PricingStrategy { calculate(cart: Cart): Money }
class StandardPricing implements PricingStrategy { ... }
class PromoPricing implements PricingStrategy { ... }

Context selects strategy at runtime (config, user segment, feature flag):
const strategy = promoActive ? new PromoPricing() : new StandardPricing()
total = strategy.calculate(cart)

Product examples:
• Billing: monthly vs annual proration rules
• Notifications: digest vs immediate delivery policy
• Feature flags: strategy per tenant tier

When a function suffices:
Single strategy, no variants → plain function calculateShipping(cart).

When NOT Strategy:
One if (isPromo) branch used once — inline until second caller duplicates logic.

TypeScript alternative: discriminated union of rule configs + pure functions — often clearer than class hierarchy.`,
    {
      checklist: [
        "Multiple algorithms share same input/output contract",
        "Selection logic in one place, not scattered if/else",
        "New variant added without editing all call sites",
      ],
    }
  ),
  sec(
    "adapter",
    "2. Adapter — make foreign code speak your language",
    `Problem: third-party SDK or legacy module interface doesn't match your ports.

Shape:
Your port: interface PaymentGateway { charge(amount: Money, idempotencyKey: string): Result }
Adapter: class StripePaymentGateway implements PaymentGateway {
  constructor(private stripe: Stripe) {}
  charge(...) { /* map Money → cents, Result → Stripe errors */ }
}

Product examples:
• Auth0 profile → your User entity
• S3 SDK → StoragePort with upload(stream): Url
• Legacy REST client → new use case repository interface

Inbound adapter: HTTP controller adapts JSON → use case DTO.
Outbound adapter: repository adapts use case → Prisma.

Anti-pattern: adapter that grows business logic — "just map fields" plus tax calculation belongs in use case.

Test: fake implements port; adapter has integration test against sandbox API.`,
    {
      bullets: [
        "SDK types never imported outside adapter file",
        "Adapter maps errors to domain errors",
        "Thin translation — no business rules",
      ],
    }
  ),
  sec(
    "factory",
    "3. Factory — construction complexity in one place",
    `Problem: creating valid objects requires steps, defaults, or variant selection.

Shape:
class OrderFactory {
  fromCheckoutDto(dto: CheckoutDto, user: User): Order {
    // validate, assign id, compute line items, set initial status
  }
  forTest(overrides?: Partial<Order>): Order { ... }
}

Product examples:
• Entity creation from API payload with invariants
• Seeding test data with realistic defaults
• Plugin registration: factory picks Implementation by type string

Abstract Factory (rare in product code): family of related objects (UI theme kit). Usually overkill — use Strategy + Factory combo sparingly.

Simple factory function often enough:
function createNotification(kind: 'email' | 'sms', payload): Notification

When NOT Factory:
Constructor with 3 args and no invariants — new Order(id, items, user) directly.

Danger: God Factory that knows entire system — split by bounded context.`,
    {
      checklist: [
        "Construction rules centralized",
        "Invalid combinations impossible at compile or throw at factory",
        "Test fixtures use factory, not copy-paste objects",
      ],
    }
  ),
  sec(
    "observer",
    "4. Observer — react to events without tangling",
    `Problem: action A should trigger B, C, D (email, analytics, search index) without A importing all of them.

Shape:
domain event: OrderPlaced { orderId, userId, total }
subscribers: SendConfirmationEmail, UpdateAnalytics, IndexProduct

In-process (modular monolith):
eventBus.publish(new OrderPlaced(...))
handlers registered at startup — each implements handle(event)

Product examples:
• User signed up → welcome email + CRM + default workspace
• File uploaded → virus scan + thumbnail + notify
• React is NOT Observer pattern — don't cite useEffect chains as architecture

Async observer: queue between publish and handlers for reliability — outbox table.

Pitfalls:
• Sync handlers slow request — offload to queue
• Order of handlers matters but undocumented
• Global bus as hidden coupling — document events as public API

Alternative: explicit orchestration in use case when only 2 side effects — clarity beats pattern.`,
    {
      bullets: [
        "Events named past tense (OrderPlaced not PlaceOrder)",
        "Handlers idempotent — at-least-once delivery",
        "Heavy work async, not in request thread",
      ],
    }
  ),
  sec(
    "combinations",
    "5. Patterns in combination — real feature slice",
    `Example: Checkout

• Factory builds Order from cart + address DTO
• Strategy selects ShippingCalculator by region
• PaymentGateway adapter charges Stripe
• Use case orchestrates; on success publishes OrderPlaced
• Observers: email, warehouse, analytics

Request flow stays linear in use case; variation points use patterns.

Diagram mentally:
Controller → PlaceOrderUseCase → [Factory, Strategy, Gateway port] → EventBus → [Observers]

One pattern per variation axis — don't Factory the Strategy inside the Adapter unless necessary.`,
  ),
  sec(
    "anti-cargo",
    "6. Anti cargo-cult — when to refuse patterns",
    `Red flags:

• Interface with one implementation "for future flexibility" — YAGNI until second impl
• AbstractFactory for two button colors
• Observer for single listener — direct function call
• Strategy with one strategy — inline code
• 400-line UML before user story accepted

Rule of three:
1st time — inline
2nd duplication — extract function
3rd — consider pattern

Prefer:
• Discriminated union + functions over class hierarchies
• Plain functions over DI framework for small apps
• Module exports over enterprise patterns folder

Code review question: "What variation are we enabling?" — no answer → delete abstraction.

Patterns are nouns for design reviews, not goals.`,
    {
      checklist: [
        "Second implementation exists or is scheduled this quarter",
        "Pattern name appears in doc/diagram for onboarding",
        "Removing pattern would increase duplication measurably",
      ],
    }
  ),
  sec(
    "typescript-idioms",
    "7. TypeScript idioms vs GoF classes",
    `Modern TS often replaces patterns:

Strategy → Record<Mode, (input) => output> or switch on discriminant
Adapter → module with mapXToY functions exporting port interface
Factory → plain function + zod parse
Observer → typed event emitter or on(event, handler) with union of events

Use classes when:
• Multiple methods share private state (connection pool adapter)
• Framework requires (Nest providers)

Use functions when:
• Stateless transforms
• Tree-shakeable utilities

 satisfies and as const for plugin registries:
const plugins = { csv: exportCsv, pdf: exportPdf } as const satisfies Record<string, Exporter>`,
  ),
  sec(
    "refactor",
    "8. Refactor toward patterns — safe sequence",
    `1. Identify pain: switch growing on provider type, duplicate construction, tangled side effects
2. Name the variation axis (payment provider, export format, event reactions)
3. Introduce port interface at application boundary
4. Move first variant behind adapter/strategy; keep old path delegating
5. Add second variant — proves abstraction
6. Delete switch; register strategies/handlers in one module
7. Document in module README: events, ports, extension point

Never big-bang "patterns refactor" sprint.

Metrics: lines in switch statements down; new provider added without editing use case core.

Senior signal: you can draw one box labeled "port" and two boxes labeled "adapter" and explain what breaks if you delete the interface.`,
    {
      bullets: [
        "Refactor triggered by measured duplication or variant count",
        "Port introduced at stable boundary",
        "Second implementation proves design",
      ],
    }
  ),
];
