import fs from "fs";
import path from "path";

const root = process.cwd();

function section(slug, title, description, topics) {
  return { slug, title, description, topics };
}

function topic(
  slug,
  title,
  summary,
  estimatedMinutes,
  difficulty,
  keywords,
  challengeWeight,
  explanation,
  commonMistakes,
  bestPractices,
  interviewQuestions,
  cheatSheet
) {
  return {
    slug,
    title,
    summary,
    estimatedMinutes,
    difficulty,
    keywords,
    challengeWeight,
    explanation,
    a11yNotes: [],
    commonMistakes,
    bestPractices,
    interviewQuestions,
    cheatSheet,
  };
}

function renderCurriculum(typeName, constName, flattenName, sections) {
  return `export type ${typeName}Difficulty = "beginner" | "intermediate" | "advanced";

export type ${typeName}TopicDef = {
  slug: string;
  title: string;
  summary: string;
  estimatedMinutes: number;
  difficulty: ${typeName}Difficulty;
  keywords: string[];
  challengeWeight: number;
  explanation: string;
  a11yNotes: string[];
  commonMistakes: string[];
  bestPractices: string[];
  interviewQuestions: string[];
  cheatSheet: Array<{ tag: string; desc: string }>;
};

export type ${typeName}SectionDef = {
  slug: string;
  title: string;
  description: string;
  topics: ${typeName}TopicDef[];
};

export const ${constName}: ${typeName}SectionDef[] = ${JSON.stringify(sections, null, 2)};

export function ${flattenName}(): ${typeName}TopicDef[] {
  return ${constName}.flatMap((section) => section.topics);
}
`;
}

