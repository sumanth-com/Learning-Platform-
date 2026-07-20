/**
 * Curated problem engine — generates 20–30+ unique problems per topic/difficulty
 * with typed categories (pattern, logic, leetcode, etc.)
 */
import { getQuotasForTopic, estimatedMinutes as estMinutes } from "./problem-type-spec.mjs";
import { enrichProblem, defaultApproaches, pickCompanyTags, javaSolution, clsName } from "./rich-fields.mjs";
import { generateForLoopProblem } from "../problem-registry/for-loop-bank.mjs";
import {
  buildDistinctLeetcodeProblem,
  buildDistinctHackerrankProblem,
  buildDistinctCompanyProblem,
} from "./interview-problem-bank.mjs";
import { buildDistinctLogicProblem, buildDistinctPatternProblem } from "./logic-pattern-bank.mjs";
import {
  buildWeek1FundamentalsProblem,
  isWeek1FundamentalsTopic,
} from "./week1-fundamentals-bank.mjs";
import {
  buildWeek2ControlFlowProblem,
  isWeek2ControlFlowTopic,
} from "./week2-control-flow-bank.mjs";
import {
  buildWeek3OopProblem,
  isWeek3OopTopic,
} from "./week3-oop-bank.mjs";

const DIFFICULTIES = ["easy", "medium", "hard"];

function hashSeed(input) {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (h * 33 + input.charCodeAt(i)) >>> 0;
  return h;
}

function titleCase(slug) {
  return slug.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
}

