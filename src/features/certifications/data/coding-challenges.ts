import type {
  AssessmentQuestion,
  CertCategoryId,
  CertLevel,
} from "../types";

type ChallengeProfile = {
  label: string;
  domain: string;
  item: string;
  metric: string;
};

const PROFILES: Record<CertCategoryId, ChallengeProfile> = {
  javascript: {
    label: "JavaScript",
    domain: "runtime telemetry",
    item: "execution",
    metric: "duration",
  },
  typescript: {
    label: "TypeScript",
    domain: "type-check diagnostics",
    item: "diagnostic",
    metric: "severity",
  },
  react: {
    label: "React",
    domain: "component render data",
    item: "component",
    metric: "render count",
  },
  nextjs: {
    label: "Next.js",
    domain: "route build data",
    item: "route",
    metric: "build time",
  },
  nodejs: {
    label: "Node.js",
    domain: "server request telemetry",
    item: "request",
    metric: "latency",
  },
  python: {
    label: "Python",
    domain: "data-processing jobs",
    item: "job",
    metric: "runtime",
  },
  java: {
    label: "Java",
    domain: "JVM service metrics",
    item: "service",
    metric: "heap usage",
  },
  sql: {
    label: "SQL",
    domain: "query performance records",
    item: "query",
    metric: "execution cost",
  },
  docker: {
    label: "Docker",
    domain: "container health data",
    item: "container",
    metric: "memory usage",
  },
  frontend: {
    label: "Frontend",
    domain: "web performance signals",
    item: "page",
    metric: "load time",
  },
  backend: {
    label: "Backend",
    domain: "API operation data",
    item: "operation",
    metric: "response time",
  },
  algorithms: {
    label: "Algorithms",
    domain: "benchmark results",
    item: "algorithm",
    metric: "operation count",
  },
  "data-structures": {
    label: "Data Structures",
    domain: "collection workloads",
    item: "collection",
    metric: "access cost",
  },
  "system-design": {
    label: "System Design",
    domain: "distributed service capacity",
    item: "service",
    metric: "throughput",
  },
  "ai-engineering": {
    label: "AI Engineering",
    domain: "model evaluation runs",
    item: "evaluation",
    metric: "quality score",
  },
  git: {
    label: "Git",
    domain: "repository activity",
    item: "commit",
    metric: "change count",
  },
  devops: {
    label: "DevOps",
    domain: "deployment pipeline data",
    item: "pipeline",
    metric: "duration",
  },
  mongodb: {
    label: "MongoDB",
    domain: "document collection metrics",
    item: "collection",
    metric: "document count",
  },
  postgresql: {
    label: "PostgreSQL",
    domain: "database workload data",
    item: "transaction",
    metric: "lock time",
  },
  "prompt-engineering": {
    label: "Prompt Engineering",
    domain: "prompt experiment results",
    item: "prompt",
    metric: "success score",
  },
  rag: {
    label: "RAG",
    domain: "retrieval evaluation data",
    item: "retrieval",
    metric: "relevance score",
  },
  langchain: {
    label: "LangChain",
    domain: "chain execution traces",
    item: "chain",
    metric: "step count",
  },
  langgraph: {
    label: "LangGraph",
    domain: "agent graph runs",
    item: "graph node",
    metric: "transition count",
  },
};

function challenge(
  id: string,
  data: Omit<AssessmentQuestion, "id" | "kind" | "answer">
): AssessmentQuestion {
  return {
    id,
    kind: "code",
    language: "javascript",
    timeLimit: "12 min suggested",
    answer: "",
    ...data,
  };
}

function functionToken(categoryId: CertCategoryId) {
  return categoryId
    .split("-")
    .map((part, index) =>
      index === 0
        ? part
        : `${part.charAt(0).toUpperCase()}${part.slice(1)}`
    )
    .join("");
}

function starter(name: string, params: string) {
  return `/**
 * SupraBase certification challenge
 */
function ${name}(${params}) {
  // Write your solution here

}

module.exports = { ${name} };
`;
}

/**
 * Creates a certification-specific assessment.
 *
 * Basic and Intermediate deliberately use disjoint challenge sets, so a
 * question never appears in two certifications. Titles, scenarios, function
 * names, IDs, examples, and test data are deterministic per technology.
 */
