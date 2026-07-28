/**
 * Industry / interview-depth reference content for Hard challenges.
 * Easy/Medium stay foundational; Hard must look like something you'd
 * discuss in a junior–mid interview or ship on a real team.
 */

export function hardSqlBundle(topicTitle: string, interviewQ: string, slug: string, keywords: string[] = []) {
  const hay = `${slug} ${keywords.join(" ")} ${topicTitle}`.toLowerCase();

  const schema = `-- ${topicTitle} — production-shaped schema for interview depth
CREATE TABLE customers (
  id INTEGER PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  churned_at TIMESTAMP
);

CREATE TABLE products (
  id INTEGER PRIMARY KEY,
  sku TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  unit_price_cents INTEGER NOT NULL CHECK (unit_price_cents >= 0)
);

CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id),
  status TEXT NOT NULL CHECK (status IN ('pending', 'paid', 'shipped', 'cancelled')),
  placed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
  order_id INTEGER NOT NULL REFERENCES orders(id),
  product_id INTEGER NOT NULL REFERENCES products(id),
  qty INTEGER NOT NULL CHECK (qty > 0),
  unit_price_cents INTEGER NOT NULL CHECK (unit_price_cents >= 0),
  PRIMARY KEY (order_id, product_id)
);

CREATE INDEX idx_orders_customer_placed ON orders (customer_id, placed_at DESC);
CREATE INDEX idx_order_items_product ON order_items (product_id);
`;

  let sql: string;
  if (/window|rank|over|analytic|partition/.test(hay)) {
    sql = `-- Interview: ${interviewQ}
-- Use a window function to rank customers by lifetime spend (industry reporting pattern).
WITH spend AS (
  SELECT
    c.id AS customer_id,
    c.email,
    SUM(oi.qty * oi.unit_price_cents) AS lifetime_cents
  FROM customers c
  JOIN orders o ON o.customer_id = c.id AND o.status <> 'cancelled'
  JOIN order_items oi ON oi.order_id = o.id
  GROUP BY c.id, c.email
)
SELECT
  customer_id,
  email,
  lifetime_cents,
  RANK() OVER (ORDER BY lifetime_cents DESC) AS spend_rank,
  ROUND(
    100.0 * lifetime_cents / NULLIF(SUM(lifetime_cents) OVER (), 0),
    2
  ) AS pct_of_total
FROM spend
ORDER BY spend_rank
LIMIT 20;`;
  } else if (/transaction|acid|commit|rollback|isolation/.test(hay)) {
    sql = `-- Interview: ${interviewQ}
-- Atomic stock transfer pattern: both writes succeed or neither does.
BEGIN;

UPDATE products
SET unit_price_cents = unit_price_cents - 100
WHERE id = 1 AND unit_price_cents >= 100;

INSERT INTO orders (customer_id, status)
VALUES (42, 'pending');

INSERT INTO order_items (order_id, product_id, qty, unit_price_cents)
VALUES (last_insert_rowid(), 1, 1, 1900);

COMMIT;

-- On failure in real systems: ROLLBACK; never leave half-applied money moves.`;
  } else if (/join|foreign|relation|normalize|er\b/.test(hay)) {
    sql = `-- Interview: ${interviewQ}
-- Multi-join report a PM would actually ask for: paid orders with line items.
SELECT
  o.id AS order_id,
  c.email,
  o.placed_at,
  p.sku,
  oi.qty,
  oi.unit_price_cents,
  (oi.qty * oi.unit_price_cents) AS line_total_cents
FROM orders o
JOIN customers c ON c.id = o.customer_id
JOIN order_items oi ON oi.order_id = o.id
JOIN products p ON p.id = oi.product_id
WHERE o.status = 'paid'
  AND o.placed_at >= CURRENT_TIMESTAMP - INTERVAL '30 days'
ORDER BY o.placed_at DESC, o.id, p.sku;`;
  } else if (/index|explain|performance|slow|optim/.test(hay)) {
    sql = `-- Interview: ${interviewQ}
-- Prove the index matters: filter + sort on the composite key.
EXPLAIN QUERY PLAN
SELECT o.id, o.placed_at, o.status
FROM orders o
WHERE o.customer_id = 42
ORDER BY o.placed_at DESC
LIMIT 50;

-- Supporting index (already in schema):
-- CREATE INDEX idx_orders_customer_placed ON orders (customer_id, placed_at DESC);`;
  } else {
    sql = `-- Interview: ${interviewQ}
-- CTE + aggregate + HAVING: monthly revenue for paid orders (dashboard SQL).
WITH monthly AS (
  SELECT
    strftime('%Y-%m', o.placed_at) AS month,
    SUM(oi.qty * oi.unit_price_cents) AS revenue_cents,
    COUNT(DISTINCT o.id) AS order_count
  FROM orders o
  JOIN order_items oi ON oi.order_id = o.id
  WHERE o.status = 'paid'
  GROUP BY strftime('%Y-%m', o.placed_at)
)
SELECT month, revenue_cents, order_count
FROM monthly
WHERE revenue_cents >= 100000
ORDER BY month DESC
LIMIT 12;`;
  }

  return {
    minutes: 22,
    scenario: `Senior interview for "${topicTitle}". Interviewer asks: ${interviewQ}. They expect a production-shaped schema and a query you could defend in a design review.`,
    task: `Design a multi-table schema (customers/orders/items style) and write interview-grade SQL that answers: "${interviewQ}". Use joins, aggregates, CTEs, window functions, or transactions where they fit. Comment the why — not only the what.`,
    hints: [
      "Start from entities and keys, then write the query.",
      "Prefer explicit JOINs over ambiguous WHERE joins.",
      "Call out indexes or transaction boundaries when correctness depends on them.",
      interviewQ,
    ],
    takeaways: [
      "Hard SQL = schema design + query strategy, not a single SELECT.",
      "Interviewers care about correctness, indexes, and edge cases (cancelled orders, NULLs).",
      clip(interviewQ),
    ],
    referenceSchema: schema,
    referenceSql: sql,
    acceptanceCriteria: [
      "Multi-table schema with keys/relationships",
      "Non-trivial query (JOIN / aggregate / CTE / window / transaction)",
      "Comments explain trade-offs for the interview question",
    ],
  };
}

