import fs from "fs";
import path from "path";

const WEEKS_DIR = "src/curriculum/weeks";
const OUT_DIR = "src/curriculum/ai-exercises";

const WEEK1_OVERRIDES = {
  "ai-e1": {
    answer:
      "JDK (Java Development Kit) is what developers install to write Java programs. It includes the compiler (javac), debugger, libraries, and a JRE. JRE (Java Runtime Environment) is what you need to run Java programs — it contains the JVM plus core class libraries, but no compiler. JVM (Java Virtual Machine) is the engine that executes bytecode — it loads classes, manages memory, runs garbage collection, and translates bytecode to machine instructions on your OS.",
    realWorld:
      "On your laptop you install the JDK to write and compile Week 1 programs. When you deploy a JAR to a server, the server only needs a JRE (or JDK) with a compatible JVM — the same HelloWorld.class bytecode runs on Windows and Linux without recompiling.",
    code: "// You write this with the JDK (javac compiles it)\npublic class Hello {\n    public static void main(String[] args) {\n        System.out.println(\"Runs on the JVM!\");\n    }\n}",
  },
  "ai-e2": {
    answer:
      "A variable is like a labeled box where you store a value. The label is the variable name (e.g., age), and the box holds one value at a time (e.g., 12). In Java you must say what type of value the box holds — int for whole numbers, double for decimals, String for text. You can change what's inside the box later: age = 13;",
    realWorld:
      "Imagine a video game character: health = 100, coins = 50, playerName = \"Maya\". When Maya collects a coin, the program updates coins = 51. Variables let your Student Information System remember names, roll numbers, and grades while the program runs.",
    code: "int age = 10;\nString name = \"Riya\";\ndouble height = 1.42;\nSystem.out.println(name + \" is \" + age + \" years old\");",
  },
  "ai-e3": {
    answer:
      "Line 1: `public class HelloWorld` — declares a class named HelloWorld (filename must match). Line 2: `public static void main(String[] args)` — the entry point; JVM starts here. Line 3: `System.out.println(...)` — prints text to the console followed by a newline. Line 4–5: closing braces end the method and class. Every standalone Java app needs this main method structure.",
    realWorld:
      "Your first GitHub upload for Week 1 is HelloWorld.java. When you run `java HelloWorld`, the JVM finds main(), executes println, and you see output in the terminal — the same flow every Java application uses to start.",
    code: "public class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println(\"Hello, World!\");\n    }\n}",
  },
  "ai-e4": {
    answer:
      "A syntax error means the Java compiler (javac) cannot understand your code structure — missing semicolon, mismatched braces, wrong keyword spelling, or invalid type usage. The compiler stops before creating bytecode and reports the file name and line number. Syntax errors are caught before the program ever runs.",
    realWorld:
      "You write `int x = 5` without a semicolon. The IDE shows a red squiggle; javac says '; expected'. Fix the semicolon, recompile, and the error disappears. Syntax errors protect you from running broken structure.",
    code: "// Syntax error: missing semicolon\nint score = 95\nSystem.out.println(score);\n\n// Fixed:\nint score = 95;\nSystem.out.println(score);",
  },
  "ai-e5": {
    answer:
      "Common beginner bugs: missing semicolons, wrong variable types, using = instead of == in conditions, array index out of bounds, and typos in method names. To debug: read the compiler error line number, check recent edits, print variable values, and fix one issue at a time. Logic bugs compile but produce wrong output — trace the code step by step.",
    realWorld:
      "Broken program: `String name = null; System.out.println(name.length());` — compiles but throws NullPointerException at runtime. The fix: check `if (name != null)` before calling methods. Always read the error message from the bottom of the stack trace upward.",
    code: "// Bug: prints nothing useful — forgot to add numbers\npublic class Add {\n    public static void main(String[] args) {\n        int a = 5, b = 3;\n        System.out.println(\"Sum\"); // should print a + b\n    }\n}\n\n// Fix:\nSystem.out.println(\"Sum: \" + (a + b));",
  },
  "ai-e6": {
    answer:
      "When comparing explanations, check: (1) accuracy against JDK docs, (2) clarity for your level, (3) whether examples compile, (4) depth vs. unnecessary complexity. One answer might use perfect analogies but wrong syntax; another might be technically correct but hard to follow. The best explanation is correct, simple, and runnable.",
    realWorld:
      "Question: \"Difference between int and double?\" Response A says doubles are 'always better' — misleading. Response B explains int for counts, double for measurements with a price example — clearer and correct. You learned to evaluate quality, not just accept the first answer.",
  },
  "ai-e7": {
    answer:
      "Good variable names describe purpose: studentCount not n, totalPrice not tp, isLoggedIn not flag. Use camelCase in Java. Avoid single letters except loop counters (i, j). Boolean names often start with is/has/can. Names should make code readable without comments.",
    realWorld:
      "Before: `int x = 20; String s = \"A\";` After: `int passingScore = 20; String grade = \"A\";` A teammate reading your Student Information System instantly understands the second version during code review.",
    code: "// Weak\nint a = 100;\ndouble b = 89.5;\n\n// Strong\nint maxAttendance = 100;\ndouble examAverage = 89.5;",
  },
  "ai-e8": {
    answer:
      "Type casting converts a value from one type to another. Widening (implicit): int → double happens automatically. Narrowing (explicit): double → int requires (int) and truncates decimals. Casting is needed when you mix types or extract integer parts from decimals.",
    realWorld:
      "Shopping cart: items = 3 (int), priceEach = 9.99 (double). Total = items * priceEach gives 29.97. To split bill among friends: (int)(29.97 / 2) = 14 — cast drops .97. Know when data loss is acceptable.",
    code: "double price = 9.99;\nint rounded = (int) price; // 9\n\ndouble avg = 7 / 2;      // 3.0 (int division first!)\ndouble avg2 = 7 / 2.0;   // 3.5",
  },
  "ai-e9": {
    answer:
      "Java basics quiz — test yourself: (1) What is the entry point method signature? (2) Name 4 primitive types. (3) int vs double — when use each? (4) What does javac do vs java? (5) Fix: `String name = Alex` (missing quotes). (6) What is a variable? (7) Why use semicolons? (8) What is bytecode? (9) == vs = ? (10) What package contains System.out?",
    realWorld:
      "Before your Week 1 assessment, cover the answer panel, try each quiz question on paper, then reveal and check. Active recall beats rereading — this is how interview prep works too.",
  },
  "ai-e10": {
    answer:
      "Student Information System review checklist: separate input, logic, and display (main method shouldn't do everything); use meaningful class/variable names; validate user input (empty name, negative age); handle invalid menu choices with loops; avoid magic numbers (use constants); add comments only where logic isn't obvious; test edge cases — empty list, duplicate roll number.",
    realWorld:
      "A hiring manager skims your GitHub README and Variables.java. Clean structure and validation show you think like a developer, not just someone who copied code. Refactor one 80-line main() into smaller methods — that's a visible improvement for your portfolio.",
  },
};