export function codingChallenges(
  categoryId: CertCategoryId,
  level: CertLevel,
  prefix: string
): AssessmentQuestion[] {
  const profile = PROFILES[categoryId];
  const token = functionToken(categoryId);
  const seed =
    Object.keys(PROFILES).indexOf(categoryId) * 3 + (level === "basic" ? 2 : 7);

  const totalName = `${token}MetricTotal`;
  const thresholdName = `${token}AboveThreshold`;
  const normalizeName = `${token}NormalizeLabels`;
  const frequencyName = `${token}StatusFrequency`;
  const topName = `${token}TopPerformer`;
  const windowName = `${token}PeakWindow`;
  const groupName = `${token}GroupByType`;
  const validateName = `${token}ValidateRecords`;
  const readyName = `${token}ReadyItems`;

  const basic: AssessmentQuestion[] = [
    challenge(`${prefix}-unique-total`, {
      title: `${profile.label} ${profile.metric} total`,
      entryFn: totalName,
      prompt: `A ${profile.label} team exports numeric ${profile.metric} values from ${profile.domain}. Return the total of all finite values. Ignore non-numeric entries so one malformed ${profile.item} does not corrupt the report.`,
      constraints: [
        "0 ≤ values.length ≤ 10,000",
        "Return 0 for an empty list",
        "Ignore NaN and non-number values",
      ],
      examples: [
        {
          input: `values = [${seed}, ${seed + 3}, ${seed + 5}]`,
          output: String(seed * 3 + 8),
        },
      ],
      hints: [
        "Start an accumulator at zero.",
        "Use Number.isFinite to accept only valid numeric measurements.",
      ],
      starterCode: starter(totalName, "values"),
      acceptContains: [`function ${totalName}`, "return"],
      tests: [
        {
          id: `${prefix}-total-visible`,
          name: `${profile.label} sample`,
          call: `[[${seed},${seed + 3},${seed + 5}]]`,
          expected: seed * 3 + 8,
        },
        {
          id: `${prefix}-total-empty`,
          name: "Empty report",
          call: "[[]]",
          expected: 0,
        },
        {
          id: `${prefix}-total-hidden`,
          name: "Malformed measurement",
          call: `[[${seed},null,"bad",${seed + 2}]]`,
          expected: seed * 2 + 2,
          hidden: true,
        },
      ],
    }),
    challenge(`${prefix}-unique-threshold`, {
      title: `${profile.label} high-${profile.metric} detector`,
      entryFn: thresholdName,
      prompt: `Review ${profile.domain}. Each record has an id and a numeric value. Return the ids of ${profile.item} records whose value is strictly greater than the supplied ${profile.metric} threshold, preserving input order.`,
      constraints: [
        "Record ids are unique strings",
        "Use a strict greater-than comparison",
        "Preserve the original record order",
      ],
      examples: [
        {
          input: `records = [{id:"a",value:${seed}},{id:"b",value:${seed + 6}}], threshold = ${seed + 2}`,
          output: '["b"]',
        },
      ],
      hints: [
        "Filter the records first.",
        "Map the surviving records to their ids.",
      ],
      starterCode: starter(thresholdName, "records, threshold"),
      acceptContains: [`function ${thresholdName}`, "return"],
      tests: [
        {
          id: `${prefix}-threshold-visible`,
          name: `${profile.label} threshold`,
          call: `[[{"id":"low","value":${seed}},{"id":"high","value":${seed + 8}},{"id":"edge","value":${seed + 3}}],${seed + 3}]`,
          expected: ["high"],
        },
        {
          id: `${prefix}-threshold-none`,
          name: "No high values",
          call: `[[{"id":"steady","value":${seed}}],${seed + 10}]`,
          expected: [],
        },
        {
          id: `${prefix}-threshold-hidden`,
          name: "Stable ordering",
          call: `[[{"id":"first","value":${seed + 9}},{"id":"second","value":${seed + 7}}],${seed + 4}]`,
          expected: ["first", "second"],
          hidden: true,
        },
      ],
    }),
    challenge(`${prefix}-unique-normalize`, {
      title: `${profile.label} label normalizer`,
      entryFn: normalizeName,
      prompt: `${profile.label} ${profile.item} labels arrive from several ${profile.domain} sources. Trim whitespace, convert each label to lowercase, remove duplicates, and return the clean labels in alphabetical order.`,
      constraints: [
        "Input contains strings only",
        "The result must be unique",
        "Return labels in ascending alphabetical order",
      ],
      examples: [
        {
          input: `labels = [" Active ", "active", "${profile.item}"]`,
          output: `["${profile.item}","active"] in alphabetical order`,
        },
      ],
      hints: [
        "Map to trimmed lowercase values.",
        "A Set removes duplicates; sort the final array.",
      ],
      starterCode: starter(normalizeName, "labels"),
      acceptContains: [`function ${normalizeName}`, "return"],
      tests: [
        {
          id: `${prefix}-normalize-visible`,
          name: `${profile.label} labels`,
          call: `[[ " ${profile.item.toUpperCase()} ", "${profile.item}", "active" ]]`,
          expected: ["active", profile.item.toLowerCase()],
        },
        {
          id: `${prefix}-normalize-empty`,
          name: "Empty labels",
          call: "[[]]",
          expected: [],
        },
        {
          id: `${prefix}-normalize-hidden`,
          name: "Whitespace and case",
          call: '[[" Zeta ","alpha","ALPHA"]]',
          expected: ["alpha", "zeta"],
          hidden: true,
        },
      ],
    }),
  ];

  const intermediate: AssessmentQuestion[] = [
    challenge(`${prefix}-unique-frequency`, {
      title: `${profile.label} status frequency`,
      entryFn: frequencyName,
      prompt: `Summarize statuses emitted by ${profile.domain}. Return an object whose keys are status names and whose values are occurrence counts. This report is used to identify unstable ${profile.item} activity.`,
      constraints: ["Statuses are non-empty strings", "Return {} for no events"],
      examples: [
        {
          input: 'statuses = ["ok","failed","ok"]',
          output: '{ ok: 2, failed: 1 }',
        },
      ],
      hints: ["Use an object as a frequency map.", "Increment from zero."],
      starterCode: starter(frequencyName, "statuses"),
      acceptContains: [`function ${frequencyName}`, "return"],
      tests: [
        {
          id: `${prefix}-frequency-visible`,
          name: `${profile.label} statuses`,
          call: '[["healthy","warning","healthy","failed"]]',
          expected: { healthy: 2, warning: 1, failed: 1 },
        },
        {
          id: `${prefix}-frequency-empty`,
          name: "No statuses",
          call: "[[]]",
          expected: {},
        },
        {
          id: `${prefix}-frequency-hidden`,
          name: "Single status",
          call: '[["queued","queued","queued"]]',
          expected: { queued: 3 },
          hidden: true,
        },
      ],
    }),
    challenge(`${prefix}-unique-top`, {
      title: `${profile.label} strongest ${profile.item}`,
      entryFn: topName,
      prompt: `Given scored ${profile.item} records from ${profile.domain}, return the id with the highest numeric score. If scores tie, keep the first record. Return null when the list is empty.`,
      constraints: ["Scores are finite numbers", "Do not reorder the input"],
      examples: [
        {
          input: 'records = [{id:"a",score:4},{id:"b",score:9}]',
          output: '"b"',
        },
      ],
      hints: ["Track the best record seen so far.", "Update only for a greater score."],
      starterCode: starter(topName, "records"),
      acceptContains: [`function ${topName}`, "return"],
      tests: [
        {
          id: `${prefix}-top-visible`,
          name: `${profile.label} ranking`,
          call: `[[{"id":"one","score":${seed}},{"id":"two","score":${seed + 5}},{"id":"three","score":${seed + 2}}]]`,
          expected: "two",
        },
        {
          id: `${prefix}-top-empty`,
          name: "No records",
          call: "[[]]",
          expected: null,
        },
        {
          id: `${prefix}-top-hidden`,
          name: "Tie keeps first",
          call: '[[{"id":"first","score":10},{"id":"second","score":10}]]',
          expected: "first",
          hidden: true,
        },
      ],
    }),
    challenge(`${prefix}-unique-window`, {
      title: `${profile.label} peak ${profile.metric} window`,
      entryFn: windowName,
      prompt: `${profile.domain} is sampled over time. Return the largest sum found in any contiguous window of the requested size. Return null when the window size is invalid.`,
      constraints: [
        "1 ≤ size ≤ values.length for a valid request",
        "Values may be negative",
        "Use a sliding window rather than rebuilding every sum",
      ],
      examples: [
        {
          input: "values = [2,1,5,1,3,2], size = 3",
          output: "9",
        },
      ],
      hints: [
        "Compute the first window once.",
        "Slide by subtracting the outgoing value and adding the incoming value.",
      ],
      starterCode: starter(windowName, "values, size"),
      acceptContains: [`function ${windowName}`, "return"],
      tests: [
        {
          id: `${prefix}-window-visible`,
          name: `${profile.label} peak`,
          call: `[[1,2,${seed},${seed + 4},2],2]`,
          expected: seed * 2 + 4,
        },
        {
          id: `${prefix}-window-invalid`,
          name: "Invalid window",
          call: "[[1,2],3]",
          expected: null,
        },
        {
          id: `${prefix}-window-hidden`,
          name: "Negative samples",
          call: "[[-4,-2,-7],1]",
          expected: -2,
          hidden: true,
        },
      ],
    }),
    challenge(`${prefix}-unique-group`, {
      title: `${profile.label} ${profile.item} grouping`,
      entryFn: groupName,
      prompt: `Group ${profile.item} records from ${profile.domain} by their type. Return an object mapping each type to the record ids encountered in input order.`,
      constraints: ["Every record has id and type", "Preserve id order inside each group"],
      examples: [
        {
          input: 'records = [{id:"a",type:"core"},{id:"b",type:"edge"}]',
          output: '{ core:["a"], edge:["b"] }',
        },
      ],
      hints: ["Create an array when a type is first encountered.", "Push each id."],
      starterCode: starter(groupName, "records"),
      acceptContains: [`function ${groupName}`, "return"],
      tests: [
        {
          id: `${prefix}-group-visible`,
          name: `${profile.label} groups`,
          call: '[[{"id":"a","type":"core"},{"id":"b","type":"edge"},{"id":"c","type":"core"}]]',
          expected: { core: ["a", "c"], edge: ["b"] },
        },
        {
          id: `${prefix}-group-empty`,
          name: "No records",
          call: "[[]]",
          expected: {},
        },
        {
          id: `${prefix}-group-hidden`,
          name: "Single group",
          call: '[[{"id":"x","type":"stable"},{"id":"y","type":"stable"}]]',
          expected: { stable: ["x", "y"] },
          hidden: true,
        },
      ],
    }),
    challenge(`${prefix}-unique-validate`, {
      title: `${profile.label} record validator`,
      entryFn: validateName,
      prompt: `Validate a batch from ${profile.domain}. Return true only when every ${profile.item} record has a non-empty string id and a finite, non-negative numeric value.`,
      constraints: ["An empty batch is valid", "Whitespace-only ids are invalid"],
      examples: [
        {
          input: 'records = [{id:"a",value:3}]',
          output: "true",
        },
      ],
      hints: ["Array.every handles all records.", "Trim ids before checking length."],
      starterCode: starter(validateName, "records"),
      acceptContains: [`function ${validateName}`, "return"],
      tests: [
        {
          id: `${prefix}-validate-visible`,
          name: `${profile.label} valid batch`,
          call: `[[{"id":"${token}-1","value":${seed}},{"id":"${token}-2","value":0}]]`,
          expected: true,
        },
        {
          id: `${prefix}-validate-bad-id`,
          name: "Blank id",
          call: '[[{"id":" ","value":2}]]',
          expected: false,
        },
        {
          id: `${prefix}-validate-hidden`,
          name: "Negative value",
          call: '[[{"id":"bad","value":-1}]]',
          expected: false,
          hidden: true,
        },
      ],
    }),
    challenge(`${prefix}-unique-ready`, {
      title: `${profile.label} dependency readiness`,
      entryFn: readyName,
      prompt: `${profile.label} ${profile.item} work may depend on earlier items. Given tasks with id and dependency ids plus a list of completed ids, return the ids whose dependencies are all complete. Exclude tasks already completed and sort the result alphabetically.`,
      constraints: [
        "Task ids are unique",
        "Dependencies reference known task ids",
        "A task with no dependencies is ready",
      ],
      examples: [
        {
          input: 'tasks = [{id:"build",deps:[]},{id:"ship",deps:["build"]}], completed = ["build"]',
          output: '["ship"]',
        },
      ],
      hints: [
        "Convert completed ids into a Set.",
        "Every dependency must exist in that Set.",
      ],
      starterCode: starter(readyName, "tasks, completed"),
      acceptContains: [`function ${readyName}`, "return"],
      tests: [
        {
          id: `${prefix}-ready-visible`,
          name: `${profile.label} ready work`,
          call: '[[{"id":"prepare","deps":[]},{"id":"verify","deps":["prepare"]},{"id":"release","deps":["verify"]}],["prepare"]]',
          expected: ["verify"],
        },
        {
          id: `${prefix}-ready-none`,
          name: "Blocked work",
          call: '[[{"id":"release","deps":["verify"]}],[]]',
          expected: [],
        },
        {
          id: `${prefix}-ready-hidden`,
          name: "Multiple ready items",
          call: '[[{"id":"beta","deps":[]},{"id":"alpha","deps":[]}],[]]',
          expected: ["alpha", "beta"],
          hidden: true,
        },
      ],
    }),
  ];

  return level === "basic" ? basic : intermediate;
}
