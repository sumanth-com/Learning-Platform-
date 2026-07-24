import type { AssessmentQuestion, CertLevel } from "../types";

function challenge(
  id: string,
  data: Omit<AssessmentQuestion, "id" | "kind"> & {
    kind?: AssessmentQuestion["kind"];
  }
): AssessmentQuestion {
  return {
    kind: "code",
    language: "javascript",
    timeLimit: "20 min suggested",
    ...data,
    id,
  };
}

/** HackerRank-style coding challenges with runnable test cases. */
export function codingChallenges(
  level: CertLevel,
  prefix: string
): AssessmentQuestion[] {
  const all: AssessmentQuestion[] = [
    challenge(`${prefix}-hr-1`, {
      title: "Two Sum",
      entryFn: "twoSum",
      prompt:
        "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume each input has exactly one solution, and you may not use the same element twice.",
      constraints: [
        "2 ≤ nums.length ≤ 10^4",
        "-10^9 ≤ nums[i] ≤ 10^9",
        "Only one valid answer exists",
      ],
      examples: [
        {
          input: "nums = [2,7,11,15], target = 9",
          output: "[0,1]",
          explanation: "nums[0] + nums[1] == 9",
        },
      ],
      hints: [
        "A brute-force nested loop works, but can you do better than O(n²)?",
        "Try a hash map: as you scan, store each value’s index and look up target − nums[i].",
        "You only need one pass — when you find the complement already in the map, return both indices.",
      ],
      starterCode: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
  // Write your code here
  
}

module.exports = { twoSum };
`,
      acceptContains: ["function twoSum", "return"],
      tests: [
        {
          id: "t1",
          name: "Example 1",
          call: "[[2,7,11,15], 9]",
          expected: [0, 1],
        },
        {
          id: "t2",
          name: "Example 2",
          call: "[[3,2,4], 6]",
          expected: [1, 2],
        },
        {
          id: "t3",
          name: "Duplicates",
          call: "[[3,3], 6]",
          expected: [0, 1],
          hidden: true,
        },
      ],
    }),
    challenge(`${prefix}-hr-2`, {
      title: "Valid Parentheses",
      entryFn: "isValid",
      prompt:
        "Given a string `s` containing just '(', ')', '{', '}', '[' and ']', determine if the input string is valid. Open brackets must be closed by the same type and in the correct order.",
      constraints: ["1 ≤ s.length ≤ 10^4"],
      examples: [
        { input: 's = "()"', output: "true" },
        { input: 's = "(]"', output: "false" },
      ],
      hints: [
        "Think about the most recently opened bracket — a stack is a natural fit.",
        "Push opening brackets; on a closing bracket, check it matches the stack top.",
        "The string is valid only if every close matches and the stack is empty at the end.",
      ],
      starterCode: `/**
 * @param {string} s
 * @return {boolean}
 */
function isValid(s) {
  // Write your code here
  
}

module.exports = { isValid };
`,
      acceptContains: ["function isValid", "return"],
      tests: [
        { id: "t1", name: "Simple", call: '["()"]', expected: true },
        { id: "t2", name: "Mixed", call: '["()[]{}"]', expected: true },
        { id: "t3", name: "Invalid", call: '["(]"]', expected: false },
        {
          id: "t4",
          name: "Nested",
          call: '["{[()]}"]',
          expected: true,
          hidden: true,
        },
      ],
    }),
    challenge(`${prefix}-hr-3`, {
      title: "Maximum Subarray",
      entryFn: "maxSubArray",
      prompt:
        "Given an integer array `nums`, find the contiguous subarray with the largest sum and return that sum (Kadane's algorithm).",
      constraints: ["1 ≤ nums.length ≤ 10^5"],
      examples: [
        {
          input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
          output: "6",
          explanation: "[4,-1,2,1] sums to 6",
        },
      ],
      hints: [
        "Kadane’s idea: track the best sum ending at the current index.",
        "At each step, either extend the previous subarray or start fresh at nums[i].",
        "Keep a global max of those local bests as you walk the array.",
      ],
      starterCode: `/**
 * @param {number[]} nums
 * @return {number}
 */
function maxSubArray(nums) {
  // Write your code here
  
}

module.exports = { maxSubArray };
`,
      acceptContains: ["function maxSubArray", "return"],
      tests: [
        {
          id: "t1",
          name: "Example",
          call: "[[-2,1,-3,4,-1,2,1,-5,4]]",
          expected: 6,
        },
        { id: "t2", name: "Single", call: "[[1]]", expected: 1 },
        {
          id: "t3",
          name: "All negative",
          call: "[[-3,-2,-5]]",
          expected: -2,
          hidden: true,
        },
      ],
    }),
    challenge(`${prefix}-hr-4`, {
      title: "Binary Search",
      entryFn: "search",
      prompt:
        "Given a sorted array of distinct integers `nums` and a `target`, return the index of target or -1. Must run in O(log n).",
      constraints: ["1 ≤ nums.length ≤ 10^4", "nums is sorted ascending"],
      examples: [
        { input: "nums = [-1,0,3,5,9,12], target = 9", output: "4" },
        { input: "nums = [-1,0,3,5,9,12], target = 2", output: "-1" },
      ],
      hints: [
        "The array is sorted — compare the middle element to the target.",
        "Discard the half that cannot contain the target and repeat.",
        "Stop when the search window is empty; then return -1.",
      ],
      starterCode: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
function search(nums, target) {
  // Write your code here
  
}

module.exports = { search };
`,
      acceptContains: ["function search", "return"],
      tests: [
        {
          id: "t1",
          name: "Found",
          call: "[[-1,0,3,5,9,12], 9]",
          expected: 4,
        },
        {
          id: "t2",
          name: "Missing",
          call: "[[-1,0,3,5,9,12], 2]",
          expected: -1,
        },
        {
          id: "t3",
          name: "First",
          call: "[[1,2,3], 1]",
          expected: 0,
          hidden: true,
        },
      ],
    }),
    challenge(`${prefix}-hr-5`, {
      title: "Reverse Array (Linked-list style)",
      entryFn: "reverseList",
      prompt:
        "Given an array representing list values in order, return a new array with values reversed.",
      constraints: ["0 ≤ n ≤ 5000"],
      examples: [{ input: "[1,2,3,4,5]", output: "[5,4,3,2,1]" }],
      hints: [
        "You can reverse in place with two pointers, or build a new array.",
        "Walk from the end to the start and push into a result list.",
        "Edge cases: empty list and a single element should still work.",
      ],
      starterCode: `/**
 * @param {number[]} head
 * @return {number[]}
 */
function reverseList(head) {
  // Write your code here
  
}

module.exports = { reverseList };
`,
      acceptContains: ["function reverseList", "return"],
      tests: [
        {
          id: "t1",
          name: "Example",
          call: "[[1,2,3,4,5]]",
          expected: [5, 4, 3, 2, 1],
        },
        { id: "t2", name: "Empty", call: "[[]]", expected: [] },
        {
          id: "t3",
          name: "Single",
          call: "[[7]]",
          expected: [7],
          hidden: true,
        },
      ],
    }),
    challenge(`${prefix}-hr-6`, {
      title: "Group Anagrams",
      entryFn: "groupAnagrams",
      prompt:
        "Group anagrams together. Return groups in any order; within each group order does not matter for grading we check membership via sorted join.",
      constraints: ["1 ≤ strs.length ≤ 10^4"],
      examples: [
        {
          input: '["eat","tea","tan","ate","nat","bat"]',
          output: 'groups of anagrams',
        },
      ],
      hints: [
        "Anagrams share the same character counts (or the same sorted letters).",
        "Use a map from a canonical key → list of words.",
        "Sorting each string as the key is simple; a count signature is faster.",
      ],
      starterCode: `/**
 * @param {string[]} strs
 * @return {string[][]}
 */
function groupAnagrams(strs) {
  // Write your code here
  
}

module.exports = { groupAnagrams };
`,
      acceptContains: ["function groupAnagrams", "return"],
      tests: [
        {
          id: "t1",
          name: "Basic",
          call: '[["a"]]',
          expected: [["a"]],
        },
        {
          id: "t2",
          name: "Pair",
          call: '[["ab","ba"]]',
          expected: [["ab", "ba"]],
        },
      ],
    }),
  ];

  // Intermediate gets all coding problems; Basic gets first 3 lighter ones
  if (level === "basic") return all.slice(0, 3);
  return all;
}
