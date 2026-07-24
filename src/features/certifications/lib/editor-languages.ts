export const EDITOR_LANGUAGES = [
  { id: "javascript", label: "JavaScript", ext: "js", monaco: "javascript", runnable: true },
  { id: "typescript", label: "TypeScript", ext: "ts", monaco: "typescript", runnable: true },
  { id: "python", label: "Python", ext: "py", monaco: "python", runnable: false },
  { id: "java", label: "Java", ext: "java", monaco: "java", runnable: false },
  { id: "cpp", label: "C++", ext: "cpp", monaco: "cpp", runnable: false },
  { id: "csharp", label: "C#", ext: "cs", monaco: "csharp", runnable: false },
] as const;

export type EditorLanguageId = (typeof EDITOR_LANGUAGES)[number]["id"];

export function isEditorLanguage(id: string): id is EditorLanguageId {
  return EDITOR_LANGUAGES.some((l) => l.id === id);
}

export function languageMeta(id: string) {
  return (
    EDITOR_LANGUAGES.find((l) => l.id === id) ?? EDITOR_LANGUAGES[0]!
  );
}

type FnSig = {
  name: string;
  params: string[];
  /** Short type notes for templates */
  jsDoc: string;
  pyArgs: string;
  pyReturn: string;
  javaSig: string;
  cppSig: string;
  csharpSig: string;
};

const SIGS: Record<string, FnSig> = {
  twoSum: {
    name: "twoSum",
    params: ["nums", "target"],
    jsDoc: "@param {number[]} nums\n * @param {number} target\n * @return {number[]}",
    pyArgs: "nums: list[int], target: int",
    pyReturn: "list[int]",
    javaSig: "public int[] twoSum(int[] nums, int target)",
    cppSig: "vector<int> twoSum(vector<int>& nums, int target)",
    csharpSig: "public int[] TwoSum(int[] nums, int target)",
  },
  isValid: {
    name: "isValid",
    params: ["s"],
    jsDoc: "@param {string} s\n * @return {boolean}",
    pyArgs: "s: str",
    pyReturn: "bool",
    javaSig: "public boolean isValid(String s)",
    cppSig: "bool isValid(string s)",
    csharpSig: "public bool IsValid(string s)",
  },
  maxSubArray: {
    name: "maxSubArray",
    params: ["nums"],
    jsDoc: "@param {number[]} nums\n * @return {number}",
    pyArgs: "nums: list[int]",
    pyReturn: "int",
    javaSig: "public int maxSubArray(int[] nums)",
    cppSig: "int maxSubArray(vector<int>& nums)",
    csharpSig: "public int MaxSubArray(int[] nums)",
  },
  search: {
    name: "search",
    params: ["nums", "target"],
    jsDoc: "@param {number[]} nums\n * @param {number} target\n * @return {number}",
    pyArgs: "nums: list[int], target: int",
    pyReturn: "int",
    javaSig: "public int search(int[] nums, int target)",
    cppSig: "int search(vector<int>& nums, int target)",
    csharpSig: "public int Search(int[] nums, int target)",
  },
  reverseList: {
    name: "reverseList",
    params: ["head"],
    jsDoc: "@param {number[]} head\n * @return {number[]}",
    pyArgs: "head: list[int]",
    pyReturn: "list[int]",
    javaSig: "public int[] reverseList(int[] head)",
    cppSig: "vector<int> reverseList(vector<int>& head)",
    csharpSig: "public int[] ReverseList(int[] head)",
  },
  groupAnagrams: {
    name: "groupAnagrams",
    params: ["strs"],
    jsDoc: "@param {string[]} strs\n * @return {string[][]}",
    pyArgs: "strs: list[str]",
    pyReturn: "list[list[str]]",
    javaSig: "public List<List<String>> groupAnagrams(String[] strs)",
    cppSig: "vector<vector<string>> groupAnagrams(vector<string>& strs)",
    csharpSig: "public IList<IList<string>> GroupAnagrams(string[] strs)",
  },
};

function defaultSig(entryFn: string): FnSig {
  return (
    SIGS[entryFn] ?? {
      name: entryFn,
      params: ["input"],
      jsDoc: "@param {*} input\n * @return {*}",
      pyArgs: "input",
      pyReturn: "Any",
      javaSig: `public Object ${entryFn}(Object input)`,
      cppSig: `auto ${entryFn}(auto input)`,
      csharpSig: `public object ${entryFn}(object input)`,
    }
  );
}

/** Multi-language starter templates for a coding challenge. */
export function starterForLanguage(
  entryFn: string | undefined,
  language: EditorLanguageId,
  fallbackJs?: string
): string {
  if ((!entryFn || !SIGS[entryFn]) && language === "javascript" && fallbackJs) {
    return fallbackJs;
  }
  const sig = defaultSig(entryFn || "solve");
  const { name } = sig;

  switch (language) {
    case "javascript":
      return (
        fallbackJs ??
        `/**\n * ${sig.jsDoc}\n */\nfunction ${name}(${sig.params.join(", ")}) {\n  // Write your code here\n  \n}\n\nmodule.exports = { ${name} };\n`
      );
    case "typescript":
      return `/**\n * ${sig.jsDoc}\n */\nfunction ${name}(${sig.params.join(", ")}: any): any {\n  // Write your code here\n  \n}\n\nexport { ${name} };\n`;
    case "python":
      return `def ${name}(${sig.pyArgs}) -> ${sig.pyReturn}:\n    # Write your code here\n    pass\n`;
    case "java":
      return `class Solution {\n    ${sig.javaSig} {\n        // Write your code here\n        \n    }\n}\n`;
    case "cpp":
      return `#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    ${sig.cppSig} {\n        // Write your code here\n        \n    }\n};\n`;
    case "csharp":
      return `public class Solution {\n    ${sig.csharpSig} {\n        // Write your code here\n        \n    }\n}\n`;
    default:
      return fallbackJs ?? "";
  }
}

export function draftKey(questionId: string, language: EditorLanguageId) {
  return `${questionId}__${language}`;
}