function clip(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

export function hardHtmlBundle(topicTitle: string, interviewQ: string, summary: string) {
  const safe = topicTitle.replace(/"/g, "");
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="${clip(summary).slice(0, 140)}" />
  <title>${safe} | Interview sketch</title>
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <header>
    <p class="brand">Acme Learn</p>
    <nav aria-label="Primary">
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/topics/${safe.toLowerCase().replace(/[^a-z0-9]+/g, "-")}">${safe}</a></li>
        <li><a href="/interview">Interview prep</a></li>
      </ul>
    </nav>
  </header>
  <main id="main">
    <article>
      <h1>${safe}</h1>
      <p>${clip(summary).slice(0, 160)}</p>
      <!-- Interview focus: ${interviewQ} -->
      <section aria-labelledby="approach">
        <h2 id="approach">Interview approach</h2>
        <ol>
          <li>Restate the problem and constraints.</li>
          <li>Name the HTML landmarks and why they matter.</li>
          <li>Call out accessibility and SEO risks.</li>
        </ol>
      </section>
      <section aria-labelledby="example">
        <h2 id="example">Working example</h2>
        <form action="/subscribe" method="post">
          <fieldset>
            <legend>Get the checklist</legend>
            <label for="email">Work email</label>
            <input id="email" name="email" type="email" autocomplete="email" required />
            <button type="submit">Send checklist</button>
          </fieldset>
        </form>
      </section>
    </article>
    <aside aria-label="Interviewer notes">
      <h2>What interviewers listen for</h2>
      <ul>
        <li>Semantics over div soup</li>
        <li>One clear h1</li>
        <li>Labeled controls and keyboard paths</li>
      </ul>
    </aside>
  </main>
  <footer>
    <p>© Acme Learn · Built for real hiring loops</p>
  </footer>
</body>
</html>
`;

  return {
    minutes: 20,
    scenario: `Hiring-panel whiteboard for "${topicTitle}". Interviewer asks: ${interviewQ}. They want production HTML, not a toy snippet.`,
    task: `Deliver a complete accessible page that answers "${interviewQ}": skip link, header/nav, main article, aside, footer, and at least one labeled form control. Comment the interview reasoning in HTML comments.`,
    hints: [
      "Landmarks first — then content.",
      "Every input needs a label (for/id).",
      "Explain trade-offs in comments the way you would out loud.",
    ],
    takeaways: [
      "Interview HTML proves structure, a11y, and intent — not just tags.",
      clip(interviewQ),
    ],
    referenceSolution: html,
    acceptanceCriteria: [
      "Full document with landmarks",
      "Accessible form control",
      "Comments tied to the interview question",
    ],
  };
}

export function hardCssBundle(topicTitle: string, interviewQ: string) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${topicTitle} — layout review</title>
</head>
<body>
  <div class="app">
    <header class="topbar">
      <p class="logo">Acme</p>
      <nav class="nav" aria-label="Primary">
        <a href="#dashboard">Dashboard</a>
        <a href="#reports">Reports</a>
      </nav>
    </header>
    <div class="shell">
      <aside class="rail">Filters</aside>
      <main class="content">
        <h1 class="title">${topicTitle}</h1>
        <p class="lead">Interview: ${interviewQ}</p>
        <section class="cards">
          <article class="card">Revenue</article>
          <article class="card">Retention</article>
          <article class="card">Latency</article>
        </section>
      </main>
    </div>
  </div>
</body>
</html>
`;

  const css = `/* Interview: ${interviewQ}
   Production-style layout: tokens, sticky chrome, responsive grid. */
:root {
  --ink: #0f172a;
  --muted: #64748b;
  --surface: #f8fafc;
  --card: #ffffff;
  --line: #e2e8f0;
  --brand: #0f766e;
  --radius: 0.75rem;
  --space: 1rem;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  font-family: system-ui, sans-serif;
  color: var(--ink);
  background: var(--surface);
}

.app { min-height: 100dvh; display: flex; flex-direction: column; }

.topbar {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space);
  padding: 0.75rem 1.25rem;
  background: color-mix(in srgb, var(--card) 92%, transparent);
  border-bottom: 1px solid var(--line);
  backdrop-filter: blur(8px);
}

.logo { margin: 0; font-weight: 700; color: var(--brand); }
.nav { display: flex; gap: 1rem; }
.nav a { color: var(--muted); text-decoration: none; }
.nav a:hover { color: var(--ink); }

.shell {
  flex: 1;
  display: grid;
  grid-template-columns: 220px 1fr;
  min-height: 0;
}

.rail {
  padding: var(--space);
  border-right: 1px solid var(--line);
  background: var(--card);
}

.content { padding: 1.5rem; }

.title { margin: 0 0 0.35rem; font-size: clamp(1.4rem, 2vw, 2rem); }
.lead { margin: 0 0 1.25rem; color: var(--muted); max-width: 40rem; }

.cards {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space);
}

.card {
  padding: 1.25rem;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  box-shadow: 0 1px 2px rgb(15 23 42 / 6%);
  transition: transform 160ms ease, box-shadow 160ms ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgb(15 23 42 / 10%);
}

@media (max-width: 860px) {
  .shell { grid-template-columns: 1fr; }
  .rail { border-right: 0; border-bottom: 1px solid var(--line); }
  .cards { grid-template-columns: 1fr; }
}
`;

  return {
    minutes: 20,
    scenario: `Design-review interview for "${topicTitle}". Interviewer asks: ${interviewQ}. They expect a responsive app shell, not a single property tweak.`,
    task: `Implement a dashboard-style layout that answers "${interviewQ}": sticky header, sidebar + main, responsive card grid, CSS variables, and a hover/focus state. Defend your layout choices in comments.`,
    hints: [
      "Tokens (:root) first, then layout, then polish.",
      "Mobile breakpoint should collapse the rail.",
      "Prefer grid/flex over absolute positioning for app shells.",
    ],
    takeaways: [
      "Hard CSS = system thinking (tokens + layout + responsive), not one declaration.",
      clip(interviewQ),
    ],
    referenceHtml: html,
    referenceCss: css,
    acceptanceCriteria: [
      "Responsive app shell",
      "CSS variables + grid/flex",
      "Comments address the interview question",
    ],
  };
}

export function hardJsBundle(topicTitle: string, interviewQ: string) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${topicTitle}</title>
</head>
<body>
  <main class="page">
    <h1 class="title">${topicTitle}</h1>
    <p class="lead">Interview: ${interviewQ}</p>
    <label for="q">Search customers</label>
    <input id="q" type="search" placeholder="Type a name…" autocomplete="off" />
    <ul id="results" class="results" aria-live="polite"></ul>
    <output id="out" class="out"></output>
  </main>
</body>
</html>
`;

  const js = `// Interview: ${interviewQ}
// Industry pattern: debounce + abortable fetch + safe DOM updates.
const input = document.querySelector("#q");
const results = document.querySelector("#results");
const out = document.querySelector("#out");

const CUSTOMERS = [
  { id: 1, name: "Ada Lovelace", plan: "pro" },
  { id: 2, name: "Grace Hopper", plan: "team" },
  { id: 3, name: "Alan Turing", plan: "pro" },
  { id: 4, name: "Katherine Johnson", plan: "free" },
];

function debounce(fn, ms) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

function render(list) {
  if (!results) return;
  results.replaceChildren(
    ...list.map((c) => {
      const li = document.createElement("li");
      li.textContent = \`\${c.name} · \${c.plan}\`;
      return li;
    })
  );
  if (out) {
    out.textContent = list.length
      ? \`\${list.length} match(es)\`
      : "No matches — refine the query.";
  }
}

async function search(query, signal) {
  // Simulated network; real apps would fetch('/api/customers?q=...')
  await new Promise((r) => setTimeout(r, 180));
  if (signal.aborted) throw new DOMException("Aborted", "AbortError");
  const q = query.trim().toLowerCase();
  if (!q) return CUSTOMERS;
  return CUSTOMERS.filter((c) => c.name.toLowerCase().includes(q));
}

let controller = null;
const onType = debounce(async (event) => {
  const value = event.target.value;
  controller?.abort();
  controller = new AbortController();
  try {
    const rows = await search(value, controller.signal);
    render(rows);
  } catch (err) {
    if (err.name !== "AbortError") {
      if (out) out.textContent = "Search failed — retry.";
      console.error(err);
    }
  }
}, 250);

input?.addEventListener("input", onType);
render(CUSTOMERS);
`;

  return {
    minutes: 22,
    scenario: `Frontend interview for "${topicTitle}". Interviewer asks: ${interviewQ}. They want working interaction patterns used in production UIs.`,
    task: `Implement a searchable list that answers "${interviewQ}": debounce input, cancel in-flight work, update the DOM safely, and surface empty/error states. Comment the concurrency choice.`,
    hints: [
      "Debounce reduces request storms while typing.",
      "AbortController cancels stale responses.",
      "Never trust network timing — always guard DOM updates.",
    ],
    takeaways: [
      "Hard JS = async + UX edge cases, not console.log of a summary.",
      clip(interviewQ),
    ],
    referenceHtml: html,
    referenceJs: js,
    acceptanceCriteria: [
      "Debounced search interaction",
      "Abort or ignore stale results",
      "Clear empty/error feedback",
    ],
  };
}

export function hardTsBundle(topicTitle: string, interviewQ: string, summary: string) {
  return {
    minutes: 20,
    scenario: `TypeScript interview for "${topicTitle}". Interviewer asks: ${interviewQ}.`,
    task: `Model the domain with types/interfaces and a small typed function that answers "${interviewQ}". Prefer discriminated unions or generics where they clarify safety.`,
    hints: [
      "Types should make illegal states unrepresentable.",
      "Prefer unknown + narrowing over any.",
      "Show the call site that proves the types help.",
    ],
    takeaways: [
      "Hard TS = domain modeling, not a typed string variable.",
      clip(interviewQ),
    ],
    referenceHtml: `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8" /><title>${topicTitle}</title></head>
<body><main class="page"><h1>${topicTitle}</h1><output id="out"></output></main></body></html>`,
    referenceJs: `// Interview: ${interviewQ}
type Plan = "free" | "pro" | "team";

interface Customer {
  id: number;
  email: string;
  plan: Plan;
}

type Result =
  | { ok: true; customer: Customer }
  | { ok: false; error: "not_found" | "forbidden" };

function upgrade(customer: Customer, next: Plan): Result {
  if (customer.plan === "team" && next !== "team") {
    return { ok: false, error: "forbidden" };
  }
  return { ok: true, customer: { ...customer, plan: next } };
}

const ada: Customer = { id: 1, email: "ada@example.com", plan: "pro" };
const result = upgrade(ada, "team");
const out = document.querySelector("#out");
if (out) {
  out.textContent = result.ok
    ? \`Upgraded \${result.customer.email} → \${result.customer.plan}\`
    : \`Blocked: \${result.error} (\${JSON.stringify("${clip(summary).slice(0, 40)}")})\`;
}
`,
    acceptanceCriteria: [
      "Meaningful types (union/interface)",
      "Typed function with a real branch",
      "Call site demonstrates safety",
    ],
  };
}

export function hardReactBundle(topicTitle: string, interviewQ: string) {
  const safe = topicTitle.replace(/"/g, "");
  return {
    minutes: 22,
    scenario: `React interview for "${safe}". Interviewer asks: ${interviewQ}.`,
    task: `Build a small controlled component that answers "${interviewQ}": local state, derived UI, and an empty/loading/error path. Prefer clear naming over clever hooks.`,
    hints: [
      "Lift state only when siblings need it.",
      "Derive values during render when possible.",
      "Name handlers onX / handleX consistently.",
    ],
    takeaways: [
      "Hard React = state + UI states, not a static paragraph.",
      clip(interviewQ),
    ],
    referenceJs: `// Interview: ${interviewQ}
import { useMemo, useState } from "react";

type Status = "idle" | "loading" | "error" | "ready";

const SEEDS = ["Billing", "Auth", "Search", "Reports"];

export default function Answer() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<Status>("ready");

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SEEDS.filter((s) => s.toLowerCase().includes(q));
  }, [query]);

  function onRetry() {
    setStatus("loading");
    window.setTimeout(() => setStatus("ready"), 400);
  }

  return (
    <main className="page">
      <h1>${safe}</h1>
      <label htmlFor="q">Filter modules</label>
      <input
        id="q"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type to filter…"
      />
      {status === "loading" ? <p>Loading…</p> : null}
      {status === "error" ? (
        <p>
          Something failed. <button type="button" onClick={onRetry}>Retry</button>
        </p>
      ) : null}
      {status === "ready" && items.length === 0 ? <p>No matches.</p> : null}
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </main>
  );
}
`,
    acceptanceCriteria: [
      "Controlled input + derived list",
      "Loading/empty/error path present",
      "Readable component structure",
    ],
  };
}

export function hardApiBundle(topicTitle: string, interviewQ: string) {
  return {
    minutes: 20,
    scenario: `API design interview for "${topicTitle}". Interviewer asks: ${interviewQ}.`,
    task: `Show a production-shaped client: timeout-ish abort, non-2xx handling, typed-ish JSON parsing, and retries with backoff for idempotent GETs.`,
    hints: [
      "Never assume res.ok — check status.",
      "AbortController for timeouts.",
      "Only retry idempotent requests.",
    ],
    takeaways: [
      "Hard API work = failure modes, not a happy-path fetch.",
      clip(interviewQ),
    ],
    referenceJs: `// Interview: ${interviewQ}
async function fetchJson(url, { signal, retries = 2 } = {}) {
  let attempt = 0;
  while (true) {
    try {
      const res = await fetch(url, {
        headers: { Accept: "application/json" },
        signal,
      });
      if (!res.ok) {
        const body = await res.text();
        throw new Error(\`HTTP \${res.status}: \${body.slice(0, 120)}\`);
      }
      return await res.json();
    } catch (err) {
      if (err.name === "AbortError" || attempt >= retries) throw err;
      attempt += 1;
      await new Promise((r) => setTimeout(r, 200 * 2 ** attempt));
    }
  }
}

async function loadDashboard() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 4000);
  try {
    const data = await fetchJson("https://api.example.com/v1/metrics", {
      signal: controller.signal,
    });
    console.log("metrics", data);
    return data;
  } finally {
    clearTimeout(timer);
  }
}

loadDashboard().catch((err) => console.error("dashboard failed", err));
`,
    acceptanceCriteria: [
      "Handles non-OK responses",
      "Supports abort/timeout",
      "Retry only with clear limits",
    ],
  };
}

export function hardNextjsBundle(topicTitle: string, interviewQ: string) {
  return {
    minutes: 22,
    scenario: `Next.js hiring interview for "${topicTitle}". Interviewer asks: ${interviewQ}. They expect App Router trade-offs, not a static marketing page.`,
    task: `Answer "${interviewQ}" with a production-shaped App Router sketch: Server Component data fetch, a small Client Component island for interactivity, caching/revalidate intent, and comments explaining Server vs Client boundaries.`,
    hints: [
      "Default to Server Components; add 'use client' only for state/effects.",
      "Show fetch caching or revalidate so the answer is production-minded.",
      "Name failure modes: waterfalls, leaking secrets, over-clientizing.",
    ],
    takeaways: [
      "Hard Next.js = boundaries, caching, and data ownership - not a hello world page.",
      clip(interviewQ),
    ],
    referenceJs: `// Interview: ${interviewQ}
// app/dashboard/page.tsx - Server Component (default)
import { Suspense } from "react";
import { MetricFilters } from "./metric-filters"; // Client Component

async function getMetrics() {
  // Cache intentionally: dashboard can be slightly stale; cut origin load.
  const res = await fetch("https://api.example.com/v1/metrics", {
    next: { revalidate: 30, tags: ["metrics"] },
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(\`metrics HTTP \${res.status}\`);
  return res.json() as Promise<{ revenueCents: number; orders: number }>;
}

export default async function DashboardPage() {
  const metrics = await getMetrics();
  return (
    <main className="page">
      <h1>${topicTitle.replace(/"/g, "")}</h1>
      <p>Revenue: {(metrics.revenueCents / 100).toFixed(2)}</p>
      <Suspense fallback={<p>Loading filters...</p>}>
        <MetricFilters initialOrders={metrics.orders} />
      </Suspense>
    </main>
  );
}

// app/dashboard/metric-filters.tsx
"use client";
import { useState, useTransition } from "react";

export function MetricFilters({ initialOrders }: { initialOrders: number }) {
  const [orders, setOrders] = useState(initialOrders);
  const [pending, startTransition] = useTransition();

  return (
    <section>
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(() => setOrders((n) => n + 1))
        }
      >
        {pending ? "Updating..." : \`Optimistic bump (\${orders})\`}
      </button>
      {/* Interview note: keep secrets and DB access on the server; client only holds UI state. */}
    </section>
  );
}
`,
    acceptanceCriteria: [
      "Shows Server vs Client Component split",
      "Includes fetch caching/revalidate intent",
      "Comments explain interview trade-offs",
    ],
  };
}

export function hardAuthBundle(topicTitle: string, interviewQ: string) {
  return {
    minutes: 22,
    scenario: `Security / auth interview for "${topicTitle}". Interviewer asks: ${interviewQ}. They want threat-aware HTTP + client code used in real apps.`,
    task: `Answer "${interviewQ}" with a session login + protected-resource flow: secure cookies, CSRF defense, 401 vs 403 handling, and comments on token storage trade-offs.`,
    hints: [
      "HttpOnly + Secure + SameSite cookies beat localStorage for session tokens.",
      "401 = not authenticated; 403 = authenticated but not allowed.",
      "Never put long-lived secrets in JS that ships to the browser.",
    ],
    takeaways: [
      "Hard auth = threat model + cookie/CSRF discipline, not Authorization: Bearer toy.",
      clip(interviewQ),
    ],
    referenceJs: `// Interview: ${interviewQ}
async function login(email, password, csrfToken) {
  const res = await fetch("https://api.example.com/auth/login", {
    method: "POST",
    credentials: "include", // receive Set-Cookie: session
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": csrfToken,
    },
    body: JSON.stringify({ email, password }),
  });
  if (res.status === 401) throw new Error("Invalid credentials");
  if (!res.ok) throw new Error(\`login HTTP \${res.status}\`);
  return res.json();
}

async function loadBilling(csrfToken) {
  const res = await fetch("https://api.example.com/billing/invoices", {
    credentials: "include",
    headers: {
      Accept: "application/json",
      "X-CSRF-Token": csrfToken,
    },
  });
  if (res.status === 401) {
    // session expired - restart authn
    window.location.assign("/login");
    return;
  }
  if (res.status === 403) {
    // authenticated but missing role/permission - authz failure
    throw new Error("Forbidden: missing billing.read");
  }
  if (!res.ok) throw new Error(\`billing HTTP \${res.status}\`);
  return res.json();
}

login("dev@acme.test", "********", "csrf_xyz")
  .then(() => loadBilling("csrf_xyz"))
  .then((invoices) => console.log("invoices", invoices))
  .catch((err) => console.error(err));
`,
    acceptanceCriteria: [
      "Uses credentials/cookies intentionally",
      "Distinguishes 401 vs 403",
      "Mentions CSRF or cookie flags in comments/HTTP",
    ],
  };
}

export function hardModelingBundle(topicTitle: string, interviewQ: string) {
  const schemaNotes = `ER - ${topicTitle} (interview depth)
Entities:
  tenants (1) --< (N) users via tenant_memberships
  users (1) --< (N) projects
  projects (1) --< (N) tasks
  tasks (N) >--< (N) labels via task_labels

Cardinality notes:
  - A user may belong to many tenants (SaaS multi-tenant).
  - Soft-delete with deleted_at keeps audit history.
  - Unique (tenant_id, email) prevents cross-tenant collisions.

Interview focus: ${interviewQ}
`;

  const ddl = `-- Interview: ${interviewQ}
-- Production-shaped multi-tenant model with constraints an interviewer expects.

CREATE TABLE tenants (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE tenant_memberships (
  tenant_id INTEGER NOT NULL REFERENCES tenants(id),
  user_id INTEGER NOT NULL REFERENCES users(id),
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
  PRIMARY KEY (tenant_id, user_id)
);

CREATE UNIQUE INDEX uq_users_email_active
  ON users (email)
  WHERE deleted_at IS NULL;

CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL REFERENCES tenants(id),
  name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'archived')),
  created_by INTEGER NOT NULL REFERENCES users(id),
  UNIQUE (tenant_id, name)
);

CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL REFERENCES tenants(id),
  project_id INTEGER NOT NULL REFERENCES projects(id),
  title TEXT NOT NULL,
  assignee_id INTEGER REFERENCES users(id),
  status TEXT NOT NULL CHECK (status IN ('todo', 'doing', 'done')),
  due_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tasks_tenant_project ON tasks (tenant_id, project_id);
CREATE INDEX idx_tasks_assignee ON tasks (assignee_id) WHERE assignee_id IS NOT NULL;

-- Always filter by tenant_id in application queries to avoid data leaks.
`;

  return {
    minutes: 22,
    scenario: `Data modeling interview for "${topicTitle}". Interviewer asks: ${interviewQ}. They want ER + DDL that could ship in a SaaS product.`,
    task: `Answer "${interviewQ}" with ER notes and DDL: multi-table relationships, keys, CHECK constraints, indexes, and a comment on tenant isolation.`,
    hints: [
      "Model many-to-many with a junction table - never CSV columns.",
      "Put tenant_id on tenant-owned rows and index it.",
      "Explain soft-delete vs hard-delete trade-offs.",
    ],
    takeaways: [
      "Hard modeling = cardinality, constraints, and isolation - not a single LABEL table.",
      clip(interviewQ),
    ],
    referenceSchema: schemaNotes,
    referenceSql: ddl,
    acceptanceCriteria: [
      "Multiple related tables with FKs",
      "Meaningful constraints/indexes",
      "Comments address the interview question",
    ],
  };
}
