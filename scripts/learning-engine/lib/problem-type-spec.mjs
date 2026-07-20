/**
 * Problem type quotas per topic / category.
 * Loops topic is intentionally much richer than defaults.
 */

export const PROBLEM_TYPE_LABELS = {
  pattern: "Pattern Programs",
  logic: "Logic Problems",
  "output-prediction": "Output Prediction",
  "find-bug": "Find the Bug",
  mcq: "MCQ",
  "dry-run": "Dry Run",
  interview: "Interview Coding",
  hackerrank: "HackerRank Style",
  leetcode: "LeetCode Style",
  company: "Company Questions",
  optimization: "Optimization",
  debugging: "Debugging",
  "nested-pattern": "Nested Loop Patterns",
  select: "SELECT Queries",
  insert: "INSERT",
  update: "UPDATE",
  join: "JOINs",
  aggregate: "GROUP BY / HAVING",
  subquery: "Subqueries",
  transaction: "Transactions",
  controller: "Controller",
  service: "Service Layer",
  repository: "Repository",
  jwt: "JWT Flow",
  prompt: "Prompt Engineering",
  terminal: "Terminal Workflow",
};

/** Week 1 fundamentals — topic-relevant only, no patterns/leetcode/company filler */
export const WEEK1_FUNDAMENTALS_QUOTAS = {
  easy: [
    { type: "output-prediction", count: 4 },
    { type: "logic", count: 11 },
    { type: "find-bug", count: 3 },
  ],
  medium: [
    { type: "logic", count: 8 },
    { type: "output-prediction", count: 4 },
    { type: "dry-run", count: 4 },
    { type: "interview", count: 3 },
  ],
  hard: [
    { type: "logic", count: 8 },
    { type: "interview", count: 5 },
    { type: "find-bug", count: 3 },
  ],
};

/** Default ~20 problems per difficulty for most topics */
export const DEFAULT_QUOTAS = {
  easy: [
    { type: "pattern", count: 6 },
    { type: "logic", count: 6 },
    { type: "output-prediction", count: 3 },
    { type: "find-bug", count: 3 },
    { type: "logic", count: 8 },
  ],
  medium: [
    { type: "logic", count: 6 },
    { type: "interview", count: 5 },
    { type: "nested-pattern", count: 4 },
    { type: "dry-run", count: 3 },
    { type: "output-prediction", count: 2 },
  ],
  hard: [
    { type: "leetcode", count: 7 },
    { type: "hackerrank", count: 7 },
    { type: "company", count: 6 },
  ],
};

/** Extremely rich loops curriculum */
export const FOR_LOOP_QUOTAS = {
  easy: [
    { type: "pattern", count: 20 },
    { type: "logic", count: 20 },
    { type: "output-prediction", count: 10 },
    { type: "dry-run", count: 10 },
  ],
  medium: [
    { type: "pattern", count: 20 },
    { type: "nested-pattern", count: 20 },
    { type: "interview", count: 15 },
  ],
  hard: [
    { type: "hackerrank", count: 20 },
    { type: "leetcode", count: 20 },
    { type: "company", count: 10 },
  ],
};

export const WHILE_LOOP_QUOTAS = {
  easy: [
    { type: "logic", count: 10 },
    { type: "pattern", count: 8 },
    { type: "output-prediction", count: 5 },
    { type: "dry-run", count: 5 },
  ],
  medium: [
    { type: "logic", count: 10 },
    { type: "interview", count: 8 },
    { type: "nested-pattern", count: 7 },
  ],
  hard: [
    { type: "hackerrank", count: 10 },
    { type: "leetcode", count: 10 },
    { type: "company", count: 5 },
  ],
};

/** SQL topic quotas */
export const SQL_QUOTAS = {
  easy: [
    { type: "select", count: 8 },
    { type: "insert", count: 6 },
    { type: "output-prediction", count: 6 },
  ],
  medium: [
    { type: "join", count: 8 },
    { type: "aggregate", count: 7 },
    { type: "subquery", count: 5 },
  ],
  hard: [
    { type: "optimization", count: 8 },
    { type: "transaction", count: 7 },
    { type: "company", count: 5 },
  ],
};

