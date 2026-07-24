import type {
  AssessmentQuestion,
  CodeTestCase,
  TestRunResult,
} from "../types";

/**
 * Runs exported JS solutions in the browser against test cases.
 * Expects starter templates that set `module.exports = { fnName }`.
 */
export function runCodeTests(
  source: string,
  question: AssessmentQuestion
): TestRunResult[] {
  const tests = question.tests ?? [];
  if (!tests.length) {
    return [
      {
        id: "structure",
        name: "Solution structure",
        passed: gradeStructure(source, question),
        expected: "valid solution skeleton",
        actual: gradeStructure(source, question) ? "ok" : "incomplete",
      },
    ];
  }

  const entry = question.entryFn;
  return tests.map((t) => executeOne(source, entry, t));
}

function gradeStructure(source: string, q: AssessmentQuestion) {
  if (!q.acceptContains?.length) return source.trim().length > 40;
  const text = source.toLowerCase();
  return q.acceptContains.every((p) => text.includes(p.toLowerCase()));
}

function executeOne(
  source: string,
  entryFn: string | undefined,
  test: CodeTestCase
): TestRunResult {
  const name = test.name ?? test.id;
  try {
    // Allow TypeScript-ish exports by normalizing to CJS for the browser runner
    const normalized = source
      .replace(/export\s*\{\s*([^}]+)\s*\};?/g, (_, names: string) => {
        const list = names
          .split(",")
          .map((n) => n.trim().split(/\s+as\s+/).pop()!.trim())
          .filter(Boolean);
        return `module.exports = { ${list.join(", ")} };`;
      })
      .replace(/export\s+function\s+(\w+)/g, "function $1")
      .replace(/:\s*(number\[\]|string\[\]|boolean|number|string|any)\b/g, "");

    const exports: Record<string, unknown> = {};
    const module = { exports };
    const runner = new Function(
      "module",
      "exports",
      `${normalized}\n; return module.exports;`
    );
    const mod = runner(module, exports) as Record<string, unknown>;
    const fnName =
      entryFn ||
      Object.keys(mod).find((k) => typeof mod[k] === "function") ||
      "";
    const fn = mod[fnName];
    if (typeof fn !== "function") {
      return {
        id: test.id,
        name,
        passed: false,
        expected: stringify(test.expected),
        actual: "",
        error: `Export a function${entryFn ? ` named ${entryFn}` : ""}.`,
        hidden: test.hidden,
      };
    }

    const args = new Function(`return (${test.call});`)() as unknown;
    const argList = Array.isArray(args) ? args : [args];
    const actual = (fn as (...a: unknown[]) => unknown).apply(null, argList);
    const passed = deepEqual(actual, test.expected);
    return {
      id: test.id,
      name,
      passed,
      expected: stringify(test.expected),
      actual: stringify(actual),
      hidden: test.hidden,
    };
  } catch (e) {
    return {
      id: test.id,
      name,
      passed: false,
      expected: stringify(test.expected),
      actual: "",
      error: e instanceof Error ? e.message : String(e),
      hidden: test.hidden,
    };
  }
}

function deepEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;
  if (typeof a !== typeof b) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    // Order-insensitive for flat primitive arrays (e.g. two-sum indices)
    if (
      a.length <= 4 &&
      a.every((v) => typeof v === "number" || typeof v === "string") &&
      b.every((v) => typeof v === "number" || typeof v === "string")
    ) {
      const as = [...a].map(String).sort();
      const bs = [...b].map(String).sort();
      return as.every((v, i) => v === bs[i]);
    }
    // Order-insensitive nested string groups (e.g. group anagrams)
    if (
      a.every((g) => Array.isArray(g) && g.every((x) => typeof x === "string")) &&
      b.every((g) => Array.isArray(g) && g.every((x) => typeof x === "string"))
    ) {
      const norm = (groups: unknown[]) =>
        groups
          .map((g) => [...(g as string[])].sort().join("\0"))
          .sort()
          .join("|");
      return norm(a) === norm(b);
    }
    return a.every((v, i) => deepEqual(v, b[i]));
  }
  if (a && b && typeof a === "object" && typeof b === "object") {
    const ak = Object.keys(a as object).sort();
    const bk = Object.keys(b as object).sort();
    if (ak.length !== bk.length) return false;
    return ak.every((k) =>
      deepEqual(
        (a as Record<string, unknown>)[k],
        (b as Record<string, unknown>)[k]
      )
    );
  }
  return false;
}

function stringify(v: unknown) {
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}

export function scoreFromTestResults(results: TestRunResult[]) {
  if (!results.length) return 0;
  const visible = results.filter((r) => !r.hidden);
  const set = visible.length ? visible : results;
  const passed = set.filter((r) => r.passed).length;
  return Math.round((passed / set.length) * 100);
}