const capstoneSections = [
  section("problem-and-users", "Problem and Users", "Define the problem, users, and success before writing code.", [
    topic("capstone-overview", "Capstone Overview", "A capstone proves you can scope, build, and ship a real product end to end.", 12, "beginner", ["capstone", "portfolio", "scope"], 4,
      "A capstone is a portfolio project with intentional scope, architecture, and delivery. It should show product judgment, not only coding tricks. Plan what you will build, what you will cut, and how you will demo it. Treat planning as part of the deliverable.",
      ["Starting to code with no written scope", "Choosing a project too large to finish", "No demo story for reviewers"],
      ["Write a one-page brief first", "Define a finishable MVP", "Plan the demo early"],
      ["What makes a strong capstone?", "Why plan before coding?", "What should a demo prove?"],
      [{ tag: "MVP", desc: "Minimum viable product you can finish" }, { tag: "brief", desc: "One-page project summary" }, { tag: "demo", desc: "Story you will show reviewers" }]),
    topic("problem-statement", "Problem Statement", "State the user pain and why your product should exist.", 12, "beginner", ["problem", "pain", "why"], 4,
      "A problem statement explains who hurts, what fails today, and what better looks like. Avoid solution-first wording. Good statements help you reject unrelated features later. Keep it short enough to remember under pressure.",
      ["Describing features instead of pain", "Problem statements that fit any app", "No evidence the problem is real"],
      ["Write who / pain / today / better", "Validate with a real example", "Revisit the statement when scope creeps"],
      ["What belongs in a problem statement?", "Why avoid solution-first wording?", "How do you validate the problem?"],
      [{ tag: "who", desc: "Primary user or persona" }, { tag: "pain", desc: "Concrete frustration today" }, { tag: "outcome", desc: "Better state after your product" }]),
    topic("user-personas", "User Personas", "Personas focus decisions on a primary user, not everyone.", 10, "beginner", ["persona", "user", "jobs"], 3,
      "A persona captures goals, constraints, and context for a primary user. Capstones usually need one primary persona and maybe one secondary. Jobs-to-be-done language keeps features tied to outcomes. Do not invent five personas you cannot serve.",
      ["Too many personas", "Personas with no jobs or constraints", "Designing for yourself only without naming it"],
      ["Pick one primary persona", "List jobs and constraints", "Use the persona to reject features"],
      ["Why one primary persona?", "What is a job-to-be-done?", "How do personas reduce scope?"],
      [{ tag: "primary persona", desc: "Main user you optimize for" }, { tag: "job", desc: "Outcome the user hires the product for" }, { tag: "constraint", desc: "Time, skill, or device limits" }]),
    topic("success-metrics", "Success Metrics", "Define how you will know the capstone worked.", 12, "intermediate", ["metrics", "success", "kpi"], 4,
      "Success metrics can be qualitative for a portfolio project: completed happy path, demo clarity, or time-to-first-value. Pick a few measurable signals. Metrics keep polish focused on what matters for the story you tell.",
      ["No definition of done", "Vanity metrics with no user value", "Metrics that require production scale you do not have"],
      ["Choose 2-3 realistic success signals", "Tie metrics to the demo", "Use metrics to prioritize polish"],
      ["What is a realistic capstone metric?", "Why avoid vanity metrics?", "How do metrics guide polish?"],
      [{ tag: "definition of done", desc: "Clear finish criteria" }, { tag: "happy path", desc: "Core successful user journey" }, { tag: "time-to-value", desc: "How fast a user gets benefit" }]),
  ]),
  section("scope-and-mvp", "Scope and MVP", "Cut ruthlessly so you can finish and demo.", [
    topic("mvp-definition", "MVP Definition", "An MVP is the smallest product that proves the core value.", 12, "beginner", ["mvp", "scope", "cut"], 4,
      "MVP is not a half-broken app. It is a complete thin slice of value. Write must-have versus nice-to-have lists. Schedule cuts before you run out of time. A finished MVP beats an unfinished epic.",
      ["MVP that still includes every idea", "Cutting quality instead of scope", "No written must-have list"],
      ["List must-haves explicitly", "Cut features before quality", "Ship a thin complete slice"],
      ["What is an MVP?", "Must-have vs nice-to-have?", "Why cut features before quality?"],
      [{ tag: "must-have", desc: "Required for the demo story" }, { tag: "nice-to-have", desc: "Deferred if time is short" }, { tag: "thin slice", desc: "End-to-end value with minimal breadth" }]),
    topic("non-goals", "Non-Goals", "Non-goals protect focus by naming what you will not build.", 10, "beginner", ["non-goals", "focus", "scope"], 3,
      "Non-goals are explicit exclusions: no mobile app, no multi-tenant billing, no realtime collaboration. They make trade-offs visible to mentors and teammates. Update non-goals when priorities change.",
      ["Implicit exclusions nobody wrote down", "Non-goals that are actually required", "Never revisiting non-goals"],
      ["Write 3-5 non-goals", "Share them in the brief", "Revisit weekly"],
      ["Why write non-goals?", "Give an example non-goal", "When update them?"],
      [{ tag: "non-goal", desc: "Explicitly out of scope item" }, { tag: "trade-off", desc: "Conscious choice to exclude work" }, { tag: "brief", desc: "Document that holds scope decisions" }]),
    topic("user-stories", "User Stories", "Stories describe value from the user perspective.", 12, "beginner", ["stories", "acceptance", "backlog"], 4,
      "User stories follow a simple shape: as a persona, I want capability, so that outcome. Add acceptance criteria so done is testable. Keep stories small enough to finish in a day or two for a capstone.",
      ["Stories that are actually epics", "No acceptance criteria", "Technical tasks disguised as user value"],
      ["Write persona-oriented stories", "Add acceptance criteria", "Split epics into thin stories"],
      ["What is a user story?", "Why acceptance criteria?", "How small should a story be?"],
      [{ tag: "story", desc: "User-valued unit of work" }, { tag: "acceptance", desc: "Checks that prove the story is done" }, { tag: "epic", desc: "Large theme that must be split" }]),
    topic("prioritization", "Prioritization", "Order work by risk and demo value, not by fun.", 12, "intermediate", ["priority", "risk", "demo"], 4,
      "Prioritize the riskiest unknowns and the demo-critical path first. Fun side quests come last. A simple MoSCoW or risk/value matrix is enough for a capstone. Re-prioritize when you learn something new.",
      ["Building polish screens before core auth works", "Ignoring technical risks until late", "Priority lists that never change"],
      ["Do riskiest and demo-critical work first", "Use a simple priority method", "Revisit priorities after spikes"],
      ["What should you build first?", "What is risk-first prioritization?", "When re-prioritize?"],
      [{ tag: "risk-first", desc: "Tackle unknowns early" }, { tag: "MoSCoW", desc: "Must/Should/Could/Won't prioritization" }, { tag: "critical path", desc: "Work required for the demo story" }]),
  ]),
  section("architecture", "Architecture", "Sketch systems that match the MVP, not imaginary scale.", [
    topic("architecture-sketch", "Architecture Sketch", "Draw the major components and how data flows.", 14, "intermediate", ["architecture", "components", "diagram"], 5,
      "An architecture sketch names clients, APIs, databases, auth, and external services. Keep it proportional to the MVP. Diagrams clarify ownership and integration points. Update the sketch when reality diverges.",
      ["Enterprise diagrams for a weekend MVP", "No diagram at all", "Hiding critical external dependencies"],
      ["Sketch boxes and arrows for the MVP", "Name auth and data stores", "Keep the diagram current"],
      ["What belongs on an MVP architecture sketch?", "Why diagram external services?", "When update the sketch?"],
      [{ tag: "component", desc: "Deployable or logical part of the system" }, { tag: "data flow", desc: "How information moves between parts" }, { tag: "dependency", desc: "External service you rely on" }]),
    topic("tech-choices", "Tech Choices", "Choose tools you can ship with, and write why.", 12, "intermediate", ["stack", "trade-offs", "adr"], 4,
      "Tech choices should optimize for learning goals, speed, and reliability of the demo. Record alternatives considered and why you rejected them. Prefer boring technology for the critical path.",
      ["Choosing novel tech on the critical path with no buffer", "No written rationale", "Changing stacks mid-project casually"],
      ["Prefer familiar tools for the demo path", "Write short decision notes", "Isolate experiments from the critical path"],
      ["How do you choose a stack for a capstone?", "Why write decision notes?", "What is boring technology?"],
      [{ tag: "ADR", desc: "Architecture Decision Record" }, { tag: "critical path", desc: "Path required to ship the demo" }, { tag: "trade-off", desc: "Pros and cons of a choice" }]),
    topic("data-model-plan", "Data Model Plan", "List core entities and relationships before coding blindly.", 12, "intermediate", ["data", "entities", "schema"], 4,
      "A simple entity list prevents thrash. Name primary objects, keys, and relationships. Align the model with user stories. You can refine later, but start with a coherent sketch.",
      ["Inventing tables ad hoc in every PR", "Over-normalizing an MVP", "No link between entities and stories"],
      ["List entities and relationships", "Map entities to stories", "Keep the first schema simple"],
      ["What is an entity list?", "Why map entities to stories?", "When is over-normalization harmful?"],
      [{ tag: "entity", desc: "Core noun in your domain" }, { tag: "relationship", desc: "How entities connect" }, { tag: "schema sketch", desc: "Early data model draft" }]),
    topic("api-surface", "API Surface", "Define the endpoints or server actions your UI needs.", 12, "intermediate", ["api", "endpoints", "contract"], 4,
      "An API surface lists routes or server actions, inputs, and outputs for the MVP. Contracts help frontend and backend stay aligned even if you are solo. Keep it thin and story-driven.",
      ["Building random endpoints with no UI consumer", "No request/response shape", "Changing contracts silently every day"],
      ["List story-driven endpoints", "Document request/response shapes", "Version or note breaking changes"],
      ["What is an API surface?", "Why document contracts solo?", "How do stories drive endpoints?"],
      [{ tag: "endpoint", desc: "HTTP route or server action" }, { tag: "contract", desc: "Agreed request/response shape" }, { tag: "payload", desc: "Data sent or returned" }]),
    topic("auth-plan", "Auth Plan", "Decide how users sign in and what is protected.", 12, "intermediate", ["auth", "roles", "session"], 4,
      "Even simple products need an auth plan: who can access what, how sessions work, and what is public. Capstones often use a hosted auth provider. Document protected routes and roles explicitly.",
      ["Leaving admin routes unprotected", "No plan for logged-out states", "Building custom crypto auth unnecessarily"],
      ["List public vs protected routes", "Prefer a trusted auth provider for MVP", "Test unauthorized access"],
      ["What belongs in an auth plan?", "Public vs protected?", "Why prefer a provider for MVP?"],
      [{ tag: "session", desc: "Signed-in user state" }, { tag: "protected route", desc: "Requires authentication" }, { tag: "role", desc: "Permission grouping" }]),
  ]),
  section("delivery-planning", "Delivery Planning", "Milestones, risks, spikes, and estimation.", [
    topic("milestones", "Milestones", "Break the project into weekly outcomes you can demo.", 12, "beginner", ["milestones", "timeline", "plan"], 4,
      "Milestones are outcome checkpoints, not busywork. Example: auth works, core CRUD works, deploy works, demo rehearsed. Each milestone should produce visible progress. Slippage should trigger scope cuts.",
      ["Task lists with no outcomes", "One giant milestone at the end", "Ignoring slips until panic week"],
      ["Define weekly demoable outcomes", "Cut scope when slips happen", "Keep a visible timeline"],
      ["What is a good milestone?", "What do you do when a milestone slips?", "Why weekly outcomes?"],
      [{ tag: "milestone", desc: "Checkpoint with a demoable outcome" }, { tag: "timeline", desc: "Sequence of milestones" }, { tag: "slip", desc: "Missed checkpoint needing response" }]),
    topic("risk-register", "Risk Register", "Name top risks and mitigation plans early.", 12, "intermediate", ["risk", "mitigation", "spike"], 4,
      "A risk register lists what could sink the project: unfamiliar APIs, data model confusion, deploy issues. Pair each risk with a mitigation or spike. Review risks weekly.",
      ["Pretending there are no risks", "Risks with no mitigation", "Discovering deploy risk on the last day"],
      ["Write top 5 risks", "Schedule spikes for unknowns", "Review risks every week"],
      ["What is a risk register?", "What is a spike?", "Name common capstone risks"],
      [{ tag: "risk", desc: "Uncertain event that can hurt delivery" }, { tag: "mitigation", desc: "Action that reduces risk impact" }, { tag: "spike", desc: "Time-boxed research task" }]),
    topic("technical-spikes", "Technical Spikes", "Time-box research to answer unknowns before committing.", 10, "intermediate", ["spike", "research", "timebox"], 3,
      "Spikes are short investigations with a clear question and time limit. Output is a decision, not polished code. Use spikes for auth providers, hosting, or tricky integrations. Stop when the question is answered.",
      ["Open-ended research with no deadline", "Turning spikes into production features accidentally", "No written decision after a spike"],
      ["Write the question and timebox", "End with a decision note", "Keep spike code disposable"],
      ["What is a spike?", "What should a spike produce?", "Why time-box?"],
      [{ tag: "timebox", desc: "Fixed maximum duration" }, { tag: "decision", desc: "Choice made from spike learning" }, { tag: "disposable", desc: "Code not required to ship" }]),
    topic("estimation-basics", "Estimation Basics", "Estimate in ranges and plan buffers for unknowns.", 12, "intermediate", ["estimate", "buffer", "planning"], 4,
      "Capstone estimates are rough. Use ranges, add buffer for unknowns, and track actuals lightly. Prefer splitting work over precise hour fantasy. Estimation exists to force prioritization.",
      ["Single-point hour estimates treated as promises", "No buffer", "Never comparing actuals to estimates"],
      ["Estimate in ranges", "Add buffer for unknowns", "Split large items"],
      ["Why use ranges?", "What is buffer for?", "How does estimation help prioritization?"],
      [{ tag: "range", desc: "Low-high effort estimate" }, { tag: "buffer", desc: "Reserved time for uncertainty" }, { tag: "actuals", desc: "Time really spent" }]),
    topic("acceptance-criteria", "Acceptance Criteria", "Criteria make done objective for each story.", 10, "beginner", ["acceptance", "qa", "done"], 3,
      "Acceptance criteria are checks a reviewer can verify. Write them before building when possible. They feed your test plan and demo script. Vague criteria create endless polish debates.",
      ["Done means feels right", "Criteria written after coding only", "Unobservable criteria"],
      ["Write testable criteria", "Use them in QA", "Keep criteria visible with the story"],
      ["What makes criteria testable?", "When write them?", "How do they help demos?"],
      [{ tag: "criterion", desc: "Single verifiable check" }, { tag: "QA", desc: "Verification against criteria" }, { tag: "done", desc: "Story meets its criteria" }]),
  ]),
  section("collaboration-docs", "Planning Docs", "Briefs, ADRs, and README scaffolds reviewers expect.", [
    topic("project-brief", "Project Brief", "A brief is the one-pager mentors read first.", 12, "beginner", ["brief", "readme", "summary"], 4,
      "A project brief includes problem, users, MVP, non-goals, stack, and timeline. Keep it scannable. Update it when major decisions change. Your README can start from the brief.",
      ["README with only setup commands", "Briefs longer than anyone will read", "Outdated briefs that contradict the app"],
      ["Keep a one-page brief", "Link it from the README", "Update on major changes"],
      ["What sections belong in a brief?", "How long should it be?", "How does it relate to the README?"],
      [{ tag: "brief", desc: "One-page project overview" }, { tag: "scannable", desc: "Easy to skim for key facts" }, { tag: "README", desc: "Repo entry document" }]),
    topic("architecture-decision-records", "Architecture Decision Records", "ADRs capture important decisions and context.", 12, "intermediate", ["adr", "decision", "context"], 4,
      "An ADR records context, decision, and consequences. Use them for auth, hosting, and database choices. Short ADRs beat forgotten Slack messages. They help future you explain the portfolio.",
      ["Decisions only in chat history", "ADRs that rewrite history without dates", "Writing ADRs for trivial choices"],
      ["Write ADRs for significant choices", "Include alternatives considered", "Keep them short"],
      ["What is an ADR?", "When write one?", "What sections does it need?"],
      [{ tag: "context", desc: "Situation forcing a decision" }, { tag: "decision", desc: "Choice you made" }, { tag: "consequences", desc: "Follow-on effects of the choice" }]),
    topic("demo-script-outline", "Demo Script Outline", "Plan the story you will show before polish week.", 12, "beginner", ["demo", "script", "story"], 4,
      "A demo script lists setup, narrative beats, and backup plans if something fails. Rehearse with the script. Designing the demo early prevents building un-demoable features. Keep it under a few minutes for most reviews.",
      ["Improvising demos live with no script", "Demo depends on flaky seed data", "No backup path if a step fails"],
      ["Write beats and timing", "Prepare seed data", "Have a backup clip or screenshots"],
      ["What belongs in a demo script?", "Why rehearse?", "What is a backup plan?"],
      [{ tag: "beat", desc: "Narrative step in the demo" }, { tag: "seed data", desc: "Prepared data for a reliable demo" }, { tag: "backup", desc: "Fallback if live demo fails" }]),
    topic("definition-of-ready", "Definition of Ready", "Ready means a story is clear enough to build.", 10, "intermediate", ["ready", "backlog", "clarity"], 3,
      "Definition of ready checks that a story has persona value, acceptance criteria, and known dependencies before you start. It reduces mid-build confusion. Keep the checklist short for a solo capstone.",
      ["Starting stories with unclear outcomes", "Over-process for a solo project", "No dependency check"],
      ["Use a short ready checklist", "Clarify criteria before coding", "Identify dependencies first"],
      ["What is definition of ready?", "Why does it help solos?", "Name three ready checks"],
      [{ tag: "ready", desc: "Clear enough to start building" }, { tag: "dependency", desc: "Work or decision blocking progress" }, { tag: "checklist", desc: "Short readiness gates" }]),
  ]),
];

