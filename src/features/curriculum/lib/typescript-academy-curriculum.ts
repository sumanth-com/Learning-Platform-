export type TypescriptDifficulty = "beginner" | "intermediate" | "advanced";

export type TypescriptTopicDef = {
  slug: string;
  title: string;
  summary: string;
  estimatedMinutes: number;
  difficulty: TypescriptDifficulty;
  keywords: string[];
  challengeWeight: number;
  explanation: string;
  a11yNotes: string[];
  commonMistakes: string[];
  bestPractices: string[];
  interviewQuestions: string[];
  /** TypeScript APIs / types for the reference panel */
  cheatSheet: Array<{ tag: string; desc: string }>;
};

export type TypescriptSectionDef = {
  slug: string;
  title: string;
  description: string;
  topics: TypescriptTopicDef[];
};

function t(partial: TypescriptTopicDef): TypescriptTopicDef {
  return partial;
}

export const TYPESCRIPT_ACADEMY_SECTIONS: TypescriptSectionDef[] = [
  {
    slug: "ts-introduction",
    title: "TS Introduction",
    description: "What TypeScript is, how it relates to JavaScript, and how to compile and configure it.",
    topics: [
      t({
        slug: "what-is-typescript",
        title: "What is TypeScript?",
        summary: "TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.",
        estimatedMinutes: 12,
        difficulty: "beginner",
        keywords: ["typescript", "types", "superset", "compile"],
        challengeWeight: 4,
        explanation:
          "TypeScript adds optional static types to JavaScript. You write .ts or .tsx files with type annotations, interfaces, and generics. The TypeScript compiler (tsc) checks types at build time and emits JavaScript that runs anywhere JS runs. Types are erased at compile time — they do not exist at runtime. TypeScript catches many bugs before you run code: typos on properties, wrong argument types, and null reference errors when strict mode is on.",
        a11yNotes: [
          "TypeScript does not change runtime accessibility; keep semantic HTML and ARIA in JSX.",
        ],
        commonMistakes: [
          "Expecting TypeScript to enforce types at runtime without extra validation",
          "Assuming you must rewrite all JavaScript before adopting TypeScript",
          "Confusing TypeScript with a separate runtime like Node or Deno",
        ],
        bestPractices: [
          "Adopt TypeScript incrementally in existing JavaScript projects",
          "Let the compiler guide you with strict settings over time",
          "Treat types as documentation that stays in sync with code",
        ],
        interviewQuestions: [
          "What is TypeScript and why do teams use it?",
          "Does TypeScript run in the browser directly?",
          "What happens to types when TypeScript compiles to JavaScript?",
        ],
        cheatSheet: [
          { tag: "TypeScript", desc: "Typed superset of JavaScript compiled with tsc" },
          { tag: ".ts", desc: "TypeScript source file extension" },
          { tag: "type erasure", desc: "Types removed in emitted JavaScript output" },
        ],
      }),
      t({
        slug: "ts-vs-js",
        title: "TypeScript vs JavaScript",
        summary: "All valid JavaScript is valid TypeScript, but TypeScript adds a static type layer.",
        estimatedMinutes: 10,
        difficulty: "beginner",
        keywords: ["javascript", "comparison", "types", "safety"],
        challengeWeight: 3,
        explanation:
          "JavaScript is dynamically typed: variable types are determined at runtime. TypeScript is JavaScript plus a type system checked before execution. You can paste .js code into .ts and it usually works. TypeScript adds interfaces, enums, generics, and stricter checking. The trade-off is a compile step and learning curve; the payoff is fewer production bugs, better editor autocomplete, and safer refactors in large codebases.",
        a11yNotes: [],
        commonMistakes: [
          "Thinking TypeScript replaces learning JavaScript fundamentals",
          "Believing TypeScript makes code automatically secure or bug-free",
          "Using any everywhere and losing the benefits of the type system",
        ],
        bestPractices: [
          "Master JavaScript first, then layer TypeScript on top",
          "Use TypeScript for team projects and growing codebases",
          "Prefer gradual typing: start loose, tighten strict flags later",
        ],
        interviewQuestions: [
          "Is every JavaScript program valid TypeScript?",
          "What problems does TypeScript solve that JavaScript alone does not?",
          "When might you choose plain JavaScript over TypeScript?",
        ],
        cheatSheet: [
          { tag: "JS", desc: "Dynamically typed language that runs natively" },
          { tag: "TS", desc: "JS plus compile-time type checking" },
          { tag: "superset", desc: "TS extends JS syntax; valid JS is valid TS" },
        ],
      }),
      t({
        slug: "installing-and-tsc",
        title: "Installing TypeScript and tsc",
        summary: "Install the compiler locally and run tsc to check types and emit JavaScript.",
        estimatedMinutes: 14,
        difficulty: "beginner",
        keywords: ["install", "tsc", "npm", "compile"],
        challengeWeight: 4,
        explanation:
          "Install TypeScript as a dev dependency: npm install -D typescript. Run npx tsc to compile. With no tsconfig.json, tsc compiles the current directory. Create tsconfig.json with npx tsc --init for sensible defaults. Use npx tsc --noEmit to type-check without writing output files. In Vite or Next.js projects, the bundler often runs TypeScript checking alongside its own build pipeline.",
        a11yNotes: [],
        commonMistakes: [
          "Installing TypeScript globally and getting version mismatches across projects",
          "Forgetting to add typescript to devDependencies in package.json",
          "Running tsc without a tsconfig and compiling unintended files",
        ],
        bestPractices: [
          "Pin TypeScript version per project in devDependencies",
          "Use npx tsc or npm scripts instead of global tsc",
          "Add a typecheck script: \"typecheck\": \"tsc --noEmit\"",
        ],
        interviewQuestions: [
          "How do you install and run the TypeScript compiler?",
          "What does tsc --noEmit do?",
          "Why prefer local TypeScript over a global install?",
        ],
        cheatSheet: [
          { tag: "npm install -D typescript", desc: "Add TypeScript to a project" },
          { tag: "npx tsc", desc: "Run the local TypeScript compiler" },
          { tag: "tsc --noEmit", desc: "Type-check without writing JS files" },
        ],
      }),
      t({
        slug: "tsconfig-basics",
        title: "tsconfig.json Basics",
        summary: "tsconfig.json controls compiler options, included files, and output settings.",
        estimatedMinutes: 16,
        difficulty: "beginner",
        keywords: ["tsconfig", "compilerOptions", "target", "module"],
        challengeWeight: 4,
        explanation:
          "tsconfig.json tells tsc how to compile your project. Key compilerOptions: target (ES version of output), module (CommonJS, ESNext, etc.), strict (enable strict type checking), outDir and rootDir (output and source roots), include and exclude (glob patterns for files). jsx controls React JSX handling (react-jsx for modern React). skipLibCheck speeds builds by skipping type checks in node_modules declaration files.",
        a11yNotes: [],
        commonMistakes: [
          "Not setting strict and missing easy-to-catch type errors",
          "Including node_modules or dist in compilation",
          "Mismatched module and target settings for your bundler",
        ],
        bestPractices: [
          "Start with npx tsc --init and enable strict gradually",
          "Keep include focused on src/ to avoid compiling stray files",
          "Align module with your bundler (usually ESNext or ES2020)",
        ],
        interviewQuestions: [
          "What is the purpose of tsconfig.json?",
          "What does the strict compiler option enable?",
          "How do include and exclude work?",
        ],
        cheatSheet: [
          { tag: "compilerOptions", desc: "Compiler behavior flags in tsconfig.json" },
          { tag: "strict", desc: "Enables strict type-checking family of options" },
          { tag: "include", desc: "Glob patterns for files to compile" },
        ],
      }),
    ],
  },
  {
    slug: "basic-types",
    title: "Basic Types",
    description: "Primitive types, collections, enums, and the special types any, unknown, and never.",
    topics: [
      t({
        slug: "primitives-and-annotations",
        title: "Primitives and Type Annotations",
        summary: "Annotate variables with string, number, boolean, null, undefined, bigint, and symbol.",
        estimatedMinutes: 14,
        difficulty: "beginner",
        keywords: ["primitives", "annotations", "string", "number", "boolean"],
        challengeWeight: 4,
        explanation:
          "TypeScript knows primitive types: string, number, boolean, null, undefined, bigint, symbol. Annotate with a colon: let name: string = \"Ada\". Type inference often fills in types automatically: let count = 0 infers number. Use explicit annotations for function parameters, empty arrays before push, and when inference is too wide. Literal types narrow further: let dir: \"up\" | \"down\" = \"up\".",
        a11yNotes: [],
        commonMistakes: [
          "Using Number or String wrapper types instead of number and string",
          "Annotating every variable when inference is clear and sufficient",
          "Confusing null and undefined in strictNullChecks mode",
        ],
        bestPractices: [
          "Rely on inference for simple local variables",
          "Annotate public APIs: function params and return types",
          "Use const assertions for literal values that must not widen",
        ],
        interviewQuestions: [
          "What primitive types does TypeScript support?",
          "When should you use explicit type annotations?",
          "What is type inference?",
        ],
        cheatSheet: [
          { tag: "string", desc: "Text primitive type" },
          { tag: "number", desc: "Numeric primitive including integers and floats" },
          { tag: "boolean", desc: "true or false" },
        ],
      }),
      t({
        slug: "arrays-and-tuples",
        title: "Arrays and Tuples",
        summary: "Type homogeneous arrays and fixed-length tuples with typed positions.",
        estimatedMinutes: 12,
        difficulty: "beginner",
        keywords: ["array", "tuple", "readonly", "generics"],
        challengeWeight: 4,
        explanation:
          "Arrays hold elements of one type: number[] or Array<number>. Tuples are arrays with fixed length and types per index: type Point = [number, number]. Use readonly tuples when order and length must not change: readonly [string, number]. Destructuring preserves tuple types. For mixed-length arrays, prefer arrays; for coordinates, RGB, or [key, value] pairs, tuples express intent clearly.",
        a11yNotes: [],
        commonMistakes: [
          "Using tuple syntax for arrays that vary in length",
          "Pushing into a tuple typed array and breaking the contract",
          "Writing (string | number)[] when a tuple [string, number] is clearer",
        ],
        bestPractices: [
          "Use T[] or Array<T> consistently in your codebase",
          "Prefer tuples for fixed-structure pairs like [id, label]",
          "Mark immutable tuples readonly when exposing from APIs",
        ],
        interviewQuestions: [
          "What is the difference between an array type and a tuple?",
          "How do you type a read-only tuple?",
          "When would you choose a tuple over an object?",
        ],
        cheatSheet: [
          { tag: "number[]", desc: "Array of numbers" },
          { tag: "[string, number]", desc: "Tuple with string then number" },
          { tag: "readonly T[]", desc: "Read-only array type" },
        ],
      }),
      t({
        slug: "enums-intro",
        title: "Enums Introduction",
        summary: "Enums name related constants; prefer const objects or unions in modern TypeScript.",
        estimatedMinutes: 12,
        difficulty: "beginner",
        keywords: ["enum", "constants", "union", "numeric"],
        challengeWeight: 3,
        explanation:
          "Numeric enums assign auto-incrementing numbers: enum Status { Active, Inactive } maps Active to 0. String enums use explicit string values: enum Color { Red = \"red\" }. const enum inlines values at compile time. Many teams prefer union types or as const objects because enums emit extra JavaScript and have quirky reverse-mapping behavior for numeric enums. Know enums for legacy code; prefer type Status = \"active\" | \"inactive\" for new code.",
        a11yNotes: [],
        commonMistakes: [
          "Using numeric enums when string unions are simpler and safer",
          "Assuming enums are zero-cost at runtime — they generate JS objects",
          "Mixing enum values with unrelated strings without narrowing",
        ],
        bestPractices: [
          "Prefer string literal unions for simple status flags",
          "Use as const objects when you need a runtime value map",
          "Document when an enum is required for external API compatibility",
        ],
        interviewQuestions: [
          "What is a TypeScript enum?",
          "What are trade-offs of enums vs union types?",
          "What does const enum do?",
        ],
        cheatSheet: [
          { tag: "enum", desc: "Named set of related constant values" },
          { tag: "string enum", desc: "Enum members with string values" },
          { tag: "as const", desc: "Freeze object literals for literal types" },
        ],
      }),
      t({
        slug: "any-unknown-never",
        title: "any, unknown, and never",
        summary: "any opts out of checking; unknown is safe any; never means no possible value.",
        estimatedMinutes: 16,
        difficulty: "intermediate",
        keywords: ["any", "unknown", "never", "top", "bottom"],
        challengeWeight: 5,
        explanation:
          "any disables type checking — use sparingly for gradual migration. unknown is the type-safe counterpart: you must narrow before use. never represents values that never occur: a function that always throws, or the empty branch after exhaustive checks. Functions with return type never do not need to return. In switch statements, assigning to a never variable in default catches missing cases when discriminated unions are exhaustive.",
        a11yNotes: [],
        commonMistakes: [
          "Using any instead of unknown for external JSON data",
          "Forgetting that any poisons inference through assignment chains",
          "Using never as return type for functions that actually return undefined",
        ],
        bestPractices: [
          "Default to unknown for values from APIs and user input",
          "Use never for exhaustive switch helpers and impossible states",
          "Enable noImplicitAny to catch missing annotations",
        ],
        interviewQuestions: [
          "What is the difference between any and unknown?",
          "When is never used?",
          "Why is any considered an escape hatch?",
        ],
        cheatSheet: [
          { tag: "any", desc: "Disables type checking for a value" },
          { tag: "unknown", desc: "Top type; must narrow before use" },
          { tag: "never", desc: "Bottom type; no assignable values" },
        ],
      }),
    ],
  },
  {
    slug: "objects-and-types",
    title: "Objects and Types",
    description: "Model object shapes with interfaces, type aliases, modifiers, and index signatures.",
    topics: [
      t({
        slug: "interfaces-basics",
        title: "Interfaces Basics",
        summary: "Interfaces describe object shapes and can be extended by other interfaces.",
        estimatedMinutes: 14,
        difficulty: "beginner",
        keywords: ["interface", "object", "shape", "extends"],
        challengeWeight: 4,
        explanation:
          "An interface names the structure of an object: interface User { id: number; name: string; }. Use it for function parameters and return types. Interfaces support declaration merging — two declarations with the same name merge. Extend interfaces with extends: interface Admin extends User { role: \"admin\"; }. Interfaces describe plain objects and class instance shapes via implements.",
        a11yNotes: [],
        commonMistakes: [
          "Adding optional properties without documenting which are required for valid use",
          "Using interface for union types that type aliases handle better",
          "Duplicating the same shape as both interface and type unnecessarily",
        ],
        bestPractices: [
          "Name interfaces with PascalCase nouns: User, ApiResponse",
          "Extend interfaces instead of copying fields",
          "Keep interfaces focused; split large shapes into composable pieces",
        ],
        interviewQuestions: [
          "What is a TypeScript interface?",
          "How does interface extension work?",
          "What is declaration merging?",
        ],
        cheatSheet: [
          { tag: "interface", desc: "Describes the shape of an object type" },
          { tag: "extends", desc: "Inherit properties from another interface" },
          { tag: "implements", desc: "Class contract to satisfy an interface" },
        ],
      }),
      t({
        slug: "type-aliases",
        title: "Type Aliases",
        summary: "Type aliases name any type, including unions, intersections, and primitives.",
        estimatedMinutes: 14,
        difficulty: "beginner",
        keywords: ["type", "alias", "union", "intersection"],
        challengeWeight: 4,
        explanation:
          "type creates an alias for any type: type ID = string | number; type Point = { x: number; y: number };. Unlike interfaces, type aliases can represent unions, tuples, mapped types, and conditional types. Intersection types combine shapes: type Named = { name: string } & { age: number }. For object-only shapes, interface and type are often interchangeable; choose type when you need unions or computed properties.",
        a11yNotes: [],
        commonMistakes: [
          "Creating overly complex intersection chains that are hard to read",
          "Using type for everything when a simple interface is clearer",
          "Confusing intersection (&) with extends in interfaces",
        ],
        bestPractices: [
          "Use type for unions, primitives, and utility compositions",
          "Use interface for extensible object contracts",
          "Export type aliases for shared domain models",
        ],
        interviewQuestions: [
          "What can type aliases represent that interfaces cannot?",
          "What is an intersection type?",
          "When do you pick type over interface?",
        ],
        cheatSheet: [
          { tag: "type", desc: "Alias for any TypeScript type expression" },
          { tag: "A & B", desc: "Intersection combining both types" },
          { tag: "A | B", desc: "Union allowing either type" },
        ],
      }),
      t({
        slug: "optional-readonly",
        title: "Optional and Readonly Properties",
        summary: "Mark properties optional with ? and prevent reassignment with readonly.",
        estimatedMinutes: 12,
        difficulty: "beginner",
        keywords: ["optional", "readonly", "?", "immutable"],
        challengeWeight: 3,
        explanation:
          "Optional properties may be absent: interface Config { debug?: boolean; }. Readonly prevents reassignment after creation: interface User { readonly id: string; name: string; }. Readonly applies shallowly — nested objects can still mutate unless you use Readonly<T> deeply or immutable patterns. Required<T> and Partial<T> utility types flip optionality across an object type.",
        a11yNotes: [],
        commonMistakes: [
          "Assuming readonly makes nested objects deeply immutable",
          "Using optional when the value should be null | T for explicit absence",
          "Forgetting to handle undefined when reading optional properties",
        ],
        bestPractices: [
          "Use optional for truly omittable config fields",
          "Prefer readonly for identifiers and props that must not change",
          "Combine with strictNullChecks and explicit undefined checks",
        ],
        interviewQuestions: [
          "How do optional properties work in TypeScript?",
          "Does readonly apply recursively?",
          "What is the difference between ? and undefined in a union?",
        ],
        cheatSheet: [
          { tag: "prop?", desc: "Optional property that may be undefined" },
          { tag: "readonly", desc: "Property cannot be reassigned after init" },
          { tag: "Partial<T>", desc: "Make all properties of T optional" },
        ],
      }),
      t({
        slug: "index-signatures",
        title: "Index Signatures",
        summary: "Index signatures type objects with dynamic string or number keys.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["index", "signature", "Record", "dynamic"],
        challengeWeight: 4,
        explanation:
          "When keys are not known ahead of time, use an index signature: interface StringMap { [key: string]: string; }. TypeScript also supports number index signatures for arrays-like objects. Combine known keys with an index signature carefully — all explicit properties must match the index value type. Record<string, T> is a built-in alias for string-keyed objects with uniform values.",
        a11yNotes: [],
        commonMistakes: [
          "Using index signatures when a union of known keys is more precise",
          "Allowing any value type in index signatures and losing type safety",
          "Forgetting that explicit keys must be assignable to the index type",
        ],
        bestPractices: [
          "Prefer Record<K, V> for simple string-to-value maps",
          "Use mapped types for stricter key sets than plain string",
          "Document when dynamic keys are intentional vs a modeling smell",
        ],
        interviewQuestions: [
          "What is an index signature?",
          "How does Record<string, T> relate to index signatures?",
          "When should you avoid index signatures?",
        ],
        cheatSheet: [
          { tag: "[key: string]", desc: "String index signature on an object type" },
          { tag: "Record<K,V>", desc: "Object type with keys K and values V" },
          { tag: "keyof T", desc: "Union of keys of type T" },
        ],
      }),
    ],
  },
  {
    slug: "functions",
    title: "Functions",
    description: "Type function values, parameters, return types, and introductory overloads.",
    topics: [
      t({
        slug: "function-types",
        title: "Function Types",
        summary: "Describe function shapes with parameter and return type annotations.",
        estimatedMinutes: 14,
        difficulty: "beginner",
        keywords: ["function", "parameters", "return", "arrow"],
        challengeWeight: 4,
        explanation:
          "Annotate functions inline: function greet(name: string): string { return `Hi ${name}`; }. Arrow functions work the same: const add = (a: number, b: number): number => a + b. Function type expressions name callable shapes: type Handler = (event: Event) => void;. Rest parameters are typed as arrays: (...args: number[]) => number. Contextual typing lets TypeScript infer param types in callbacks when the expected type is known.",
        a11yNotes: [
          "Type event handlers so keyboard and focus events use the correct Event subtype.",
        ],
        commonMistakes: [
          "Omitting return types on exported functions and relying on widening inference",
          "Using Function or generic callable types instead of precise signatures",
          "Mismatching callback parameter count with the declared type",
        ],
        bestPractices: [
          "Export explicit return types on public API functions",
          "Use type aliases for reusable callback signatures",
          "Prefer arrow functions for inline callbacks in React components",
        ],
        interviewQuestions: [
          "How do you type a function in TypeScript?",
          "What is a function type expression?",
          "How does contextual typing help with callbacks?",
        ],
        cheatSheet: [
          { tag: "(a: T) => R", desc: "Function type with param T and return R" },
          { tag: "Parameters<T>", desc: "Extract parameter tuple from function type" },
          { tag: "ReturnType<T>", desc: "Extract return type from function type" },
        ],
      }),
      t({
        slug: "optional-default-params",
        title: "Optional and Default Parameters",
        summary: "Optional params use ? or defaults; defaults affect inferred optional status.",
        estimatedMinutes: 12,
        difficulty: "beginner",
        keywords: ["optional", "default", "parameters", "undefined"],
        challengeWeight: 3,
        explanation:
          "Optional parameters: function log(msg: string, level?: string). Callers may omit level; inside the function it is string | undefined. Default parameters: function greet(name: string, greeting = \"Hello\") assigns greeting when omitted. Defaults must come after required params. Optional and default params are not the same at runtime — defaults supply a value; optional leaves undefined unless a default is also provided.",
        a11yNotes: [],
        commonMistakes: [
          "Placing required parameters after optional ones",
          "Using default parameters with non-primitive literals without considering reference identity",
          "Assuming ? automatically assigns a default value",
        ],
        bestPractices: [
          "Use default parameters for sensible fallbacks",
          "Keep parameter lists short; use an options object for many optional fields",
          "Type options objects with interfaces for clarity",
        ],
        interviewQuestions: [
          "What is the difference between optional and default parameters?",
          "Can you have a required param after an optional one?",
          "How do you type an options object pattern?",
        ],
        cheatSheet: [
          { tag: "param?", desc: "Optional function parameter" },
          { tag: "param = value", desc: "Default parameter value when omitted" },
          { tag: "options object", desc: "Single arg with optional fields for many params" },
        ],
      }),
      t({
        slug: "void-and-returns",
        title: "void and Return Types",
        summary: "void means no useful return value; async functions return Promise types.",
        estimatedMinutes: 12,
        difficulty: "beginner",
        keywords: ["void", "return", "async", "Promise"],
        challengeWeight: 4,
        explanation:
          "void indicates a function returns nothing meaningful (undefined). Event handlers often return void. Returning a value from a void-typed function is allowed but the value is ignored by callers. Async functions always return Promise<T>: async function fetchUser(): Promise<User>. Generator and iterator return types use IteratorResult. Use explicit return types on exported functions to catch accidental return shape changes during refactors.",
        a11yNotes: [],
        commonMistakes: [
          "Confusing void with undefined as a return type in strict mode",
          "Forgetting Promise wrapper on async function return annotations",
          "Using void when the function actually returns a boolean for control flow",
        ],
        bestPractices: [
          "Annotate Promise return types on async API functions",
          "Use void for side-effect-only callbacks",
          "Let inference work locally; annotate at module boundaries",
        ],
        interviewQuestions: [
          "What does the void return type mean?",
          "How do you type an async function return value?",
          "Can a void function return undefined explicitly?",
        ],
        cheatSheet: [
          { tag: "void", desc: "No meaningful return value" },
          { tag: "Promise<T>", desc: "Async result resolving to T" },
          { tag: "async/await", desc: "Syntax for Promise-based async code" },
        ],
      }),
      t({
        slug: "overloads-intro",
        title: "Function Overloads Introduction",
        summary: "Overload signatures describe multiple call patterns for one implementation.",
        estimatedMinutes: 16,
        difficulty: "intermediate",
        keywords: ["overload", "signature", "implementation", "union"],
        challengeWeight: 5,
        explanation:
          "Overloads let one function name accept different argument combinations with different return types. Write overload signatures followed by one implementation: function parse(input: string): number; function parse(input: string[]): number[]; function parse(input: string | string[]) { ... }. Callers see the overload signatures; the implementation body must accept a superset. Prefer union types and conditional types for simple cases; use overloads when call patterns differ clearly.",
        a11yNotes: [],
        commonMistakes: [
          "Writing multiple implementations instead of one implementation signature",
          "Making overloads that differ only by return type without param differences",
          "Overusing overloads when generics or unions are simpler",
        ],
        bestPractices: [
          "Keep overload sets small and documented",
          "Ensure the implementation signature is compatible with all overloads",
          "Consider function overloads in declaration files for JS libraries",
        ],
        interviewQuestions: [
          "What are function overloads in TypeScript?",
          "How many implementation bodies does an overloaded function have?",
          "When are overloads better than union parameters?",
        ],
        cheatSheet: [
          { tag: "overload signature", desc: "Callable type variant visible to callers" },
          { tag: "implementation signature", desc: "Single function body handling all cases" },
          { tag: "call signature", desc: "Function member shape in an object type" },
        ],
      }),
    ],
  },
  {
    slug: "unions-and-narrowing",
    title: "Unions and Narrowing",
    description: "Combine types with unions and refine them with guards and discriminated unions.",
    topics: [
      t({
        slug: "union-types",
        title: "Union Types",
        summary: "A union type allows a value to be one of several types.",
        estimatedMinutes: 12,
        difficulty: "beginner",
        keywords: ["union", "or", "literal", "narrowing"],
        challengeWeight: 4,
        explanation:
          "Union types use the pipe: type ID = string | number; type Result = Success | Failure;. A value in a union can be any member; you must narrow before accessing type-specific properties. String literal unions model enums without runtime cost: type Theme = \"light\" | \"dark\". Union types are central to modeling API responses, form states, and nullable values: string | null.",
        a11yNotes: [],
        commonMistakes: [
          "Accessing properties not shared by all union members without narrowing",
          "Creating overly wide unions that do not encode valid states",
          "Using | any which collapses to any",
        ],
        bestPractices: [
          "Model finite states with string literal unions",
          "Use discriminant properties for tagged unions",
          "Prefer unions over optional everything on one bloated interface",
        ],
        interviewQuestions: [
          "What is a union type?",
          "Why must you narrow union types before use?",
          "How do literal unions differ from enums?",
        ],
        cheatSheet: [
          { tag: "A | B", desc: "Value may be type A or type B" },
          { tag: "literal union", desc: "Union of specific string or number literals" },
          { tag: "narrowing", desc: "Refine a union to a specific member type" },
        ],
      }),
      t({
        slug: "type-guards",
        title: "Type Guards",
        summary: "Type guards narrow types using typeof, instanceof, in, and custom predicates.",
        estimatedMinutes: 16,
        difficulty: "intermediate",
        keywords: ["guard", "typeof", "instanceof", "predicate"],
        challengeWeight: 5,
        explanation:
          "Type guards are expressions that narrow types in conditional blocks. typeof works for primitives: if (typeof x === \"string\"). instanceof checks class prototypes. The in operator checks property presence on objects. User-defined type guards use predicates: function isFish(pet: Fish | Bird): pet is Fish { return (pet as Fish).swim !== undefined; }. Control flow analysis applies narrowing after guards in if, else, switch, and early returns.",
        a11yNotes: [],
        commonMistakes: [
          "Using typeof null === \"object\" legacy quirk without null checks",
          "Writing incorrect type predicates that lie to the compiler",
          "Assuming narrowing persists after async gaps without re-checking",
        ],
        bestPractices: [
          "Use custom type guards for complex domain validation",
          "Combine guards with early returns for flat control flow",
          "Validate external data before asserting types",
        ],
        interviewQuestions: [
          "What is a type guard?",
          "How do user-defined type predicates work?",
          "Why does narrowing not persist across await boundaries?",
        ],
        cheatSheet: [
          { tag: "typeof", desc: "Primitive runtime type check" },
          { tag: "instanceof", desc: "Check object against a class constructor" },
          { tag: "x is T", desc: "Type predicate return annotation" },
        ],
      }),
      t({
        slug: "narrowing-with-typeof-in",
        title: "Narrowing with typeof and in",
        summary: "Refine unions using typeof for primitives and in for object properties.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["typeof", "in", "narrow", "discriminant"],
        challengeWeight: 4,
        explanation:
          "typeof narrows primitives: string, number, boolean, bigint, symbol, undefined, function, object. Remember typeof null is \"object\" — add an explicit null check. The in operator narrows object unions: if (\"swim\" in pet) treats pet as Fish in that block. Pair in checks with discriminant fields for clarity. Switch on a discriminant property for exhaustive handling of union variants.",
        a11yNotes: [],
        commonMistakes: [
          "Using typeof on arrays expecting \"array\" — it returns \"object\"",
          "Checking in on null or undefined without prior guards",
          "Assuming in proves more than property existence",
        ],
        bestPractices: [
          "Use Array.isArray for array narrowing",
          "Prefer discriminant switches over long if/else chains",
          "Document expected discriminant field names in union types",
        ],
        interviewQuestions: [
          "What types does typeof recognize?",
          "How does the in operator narrow object unions?",
          "Why is typeof null a known JavaScript quirk?",
        ],
        cheatSheet: [
          { tag: "in operator", desc: "Check if property exists on an object" },
          { tag: "Array.isArray()", desc: "Reliable array narrowing at runtime" },
          { tag: "switch (x.kind)", desc: "Discriminant-based union narrowing" },
        ],
      }),
      t({
        slug: "discriminated-unions",
        title: "Discriminated Unions",
        summary: "Tagged unions use a shared literal field to enable exhaustive narrowing.",
        estimatedMinutes: 16,
        difficulty: "intermediate",
        keywords: ["discriminated", "tagged", "exhaustive", "switch"],
        challengeWeight: 5,
        explanation:
          "Discriminated unions share a literal discriminant: type Shape = { kind: \"circle\"; radius: number } | { kind: \"square\"; size: number };. Switch on kind and TypeScript narrows each branch. Exhaustiveness checking: assign to never in default to catch unhandled cases. API results often use { status: \"success\"; data: T } | { status: \"error\"; message: string }.",
        a11yNotes: [],
        commonMistakes: [
          "Using a non-literal discriminant type and losing narrowing",
          "Forgetting the default never check when adding new variants",
          "Mixing variants without a consistent discriminant field name",
        ],
        bestPractices: [
          "Use a consistent discriminant key like kind, type, or status",
          "Handle all cases in switch or use satisfies with exhaustive helpers",
          "Model loading/error/success UI states as discriminated unions",
        ],
        interviewQuestions: [
          "What is a discriminated union?",
          "How do you get exhaustive checking on a switch?",
          "Why use literal types for discriminants?",
        ],
        cheatSheet: [
          { tag: "discriminant", desc: "Shared literal field tagging union members" },
          { tag: "exhaustive check", desc: "Assign unhandled case to never in default" },
          { tag: "tagged union", desc: "Discriminated union pattern alias" },
        ],
      }),
    ],
  },
  {
    slug: "generics",
    title: "Generics",
    description: "Write reusable types and functions with type parameters and built-in utility types.",
    topics: [
      t({
        slug: "generics-basics",
        title: "Generics Basics",
        summary: "Generics let functions and types work with many types while preserving relationships.",
        estimatedMinutes: 16,
        difficulty: "intermediate",
        keywords: ["generics", "type parameter", "T", "reuse"],
        challengeWeight: 5,
        explanation:
          "Generic functions declare type parameters: function identity<T>(value: T): T { return value; }. Generic interfaces describe reusable containers: interface Box<T> { value: T; }. TypeScript infers T from arguments when possible; otherwise pass explicitly: identity<number>(1). Generics preserve type information through transformations — unlike any, they keep input and output types linked.",
        a11yNotes: [],
        commonMistakes: [
          "Using any instead of a generic type parameter and losing inference",
          "Over-constraining generics when a simple union would work",
          "Naming all type parameters T instead of meaningful names like TItem",
        ],
        bestPractices: [
          "Use generics for reusable utilities: map, filter, fetchJson<T>",
          "Let inference work before adding explicit type arguments",
          "Name type parameters clearly in public APIs",
        ],
        interviewQuestions: [
          "Why use generics instead of any?",
          "How does TypeScript infer generic type parameters?",
          "Give an example of a generic interface.",
        ],
        cheatSheet: [
          { tag: "<T>", desc: "Generic type parameter declaration" },
          { tag: "identity<T>", desc: "Simple generic function preserving type" },
          { tag: "Box<T>", desc: "Generic interface wrapping a value" },
        ],
      }),
      t({
        slug: "generic-constraints",
        title: "Generic Constraints",
        summary: "Constrain type parameters with extends to require certain shapes or keys.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["constraint", "extends", "keyof", "bound"],
        challengeWeight: 4,
        explanation:
          "Constraints limit what types can be passed: function logLength<T extends { length: number }>(item: T). keyof constrains to property names of a type: function getProp<T, K extends keyof T>(obj: T, key: K): T[K]. Multiple constraints use intersection: T extends A & B. Constraints let you access properties safely inside generic bodies.",
        a11yNotes: [],
        commonMistakes: [
          "Constraining too narrowly and blocking valid use cases",
          "Using extends object when a specific interface constraint is needed",
          "Forgetting that keyof also includes string | number | symbol keys",
        ],
        bestPractices: [
          "Add constraints only when the function body needs them",
          "Use keyof T for type-safe property access helpers",
          "Prefer extends unknown over extends any for generic bounds",
        ],
        interviewQuestions: [
          "How do generic constraints work?",
          "What does K extends keyof T mean?",
          "When should you add a constraint to a type parameter?",
        ],
        cheatSheet: [
          { tag: "T extends U", desc: "Constraint requiring T assignable to U" },
          { tag: "keyof T", desc: "Union of keys of object type T" },
          { tag: "T[K]", desc: "Indexed access type for property K of T" },
        ],
      }),
      t({
        slug: "utility-types-partial-pick",
        title: "Partial and Pick Utility Types",
        summary: "Built-in utilities transform object types for updates and selections.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["Partial", "Pick", "utility", "mapped"],
        challengeWeight: 4,
        explanation:
          "Partial<T> makes every property optional — useful for update payloads. Pick<T, K> selects a subset of keys: Pick<User, \"id\" | \"name\">. Omit<T, K> removes keys. Required<T> and Readonly<T> flip modifiers. These utilities are implemented as mapped types under the hood. Combine them: Partial<Pick<User, \"name\" | \"email\">> for partial updates of specific fields.",
        a11yNotes: [],
        commonMistakes: [
          "Using Partial when Required fields must stay required in updates",
          "Picking keys that do not exist on T and getting never properties",
          "Reimplementing Pick/Omit manually instead of using built-ins",
        ],
        bestPractices: [
          "Use Partial for PATCH-style API update types",
          "Use Pick for public-facing DTOs with subset fields",
          "Compose utility types rather than duplicating interfaces",
        ],
        interviewQuestions: [
          "What does Partial<T> do?",
          "How is Pick different from Omit?",
          "How are utility types implemented?",
        ],
        cheatSheet: [
          { tag: "Partial<T>", desc: "All properties of T become optional" },
          { tag: "Pick<T,K>", desc: "New type with only selected keys K from T" },
          { tag: "Required<T>", desc: "All properties of T become required" },
        ],
      }),
      t({
        slug: "record-and-omit",
        title: "Record and Omit",
        summary: "Record builds key-value maps; Omit removes keys from object types.",
        estimatedMinutes: 12,
        difficulty: "intermediate",
        keywords: ["Record", "Omit", "map", "dictionary"],
        challengeWeight: 4,
        explanation:
          "Record<Keys, Type> creates an object type with keys Keys and uniform values Type: Record<\"a\" | \"b\", number>. Use Record<string, T> for dictionaries with string keys. Omit<T, K> excludes keys: Omit<User, \"password\"> for safe public user types. Exclude and Extract work on union types and pair with Omit/Pick for advanced type algebra.",
        a11yNotes: [],
        commonMistakes: [
          "Using Record<string, any> instead of a specific value type",
          "Omitting keys that are not on T without noticing silent no-ops",
          "Confusing Record with Map at runtime — Record is a type-only pattern",
        ],
        bestPractices: [
          "Type dictionary objects as Record<string, T> or specific key unions",
          "Omit sensitive fields before exposing types to clients",
          "Use satisfies with Record for literal objects that must match a map shape",
        ],
        interviewQuestions: [
          "What is Record<K, V> used for?",
          "How does Omit differ from Pick?",
          "When would you use Record over an index signature?",
        ],
        cheatSheet: [
          { tag: "Record<K,V>", desc: "Object type mapping keys K to values V" },
          { tag: "Omit<T,K>", desc: "Type T without properties K" },
          { tag: "Exclude<U,T>", desc: "Remove T from union U" },
        ],
      }),
    ],
  },
  {
    slug: "classes-and-oop",
    title: "Classes and OOP",
    description: "TypeScript classes, access control, inheritance, and abstract classes.",
    topics: [
      t({
        slug: "classes-basics",
        title: "Classes Basics",
        summary: "Classes define constructors, properties, and methods with typed members.",
        estimatedMinutes: 14,
        difficulty: "beginner",
        keywords: ["class", "constructor", "method", "property"],
        challengeWeight: 4,
        explanation:
          "TypeScript classes add type annotations to JavaScript classes: class User { name: string; constructor(name: string) { this.name = name; } greet(): string { return this.name; } }. Parameter properties shorten constructors: constructor(public name: string) {}. Fields can have initializers. Classes support getters, setters, and static members with types. Use classes when modeling entities with behavior; prefer functions and objects for simple data.",
        a11yNotes: [],
        commonMistakes: [
          "Forgetting to initialize definite assignment assertion fields (!) under strictPropertyInitialization",
          "Using classes where plain objects and types suffice",
          "Mutating this in methods without binding in callbacks passed externally",
        ],
        bestPractices: [
          "Enable strictPropertyInitialization in strict projects",
          "Prefer composition over deep inheritance trees",
          "Use readonly for immutable identity fields on classes",
        ],
        interviewQuestions: [
          "How do TypeScript classes differ from JavaScript classes?",
          "What are parameter properties?",
          "What is strictPropertyInitialization?",
        ],
        cheatSheet: [
          { tag: "class", desc: "Blueprint for objects with typed members" },
          { tag: "constructor", desc: "Initialize instance state" },
          { tag: "public name", desc: "Parameter property shorthand in constructor" },
        ],
      }),
      t({
        slug: "access-modifiers",
        title: "Access Modifiers",
        summary: "public, private, and protected control visibility of class members.",
        estimatedMinutes: 12,
        difficulty: "intermediate",
        keywords: ["public", "private", "protected", "visibility"],
        challengeWeight: 3,
        explanation:
          "public members are accessible everywhere (default). private members are only usable inside the declaring class — enforced at compile time, not true runtime privacy. protected members are visible in subclasses. ECMAScript private fields use #field syntax for runtime privacy. Use modifiers to express intent and prevent accidental external access to internals.",
        a11yNotes: [],
        commonMistakes: [
          "Assuming private is enforced at runtime in TypeScript",
          "Overusing protected when composition with private is clearer",
          "Accessing private members via bracket notation to bypass checks",
        ],
        bestPractices: [
          "Default to private for internals, public for API surface",
          "Use #private fields when true encapsulation matters",
          "Keep public methods minimal and stable",
        ],
        interviewQuestions: [
          "What is the difference between private and protected?",
          "Is TypeScript private enforced at runtime?",
          "What are ECMAScript private fields?",
        ],
        cheatSheet: [
          { tag: "public", desc: "Accessible from anywhere" },
          { tag: "private", desc: "Accessible only within declaring class" },
          { tag: "protected", desc: "Accessible in class and subclasses" },
        ],
      }),
      t({
        slug: "implements-and-extends",
        title: "implements and extends",
        summary: "Classes extend other classes and implement interface contracts.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["extends", "implements", "inheritance", "interface"],
        challengeWeight: 4,
        explanation:
          "extends inherits from a base class: class Admin extends User { role = \"admin\"; }. Call super() in constructors before using this. implements satisfies an interface without inheriting implementation: class ApiClient implements Fetchable { fetch() { ... } }. A class can implement multiple interfaces. Override methods with the override keyword in strict settings to catch base class signature changes.",
        a11yNotes: [],
        commonMistakes: [
          "Forgetting super() in subclass constructors",
          "Implementing an interface but missing required properties",
          "Deep inheritance hierarchies that are hard to refactor",
        ],
        bestPractices: [
          "Program to interfaces with implements for swappable implementations",
          "Use extends sparingly; favor composition",
          "Mark intentional overrides with the override keyword",
        ],
        interviewQuestions: [
          "What is the difference between extends and implements?",
          "Why must super() be called in constructors?",
          "Can a class implement multiple interfaces?",
        ],
        cheatSheet: [
          { tag: "extends", desc: "Inherit from a base class" },
          { tag: "implements", desc: "Satisfy an interface contract" },
          { tag: "override", desc: "Mark method overriding a base member" },
        ],
      }),
      t({
        slug: "abstract-classes-intro",
        title: "Abstract Classes Introduction",
        summary: "Abstract classes define shared behavior but cannot be instantiated directly.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["abstract", "base", "polymorphism", "method"],
        challengeWeight: 4,
        explanation:
          "abstract class Shape { abstract area(): number; move(): void { /* shared */ } }. Subclasses must implement abstract methods. Abstract classes sit between interfaces (contract only) and concrete classes (full implementation). Use them when base classes share code but should not be instantiated. Prefer interfaces for pure contracts in modern TypeScript unless shared implementation is required.",
        a11yNotes: [],
        commonMistakes: [
          "Instantiating an abstract class directly",
          "Using abstract classes when a simple interface plus functions works",
          "Leaving abstract methods unimplemented in subclasses without errors",
        ],
        bestPractices: [
          "Use abstract classes for template-method patterns with shared code",
          "Combine abstract base with interfaces for flexible APIs",
          "Document which methods subclasses must override",
        ],
        interviewQuestions: [
          "What is an abstract class?",
          "How do abstract classes differ from interfaces?",
          "Can abstract classes have concrete methods?",
        ],
        cheatSheet: [
          { tag: "abstract class", desc: "Base class that cannot be instantiated" },
          { tag: "abstract method", desc: "Method subclasses must implement" },
          { tag: "concrete method", desc: "Implemented method inherited by subclasses" },
        ],
      }),
    ],
  },
  {
    slug: "modules",
    title: "Modules",
    description: "ES modules in TypeScript, type-only imports, and declaration files.",
    topics: [
      t({
        slug: "es-modules-ts",
        title: "ES Modules in TypeScript",
        summary: "Use import and export with typed modules and moduleResolution settings.",
        estimatedMinutes: 14,
        difficulty: "beginner",
        keywords: ["import", "export", "module", "esm"],
        challengeWeight: 4,
        explanation:
          "TypeScript supports ES modules: export function helper() {} and import { helper } from \"./helper\". Default exports: export default class App. Re-export: export { foo } from \"./foo\". Set module to ESNext or ES2020 and moduleResolution to bundler or node16/nodeNext for modern resolution. .js extensions in import paths may be required under Node16 module resolution even when source files are .ts.",
        a11yNotes: [],
        commonMistakes: [
          "Mixing CommonJS require with ESM import in the same file",
          "Wrong moduleResolution for your runtime or bundler",
          "Circular imports causing undefined bindings at runtime",
        ],
        bestPractices: [
          "Prefer named exports for better refactoring and tree-shaking clarity",
          "Align tsconfig module settings with Vite or Next.js docs",
          "Keep modules focused with a clear public export surface",
        ],
        interviewQuestions: [
          "How do imports and exports work in TypeScript?",
          "What is moduleResolution?",
          "When are .js extensions required in import paths?",
        ],
        cheatSheet: [
          { tag: "export", desc: "Expose bindings from a module" },
          { tag: "import { x }", desc: "Named import from a module" },
          { tag: "moduleResolution", desc: "How TS resolves import paths" },
        ],
      }),
      t({
        slug: "import-type",
        title: "import type",
        summary: "Type-only imports are erased at compile time and avoid runtime import cycles.",
        estimatedMinutes: 12,
        difficulty: "intermediate",
        keywords: ["import type", "type-only", "erased", "isolatedModules"],
        challengeWeight: 3,
        explanation:
          "import type { User } from \"./types\" imports only types — emitted JavaScript removes the import. Use when you need a type reference but no runtime value. import { type User, fetchUser } mixes type and value imports. verbatimModuleSyntax and isolatedModules require explicit type imports in many setups. Type-only imports help bundlers drop unused imports and prevent circular dependency issues.",
        a11yNotes: [],
        commonMistakes: [
          "Importing a type as a value and getting runtime undefined",
          "Using import type for enums or classes needed at runtime",
          "Forgetting type modifier when bundler strips type-only imports incorrectly",
        ],
        bestPractices: [
          "Use import type for interfaces and type aliases",
          "Enable isolatedModules in bundler-backed projects",
          "Separate types.ts files for shared type-only modules",
        ],
        interviewQuestions: [
          "What does import type do?",
          "Why use type-only imports?",
          "What is isolatedModules?",
        ],
        cheatSheet: [
          { tag: "import type", desc: "Import types without runtime require" },
          { tag: "export type", desc: "Export type-only bindings" },
          { tag: "isolatedModules", desc: "Each file must transpile in isolation" },
        ],
      }),
      t({
        slug: "declaration-files-intro",
        title: "Declaration Files Introduction",
        summary: ".d.ts files describe types for JavaScript libraries without TypeScript source.",
        estimatedMinutes: 16,
        difficulty: "intermediate",
        keywords: ["declaration", "d.ts", "ambient", "DefinitelyTyped"],
        challengeWeight: 4,
        explanation:
          "Declaration files (.d.ts) provide types for JS code. declare module \"lodash\" { export function debounce(...): ... }. Ambient declarations describe global variables: declare const API_URL: string. @types packages on npm ship community typings (e.g. @types/react). declaration: true in tsconfig emits .d.ts for your library. allowJs and checkJs type-check JavaScript files using JSDoc.",
        a11yNotes: [],
        commonMistakes: [
          "Writing any in declaration files and losing all safety",
          "Installing wrong @types version mismatched with library version",
          "Editing files inside node_modules/@types instead of overriding locally",
        ],
        bestPractices: [
          "Install @types packages matching your dependency versions",
          "Create local .d.ts shims for untyped small libraries",
          "Publish declaration files when shipping a typed library",
        ],
        interviewQuestions: [
          "What is a .d.ts file?",
          "Where do DefinitelyTyped packages come from?",
          "What does declaration: true emit?",
        ],
        cheatSheet: [
          { tag: ".d.ts", desc: "Type declaration file without implementation" },
          { tag: "declare module", desc: "Ambient module type definition" },
          { tag: "@types/pkg", desc: "Community typings for a JS package" },
        ],
      }),
    ],
  },
  {
    slug: "dom-and-frontend",
    title: "DOM and Frontend",
    description: "Type browser events, React props, and strict null checking in UI code.",
    topics: [
      t({
        slug: "typing-dom-events",
        title: "Typing DOM Events",
        summary: "Use Event, MouseEvent, KeyboardEvent, and typed handlers in the DOM and React.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["dom", "events", "MouseEvent", "handler"],
        challengeWeight: 4,
        explanation:
          "DOM APIs are typed in lib.dom.d.ts. Handlers receive specific events: (e: MouseEvent) => void for click, (e: KeyboardEvent) => void for keydown. Use EventTarget and currentTarget narrowing. In React, import types from React: React.ChangeEvent<HTMLInputElement> for controlled inputs. Cast event targets carefully: (e.target as HTMLInputElement).value after verifying tagName.",
        a11yNotes: [
          "Type keyboard handlers to support Enter and Space for custom interactive elements.",
          "Ensure focus events are typed for accessible focus management.",
        ],
        commonMistakes: [
          "Using Event when a specific subtype is required",
          "Assuming e.target is HTMLInputElement without narrowing",
          "Mixing DOM types with React synthetic event types incorrectly",
        ],
        bestPractices: [
          "Use the narrowest event type for each handler",
          "In React, use React.*Event types from the react package",
          "Extract handler types as named types for reusable components",
        ],
        interviewQuestions: [
          "How do you type a click handler in TypeScript?",
          "What is the difference between DOM and React event types?",
          "How do you safely access input value from an event?",
        ],
        cheatSheet: [
          { tag: "MouseEvent", desc: "Mouse interaction event type" },
          { tag: "KeyboardEvent", desc: "Keyboard interaction event type" },
          { tag: "ChangeEvent<T>", desc: "React change event for element T" },
        ],
      }),
      t({
        slug: "react-props-with-ts-intro",
        title: "React Props with TypeScript Intro",
        summary: "Type React components with props interfaces, children, and optional defaults.",
        estimatedMinutes: 16,
        difficulty: "intermediate",
        keywords: ["react", "props", "jsx", "component"],
        challengeWeight: 5,
        explanation:
          "Define props with an interface: interface ButtonProps { label: string; onClick: () => void; disabled?: boolean; }. Function components: function Button({ label, onClick }: ButtonProps) { return <button onClick={onClick}>{label}</button>; }. children: React.ReactNode for slot content. Extend HTML attributes: interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> { variant: \"primary\"; }. Use ComponentPropsWithoutRef or ComponentProps for wrapper components.",
        a11yNotes: [
          "Include aria-* props in extended HTML attribute types for accessible components.",
          "Type children explicitly when components must not accept arbitrary nodes.",
        ],
        commonMistakes: [
          "Using React.FC and accidentally requiring children when not needed",
          "Forgetting to type event handler props and losing parameter inference",
          "Duplicating native button props instead of extending HTML attributes",
        ],
        bestPractices: [
          "Export props interfaces for reusable components",
          "Extend intrinsic element props for design-system wrappers",
          "Use default parameter values or defaultProps patterns with optional props",
        ],
        interviewQuestions: [
          "How do you type React component props?",
          "What is React.ReactNode?",
          "How do you extend native button props in a custom Button?",
        ],
        cheatSheet: [
          { tag: "React.ReactNode", desc: "Render-able React child content" },
          { tag: "ButtonHTMLAttributes", desc: "Native button attribute props" },
          { tag: "ComponentPropsWithoutRef", desc: "Extract props from a component type" },
        ],
      }),
      t({
        slug: "strict-null-checks",
        title: "Strict Null Checks",
        summary: "strictNullChecks catches null and undefined misuse at compile time.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["null", "undefined", "strict", "optional chaining"],
        challengeWeight: 5,
        explanation:
          "With strictNullChecks, null and undefined are not assignable to other types unless explicitly allowed: string | null. Optional chaining ?. and nullish coalescing ?? handle absent values: user?.name ?? \"Guest\". Non-null assertion ! tells the compiler a value is defined — use sparingly. Enable strictNullChecks early in new projects to avoid a painful migration later.",
        a11yNotes: [
          "Guard against null refs before focusing DOM elements for keyboard users.",
        ],
        commonMistakes: [
          "Overusing ! non-null assertion instead of proper checks",
          "Ignoring strictNullChecks errors with any casts",
          "Forgetting that array find can return undefined",
        ],
        bestPractices: [
          "Model nullable fields explicitly in types",
          "Use optional chaining and nullish coalescing over nested if checks",
          "Narrow with if (value != null) before accessing properties",
        ],
        interviewQuestions: [
          "What does strictNullChecks enforce?",
          "What is the difference between ?? and ||?",
          "When is non-null assertion appropriate?",
        ],
        cheatSheet: [
          { tag: "strictNullChecks", desc: "Treat null and undefined as distinct types" },
          { tag: "?.", desc: "Optional chaining for safe property access" },
          { tag: "??", desc: "Nullish coalescing default for null/undefined" },
        ],
      }),
    ],
  },
  {
    slug: "tooling",
    title: "Tooling",
    description: "Strict compiler flags, path aliases, and migrating JavaScript projects to TypeScript.",
    topics: [
      t({
        slug: "strict-mode-flags",
        title: "Strict Mode Flags",
        summary: "strict and related flags tighten checking for safer TypeScript codebases.",
        estimatedMinutes: 16,
        difficulty: "intermediate",
        keywords: ["strict", "noImplicitAny", "strictNullChecks", "flags"],
        challengeWeight: 4,
        explanation:
          "strict enables a family of checks: strictNullChecks, strictFunctionTypes, strictBindCallApply, strictPropertyInitialization, noImplicitAny, noImplicitThis, alwaysStrict, useUnknownInCatchVariables. noUnusedLocals and noUnusedParameters catch dead code. exactOptionalPropertyTypes distinguishes missing vs explicitly undefined properties. Enable strict on new projects; migrate legacy code incrementally with per-file suppressions only as temporary measures.",
        a11yNotes: [],
        commonMistakes: [
          "Disabling strict globally instead of fixing root type issues",
          "Using @ts-ignore broadly instead of addressing errors",
          "Enabling all flags at once on a large JS codebase without a plan",
        ],
        bestPractices: [
          "Turn on strict for all new TypeScript projects",
          "Fix noImplicitAny before loosening other flags",
          "Track strict migration progress with a typed coverage metric",
        ],
        interviewQuestions: [
          "What does the strict flag enable?",
          "What is noImplicitAny?",
          "How would you migrate a JS codebase to strict TypeScript?",
        ],
        cheatSheet: [
          { tag: "strict", desc: "Enable recommended strict type-check options" },
          { tag: "noImplicitAny", desc: "Error on expressions with implicit any" },
          { tag: "noUnusedLocals", desc: "Report unused local variables" },
        ],
      }),
      t({
        slug: "path-aliases",
        title: "Path Aliases",
        summary: "Map import paths like @/components to folders using paths in tsconfig.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["paths", "alias", "baseUrl", "imports"],
        challengeWeight: 3,
        explanation:
          "Configure paths and baseUrl in tsconfig: \"baseUrl\": \".\", \"paths\": { \"@/*\": [\"src/*\"] }. Import with import { Button } from \"@/components/Button\". Bundlers (Vite, webpack) need matching alias config. paths affects type resolution only unless the bundler mirrors it. Use aliases to avoid deep relative paths like ../../../utils.",
        a11yNotes: [],
        commonMistakes: [
          "Setting paths in tsconfig without configuring Vite resolve.alias",
          "Using overly broad aliases that hide module boundaries",
          "Breaking imports when moving files because aliases mask structure",
        ],
        bestPractices: [
          "Mirror tsconfig paths in vite.config.ts or next.config.js",
          "Use @/ for src root consistently across the team",
          "Prefer aliases for shared folders, not for every local import",
        ],
        interviewQuestions: [
          "How do TypeScript path aliases work?",
          "Why must bundlers also configure aliases?",
          "What is baseUrl in tsconfig?",
        ],
        cheatSheet: [
          { tag: "paths", desc: "Map import specifiers to filesystem locations" },
          { tag: "baseUrl", desc: "Root for resolving non-relative module names" },
          { tag: "@/*", desc: "Common alias pattern mapping to src" },
        ],
      }),
      t({
        slug: "migrating-js-to-ts",
        title: "Migrating JavaScript to TypeScript",
        summary: "Rename files gradually, use allowJs, and tighten types over time.",
        estimatedMinutes: 18,
        difficulty: "intermediate",
        keywords: ["migration", "allowJs", "gradual", "rename"],
        challengeWeight: 5,
        explanation:
          "Start with allowJs: true and checkJs: false. Rename .js to .ts incrementally, starting at leaf modules with no dependents. Add types for exports first; infer locals. Use JSDoc @param and @returns in remaining JS for partial typing. Introduce @types dependencies. Enable strict flags one at a time. Avoid big-bang rewrites — migrate by feature folder. Use unknown and validation at system boundaries during transition.",
        a11yNotes: [],
        commonMistakes: [
          "Renaming all files to .ts at once and drowning in errors",
          "Using any as a permanent migration strategy",
          "Skipping tsconfig and relying only on bundler transpilation",
        ],
        bestPractices: [
          "Migrate bottom-up: utilities before app entry points",
          "Add a CI typecheck step early even with allowJs",
          "Replace any with proper types as you touch each module",
        ],
        interviewQuestions: [
          "What is a practical strategy for JS to TS migration?",
          "What does allowJs do?",
          "How can JSDoc help during migration?",
        ],
        cheatSheet: [
          { tag: "allowJs", desc: "Include JavaScript files in the project" },
          { tag: "checkJs", desc: "Type-check JavaScript files with JSDoc types" },
          { tag: "gradual typing", desc: "Incrementally add types without stopping delivery" },
        ],
      }),
    ],
  },
  {
    slug: "best-practices",
    title: "Best Practices",
    description: "Idiomatic TypeScript habits for safer, readable type-driven code.",
    topics: [
      t({
        slug: "prefer-unknown-over-any",
        title: "Prefer unknown Over any",
        summary: "Use unknown for untrusted values and narrow before use instead of any.",
        estimatedMinutes: 12,
        difficulty: "intermediate",
        keywords: ["unknown", "any", "safety", "narrowing"],
        challengeWeight: 4,
        explanation:
          "any disables checking and hides errors across your codebase. unknown forces you to validate or narrow: function parseJson(text: string): unknown { return JSON.parse(text); }. After typeof, Array.isArray, or a schema validator, assign to a concrete type. useUnknownInCatchVariables makes catch clauses unknown by default. Reach for any only in isolated legacy shims with a TODO to remove.",
        a11yNotes: [],
        commonMistakes: [
          "Casting unknown to a type without runtime validation",
          "Using any on API responses and propagating unsafe assumptions",
          "Disabling eslint rules instead of fixing any usage",
        ],
        bestPractices: [
          "Validate external JSON with zod or similar before typing",
          "Write type guard functions for repeated unknown narrowing",
          "Track any usage and reduce it over time in code review",
        ],
        interviewQuestions: [
          "Why prefer unknown over any?",
          "How do you use a value typed as unknown?",
          "What does useUnknownInCatchVariables change?",
        ],
        cheatSheet: [
          { tag: "unknown", desc: "Safe top type requiring narrowing" },
          { tag: "JSON.parse", desc: "Returns any/unknown depending on config" },
          { tag: "type assertion", desc: "Tell compiler a type without runtime check" },
        ],
      }),
      t({
        slug: "narrow-early",
        title: "Narrow Early",
        summary: "Validate and narrow types at boundaries so inner code stays simple.",
        estimatedMinutes: 12,
        difficulty: "intermediate",
        keywords: ["narrowing", "guard", "boundaries", "validation"],
        challengeWeight: 4,
        explanation:
          "Push type checks to system boundaries: parse HTTP input once, then work with typed data inside. Early returns with guards flatten logic: if (!user) return; /* user is defined below */. Avoid repeated optional chaining deep in business logic when a single guard at the top suffices. Discriminated unions plus switch at the entry point keep handlers type-safe without repeated casts.",
        a11yNotes: [],
        commonMistakes: [
          "Sprinkling as casts throughout instead of one boundary validation",
          "Narrowing once and assuming it holds after await without re-check",
          "Deep optional chaining chains that obscure invalid states",
        ],
        bestPractices: [
          "Validate API payloads at the fetch layer",
          "Use assertion functions for reusable entry checks",
          "Model invalid states as unrepresentable with discriminated unions",
        ],
        interviewQuestions: [
          "What does narrow early mean in TypeScript?",
          "Where should runtime validation happen?",
          "How do assertion functions help?",
        ],
        cheatSheet: [
          { tag: "asserts x is T", desc: "Assertion function narrowing param" },
          { tag: "early return", desc: "Exit early after guard checks" },
          { tag: "boundary validation", desc: "Validate untyped data at entry points" },
        ],
      }),
      t({
        slug: "readable-type-names",
        title: "Readable Type Names",
        summary: "Name types for domain meaning, avoid clever abbreviations, and compose utilities.",
        estimatedMinutes: 12,
        difficulty: "beginner",
        keywords: ["naming", "readability", "domain", "aliases"],
        challengeWeight: 3,
        explanation:
          "Good type names read like product language: UserProfile, CheckoutPayload, ApiErrorResponse. Avoid cryptic T1, T2 in exported APIs. Extract complex unions and intersections into named aliases. Use Pick and Omit at the definition site but export a meaningful name: type PublicUser = Omit<User, \"passwordHash\">. JSDoc comments on exported types help IDEs show intent. Prefer satisfies to preserve literal types while checking against a wider type.",
        a11yNotes: [],
        commonMistakes: [
          "Exporting raw utility type expressions without a domain name",
          "Over-abbreviating type parameters in public libraries",
          "Duplicating the same inline object type in dozens of places",
        ],
        bestPractices: [
          "Co-locate domain types in types.ts or domain modules",
          "Use PascalCase for types and interfaces consistently",
          "Document non-obvious fields with JSDoc on interfaces",
        ],
        interviewQuestions: [
          "How do you keep TypeScript types readable in large projects?",
          "What is the satisfies operator used for?",
          "When should you extract a type alias?",
        ],
        cheatSheet: [
          { tag: "satisfies", desc: "Check value against type without widening literals" },
          { tag: "type alias", desc: "Named reusable type definition" },
          { tag: "JSDoc @typedef", desc: "Document types for JS and TS consumers" },
        ],
      }),
    ],
  },
  {
    slug: "mini-projects",
    title: "Mini Projects",
    description: "Apply TypeScript to small frontend projects: a typed todo app and form validation.",
    topics: [
      t({
        slug: "project-typed-todo",
        title: "Project: Typed Todo App",
        summary: "Build a todo list with typed state, discriminated actions, and immutable updates.",
        estimatedMinutes: 45,
        difficulty: "intermediate",
        keywords: ["project", "todo", "state", "discriminated"],
        challengeWeight: 5,
        explanation:
          "Model todos as interface Todo { id: string; text: string; done: boolean; }. Use a discriminated union for actions: type TodoAction = { type: \"add\"; text: string } | { type: \"toggle\"; id: string } | { type: \"remove\"; id: string };. Write a reducer function (state: Todo[], action: TodoAction): Todo[] with exhaustive switch. Type DOM or React event handlers. Filter derived lists with typed predicates instead of storing duplicate state. This project reinforces unions, immutability, and typed UI events.",
        a11yNotes: [
          "Type checkbox change handlers and ensure list items use semantic ul/li structure.",
          "Include aria-label on remove buttons for screen reader context.",
        ],
        commonMistakes: [
          "Storing filter state redundantly instead of deriving typed filtered lists",
          "Using string action types without a discriminated union",
          "Mutating todo arrays in place inside a typed reducer",
        ],
        bestPractices: [
          "Use crypto.randomUUID() for stable string ids",
          "Keep reducer pure and total with exhaustive never checks",
          "Export Todo and TodoAction types for component props",
        ],
        interviewQuestions: [
          "How would you type state and actions for a todo app?",
          "Why use a discriminated union for reducer actions?",
          "How do you type immutable array updates in TypeScript?",
        ],
        cheatSheet: [
          { tag: "Todo[]", desc: "Array of todo item objects" },
          { tag: "TodoAction", desc: "Discriminated union of reducer actions" },
          { tag: "Readonly<Todo[]>", desc: "Immutable todo list type for props" },
        ],
      }),
      t({
        slug: "project-typed-form",
        title: "Project: Typed Form Validation",
        summary: "Create a form with typed fields, validation errors, and controlled input handlers.",
        estimatedMinutes: 50,
        difficulty: "intermediate",
        keywords: ["project", "form", "validation", "controlled"],
        challengeWeight: 5,
        explanation:
          "Define FormValues { email: string; password: string; age: number; } and FormErrors as Partial<Record<keyof FormValues, string>>. Handlers: handleChange<K extends keyof FormValues>(field: K, value: FormValues[K]). Validate on submit and store errors in typed state. Use React.ChangeEvent<HTMLInputElement> or generic change handlers. Narrow validated output to a SubmitPayload type after checks pass. Optional: integrate zod schema with z.infer<typeof schema> for single source of truth.",
        a11yNotes: [
          "Associate validation errors with inputs using aria-describedby and aria-invalid.",
          "Type focus and blur handlers for accessible error announcement patterns.",
        ],
        commonMistakes: [
          "Typing all field values as string when age should be number",
          "Loosely typing errors as Record<string, string> losing field keys",
          "Casting form values to any on submit instead of validating",
        ],
        bestPractices: [
          "Use keyof FormValues to keep field names type-safe",
          "Separate raw string input from parsed numeric fields",
          "Return typed validation results: { ok: true; data: T } | { ok: false; errors: FormErrors }",
        ],
        interviewQuestions: [
          "How do you type a generic controlled form in React?",
          "How do you map validation errors to form fields with types?",
          "What is z.infer and how does it help forms?",
        ],
        cheatSheet: [
          { tag: "keyof FormValues", desc: "Union of form field name keys" },
          { tag: "Partial<Record<K,V>>", desc: "Optional error map per field key" },
          { tag: "z.infer<Schema>", desc: "Extract TypeScript type from zod schema" },
        ],
      }),
    ],
  },
];

export function flattenTypescriptTopics(): TypescriptTopicDef[] {
  return TYPESCRIPT_ACADEMY_SECTIONS.flatMap((section) => section.topics);
}
