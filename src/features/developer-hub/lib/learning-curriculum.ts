import type { HubResource, HubSection } from "../types";

/**
 * Expands any catalog resource into a full senior-engineer learning journey
 * while preserving the original authored sections inside Implementation.
 */
export function buildLearningJourney(resource: HubResource): HubSection[] {
  const topic = resource.title;
  const tags = resource.tags.slice(0, 4).join(", ") || topic;
  const catLabel = resource.category.replace(/-/g, " ");

  const objectives =
    resource.objectives ??
    [
      `Explain ${topic} in a design review with clear trade-offs (latency, cost, complexity)`,
      `Map how real product teams use ${tags} under SLA and on-call pressure`,
      `Spot fresher mistakes early and fix them the way a senior would`,
      `Ship a small production-shaped slice: API, data, tests, metrics, rollout plan`,
    ];

  const prerequisites =
    resource.prerequisites ??
    [
      "Can read REST/JSON APIs and basic TypeScript (or equivalent)",
      "Knows Git, PRs, and how a feature moves from local → staging → prod",
      `Has basic ${catLabel} vocabulary (you do not need to be an expert yet)`,
    ];

  const authored = resource.sections.map((section, i) => ({
    ...section,
    id: section.id.startsWith("impl-") ? section.id : `impl-${section.id}`,
    kind: "content" as const,
    title:
      i === 0
        ? `Implementation deep-dive: ${section.title}`
        : section.title,
  }));

  const journey: HubSection[] = [
    {
      id: "overview",
      kind: "overview",
      title: "Overview",
      body: `${resource.description}\n\nIn real companies, ${topic} is not a textbook chapter — it is how teams ship features without breaking customers. This path takes you from fresher-friendly fundamentals to the decisions seniors make in design reviews, incidents, and hiring loops.`,
    },
    {
      id: "objectives",
      kind: "objectives",
      title: "Learning Objectives",
      body: "When you finish, you should be able to:",
      bullets: objectives,
    },
    {
      id: "prerequisites",
      kind: "prerequisites",
      title: "Prerequisites",
      body: "If any of these feel shaky, skim them first — then come back:",
      bullets: prerequisites,
    },
    {
      id: "meta",
      kind: "meta",
      title: "Estimated Time & Difficulty",
      body: `Study time: ~${resource.readingMinutes} minutes of focused reading.\nHands-on: add 1–3 hours for the mini project if you want portfolio proof.\n\nLevel: ${resource.difficulty} · Author: ${resource.author} · Updated: ${resource.updatedAt}\n\nFresher tip: read Overview → Why it matters → Architecture → one Implementation deep-dive before trying the project.`,
    },
    {
      id: "why",
      kind: "why",
      title: "Why this matters in real companies",
      body: `Product and platform teams invest in ${topic} when it protects revenue, reduces incidents, or speeds delivery.\n\nWhat “good” looks like at work:\n• A fresher can implement a ticket without inventing a new architecture\n• A mid-level engineer can propose trade-offs with data (p95 latency, cost, blast radius)\n• A senior can defend the design in review and own the on-call story\n\nHiring managers rarely ask for definitions alone — they ask how ${tags} behave when traffic spikes, a dependency fails, or a migration is half-done.`,
    },
    {
      id: "usecases",
      kind: "usecases",
      title: "Real-world use cases",
      body: `Where ${topic} shows up week-to-week:`,
      bullets: [
        `Customer-facing flows that depend on ${tags} (checkout, feed, auth, search, dashboards)`,
        "Internal platforms: admin tools, feature flags, CI pipelines, observability",
        "Launches & scale events: Black Friday, campaign spikes, new-region rollouts",
        "Incidents: timeouts, cache stampedes, bad deploys, data inconsistency",
        "Migrations: dual-write, shadow traffic, gradual cutover with a kill switch",
      ],
    },
    {
      id: "interview",
      kind: "interview",
      title: "Common interview questions",
      body: "Practice out loud. Strong answers name constraints, then trade-offs:",
      bullets: [
        `Explain ${topic} to a junior in under two minutes — then to a staff engineer in one`,
        "What fails first at 10× traffic, and which metric proves it?",
        "Day-one MVP vs six-month design: what do you deliberately skip?",
        "How do you test this safely in staging and watch it in production?",
        "Tell me about a time this went wrong — what was the root cause and fix?",
      ],
    },
    {
      id: "architecture",
      kind: "architecture",
      title: "Production architecture",
      body: `Production systems are layered. Before writing code for ${topic}, draw the path a request takes and who owns each box.\n\nDecisions seniors force early:\n• What is strongly consistent vs eventually consistent?\n• What is sync (user waits) vs async (queue/worker)?\n• What is cached, and what is the source of truth?\n• What is the blast radius if this service dies?\n\nUse the board below in design reviews — same shape almost every SaaS company uses.`,
    },
    {
      id: "implementation",
      kind: "implementation",
      title: "Implementation",
      body: `These are the core lessons for ${topic}. Read one block, implement a tiny experiment (even a sketch), then continue. Do not rush to the mini project until the deep-dives make sense.`,
    },
    ...authored,
    {
      id: "steps",
      kind: "steps",
      title: "Step-by-step explanation",
      body: "A sequence that works from fresher tickets to senior design docs:",
      checklist: [
        "Clarify user problem, scale numbers, SLOs, and non-goals",
        "Draw request path + data ownership (who writes what)",
        "Define API contracts and auth boundaries",
        "Build the happy path with boring, clear code",
        "Add timeouts, retries (idempotent), and structured errors",
        "Add metrics/logs/traces for the critical path",
        "Roll out behind a flag; rehearse rollback",
      ],
    },
    {
      id: "diagrams",
      kind: "diagram",
      title: "Visual diagrams",
      body: "Keep two living diagrams in the repo or Notion:\n1) Request flow (how a call moves)\n2) Data ownership (who is source of truth)\n\nStale diagrams cause more outages than missing ones. Update them in the same PR as architecture changes. The flow below is the delivery process teams actually follow.",
    },
    {
      id: "examples",
      kind: "examples",
      title: "Examples",
      body: `Company-shaped scenarios for ${topic}:`,
      bullets: [
        "Greenfield feature: ship the smallest correct design; leave extension points, not abstractions",
        "Growth spike: add caching/queue only after measuring the bottleneck",
        "Migration: dual-write + shadow-read, then cut over with a feature flag",
        "Incident: degrade gracefully (read-only mode, cached fallback) while you fix root cause",
      ],
    },
    {
      id: "code",
      kind: "code",
      title: "Code snippets",
      body: "Patterns you will see in real services — adapt names to your stack:",
      code: [
        {
          language: "typescript",
          title: "Timeouts are not optional in production",
          code: `async function withBudget<T>(fn: () => Promise<T>, ms = 2500): Promise<T> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fn();
  } finally {
    clearTimeout(timer);
  }
}`,
        },
        {
          language: "typescript",
          title: "Make failures explicit (no silent nulls)",
          code: `type Result<T> =
  | { ok: true; value: T }
  | { ok: false; error: string; retryable?: boolean };

function fail(error: string, retryable = false): Result<never> {
  return { ok: false, error, retryable };
}`,
        },
      ],
    },
    {
      id: "best-practices",
      kind: "best-practices",
      title: "Best practices",
      body: "Habits that keep systems boring (good boring):",
      bullets: [
        "Clear interfaces over clever abstractions — rename for the next reader",
        "Measure before optimizing; name the bottleneck in the PR description",
        "Idempotent writes for anything that can retry (payments, emails, webhooks)",
        "Own your dashboards: if you ship it, you can wake up for it",
        "Document the ‘why’ in the PR — future you will thank you",
      ],
    },
    {
      id: "mistakes",
      kind: "mistakes",
      title: "Common mistakes",
      body: "Freshers and juniors hit these often — seniors watch for them in review:",
      bullets: [
        "Building microservices before the second real use case",
        "No timeouts / unbounded retries → cascading failure",
        "Caching without a invalidation story → stale user data",
        "Logging secrets, tokens, or PII",
        "‘It works on my machine’ with zero staging validation",
        "Optimizing averages while p99 users are timing out",
      ],
    },
    {
      id: "performance",
      kind: "performance",
      title: "Performance considerations",
      body: `For ${topic}, companies care about user-visible latency and cost.\n\nPractical rules:\n• Watch p95/p99, not only averages\n• Find N+1 queries and unbounded fan-out early\n• Cache hot reads only after correctness is proven\n• Batch where it helps; do not batch if it hurts freshness SLAs\n• Capacity plan before marketing pushes traffic`,
    },
    {
      id: "security",
      kind: "security",
      title: "Security considerations",
      body: "Security is part of the design, not a later ticket:\n• Authenticate at the edge; authorize in the service that owns the data\n• Least-privilege credentials and short-lived tokens\n• Validate all untrusted input at boundaries\n• Encrypt sensitive data in transit (TLS) and at rest when required\n• Never log passwords, session tokens, or API keys\n• Threat-model: who can read, write, delete, or escalate?",
    },
    {
      id: "scalability",
      kind: "scalability",
      title: "Scalability notes",
      body: "Scale the bottleneck you measured — not the whole system.\n\nCommon company playbook:\n1) Vertical scale until it is painful\n2) Cache / CDN for read-heavy paths\n3) Queues for spikes and slow work\n4) Partition (shard) when a single DB writer is the wall\n\nKnow your shard key and rebalancing story before you need it at 2am.",
    },
    {
      id: "debugging",
      kind: "debugging",
      title: "Debugging tips",
      body: "On-call workflow used across product teams:\n1) Check recent deploys and feature flags\n2) Look at error rate, latency, saturation of dependencies\n3) Reproduce with the smallest request that fails\n4) Compare traces: healthy vs failing path\n5) Write the hypothesis before changing code\n6) Fix, add a regression test, update the runbook",
    },
    {
      id: "testing",
      kind: "testing",
      title: "Testing strategy",
      body: "Pyramid that companies actually fund:",
      bullets: [
        "Unit tests for pure business rules",
        "Contract tests at service boundaries",
        "Integration tests for the critical user path",
        "Load/soak tests for the known bottleneck before big launches",
        "Every production incident → a regression test + alert",
      ],
    },
    {
      id: "deployment",
      kind: "deployment",
      title: "Deployment checklist",
      body: `Do not ship ${topic} changes until these are green:`,
      checklist: [
        "Feature flag or percentage rollout plan",
        "Dashboards + alerts for the critical path",
        "Rollback rehearsed (and documented)",
        "DB migrations are backward-compatible with the previous app version",
        "On-call knows blast radius and escalation",
        "Staging validated with production-like data shape",
      ],
    },
    {
      id: "standards",
      kind: "standards",
      title: "Industry standards",
      body: `Align with what serious teams expect around ${tags}:\n• SLOs and error budgets (not vibes)\n• Structured logs + distributed traces (OpenTelemetry-style)\n• Secure defaults inspired by OWASP\n• Runbooks a tired engineer can follow at 3am\n• Postmortems that blame process, not people`,
    },
    {
      id: "summary",
      kind: "summary",
      title: "Summary",
      body: `${topic} is a decision toolkit. Freshers learn the vocabulary and a correct happy path. Mid-levels own trade-offs and incidents. Seniors design for failure, cost, and clarity.\n\nIf you can explain the architecture board, implement a vertical slice, and defend your trade-offs — you are job-ready on this topic.`,
    },
    {
      id: "takeaways",
      kind: "takeaways",
      title: "Key takeaways",
      body: "Carry these into your next PR or interview:",
      bullets: [
        `You can connect ${topic} to real customer and ops impact`,
        "You know the production request path and failure modes",
        "You have a testing + rollout checklist, not just ‘it works locally’",
        "You can ship a small project that proves the skill",
      ],
    },
    {
      id: "quiz",
      kind: "quiz",
      title: "Knowledge check",
      body: "Write answers before peeking at docs or AI:",
      bullets: [
        `What business problem does ${topic} primarily solve?`,
        "Name two trade-offs you would raise in a design review",
        "Which metric proves the design is healthy in production?",
        "What is the first thing you check during an incident?",
      ],
    },
    {
      id: "challenge",
      kind: "challenge",
      title: "Mini challenge",
      body: `45-minute design drill: redesign ${topic} for 10× traffic. List assumptions, the bottleneck, what you would cache/queue, and a one-week implementation plan. Clarity beats cleverness.`,
    },
    {
      id: "exercise",
      kind: "exercise",
      title: "Hands-on exercise",
      body: `Build a vertical slice locally for ${topic}: one API endpoint, one persistence path, one automated test, and one log/metric query that proves it works. That is how juniors earn trust on real teams.`,
    },
    {
      id: "project",
      kind: "project",
      title: "Mini project",
      body: `Weekend deliverable: a small app or service applying ${topic}. Include README (problem, architecture diagram, trade-offs), tests, and a 3-minute walkthrough. That package is interview gold.`,
    },
    {
      id: "next-topic",
      kind: "next",
      title: "Next recommended topic",
      body: resource.nextSlug
        ? "Continue to the next guide in this track after you finish the mini project — momentum beats perfect notes."
        : `Next, pick a related ${catLabel} guide that stretches your weakest area: scale, security, or developer experience.`,
    },
  ];

  return journey;
}
