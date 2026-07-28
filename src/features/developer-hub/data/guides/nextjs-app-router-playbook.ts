import type { HubSection } from "../../types";
import { sec } from "./_helpers";

export const nextjsAppRouterPlaybookMeta = {
  overviewBody: `The App Router is not "React with folders." It is a server-first routing model where every file is a potential server boundary, every fetch participates in a layered cache, and client JavaScript is a deliberate tax you pay only where interactivity requires it.

This playbook covers the decisions that actually bite production teams: where to split RSC vs client islands, which cache layer owns a piece of data, how streaming changes perceived latency, and where server actions belong — plus the revalidation and pitfall patterns that cause stale UI, hydration mismatches, and accidental cache poisoning.`,
  objectives: [
    "Place components on the correct side of the server/client boundary with a repeatable decision tree",
    "Map data fetching to the right cache layer: React request memo, Data Cache, Full Route Cache",
    "Design streaming and Suspense boundaries that improve p95 without hiding loading states forever",
    "Draw hard lines for server actions: auth, validation, revalidation, and what never belongs in the client",
  ],
  prerequisites: [
    "Comfortable with React hooks and component composition",
    "Built at least one Next.js app (Pages or App Router)",
    "Understand HTTP caching basics (TTL, invalidation)",
  ],
  takeaways: [
    "Default to Server Components; add 'use client' only for event handlers, browser APIs, or local UI state",
    "fetch() options and route segment config determine cache behavior — not your mental model of 'server = fresh'",
    "Server actions are RPC endpoints: validate, authorize, mutate, then revalidate the smallest surface",
    "Most App Router bugs are cache or boundary bugs, not routing bugs",
  ],
};