const shipSections = [
  section("polish", "Polish", "Hardening quality before you call it done.", [
    topic("ship-overview", "Ship Overview", "Shipping means polish, launch readiness, and a clear presentation.", 12, "beginner", ["ship", "launch", "polish"], 4,
      "Shipping a capstone is more than merging main. You polish UX, fix blockers, prepare docs, deploy stably, and rehearse the story. A shipped project is demoable by someone else with your README. Treat launch as a checklist, not a vibe.",
      ["Calling it shipped with a broken happy path", "No README setup", "Never rehearsing the demo"],
      ["Use a launch checklist", "Make setup reproducible", "Rehearse the demo"],
      ["What does shipped mean for a capstone?", "Why checklists help?", "What must a README enable?"],
      [{ tag: "launch checklist", desc: "Ordered ship-readiness tasks" }, { tag: "reproducible", desc: "Others can run it from docs" }, { tag: "rehearsal", desc: "Practice demo before review" }]),
    topic("bug-triage", "Bug Triage", "Rank bugs by user impact and demo risk.", 12, "beginner", ["bugs", "triage", "severity"], 4,
      "Triage separates blockers, major issues, and polish nits. Fix demo blockers first. Write short reproduction steps. Known issues lists are honest and useful in READMEs.",
      ["Fixing random nits while blockers remain", "No severity labels", "Bugs without reproduction steps"],
      ["Label blocker/major/nit", "Fix demo blockers first", "Document known issues"],
      ["What is a blocker?", "How do you triage?", "Why document known issues?"],
      [{ tag: "blocker", desc: "Prevents core demo or usage" }, { tag: "repro", desc: "Steps to reproduce a bug" }, { tag: "known issue", desc: "Documented unresolved defect" }]),
    topic("ux-polish-pass", "UX Polish Pass", "Do one focused pass on clarity, empty states, and errors.", 12, "intermediate", ["ux", "empty-states", "errors"], 4,
      "A polish pass improves labels, empty states, loading, and error messages on the happy path. Do not redesign everything. Consistency beats novelty in the final week.",
      ["Redesigning the whole UI late", "No empty states", "Technical error dumps shown to users"],
      ["Polish the happy path first", "Add empty and error states", "Keep copy clear and consistent"],
      ["What belongs in a polish pass?", "Why happy path first?", "What makes a good empty state?"],
      [{ tag: "empty state", desc: "UI when there is no data yet" }, { tag: "loading state", desc: "UI while work is in progress" }, { tag: "error copy", desc: "Human-readable failure message" }]),
    topic("accessibility-smoke", "Accessibility Smoke", "Quick checks catch basic a11y failures before launch.", 10, "intermediate", ["a11y", "keyboard", "labels"], 3,
      "Smoke a11y: keyboard through the happy path, check labels, contrast on key screens, and focus visibility. You will not perfect WCAG in a day, but you can avoid obvious traps. Note remaining issues honestly.",
      ["Mouse-only testing", "Icon buttons with no accessible name", "Ignoring focus outlines"],
      ["Keyboard-test the happy path", "Label interactive controls", "Keep visible focus styles"],
      ["Name three a11y smoke checks", "Why keyboard test?", "What is an accessible name?"],
      [{ tag: "keyboard", desc: "Navigate without a mouse" }, { tag: "accessible name", desc: "Text assistive tech uses for a control" }, { tag: "focus", desc: "Indicator of the active element" }]),
    topic("performance-basics", "Performance Basics", "Fix only the slowdowns users will feel in the demo.", 12, "intermediate", ["performance", "lazy", "bundle"], 4,
      "Measure the demo path. Lazy-load heavy routes, compress images, and avoid obvious N+1 calls. Premature micro-optimizations waste ship week. Aim for snappy first interaction on the story path.",
      ["Optimizing unused pages", "Huge images on the landing screen", "No measurement before optimizing"],
      ["Measure the demo path", "Fix user-visible slowness", "Defer non-critical work"],
      ["What should you optimize first?", "Why measure?", "Name a common ship-week win"],
      [{ tag: "LCP", desc: "Largest contentful paint style concern" }, { tag: "lazy load", desc: "Load code/data when needed" }, { tag: "demo path", desc: "Screens shown in the presentation" }]),
  ]),
  section("docs-and-story", "Docs and Story", "README, changelog, and portfolio narrative.", [
    topic("readme-for-humans", "README for Humans", "A good README gets a stranger running and understanding the app.", 12, "beginner", ["readme", "setup", "docs"], 4,
      "Include overview, features, stack, setup, env vars, scripts, and demo notes. Add screenshots if helpful. Keep commands copy-pasteable. Link architecture notes and known issues.",
      ["README with only a title", "Secret keys committed as examples", "Setup steps that do not work"],
      ["Write reproducible setup", "Document env vars safely", "Include demo and known issues"],
      ["What sections belong in a README?", "How do you document env vars?", "Why include known issues?"],
      [{ tag: "setup", desc: "Steps to run locally" }, { tag: "env example", desc: "Safe template for required variables" }, { tag: "scripts", desc: "npm/pnpm commands to run" }]),
    topic("changelog-and-tags", "Changelog and Tags", "Version tags and changelogs mark what you shipped.", 10, "beginner", ["changelog", "semver", "tags"], 3,
      "Tag a release when you ship. Write a short changelog of user-facing changes. Tags help mentors check out a known-good revision. Keep versions simple for a capstone.",
      ["No tag on the presented version", "Changelog of unrelated commits", "Moving tags after the fact silently"],
      ["Tag the demo revision", "Summarize user-facing changes", "Keep the presented tag stable"],
      ["Why tag a release?", "What belongs in a changelog?", "What is a known-good revision?"],
      [{ tag: "tag", desc: "Named git pointer to a release" }, { tag: "changelog", desc: "Human summary of changes" }, { tag: "semver", desc: "Version numbering scheme" }]),
    topic("portfolio-writeup", "Portfolio Writeup", "Explain problem, role, architecture, and results for your portfolio.", 12, "intermediate", ["portfolio", "writeup", "story"], 4,
      "A portfolio writeup covers problem, your role, stack, architecture highlights, challenges, and outcomes. Screenshots and a live link help. Be honest about trade-offs. Recruiters skim, so lead with impact.",
      ["Only dumping the repo link", "No mention of trade-offs", "Writing a novel nobody finishes"],
      ["Lead with problem and outcome", "Show architecture highlights", "Include screenshots and links"],
      ["What sections belong in a writeup?", "Why mention trade-offs?", "How long should it be?"],
      [{ tag: "impact", desc: "Outcome or learning highlighted first" }, { tag: "role", desc: "What you personally owned" }, { tag: "live link", desc: "Deployed demo URL" }]),
    topic("presentation-deck", "Presentation Deck", "A short deck supports your live demo without replacing it.", 12, "beginner", ["presentation", "slides", "talk"], 3,
      "Slides should cover problem, demo agenda, architecture, and learnings. Keep text sparse. The product is the star. Timebox each section and practice transitions.",
      ["Reading dense slides aloud", "No agenda", "Demo with zero narrative framing"],
      ["Keep slides sparse", "Agenda then demo then architecture", "Practice transitions"],
      ["What slides do you need?", "Why sparse text?", "How do slides support the demo?"],
      [{ tag: "agenda", desc: "Ordered talk sections" }, { tag: "sparse slides", desc: "Minimal text, strong visuals" }, { tag: "transition", desc: "Move between talk and demo cleanly" }]),
  ]),
  section("launch-ops", "Launch Ops", "Deploy, monitor, and prepare for failure.", [
    topic("launch-checklist", "Launch Checklist", "A checklist prevents missed env, DNS, and smoke steps.", 12, "beginner", ["checklist", "launch", "smoke"], 4,
      "Launch checklists cover env vars, migrations, smoke tests, analytics, and rollback owner. Check items in order. Keep the list short enough to actually use on launch day.",
      ["Improvising production launch", "No smoke test after deploy", "Nobody owns rollback"],
      ["Write an ordered checklist", "Smoke test after deploy", "Name a rollback owner"],
      ["What belongs on a launch checklist?", "Why order matters?", "Who owns rollback?"],
      [{ tag: "smoke", desc: "Quick post-deploy verification" }, { tag: "owner", desc: "Person accountable for a step" }, { tag: "env vars", desc: "Runtime configuration for launch" }]),
    topic("production-smoke", "Production Smoke", "Verify the happy path on the real deployment.", 10, "beginner", ["smoke", "prod", "verify"], 3,
      "After deploy, run the demo path on production with fresh eyes. Check auth, core create/read flows, and critical links. Record results. Fix blockers before presenting.",
      ["Assuming staging equals production", "No written smoke results", "Demoing without a production check"],
      ["Run the demo path in production", "Record pass/fail", "Fix blockers before the talk"],
      ["What is production smoke?", "Why not trust staging alone?", "What do you record?"],
      [{ tag: "prod", desc: "Live deployed environment" }, { tag: "happy path", desc: "Core successful journey" }, { tag: "pass/fail", desc: "Smoke result status" }]),
    topic("monitoring-basics", "Monitoring Basics", "Know when the deployed app is unhealthy.", 12, "intermediate", ["monitoring", "logs", "alerts"], 4,
      "Even a capstone benefits from basic logs, error tracking, and an uptime check if possible. Know where to look when the demo fails. Do not build a full observability platform in ship week.",
      ["No idea where logs live", "Alert spam with no action", "Ignoring errors until the presentation"],
      ["Enable basic error tracking", "Know how to fetch recent logs", "Watch errors before the demo"],
      ["What minimal monitoring helps a capstone?", "Where do you look during an incident?", "Why before the demo?"],
      [{ tag: "error tracking", desc: "Capture exceptions from production" }, { tag: "uptime", desc: "Check that the site responds" }, { tag: "logs", desc: "Runtime records for debugging" }]),
    topic("rollback-plan", "Rollback Plan", "Know how to restore the last good release quickly.", 12, "intermediate", ["rollback", "release", "incident"], 4,
      "A rollback plan names the previous good tag, how to redeploy it, and what DB changes are unsafe to reverse. Practice once if you can. Presenting from a known-good tag beats debugging live.",
      ["No previous tag", "Irreversible migration with no forward fix", "Never tested rollback"],
      ["Keep a previous good tag", "Document rollback commands", "Avoid risky migrations near demo day"],
      ["What does a rollback plan include?", "Why keep previous tags?", "What makes migrations risky?"],
      [{ tag: "previous tag", desc: "Last known good release" }, { tag: "redeploy", desc: "Ship the previous artifact again" }, { tag: "forward fix", desc: "Ship a fix instead of rolling back" }]),
    topic("incident-lite", "Incident Lite", "A tiny runbook for demo-day failures.", 10, "intermediate", ["incident", "runbook", "demo"], 3,
      "Demo-day incidents happen: expired env, cold starts, seed data missing. A lite runbook lists top failures and fixes. Screenshots or a recorded backup save presentations. Stay calm and narrate.",
      ["No backup recording", "Panic debugging in silence", "Single point of failure with no alternative"],
      ["List top failure fixes", "Keep a backup recording", "Narrate while recovering"],
      ["What is a lite runbook?", "Why a backup recording?", "How should you behave on failure?"],
      [{ tag: "runbook", desc: "Steps to fix common failures" }, { tag: "backup recording", desc: "Pre-recorded demo fallback" }, { tag: "narrate", desc: "Explain recovery to the audience" }]),
  ]),
  section("feedback-and-next", "Feedback and Next", "Collect feedback and plan what comes after launch.", [
    topic("feedback-collection", "Feedback Collection", "Gather structured feedback from reviewers and users.", 12, "beginner", ["feedback", "survey", "notes"], 4,
      "Ask specific questions: clarity, trust, missing features, bugs. Capture notes in one place. Thank reviewers. Convert feedback into a short backlog for portfolio follow-ups.",
      ["Only asking was it good", "Losing feedback in chat", "Defensive responses to critique"],
      ["Ask specific questions", "Centralize notes", "Turn feedback into backlog items"],
      ["What questions should you ask?", "Where store feedback?", "What do you do after?"],
      [{ tag: "structured feedback", desc: "Specific questions and answers" }, { tag: "backlog", desc: "Ordered follow-up work" }, { tag: "reviewer", desc: "Person giving critique" }]),
    topic("postmortem-lite", "Postmortem Lite", "Reflect on what went well, what hurt, and what you will change.", 12, "intermediate", ["postmortem", "retro", "learning"], 4,
      "A lite postmortem covers timeline, what went well, what went wrong, and action items. Blameless tone matters. This becomes strong interview material when honest and concrete.",
      ["Blame-focused writeups", "No action items", "Skipping reflection entirely"],
      ["Write blameless notes", "Add concrete action items", "Save examples for interviews"],
      ["What sections are in a postmortem?", "Why blameless?", "How does it help interviews?"],
      [{ tag: "went well", desc: "Successful practices to keep" }, { tag: "went wrong", desc: "Problems to learn from" }, { tag: "action item", desc: "Specific change going forward" }]),
    topic("next-iteration", "Next Iteration", "Define the next slice without pretending it is already done.", 10, "beginner", ["iteration", "roadmap", "next"], 3,
      "After shipping, list the next iteration: top features, refactors, and debt. Keep it short. Separating shipped from next protects honesty in your portfolio. Optionally schedule a v2.",
      ["Mixing shipped and fantasy features in the README", "Infinite next lists", "No prioritization of next work"],
      ["Keep a short next list", "Separate shipped vs planned", "Prioritize the top three"],
      ["Why separate shipped vs next?", "How long should the next list be?", "What do you prioritize?"],
      [{ tag: "v2", desc: "Next planned version" }, { tag: "debt", desc: "Known technical shortcuts to revisit" }, { tag: "planned", desc: "Not yet shipped work" }]),
    topic("handoff-notes", "Handoff Notes", "Write notes so another engineer can maintain the project.", 12, "intermediate", ["handoff", "maintain", "ops"], 4,
      "Handoff notes cover architecture map, env setup, deploy steps, common failures, and contacts. Even solo portfolio projects benefit when you revisit months later. Keep it practical.",
      ["Only tribal memory", "Outdated handoff docs", "Missing deploy steps"],
      ["Document deploy and env", "Map key modules", "List common failures"],
      ["What belongs in handoff notes?", "Why help future you?", "What ops steps matter?"],
      [{ tag: "handoff", desc: "Transfer of maintenance knowledge" }, { tag: "module map", desc: "Where important code lives" }, { tag: "ops steps", desc: "Deploy and maintain commands" }]),
    topic("launch-announcement", "Launch Announcement", "Tell a concise story when you share the project publicly.", 10, "beginner", ["announce", "launch", "share"], 3,
      "A launch announcement states the problem, what shipped, the link, and a call for feedback. Keep it short for LinkedIn or Discord. Attach a screenshot or short clip. Invite specific critique.",
      ["Wall of text with no link", "No ask for feedback", "Hiding known limitations"],
      ["Lead with problem and link", "Ask for specific feedback", "Be honest about MVP limits"],
      ["What belongs in a launch post?", "Why ask specific feedback?", "How do you mention limits?"],
      [{ tag: "call for feedback", desc: "Specific ask to reviewers" }, { tag: "screenshot", desc: "Visual proof of the product" }, { tag: "MVP honesty", desc: "Clear about current limits" }]),
  ]),
  section("presentation-day", "Presentation Day", "Rehearse, backup, and deliver calmly.", [
    topic("rehearsal", "Rehearsal", "Practice the full demo under time constraints.", 12, "beginner", ["rehearse", "timing", "practice"], 4,
      "Rehearse with the real deploy and seed data. Time yourself. Fix friction you notice. Practice recovery lines for likely failures. Two rehearsals beat one long improv.",
      ["First live attempt is the graded demo", "Never timing the talk", "Using different data than production"],
      ["Rehearse on production", "Time each section", "Practice failure recovery lines"],
      ["Why rehearse on production?", "How many rehearsals help?", "What is a recovery line?"],
      [{ tag: "timing", desc: "Measured duration per section" }, { tag: "recovery line", desc: "Prepared words during a glitch" }, { tag: "seed", desc: "Reliable demo data set" }]),
    topic("environment-freeze", "Environment Freeze", "Stop risky changes right before the presentation.", 10, "intermediate", ["freeze", "stability", "demo"], 3,
      "A freeze means no risky deploys or schema changes before the talk unless fixing a blocker. Tag the frozen revision. Communicate the freeze if teammates exist. Stability beats last-minute features.",
      ["Pushing untested features an hour before", "No tagged freeze revision", "Hotfixing without smoke"],
      ["Freeze risky changes", "Tag the presented revision", "Only blocker fixes with smoke"],
      ["What is an environment freeze?", "What changes are allowed?", "Why tag the freeze?"],
      [{ tag: "freeze", desc: "Pause risky changes pre-demo" }, { tag: "blocker fix", desc: "Only critical repairs during freeze" }, { tag: "presented revision", desc: "Exact code version you demo" }]),
    topic("q-and-a-prep", "Q and A Prep", "Prepare answers for architecture, trade-offs, and next steps.", 12, "intermediate", ["qa", "interview", "trade-offs"], 4,
      "Reviewers ask why you chose the stack, what you would do differently, and how it scales. Prepare concise answers with trade-offs. Admit unknowns. Point to ADRs and metrics when useful.",
      ["Defensive answers", "Claiming infinite scale", "No idea what you would improve next"],
      ["Prepare trade-off answers", "Admit unknowns honestly", "Keep a next-steps answer ready"],
      ["What questions are common?", "How do you discuss trade-offs?", "What is a good next-steps answer?"],
      [{ tag: "trade-off", desc: "Balanced reason for a choice" }, { tag: "scale answer", desc: "Honest limits and next scaling step" }, { tag: "unknown", desc: "Something you have not validated yet" }]),
    topic("recording-backup", "Recording Backup", "A short recorded walkthrough saves you if live demo fails.", 10, "beginner", ["recording", "backup", "video"], 3,
      "Record a 2-3 minute walkthrough of the happy path. Store it offline and in the cloud. Use it if the network dies. Mention it as backup, not as the default. Keep it updated to the frozen build.",
      ["No backup when wifi fails", "Outdated recording that differs from live app", "Recording that is longer than the talk"],
      ["Record the happy path short", "Match the frozen build", "Keep offline and cloud copies"],
      ["Why record a backup?", "How long should it be?", "What build should it match?"],
      [{ tag: "walkthrough", desc: "Recorded happy-path demo" }, { tag: "offline copy", desc: "Local file if network fails" }, { tag: "frozen build", desc: "Same revision as the live demo" }]),
  ]),
];

