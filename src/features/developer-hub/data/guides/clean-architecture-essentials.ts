import type { HubSection } from "../../types";
import { sec } from "./_helpers";

export const cleanArchitectureEssentialsMeta = {
  overviewBody: `Clean Architecture is a dependency discipline: business rules point inward, frameworks and databases are plugins on the outside. It is not a folder naming convention or a mandate for 47 interfaces.

This guide focuses on what product teams actually need — use cases as orchestration boundaries, ports and adapters for test seams, the dependency rule enforced without ceremony, and modular monolith pragmatism that earns microservices later instead of pretending day-one distribution.`,
  objectives: [
    "Apply the dependency rule: inner layers never import outer layers",
    "Model use cases as application services that orchestrate domain logic and ports",
    "Implement adapters for HTTP, DB, and third-party APIs without leaking framework types inward",
    "Structure a modular monolith with clear module boundaries and test doubles at ports",
  ],
  prerequisites: [
    "Built features across UI, API, and database layers",
    "Written unit and integration tests",
    "Familiar with dependency injection concepts (even if manual)",
  ],
  takeaways: [
    "Entities and use cases are framework-agnostic; adapters translate at the edges",
    "Ports are interfaces your application defines; adapters implement them",
    "Modular monolith + strict module APIs beats microservices until scale or org forces split",
    "Tests swap adapters for fakes at port boundaries — not mock every line",
  ],
};

