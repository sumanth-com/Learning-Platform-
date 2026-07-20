/** Shared rich problem metadata — LeetCode / GFG style sections */

export const COMPANY_POOL = [
  "Google",
  "Amazon",
  "Microsoft",
  "Adobe",
  "Uber",
  "Flipkart",
  "Atlassian",
  "Oracle",
  "Meta",
  "Apple",
  "Netflix",
  "Goldman Sachs",
  "LinkedIn",
  "Salesforce",
  "PayPal",
];

/** Pick 2–4 deterministic company tags from slug + difficulty + index */
export function pickCompanyTags(slug, difficulty, index) {
  const seed = hashSlug(`${slug}-${difficulty}-${index}`);
  const count = 2 + (seed % 3);
  const tags = [];
  for (let i = 0; i < count; i++) {
    tags.push(COMPANY_POOL[(seed + i * 7) % COMPANY_POOL.length]);
  }
  return [...new Set(tags)];
}

function hashSlug(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export function defaultApproaches(difficulty, timeBrute, timeOpt, spaceOpt = "O(1)") {
  if (difficulty === "easy") {
    return [
      { name: "Brute Force", description: "Linear scan or nested loops — correct but slow.", timeComplexity: timeBrute, spaceComplexity: "O(1)" },
      { name: "Optimal", description: "Direct pattern application with minimal extra work.", timeComplexity: timeOpt, spaceComplexity: spaceOpt },
    ];
  }
  return [
    { name: "Brute Force", description: "Try all possibilities — establishes correctness baseline.", timeComplexity: timeBrute, spaceComplexity: "O(1)" },
    { name: "Better", description: "Prune search space or use auxiliary structure.", timeComplexity: "Better than brute", spaceComplexity: "O(n) typical" },
    { name: "Optimal", description: "Best known approach for interview constraints.", timeComplexity: timeOpt, spaceComplexity: spaceOpt },
  ];
}

/** Attach standard rich fields when partial data provided */
export function enrichProblem(p, ctx) {
  const { slug, difficulty, index, category } = ctx;
  const key = `${slug}-${difficulty}-${index}`;

  return {
    ...p,
    companyTags: p.companyTags ?? pickCompanyTags(slug, difficulty, index),
    problemStatement: p.problemStatement ?? p.description,
    constraints: p.constraints ?? [],
    exampleInput: p.exampleInput ?? "",
    exampleOutput: p.exampleOutput ?? p.expectedOutput ?? "",
    stepByStepExplanation: p.stepByStepExplanation ?? p.explanation ?? "",
    approaches: p.approaches ?? defaultApproaches(difficulty, "O(n²)", "O(n log n)"),
    dryRun: p.dryRun ?? "",
    visualization: p.visualization ?? "",
    alternativeSolutions: p.alternativeSolutions ?? [],
    followUpQuestions: p.followUpQuestions ?? [],
    practiceVariations: p.practiceVariations ?? p.practiceQuestions ?? [],
    interviewTips: p.interviewTips ?? [],
    commonMistakes: p.commonMistakes ?? [],
    practiceQuestions: p.practiceQuestions ?? p.practiceVariations ?? [],
  };
}

/** Reject placeholder-only lessons at build time */
export const PLACEHOLDER_PATTERNS = [
  /System\.out\.println\("[^"]*(?:basic syntax|Practice:|Interview:|Production:|HackerRank:|Refactor:|Pattern:|Topic:|TODO)/,
  /\/\/ TODO: practice/,
  /System\.out\.println\("Hello, World!"\)/,
  /System\.out\.println\("Hello World"\)/,
];

export function assertNotPlaceholder(lesson) {
  const code = lesson.code ?? lesson.query ?? lesson.command ?? "";
  for (const pat of PLACEHOLDER_PATTERNS) {
    if (pat.test(code)) {
      throw new Error(`Placeholder detected in ${lesson.id ?? lesson.title}: ${pat}`);
    }
  }
}

export function clsName(slug, suffix) {
  return slug
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join("") + suffix;
}

export function javaSolution(className, imports, body, mainBody) {
  const imp = imports?.length ? imports.map((i) => `import ${i};`).join("\n") + "\n\n" : "";
  const main = mainBody
    ? `    public static void main(String[] args) {\n${mainBody}\n    }`
    : "";
  return `${imp}public class ${className} {\n${body}${main ? "\n" + main : ""}\n}`;
}
