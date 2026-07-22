import type { LearnDifficulty, LearnLesson } from "@/learning-engine/types";
import {
  flattenSqlTopics,
  type SqlTopicDef,
} from "@/features/curriculum/lib/sql-academy-curriculum";

export type SqlChallengeKind =
  | "build"
  | "fix"
  | "layout"
  | "responsive"
  | "interview"
  | "project";

export type SqlChallenge = {
  id: string;
  topicSlug: string;
  title: string;
  difficulty: LearnDifficulty;
  minutes: number;
  kind: SqlChallengeKind;
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
  experience: "sql-editor";
  source: "synthetic";
  weekId: number;
};

type Spec = {
  key: string;
  title: string;
  difficulty: LearnDifficulty;
  minutes: number;
  kind: SqlChallengeKind;
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

function schemaBlock(title: string, ddl: string): string {
  return `-- ${title}
${ddl}
`;
}

function sqlBlock(title: string, sql: string): string {
  return `-- ${title}
${sql}
`;
}

function tableNameFromTopic(topic: SqlTopicDef): string {
  const tag = topic.cheatSheet[0]?.tag ?? "demo";
  return tag
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "")
    .slice(0, 24) || "demo";
}

function defaultSchema(topic: SqlTopicDef): string {
  const table = tableNameFromTopic(topic);
  return schemaBlock(
    topic.title,
    `CREATE TABLE ${table} (
  id INTEGER PRIMARY KEY,
  label TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`
  );
}