function writeCurriculum(file, typeName, constName, flattenName, sections) {
  fs.writeFileSync(path.join(root, file), renderCurriculum(typeName, constName, flattenName, sections));
  console.log("wrote", file, "topics=", sections.reduce((n, s) => n + s.topics.length, 0));
}

writeCurriculum(
  "src/features/curriculum/lib/capstone-academy-curriculum.ts",
  "Capstone",
  "CAPSTONE_ACADEMY_SECTIONS",
  "flattenCapstoneTopics",
  capstoneSections
);
writeCurriculum(
  "src/features/curriculum/lib/ship-academy-curriculum.ts",
  "Ship",
  "SHIP_ACADEMY_SECTIONS",
  "flattenShipTopics",
  shipSections
);

function challengesSource(opts) {
  const {
    importPath,
    topicType,
    flattenName,
    challengeType,
    kindType,
    experience,
    idPrefix,
    listName,
    allName,
    findName,
    countName,
    theoryName,
    paneA,
    paneB,
    blockAName,
    blockBName,
    defaultA,
    defaultB,
  } = opts;
  const sA = `starter${paneA}`;
  const rA = `reference${paneA}`;
  const sB = `starter${paneB}`;
  const rB = `reference${paneB}`;
  const starterFallback =
    paneB === "Json"
      ? "`{\\n  \"todo\": true\\n}\\n`"
      : "`# Start here\\necho todo\\n`";

  return `import type { LearnDifficulty, LearnLesson } from "@/learning-engine/types";
import {
  ${flattenName},
  type ${topicType},
} from "@/features/curriculum/lib/${importPath}";

export type ${kindType} =
  | "build"
  | "fix"
  | "layout"
  | "responsive"
  | "interview"
  | "project";

export type ${challengeType} = {
  id: string;
  topicSlug: string;
  title: string;
  difficulty: LearnDifficulty;
  minutes: number;
  kind: ${kindType};
  scenario: string;
  task: string;
  hints: string[];
  takeaways: string[];
  ${sA}: string;
  ${rA}: string;
  ${sB}: string;
  ${rB}: string;
  acceptanceCriteria: string[];
  lesson: LearnLesson;
  experience: "${experience}";
  source: "synthetic";
  weekId: number;
};

type Spec = {
  key: string;
  title: string;
  difficulty: LearnDifficulty;
  minutes: number;
  kind: ${kindType};
  scenario: string;
  task: string;
  hints: string[];
  takeaways: string[];
  ${sA}?: string;
  ${rA}: string;
  ${sB}?: string;
  ${rB}: string;
  acceptanceCriteria: string[];
};

function clip(text: string): string {
  return text.replace(/\\s+/g, " ").trim();
}

function challengeLimit(weight: number): number {
  return Math.min(5, Math.max(3, weight));
}

function ${blockAName}(title: string, body: string): string {
  return "# " + title + "\\n\\n" + body + "\\n";
}

function ${blockBName}(title: string, body: string): string {
  ${
    paneB === "Json"
      ? `return body.endsWith("\\n") ? body : body + "\\n";`
      : `return "# " + title + "\\n" + body + "\\n";`
  }
}

function slugToken(topic: ${topicType}): string {
  const tag = topic.cheatSheet[0]?.tag ?? "demo";
  return (
    tag
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 24) || "demo"
  );
}

function defaultA(topic: ${topicType}): string {
  return ${blockAName}(topic.title, ${defaultA});
}

function defaultB(topic: ${topicType}): string {
  return ${blockBName}(topic.title, ${defaultB});
}

function buildLesson(
  topicSlug: string,
  id: string,
  title: string,
  difficulty: LearnDifficulty,
  minutes: number,
  scenario: string,
  task: string,
  hints: string[],
  referenceCode: string
): LearnLesson {
  return {
    id,
    topicSlug,
    weekId: 0,
    title,
    difficulty,
    category: "git",
    description: task,
    problemStatement: \`## Scenario\\n\\n\${scenario}\\n\\n## Task\\n\\n\${task}\`,
    command: "bash",
    terminalOutput: referenceCode,
    workflowDiagram: scenario,
    explanation: task,
    commonMistakes: hints,
    editorLanguage: "bash",
    estimatedMinutes: minutes,
    problemType: "terminal",
    hints,
  };
}

function specsForTopic(topic: ${topicType}): Spec[] {
  const specs: Spec[] = [];
  const push = (spec: Spec) => specs.push(spec);
  const title = topic.title;
  const summary = topic.summary ?? title;
  const explanation = topic.explanation ?? summary;
  const commonMistakes = topic.commonMistakes ?? [];
  const bestPractices = topic.bestPractices ?? [];
  const interviewQuestions = topic.interviewQuestions ?? [];
  const cheatSheet = topic.cheatSheet ?? [];
  const primary = cheatSheet[0]?.tag ?? title;
  const toolList =
    cheatSheet.length > 0
      ? cheatSheet.slice(0, 4).map((c) => c.tag).join(", ")
      : primary;
  const baseA = defaultA(topic);
  const baseB = defaultB(topic);

  push({
    key: "concept",
    title: clip(String(summary).replace(/\\.$/, "")),
    difficulty: "easy",
    minutes: 8,
    kind: "build",
    scenario: String(explanation).split(/(?<=\\.)\\s+/).slice(0, 2).join(" "),
    task: \`Draft planning/shipping references that demonstrate "\${title}". Use ideas from: \${toolList}.\`,
    hints: [
      "Keep the markdown concise and scannable.",
      \`Focus on \${primary}.\`,
      "Make the second pane actionable.",
    ],
    takeaways: [summary, "Clear docs make delivery safer"],
    ${rA}: baseA,
    ${rB}: baseB,
    acceptanceCriteria: [
      "Demonstrates the topic idea",
      "Both panes work together",
      "No secrets hardcoded",
    ],
  });

  push({
    key: "build",
    title: cheatSheet[0] ? \`Practice \${cheatSheet[0].tag}\` : \`Build a plan for \${clip(title)}\`,
    difficulty: "easy",
    minutes: 10,
    kind: "build",
    scenario: \`Practice the core tools for "\${title}": \${toolList}.\`,
    task: \`Produce practical references using \${toolList}. Prefer clear structure and checklists.\`,
    hints: cheatSheet.slice(0, 3).map((c) => \`Use \${c.tag}: \${c.desc}\`).concat(["Keep it short enough to review in one pass."]),
    takeaways: bestPractices.slice(0, 2),
    ${rA}: baseA,
    ${rB}: baseB,
    acceptanceCriteria: [
      "Uses the topic's core concepts",
      "Readable structure",
      "Safe for a learning environment",
    ],
  });

  push({
    key: "fix",
    title: \`Fix a weak \${clip(title)} plan\`,
    difficulty: "medium",
    minutes: 12,
    kind: "fix",
    scenario: \`A teammate shipped a fragile "\${title}" plan. Common mistakes include: \${commonMistakes.slice(0, 2).join("; ") || "vague scope and missing owners"}.\`,
    task: \`Repair the references so they follow safer practices for \${title}.\`,
    hints: [
      commonMistakes[0] || "Make outcomes explicit",
      bestPractices[0] || "Add owners and dates",
      \`Re-check \${primary}\`,
    ],
    takeaways: [
      commonMistakes[0] || "Avoid vague plans",
      bestPractices[0] || "Prefer checklists with owners",
    ],
    ${rA}: baseA,
    ${rB}: baseB,
    acceptanceCriteria: [
      "Identifies the failure mode",
      "Applies at least one best practice",
      "Leaves a safer reference than before",
    ],
  });

  push({
    key: "practice",
    title: \`Practice \${clip(title)}\`,
    difficulty: "medium",
    minutes: 12,
    kind: "layout",
    scenario: \`Prepare a handoff reference for "\${title}" using: \${toolList}.\`,
    task: \`Create a clean reference a teammate can follow, including verification notes.\`,
    hints: [
      "Keep commands and checklists copy-pasteable",
      \`Highlight \${primary}\`,
      bestPractices[1] || "Include a rollback or backup note",
    ],
    takeaways: bestPractices.slice(0, 2),
    ${rA}: baseA,
    ${rB}: baseB,
    acceptanceCriteria: [
      "Includes verification notes",
      "Uses topic terminology correctly",
      "Suitable as a team reference",
    ],
  });

  const hardKey = topic.challengeWeight >= 5 ? "project" : "interview";
  if (hardKey === "interview") {
    push({
      key: "interview",
      title: \`Interview: \${clip(title)}\`,
      difficulty: "hard",
      minutes: 15,
      kind: "interview",
      scenario: interviewQuestions[0]
        ? \`Interview prompt: \${interviewQuestions[0]}\`
        : \`Explain "\${title}" as you would in a staffing interview.\`,
      task: \`Answer with concrete planning/shipping artifacts. Cover trade-offs for \${title}.\`,
      hints: [
        interviewQuestions[1] || "Compare alternatives",
        interviewQuestions[2] || "Describe how you verify success",
        bestPractices[0] || "Mention risks and mitigations",
      ],
      takeaways: [summary, bestPractices[0] || "Plan for failure modes"],
      ${rA}: baseA,
      ${rB}: baseB,
      acceptanceCriteria: [
        "Answers the interview angle",
        "Includes a concrete example",
        "Mentions at least one risk",
      ],
    });
  } else {
    push({
      key: "project",
      title: \`Mini project: \${clip(title)}\`,
      difficulty: "hard",
      minutes: 18,
      kind: "project",
      scenario: \`Ship a small but complete "\${title}" artifact pack using \${toolList}.\`,
      task: \`Produce production-minded references with owners, verification, and fallback notes.\`,
      hints: [
        bestPractices[0] || "Make outcomes explicit",
        bestPractices[1] || "Plan rollback or backup",
        commonMistakes[0] || "Avoid vague ownership",
      ],
      takeaways: bestPractices.slice(0, 3),
      ${rA}: baseA,
      ${rB}: baseB,
      acceptanceCriteria: [
        "Looks like a real team reference",
        "Includes verification",
        "Includes a fallback note",
      ],
    });
  }

  const unique = [];
  const seen = new Set();
  for (const spec of specs) {
    if (seen.has(spec.key)) continue;
    seen.add(spec.key);
    unique.push(spec);
  }
  return pickBalancedSpecs(unique, challengeLimit(topic.challengeWeight));
}

function pickBalancedSpecs(specs: Spec[], limit: number): Spec[] {
  const byKey = new Map(specs.map((s) => [s.key, s]));
  const prefer = (...keys: string[]) =>
    keys.map((k) => byKey.get(k)).filter((s): s is Spec => Boolean(s));
  const hardPreferred = [...prefer("project"), ...prefer("interview")];
  let ladder: Spec[];
  if (limit <= 3) {
    ladder = hardPreferred.length
      ? [...prefer("concept", "fix"), hardPreferred[0]!]
      : prefer("concept", "build", "fix");
  } else if (limit === 4) {
    ladder = [
      ...prefer("concept", "build", "fix"),
      ...(hardPreferred[0] ? [hardPreferred[0]] : prefer("practice")),
    ];
  } else {
    ladder = [
      ...prefer("concept", "build", "fix", "practice"),
      ...(hardPreferred[0] ? [hardPreferred[0]] : []),
    ];
  }
  const seen = new Set<string>();
  const out: Spec[] = [];
  for (const spec of ladder) {
    if (seen.has(spec.key)) continue;
    seen.add(spec.key);
    out.push(spec);
    if (out.length >= limit) break;
  }
  return out.slice(0, limit);
}

function buildChallenge(topicSlug: string, spec: Spec): ${challengeType} {
  const id = \`${idPrefix}-\${topicSlug}-\${spec.key}\`;
  const ${sA} = spec.${sA} ?? spec.${rA};
  const ${sB} =
    spec.${sB} ??
    ${starterFallback};
  const lesson = buildLesson(
    topicSlug,
    id,
    spec.title,
    spec.difficulty,
    spec.minutes,
    spec.scenario,
    spec.task,
    spec.hints,
    spec.${rB}
  );
  return {
    id,
    topicSlug,
    title: spec.title,
    difficulty: spec.difficulty,
    minutes: spec.minutes,
    kind: spec.kind,
    scenario: spec.scenario,
    task: spec.task,
    hints: spec.hints,
    takeaways: spec.takeaways,
    ${sA},
    ${rA}: spec.${rA},
    ${sB},
    ${rB}: spec.${rB},
    acceptanceCriteria: spec.acceptanceCriteria,
    lesson,
    experience: "${experience}",
    source: "synthetic",
    weekId: 0,
  };
}

const BANK: ${challengeType}[] = ${flattenName}().flatMap((topic) =>
  specsForTopic(topic).map((spec) => buildChallenge(topic.slug, spec))
);

const BY_TOPIC = new Map<string, ${challengeType}[]>();
for (const c of BANK) {
  const list = BY_TOPIC.get(c.topicSlug) ?? [];
  list.push(c);
  BY_TOPIC.set(c.topicSlug, list);
}

export function ${listName}(topicSlug: string): ${challengeType}[] {
  return BY_TOPIC.get(topicSlug) ?? [];
}

export function ${allName}(): ${challengeType}[] {
  return BANK;
}

export function ${findName}(
  topicSlug: string,
  challengeId: string
): ${challengeType} | null {
  const list = ${listName}(topicSlug);
  const decoded = decodeURIComponent(challengeId);
  return list.find((c) => c.id === decoded || c.lesson.id === decoded) ?? null;
}

export function ${countName}(topicSlug: string): number {
  return ${listName}(topicSlug).length;
}

export function ${theoryName}(challenge: ${challengeType}): boolean {
  return challenge.difficulty === "easy" && challenge.kind !== "project";
}
`;
}