function buildExercise(weekNum, title) {
  const clean = title.replace(/^Ask AI to /i, "").replace(/^Give AI /i, "").replace(/^Compare /i, "Compare: ");
  const lower = title.toLowerCase();

  let answer = "";
  let realWorld = "";
  let code;

  if (lower.includes("explain")) {
    const topic = title.replace(/^Ask AI to explain /i, "").replace(/\.$/, "");
    answer = `Here is a clear explanation of ${topic}. Read it carefully, then try explaining it aloud in your own words — that is how you know you truly understand it for Week ${weekNum} and future interviews.`;
    realWorld = `Apply this while building your Week ${weekNum} Java project: write a small code snippet that demonstrates the concept, run it in your IDE, and connect the output to what you read here.`;
  } else if (lower.includes("review") || lower.includes("suggest improvement")) {
    answer = `Use this review checklist for "${clean}": check naming, structure, error handling, edge cases, and readability. Good code is correct first, then clean, then fast. Fix one issue at a time and re-run your program after each change.`;
    realWorld = `Before submitting Week ${weekNum} work to GitHub, go through each checklist item. Interviewers often ask "how would you improve this code?" — practicing here prepares you for that question.`;
  } else if (lower.includes("generate") || lower.includes("create")) {
    answer = `Below is ready-to-use material for "${clean}". Study the pattern, don't just copy — type it yourself, modify one part, and observe what breaks or improves. Generation only helps when you understand the output.`;
    realWorld = `Use this directly in your Week ${weekNum} lab: implement the example, extend it with one extra feature, and add it to your repository with a short README note about what you learned.`;
  } else if (lower.includes("compare")) {
    answer = `Comparison guide for "${clean}": list when to use each option, trade-offs (speed, memory, complexity), and a simple Java scenario for both. Comparisons in interviews show structured thinking — always give a recommendation with reasoning.`;
    realWorld = `In your Week ${weekNum} project, pick the option that fits your data size and access pattern. Write two tiny examples side-by-side and note which is easier to read and maintain.`;
  } else if (lower.includes("optimize") || lower.includes("slow")) {
    answer = `Optimization approach: (1) measure or identify the bottleneck, (2) check algorithm choice and unnecessary work, (3) apply a simpler fix first (better data structure, fewer nested loops), (4) verify correctness with tests. Never optimize code you haven't profiled or understood.`;
    realWorld = `Take a nested-loop solution from Week ${weekNum}, count how many iterations run for n=1000, then rewrite with a HashMap or Stream and compare runtime in your IDE.`;
  } else if (lower.includes("debug") || lower.includes("bug") || lower.includes("exception") || lower.includes("stack trace")) {
    answer = `Debugging steps for "${clean}": read the full error message, find your code line in the stack trace, reproduce with the smallest input, add print statements or use the debugger, form a hypothesis, fix, and re-run. Most bugs are typos, null values, or wrong assumptions about data.`;
    realWorld = `When your Week ${weekNum} program crashes, paste the error into your notes, trace from Caused by: upward, and document what fixed it — that log becomes valuable interview material.`;
  } else if (lower.includes("security") || lower.includes("injection") || lower.includes("jwt") || lower.includes("bcrypt")) {
    answer = `Security notes for "${clean}": never store plain-text passwords, validate all inputs, use parameterized queries, keep secrets in environment variables, and return generic error messages to clients. Security is a requirement, not an optional extra.`;
    realWorld = `Audit your Week ${weekNum} API: search for hardcoded passwords, SQL string concatenation, and missing auth on sensitive endpoints. Fix one vulnerability and document the before/after.`;
  } else if (lower.includes("sql") || lower.includes("database") || lower.includes("jdbc") || lower.includes("mongodb") || lower.includes("hibernate")) {
    answer = `Database guidance for "${clean}": define tables with clear keys and types, use normalization to reduce duplication, prefer JOINs with explicit ON clauses, always use PreparedStatement for user input, and index columns used in WHERE/JOIN. Review query plans for slow operations.`;
    realWorld = `Model your Week ${weekNum} project schema on paper first, implement CREATE TABLE, insert sample rows, and run SELECT queries to verify relationships before wiring JDBC or JPA.`;
    code = "-- Example pattern\nSELECT s.name, c.title\nFROM students s\nINNER JOIN enrollments e ON s.id = e.student_id\nINNER JOIN courses c ON c.id = e.course_id\nWHERE s.id = ?;";
  } else if (lower.includes("api") || lower.includes("rest") || lower.includes("postman") || lower.includes("swagger")) {
    answer = `API best practices for "${clean}": use nouns in URLs (/students not /getStudents), correct HTTP verbs, consistent JSON field names, meaningful status codes, validation on input, and documented examples. Test happy path and error paths equally.`;
    realWorld = `For Week ${weekNum}, document one endpoint with method, URL, request body, success response, and error response. Share the doc with a classmate — if they can call your API without asking questions, it's good enough.`;
  } else {
    answer = `Practice focus: ${clean}. Work through the explanation, write code by hand, run it, and mark complete only when you can teach the idea to someone else without looking at the screen.`;
    realWorld = `Week ${weekNum} portfolio tip: save a screenshot or code snippet showing you applied this skill. Concrete evidence beats vague "I used AI to learn" in interviews.`;
  }

  return { answer, realWorld, ...(code ? { code } : {}) };
}

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const allContent = {};

for (let i = 1; i <= 11; i++) {
  const week = JSON.parse(fs.readFileSync(path.join(WEEKS_DIR, `week-${i}.json`), "utf8"));
  const exercises = week.aiSkill.exercises;
  const weekContent = {};

  for (const ex of exercises) {
    const override = i === 1 ? WEEK1_OVERRIDES[ex.id] : null;
    weekContent[ex.id] = override ?? buildExercise(i, ex.title);
    allContent[ex.id] = { title: ex.title, ...weekContent[ex.id] };
  }

  fs.writeFileSync(
    path.join(OUT_DIR, `week-${i}.json`),
    JSON.stringify(weekContent, null, 2) + "\n"
  );
}

fs.writeFileSync(path.join(OUT_DIR, "all.json"), JSON.stringify(allContent, null, 2) + "\n");
console.log(`Generated ${Object.keys(allContent).length} AI exercise entries`);
