"use client";

import { cn } from "@/lib/utils";
import type {
  AiLesson,
  DatabaseDesignLesson,
  GitLesson,
  JavaLikeLesson,
  LearnLesson,
  LearnProblemRich,
  MongoDbLesson,
  ProblemApproach,
  RestApiLesson,
  SecurityLesson,
  SqlLesson,
} from "@/learning-engine/types";
import { isJavaLike } from "@/learning-engine/types";
import { CodeWorkspace } from "./code-workspace";
import { ExecutionOutput } from "./execution-output";
import { VisualizationPanel } from "./visualization-panel";
import { ProjectDescription } from "@/components/projects/project-ide-panel";

const SPLIT_GRID =
  "grid min-h-0 flex-1 grid-cols-1 lg:h-full lg:overflow-hidden lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]";
const GUIDE_COLUMN =
  "min-h-0 overflow-y-auto overscroll-contain border-b border-zinc-800/60 lg:h-full lg:border-b-0 lg:border-r";
const WORKSPACE_COLUMN =
  "flex min-h-0 flex-col gap-3 overflow-y-auto overscroll-contain p-3 sm:p-4 lg:h-full";

const DIFFICULTY_BADGE: Record<string, string> = {
  easy: "bg-emerald-500/15 text-emerald-400 ring-emerald-500/30",
  medium: "bg-amber-500/15 text-amber-400 ring-amber-500/30",
  hard: "bg-rose-500/15 text-rose-400 ring-rose-500/30",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-zinc-800/60 px-4 py-3 last:border-0">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">{title}</h3>
      <div className="text-sm leading-relaxed text-zinc-300">{children}</div>
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  if (!items?.length) return null;
  return (
    <ul className="mt-1.5 space-y-1">
      {items.map((item, i) => (
        <li key={`${item}-${i}`} className="flex gap-2 text-sm text-zinc-400">
          <span className="text-indigo-400">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function CompanyTags({ tags }: { tags?: string[] }) {
  if (!tags?.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <span
          key={tag}
          className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] font-medium text-indigo-300 ring-1 ring-indigo-500/20"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

function ApproachesList({ approaches }: { approaches?: ProblemApproach[] }) {
  if (!approaches?.length) return null;
  return (
    <div className="space-y-3">
      {approaches.map((a) => (
        <div key={a.name} className="rounded-md border border-zinc-800 bg-zinc-900/50 p-2.5">
          <p className="text-xs font-semibold text-sky-300">{a.name}</p>
          <p className="mt-1 text-sm text-zinc-400">{a.description}</p>
          <p className="mt-1.5 font-mono text-[11px] text-zinc-500">
            Time: {a.timeComplexity} · Space: {a.spaceComplexity}
          </p>
        </div>
      ))}
    </div>
  );
}

/** LeetCode-style problem header + rich sections shared across categories */
function RichProblemGuide({
  lesson,
  children,
}: {
  lesson: LearnLesson & LearnProblemRich;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-0 flex-col overflow-y-auto overscroll-contain rounded-lg border border-zinc-800 bg-[#0a0a0b] lg:h-full">
      <div className="border-b border-zinc-800/60 px-4 py-3">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ring-1",
              DIFFICULTY_BADGE[lesson.difficulty]
            )}
          >
            {lesson.difficulty}
          </span>
          <CompanyTags tags={lesson.companyTags} />
        </div>
        <h2 className="text-base font-semibold text-zinc-100">{lesson.title}</h2>
      </div>

      {lesson.problemStatement && (
        <Section title="Problem Statement">
          <p className="whitespace-pre-wrap">{lesson.problemStatement}</p>
        </Section>
      )}

      {lesson.constraints && lesson.constraints.length > 0 && (
        <Section title="Constraints">
          <BulletList items={lesson.constraints} />
        </Section>
      )}

      {(lesson.exampleInput || lesson.exampleOutput) && (
        <Section title="Examples">
          {lesson.exampleInput && (
            <div className="mb-2">
              <p className="mb-1 text-[10px] font-semibold uppercase text-zinc-500">Input</p>
              <pre className="overflow-x-auto rounded-md bg-zinc-900 p-2 font-mono text-xs text-emerald-200">
                {lesson.exampleInput}
              </pre>
            </div>
          )}
          {lesson.exampleOutput && (
            <div>
              <p className="mb-1 text-[10px] font-semibold uppercase text-zinc-500">Output</p>
              <pre className="overflow-x-auto rounded-md bg-zinc-900 p-2 font-mono text-xs text-sky-200">
                {lesson.exampleOutput}
              </pre>
            </div>
          )}
        </Section>
      )}

      {(lesson.stepByStepExplanation || ("explanation" in lesson && lesson.explanation)) && (
        <Section title="Explanation">
          <p className="whitespace-pre-wrap">
            {lesson.stepByStepExplanation ??
              ("explanation" in lesson ? (lesson as { explanation?: string }).explanation : "")}
          </p>
        </Section>
      )}

      {lesson.hints && lesson.hints.length > 0 && (
        <Section title="Hints">
          <details className="rounded-md border border-zinc-800 bg-zinc-900/50">
            <summary className="cursor-pointer px-3 py-2 text-xs text-zinc-400">Reveal hints progressively</summary>
            <ul className="space-y-1 border-t border-zinc-800 px-3 py-2">
              {lesson.hints.map((h, i) => (
                <li key={i} className="text-sm text-zinc-400">
                  <span className="text-indigo-400">Hint {i + 1}:</span> {h}
                </li>
              ))}
            </ul>
          </details>
        </Section>
      )}

      {lesson.approaches && lesson.approaches.length > 0 && (
        <Section title="Approach">
          <ApproachesList approaches={lesson.approaches} />
        </Section>
      )}

      {lesson.dryRun && (
        <Section title="Dry Run">
          <pre className="whitespace-pre-wrap rounded-md bg-zinc-900 p-2 font-mono text-[11px] text-amber-200/90">
            {lesson.dryRun}
          </pre>
        </Section>
      )}

      {lesson.visualization && (
        <Section title="Visualization">
          <pre className="whitespace-pre-wrap rounded-md bg-violet-500/5 p-2 font-mono text-[11px] text-violet-200">
            {lesson.visualization}
          </pre>
        </Section>
      )}

      {children}

      {"commonMistakes" in lesson && lesson.commonMistakes && lesson.commonMistakes.length > 0 && (
        <Section title="Common Mistakes">
          <BulletList items={lesson.commonMistakes} />
        </Section>
      )}

      {"interviewTips" in lesson && lesson.interviewTips && lesson.interviewTips.length > 0 && (
        <Section title="Interview Tips">
          <BulletList items={lesson.interviewTips} />
        </Section>
      )}

      {lesson.alternativeSolutions && lesson.alternativeSolutions.length > 0 && (
        <Section title="Alternative Solutions">
          <BulletList items={lesson.alternativeSolutions} />
        </Section>
      )}

      {lesson.followUpQuestions && lesson.followUpQuestions.length > 0 && (
        <Section title="Follow-up Questions">
          <BulletList items={lesson.followUpQuestions} />
        </Section>
      )}

      {lesson.practiceVariations && lesson.practiceVariations.length > 0 && (
        <Section title="Practice Variations">
          <BulletList items={lesson.practiceVariations} />
        </Section>
      )}
    </div>
  );
}

function JavaLikeGuide({ lesson }: { lesson: JavaLikeLesson }) {
  return (
    <RichProblemGuide lesson={lesson}>
      {lesson.syntax && (
        <Section title="Syntax Reference">
          <pre className="overflow-x-auto rounded-md bg-zinc-900 p-2 font-mono text-xs text-orange-200">
            {lesson.syntax}
          </pre>
        </Section>
      )}
      {lesson.memoryDiagram && <Section title="Memory Diagram">{lesson.memoryDiagram}</Section>}
      {"practiceQuestions" in lesson && lesson.practiceQuestions && lesson.practiceQuestions.length > 0 && (
        <Section title="Practice Questions">
          <BulletList items={lesson.practiceQuestions} />
        </Section>
      )}
    </RichProblemGuide>
  );
}

function SqlGuide({ lesson }: { lesson: SqlLesson }) {
  return (
    <RichProblemGuide lesson={lesson}>
      <Section title="Schema">
        {(lesson.schema ?? []).map((t) => (
          <div key={t.table} className="mb-2 rounded-md bg-zinc-900/80 p-2">
            <p className="font-mono text-xs text-sky-300">{t.table}</p>
            <p className="mt-1 font-mono text-[11px] text-zinc-500">
              ({t.columns.map((c) => `${c.name} ${c.type}`).join(", ")})
            </p>
          </div>
        ))}
      </Section>
      <Section title="Sample Data">
        {(lesson.sampleData ?? []).map((t) => (
          <div key={t.table} className="mb-2">
            <p className="mb-1 text-xs text-zinc-500">{t.table}</p>
            <pre className="overflow-x-auto rounded-md bg-zinc-900 p-2 font-mono text-[11px] text-zinc-400">
              {t.rows.map((r) => r.join(" | ")).join("\n")}
            </pre>
          </div>
        ))}
      </Section>
      <Section title="Execution Plan">{lesson.executionExplanation}</Section>
      {lesson.optimizationTip && <Section title="Optimization Tips">{lesson.optimizationTip}</Section>}
      {lesson.alternativeQuery && (
        <Section title="Alternative Query">
          <pre className="font-mono text-xs text-sky-300">{lesson.alternativeQuery}</pre>
        </Section>
      )}
    </RichProblemGuide>
  );
}

function SqlResultTable({ lesson }: { lesson: SqlLesson }) {
  const result = lesson.expectedResult ?? { columns: ["result"], rows: [] };
  const { columns, rows } = result;
  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-800">
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="border-b border-zinc-800 bg-zinc-900">
            {columns.map((c) => (
              <th key={c} className="px-3 py-2 font-semibold text-sky-300">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-zinc-800/60">
              {row.map((cell, j) => (
                <td key={j} className="px-3 py-2 text-zinc-300">
                  {cell ?? "NULL"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RestApiGuide({ lesson }: { lesson: RestApiLesson }) {
  return (
    <RichProblemGuide lesson={lesson}>
      <Section title="Endpoint">
        <span className={cn("mr-2 rounded px-1.5 py-0.5 text-[10px] font-bold", methodColor(lesson.method))}>
          {lesson.method}
        </span>
        <code className="font-mono text-sm text-indigo-300">{lesson.endpoint}</code>
      </Section>
      <Section title="API Flow">{lesson.apiDiagram}</Section>
      <Section title="Headers">
        <pre className="font-mono text-xs text-zinc-400">{JSON.stringify(lesson.headers, null, 2)}</pre>
      </Section>
      {lesson.requestBody && (
        <Section title="Request Body">
          <pre className="font-mono text-xs text-amber-200">{lesson.requestBody}</pre>
        </Section>
      )}
      <Section title="Status Code">
        <span className={cn("rounded px-2 py-0.5 text-xs font-bold", statusColor(lesson.statusCode))}>
          {lesson.statusCode}
        </span>
      </Section>
      <Section title="Swagger / Postman">{lesson.postmanExample}</Section>
      <Section title="cURL">
        <pre className="overflow-x-auto font-mono text-[11px] text-zinc-400">{lesson.curlExample}</pre>
      </Section>
    </RichProblemGuide>
  );
}

function methodColor(m: string) {
  const map: Record<string, string> = {
    GET: "bg-emerald-500/20 text-emerald-400",
    POST: "bg-blue-500/20 text-blue-400",
    PUT: "bg-amber-500/20 text-amber-400",
    PATCH: "bg-orange-500/20 text-orange-400",
    DELETE: "bg-rose-500/20 text-rose-400",
  };
  return map[m] ?? "bg-zinc-700 text-zinc-300";
}

function statusColor(code: number) {
  if (code >= 200 && code < 300) return "bg-emerald-500/20 text-emerald-400";
  if (code >= 400 && code < 500) return "bg-amber-500/20 text-amber-400";
  return "bg-rose-500/20 text-rose-400";
}

function GitGuide({ lesson }: { lesson: GitLesson }) {
  return (
    <RichProblemGuide lesson={lesson}>
      <Section title="Workflow">{lesson.workflowDiagram}</Section>
    </RichProblemGuide>
  );
}

function AiGuide({ lesson }: { lesson: AiLesson }) {
  return (
    <RichProblemGuide lesson={lesson}>
      <Section title="Concept">{lesson.concept}</Section>
      <Section title="Good Prompt">
        <pre className="whitespace-pre-wrap rounded-md bg-emerald-500/10 p-2 text-xs text-emerald-200">
          {lesson.goodPrompt}
        </pre>
      </Section>
      <Section title="Bad Prompt">
        <pre className="whitespace-pre-wrap rounded-md bg-rose-500/10 p-2 text-xs text-rose-300">
          {lesson.badPrompt}
        </pre>
      </Section>
      <Section title="AI Output">{lesson.aiOutput}</Section>
      <Section title="Why AI Responded Like That">{lesson.whyAiResponded}</Section>
      <Section title="Exercise">{lesson.exercise}</Section>
    </RichProblemGuide>
  );
}

function DbDesignGuide({ lesson }: { lesson: DatabaseDesignLesson }) {
  return (
    <RichProblemGuide lesson={lesson}>
      <Section title="ER Diagram">
        <pre className="font-mono text-xs text-violet-300">{lesson.erDiagram}</pre>
      </Section>
      <Section title="Tables">
        {lesson.tables.map((t) => (
          <div key={t.name} className="mb-2 rounded-md bg-zinc-900 p-2">
            <p className="font-mono text-xs text-indigo-300">{t.name}</p>
            <p className="mt-1 text-[11px] text-zinc-500">{t.columns.join(", ")}</p>
          </div>
        ))}
      </Section>
      <Section title="Relationships">
        <BulletList items={lesson.relationships} />
      </Section>
      <Section title="Normalization">{lesson.normalization}</Section>
      <Section title="Indexes">
        <BulletList items={lesson.indexes} />
      </Section>
      <Section title="Real-World Example">{lesson.realWorldExample}</Section>
    </RichProblemGuide>
  );
}

function SecurityGuide({ lesson }: { lesson: SecurityLesson }) {
  return (
    <RichProblemGuide lesson={lesson}>
      <Section title="Authentication Flow">{lesson.authFlow}</Section>
      {lesson.jwtDiagram && <Section title="JWT Diagram">{lesson.jwtDiagram}</Section>}
      <Section title="Request Flow">{lesson.requestFlow}</Section>
      <Section title="Roles">
        <BulletList items={lesson.roles} />
      </Section>
      <Section title="Permissions">
        <BulletList items={lesson.permissions} />
      </Section>
      <Section title="Example API">{lesson.exampleApi}</Section>
    </RichProblemGuide>
  );
}

function MongoGuide({ lesson }: { lesson: MongoDbLesson }) {
  return (
    <RichProblemGuide lesson={lesson}>
      <Section title="Collection">{lesson.collection}</Section>
      <Section title="Document Schema">
        <pre className="font-mono text-xs text-amber-200">{lesson.document}</pre>
      </Section>
      {lesson.aggregation && (
        <Section title="Aggregation Pipeline">
          <pre className="font-mono text-xs text-sky-300">{lesson.aggregation}</pre>
        </Section>
      )}
      <Section title="SQL Comparison">{lesson.sqlComparison}</Section>
    </RichProblemGuide>
  );
}

export function LessonRenderer({ lesson }: { lesson: LearnLesson }) {
  if (isJavaLike(lesson)) {
    return (
      <div className={SPLIT_GRID}>
        <div className={GUIDE_COLUMN}>
          <JavaLikeGuide lesson={lesson} />
        </div>
        <div className={WORKSPACE_COLUMN}>
          <ExecutionOutput
            exampleInput={lesson.exampleInput}
            exampleOutput={lesson.exampleOutput}
            expectedOutput={lesson.expectedOutput}
            explanation={lesson.dryRun ?? lesson.stepByStepExplanation}
            executionTrace={lesson.executionTrace}
          />
          <VisualizationPanel lesson={lesson} />
          <p className="shrink-0 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Complete Solution
          </p>
          <CodeWorkspace
            key={lesson.id}
            fillHeight
            language="java"
            filename={lesson.filename}
            code={lesson.code}
            expectedOutput={lesson.expectedOutput}
          />
          {lesson.hiddenSolution && (
            <details className="shrink-0 rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
              <summary className="cursor-pointer text-xs font-medium text-zinc-400">Hidden Solution Hint</summary>
              <p className="mt-2 text-sm text-zinc-500">{lesson.hiddenSolution}</p>
            </details>
          )}
        </div>
      </div>
    );
  }

  if (lesson.category === "sql") {
    const sql = lesson as SqlLesson;
    const resultRows = sql.expectedResult?.rows ?? [];
    const sqlOutput = resultRows.map((r) => r.join(" | ")).join("\n");
    return (
      <div className={SPLIT_GRID}>
        <div className={GUIDE_COLUMN}>
          <SqlGuide lesson={sql} />
        </div>
        <div className={WORKSPACE_COLUMN}>
          <p className="shrink-0 text-xs font-semibold uppercase tracking-wider text-zinc-500">SQL Query</p>
          <CodeWorkspace
            key={lesson.id}
            language="sql"
            filename={`${lesson.topicSlug}.sql`}
            code={sql.query ?? "-- SQL query"}
            expectedOutput={sqlOutput}
            runLabel="Execute"
          />
          <div className="shrink-0">
            <p className="mb-2 text-xs font-medium text-zinc-500">Expected Output Table</p>
            <SqlResultTable lesson={sql} />
          </div>
        </div>
      </div>
    );
  }

  if (lesson.category === "rest-api") {
    const rest = lesson as RestApiLesson;
    return (
      <div className={SPLIT_GRID}>
        <div className={GUIDE_COLUMN}>
          <RestApiGuide lesson={rest} />
        </div>
        <div className={WORKSPACE_COLUMN}>
          <p className="shrink-0 text-xs font-semibold uppercase tracking-wider text-zinc-500">Response JSON</p>
          <CodeWorkspace
            key={lesson.id}
            language="json"
            filename="response.json"
            code={rest.responseBody}
            expectedOutput={`HTTP ${rest.statusCode} ${rest.method} ${rest.endpoint}`}
            runLabel="Send Request"
          />
        </div>
      </div>
    );
  }

  if (lesson.category === "git") {
    const git = lesson as GitLesson;
    return (
      <div className={SPLIT_GRID}>
        <div className={GUIDE_COLUMN}>
          <GitGuide lesson={git} />
        </div>
        <div className={WORKSPACE_COLUMN}>
          <p className="shrink-0 text-xs font-semibold uppercase tracking-wider text-zinc-500">Terminal</p>
          <CodeWorkspace
            key={lesson.id}
            language="bash"
            filename="terminal"
            code={git.command}
            expectedOutput={git.terminalOutput}
            runLabel="Run Command"
          />
        </div>
      </div>
    );
  }

  if (lesson.category === "ai") {
    const ai = lesson as AiLesson;
    return (
      <div className={SPLIT_GRID}>
        <div className={GUIDE_COLUMN}>
          <AiGuide lesson={ai} />
        </div>
        <div className={WORKSPACE_COLUMN}>
          <CodeWorkspace
            key={lesson.id}
            language="prompt"
            filename="prompt.txt"
            code={ai.prompt}
            expectedOutput={ai.aiOutput}
            runLabel="Simulate AI"
          />
        </div>
      </div>
    );
  }

  if (lesson.category === "database-design") {
    return (
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3 sm:p-4 lg:h-full">
        <DbDesignGuide lesson={lesson as DatabaseDesignLesson} />
      </div>
    );
  }

  if (lesson.category === "security") {
    const sec = lesson as SecurityLesson;
    return (
      <div className={SPLIT_GRID}>
        <div className={GUIDE_COLUMN}>
          <SecurityGuide lesson={sec} />
        </div>
        <div className={WORKSPACE_COLUMN}>
          {sec.code ? (
            <CodeWorkspace
              key={lesson.id}
              language={sec.editorLanguage === "java" ? "java" : "json"}
              filename={sec.filename ?? "security.json"}
              code={sec.code}
              expectedOutput={sec.exampleApi}
            />
          ) : (
            <CodeWorkspace
              key={lesson.id}
              language="json"
              filename="headers.json"
              code={JSON.stringify(sec.headers, null, 2)}
              expectedOutput={sec.exampleApi}
            />
          )}
        </div>
      </div>
    );
  }

  if (lesson.category === "mongodb") {
    const mongo = lesson as MongoDbLesson;
    return (
      <div className={SPLIT_GRID}>
        <div className={GUIDE_COLUMN}>
          <MongoGuide lesson={mongo} />
        </div>
        <div className={WORKSPACE_COLUMN}>
          <CodeWorkspace
            key={lesson.id}
            language="json"
            filename={`${mongo.collection}.mongodb`}
            code={mongo.query}
            expectedOutput={mongo.expectedOutput}
            runLabel="Run Query"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <ProjectDescription overview={(lesson as LearnLesson).description} explanation="" />
    </div>
  );
}

export function categoryLabel(category: string): string {
  const labels: Record<string, string> = {
    java: "Java",
    oop: "OOP",
    collections: "Collections",
    java8: "Java 8",
    multithreading: "Multithreading",
    dsa: "DSA",
    sql: "SQL",
    "database-design": "Database Design",
    jdbc: "JDBC",
    "spring-boot": "Spring Boot",
    hibernate: "Hibernate/JPA",
    "rest-api": "REST API",
    security: "Security",
    mongodb: "MongoDB",
    git: "Git",
    ai: "AI Skills",
  };
  return labels[category] ?? category;
}