export const cleanArchitectureEssentialsSections: HubSection[] = [
  sec(
    "dependency-rule",
    "1. The dependency rule — the only non-negotiable",
    `Source code dependencies point inward. Inner circles know nothing about outer circles.

Typical rings (inside → out):
• Entities — enterprise business rules (Order, Money, invariants)
• Use cases — application-specific orchestration (PlaceOrder, CancelSubscription)
• Interface adapters — controllers, presenters, gateways (HTTP handlers, repo impls)
• Frameworks & drivers — Next.js, Postgres, Stripe SDK, Redis

What breaks the rule:
• Importing Prisma client inside a domain entity
• Returning NextResponse from a use case
• SQL strings in use case layer

What looks like Clean Architecture but isn't:
• folders named domain/ application/ infrastructure/ with imports crossing freely
• Interfaces for everything (IPasswordHasherFactory) with one implementation

Enforcement: lint import paths (eslint-plugin-boundaries), arch unit tests, or CI grep — pick one and run it.`,
    {
      checklist: [
        "Domain/use-case packages have zero framework imports",
        "Dependency direction verified in CI or lint rules",
        "New code reviewed for ' convenience imports' from outer layers",
      ],
    }
  ),
  sec(
    "entities-usecases",
    "2. Entities and use cases — where behavior lives",
    `Entities hold invariants and pure domain logic:
• Order cannot ship with zero line items
• Money arithmetic in integer cents, not floats
• State transitions validated (pending → paid, not pending → shipped)

Keep entities free of persistence annotations. No @Column, no JSON serialization tags unless unavoidable.

Use cases (application services) orchestrate one user intent:
• Load aggregates via port (OrderRepository)
• Call entity methods
• Persist via port
• Emit side effects via port (EmailSender, EventBus)

Use case signature (language-agnostic pattern):
execute(input: PlaceOrderInput): Result<PlaceOrderOutput, PlaceOrderError>

Input/output are DTOs — plain data. Use case does not expose entity graphs to controllers.

Fat entities vs anemic: prefer behavior on entities when rule is universal; use case when rule coordinates multiple aggregates or external systems.`,
    {
      bullets: [
        "One use case class/function per application action",
        "Use case returns Result or throws domain errors — not HTTP status codes",
        "Entities testable without DB or HTTP",
      ],
    }
  ),
  sec(
    "ports-adapters",
    "3. Ports and adapters — plug in the real world",
    `Port — interface the application defines:
interface OrderRepository {
  save(order: Order): Promise<void>
  findById(id: OrderId): Promise<Order | null>
}

Adapter — infrastructure implements the port:
• PostgresOrderRepository (Prisma/Drizzle/SQL)
• InMemoryOrderRepository (tests)
• HttpPaymentGateway wraps Stripe SDK

Controller adapter (inbound):
• Parses HTTP → DTO
• Calls use case
• Maps result/error → HTTP response

Presenter adapter (optional):
• Formats use case output for UI/API shape without polluting use case

Rule: adapters are thin translation layers. Business branching belongs in use case or entity, not in controller "just this once."

Third-party SDKs never cross the adapter boundary inward — wrap Stripe, S3, SendGrid behind ports your team owns.`,
    {
      checklist: [
        "Every external system has a port defined in application layer",
        "SDK types stop at adapter file edge",
        "Integration tests hit real adapter; unit tests use fakes",
      ],
    }
  ),
  sec(
    "modular-monolith",
    "4. Modular monolith pragmatism",
    `Start as one deployable with hard module boundaries — not six repos on day one.

Module = bounded context with public API:
• billing/ exports CreateInvoice, CancelSubscription — not internal repo classes
• catalog/ cannot import billing internals — only public events or API

Cross-module communication:
• Prefer domain events (in-process bus) over direct imports
• Shared kernel minimal — IDs, money type, auth context — not shared entities

Folder shape (example):
src/modules/orders/{domain, application, infrastructure, api}
Each module owns its schema tables (logical separation; can be one Postgres DB).

When to extract a service:
• Independent deploy cadence required by org
• Different scaling profile (CPU-heavy worker vs API)
• Team ownership boundary stable for 6+ months

Until then: modular monolith + clear ports is cheaper than network calls pretending to be architecture.`,
    {
      bullets: [
        "Module public index.ts — only exported surface",
        "No cross-module repository imports",
        "Events or API calls between modules, not shared tables without contract",
      ],
    }
  ),
  sec(
    "testing-seams",
    "5. Testing at the seams",
    `Test pyramid aligned to architecture:

Unit — entities and use cases with fake ports:
• FakeOrderRepository in memory
• Assert use case behavior and error paths
• Fast, no I/O

Integration — one adapter against real dependency:
• PostgresOrderRepository against test DB
• Stripe adapter against test mode API (or wiremock)

E2E — HTTP → use case → DB:
• Few, cover critical journeys

Anti-pattern: mock Prisma inside use case test — you test mocks, not behavior. Mock at port boundary instead.

Contract tests between modules:
• billing publishes InvoiceCreated event schema
• accounting consumer tests against fixture events

Regression safety net: use case tests are your refactor harness when swapping Prisma for Drizzle — ports unchanged, adapter rewritten.`,
    {
      checklist: [
        "Use case unit tests use port fakes, not ORM mocks",
        "At least one integration test per adapter",
        "Critical user journeys covered E2E",
      ],
    }
  ),
  sec(
    "http-boundary",
    "6. HTTP and UI as outer adapters",
    `Next.js route handlers, tRPC routers, GraphQL resolvers — all inbound adapters.

Handler responsibilities only:
• Auth context extraction
• Input validation (Zod at boundary)
• Map to use case input
• Map use case output/error to response
• Set cookies/headers

Handler must NOT:
• Contain business rules ("if discount > 50% reject" belongs in use case)
• Query DB directly for domain logic

For React: view components are adapters. Container/hook calls application API or server action that delegates to use case.

Server actions in Next.js: thin wrapper — validate, call use case, revalidate. Same rule as REST handler.`,
  ),
  sec(
    "migration",
    "7. Strangling legacy without big-bang rewrite",
    `Most teams inherit ball-of-mud, not greenfield rings.

Incremental path:
1. Identify one use case (e.g., RefundOrder)
2. Extract entity logic from controller into pure functions
3. Introduce port for persistence; wrap existing ORM calls in adapter
4. New code path goes through use case; old path delegates until migrated
5. Expand module boundary; lint against old imports

Do not:
• Pause features for 3-month "architecture sprint"
• Introduce 40 interfaces before second implementation exists

Vertical slice migration beats horizontal "move all entities first."

Track: % of mutations through use cases vs legacy controllers — metric for progress.`,
    {
      bullets: [
        "One vertical slice at a time",
        "Legacy adapter wraps old code until deleted",
        "Lint prevents new direct DB access from handlers",
      ],
    }
  ),
  sec(
    "anti-cargo",
    "8. Anti-patterns — architecture theater",
    `Refuse these:

• Clean Architecture as 4 folders with Prisma in domain because "it's convenient"
• Use case that is a one-line pass-through to repository
• Interface per class with single impl "for testing" but tests never swap
• Microservices to enforce boundaries a monolith module could enforce
• DTO explosion — 12 identical shapes because layers must differ
• Domain events for every CRUD — event bus as hidden global state

Senior signal: you can draw one request flow and point to where each rule is enforced — and your tests prove it without booting the whole app for every case.`,
  ),
];
