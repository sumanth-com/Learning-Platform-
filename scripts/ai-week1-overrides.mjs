/** Week 1 — short, practical AI + Java content */

export const WEEK1_TOPIC_OVERRIDES = {
  "ai-t1": {
    answer:
      "AI builds systems that recognize patterns, decide, and generate text/code. For Java learners, it's a study partner — explains concepts and reviews code. It does not replace knowing fundamentals.",
    realWorld:
      "Use AI to explain a for-loop, then type and run the example yourself. Understanding sticks when you write code, not only read.",
  },
  "ai-t2": {
    answer:
      "Generative AI creates new text, code, or images from learned patterns. ChatGPT and Claude generate token by token. Output may be right, partly right, or wrong — always verify.",
    realWorld:
      "AI drafts a grade calculator — you run it, fix empty-input bugs, and learn more from debugging than from reading.",
  },
  "ai-t3": {
    answer:
      "An LLM predicts the next token from huge training data. That produces fluent answers but not guaranteed facts. It estimates likely text, not a database lookup.",
    realWorld:
      "Copilot autocompletes Java from your file context — sometimes perfect, sometimes invents methods that don't exist on String.",
  },
  "ai-t4": {
    answer:
      "A prompt is your instruction to the model: question, task, or context. Better prompts → better answers. Think of it as a mini spec for the AI.",
    realWorld:
      "Bad: 'Java arrays.' Good: 'Explain arrays for a beginner with declaration, init, and a loop example under 100 words.'",
  },
  "ai-t5": {
    answer:
      "Good prompts include: goal, your level, desired format, and limits ('no topics I haven't learned'). Specific beats vague every time.",
    realWorld:
      "'Week 1 student — one if-else grading example with int score and println, commented branches.'",
  },
  "ai-t6": {
    answer:
      "Hallucination = confident false info: fake APIs, wrong syntax, invented citations. More common for rare libraries and version-specific details.",
    realWorld:
      "AI suggests String.reverse() — doesn't exist. JDK docs + compiler catch it immediately.",
  },
  "ai-t7": {
    answer:
      "Wrong answers come from training gaps, ambiguous prompts, missing live data, or the model sounding confident over being correct. Stay skeptical.",
    realWorld:
      "AI says use == for String names — you fix with equals() and add a test. The mistake reinforced your knowledge.",
  },
  "ai-t8": {
    answer:
      "Ethics: don't paste secrets/PII into public tools, disclose AI help when required, know bias in training data. Protect users and company data.",
    realWorld:
      "Before pasting prod code into chat: allowed by policy? Could customer data leak?",
  },
  "ai-t9": {
    answer:
      "Trust AI for explanations and small snippets you can compile. Cross-check docs for anything important. Trust but verify.",
    realWorld:
      "int vs double — confirm with a 5-line main() experiment, not blind copy.",
  },
  "ai-t10": {
    answer:
      "Don't trust AI alone for security, legal, or production deploys. Don't submit homework you don't understand. Test every generated snippet.",
    realWorld:
      "AI suggests MD5 for passwords — you reject and use BCrypt. That's professional judgment.",
  },
};

export const WEEK1_EXERCISE_OVERRIDES = {
  "ai-e1": {
    answer:
      "**JDK** = write & compile (javac, tools). **JRE** = run apps (JVM + libraries). **JVM** = executes bytecode on any OS.",
    realWorld:
      "Laptop has JDK for coding. Server runs your JAR with a JVM — same bytecode, different OS.",
    code: 'public class Hello {\n  public static void main(String[] args) {\n    System.out.println("Runs on JVM!");\n  }\n}',
  },
  "ai-e2": {
    answer:
      "Variables store values: `int age = 12;` `String name = \"Riya\";` Type is fixed; you can reassign compatible values.",
    realWorld:
      "Game stats: health, coins, playerName — updated as the program runs.",
    code: 'int age = 10;\nString name = "Riya";\nSystem.out.println(name + " is " + age);',
  },
  "ai-e3": {
    answer:
      "`public class HelloWorld` — class name. `public static void main` — entry point. `System.out.println` — print line. Braces close method and class.",
    realWorld:
      "`java HelloWorld` → JVM runs main() → output in terminal. Every Java app starts here.",
    code: 'public class HelloWorld {\n  public static void main(String[] args) {\n    System.out.println("Hello, World!");\n  }\n}',
  },
  "ai-e4": {
    answer:
      "Syntax error = compiler can't parse code: missing `;`, bad braces, typos. Fix the line javac reports before running.",
    realWorld:
      "Missing semicolon → red squiggle → add `;` → compiles.",
    code: "int score = 95;\nSystem.out.println(score);",
  },
  "ai-e5": {
    answer:
      "Find bugs: read error line, check recent edits, print variables, fix one issue at a time. Logic bugs compile but give wrong output — trace step by step.",
    realWorld:
      "NPE on null.length() — add null check before calling methods.",
    code: 'System.out.println("Sum: " + (a + b)); // not just "Sum"',
  },
  "ai-e6": {
    answer:
      "Compare AI answers: accurate? clear? compiles? Compare two responses — pick correct + simple over fancy + wrong.",
    realWorld:
      "'int always worse than double' — misleading. 'int for counts, double for prices' — correct.",
  },
  "ai-e7": {
    answer:
      "Names describe purpose: studentCount not n, isLoggedIn not flag. camelCase in Java. Booleans often start with is/has.",
    realWorld:
      "passingScore and grade beat x and s in code review.",
    code: "int maxAttendance = 100;\ndouble examAverage = 89.5;",
  },
  "ai-e8": {
    answer:
      "Casting: int→double automatic. double→int needs (int) and drops decimals. Watch int division: 7/2 is 3, 7/2.0 is 3.5.",
    realWorld:
      "(int)(29.97/2) = 14 — know when losing decimals is OK.",
    code: "double price = 9.99;\nint rounded = (int) price; // 9",
  },
  "ai-e9": {
    answer:
      "Self-quiz: main signature? 4 primitives? javac vs java? Fix `String name = Alex`. What is bytecode? == vs =?",
    realWorld:
      "Cover answers, write from memory, then check — best prep for tests and interviews.",
  },
  "ai-e10": {
    answer:
      "Project review: meaningful names, input validation, no magic numbers, small methods, test empty list and bad input.",
    realWorld:
      "Clean GitHub README + validation shows you think like a developer, not a copy-paster.",
  },
};
