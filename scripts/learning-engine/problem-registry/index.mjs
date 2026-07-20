/**
 * Unified problem registry — every topic gets 9 unique, complete problems.
 * Replaces category-fallback placeholder generators.
 */
import { getDsaProblems } from "./dsa.mjs";
import { getJavaOopProblems } from "./java-oop.mjs";
import { getBackendProblems } from "./backend.mjs";

const DSA_SLUGS = new Set([
  "time-complexity",
  "array-problems",
  "string-problems",
  "linked-list",
  "stack-queue",
  "binary-search",
  "trees",
  "graphs",
  "dynamic-programming",
  "hashing",
]);

const BACKEND_SLUGS = new Set([
  "sql-select",
  "sql-joins",
  "sql-aggregations",
  "transactions",
  "normalization",
  "indexes",
  "jdbc",
  "mongodb",
  "spring-core",
  "spring-boot",
  "capstone-backend",
  "jpa-hibernate",
  "rest-design",
  "validation-pagination",
  "swagger",
  "spring-security",
  "jwt-auth",
  "oauth",
  "rbac",
  "git-workflow",
  "github-portfolio",
  "mock-interview",
  "ai-coding",
]);

export function getRegistryLessons(weekId, topic) {
  if (DSA_SLUGS.has(topic.slug)) {
    return getDsaProblems(weekId, topic);
  }
  if (BACKEND_SLUGS.has(topic.slug)) {
    return getBackendProblems(weekId, topic);
  }
  return getJavaOopProblems(weekId, topic);
}
