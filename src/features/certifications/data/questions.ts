import type {
  AssessmentQuestion,
  CertCategoryId,
  CertLevel,
} from "../types";

function q(
  partial: Omit<AssessmentQuestion, "id"> & { id?: string },
  prefix: string,
  n: number
): AssessmentQuestion {
  return { ...partial, id: partial.id ?? `${prefix}-${n}` };
}

/** Tech-specific technical + syntax + small code questions (legacy / sample). */
export function technicalBank(
  categoryId: CertCategoryId,
  level: CertLevel
): AssessmentQuestion[] {
  const p = `${categoryId}-${level}`;
  // Map former advanced/expert extras onto intermediate
  const hard = level === "intermediate";
  const pools: Record<string, AssessmentQuestion[]> = {
    javascript: [
      q(
        {
          kind: "mcq",
          prompt: "What is the output of `typeof null` in JavaScript?",
          options: ['"null"', '"object"', '"undefined"', '"number"'],
          answer: 1,
          explanation: "Historic bug: typeof null === 'object'.",
        },
        p,
        1
      ),
      q(
        {
          kind: "output",
          prompt: "What does this print?",
          code: `console.log([1,2,3].map(n => n * 2)[2]);`,
          options: ["2", "3", "6", "undefined"],
          answer: 2,
        },
        p,
        2
      ),
      q(
        {
          kind: "syntax",
          prompt:
            "Write a one-line arrow function named `double` that returns n * 2.",
          starterCode: "// write here\n",
          language: "javascript",
          answer: "const double = n => n * 2",
          acceptContains: ["=>", "*", "2"],
        },
        p,
        3
      ),
      q(
        {
          kind: "code",
          prompt:
            "Complete the function so it returns true if the array includes the value.",
          starterCode: `function includesValue(arr, value) {\n  // your code\n}`,
          language: "javascript",
          answer: "return arr.includes(value)",
          acceptContains: ["includes", "value"],
        },
        p,
        4
      ),
      q(
        {
          kind: "debug",
          prompt: "Why does this fail?",
          code: `const user = { name: "Ada" };\nuser = { name: "Grace" };`,
          options: [
            "Objects cannot be mutated",
            "const bindings cannot be reassigned",
            "name is a reserved word",
            "Missing semicolon",
          ],
          answer: 1,
        },
        p,
        5
      ),
      q(
        {
          kind: "mcq",
          prompt: "Which creates a shallow copy of an array?",
          options: ["arr.copy()", "[...arr]", "arr.clone()", "Array.dup(arr)"],
          answer: 1,
        },
        p,
        6
      ),
      q(
        {
          kind: "syntax",
          prompt: "Write destructuring to get `name` from `const user = { name, age }`.",
          starterCode: "const user = { name: 'Ada', age: 36 };\n// write: const ... = user\n",
          language: "javascript",
          answer: "const { name } = user",
          acceptContains: ["{", "name", "}", "user"],
        },
        p,
        7
      ),
      q(
        {
          kind: "code",
          prompt: "Write a function `sum(a,b)` that returns a + b.",
          starterCode: "function sum(a, b) {\n  \n}",
          language: "javascript",
          answer: "return a + b",
          acceptContains: ["return", "a", "+", "b"],
        },
        p,
        8
      ),
      q(
        {
          kind: "output",
          prompt: "Output?",
          code: `console.log(Boolean('') , Boolean('0'));`,
          options: ["true true", "false false", "false true", "true false"],
          answer: 2,
        },
        p,
        9
      ),
      q(
        {
          kind: "mcq",
          prompt: "Which is NOT a primitive?",
          options: ["string", "symbol", "object", "bigint"],
          answer: 2,
        },
        p,
        10
      ),
      q(
        {
          kind: "code",
          prompt: "Use Promise to resolve the string 'ok' after 0ms.",
          starterCode: "// return a Promise\n",
          language: "javascript",
          answer: "Promise.resolve('ok')",
          acceptContains: ["Promise", "resolve"],
        },
        p,
        11
      ),
      q(
        {
          kind: "syntax",
          prompt: "Write a template literal that prints Hello Ada using name='Ada'.",
          starterCode: "const name = 'Ada';\n// console.log(...)\n",
          language: "javascript",
          answer: "console.log(`Hello ${name}`)",
          acceptContains: ["`", "${", "name"],
        },
        p,
        12
      ),
    ],
    typescript: [
      q(
        {
          kind: "mcq",
          prompt: "What does `interface` primarily describe?",
          options: [
            "Runtime classes only",
            "Object shape / contract at compile time",
            "CSS modules",
            "Package versions",
          ],
          answer: 1,
        },
        p,
        1
      ),
      q(
        {
          kind: "syntax",
          prompt: "Declare a type alias `Id` as string or number.",
          starterCode: "// type Id = ...\n",
          language: "typescript",
          answer: "type Id = string | number",
          acceptContains: ["type", "Id", "string", "number", "|"],
        },
        p,
        2
      ),
      q(
        {
          kind: "code",
          prompt: "Annotate this function to return a number.",
          starterCode: "function add(a: number, b: number) {\n  return a + b;\n}",
          language: "typescript",
          answer: "function add(a: number, b: number): number",
          acceptContains: [":", "number"],
        },
        p,
        3
      ),
      q(
        {
          kind: "debug",
          prompt: "What is wrong?",
          code: `const x: number = "42";`,
          options: [
            "Nothing",
            "string is not assignable to number",
            "const cannot hold numbers",
            "Missing as any",
          ],
          answer: 1,
        },
        p,
        4
      ),
      q(
        {
          kind: "mcq",
          prompt: "`unknown` vs `any` — which is safer?",
          options: ["any", "unknown", "both identical", "neither exists"],
          answer: 1,
        },
        p,
        5
      ),
      q(
        {
          kind: "syntax",
          prompt: "Write a generic identity function signature: function identity<T>(value: T): T",
          starterCode: "// function identity...\n",
          language: "typescript",
          answer: "function identity<T>(value: T): T { return value }",
          acceptContains: ["<", "T", ">", "value"],
        },
        p,
        6
      ),
      q(
        {
          kind: "code",
          prompt: "Create an interface User with name: string and optional age?: number.",
          starterCode: "// interface User { ... }\n",
          language: "typescript",
          answer: "interface User { name: string; age?: number }",
          acceptContains: ["interface", "User", "name", "string", "age?"],
        },
        p,
        7
      ),
      q(
        {
          kind: "mcq",
          prompt: "What does `as const` do?",
          options: [
            "Deletes the value",
            "Narrows to the most specific readonly literal type",
            "Forces any",
            "Enables runtime constants only",
          ],
          answer: 1,
        },
        p,
        8
      ),
      q(
        {
          kind: "output",
          prompt: "Is this valid TS with strictNullChecks?",
          code: `function len(s: string) { return s.length }\nlen(null)`,
          options: ["Valid", "Type error", "Runtime only", "Compiles with warning only always"],
          answer: 1,
        },
        p,
        9
      ),
      q(
        {
          kind: "syntax",
          prompt: "Write a Record type mapping string keys to boolean values named Flags.",
          starterCode: "// type Flags = ...\n",
          language: "typescript",
          answer: "type Flags = Record<string, boolean>",
          acceptContains: ["Record", "string", "boolean"],
        },
        p,
        10
      ),
    ],
    react: [
      q(
        {
          kind: "mcq",
          prompt: "What rule must hooks follow?",
          options: [
            "Call only inside loops",
            "Call at the top level of React functions",
            "Call only in class components",
            "Call after conditional returns freely",
          ],
          answer: 1,
        },
        p,
        1
      ),
      q(
        {
          kind: "syntax",
          prompt: "Write a useState call that starts count at 0.",
          starterCode: "import { useState } from 'react';\n// const ...\n",
          language: "javascript",
          answer: "const [count, setCount] = useState(0)",
          acceptContains: ["useState", "0", "["],
        },
        p,
        2
      ),
      q(
        {
          kind: "code",
          prompt: "Write a functional component Hello that renders <h1>Hello</h1>.",
          starterCode: "// export function Hello() { ... }\n",
          language: "javascript",
          answer: "export function Hello() { return <h1>Hello</h1> }",
          acceptContains: ["function", "return", "<h1>", "Hello"],
        },
        p,
        3
      ),
      q(
        {
          kind: "debug",
          prompt: "What's wrong?",
          code: `useEffect(() => { fetch('/api') }, )`,
          options: [
            "Missing dependency array (invalid syntax)",
            "fetch is banned",
            "useEffect cannot be async wrapper",
            "Nothing",
          ],
          answer: 0,
        },
        p,
        4
      ),
      q(
        {
          kind: "mcq",
          prompt: "Keys in lists should be:",
          options: [
            "Array index always",
            "Stable unique ids when possible",
            "Random each render",
            "The component name",
          ],
          answer: 1,
        },
        p,
        5
      ),
      q(
        {
          kind: "syntax",
          prompt: "Write JSX that binds an onClick to handleClick.",
          starterCode: "function handleClick() {}\n// return (...)\n",
          language: "javascript",
          answer: "<button onClick={handleClick}>Go</button>",
          acceptContains: ["onClick", "{", "handleClick"],
        },
        p,
        6
      ),
      q(
        {
          kind: "code",
          prompt: "Use useEffect to log 'mounted' once on mount.",
          starterCode: "import { useEffect } from 'react';\n",
          language: "javascript",
          answer: "useEffect(() => { console.log('mounted') }, [])",
          acceptContains: ["useEffect", "[]"],
        },
        p,
        7
      ),
      q(
        {
          kind: "mcq",
          prompt: "Controlled input value comes from:",
          options: ["DOM only", "React state/props", "CSS", "localStorage automatically"],
          answer: 1,
        },
        p,
        8
      ),
      q(
        {
          kind: "output",
          prompt: "After setCount(c => c+1) twice in one click handler (React 18), count increases by?",
          code: `setCount(c => c + 1);\nsetCount(c => c + 1);`,
          options: ["0", "1", "2", "Depends on batching off always"],
          answer: 2,
        },
        p,
        9
      ),
      q(
        {
          kind: "code",
          prompt: "Map items to <li key={item.id}>{item.name}</li>.",
          starterCode: "const items = [{id:1,name:'A'}];\n// return (...)\n",
          language: "javascript",
          answer: "items.map(item => <li key={item.id}>{item.name}</li>)",
          acceptContains: ["map", "key", "item.id"],
        },
        p,
        10
      ),
    ],
    python: [
      q(
        {
          kind: "mcq",
          prompt: "What does `len([1,2,3])` return?",
          options: ["2", "3", "4", "Error"],
          answer: 1,
        },
        p,
        1
      ),
      q(
        {
          kind: "syntax",
          prompt: "Write a list comprehension of squares for n in range(5).",
          starterCode: "# squares = ...\n",
          language: "python",
          answer: "squares = [n*n for n in range(5)]",
          acceptContains: ["for", "in", "range"],
        },
        p,
        2
      ),
      q(
        {
          kind: "code",
          prompt: "Write a function `is_even(n)` that returns True if n is even.",
          starterCode: "def is_even(n):\n    ",
          language: "python",
          answer: "return n % 2 == 0",
          acceptContains: ["return", "%", "2"],
        },
        p,
        3
      ),
      q(
        {
          kind: "output",
          prompt: "Output?",
          code: `print("hi" * 2)`,
          options: ["hi2", "hihi", "Error", "hi hi"],
          answer: 1,
        },
        p,
        4
      ),
      q(
        {
          kind: "debug",
          prompt: "Bug?",
          code: `def add(a, b):\nprint(a + b)`,
          options: [
            "Missing indentation under def",
            "print cannot add",
            "Need return type",
            "No bug",
          ],
          answer: 0,
        },
        p,
        5
      ),
      q(
        {
          kind: "syntax",
          prompt: "Unpack a, b from tuple t = (1, 2).",
          starterCode: "t = (1, 2)\n# a, b = ...\n",
          language: "python",
          answer: "a, b = t",
          acceptContains: ["a", "b", "=", "t"],
        },
        p,
        6
      ),
      q(
        {
          kind: "code",
          prompt: "Read lines from path 'data.txt' using a with statement (open for read).",
          starterCode: "# with open(...)\n",
          language: "python",
          answer: "with open('data.txt') as f:\n    lines = f.readlines()",
          acceptContains: ["with", "open", "as"],
        },
        p,
        7
      ),
      q(
        {
          kind: "mcq",
          prompt: "Mutable default argument pitfall uses which?",
          options: ["None sentinel", "Always [] as default safely", "tuple only", "No pitfall exists"],
          answer: 0,
        },
        p,
        8
      ),
      q(
        {
          kind: "syntax",
          prompt: "Write an f-string greeting for name.",
          starterCode: "name = 'Ada'\n# print(...)\n",
          language: "python",
          answer: 'print(f"Hello {name}")',
          acceptContains: ["f", "{", "name"],
        },
        p,
        9
      ),
      q(
        {
          kind: "code",
          prompt: "Return the max of a and b without using max().",
          starterCode: "def bigger(a, b):\n    ",
          language: "python",
          answer: "return a if a > b else b",
          acceptContains: ["return", "if"],
        },
        p,
        10
      ),
    ],
    sql: [
      q(
        {
          kind: "mcq",
          prompt: "Which clause filters rows before grouping?",
          options: ["HAVING", "WHERE", "ORDER BY", "LIMIT"],
          answer: 1,
        },
        p,
        1
      ),
      q(
        {
          kind: "syntax",
          prompt: "Write SQL to select all columns from users.",
          starterCode: "-- SQL\n",
          language: "sql",
          answer: "SELECT * FROM users",
          acceptContains: ["SELECT", "FROM", "users"],
        },
        p,
        2
      ),
      q(
        {
          kind: "code",
          prompt: "Select name from users where age >= 18.",
          starterCode: "-- SQL\n",
          language: "sql",
          answer: "SELECT name FROM users WHERE age >= 18",
          acceptContains: ["SELECT", "name", "WHERE", "age"],
        },
        p,
        3
      ),
      q(
        {
          kind: "mcq",
          prompt: "INNER JOIN returns rows that:",
          options: [
            "Match in both tables",
            "Exist only in left",
            "Exist only in right",
            "Always cartesian product",
          ],
          answer: 0,
        },
        p,
        4
      ),
      q(
        {
          kind: "syntax",
          prompt: "Count rows in orders table.",
          starterCode: "-- SQL\n",
          language: "sql",
          answer: "SELECT COUNT(*) FROM orders",
          acceptContains: ["COUNT", "FROM", "orders"],
        },
        p,
        5
      ),
      q(
        {
          kind: "code",
          prompt: "Insert a user with name 'Ada' into users(name).",
          starterCode: "-- SQL\n",
          language: "sql",
          answer: "INSERT INTO users (name) VALUES ('Ada')",
          acceptContains: ["INSERT", "INTO", "users", "VALUES"],
        },
        p,
        6
      ),
      q(
        {
          kind: "debug",
          prompt: "Problem?",
          code: `SELECT * FROM users WHERE name = Ada`,
          options: [
            "Ada should be quoted as a string",
            "SELECT is invalid",
            "WHERE cannot compare",
            "No problem",
          ],
          answer: 0,
        },
        p,
        7
      ),
      q(
        {
          kind: "syntax",
          prompt: "Order users by created_at descending.",
          starterCode: "SELECT * FROM users\n",
          language: "sql",
          answer: "ORDER BY created_at DESC",
          acceptContains: ["ORDER BY", "DESC"],
        },
        p,
        8
      ),
      q(
        {
          kind: "code",
          prompt: "Update users set active = true where id = 1.",
          starterCode: "-- SQL\n",
          language: "sql",
          answer: "UPDATE users SET active = true WHERE id = 1",
          acceptContains: ["UPDATE", "SET", "WHERE"],
        },
        p,
        9
      ),
      q(
        {
          kind: "mcq",
          prompt: "Primary key guarantees:",
          options: [
            "Nullable duplicates",
            "Unique non-null identity of a row",
            "Faster CSS",
            "Automatic sharding",
          ],
          answer: 1,
        },
        p,
        10
      ),
    ],
    docker: [
      q(
        {
          kind: "mcq",
          prompt: "Dockerfile instruction to set the start command?",
          options: ["RUN", "CMD", "COPY", "FROM"],
          answer: 1,
        },
        p,
        1
      ),
      q(
        {
          kind: "syntax",
          prompt: "Write a FROM line using node:20-alpine.",
          starterCode: "# Dockerfile\n",
          language: "shell",
          answer: "FROM node:20-alpine",
          acceptContains: ["FROM", "node"],
        },
        p,
        2
      ),
      q(
        {
          kind: "code",
          prompt: "Copy package.json then run npm ci (two lines).",
          starterCode: "# Dockerfile\n",
          language: "shell",
          answer: "COPY package.json .\nRUN npm ci",
          acceptContains: ["COPY", "RUN", "npm"],
        },
        p,
        3
      ),
      q(
        {
          kind: "mcq",
          prompt: "Images vs containers:",
          options: [
            "Same thing",
            "Image is immutable template; container is a running instance",
            "Container builds images only",
            "Images cannot be shared",
          ],
          answer: 1,
        },
        p,
        4
      ),
      q(
        {
          kind: "syntax",
          prompt: "Expose port 3000 in Dockerfile.",
          starterCode: "",
          language: "shell",
          answer: "EXPOSE 3000",
          acceptContains: ["EXPOSE", "3000"],
        },
        p,
        5
      ),
      q(
        {
          kind: "code",
          prompt: "CLI: run image myapp mapping host 8080 to container 80.",
          starterCode: "# docker ...\n",
          language: "shell",
          answer: "docker run -p 8080:80 myapp",
          acceptContains: ["docker", "run", "-p", "8080:80"],
        },
        p,
        6
      ),
      q(
        {
          kind: "debug",
          prompt: "Why might rebuild be slow?",
          code: `COPY . .\nRUN npm install`,
          options: [
            "Copying all files before install busts cache on any change",
            "RUN is illegal",
            "npm cannot run in Docker",
            "No issue",
          ],
          answer: 0,
        },
        p,
        7
      ),
      q(
        {
          kind: "mcq",
          prompt: "Multi-stage builds help mainly with:",
          options: [
            "Larger images",
            "Smaller final images / separating build tools",
            "Slower deploys always",
            "Removing networking",
          ],
          answer: 1,
        },
        p,
        8
      ),
      q(
        {
          kind: "syntax",
          prompt: "Set WORKDIR to /app.",
          starterCode: "",
          language: "shell",
          answer: "WORKDIR /app",
          acceptContains: ["WORKDIR", "/app"],
        },
        p,
        9
      ),
      q(
        {
          kind: "code",
          prompt: "Compose service web using image nginx and ports '80:80' (YAML snippet).",
          starterCode: "services:\n  web:\n",
          language: "shell",
          answer: "image: nginx\n    ports:\n      - '80:80'",
          acceptContains: ["image", "nginx", "ports"],
        },
        p,
        10
      ),
    ],
  };

  // Map related categories onto closest bank
  const alias: Partial<Record<CertCategoryId, string>> = {
    javascript: "javascript",
    typescript: "typescript",
    react: "react",
    nextjs: "react",
    frontend: "react",
    python: "python",
    sql: "sql",
    postgresql: "sql",
    mongodb: "sql",
    docker: "docker",
    devops: "docker",
    nodejs: "javascript",
    backend: "javascript",
    java: "javascript",
    git: "javascript",
    "system-design": "javascript",
    "ai-engineering": "python",
    "prompt-engineering": "python",
    rag: "python",
    langchain: "python",
    langgraph: "python",
    "data-structures": "javascript",
    algorithms: "javascript",
  };

  const key = alias[categoryId] ?? "javascript";
  let list = [...(pools[key] ?? pools.javascript!)];

  // Extra harder items for advanced/expert
  if (hard) {
    list = [
      ...list,
      q(
        {
          kind: "code",
          prompt:
            "Write a small debounce skeleton: return a function that clears prior timer (setTimeout placeholder ok).",
          starterCode:
            "function debounce(fn, wait) {\n  let t;\n  return (...args) => {\n    // your code\n  }\n}",
          language: "javascript",
          answer: "clearTimeout(t); t = setTimeout(() => fn(...args), wait)",
          acceptContains: ["clearTimeout", "setTimeout"],
        },
        p,
        20
      ),
      q(
        {
          kind: "syntax",
          prompt: "Write try/catch that logs the error message.",
          starterCode: "try {\n  risky();\n} ",
          language: "javascript",
          answer: "catch (e) { console.log(e.message) }",
          acceptContains: ["catch", "console"],
        },
        p,
        21
      ),
      q(
        {
          kind: "architecture",
          prompt: "Idempotent API writes usually need:",
          options: [
            "No keys",
            "Idempotency keys / dedupe store",
            "Larger payloads",
            "Disabling retries",
          ],
          answer: 1,
        },
        p,
        22
      ),
      q(
        {
          kind: "code",
          prompt: "Write async function fetchJson(url) that returns parsed JSON.",
          starterCode: "async function fetchJson(url) {\n  \n}",
          language: "javascript",
          answer: "const res = await fetch(url); return res.json()",
          acceptContains: ["await", "fetch", "json"],
        },
        p,
        23
      ),
      q(
        {
          kind: "mcq",
          prompt: "Event loop microtasks (Promises) run relative to macrotasks (setTimeout)?",
          options: [
            "After all macrotasks forever",
            "Before the next macrotask, after current call stack",
            "Only on page unload",
            "Never interleaved",
          ],
          answer: 1,
        },
        p,
        24
      ),
      q(
        {
          kind: "syntax",
          prompt: "Write Object destructuring with rename: take `name` as `username` from user.",
          starterCode: "const user = { name: 'Ada' };\n",
          language: "javascript",
          answer: "const { name: username } = user",
          acceptContains: ["name:", "username"],
        },
        p,
        25
      ),
    ];
  }

  return list;
}

export function gradeAnswer(
  question: AssessmentQuestion,
  raw: string | number | undefined
): boolean {
  if (raw === undefined || raw === "") return false;
  if (typeof question.answer === "number") {
    return Number(raw) === question.answer;
  }
  const text = String(raw).replace(/\s+/g, " ").trim().toLowerCase();
  if (question.acceptContains?.length) {
    return question.acceptContains.every((part) =>
      text.includes(part.toLowerCase())
    );
  }
  const expected = question.answer.replace(/\s+/g, " ").trim().toLowerCase();
  return text.includes(expected) || text === expected;
}