export const nextjsAppRouterPlaybookSections: HubSection[] = [
  sec(
    "rsc-vs-client",
    "1. RSC vs client islands — the decision tree",
    `Server Components (default) run once on the server, can await DB/API directly, and ship zero JS for themselves. Client Components run in the browser and pay bundle + hydration cost.

Use Server Components when:
• Fetching data tied to the request (user-specific, auth-gated)
• Rendering static or cacheable markup
• Composing layout without interactivity

Add 'use client' only when you need:
• onClick, onChange, useState, useEffect, useReducer
• Browser-only APIs (localStorage, IntersectionObserver, canvas)
• Third-party libs that touch DOM or assume window

The island pattern: keep the client leaf small. A 200-line page marked 'use client' because one button toggles a modal is a bundle regression.

Composition rule: Server Components can import Client Components as children, but Client Components cannot import Server Components. Pass server-rendered children as props (the "slot" pattern) to keep data fetching on the server.

Anti-pattern: fetching in useEffect on the client what you could fetch in a Server Component — you lose cache integration and ship loading spinners users should never see.`,
    {
      checklist: [
        "Every 'use client' file has a one-line reason (events, browser API, lib constraint)",
        "Data fetching lives in Server Components or server actions, not useEffect",
        "Client leaves are small; layout and data wrappers stay server-side",
      ],
    }
  ),
  sec(
    "caching-layers",
    "2. Three cache layers — know which one owns your data",
    `Next.js stacks three distinct caches. Confusing them causes "I revalidated but it's still stale" incidents.

1. React Request Memoization (per request)
• dedupe() identical fetch calls within a single render pass
• Lives for one request only — no cross-request sharing
• Automatic when you call fetch() in Server Components

2. Data Cache (cross-request, fetch-based)
• Persists fetch() results across requests and deployments (until revalidated)
• Controlled by cache: 'force-cache' (default), cache: 'no-store', next: { revalidate: N, tags: [...] }
• Tag-based revalidation: revalidateTag('posts') invalidates all fetches tagged 'posts'

3. Full Route Cache (static rendering)
• Entire RSC payload cached at build time or after first request (static routes)
• Opt out with export const dynamic = 'force-dynamic' or fetch no-store / cookies() / headers()
• ISR via revalidate export on the segment

Decision matrix:
• User-specific dashboard → dynamic segment, no-store or short revalidate + auth check
• Marketing page, same for everyone → static + long revalidate or force-cache
• Shared catalog with occasional updates → tagged fetch + revalidateTag on write

Critical: unstable_cache() wraps non-fetch async work (Prisma, Redis) with Data Cache semantics when fetch() is not the data source.`,
    {
      bullets: [
        "List every data source and its cache layer + TTL/tag",
        "User-specific routes must opt out of Full Route Cache",
        "Tag fetches at write boundaries so revalidation is surgical, not global",
      ],
    }
  ),
  sec(
    "streaming",
    "3. Streaming & Suspense — latency users feel",
    `Without streaming, the slowest await in a page blocks the entire response. With Suspense boundaries, the shell ships immediately; slow sections stream in as they resolve.

Placement strategy:
• Put Suspense around independent slow queries (recommendations, comments, sidebar stats)
• Keep above-the-fold critical content outside Suspense or give it a tight timeout fallback
• loading.tsx is a route-level Suspense fallback — use it for whole-page skeletons, not as a substitute for granular boundaries

Streaming + caching interaction:
• Dynamic routes stream but may not be Full Route cached
• Partial Prerendering (when enabled) combines static shell + dynamic holes — design holes at natural UI seams

UX rules:
• Skeleton shape must match final layout (avoid layout shift)
• Never stream forever — set server timeouts; show degraded UI on failure
• loading.tsx should not flash on fast navigations — consider min display time only if you measure a flicker problem

Measure: TTFB vs FCP vs LCP. Streaming improves FCP; it does not fix a 3s DB query — it hides it better.`,
    {
      checklist: [
        "Slow fetches wrapped in Suspense with layout-accurate fallbacks",
        "Critical path identified — not everything is async-deferred",
        "Error boundaries paired with Suspense for failed segments",
      ],
    }
  ),
  sec(
    "server-actions",
    "4. Server actions — RPC with boundaries",
    `Server actions ('use server') are POST endpoints colocated with UI. Treat them like internal APIs, not "free backend."

Hard boundaries:
• Always validate input (Zod/Valibot) — never trust FormData or hidden fields
• Always authorize: session check before any mutation
• Never return secrets or raw stack traces to the client
• Return { ok, error } shapes the client can render — not thrown errors for expected validation failures

Revalidation after mutate:
• revalidatePath('/dashboard') — invalidates Full Route Cache for that path
• revalidateTag('user:123') — invalidates tagged Data Cache entries
• Prefer tags over blanket path revalidation when the write affects a known fetch surface

Progressive enhancement: forms with action={serverAction} work without JS. Client-side onSubmit can call the same action for optimistic UI.

Anti-patterns:
• Server action that does 6 unrelated mutations — split by use case
• Calling external APIs synchronously inside an action without timeout
• Using server actions for reads that should be cached Server Component fetches`,
    {
      bullets: [
        "Every action: validate → authorize → mutate → revalidate",
        "Idempotency for actions triggered by double-submit or retry",
        "No business logic duplicated in client — action is source of truth",
      ],
    }
  ),
  sec(
    "revalidation",
    "5. Revalidation strategies that stay correct",
    `Stale UI is a product bug. Over-eager revalidation is a cost bug. Pick per data class.

On-demand (event-driven):
• After create/update/delete → revalidateTag or revalidatePath
• Webhook from CMS → Route Handler that calls revalidateTag
• Best for: user-generated content, admin edits, inventory

Time-based (ISR):
• export const revalidate = 3600 on segment or next: { revalidate: 3600 } on fetch
• Best for: blogs, docs, catalog with acceptable lag

Opt-out (always fresh):
• cache: 'no-store', cookies(), headers(), searchParams in page
• Best for: authenticated dashboards, cart, anything user-specific

Cache poisoning guard:
• Never cache a response that varies by auth but omits cookies() from the dynamic detection
• Vary cache keys by tenant/user when data is scoped — tags like post:\${tenantId}

Debugging stale data:
1. Check segment config (dynamic, revalidate)
2. Check fetch cache options
3. Check if CDN/edge caches outside Next (Vercel handles most; self-hosted may not)`,
    {
      checklist: [
        "Each entity type has a documented revalidation trigger",
        "Tags are namespaced (tenant, entity type)",
        "No user-specific data in statically cached routes",
      ],
    }
  ),
  sec(
    "routing-patterns",
    "6. Route groups, parallel routes, and intercepting",
    `Route groups (folder) — organize without affecting URL. Use for shared layouts across unrelated sections.

Parallel routes (@modal, @sidebar) — render multiple pages in one layout simultaneously. Modal-as-route pattern: intercept (..)photo/[id] to show modal on soft nav, full page on hard refresh.

Intercepting routes — soft navigation shows overlay; direct URL shows full page. Requires consistent loading/error boundaries in both slots.

When to skip fancy routing:
• If the team cannot explain the folder tree in 30 seconds, simplify
• Parallel routes add mental overhead — earn them with a real UX win (shareable modal URLs, split dashboards)

Middleware (middleware.ts):
• Auth redirects, geo headers, A/B cookie — keep fast, no DB calls if avoidable
• Matcher config to exclude static assets`,
  ),
  sec(
    "pitfalls",
    "7. Production pitfalls — the usual suspects",
    `Hydration mismatch — server HTML ≠ client first render. Causes: Date.now(), Math.random(), locale formatting, browser-only branches without suppressHydrationWarning (last resort). Fix: compute volatile values in useEffect or pass from server as props.

Accidental static caching of dynamic data — page uses cookies() in one branch but not all code paths; Next may still cache. Force dynamic explicitly when in doubt for auth routes.

Barrel file client boundary bleed — re-exporting a Server Component through a 'use client' barrel pulls it client-side. Import server components directly.

Large client bundles from icon/UI libraries — import granular paths; audit with @next/bundle-analyzer.

fetch() dedupe surprises — two components fetch same URL with different cache options → separate cache entries. Standardize fetch wrappers.

Environment leakage — NEXT_PUBLIC_ exposes to browser; server secrets never in client components.

Parallel route 404 on refresh — missing default.js for a slot breaks hard navigation.`,
    {
      checklist: [
        "No Date.now()/random in SSR render path",
        "Auth routes marked force-dynamic or use no-store fetches",
        "Bundle analyzer run after adding client dependencies",
      ],
    }
  ),
  sec(
    "checklist",
    "8. Ship checklist for App Router features",
    `Before merging a new route or data flow:

Architecture
• Server vs client split documented per component
• Data ownership: which layer caches, which tag/path revalidates

Performance
• LCP element not blocked by client JS hydration of unrelated widgets
• Suspense boundaries on independent slow queries

Security
• Server actions validate + authorize
• No secrets in client bundle or NEXT_PUBLIC_

Ops
• Error.tsx and not-found.tsx present for user-facing routes
• Logging/metrics on server action failures

This is the review list staff engineers run in PRs — not a style guide.`,
    {
      bullets: [
        "Cache map: source → layer → TTL/tag → invalidation trigger",
        "Client boundary audit: every 'use client' justified",
        "Revalidation tested: mutate → refresh shows new data within SLO",
      ],
    }
  ),
];