function defaultSql(topic: SqlTopicDef): string {
  const table = tableNameFromTopic(topic);
  return sqlBlock(
    topic.title,
    `SELECT id, label, created_at
FROM ${table}
ORDER BY id;

INSERT INTO ${table} (label)
VALUES ('${clip(topic.summary).slice(0, 40)}');`
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

function specsForTopic(topic: SqlTopicDef): Spec[] {
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

  const primary = cheatSheet[0]?.tag ?? "SELECT";
  const sqlList =
    cheatSheet.length > 0
      ? cheatSheet
          .slice(0, 4)
          .map((c) => c.tag)
          .join(", ")
      : "SELECT, INSERT, WHERE";

  const baseSchema = defaultSchema(topic);
  const baseSql = defaultSql(topic);

  push({
    key: "concept",
    title: clip(String(summary).replace(/\.$/, "")),
    difficulty: "easy",
    minutes: 8,
    kind: "build",
    scenario: String(explanation).split(/(?<=\.)\s+/).slice(0, 2).join(" "),
    task: `Draft a small schema and SQL queries that demonstrate "${title}". Use at least one idea from: ${sqlList}.`,
    hints: [
      "Focus on the schema pane for CREATE TABLE definitions.",
      `Start with ${primary}.`,
      "Pair the schema with SELECT and INSERT examples in the SQL pane.",
    ],
    takeaways: [summary, "Schemas and queries work together in relational databases"],
    referenceSchema: baseSchema,
    referenceSql: baseSql,
    acceptanceCriteria: [
      "Valid CREATE TABLE schema",
      "Demonstrates the topic idea",
      "SELECT and INSERT queries match the schema",
    ],
  });

  push({
    key: "build",
    title: cheatSheet[0]
      ? `Practice ${cheatSheet[0].tag}`
      : `Build queries for ${clip(title)}`,
    difficulty: "easy",
    minutes: 10,
    kind: "build",
    scenario: `Practice the core tools for "${title}": ${sqlList}.`,
    task: `Write schema DDL and SQL queries that use ${sqlList} thoughtfully. Prefer clear column names and readable formatting.`,
    hints: cheatSheet
      .slice(0, 3)
      .map((c) => `${c.tag}: ${c.desc}`)
      .concat(["Filter early with WHERE before returning large result sets."])
      .slice(0, 4),
    takeaways:
      cheatSheet.length > 0
        ? cheatSheet.slice(0, 2).map((c) => `${c.tag} - ${c.desc}`)
        : ["Document table structure", "Write intentional SELECT projections"],
    referenceSchema: schemaBlock(
      title,
      `CREATE TABLE practice_rows (
  id INTEGER PRIMARY KEY,
  topic TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active'
);`
    ),
    referenceSql: sqlBlock(
      title,
      `SELECT id, topic, status
FROM practice_rows
WHERE status = 'active'
ORDER BY id;

INSERT INTO practice_rows (topic, status)
VALUES (${JSON.stringify(clip(title))}, 'active');`
    ),
    acceptanceCriteria: [
      "Uses the topic key SQL patterns",
      "Schema columns match query projections",
      "INSERT and SELECT are consistent",
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
      scenario: `Reviewer flagged SQL for "${title}": ${mistake}`,
      task: `Rewrite the schema and queries so they avoid this mistake: ${mistake}. Prefer maintainable constraints and filters.`,
      hints: [
        commonMistakes[1]
          ? `Also watch for: ${commonMistakes[1]}`
          : "Add PRIMARY KEY and FOREIGN KEY constraints where needed.",
        bestPractices[0] ?? "Document expected columns before writing queries.",
        "Validate row counts after JOINs to catch fan-out.",
      ],
      takeaways: [
        `Avoid: ${mistake}`,
        bestPractices[0] ?? "Correct SQL semantics prevent reporting bugs.",
      ],
      referenceSchema: schemaBlock(
        `${title} - fixed`,
        `CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  email TEXT NOT NULL UNIQUE
);

CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  total_cents INTEGER NOT NULL CHECK (total_cents >= 0)
);`
      ),
      referenceSql: sqlBlock(
        title,
        `-- Fixed: avoid "${clip(mistake)}"
SELECT u.id, u.email, COUNT(o.id) AS order_count
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
GROUP BY u.id, u.email
ORDER BY u.id;`
      ),
      acceptanceCriteria: [
        "Mistake addressed in schema and SQL",
        "Clear keys and filters",
        "Query behavior matches table design",
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
      task: `Write schema DDL and SQL queries that clearly follow: "${practice}". Keep the example small and intentional.`,
      hints: [
        bestPractices[1] ?? "Prefer small, focused tables.",
        "Use snake_case column names consistently.",
        a11yNotes[0] ?? "When exporting query results to UI tables, include semantic headers.",
      ],
      takeaways: [practice, bestPractices[1] ?? "Consistency beats clever hacks."].filter(
        Boolean
      ) as string[],
      referenceSchema: schemaBlock(
        title,
        `CREATE TABLE guideline_demo (
  id INTEGER PRIMARY KEY,
  guideline TEXT NOT NULL,
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`
      ),
      referenceSql: sqlBlock(
        title,
        `INSERT INTO guideline_demo (guideline)
VALUES (${JSON.stringify(clip(practice))});

SELECT guideline, applied_at
FROM guideline_demo
ORDER BY applied_at DESC
LIMIT 5;`
      ),
      acceptanceCriteria: [
        "Guideline reflected in schema and SQL",
        "Small, readable example",
        "Columns and filters are intentional",
      ],
    });
  }

  const interviewQ = interviewQuestions[0];
  if (interviewQ) {
    push({
      key: "interview",
      title: clip(
        interviewQ.endsWith("?") ? interviewQ : `Interview: ${interviewQ}`
      ),
      difficulty: "hard",
      minutes: 12,
      kind: "interview",
      scenario: `Whiteboard warm-up for "${title}". Interviewer asks: ${interviewQ}`,
      task: `Answer with schema DDL and SQL queries. Add SQL comments that explain your reasoning.`,
      hints: [
        "Comment the why in the SQL pane",
        interviewQuestions[1] ?? "Keep the example tiny",
        "Show keys and filters that matter",
      ],
      takeaways: ["Explain why, not only what", clip(interviewQ)],
      referenceSchema: baseSchema,
      referenceSql: sqlBlock(
        `Interview - ${title}`,
        `-- Answering: ${interviewQ}
SELECT id, label
FROM ${tableNameFromTopic(topic)}
WHERE label IS NOT NULL
ORDER BY id
LIMIT 10;`
      ),
      acceptanceCriteria: [
        "SQL comments explain the answer",
        "Working schema and query pair",
        "Tied to the interview question",
      ],
    });
  }

  if (topic.slug.includes("project") || topic.keywords.includes("project")) {
    const isLibrary = topic.slug.includes("library");
    push({
      key: "project",
      title: isLibrary
        ? "Ship a library schema and queries"
        : "Ship analytics SQL queries",
      difficulty: "hard",
      minutes: 20,
      kind: "project",
      scenario: isLibrary
        ? `Portfolio warm-up: build a library schema for "${title}".`
        : `Portfolio warm-up: write analytics SQL for "${title}".`,
      task: isLibrary
        ? "Write CREATE TABLE statements for authors, books, members, and loans, then sample INSERT and JOIN queries."
        : "Write analytical SELECT queries with GROUP BY, HAVING, and ORDER BY LIMIT on a library schema.",
      hints: [
        isLibrary
          ? "Use a junction table for the many-to-many book-author relationship"
          : "Filter returned_at IS NULL when counting active loans",
        isLibrary
          ? "Add indexes on loans(member_id) and loans(book_id)"
          : "Define each report metric in a comment before writing SQL",
        isLibrary
          ? "Add CHECK (returned_at IS NULL OR returned_at >= loaned_at)"
          : "Build queries incrementally: SELECT, JOIN, GROUP BY, HAVING",
      ],
      takeaways: isLibrary
        ? ["Normalize with junction tables", "Foreign keys enforce referential integrity"]
        : ["Aggregates power reporting", "Validate row counts after JOINs"],
      referenceSchema: isLibrary
        ? schemaBlock(
            "Library schema",
            `CREATE TABLE authors (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE books (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  isbn TEXT NOT NULL UNIQUE,
  published_year INTEGER
);

CREATE TABLE book_authors (
  book_id INTEGER NOT NULL REFERENCES books(id),
  author_id INTEGER NOT NULL REFERENCES authors(id),
  PRIMARY KEY (book_id, author_id)
);

CREATE TABLE members (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  joined_at DATE NOT NULL
);

CREATE TABLE loans (
  id INTEGER PRIMARY KEY,
  book_id INTEGER NOT NULL REFERENCES books(id),
  member_id INTEGER NOT NULL REFERENCES members(id),
  loaned_at DATE NOT NULL,
  due_at DATE NOT NULL,
  returned_at DATE,
  CHECK (returned_at IS NULL OR returned_at >= loaned_at)
);`
          )
        : schemaBlock(
            "Library schema for analytics",
            `-- Reuse the library schema from the schema project
CREATE TABLE loans (
  id INTEGER PRIMARY KEY,
  book_id INTEGER NOT NULL,
  member_id INTEGER NOT NULL,
  loaned_at DATE NOT NULL,
  due_at DATE NOT NULL,
  returned_at DATE
);`
          ),
      referenceSql: isLibrary
        ? sqlBlock(
            "Library seed and lookup",
            `INSERT INTO authors (name) VALUES ('Ada Author');
INSERT INTO books (title, isbn, published_year)
VALUES ('SQL Basics', '978-0000000001', 2024);

INSERT INTO members (name, email, joined_at)
VALUES ('Pat Member', 'pat@example.com', CURRENT_DATE);

SELECT b.title, a.name AS author
FROM books b
JOIN book_authors ba ON ba.book_id = b.id
JOIN authors a ON a.id = ba.author_id
ORDER BY b.title;`
          )
        : sqlBlock(
            "Analytics reports",
            `-- Active loans per member
SELECT m.name, COUNT(l.id) AS active_loans
FROM members m
JOIN loans l ON l.member_id = m.id
WHERE l.returned_at IS NULL
GROUP BY m.id, m.name
ORDER BY active_loans DESC;

-- Top 5 most loaned books
SELECT b.title, COUNT(l.id) AS loan_count
FROM books b
JOIN loans l ON l.book_id = b.id
GROUP BY b.id, b.title
ORDER BY loan_count DESC
LIMIT 5;`
          ),
      acceptanceCriteria: isLibrary
        ? [
            "Normalized library tables with keys",
            "Junction table for book authors",
            "Sample INSERT and JOIN queries",
          ]
        : [
            "Aggregate reports with GROUP BY",
            "Filters for active and overdue loans",
            "Top-N query uses ORDER BY LIMIT",
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

function buildChallenge(topicSlug: string, spec: Spec): SqlChallenge {
  const id = `sql-${topicSlug}-${spec.key}`;
  const starterSchema = spec.starterSchema ?? spec.referenceSchema;
  const starterSql =
    spec.starterSql ??
    `-- Start here
-- Write your SQL queries
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
    experience: "sql-editor",
    source: "synthetic",
    weekId: 0,
  };
}

const BANK: SqlChallenge[] = flattenSqlTopics().flatMap((topic) =>
  specsForTopic(topic).map((spec) => buildChallenge(topic.slug, spec))
);

const BY_TOPIC = new Map<string, SqlChallenge[]>();
for (const c of BANK) {
  const list = BY_TOPIC.get(c.topicSlug) ?? [];
  list.push(c);
  BY_TOPIC.set(c.topicSlug, list);
}

export function listSqlAcademyChallenges(topicSlug: string): SqlChallenge[] {
  return BY_TOPIC.get(topicSlug) ?? [];
}

export function allSqlAcademyChallenges(): SqlChallenge[] {
  return BANK;
}

export function findSqlAcademyChallenge(
  topicSlug: string,
  challengeId: string
): SqlChallenge | null {
  const list = listSqlAcademyChallenges(topicSlug);
  const decoded = decodeURIComponent(challengeId);
  return (
    list.find((c) => c.id === decoded || c.lesson.id === decoded) ?? null
  );
}

export function sqlAcademyTopicChallengeCount(topicSlug: string): number {
  return listSqlAcademyChallenges(topicSlug).length;
}

export function isSqlTheoryChallenge(challenge: SqlChallenge): boolean {
  return challenge.difficulty === "easy" && challenge.kind !== "project";
}
