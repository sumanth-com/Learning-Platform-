import type { LearnDifficulty, LearnLesson } from "@/learning-engine/types";
import {
  flattenModelingTopics,
  type ModelingTopicDef,
} from "@/features/curriculum/lib/modeling-academy-curriculum";
import { hardModelingBundle } from "@/features/curriculum/lib/hard-challenge-blueprints";

export type ModelingChallengeKind =
  | "build"
  | "fix"
  | "layout"
  | "responsive"
  | "interview"
  | "project";

export type ModelingChallenge = {
  id: string;
  topicSlug: string;
  title: string;
  difficulty: LearnDifficulty;
  minutes: number;
  kind: ModelingChallengeKind;
  scenario: string;
  task: string;
  hints: string[];
  takeaways: string[];
  starterSchema: string;
  referenceSchema: string;
  starterSql: string;
  referenceSql: string;
  acceptanceCriteria: string[];
  lesson: LearnLesson;
  experience: "modeling-lab";
  source: "synthetic";
  weekId: number;
};

type Spec = {
  key: string;
  title: string;
  difficulty: LearnDifficulty;
  minutes: number;
  kind: ModelingChallengeKind;
  scenario: string;
  task: string;
  hints: string[];
  takeaways: string[];
  starterSchema?: string;
  referenceSchema: string;
  starterSql?: string;
  referenceSql: string;
  acceptanceCriteria: string[];
};

function clip(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function challengeLimit(weight: number): number {
  return Math.min(5, Math.max(3, weight));
}

function erNotes(title: string, body: string): string {
  return `# ${title}

${body}
`;
}

function ddlBlock(title: string, ddl: string): string {
  return `-- ${title}
${ddl}
`;
}

function entityNameFromTopic(topic: ModelingTopicDef): string {
  const tag = topic.cheatSheet[0]?.tag ?? "Entity";
  return tag
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_|_$/g, "")
    .toLowerCase() || "entity";
}

function defaultErNotes(topic: ModelingTopicDef): string {
  const entity = entityNameFromTopic(topic);
  return erNotes(
    topic.title,
    `Entities:
- ${entity} (id PK, label)

Relationships:
- Standalone entity for this lesson

Notes:
${clip(topic.summary)}`
  );
}

function defaultDdl(topic: ModelingTopicDef): string {
  const table = entityNameFromTopic(topic);
  return ddlBlock(
    topic.title,
    `CREATE TABLE ${table} (
  id SERIAL PRIMARY KEY,
  label TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`
  );
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
  referenceSql: string
): LearnLesson {
  return {
    id,
    topicSlug,
    weekId: 0,
    title,
    difficulty,
    category: "database-design",
    description: task,
    problemStatement: `## Scenario\n\n${scenario}\n\n## Task\n\n${task}`,
    erDiagram: scenario,
    tables: [],
    relationships: [],
    normalization: hints.join("\n"),
    indexes: [],
    realWorldExample: referenceSql,
    commonMistakes: hints,
    editorLanguage: "text",
    estimatedMinutes: minutes,
    problemType: "logic",
    hints,
  };
}

