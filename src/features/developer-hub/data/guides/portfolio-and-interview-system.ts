import type { HubSection } from "../../types";
import { sec } from "./_helpers";

export const portfolioAndInterviewSystemMeta = {
  overviewBody: `Hiring managers skim hundreds of identical "todo app + Netflix clone" portfolios. What gets interviews is evidence of ownership: problems you scoped, trade-offs you defended, and systems you shipped — told in a format reviewers can verify in 90 seconds.

This guide builds a portfolio that proves engineering judgment, plus a repeatable practice system for system design, coding, and behavioral rounds — spaced, measured, and aligned to the bar at product companies — not LeetCode volume for its own sake.`,
  objectives: [
    "Structure 2–3 portfolio projects that demonstrate ownership, depth, and measurable outcomes",
    "Run a weekly interview prep loop: system design, coding, behavioral with retros",
    "Prepare system design stories with numbers, diagrams, and explicit trade-offs",
    "Deliver behavioral answers in STAR format tied to staff-level competencies",
  ],
  prerequisites: [
    "Shipped at least one non-tutorial project",
    "Basic resume and LinkedIn profile",
    "Targeting software engineer roles at product companies",
  ],
  takeaways: [
    "Portfolio case study: problem → constraints → your decisions → outcome metrics → link to repo/demo",
    "One deep project beats five shallow clones",
    "System design practice: timed 45-min sessions with written postmortem",
    "Behavioral prep: 8–10 stories covering conflict, failure, leadership, technical depth",
  ],
};