/** DSA quotas */
export const DSA_QUOTAS = {
  easy: [
    { type: "logic", count: 8 },
    { type: "pattern", count: 6 },
    { type: "output-prediction", count: 3 },
    { type: "dry-run", count: 3 },
  ],
  medium: [
    { type: "interview", count: 10 },
    { type: "logic", count: 6 },
    { type: "dry-run", count: 4 },
  ],
  hard: [
    { type: "leetcode", count: 10 },
    { type: "hackerrank", count: 8 },
    { type: "company", count: 7 },
  ],
};

/** REST / Spring quotas */
export const BACKEND_QUOTAS = {
  easy: [
    { type: "controller", count: 6 },
    { type: "logic", count: 6 },
    { type: "output-prediction", count: 4 },
    { type: "logic", count: 10 },
  ],
  medium: [
    { type: "service", count: 8 },
    { type: "interview", count: 7 },
    { type: "debugging", count: 5 },
  ],
  hard: [
    { type: "leetcode", count: 8 },
    { type: "company", count: 7 },
    { type: "optimization", count: 5 },
  ],
};

export const WEEK_LESSON_TARGETS = { easy: 20, medium: 20, hard: 20 };

/** Split N lessons across topics so each week totals exactly 20 easy + 20 medium + 20 hard */
export function distributeAcrossTopics(total, topicIndex, topicCount) {
  if (topicCount <= 0) return 0;
  const base = Math.floor(total / topicCount);
  const remainder = total % topicCount;
  return base + (topicIndex < remainder ? 1 : 0);
}

function splitTypes(count, types) {
  if (count <= 0) return [];
  if (types.length === 1) return [{ type: types[0], count }];
  const per = Math.floor(count / types.length);
  let rem = count % types.length;
  const out = [];
  for (const type of types) {
    const c = per + (rem > 0 ? 1 : 0);
    if (rem > 0) rem--;
    if (c > 0) out.push({ type, count: c });
  }
  return out;
}

function bucket(count, type) {
  return count > 0 ? [{ type, count }] : [];
}

export function getQuotasForTopic(slug, category, topicIndex = 0, topicCount = 1) {
  const easy = distributeAcrossTopics(WEEK_LESSON_TARGETS.easy, topicIndex, topicCount);
  const medium = distributeAcrossTopics(WEEK_LESSON_TARGETS.medium, topicIndex, topicCount);
  const hard = distributeAcrossTopics(WEEK_LESSON_TARGETS.hard, topicIndex, topicCount);

  if (slug === "for-loop" || slug === "while-loop") {
    return {
      easy: bucket(easy, "pattern"),
      medium: [
        ...bucket(Math.ceil(medium / 2), "pattern"),
        ...bucket(Math.floor(medium / 2), "nested-pattern"),
      ],
      hard: bucket(hard, "leetcode"),
    };
  }

  if (category === "dsa") {
    return {
      easy: bucket(easy, "logic"),
      medium: bucket(medium, "interview"),
      hard: bucket(hard, "leetcode"),
    };
  }

  if (category === "sql" || category === "database-design") {
    return {
      easy: bucket(easy, "select"),
      medium: bucket(medium, "join"),
      hard: bucket(hard, "transaction"),
    };
  }

  if (["rest-api", "spring-boot", "jdbc", "hibernate", "security", "mongodb"].includes(category)) {
    return {
      easy: bucket(easy, "controller"),
      medium: bucket(medium, "service"),
      hard: bucket(hard, "leetcode"),
    };
  }

  if (category === "git") {
    return {
      easy: bucket(easy, "terminal"),
      medium: bucket(medium, "terminal"),
      hard: bucket(hard, "debugging"),
    };
  }

  if (category === "ai") {
    return {
      easy: bucket(easy, "prompt"),
      medium: bucket(medium, "prompt"),
      hard: bucket(hard, "optimization"),
    };
  }

  // Java, OOP, collections, java8, multithreading — topic-matched mix
  return {
    easy: splitTypes(easy, ["output-prediction", "logic"]),
    medium: splitTypes(medium, ["logic", "dry-run", "interview"]),
    hard: splitTypes(hard, ["logic", "interview", "find-bug"]),
  };
}

export function estimatedMinutes(difficulty, problemType) {
  const base = difficulty === "easy" ? 8 : difficulty === "medium" ? 15 : 25;
  const bonus =
    problemType === "output-prediction"
      ? -3
      : problemType === "leetcode" || problemType === "company"
        ? 10
        : 0;
  return Math.max(5, base + bonus);
}
