/** Rich lesson generator for all roadmap topics (loops uses dedicated override) */

function code(cls, body) {
  return `public class ${cls} {\n    public static void main(String[] args) {\n${body}\n    }\n}`;
}

function lesson(id, title, category, definition, explanation, cls, body, output) {
  return {
    id,
    title,
    category,
    kind: "code",
    definition,
    explanation,
    code: code(cls, body),
    filename: `${cls}.java`,
    sampleOutput: output,
    runInstructions: `javac ${cls}.java\njava ${cls}`,
  };
}

function guide(id, title, category, definition, explanation, points) {
  return {
    id,
    title,
    category,
    kind: "guide",
    definition,
    explanation,
    guidePoints: points,
  };
}

function clsName(slug, idx) {
  const base = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("")
    .slice(0, 18);
  return `${base}${idx}`;
}

function isFrameworkTopic(slug, title) {
  const s = (slug + title).toLowerCase();
  return /spring|maven|gradle|hibernate|jpa|docker|kubernetes|quarkus|javalin|play|bazel|logback|log4j|slf4j|junit|testng|mockito|cucumber|swagger|postman|jdbc|mongodb|kafka|microservice|petclinic|langchain|rag|mcp|agent|vector|embedding/.test(
    s
  );
}

export function buildRichTopicLessons(slug, title) {
  if (isFrameworkTopic(slug, title)) {
    return {
      slug,
      categories: [
        { id: "concepts", label: "Concepts" },
        { id: "practice", label: "Practice" },
        { id: "interview", label: "Interview" },
        { id: "production", label: "Production" },
      ],
      subtopics: [
        guide(
          `${slug}-c1`,
          `What is ${title}?`,
          "concepts",
          `${title} is essential for Java developers building production systems.`,
          `Before coding, understand why ${title} exists and what problem it solves in real teams.`,
          [
            `Core purpose of ${title}`,
            "Key terminology",
            "Where it fits in a Spring Boot project",
            "What beginners get wrong",
          ]
        ),
        guide(
          `${slug}-c2`,
          `How ${title} Works`,
          "concepts",
          `Architecture and flow of ${title} explained simply.`,
          "Draw a diagram in Notes: inputs, outputs, and dependencies.",
          ["Main components", "Configuration basics", "Typical workflow", "Debugging approach"]
        ),
        guide(
          `${slug}-c3`,
          `${title} — Setup & Config`,
          "concepts",
          `Every tool needs correct setup. ${title} is no exception.`,
          "Verify versions in pom.xml or build.gradle match official docs.",
          ["Install / dependency", "Minimal config file", "Verify it works", "Common config errors"]
        ),
        guide(
          `${slug}-p1`,
          "Hands-on Tutorial",
          "practice",
          `Build a tiny example using ${title} before touching production code.`,
          "Clone, run, change one line, observe the result — that loop builds real skill.",
          ["Create minimal project", "Run locally", "Modify one feature", "Write README notes"]
        ),
        guide(
          `${slug}-p2`,
          "Real Project Integration",
          "practice",
          `Connect ${title} to a REST API or database layer.`,
          "Follow your curriculum week project and map each step to this guide.",
          ["Add to existing app", "Write a test", "Handle one error case", "Commit with clear message"]
        ),
        guide(
          `${slug}-i1`,
          "Top Interview Questions",
          "interview",
          `Interviewers test ${title} to see if you know trade-offs, not buzzwords.`,
          "Prepare 2-minute answers with one real example from your projects.",
          [
            `Explain ${title} simply`,
            "Advantages vs alternatives",
            "One problem you solved",
            "One mistake you fixed",
          ]
        ),
        guide(
          `${slug}-i2`,
          "Scenario-Based Q&A",
          "interview",
          `"Tell me about a time you used ${title} in production."`,
          "Use STAR format: Situation, Task, Action, Result.",
          ["Production scenario template", "Metrics you improved", "What you'd do differently"]
        ),
        guide(
          `${slug}-prod1`,
          "Production Checklist",
          "production",
          `Shipping ${title} requires security, monitoring, and rollback plans.`,
          "Senior engineers care about failure modes and observability.",
          ["Secrets management", "Health checks", "Logging & alerts", "Rollback strategy"]
        ),
        guide(
          `${slug}-prod2`,
          "Team Best Practices",
          "production",
          `Document ${title} conventions so your team stays consistent.`,
          "Add a short ADR (Architecture Decision Record) in your repo.",
          ["Naming conventions", "Code review checklist", "On-call runbook", "Docs location"]
        ),
      ],
    };
  }

  const basics = [
    lesson(
      `${slug}-b1`,
      `Introduction to ${title}`,
      "basics",
      `${title} is a core Java concept. Learn the idea in plain language before writing code.`,
      `This lesson explains what ${title} means, when to use it, and how it appears in real programs.`,
      clsName(slug, 1),
      `        System.out.println("Learning: ${title}");
        System.out.println("Read the definition, then click Run.");`,
      `Learning: ${title}\nRead the definition, then click Run.`
    ),
    lesson(
      `${slug}-b2`,
      `${title} — Core Idea`,
      "basics",
      `The heart of ${title}: one clear rule you must remember for interviews and daily coding.`,
      "Can you explain this to a friend in 30 seconds? If yes, you understand the basics.",
      clsName(slug, 2),
      `        String topic = "${title}";
        System.out.println("Core concept: " + topic);
        System.out.println("When to use: see Explanation panel.");`,
      `Core concept: ${title}\nWhen to use: see Explanation panel.`
    ),
    lesson(
      `${slug}-b3`,
      `${title} — Syntax Overview`,
      "basics",
      `Java syntax for ${title} — the keywords and structure you type in every program.`,
      "Type this code yourself. Muscle memory matters for timed coding tests.",
      clsName(slug, 3),
      `        int demo = 42;
        System.out.println("${title} demo value = " + demo);
        System.out.println("Double = " + (demo * 2.0));`,
      `${title} demo value = 42\nDouble = 84.0`
    ),
    lesson(
      `${slug}-b4`,
      `When to Use ${title}`,
      "basics",
      `Not every problem needs ${title}. Learn when it is the right tool.`,
      "Compare with related concepts in other roadmap topics. Pick the simplest solution that works.",
      clsName(slug, 4),
      `        boolean useCase = true;
        if (useCase) {
            System.out.println("Use ${title} here");
        } else {
            System.out.println("Consider an alternative");
        }`,
      `Use ${title} here`
    ),
    lesson(
      `${slug}-b5`,
      `Common Mistakes with ${title}`,
      "basics",
      `Beginners often stumble on the same ${title} pitfalls. Learn them early.`,
      "Read the error message carefully — Java compiler errors usually point to the exact line.",
      clsName(slug, 5),
      `        try {
            System.out.println("Avoid: ignoring edge cases for ${title}");
            System.out.println("Avoid: copy-paste without understanding");
        } catch (Exception e) {
            System.out.println("Always handle errors");
        }`,
      `Avoid: ignoring edge cases for ${title}\nAvoid: copy-paste without understanding`
    ),
    lesson(
      `${slug}-b6`,
      `${title} — Quick Reference`,
      "basics",
      `A cheat-sheet style recap of ${title} for revision before interviews.`,
      "Add your own notes in the Notes section of this app.",
      clsName(slug, 6),
      `        System.out.println("=== ${title} Quick Ref ===");
        System.out.println("1. Definition");
        System.out.println("2. Syntax");
        System.out.println("3. Example");
        System.out.println("4. Edge cases");`,
      `=== ${title} Quick Ref ===\n1. Definition\n2. Syntax\n3. Example\n4. Edge cases`
    ),
  ];

  const examples = [
    lesson(
      `${slug}-e1`,
      `${title} — Basic Example`,
      "examples",
      `Minimal working example of ${title} with output you can verify by clicking Run.`,
      "Change one value, run again, and observe how the output changes.",
      clsName(slug, 7),
      `        int a = 10, b = 25;
        System.out.println("a = " + a + ", b = " + b);
        System.out.println("Result = " + (a + b));`,
      "a = 10, b = 25\nResult = 35"
    ),
    lesson(
      `${slug}-e2`,
      `${title} — Step by Step`,
      "examples",
      `Break ${title} into small steps so you can trace execution line by line.`,
      "Use println after each step while learning. Remove debug lines once confident.",
      clsName(slug, 8),
      `        System.out.println("Step 1: setup");
        int x = 5;
        System.out.println("Step 2: x = " + x);
        System.out.println("Step 3: done — ${title}");`,
      "Step 1: setup\nStep 2: x = 5\nStep 3: done — " + title
    ),
    lesson(
      `${slug}-e3`,
      `${title} — Real-World Use`,
      "examples",
      `How ${title} appears in banking, e-commerce, or backend APIs.`,
      "Connect this example to a Week project in your curriculum.",
      clsName(slug, 9),
      `        String user = "student_42";
        System.out.println("Processing: " + user);
        System.out.println("${title} applied successfully");`,
      `Processing: student_42\n${title} applied successfully`
    ),
    lesson(
      `${slug}-e4`,
      `${title} — With Input Values`,
      "examples",
      `Simulate different inputs to see how ${title} behaves with varied data.`,
      "In real apps, input comes from Scanner, HTTP requests, or database rows.",
      clsName(slug, 10),
      `        int[] inputs = {1, 5, 10};
        for (int v : inputs) {
            System.out.println("Input " + v + " → processed via ${title}");
        }`,
      `Input 1 → processed via ${title}\nInput 5 → processed via ${title}\nInput 10 → processed via ${title}`
    ),
    lesson(
      `${slug}-e5`,
      `${title} — Combined Example`,
      "examples",
      `${title} often works together with variables, loops, or OOP — this shows a combo.`,
      "Real programs combine many concepts. Practice integration, not isolation.",
      clsName(slug, 11),
      `        for (int i = 1; i <= 3; i++) {
            System.out.println("Round " + i + ": ${title}");
        }`,
      `Round 1: ${title}\nRound 2: ${title}\nRound 3: ${title}`
    ),
    lesson(
      `${slug}-e6`,
      `${title} — Comparison Demo`,
      "examples",
      `Compare two approaches related to ${title} and see which output fits your need.`,
      "Interviewers love 'compare X vs Y' questions. Know both sides.",
      clsName(slug, 12),
      `        System.out.println("Approach A: simple");
        System.out.println("Approach B: flexible");
        System.out.println("Pick based on: readability vs performance");`,
      "Approach A: simple\nApproach B: flexible\nPick based on: readability vs performance"
    ),
    lesson(
      `${slug}-e7`,
      `${title} — Debug Walkthrough`,
      "examples",
      `Practice finding and fixing a bug related to ${title}.`,
      "Read the code, predict output before Run, then verify.",
      clsName(slug, 13),
      `        int count = 0;
        for (int i = 0; i < 5; i++) count++;
        System.out.println("Final count = " + count);
        System.out.println("Expected: 5");`,
      "Final count = 5\nExpected: 5"
    ),
    lesson(
      `${slug}-e8`,
      `${title} — Mini Challenge`,
      "examples",
      `Small coding challenge using ${title}. Try modifying the code before running.`,
      "Goal: change the code so output says 'Challenge complete!'",
      clsName(slug, 14),
      `        System.out.println("Challenge: ${title}");
        System.out.println("Edit this file and run again!");`,
      `Challenge: ${title}\nEdit this file and run again!`
    ),
  ];

  const patterns = [
    lesson(
      `${slug}-p1`,
      `Interview: Explain ${title}`,
      "patterns",
      `"Explain ${title} in simple terms" — the #1 interview opener for this topic.`,
      "Answer in 3 parts: what it is, when to use it, one real example.",
      clsName(slug, 15),
      `        System.out.println("Q: What is ${title}?");
        System.out.println("A: [Write your 30-sec answer]");
        System.out.println("Example: see code in Examples dropdown");`,
      `Q: What is ${title}?\nA: [Write your 30-sec answer]\nExample: see code in Examples dropdown`
    ),
    lesson(
      `${slug}-p2`,
      `Interview: ${title} vs Alternative`,
      "patterns",
      `Compare ${title} with a related concept — interviewers test depth with comparison questions.`,
      "Mention trade-offs: readability, performance, maintainability.",
      clsName(slug, 16),
      `        System.out.println("${title}: best when ...");
        System.out.println("Alternative: best when ...");
        System.out.println("Trade-off: simplicity vs flexibility");`,
      `${title}: best when ...\nAlternative: best when ...\nTrade-off: simplicity vs flexibility`
    ),
    lesson(
      `${slug}-p3`,
      `${title} — Edge Cases`,
      "patterns",
      `Always test edge cases for ${title}: null, zero, empty, boundary values.`,
      "Professional developers think about what can go wrong before shipping.",
      clsName(slug, 17),
      `        int[] data = {};
        if (data.length == 0) {
            System.out.println("Edge case: empty — handle gracefully");
        } else {
            System.out.println("Items: " + data.length);
        }`,
      "Edge case: empty — handle gracefully"
    ),
    lesson(
      `${slug}-p4`,
      `${title} — Code Trace`,
      "patterns",
      `Trace this program on paper before Run — common in written interview rounds.`,
      "Write each line's output in order. Then click Run to check.",
      clsName(slug, 18),
      `        int x = 3;
        x += 2;
        x *= 2;
        System.out.println("Final x = " + x);`,
      "Final x = 10"
    ),
    lesson(
      `${slug}-p5`,
      `${title} — Output Prediction`,
      "patterns",
      `What will this print? Output prediction tests your ${title} understanding.`,
      "Cover the output panel, predict, then Run to verify.",
      clsName(slug, 19),
      `        for (int i = 1; i <= 3; i++) {
            System.out.print(i + " ");
        }
        System.out.println();`,
      "1 2 3 "
    ),
    lesson(
      `${slug}-p6`,
      `${title} — Find the Bug`,
      "patterns",
      `Spot the logic error related to ${title}. Fixing bugs is daily developer work.`,
      "Line-by-line review. What should change to get correct output?",
      clsName(slug, 20),
      `        int sum = 0;
        for (int i = 1; i <= 5; i++) sum += i;
        System.out.println("Sum 1..5 = " + sum);`,
      "Sum 1..5 = 15"
    ),
    lesson(
      `${slug}-p7`,
      `${title} — Best Practice`,
      "patterns",
      `Industry best practice when using ${title} in production Java code.`,
      "Follow naming conventions, keep methods small, write tests.",
      clsName(slug, 21),
      `        System.out.println("DO: clear names, small methods");
        System.out.println("DO: write unit tests");
        System.out.println("DON'T: over-complicate ${title}");`,
      `DO: clear names, small methods\nDO: write unit tests\nDON'T: over-complicate ${title}`
    ),
    lesson(
      `${slug}-p8`,
      `${title} — Performance Tip`,
      "patterns",
      `When ${title} matters for performance and when premature optimization wastes time.`,
      "Measure first. Optimize hot paths only after profiling.",
      clsName(slug, 22),
      `        long start = System.nanoTime();
        for (int i = 0; i < 1000; i++) { /* work */ }
        long ms = (System.nanoTime() - start) / 1_000_000;
        System.out.println("Loop done in ~" + ms + " ms");`,
      "Loop done in ~0 ms"
    ),
    lesson(
      `${slug}-p9`,
      `${title} — Coding Challenge`,
      "patterns",
      `Timed coding challenge: solve a small problem using ${title} in under 10 minutes.`,
      "Practice on paper first, then in IDE. Same pattern appears in many company tests.",
      clsName(slug, 23),
      `        int n = 7, fact = 1;
        for (int i = 1; i <= n; i++) fact *= i;
        System.out.println(n + "! = " + fact);`,
      "7! = 5040"
    ),
    lesson(
      `${slug}-p10`,
      `${title} — Quick Quiz`,
      "patterns",
      `Self-test: define ${title}, give an example, and name one common mistake.`,
      "If you can teach it simply, you understand it. Write answers in Notes.",
      clsName(slug, 24),
      `        System.out.println("Quiz 1: Define ${title}");
        System.out.println("Quiz 2: One example");
        System.out.println("Quiz 3: One common mistake");`,
      `Quiz 1: Define ${title}\nQuiz 2: One example\nQuiz 3: One common mistake`
    ),
  ];

  return {
    slug,
    categories: [
      { id: "basics", label: "Basics" },
      { id: "examples", label: "Examples" },
      { id: "patterns", label: "Patterns & Interview" },
    ],
    subtopics: [...basics, ...examples, ...patterns],
  };
}

export { isFrameworkTopic };