export const portfolioAndInterviewSystemSections: HubSection[] = [
  sec(
    "portfolio-proof",
    "1. Portfolio that proves ownership",
    `Reviewers ask: "Did this person make decisions or follow a tutorial?"

Strong case study structure (one page per project):
• Problem — who hurt, what broke, why existing tools failed
• Constraints — time, stack, team size, scale (real or realistic)
• Your role — "I owned API design and deploy" not "we built"
• Key decisions — 2–3 with trade-offs (Postgres vs Dynamo, sync vs async)
• Outcome — metrics: latency, users, revenue, error rate, ship date
• Proof — live demo, GitHub (clean README), 2-min Loom walkthrough

Project selection:
• One full-stack product (auth, payments, admin, deploy)
• One depth piece (performance win, migration, infra, ML feature)
• Optional OSS contribution with merged PR to real repo

Kill:
• Tutorial forks without diff
• "Coming soon" landing pages
• Screenshots without repo or deploy link

README bar: architecture diagram, setup in <5 commands, env example, test command.`,
    {
      checklist: [
        "Each project has live URL or verifiable demo",
        "README explains decisions, not just features list",
        "Metrics or concrete outcomes stated honestly",
      ],
    }
  ),
  sec(
    "case-study",
    "2. Writing the case study — 90-second skim test",
    `Above the fold:
Title + one-line outcome ("Cut checkout p99 from 2.1s to 380ms")
Stack tags + your role + timeline

Section 1 — Context (3 sentences)
Section 2 — Architecture diagram (boxes: client, API, DB, cache, queue)
Section 3 — Deep dive on hardest decision (before/after, alternatives rejected)
Section 4 — What broke in prod (shows maturity)
Section 5 — Links

Diagram tools: Excalidraw, tldraw — hand-drawn beats over-designed.

For juniors: internship and serious capstone count if decision detail is real.

For seniors: org impact — mentored, incident led, cross-team design.

SEO: portfolio URL on resume; custom domain optional; GitHub pinned repos match case studies.`,
    {
      bullets: [
        "Headline metric in title or subtitle",
        "One architecture diagram per project",
        "Honest 'what I'd do differently' section",
      ],
    }
  ),
  sec(
    "system-design-prep",
    "3. System design practice system",
    `Weekly cadence (90 min):
1. Pick prompt (Design URL shortener, feed, chat, checkout)
2. 45 min timed: requirements → API → data → scale → failure (use system-design-roadmap sequence)
3. 20 min written postmortem: bottlenecks, what you'd deep-dive in follow-up
4. 25 min compare to reference (DDIA chapter, engineering blog)

Track spreadsheet:
Date | Prompt | Self-score (1–5) on clarity, numbers, failure modes | Gaps

Level expectations:
Mid: modular monolith, SQL, cache, clear API
Senior: explicit SLOs, multi-region trade-off, observability, rollout
Staff: org constraints, build vs buy, cost model, evolutionary path

Common fail: boxes without data model or QPS estimate.

Practice out loud — interviews are communication tests.

Pair monthly with peer mock; rotate interviewer role.`,
    {
      checklist: [
        "45-min timed session weekly",
        "Postmortem written after each session",
        "Requirements and capacity math on every attempt",
      ],
    }
  ),
  sec(
    "coding-prep",
    "4. Coding interview — quality over volume",
    `Pattern: 45 min problem, 15 min review — 4–5 sessions/week max for employed candidates; quality drops after that.

Problem sources:
• NeetCode 150 / Blind 75 as coverage checklist, not religion
• Company-tagged if targeting specific employer
• Implement from scratch: LRU cache, rate limiter, task queue — shows production thinking

Process in interview:
1. Clarify inputs, edge cases, size limits (2 min)
2. Brute force + complexity (3 min)
3. Optimal approach in plain English (5 min)
4. Code with readable names (25 min)
5. Test with examples + edge case (5 min)

Language: one primary (TypeScript/Python/Java). Same in portfolio and interview.

Anti-pattern: 500 problems memorized, cannot explain hash map choice.

Product company coding often includes practical take-home — treat like mini portfolio piece: tests, README, scope discipline.`,
    {
      bullets: [
        "Talk through approach before coding",
        "Test edge cases aloud",
        "Track weak topics (graphs, DP) not just count",
      ],
    }
  ),
  sec(
    "behavioral",
    "5. Behavioral — STAR bank that sounds human",
    `Prepare 8–10 stories mapping to:
• Conflict / disagreement
• Failure / mistake / postmortem
• Leadership without title
• Tight deadline / prioritization
• Technical depth / debugging war story
• Cross-functional / stakeholder management
• Mentoring / hiring loop participation
• Ambiguity / zero-to-one

STAR: Situation (2 sentences), Task, Action (you, specific), Result (metric or learning).

Staff bar adds: scope across teams, long-term trade-off, business outcome.

Avoid:
• "We" without your slice
• Humble-brag without concrete action
• Stories without result

Write bullets, not scripts — natural delivery.

Linked to resume: every bold claim has a story.`,
    {
      checklist: [
        "8+ stories written in bullet STAR",
        "Each maps to common competency rubric",
        "Results include numbers where possible",
      ],
    }
  ),
  sec(
    "weekly-system",
    "6. Weekly prep schedule (employed, 6–8 hr/week)",
    `Mon (1.5h): 1 system design timed + postmortem
Tue (1h): 2 coding problems + review
Wed (1h): behavioral story polish + record self on video
Thu (1.5h): portfolio/case study improvement OR take-home skill
Fri (1h): mock interview (peer or platform) or company research
Weekend (optional 2h): deep read (DDIA, blog) tied to weak design area

Spaced repetition: revisit weak design topic every 2 weeks.

4 weeks out from active search: increase mocks to 2/week; refresh stories for target company values.

Track mood and burnout — skip a day before grinding into bad habits.`,
  ),
  sec(
    "resume-link",
    "7. Resume ↔ portfolio ↔ interview alignment",
    `Resume bullet formula: Action + technology + outcome
"Reduced API p99 40% by adding Redis cache-aside and fixing N+1 Prisma queries"

Every resume bullet should expand into:
• Portfolio case study section, OR
• System design talking point, OR
• Behavioral story

Links: portfolio, GitHub, LinkedIn consistent dates and titles.

No keyword stuffing — interview will probe one bullet for 20 minutes.

Referrals: specific person + your relevant project link in ask message.

Recruiter screen prep: 2-min project pitch, why company, salary range research.`,
    {
      bullets: [
        "Each resume bullet defensible in depth",
        "Portfolio URL on resume header",
        "Projects match skills claimed",
      ],
    }
  ),
  sec(
    "offer-loop",
    "8. From loop to offer — closing the system",
    `Before onsite:
• Company product used; 2 thoughtful questions prepared
• Know their stack if public; map your stories

During loop:
• Same stories OK across interviewers — different angles
• System design: state assumptions; engage interviewer as collaborator
• Coding: communicate throughout

After each round:
• 5-min debrief note: questions asked, gaps, story performance

Offer stage:
• Comp bands from levels.fyi / peer convos
• Negotiate with evidence (other timeline, scope, level)

Rejection retro: request feedback once; update story bank or design gap.

System succeeds when interviews feel repetitive — you've told these stories before, with metrics, calmly.

Portfolio + practice system compound: better projects → better stories → better offers.`,
    {
      checklist: [
        "Post-interview debrief within 24h",
        "Question bank tailored per company",
        "Story bank updated after each cycle",
      ],
    }
  ),
];