function typeLabel(type) {
  return type
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

/** Generic Java problem for non-loop topics */
function generateJavaTypedProblem(slug, topicTitle, category, difficulty, problemType, index) {
  if (isWeek1FundamentalsTopic(slug)) {
    return buildWeek1FundamentalsProblem(slug, topicTitle, category, difficulty, problemType, index);
  }

  if (isWeek2ControlFlowTopic(slug)) {
    return buildWeek2ControlFlowProblem(slug, topicTitle, category, difficulty, problemType, index);
  }

  if (isWeek3OopTopic(slug)) {
    return buildWeek3OopProblem(slug, topicTitle, category, difficulty, problemType, index);
  }

  if (slug === "for-loop") {
    return generateForLoopProblem(difficulty, problemType, index);
  }

  const className = clsName(slug, `${difficulty[0]}${problemType[0]}${index + 1}`);
  const seed = hashSeed(`${slug}-${difficulty}-${problemType}-${index}`);
  const n = (seed % 15) + 3;
  const rows = (index % 6) + 3;

  if (problemType === "output-prediction") {
    const a = n;
    const b = n + 2;
    const result = a + b;
    const code = javaSolution(
      className,
      [],
      "",
      `        int a = ${a}, b = ${b};\n        System.out.println(a + b);`
    );
    return buildPayload({
      slug,
      topicTitle,
      category,
      difficulty,
      problemType,
      index,
      className,
      title: `${typeLabel(problemType)} #${index + 1}`,
      description: `Predict or verify output for this ${topicTitle} snippet.`,
      problemStatement: `What is printed when this ${topicTitle} program runs?\n\nGiven a=${a}, b=${b}, the program adds and prints the sum.`,
      code,
      expectedOutput: `${result}`,
      exampleInput: `a=${a}, b=${b}`,
      exampleOutput: `${result}`,
      explanation: `Addition executes left-to-right: ${a} + ${b} = ${result}.`,
      dryRun: `Line 1: a=${a}\nLine 2: b=${b}\nLine 3: print ${result}`,
      visualization: `[a=${a}] + [b=${b}] → stdout: ${result}`,
      hints: ["Trace variable values line by line.", "Check operator precedence."],
      executionTrace: [
        { line: 1, action: `int a = ${a}`, state: `a=${a}` },
        { line: 2, action: `int b = ${b}`, state: `a=${a}, b=${b}` },
        { line: 3, action: "println(a+b)", state: `output=${result}` },
      ],
    });
  }

  if (problemType === "find-bug" || problemType === "debugging") {
    const bugIdx = index % 3;
    const fixed = bugIdx === 0 ? "<=" : bugIdx === 1 ? "i++" : "length - 1";
    const code = javaSolution(
      className,
      [],
      "",
      bugIdx === 0
        ? `        for (int i = 1; i <= ${n}; i++) System.out.print(i + " ");\n        System.out.println();`
        : bugIdx === 1
          ? `        int i = 1;\n        while (i <= ${n}) {\n            System.out.print(i + " ");\n            i++;\n        }\n        System.out.println();`
          : `        int[] arr = new int[${n}];\n        for (int i = 0; i < arr.length; i++) arr[i] = i + 1;\n        System.out.println(arr[arr.length - 1]);`
    );
    const output =
      bugIdx === 0
        ? Array.from({ length: n }, (_, i) => i + 1).join(" ")
        : bugIdx === 1
          ? Array.from({ length: n }, (_, i) => i + 1).join(" ")
          : `${n}`;
    return buildPayload({
      slug,
      topicTitle,
      category,
      difficulty,
      problemType,
      index,
      className,
      title: `Find the Bug #${index + 1}`,
      description: `Locate and fix the ${topicTitle} bug.`,
      problemStatement: `The following ${topicTitle} program had a common beginner bug. Study the corrected version and explain the fix.`,
      code,
      expectedOutput: output,
      exampleInput: `n=${n}`,
      exampleOutput: output,
      explanation: "The corrected version uses proper loop bounds and increment.",
      dryRun: "Fixed loop iterates correct number of times without off-by-one.",
      visualization: "Bug: wrong bound → Fix: correct termination condition",
      hints: ["Check loop condition boundaries.", "Verify increment/decrement."],
      executionTrace: [{ line: 1, action: "loop executes", state: `printed ${output}` }],
    });
  }

  if (problemType === "pattern" || problemType === "nested-pattern") {
    const nested = problemType === "nested-pattern";
    const core = buildDistinctPatternProblem(className, index, rows, topicTitle, nested);
    return buildPayload({
      slug,
      topicTitle,
      category,
      difficulty,
      problemType,
      index,
      className,
      title: core.title,
      description: `Print pattern using ${topicTitle}.`,
      problemStatement: core.problemStatement,
      code: core.code,
      expectedOutput: core.expectedOutput,
      exampleInput: core.exampleInput,
      exampleOutput: core.exampleOutput,
      explanation: core.explanation,
      dryRun: core.dryRun,
      visualization: core.visualization,
      patternPreview: core.patternPreview,
      hints: core.hints,
      executionTrace: core.executionTrace,
    });
  }

  if (problemType === "leetcode" || problemType === "hackerrank" || problemType === "company") {
    const core =
      problemType === "leetcode"
        ? buildDistinctLeetcodeProblem(slug, topicTitle, category, difficulty, index, className)
        : problemType === "hackerrank"
          ? buildDistinctHackerrankProblem(slug, topicTitle, category, difficulty, index, className)
          : buildDistinctCompanyProblem(slug, topicTitle, category, difficulty, index, className);
    return buildPayload({
      slug,
      topicTitle,
      category,
      difficulty,
      problemType,
      index,
      className,
      title: core.title,
      description: core.description,
      problemStatement: core.problemStatement,
      code: core.code,
      expectedOutput: core.expectedOutput,
      exampleInput: core.exampleInput,
      exampleOutput: core.exampleOutput,
      explanation: core.explanation,
      dryRun: core.dryRun,
      visualization: core.visualization,
      hints: core.hints,
      executionTrace: core.executionTrace,
      companyTags: core.companyTags,
    });
  }

  if (problemType === "interview") {
    const limit = n + 10;
    const code = javaSolution(
      className,
      [],
      `    static boolean isPrime(int x) {
        if (x < 2) return false;
        for (int i = 2; i * i <= x; i++) if (x % i == 0) return false;
        return true;
    }`,
      `        int limit = ${limit};
        for (int i = 2; i <= limit; i++) if (isPrime(i)) System.out.print(i + " ");`
    );
    const primes = [];
    for (let i = 2; i <= limit; i++) {
      let p = true;
      for (let j = 2; j * j <= i; j++) if (i % j === 0) p = false;
      if (p) primes.push(i);
    }
    const output = primes.join(" ") + " ";
    return buildPayload({
      slug,
      topicTitle,
      category,
      difficulty,
      problemType,
      index,
      className,
      title: `Interview #${index + 1}: Primes up to N`,
      description: `Print all primes up to ${limit} using ${topicTitle}.`,
      problemStatement: `Print all prime numbers from 2 to ${limit} inclusive, space-separated.`,
      code,
      expectedOutput: output.trimEnd(),
      exampleInput: `limit=${limit}`,
      exampleOutput: output.trimEnd(),
      explanation: "Trial division with i*i<=x optimization checks primality.",
      dryRun: `Iterate 2..${limit}, print when isPrime true`,
      visualization: `Sieve-style scan → output: ${output.trim()}`,
      hints: ["Loop to sqrt(n) only.", "Handle n<2 edge case."],
      executionTrace: [{ line: 1, action: "prime scan", state: `${primes.length} primes` }],
      companyTags: pickCompanyTags(slug, difficulty, index),
    });
  }

  // Default logic problem — distinct question per index
  const core = buildDistinctLogicProblem(className, index, n, topicTitle);
  return buildPayload({
    slug,
    topicTitle,
    category,
    difficulty,
    problemType,
    index,
    className,
    title: `${typeLabel(problemType)} #${index + 1}: ${core.title}`,
    description: `${core.title} using ${topicTitle}.`,
    problemStatement: core.problemStatement,
    code: core.code,
    expectedOutput: core.expectedOutput,
    exampleInput: core.exampleInput,
    exampleOutput: core.exampleOutput,
    explanation: core.explanation,
    dryRun: core.dryRun,
    visualization: core.visualization,
    hints: core.hints,
    executionTrace: [{ line: 1, action: "compute", state: `output=${core.expectedOutput}` }],
  });
}

function buildPayload(ctx) {
  const {
    slug,
    topicTitle,
    category,
    difficulty,
    problemType,
    index,
    className,
    title,
    description,
    problemStatement,
    code,
    expectedOutput,
    exampleInput,
    exampleOutput,
    explanation,
    dryRun,
    visualization,
    patternPreview,
    hints,
    executionTrace,
    companyTags,
  } = ctx;

  const base = {
    id: `${slug}-${difficulty}-${problemType}-${index + 1}`,
    title,
    description,
    problemType,
    estimatedMinutes: estMinutes(difficulty, problemType),
    problemStatement,
    constraints: [
      `${topicTitle} concepts only — no external libraries unless shown.`,
      "Program must terminate for given input bounds.",
      difficulty === "hard" ? "Optimize for large inputs where stated." : "Correctness first, then optimize.",
    ],
    exampleInput,
    exampleOutput,
    explanation,
    approaches: defaultApproaches(
      difficulty,
      difficulty === "easy" ? "O(n)" : "O(n²)",
      difficulty === "hard" ? "O(n log n)" : "O(n)",
      "O(1)"
    ),
    code,
    filename: `${className}.java`,
    expectedOutput,
    dryRun,
    visualization,
    patternPreview,
    executionTrace,
    hints: hints ?? ["Read constraints carefully.", "Trace one example by hand."],
    companyTags: companyTags ?? pickCompanyTags(slug, difficulty, index),
    commonMistakes: [
      "Off-by-one in loop bounds",
      "Not initializing accumulators",
      "Wrong output format",
    ],
    interviewTips: [
      "State time/space complexity before coding",
      "Walk through a small example",
    ],
    alternativeSolutions: ["Recursive approach", "Built-in library approach where applicable"],
    followUpQuestions: ["How does this scale for n=10^6?", "Can you reduce space complexity?"],
    practiceVariations: [
      `Solve with n=${index + 5}`,
      "Return result instead of printing",
      "Add input validation",
    ],
    practiceQuestions: [`Implement ${title} with unit tests`],
  };

  return { ...base, ...enrichProblem(base, { slug, difficulty, index, category }) };
}

/** Generate full problem bank for a topic */
export function generateCuratedProblems(slug, topicTitle, category, topicIndex = 0, topicCount = 1) {
  const quotas = getQuotasForTopic(slug, category, topicIndex, topicCount);
  const out = { easy: [], medium: [], hard: [] };

  let globalIndex = 0;
  for (const difficulty of DIFFICULTIES) {
    const tiers = quotas[difficulty] ?? [];
    for (const { type, count } of tiers) {
      for (let i = 0; i < count; i++) {
        out[difficulty].push(
          generateJavaTypedProblem(slug, topicTitle, category, difficulty, type, globalIndex++)
        );
      }
    }
  }
  return out;
}

export function countProblems(quotas) {
  let total = 0;
  for (const d of DIFFICULTIES) {
    for (const { count } of quotas[d] ?? []) total += count;
  }
  return total;
}
