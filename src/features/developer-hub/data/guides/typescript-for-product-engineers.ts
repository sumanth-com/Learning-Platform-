import type { HubSection } from "../../types";
import { sec } from "./_helpers";

export const typescriptForProductEngineersMeta = {
  overviewBody: `TypeScript on product teams is not about satisfying the compiler — it is about making invalid states unrepresentable at boundaries and cheap to refactor everywhere else.

This guide covers discriminated unions for UI and API state, narrowing patterns that replace defensive runtime checks, Zod at system edges, eliminating any without heroics, and typing HTTP APIs so frontend and backend share one contract.`,
  objectives: [
    "Model state machines and API responses with discriminated unions",
    "Apply narrowing (typeof, in, satisfies, type guards) instead of optional chaining soup",
    "Validate unknown input with Zod at boundaries; infer types from schemas",
    "Replace any incrementally and generate/consume shared API types",
  ],
  prerequisites: [
    "Write TypeScript in React or Node daily",
    "Basic generics and interface/type aliases",
    "Consumed REST or tRPC APIs from frontend code",
  ],
  takeaways: [
    "Discriminated union + switch exhaustiveness catches new states at compile time",
    "unknown at boundaries, typed domain inside — never any from JSON.parse",
    "Zod schema is runtime validator and TS type source — single definition",
    "API types generated from OpenAPI or shared router — not hand-copy DTOs",
  ],
};