const capstoneDefaultA = `\`## Goal
Ship a finishable MVP for \${slugToken(topic)}.

## Primary user
- Persona:
- Job to be done:

## Success
- [ ] Happy path works
- [ ] Demo rehearsed
\``;

const capstoneDefaultB = `\`{
  "decision": "\${slugToken(topic)}",
  "status": "accepted",
  "context": "Capstone MVP needs a clear architecture choice.",
  "options": ["simple-monolith", "extra-services"],
  "choice": "simple-monolith",
  "consequences": ["Faster demo", "Fewer moving parts"]
}
\``;

const shipDefaultA = `\`## Launch checklist: \${slugToken(topic)}
- [ ] Env vars set
- [ ] Migrations applied
- [ ] Smoke happy path on production
- [ ] README updated
- [ ] Rollback owner named
- [ ] Backup recording ready
\``;

const shipDefaultB = `\`#!/usr/bin/env bash
set -euo pipefail
echo "Ship checks for \${slugToken(topic)}"
npm run build
npm run lint
git tag -f demo-freeze
curl -fsS "\$APP_URL/health" || true
\``;

fs.writeFileSync(
  path.join(root, "src/features/curriculum/lib/capstone-academy-challenges.ts"),
  challengesSource({
    importPath: "capstone-academy-curriculum",
    topicType: "CapstoneTopicDef",
    flattenName: "flattenCapstoneTopics",
    challengeType: "CapstoneChallenge",
    kindType: "CapstoneChallengeKind",
    experience: "capstone-lab",
    idPrefix: "capstone",
    listName: "listCapstoneAcademyChallenges",
    allName: "allCapstoneAcademyChallenges",
    findName: "findCapstoneAcademyChallenge",
    countName: "capstoneAcademyTopicChallengeCount",
    theoryName: "isCapstoneTheoryChallenge",
    paneA: "Markdown",
    paneB: "Json",
    blockAName: "mdBlock",
    blockBName: "jsonBlock",
    defaultA: capstoneDefaultA,
    defaultB: capstoneDefaultB,
  })
);

fs.writeFileSync(
  path.join(root, "src/features/curriculum/lib/ship-academy-challenges.ts"),
  challengesSource({
    importPath: "ship-academy-curriculum",
    topicType: "ShipTopicDef",
    flattenName: "flattenShipTopics",
    challengeType: "ShipChallenge",
    kindType: "ShipChallengeKind",
    experience: "ship-lab",
    idPrefix: "ship",
    listName: "listShipAcademyChallenges",
    allName: "allShipAcademyChallenges",
    findName: "findShipAcademyChallenge",
    countName: "shipAcademyTopicChallengeCount",
    theoryName: "isShipTheoryChallenge",
    paneA: "Markdown",
    paneB: "Shell",
    blockAName: "mdBlock",
    blockBName: "shellBlock",
    defaultA: shipDefaultA,
    defaultB: shipDefaultB,
  })
);

console.log("wrote challenge banks");
console.log("done");
