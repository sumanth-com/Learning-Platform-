export type JsDifficulty = "beginner" | "intermediate" | "advanced";

export type JsTopicDef = {
  slug: string;
  title: string;
  summary: string;
  estimatedMinutes: number;
  difficulty: JsDifficulty;
  keywords: string[];
  challengeWeight: number;
  explanation: string;
  a11yNotes: string[];
  commonMistakes: string[];
  bestPractices: string[];
  interviewQuestions: string[];
  /** JS APIs / concepts for the reference panel */
  cheatSheet: Array<{ tag: string; desc: string }>;
};

export type JsSectionDef = {
  slug: string;
  title: string;
  description: string;
  topics: JsTopicDef[];
};

function t(partial: JsTopicDef): JsTopicDef {
  return partial;
}

export const JS_ACADEMY_SECTIONS: JsSectionDef[] = [
  {
    slug: "js-introduction",
    title: "JS Introduction",
    description: "What JavaScript is, where it runs, and how to start writing it.",
    topics: [
      t({
        slug: "what-is-javascript",
        title: "What is JavaScript?",
        summary: "JavaScript is the programming language of the web — behavior, logic, and interactivity.",
        estimatedMinutes: 12,
        difficulty: "beginner",
        keywords: ["javascript", "programming", "interactivity"],
        challengeWeight: 4,
        explanation:
          "JavaScript (JS) adds behavior to web pages: responding to clicks, validating forms, fetching data, and updating the UI without a full reload. It runs in browsers and on servers (Node.js). HTML is structure, CSS is presentation, JS is behavior — together they form the front-end stack.",
        a11yNotes: ["Use JS to enhance, not replace, accessible HTML semantics."],
        commonMistakes: [
          "Confusing JavaScript with Java — they are unrelated languages",
          "Assuming JS only runs in browsers",
        ],
        bestPractices: [
          "Learn the three web layers: HTML, CSS, JS",
          "Start with small scripts before large frameworks",
        ],
        interviewQuestions: [
          "What role does JavaScript play in a web page?",
          "How is JavaScript different from HTML and CSS?",
        ],
        cheatSheet: [
          { tag: "ECMAScript", desc: "The language specification JS implements" },
          { tag: "runtime", desc: "Environment that executes JS (browser, Node)" },
          { tag: "DOM", desc: "Document Object Model — JS interface to HTML" },
        ],
      }),
      t({
        slug: "where-js-runs",
        title: "Where JavaScript Runs",
        summary: "Browsers, Node.js, and the JavaScript engine.",
        estimatedMinutes: 10,
        difficulty: "beginner",
        keywords: ["browser", "node", "engine"],
        challengeWeight: 3,
        explanation:
          "In the browser, JS runs inside a JavaScript engine (V8 in Chrome, SpiderMonkey in Firefox). The engine parses your code, compiles it, and executes it. Node.js embeds V8 to run JS on servers — same language, different APIs. Browser JS gets DOM and fetch; Node gets fs and http.",
        a11yNotes: [],
        commonMistakes: [
          "Using browser-only APIs like document in Node without a DOM library",
          "Expecting window to exist in every JS environment",
        ],
        bestPractices: [
          "Know which APIs are browser vs Node before using them",
          "Use the browser DevTools console for quick experiments",
        ],
        interviewQuestions: [
          "What is a JavaScript engine?",
          "What is the difference between browser JS and Node.js?",
        ],
        cheatSheet: [
          { tag: "V8", desc: "Google's JS engine (Chrome, Node)" },
          { tag: "window", desc: "Global object in browsers" },
          { tag: "globalThis", desc: "Cross-environment global reference" },
        ],
      }),
      t({
        slug: "adding-scripts",
        title: "Adding Scripts to HTML",
        summary: "Inline scripts, external files, and the defer attribute.",
        estimatedMinutes: 12,
        difficulty: "beginner",
        keywords: ["script", "defer", "src"],
        challengeWeight: 3,
        explanation:
          "Add JS with a <script> tag. Inline code goes between the tags; external files use src=\"app.js\". Place scripts at the end of body or use defer so HTML parses first. defer downloads in parallel and runs after DOM is ready; async runs as soon as downloaded (order not guaranteed).",
        a11yNotes: ["Ensure critical content works without JS (progressive enhancement)."],
        commonMistakes: [
          "Putting blocking scripts in <head> without defer",
          "Forgetting to close the script tag or wrong file path",
        ],
        bestPractices: [
          "Prefer external scripts for maintainability",
          "Use type=\"module\" for modern ES modules",
        ],
        interviewQuestions: [
          "What is the difference between defer and async?",
          "Where should you place a script tag and why?",
        ],
        cheatSheet: [
          { tag: "<script src>", desc: "Load external JS file" },
          { tag: "defer", desc: "Run after HTML parse, preserve order" },
          { tag: "type=\"module\"", desc: "Enable import/export syntax" },
        ],
      }),
      t({
        slug: "console-and-devtools",
        title: "Console and DevTools",
        summary: "console.log, debugging, and inspecting values.",
        estimatedMinutes: 10,
        difficulty: "beginner",
        keywords: ["console", "devtools", "debug"],
        challengeWeight: 4,
        explanation:
          "console.log prints values for debugging. console.error and console.warn highlight problems. console.table formats arrays of objects. Browser DevTools (F12) show the Console, Sources (breakpoints), and Network tabs. Use debugger; to pause execution at a line.",
        a11yNotes: [],
        commonMistakes: [
          "Leaving console.log in production code",
          "Logging objects without understanding reference vs snapshot",
        ],
        bestPractices: [
          "Use descriptive log messages with context",
          "Learn breakpoints instead of only console.log",
        ],
        interviewQuestions: [
          "How do you debug JavaScript in the browser?",
          "What does console.table do?",
        ],
        cheatSheet: [
          { tag: "console.log()", desc: "Print a value to the console" },
          { tag: "debugger", desc: "Pause execution at this line" },
          { tag: "console.table()", desc: "Display tabular data" },
        ],
      }),
    ],
  },
  {
    slug: "values-and-variables",
    title: "Values & Variables",
    description: "Store and name data with let, const, and primitives.",
    topics: [
      t({
        slug: "let-const-var",
        title: "let, const, and var",
        summary: "Declare variables with block scope and immutability rules.",
        estimatedMinutes: 14,
        difficulty: "beginner",
        keywords: ["let", "const", "var", "scope"],
        challengeWeight: 5,
        explanation:
          "let declares a block-scoped variable you can reassign. const declares a block-scoped binding that cannot be reassigned (object contents can still change). var is function-scoped and hoisted — avoid it in modern code. Prefer const by default, use let when reassignment is needed.",
        a11yNotes: [],
        commonMistakes: [
          "Using var in loops and expecting block scope",
          "Trying to reassign a const primitive",
          "Declaring variables without let/const (creates globals)",
        ],
        bestPractices: [
          "Default to const, upgrade to let only when needed",
          "Never omit let/const — always declare explicitly",
        ],
        interviewQuestions: [
          "What is the difference between let, const, and var?",
          "Can you mutate an object declared with const?",
        ],
        cheatSheet: [
          { tag: "let", desc: "Block-scoped, reassignable" },
          { tag: "const", desc: "Block-scoped, no reassignment" },
          { tag: "var", desc: "Function-scoped, hoisted (legacy)" },
        ],
      }),
      t({
        slug: "primitive-types",
        title: "Primitive Types",
        summary: "string, number, boolean, null, undefined, bigint, and symbol.",
        estimatedMinutes: 12,
        difficulty: "beginner",
        keywords: ["string", "number", "boolean", "null"],
        challengeWeight: 4,
        explanation:
          "Primitives are immutable values: string (text), number (integers and floats), boolean (true/false), undefined (unassigned), null (intentional absence), bigint (large integers), and symbol (unique identifiers). Primitives are copied by value — assigning one variable to another copies the value.",
        a11yNotes: [],
        commonMistakes: [
          "Confusing null and undefined",
          "Using == to compare null and undefined loosely",
        ],
        bestPractices: [
          "Use null for intentional absence, undefined for unset values",
          "Prefer Number.isNaN() over global isNaN()",
        ],
        interviewQuestions: [
          "What are the primitive types in JavaScript?",
          "What is the difference between null and undefined?",
        ],
        cheatSheet: [
          { tag: "typeof", desc: "Returns type string of a value" },
          { tag: "null", desc: "Intentional empty value" },
          { tag: "undefined", desc: "Variable declared but not assigned" },
        ],
      }),
      t({
        slug: "typeof-and-coercion",
        title: "typeof and Type Coercion",
        summary: "Inspect types and understand implicit conversions.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["typeof", "coercion", "conversion"],
        challengeWeight: 4,
        explanation:
          "typeof returns a string like \"string\", \"number\", or \"undefined\". Watch out: typeof null returns \"object\" (a historical bug). Coercion converts types implicitly — \"5\" + 1 becomes \"51\" (string concat), \"5\" - 1 becomes 4 (number math). Use === to avoid coercion surprises.",
        a11yNotes: [],
        commonMistakes: [
          "Using == instead of === and getting unexpected results",
          "Assuming typeof null is \"null\"",
        ],
        bestPractices: [
          "Always use === and !== for comparisons",
          "Explicitly convert with Number(), String(), or Boolean() when needed",
        ],
        interviewQuestions: [
          "What does typeof null return and why?",
          "What is type coercion? Give an example.",
        ],
        cheatSheet: [
          { tag: "===", desc: "Strict equality (no coercion)" },
          { tag: "Number()", desc: "Convert value to number" },
          { tag: "String()", desc: "Convert value to string" },
        ],
      }),
      t({
        slug: "template-literals",
        title: "Template Literals",
        summary: "Backtick strings with ${expression} interpolation.",
        estimatedMinutes: 10,
        difficulty: "beginner",
        keywords: ["template", "literal", "interpolation"],
        challengeWeight: 3,
        explanation:
          "Template literals use backticks (`) instead of quotes. Embed expressions with ${name} or ${2 + 2}. Multi-line strings work naturally without \\n hacks. Tagged templates (advanced) let functions process string parts.",
        a11yNotes: [],
        commonMistakes: [
          "Using single quotes and trying ${} interpolation",
          "Forgetting backticks for multi-line strings",
        ],
        bestPractices: [
          "Use template literals for dynamic strings and multi-line text",
          "Keep expressions inside ${} simple — extract complex logic",
        ],
        interviewQuestions: [
          "How do template literals differ from regular strings?",
          "How do you embed a variable in a template literal?",
        ],
        cheatSheet: [
          { tag: "`${expr}`", desc: "Expression interpolation" },
          { tag: "`multi\\nline`", desc: "Multi-line string literal" },
          { tag: "String.raw", desc: "Raw string without escape processing" },
        ],
      }),
    ],
  },
  {
    slug: "operators-and-expressions",
    title: "Operators & Expressions",
    description: "Compute values with arithmetic, comparison, and logic.",
    topics: [
      t({
        slug: "arithmetic-comparison",
        title: "Arithmetic and Comparison",
        summary: "+, -, *, /, %, and ===, !==, <, >, <=, >=.",
        estimatedMinutes: 12,
        difficulty: "beginner",
        keywords: ["arithmetic", "comparison", "operators"],
        challengeWeight: 4,
        explanation:
          "Arithmetic: + (add/concat), -, *, /, % (remainder), ** (exponent). Comparison: === strict equal, !== strict not equal, < > <= >=. NaN is the only value not equal to itself — use Number.isNaN(x). Increment: ++i (prefix) vs i++ (postfix) differ in expression value.",
        a11yNotes: [],
        commonMistakes: [
          "Using + with a string and number expecting addition",
          "Comparing NaN with === or ==",
        ],
        bestPractices: [
          "Use === for all equality checks",
          "Use Number.isNaN() to detect NaN",
        ],
        interviewQuestions: [
          "What does the % operator do?",
          "Why is NaN !== NaN?",
        ],
        cheatSheet: [
          { tag: "%", desc: "Modulo — remainder after division" },
          { tag: "**", desc: "Exponentiation (2 ** 3 → 8)" },
          { tag: "Number.isNaN()", desc: "Reliable NaN check" },
        ],
      }),
      t({
        slug: "logical-operators",
        title: "Logical Operators",
        summary: "&&, ||, !, and short-circuit evaluation.",
        estimatedMinutes: 12,
        difficulty: "beginner",
        keywords: ["logical", "and", "or", "not"],
        challengeWeight: 4,
        explanation:
          "&& returns the first falsy operand or the last value. || returns the first truthy operand or the last value. ! negates to boolean. Short-circuit: if the left side of && is falsy, the right is never evaluated. The nullish coalescing ?? returns the right side only when left is null or undefined.",
        a11yNotes: [],
        commonMistakes: [
          "Using || for default values when 0 or \"\" is valid (prefer ??)",
          "Writing complex chained && without parentheses",
        ],
        bestPractices: [
          "Use ?? for null/undefined defaults",
          "Use optional chaining ?. to safely access nested properties",
        ],
        interviewQuestions: [
          "How does short-circuit evaluation work with &&?",
          "What is the difference between || and ??",
        ],
        cheatSheet: [
          { tag: "&&", desc: "Logical AND, short-circuits" },
          { tag: "||", desc: "Logical OR, short-circuits" },
          { tag: "??", desc: "Nullish coalescing operator" },
        ],
      }),
      t({
        slug: "truthy-falsy",
        title: "Truthy and Falsy Values",
        summary: "Values that coerce to true or false in conditions.",
        estimatedMinutes: 10,
        difficulty: "beginner",
        keywords: ["truthy", "falsy", "boolean"],
        challengeWeight: 3,
        explanation:
          "Falsy values: false, 0, -0, 0n, \"\", null, undefined, NaN. Everything else is truthy — including [], {}, and \"0\". if (value) checks truthiness. Boolean(value) makes it explicit. Be careful: empty arrays and objects are truthy.",
        a11yNotes: [],
        commonMistakes: [
          "Assuming an empty array [] is falsy",
          "Using if (arr.length) when length could be 0 legitimately without clarity",
        ],
        bestPractices: [
          "Be explicit: if (value !== null) instead of relying on truthiness when unclear",
          "Know the full falsy list by heart",
        ],
        interviewQuestions: [
          "List all falsy values in JavaScript.",
          "Is an empty object {} truthy or falsy?",
        ],
        cheatSheet: [
          { tag: "Boolean()", desc: "Explicit truthiness conversion" },
          { tag: "!!", desc: "Double negation to boolean" },
          { tag: "?.", desc: "Optional chaining (short-circuit on nullish)" },
        ],
      }),
    ],
  },
  {
    slug: "control-flow",
    title: "Control Flow",
    description: "Branch and loop to control program execution.",
    topics: [
      t({
        slug: "if-else",
        title: "if / else",
        summary: "Conditional branching with if, else if, and else.",
        estimatedMinutes: 10,
        difficulty: "beginner",
        keywords: ["if", "else", "condition"],
        challengeWeight: 4,
        explanation:
          "if (condition) runs a block when condition is truthy. else if adds more branches; else is the fallback. Ternary: condition ? valueA : valueB for simple inline choices. Keep nesting shallow — early returns in functions reduce pyramid code.",
        a11yNotes: [],
        commonMistakes: [
          "Using assignment = inside if condition instead of ===",
          "Deeply nested if/else chains that are hard to read",
        ],
        bestPractices: [
          "Prefer early return over deep nesting in functions",
          "Use switch or lookup objects for many discrete cases",
        ],
        interviewQuestions: [
          "When would you use a ternary vs if/else?",
          "What happens if you write if (x = 5)?",
        ],
        cheatSheet: [
          { tag: "if (cond) {}", desc: "Conditional block" },
          { tag: "else if", desc: "Additional branch" },
          { tag: "cond ? a : b", desc: "Ternary operator" },
        ],
      }),
      t({
        slug: "switch",
        title: "switch Statements",
        summary: "Match a value against multiple cases with break.",
        estimatedMinutes: 12,
        difficulty: "beginner",
        keywords: ["switch", "case", "break"],
        challengeWeight: 3,
        explanation:
          "switch (value) compares with strict equality (===) against each case. break exits the switch; without it, execution falls through to the next case. default handles no match. Good for discrete string/number enums; object maps or if/else chains often scale better.",
        a11yNotes: [],
        commonMistakes: [
          "Forgetting break and causing fall-through bugs",
          "Using switch with complex boolean expressions",
        ],
        bestPractices: [
          "Always include break or a comment explaining intentional fall-through",
          "Use default for unexpected values",
        ],
        interviewQuestions: [
          "What happens if you omit break in a switch case?",
          "When is switch better than if/else?",
        ],
        cheatSheet: [
          { tag: "switch (x)", desc: "Multi-way branch on x" },
          { tag: "case", desc: "Match label" },
          { tag: "default", desc: "Fallback when no case matches" },
        ],
      }),
      t({
        slug: "loops-for-while",
        title: "for and while Loops",
        summary: "Repeat code with for, while, and for...of.",
        estimatedMinutes: 14,
        difficulty: "beginner",
        keywords: ["for", "while", "loop"],
        challengeWeight: 5,
        explanation:
          "for (let i = 0; i < arr.length; i++) is classic index iteration. while (condition) loops until false — watch infinite loops. for...of iterates values of iterables (arrays, strings). for...in iterates object keys (avoid for arrays). Array methods like map often replace manual loops.",
        a11yNotes: [],
        commonMistakes: [
          "Off-by-one errors in loop bounds",
          "Using for...in on arrays (iterates keys, not just indices)",
          "Creating infinite while loops",
        ],
        bestPractices: [
          "Prefer for...of or array methods over manual index loops when possible",
          "Use const in for...of, let in classic for when index changes",
        ],
        interviewQuestions: [
          "What is the difference between for...of and for...in?",
          "When would you use while instead of for?",
        ],
        cheatSheet: [
          { tag: "for...of", desc: "Iterate iterable values" },
          { tag: "for...in", desc: "Iterate object enumerable keys" },
          { tag: "while (cond)", desc: "Loop while condition is true" },
        ],
      }),
      t({
        slug: "break-continue",
        title: "break and continue",
        summary: "Exit loops early or skip to the next iteration.",
        estimatedMinutes: 8,
        difficulty: "beginner",
        keywords: ["break", "continue", "loop"],
        challengeWeight: 3,
        explanation:
          "break exits the nearest loop or switch immediately. continue skips the rest of the current iteration and jumps to the next. Use break to stop searching once found; use continue to skip unwanted items. Labels (rare) can break outer loops: outer: for (...) { break outer; }.",
        a11yNotes: [],
        commonMistakes: [
          "Using break outside a loop or switch (syntax error)",
          "Overusing continue making loop logic hard to follow",
        ],
        bestPractices: [
          "Consider array.find or filter instead of break/continue patterns",
          "Keep loop bodies small so break/continue intent is clear",
        ],
        interviewQuestions: [
          "What is the difference between break and continue?",
          "Can break exit a function?",
        ],
        cheatSheet: [
          { tag: "break", desc: "Exit loop or switch" },
          { tag: "continue", desc: "Skip to next iteration" },
          { tag: "label: for", desc: "Named loop for break label" },
        ],
      }),
    ],
  },
  {
    slug: "functions",
    title: "Functions",
    description: "Reusable blocks of logic with parameters and return values.",
    topics: [
      t({
        slug: "function-declarations",
        title: "Function Declarations",
        summary: "Define named functions with the function keyword.",
        estimatedMinutes: 12,
        difficulty: "beginner",
        keywords: ["function", "declaration", "hoisting"],
        challengeWeight: 4,
        explanation:
          "function greet(name) { return `Hello, ${name}`; } creates a hoisted function — you can call it before its line in the file. Functions are first-class: pass them as arguments, return them, store in variables. Expression form: const fn = function() {} is not hoisted.",
        a11yNotes: [],
        commonMistakes: [
          "Forgetting return and getting undefined back",
          "Calling a function expression before its const declaration",
        ],
        bestPractices: [
          "Give functions descriptive verb names: calculateTotal, fetchUser",
          "Keep functions focused — one job per function",
        ],
        interviewQuestions: [
          "What is function hoisting?",
          "What is the difference between a declaration and an expression?",
        ],
        cheatSheet: [
          { tag: "function name()", desc: "Function declaration" },
          { tag: "return", desc: "Send a value back to caller" },
          { tag: "arguments", desc: "Legacy array-like args object" },
        ],
      }),
      t({
        slug: "parameters-return",
        title: "Parameters and Return",
        summary: "Default params, rest parameters, and return values.",
        estimatedMinutes: 12,
        difficulty: "beginner",
        keywords: ["parameters", "return", "default"],
        challengeWeight: 4,
        explanation:
          "Parameters are placeholders; arguments are passed values. Default: function greet(name = \"Guest\"). Rest: function sum(...nums) collects extra args into an array. return exits immediately with a value; functions without return give undefined. Destructuring works in parameters: function draw({ x, y }).",
        a11yNotes: [],
        commonMistakes: [
          "Mutating default object/array params shared across calls",
          "Confusing parameters with arguments",
        ],
        bestPractices: [
          "Use default parameters instead of || fallbacks when 0 is valid",
          "Use rest ...args instead of the arguments object",
        ],
        interviewQuestions: [
          "What are default parameters?",
          "What does a function return if there is no return statement?",
        ],
        cheatSheet: [
          { tag: "param = default", desc: "Default parameter value" },
          { tag: "...rest", desc: "Collect remaining arguments" },
          { tag: "return value", desc: "Exit function with result" },
        ],
      }),
      t({
        slug: "arrow-functions",
        title: "Arrow Functions",
        summary: "Concise syntax with => and lexical this.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["arrow", "fat arrow", "lambda"],
        challengeWeight: 5,
        explanation:
          "const double = (n) => n * 2; One expression implicitly returns. Block body needs explicit return. Arrow functions do not have their own this — they inherit from the enclosing scope. No arguments object. Great for callbacks and array methods; avoid as object methods when you need dynamic this.",
        a11yNotes: [],
        commonMistakes: [
          "Using arrow functions as object methods expecting this to be the object",
          "Omitting return in a block-bodied arrow function",
        ],
        bestPractices: [
          "Use arrows for callbacks and short pure functions",
          "Use regular functions when you need this or hoisting",
        ],
        interviewQuestions: [
          "How does this behave in arrow functions?",
          "When should you not use an arrow function?",
        ],
        cheatSheet: [
          { tag: "() => {}", desc: "Arrow function syntax" },
          { tag: "x => x * 2", desc: "Single param, implicit return" },
          { tag: "this", desc: "Lexical — inherited from outer scope" },
        ],
      }),
      t({
        slug: "scope-closures-intro",
        title: "Scope and Closures Intro",
        summary: "Block vs function scope and functions remembering their environment.",
        estimatedMinutes: 16,
        difficulty: "intermediate",
        keywords: ["scope", "closure", "lexical"],
        challengeWeight: 4,
        explanation:
          "Scope determines variable visibility. Blocks {} create scope for let/const. Inner functions can access outer variables (lexical scope). A closure is when a function retains access to variables from its birth scope even after the outer function returns — powering counters, factories, and callbacks.",
        a11yNotes: [],
        commonMistakes: [
          "var in a loop creating one shared binding (classic closure bug with setTimeout)",
          "Assuming global variables are fine for app state",
        ],
        bestPractices: [
          "Use let in loops when creating closures per iteration",
          "Minimize globals — pass data through parameters",
        ],
        interviewQuestions: [
          "What is a closure? Give a practical example.",
          "What is the difference between lexical and dynamic scope?",
        ],
        cheatSheet: [
          { tag: "block scope", desc: "let/const limited to {}" },
          { tag: "closure", desc: "Function + captured variables" },
          { tag: "IIFE", desc: "Immediately invoked function expression" },
        ],
      }),
    ],
  },
  {
    slug: "arrays",
    title: "Arrays",
    description: "Ordered lists of values and powerful iteration methods.",
    topics: [
      t({
        slug: "array-basics",
        title: "Array Basics",
        summary: "Create, index, length, push, pop, and spread.",
        estimatedMinutes: 12,
        difficulty: "beginner",
        keywords: ["array", "index", "push"],
        challengeWeight: 4,
        explanation:
          "Arrays hold ordered values: const nums = [1, 2, 3]. Index from 0: nums[0] is 1. length is mutable — setting it truncates. push/pop add/remove at end; shift/unshift at start. Spread [...arr] copies; [...a, ...b] merges. Array.isArray checks type.",
        a11yNotes: [],
        commonMistakes: [
          "Assuming arr[-1] gets the last element (use arr.at(-1) or arr[arr.length - 1])",
          "Mutating a copied array reference when you meant a deep copy",
        ],
        bestPractices: [
          "Use const for arrays — contents can still change",
          "Prefer immutable patterns: [...arr, newItem] instead of push when sharing state",
        ],
        interviewQuestions: [
          "How do you add an item to the end of an array?",
          "What is the difference between slice and splice?",
        ],
        cheatSheet: [
          { tag: "push()", desc: "Add to end, returns new length" },
          { tag: "pop()", desc: "Remove from end" },
          { tag: "arr.at(-1)", desc: "Last element safely" },
        ],
      }),
      t({
        slug: "array-methods-map-filter",
        title: "map and filter",
        summary: "Transform and select array items without manual loops.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["map", "filter", "transform"],
        challengeWeight: 5,
        explanation:
          "map(callback) returns a new array with each element transformed. filter(callback) returns elements where callback returns truthy. Neither mutates the original. Chain them: users.filter(u => u.active).map(u => u.name). Callback receives (element, index, array).",
        a11yNotes: [],
        commonMistakes: [
          "Using map when you only need side effects (use forEach instead)",
          "Forgetting map/filter return new arrays — not the same reference",
        ],
        bestPractices: [
          "Chain map and filter for readable data pipelines",
          "Keep callback functions pure when possible",
        ],
        interviewQuestions: [
          "What is the difference between map and forEach?",
          "Does filter mutate the original array?",
        ],
        cheatSheet: [
          { tag: "map()", desc: "Transform each element → new array" },
          { tag: "filter()", desc: "Keep elements matching test" },
          { tag: "forEach()", desc: "Run callback, returns undefined" },
        ],
      }),
      t({
        slug: "find-includes-sort",
        title: "find, includes, and sort",
        summary: "Search arrays and order elements.",
        estimatedMinutes: 12,
        difficulty: "intermediate",
        keywords: ["find", "includes", "sort"],
        challengeWeight: 4,
        explanation:
          "find(callback) returns the first match or undefined. findIndex returns the index. includes(value) checks existence (uses SameValueZero). indexOf finds primitive index. sort() sorts in place as strings by default — pass (a, b) => a - b for numbers. toSorted() (ES2023) returns sorted copy.",
        a11yNotes: [],
        commonMistakes: [
          "Sorting numbers without a compare function ([10, 2].sort() → [10, 2])",
          "Using includes to find objects (compares by reference)",
        ],
        bestPractices: [
          "Use find instead of filter()[0] for first match",
          "Always pass compare fn when sorting numbers or dates",
        ],
        interviewQuestions: [
          "Why does [10, 2, 5].sort() not sort numerically?",
          "What is the difference between find and filter?",
        ],
        cheatSheet: [
          { tag: "find()", desc: "First element matching predicate" },
          { tag: "includes()", desc: "Boolean membership test" },
          { tag: "sort((a,b)=>a-b)", desc: "Numeric ascending sort" },
        ],
      }),
    ],
  },
  {
    slug: "objects",
    title: "Objects",
    description: "Key-value collections and method behavior.",
    topics: [
      t({
        slug: "object-literals",
        title: "Object Literals",
        summary: "Create objects with { key: value } syntax.",
        estimatedMinutes: 12,
        difficulty: "beginner",
        keywords: ["object", "literal", "property"],
        challengeWeight: 4,
        explanation:
          "Objects group related data: const user = { name: \"Ada\", age: 30 }. Keys are strings or symbols; values any type. Shorthand: { name, age } when variables match keys. Computed keys: { [dynamicKey]: value }. Objects are reference types — assignment copies the reference.",
        a11yNotes: [],
        commonMistakes: [
          "Comparing objects with === expecting value equality",
          "Adding properties with typos creating unexpected keys",
        ],
        bestPractices: [
          "Use object destructuring to extract properties cleanly",
          "Prefer spread { ...obj, updated: true } for shallow immutable updates",
        ],
        interviewQuestions: [
          "How do you create an object in JavaScript?",
          "Are objects passed by value or reference?",
        ],
        cheatSheet: [
          { tag: "{ key: val }", desc: "Object literal syntax" },
          { tag: "Object.keys()", desc: "Array of own property names" },
          { tag: "{ ...obj }", desc: "Shallow copy via spread" },
        ],
      }),
      t({
        slug: "access-and-mutate",
        title: "Access and Mutate Properties",
        summary: "Dot notation, bracket notation, and destructuring.",
        estimatedMinutes: 10,
        difficulty: "beginner",
        keywords: ["dot", "bracket", "destructure"],
        challengeWeight: 3,
        explanation:
          "obj.name is dot access; obj[\"name\"] is bracket access — required for dynamic keys or keys with spaces. Assign to update: user.age = 31. delete user.temp removes a property. const { name, age } = user extracts fields. Nested: const { address: { city } } = user.",
        a11yNotes: [],
        commonMistakes: [
          "Using dot notation with variable keys (use brackets)",
          "Destructuring undefined nested properties without defaults",
        ],
        bestPractices: [
          "Use optional chaining obj?.nested?.field for safe access",
          "Provide defaults in destructuring: const { role = \"guest\" } = user",
        ],
        interviewQuestions: [
          "When must you use bracket notation?",
          "What does object destructuring do?",
        ],
        cheatSheet: [
          { tag: "obj.key", desc: "Dot property access" },
          { tag: "obj[keyVar]", desc: "Dynamic bracket access" },
          { tag: "const { a, b } = obj", desc: "Destructuring assignment" },
        ],
      }),
      t({
        slug: "object-methods-this-intro",
        title: "Object Methods and this Intro",
        summary: "Functions as properties and the this keyword basics.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["method", "this", "object"],
        challengeWeight: 4,
        explanation:
          "Methods are functions on objects: user.greet = function() { return this.name; }. this refers to the object before the dot at call time — user.greet() → this is user. Losing this happens with const fn = user.greet; fn(). bind/call/apply fix context (advanced). Arrow methods on objects do not have their own this.",
        a11yNotes: [],
        commonMistakes: [
          "Extracting a method and calling it unbound",
          "Using arrow functions as object methods when this should be the object",
        ],
        bestPractices: [
          "Use method shorthand: { greet() { ... } }",
          "Pass arrow wrappers or bind when passing methods as callbacks",
        ],
        interviewQuestions: [
          "What does this refer to in obj.method()?",
          "Why might this be undefined inside a callback?",
        ],
        cheatSheet: [
          { tag: "this", desc: "Context object at call time" },
          { tag: "method()", desc: "Shorthand method syntax" },
          { tag: ".bind(this)", desc: "Fix this for a function" },
        ],
      }),
    ],
  },
  {
    slug: "dom-basics",
    title: "DOM Basics",
    description: "Read and change the page with the Document Object Model.",
    topics: [
      t({
        slug: "select-elements",
        title: "Selecting Elements",
        summary: "querySelector, querySelectorAll, and getElementById.",
        estimatedMinutes: 12,
        difficulty: "beginner",
        keywords: ["querySelector", "DOM", "select"],
        challengeWeight: 5,
        explanation:
          "document.querySelector('.card') returns the first match; querySelectorAll('.card') returns a NodeList of all matches. getElementById('hero') is fast for IDs. Cache selections in variables — don't query the DOM on every event if the element doesn't change.",
        a11yNotes: [
          "Prefer semantic HTML selectors; don't rely on div-only structure.",
          "Updating DOM content should preserve accessible names where possible.",
        ],
        commonMistakes: [
          "Calling querySelector and not checking for null",
          "Confusing NodeList with Array (NodeList lacks map unless converted)",
        ],
        bestPractices: [
          "Use specific selectors — classes over tag-only queries",
          "Convert NodeList with [...nodeList] or Array.from when needed",
        ],
        interviewQuestions: [
          "What is the difference between querySelector and querySelectorAll?",
          "What does querySelector return if nothing matches?",
        ],
        cheatSheet: [
          { tag: "querySelector()", desc: "First match for CSS selector" },
          { tag: "querySelectorAll()", desc: "All matches as NodeList" },
          { tag: "getElementById()", desc: "Select by unique id" },
        ],
      }),
      t({
        slug: "text-and-attributes",
        title: "Text Content and Attributes",
        summary: "textContent, innerHTML, classList, and setAttribute.",
        estimatedMinutes: 12,
        difficulty: "beginner",
        keywords: ["textContent", "classList", "attributes"],
        challengeWeight: 4,
        explanation:
          "el.textContent sets plain text safely. innerHTML parses HTML — XSS risk with user input. classList.add/remove/toggle/contains manages classes. setAttribute('aria-expanded', 'true') for ARIA. dataset reads data-* attributes: el.dataset.userId from data-user-id.",
        a11yNotes: [
          "Use textContent for user-generated text, not innerHTML.",
          "Update aria-* attributes when UI state changes.",
        ],
        commonMistakes: [
          "Using innerHTML with unsanitized user input",
          "Setting className and wiping other classes unintentionally",
        ],
        bestPractices: [
          "Prefer textContent over innerHTML for dynamic text",
          "Use classList.toggle('active', condition) for state classes",
        ],
        interviewQuestions: [
          "What is the difference between textContent and innerHTML?",
          "How do you toggle a CSS class with JavaScript?",
        ],
        cheatSheet: [
          { tag: "textContent", desc: "Plain text read/write" },
          { tag: "classList.toggle()", desc: "Add/remove class by condition" },
          { tag: "dataset", desc: "Access data-* attributes" },
        ],
      }),
      t({
        slug: "create-and-append",
        title: "Create and Append Elements",
        summary: "createElement, append, and building UI in JS.",
        estimatedMinutes: 14,
        difficulty: "beginner",
        keywords: ["createElement", "append", "DOM"],
        challengeWeight: 4,
        explanation:
          "document.createElement('li') makes a new node. Set content, then parent.append(child) or parent.appendChild(child). DocumentFragment batches inserts for performance. remove() deletes a node. insertAdjacentHTML (careful with XSS) inserts HTML strings at positions.",
        a11yNotes: [
          "Create semantic elements (button, li, nav) not div soup.",
          "Add accessible labels when building interactive controls.",
        ],
        commonMistakes: [
          "Appending in a loop without a fragment (many reflows)",
          "Creating elements but never attaching them to the document",
        ],
        bestPractices: [
          "Build complex lists with DocumentFragment",
          "Use template elements or cloneNode for repeated structures",
        ],
        interviewQuestions: [
          "How do you add a new element to the DOM?",
          "What is a DocumentFragment used for?",
        ],
        cheatSheet: [
          { tag: "createElement()", desc: "Create a new DOM node" },
          { tag: "append()", desc: "Add child nodes to parent" },
          { tag: "DocumentFragment", desc: "Batch DOM inserts" },
        ],
      }),
    ],
  },
  {
    slug: "events",
    title: "Events",
    description: "React to user actions with event listeners.",
    topics: [
      t({
        slug: "click-listeners",
        title: "Click Listeners",
        summary: "addEventListener, handler functions, and event delegation.",
        estimatedMinutes: 12,
        difficulty: "beginner",
        keywords: ["click", "addEventListener", "handler"],
        challengeWeight: 5,
        explanation:
          "button.addEventListener('click', handler) registers a callback. Pass a function reference, not handler() unless you want immediate invocation. removeEventListener needs the same function reference. Event delegation: listen on a parent and use event.target to handle children — great for dynamic lists.",
        a11yNotes: [
          "Don't rely on click alone — support keyboard (Enter/Space on buttons).",
          "Use native button elements instead of div onclick.",
        ],
        commonMistakes: [
          "addEventListener('click', myFn()) — calls immediately",
          "Attaching one listener per list item instead of delegating",
        ],
        bestPractices: [
          "Use event delegation for lists rendered dynamically",
          "Name handlers descriptively: handleSubmit, onCounterClick",
        ],
        interviewQuestions: [
          "What is event delegation?",
          "How do you remove an event listener?",
        ],
        cheatSheet: [
          { tag: "addEventListener()", desc: "Register event handler" },
          { tag: "removeEventListener()", desc: "Unregister handler" },
          { tag: "event.target", desc: "Element that triggered event" },
        ],
      }),
      t({
        slug: "event-object",
        title: "The Event Object",
        summary: "preventDefault, stopPropagation, and event properties.",
        estimatedMinutes: 12,
        difficulty: "intermediate",
        keywords: ["event", "preventDefault", "target"],
        challengeWeight: 4,
        explanation:
          "Handlers receive an event object: (event) => { ... }. event.target is the element clicked; event.currentTarget is the element with the listener. preventDefault() stops default browser behavior (form submit, link navigation). stopPropagation() stops bubbling to parent listeners.",
        a11yNotes: [
          "Don't preventDefault on focus events without providing an alternative.",
        ],
        commonMistakes: [
          "Calling preventDefault when you only need stopPropagation",
          "Assuming event.target is always the element with the listener",
        ],
        bestPractices: [
          "Use event.currentTarget when delegating from a parent",
          "Only preventDefault when you handle the action yourself",
        ],
        interviewQuestions: [
          "What is the difference between target and currentTarget?",
          "When would you call preventDefault?",
        ],
        cheatSheet: [
          { tag: "preventDefault()", desc: "Cancel default browser action" },
          { tag: "stopPropagation()", desc: "Stop event bubbling" },
          { tag: "event.type", desc: "Event name string e.g. 'click'" },
        ],
      }),
      t({
        slug: "forms-and-input",
        title: "Forms and Input Events",
        summary: "submit, input, change, and reading form values.",
        estimatedMinutes: 14,
        difficulty: "beginner",
        keywords: ["form", "submit", "input"],
        challengeWeight: 4,
        explanation:
          "Listen for 'submit' on the form, call event.preventDefault(), read fields with input.value. 'input' fires on every keystroke; 'change' when value commits (blur or select). checkbox.checked, select.value. FormData(form) collects all fields. Validate before sending.",
        a11yNotes: [
          "Associate labels with inputs; announce validation errors accessibly.",
          "Don't disable submit without explaining why to assistive tech.",
        ],
        commonMistakes: [
          "Listening to button click instead of form submit (misses Enter key)",
          "Forgetting preventDefault and getting a page reload",
        ],
        bestPractices: [
          "Handle form submit, not just button click",
          "Validate on both client and server",
        ],
        interviewQuestions: [
          "What is the difference between input and change events?",
          "How do you get all form field values at once?",
        ],
        cheatSheet: [
          { tag: "input.value", desc: "Current field value" },
          { tag: "FormData", desc: "Collect form fields as entries" },
          { tag: "checkbox.checked", desc: "Boolean checked state" },
        ],
      }),
    ],
  },
  {
    slug: "async-intro",
    title: "Async Intro",
    description: "Handle waiting operations without blocking the UI.",
    topics: [
      t({
        slug: "callbacks-vs-promises",
        title: "Callbacks vs Promises",
        summary: "Async patterns from callbacks to Promise chains.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["callback", "promise", "async"],
        challengeWeight: 4,
        explanation:
          "Callbacks pass a function to run later: setTimeout(fn, 1000). Nested callbacks cause \"callback hell.\" Promises represent a future value: fetch(url).then(res => res.json()).then(data => ...). catch handles errors. Promise.all runs tasks in parallel.",
        a11yNotes: [],
        commonMistakes: [
          "Forgetting .catch on promise chains",
          "Creating promise anti-patterns by wrapping sync code unnecessarily",
        ],
        bestPractices: [
          "Return promises from .then callbacks to chain cleanly",
          "Use async/await for readable async code",
        ],
        interviewQuestions: [
          "What problem do Promises solve compared to callbacks?",
          "What does Promise.all do?",
        ],
        cheatSheet: [
          { tag: "new Promise()", desc: "Create a Promise" },
          { tag: ".then()", desc: "Handle fulfilled value" },
          { tag: ".catch()", desc: "Handle rejection" },
        ],
      }),
      t({
        slug: "fetch-basics",
        title: "fetch Basics",
        summary: "Request data from APIs with fetch and JSON.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["fetch", "api", "json"],
        challengeWeight: 5,
        explanation:
          "fetch(url) returns a Response promise. Check response.ok before parsing. response.json() parses JSON body. POST: fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }). Always handle network errors with try/catch or .catch.",
        a11yNotes: [
          "Show loading and error states in the UI for users of all abilities.",
        ],
        commonMistakes: [
          "Not checking response.ok (404 still resolves fetch)",
          "Calling response.json() twice on the same response",
        ],
        bestPractices: [
          "Centralize fetch logic in small API helper functions",
          "Display user-friendly errors when fetch fails",
        ],
        interviewQuestions: [
          "Does fetch reject on HTTP 404?",
          "How do you send JSON in a POST request?",
        ],
        cheatSheet: [
          { tag: "fetch(url)", desc: "HTTP request, returns Promise<Response>" },
          { tag: "response.json()", desc: "Parse body as JSON" },
          { tag: "JSON.stringify()", desc: "Object → JSON string" },
        ],
      }),
      t({
        slug: "async-await-intro",
        title: "async / await Intro",
        summary: "Write asynchronous code that reads like synchronous code.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["async", "await", "promise"],
        challengeWeight: 5,
        explanation:
          "async function fetchUser() { const res = await fetch('/api/user'); const data = await res.json(); return data; } await pauses until the promise settles. Wrap in try/catch for errors. async functions always return a Promise. await only works inside async functions.",
        a11yNotes: [],
        commonMistakes: [
          "Using await without try/catch and crashing on failure",
          "Sequential await in a loop when Promise.all would be faster",
        ],
        bestPractices: [
          "Use try/catch around await blocks",
          "Use Promise.all for independent parallel requests",
        ],
        interviewQuestions: [
          "What does async function return?",
          "How do you handle errors with async/await?",
        ],
        cheatSheet: [
          { tag: "async function", desc: "Function returning a Promise" },
          { tag: "await", desc: "Pause until Promise resolves" },
          { tag: "try/catch", desc: "Handle await errors" },
        ],
      }),
    ],
  },
  {
    slug: "modern-js-best-practices",
    title: "Modern JS / Best Practices",
    description: "Modules, error handling, and maintainable habits.",
    topics: [
      t({
        slug: "modules-import-export",
        title: "Modules: import and export",
        summary: "Split code across files with ES modules.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["import", "export", "module"],
        challengeWeight: 4,
        explanation:
          "export const PI = 3.14; or export default function() {} in one file. import { PI } from './math.js'; or import math from './math.js' for default. Modules are strict mode, have their own scope, and defer execution. File extension .js and type=\"module\" in script tag required in browsers.",
        a11yNotes: [],
        commonMistakes: [
          "Mixing default and named imports incorrectly",
          "Forgetting .js extension in browser module imports",
        ],
        bestPractices: [
          "One main export per module when possible",
          "Use named exports for utilities, default for main component",
        ],
        interviewQuestions: [
          "What is the difference between default and named exports?",
          "What is the benefit of ES modules?",
        ],
        cheatSheet: [
          { tag: "export", desc: "Expose bindings from module" },
          { tag: "import { x }", desc: "Named import" },
          { tag: "export default", desc: "Default export" },
        ],
      }),
      t({
        slug: "errors-try-catch",
        title: "Errors and try / catch",
        summary: "Throw, catch, and handle runtime errors gracefully.",
        estimatedMinutes: 12,
        difficulty: "intermediate",
        keywords: ["error", "try", "catch", "throw"],
        challengeWeight: 4,
        explanation:
          "throw new Error('message') stops execution and propagates until caught. try { risky(); } catch (err) { console.error(err.message); } finally { cleanup(); } runs always. Custom errors extend Error. Don't swallow errors silently — log or rethrow.",
        a11yNotes: [
          "Surface errors to users with clear, readable messages.",
        ],
        commonMistakes: [
          "Empty catch blocks hiding bugs",
          "Throwing strings instead of Error objects",
        ],
        bestPractices: [
          "Throw Error instances with meaningful messages",
          "Catch at boundaries (API calls, user input), not everywhere",
        ],
        interviewQuestions: [
          "What is the purpose of the finally block?",
          "What happens if an error is not caught?",
        ],
        cheatSheet: [
          { tag: "throw new Error()", desc: "Raise an exception" },
          { tag: "try/catch", desc: "Handle thrown errors" },
          { tag: "finally", desc: "Always-run cleanup block" },
        ],
      }),
      t({
        slug: "clean-js-habits",
        title: "Clean JavaScript Habits",
        summary: "Naming, small functions, immutability, and readable code.",
        estimatedMinutes: 12,
        difficulty: "intermediate",
        keywords: ["clean code", "naming", "habits"],
        challengeWeight: 3,
        explanation:
          "Use clear names: isLoggedIn not flag. Functions do one thing. Avoid magic numbers — use named constants. Prefer const and immutable updates. Comment why, not what. Lint with ESLint. Format consistently. Delete dead code. Read code as if you're the next maintainer.",
        a11yNotes: [],
        commonMistakes: [
          "Abbreviated variable names: x, tmp, data2",
          "God functions that do validation, fetch, DOM, and analytics",
        ],
        bestPractices: [
          "Extract repeated logic into named functions",
          "Use strict equality, modern syntax, and consistent formatting",
        ],
        interviewQuestions: [
          "How do you keep JavaScript code maintainable?",
          "What makes a good function name?",
        ],
        cheatSheet: [
          { tag: "const MAX_RETRIES = 3", desc: "Named constant" },
          { tag: "eslint", desc: "Static analysis linter" },
          { tag: "DRY", desc: "Don't Repeat Yourself principle" },
        ],
      }),
    ],
  },
  {
    slug: "mini-projects",
    title: "Mini Projects",
    description: "Apply JS fundamentals to small interactive apps.",
    topics: [
      t({
        slug: "project-counter-app",
        title: "Mini Project: Counter App",
        summary: "Build increment/decrement with DOM updates and state.",
        estimatedMinutes: 25,
        difficulty: "beginner",
        keywords: ["project", "counter", "dom"],
        challengeWeight: 5,
        explanation:
          "Track a count variable. Wire + and − buttons with addEventListener. Update a display element's textContent on each click. Optional: disable at min/max, add step size, or persist to localStorage. Combines variables, functions, events, and DOM manipulation.",
        a11yNotes: [
          "Use button elements with accessible labels (Increment count).",
          "Announce count changes for screen readers if building live region updates.",
        ],
        commonMistakes: [
          "Parsing textContent back to number inefficiently on every click instead of keeping state",
          "Using divs as buttons without keyboard support",
        ],
        bestPractices: [
          "Single source of truth: one count variable, render from it",
          "Separate updateDisplay() from event handlers",
        ],
        interviewQuestions: [
          "Walk through building a counter from scratch.",
          "Where should application state live in a vanilla JS app?",
        ],
        cheatSheet: [
          { tag: "let count = 0", desc: "Counter state variable" },
          { tag: "textContent = count", desc: "Sync display to state" },
          { tag: "localStorage.setItem()", desc: "Persist count across reloads" },
        ],
      }),
      t({
        slug: "project-todo-list",
        title: "Mini Project: Todo List",
        summary: "Add, complete, and remove tasks with arrays and the DOM.",
        estimatedMinutes: 30,
        difficulty: "intermediate",
        keywords: ["project", "todo", "list"],
        challengeWeight: 5,
        explanation:
          "Store todos as an array of objects { id, text, done }. Form submit adds a todo. Render the list from the array — don't manually sync DOM and data separately. Toggle done on click, filter completed, delete with event delegation. Optional: save to localStorage and reload on init.",
        a11yNotes: [
          "Use ul/li for the list structure.",
          "Label the input; mark completed items accessibly (aria-checked or semantic styling).",
        ],
        commonMistakes: [
          "Mutating DOM and array independently and losing sync",
          "Not preventing empty todos from being added",
        ],
        bestPractices: [
          "Render function: clear list, map todos to DOM nodes, append",
          "Use crypto.randomUUID() or Date.now() for unique ids",
        ],
        interviewQuestions: [
          "How would you structure data for a todo app?",
          "Why render from state instead of patching individual nodes?",
        ],
        cheatSheet: [
          { tag: "todos.push({ id, text })", desc: "Add todo to state" },
          { tag: "todos.filter(t => !t.done)", desc: "Active todos only" },
          { tag: "renderTodos()", desc: "Re-render list from state" },
        ],
      }),
    ],
  },
];

export function flattenJsTopics(): JsTopicDef[] {
  return JS_ACADEMY_SECTIONS.flatMap((section) => section.topics);
}