function specsForTopic(topic: ModelingTopicDef): Spec[] {
  const specs: Spec[] = [];
  const push = (spec: Spec) => specs.push(spec);

  const title = topic.title;
  const summary = topic.summary ?? title;
  const explanation = topic.explanation ?? summary;
  const commonMistakes = topic.commonMistakes ?? [];
  const bestPractices = topic.bestPractices ?? [];
  const interviewQuestions = topic.interviewQuestions ?? [];
  const cheatSheet = topic.cheatSheet ?? [];
  const a11yNotes = topic.a11yNotes ?? [];

  const primary = cheatSheet[0]?.tag ?? "Entity";
  const conceptList =
    cheatSheet.length > 0
      ? cheatSheet
          .slice(0, 4)
          .map((c) => c.tag)
          .join(", ")
      : "Entity, Attribute, Relationship";

  const baseEr = defaultErNotes(topic);
  const baseDdl = defaultDdl(topic);

  push({
    key: "concept",
    title: clip(String(summary).replace(/\.$/, "")),
    difficulty: "easy",
    minutes: 8,
    kind: "build",
    scenario: String(explanation).split(/(?<=\.)\s+/).slice(0, 2).join(" "),
    task: `Draft ER notes and DDL that demonstrate "${title}". Use at least one idea from: ${conceptList}.`,
    hints: [
      "Focus on the schema pane for entities and relationships.",
      `Start with ${primary}.`,
      "Pair ER notes with CREATE TABLE statements in the SQL pane.",
    ],
    takeaways: [summary, "Models connect business concepts to database structure"],
    referenceSchema: baseEr,
    referenceSql: baseDdl,
    acceptanceCriteria: [
      "Clear ER notes with entities",
      "Demonstrates the topic idea",
      "DDL matches the documented model",
    ],
  });

  push({
    key: "build",
    title: cheatSheet[0]
      ? `Practice ${cheatSheet[0].tag}`
      : `Build a model for ${clip(title)}`,
    difficulty: "easy",
    minutes: 10,
    kind: "build",
    scenario: `Practice the core concepts for "${title}": ${conceptList}.`,
    task: `Write ER notes and DDL that use ${conceptList} thoughtfully. Prefer clear entity names and documented cardinality.`,
    hints: cheatSheet
      .slice(0, 3)
      .map((c) => `${c.tag}: ${c.desc}`)
      .concat(["Name foreign keys after the referenced table and column."])
      .slice(0, 4),
    takeaways:
      cheatSheet.length > 0
        ? cheatSheet.slice(0, 2).map((c) => `${c.tag} - ${c.desc}`)
        : ["Document entities first", "Map relationships with foreign keys"],
    referenceSchema: erNotes(
      title,
      `Entities:
- customer (id PK, email UNIQUE)
- order (id PK, customer_id FK, total_cents)

Relationships:
- customer 1--* order

Notes:
${clip(summary)}`
    ),
    referenceSql: ddlBlock(
      title,
      `CREATE TABLE customer (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE
);

CREATE TABLE "order" (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customer(id),
  total_cents INTEGER NOT NULL CHECK (total_cents >= 0)
);`
    ),
    acceptanceCriteria: [
      "Uses the topic key modeling patterns",
      "ER notes match DDL tables",
      "Foreign keys reflect relationships",
    ],
  });

  const mistake = commonMistakes[0];
  if (mistake) {
    push({
      key: "fix",
      title: `Fix: ${clip(mistake)}`,
      difficulty: "medium",
      minutes: 14,
      kind: "fix",
      scenario: `Reviewer flagged the data model for "${title}": ${mistake}`,
      task: `Rewrite the ER notes and DDL so they avoid this mistake: ${mistake}. Prefer normalized, maintainable structure.`,
      hints: [
        commonMistakes[1]
          ? `Also watch for: ${commonMistakes[1]}`
          : "Split repeating values into related entities.",
        bestPractices[0] ?? "Document business rules before choosing keys.",
        "Add composite unique constraints where business rules require them.",
      ],
      takeaways: [
        `Avoid: ${mistake}`,
        bestPractices[0] ?? "Correct modeling prevents data integrity bugs.",
      ],
      referenceSchema: erNotes(
        `${title} - fixed`,
        `Entities:
- post (id PK, title)
- tag (id PK, name UNIQUE)
- post_tag (post_id FK, tag_id FK, PK composite)

Relationships:
- post *--* tag via post_tag junction

Notes:
Fixed repeating tag values stored in a junction table.`
      ),
      referenceSql: ddlBlock(
        title,
        `-- Fixed: avoid "${clip(mistake)}"
CREATE TABLE post (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL
);

CREATE TABLE tag (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE post_tag (
  post_id INTEGER NOT NULL REFERENCES post(id),
  tag_id INTEGER NOT NULL REFERENCES tag(id),
  PRIMARY KEY (post_id, tag_id)
);`
      ),
      acceptanceCriteria: [
        "Mistake addressed in ER notes and DDL",
        "Clear keys and relationships",
        "Model supports expected queries",
      ],
    });
  }

  const practice = bestPractices[0];
  if (practice) {
    push({
      key: "practice",
      title: clip(practice),
      difficulty: "medium",
      minutes: 16,
      kind: "layout",
      scenario: `Team guideline for "${title}": ${practice}`,
      task: `Write ER notes and DDL that clearly follow: "${practice}". Keep the example small and intentional.`,
      hints: [
        bestPractices[1] ?? "Prefer small, focused entities.",
        "Document optional versus required attributes.",
        a11yNotes[0] ?? "Align entity names with domain language shared across teams.",
      ],
      takeaways: [practice, bestPractices[1] ?? "Consistency beats clever hacks."].filter(
        Boolean
      ) as string[],
      referenceSchema: erNotes(
        title,
        `Entities:
- guideline (id PK, rule TEXT, applied_at)

Notes:
${clip(practice)}`
      ),
      referenceSql: ddlBlock(
        title,
        `CREATE TABLE guideline (
  id SERIAL PRIMARY KEY,
  rule TEXT NOT NULL,
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO guideline (rule)
VALUES (${JSON.stringify(clip(practice))});`
      ),
      acceptanceCriteria: [
        "Guideline reflected in ER notes and DDL",
        "Small, readable example",
        "Keys and constraints are intentional",
      ],
    });
  }

  const interviewQ = interviewQuestions[0];
  if (interviewQ) {
    const hard = hardModelingBundle(title, interviewQ);
    push({
      key: "interview",
      title: clip(
        interviewQ.endsWith("?") ? interviewQ : `Interview: ${interviewQ}`
      ),
      difficulty: "hard",
      minutes: hard.minutes,
      kind: "interview",
      scenario: hard.scenario,
      task: hard.task,
      hints: hard.hints,
      takeaways: hard.takeaways,
      referenceSchema: hard.referenceSchema,
      referenceSql: hard.referenceSql,
      acceptanceCriteria: hard.acceptanceCriteria,
    });
  }

  if (topic.slug.includes("project") || topic.keywords.includes("project")) {
    const isBlog = topic.slug.includes("blog");
    push({
      key: "project",
      title: isBlog
        ? "Ship a blog data model"
        : "Ship a multi-tenant SaaS model",
      difficulty: "hard",
      minutes: 20,
      kind: "project",
      scenario: isBlog
        ? `Portfolio warm-up: design a blog schema for "${title}".`
        : `Portfolio warm-up: design multi-tenant SaaS tables for "${title}".`,
      task: isBlog
        ? "Document users, posts, comments, tags, and post_tags in ER notes, then write CREATE TABLE DDL with foreign keys."
        : "Document tenants, users, tenant_memberships, and tenant-scoped resources in ER notes, then write DDL with tenant_id filters.",
      hints: [
        isBlog
          ? "Use post_tags junction instead of comma-separated tags"
          : "Include tenant_id on all tenant-owned tables",
        isBlog
          ? "Comments reference posts and optional parent comments"
          : "Use composite unique keys scoped by tenant_id",
        isBlog
          ? "Index foreign keys used in list queries"
          : "Test queries with two tenants to verify isolation",
      ],
      takeaways: isBlog
        ? ["Normalize tags with junction tables", "Foreign keys enforce thread integrity"]
        : ["tenant_id scopes every row", "Composite uniques prevent cross-tenant collisions"],
      referenceSchema: isBlog
        ? erNotes(
            "Blog model",
            `Entities:
- user (id PK, email UNIQUE)
- post (id PK, user_id FK, title, slug, status)
- comment (id PK, post_id FK, user_id FK, parent_id FK nullable)
- tag (id PK, name UNIQUE)
- post_tag (post_id FK, tag_id FK, PK composite)

Relationships:
- user 1--* post
- post 1--* comment
- comment 0..1--* comment (thread)
- post *--* tag via post_tag`
          )
        : erNotes(
            "SaaS tenancy model",
            `Entities:
- tenant (id PK, name UNIQUE)
- user (id PK, email UNIQUE)
- tenant_membership (tenant_id FK, user_id FK, role, PK composite)
- project (id PK, tenant_id FK, name)

Relationships:
- tenant 1--* tenant_membership
- user 1--* tenant_membership
- tenant 1--* project

Notes:
Every business table includes tenant_id for row-level isolation.`
          ),
      referenceSql: isBlog
        ? ddlBlock(
            "Blog DDL",
            `CREATE TABLE "user" (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE
);

CREATE TABLE post (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES "user"(id),
  title TEXT NOT NULL,
  slug TEXT,
  status TEXT NOT NULL DEFAULT 'draft'
);

CREATE TABLE comment (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL REFERENCES post(id),
  user_id INTEGER NOT NULL REFERENCES "user"(id),
  parent_id INTEGER REFERENCES comment(id),
  body TEXT NOT NULL
);

CREATE TABLE tag (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE post_tag (
  post_id INTEGER NOT NULL REFERENCES post(id),
  tag_id INTEGER NOT NULL REFERENCES tag(id),
  PRIMARY KEY (post_id, tag_id)
);`
          )
        : ddlBlock(
            "SaaS tenancy DDL",
            `CREATE TABLE tenant (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE "user" (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE
);

CREATE TABLE tenant_membership (
  tenant_id INTEGER NOT NULL REFERENCES tenant(id),
  user_id INTEGER NOT NULL REFERENCES "user"(id),
  role TEXT NOT NULL,
  PRIMARY KEY (tenant_id, user_id)
);

CREATE TABLE project (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL REFERENCES tenant(id),
  name TEXT NOT NULL,
  UNIQUE (tenant_id, name)
);`
          ),
      acceptanceCriteria: isBlog
        ? [
            "Blog entities documented in ER notes",
            "Junction table for tags",
            "Foreign keys for posts and comments",
          ]
        : [
            "Tenants and memberships documented",
            "tenant_id on tenant-owned tables",
            "Composite unique constraints scoped by tenant",
          ],
    });
  }

  const seen = new Set<string>();
  const unique: Spec[] = [];
  for (const spec of specs) {
    const key = spec.title.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
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

function buildChallenge(topicSlug: string, spec: Spec): ModelingChallenge {
  const id = `modeling-${topicSlug}-${spec.key}`;
  const starterSchema =
    spec.starterSchema ??
    erNotes(
      "Start here",
      `Entities:
- (add entities)

Relationships:
- (add relationships)

Notes:
Document your model before writing DDL.`
    );
  const starterSql =
    spec.starterSql ??
    `-- Start here
-- Write your DDL
SELECT 1;
`;
  const lesson = buildLesson(
    topicSlug,
    id,
    spec.title,
    spec.difficulty,
    spec.minutes,
    spec.scenario,
    spec.task,
    spec.hints,
    spec.referenceSql
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
    starterSchema,
    referenceSchema: spec.referenceSchema,
    starterSql,
    referenceSql: spec.referenceSql,
    acceptanceCriteria: spec.acceptanceCriteria,
    lesson,
    experience: "modeling-lab",
    source: "synthetic",
    weekId: 0,
  };
}

const BANK: ModelingChallenge[] = flattenModelingTopics().flatMap((topic) =>
  specsForTopic(topic).map((spec) => buildChallenge(topic.slug, spec))
);

const BY_TOPIC = new Map<string, ModelingChallenge[]>();
for (const c of BANK) {
  const list = BY_TOPIC.get(c.topicSlug) ?? [];
  list.push(c);
  BY_TOPIC.set(c.topicSlug, list);
}

export function listModelingAcademyChallenges(
  topicSlug: string
): ModelingChallenge[] {
  return BY_TOPIC.get(topicSlug) ?? [];
}

export function allModelingAcademyChallenges(): ModelingChallenge[] {
  return BANK;
}

export function findModelingAcademyChallenge(
  topicSlug: string,
  challengeId: string
): ModelingChallenge | null {
  const list = listModelingAcademyChallenges(topicSlug);
  const decoded = decodeURIComponent(challengeId);
  return (
    list.find((c) => c.id === decoded || c.lesson.id === decoded) ?? null
  );
}

export function modelingAcademyTopicChallengeCount(topicSlug: string): number {
  return listModelingAcademyChallenges(topicSlug).length;
}

export function isModelingTheoryChallenge(
  challenge: ModelingChallenge
): boolean {
  return challenge.difficulty === "easy" && challenge.kind !== "project";
}