export const typescriptForProductEngineersSections: HubSection[] = [
  sec(
    "discriminated-unions",
    "1. Discriminated unions — state machines in types",
    `Tag every variant with a literal discriminant:

type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }

UI renders with switch (state.status) — compiler enforces all cases if you enable noImplicitReturns and use never exhaustiveness check.

Product examples:
• CheckoutStep: 'cart' | 'shipping' | 'payment' | 'confirm'
• Notification: { kind: 'email'; to: string } | { kind: 'sms'; phone: string }
• Permission result: { allowed: true } | { allowed: false; reason: string }

Avoid boolean flags: isLoading + isError + data — allows isLoading && isError simultaneously.

API responses:
{ ok: true; value: T } | { ok: false; error: ApiError } — caller must branch on ok.`,
    {
      checklist: [
        "Async UI state modeled as union, not boolean flags",
        "switch with default: never exhaustiveness check",
        "API success/error as discriminated union",
      ],
    }
  ),
  sec(
    "narrowing",
    "2. Narrowing — let the compiler prove safety",
    `Techniques:
• typeof / instanceof — primitives and classes
• in operator — property presence on unions
• Equality on discriminant — status === 'success'
• Type predicates: function isUser(x: unknown): x is User
• Assertion functions: assertIsUser(x): asserts x is User

Control flow analysis — assign to const in branch; TS narrows in closure if not mutated.

Avoid:
• as User casts to silence errors — fix the union or validate
• Optional chaining through 6 levels — reshape data or narrow earlier

Pattern for unknown JSON:
function parsePayload(raw: unknown): Payload {
  const result = PayloadSchema.safeParse(raw)
  if (!result.success) throw new ValidationError(result.error)
  return result.data // typed Payload
}

satisfies operator — validate literal matches type without widening:
const routes = { home: '/', admin: '/admin' } satisfies Record<string, string>`,
    {
      bullets: [
        "No as casts at API boundaries — parse or narrow",
        "Type predicates for reusable guards",
        "Exhaustive switch on discriminant",
      ],
    }
  ),
  sec(
    "zod-boundaries",
    "3. Zod at boundaries — runtime meets compile time",
    `Rule: every external input is unknown until validated:
• req.body, searchParams, localStorage, webhook payload, LLM JSON

z.object({ email: z.string().email(), age: z.number().int().positive() })
type User = z.infer<typeof UserSchema>

Co-location: schema next to route handler or server action; share schema package in monorepo for client+server.

Patterns:
• .safeParse for user-facing errors
• .transform for normalization (trim email, lowercase)
• .refine / .superRefine for cross-field rules
• z.discriminatedUnion('type', [...]) mirrors TS discriminated unions

Do not duplicate: interface User { ... } plus separate manual validation — schema is source of truth.

Partial updates: UserSchema.partial() or .pick({ name: true }) for PATCH bodies.`,
    {
      checklist: [
        "All HTTP inputs validated with Zod (or equivalent)",
        "Types inferred via z.infer — not parallel interfaces",
        "Shared schemas in monorepo package if client validates too",
      ],
    }
  ),
  sec(
    "avoid-any",
    "4. Eliminating any — incremental, not heroic",
    `any is contagious — one any poisons inference downstream.

Tactics:
• unknown instead of any at catch and JSON boundaries
• Generics on utilities: function first<T>(arr: T[]): T | undefined
• Record<string, unknown> for dynamic keys until schema exists
• eslint @typescript-eslint/no-explicit-any as error on new code; warn on legacy

Strangle legacy:
1. Enable noImplicitAny on new folders
2. Type module exports first (public API)
3. Replace any in hot paths touched by features
4. // eslint-disable-next-line with ticket link — timeboxed debt

Third-party untyped libs: write minimal .d.ts module augmentation or wrap in typed adapter.

never for impossible states after exhaustiveness — documents intent.`,
    {
      bullets: [
        "catch (e: unknown) + narrow or wrap",
        "no-explicit-any lint on new files",
        "Wrap untyped SDKs in thin typed facade",
      ],
    }
  ),
  sec(
    "api-types",
    "5. API types — one contract, two runtimes",
    `Hand-written fetch types drift from backend within weeks.

Options (pick one):

OpenAPI → openapi-typescript / orval generates client + types from spec
• Backend owns spec; CI diff breaks on breaking change

tRPC — router type exported; client infers input/output
• Best for TS-full-stack monorepo

GraphQL — codegen from schema

Shared package — Zod schemas + inferred types imported by both (works with REST)

Pattern for REST without codegen:
const GetUserResponse = z.object({ ... })
type GetUserResponse = z.infer<typeof GetUserResponse>
// validate on fetch in client wrapper

Version breaking changes: URL version or additive fields only; deprecate with types marked @deprecated.

Error shape standardized across endpoints — typed error union on client.`,
    {
      checklist: [
        "Client types generated or shared — not duplicated",
        "CI checks OpenAPI/schema drift",
        "Fetch wrapper validates or trusts generated types",
      ],
    }
  ),
  sec(
    "generics-utilities",
    "6. Generics product engineers actually use",
    `Common patterns:
• Paginated<T> = { items: T[]; nextCursor: string | null }
• ApiResult<T, E = ApiError> discriminated union
• Component props: ListProps<T> with renderItem: (item: T) => ReactNode
• Pick/Omit/Partial for form DTOs from entity type

Avoid over-generic abstractions — if T appears once, inline the type.

const assertions for literal inference:
const STATUS = { draft: 'draft', live: 'live' } as const
type Status = typeof STATUS[keyof typeof STATUS]

Template literal types for routes: \`/users/\${string}\` — useful for typed links.

Reach for utility types before duplicating shapes.`,
  ),
  sec(
    "react-ts",
    "7. React + TypeScript sharp edges",
    `Children typing: PropsWithChildren vs explicit children?: ReactNode

Event handlers: ChangeEvent<HTMLInputElement> — don't use any for e.

useRef: useRef<HTMLInputElement>(null) — null check before .focus()

useReducer: discriminated union for action types — same as server state machines

Context: createContext<User | null>(null) + hook that throws if null — avoids User | undefined everywhere

Server Components: async components return Promise<JSX.Element> — props serializable; no functions from server to client except server actions marked 'use server'

Third-party component props: ComponentProps<typeof Button> to extend without duplication.`,
    {
      bullets: [
        "Reducer actions as discriminated union",
        "Context hook enforces provider presence",
        "No non-serializable props across RSC boundary",
      ],
    }
  ),
  sec(
    "checklist",
    "8. PR checklist for TypeScript product code",
    `Before merge:

• New external input has Zod schema + inferred type
• Unions use discriminant; switches exhaustive
• No new any without linked issue
• API change reflected in shared types or OpenAPI
• strict / noImplicitAny violations not increased

tsconfig baseline for product repos:
strict: true, noUncheckedIndexedAccess (consider — verbose but catches bugs), skipLibCheck: true

Type errors in CI — not "we'll fix later." Later never comes.

Senior signal: refactoring rename propagates via compiler — you don't grep-and-hope.`,
  ),
];
