/** 32+ reusable pattern templates for every roadmap subtopic */
import { difficultyForIndex, scalePatternBody, scalePatternOutput } from "./difficulty.mjs";

export function buildGenericPatterns(title) {
  const templates = [
    {
      title: `${title} — Basic Example`,
      definition: `A minimal working example for ${title}.`,
      explanation: "Change values and run again to see how output changes.",
      body: `        System.out.println("Example: ${title}");
        int x = 10, y = 20;
        System.out.println("Result = " + (x + y));`,
      output: `Example: ${title}\nResult = 30`,
    },
    {
      title: `${title} — Step by Step`,
      definition: `Trace ${title} line by line.`,
      explanation: "Predict output before Run — great interview practice.",
      body: `        System.out.println("Step 1");
        System.out.println("Step 2 — ${title}");
        System.out.println("Step 3 — done");`,
      output: `Step 1\nStep 2 — ${title}\nStep 3 — done`,
    },
    {
      title: `${title} — Interview Question`,
      definition: `"Explain ${title}" — common interview opener.`,
      explanation: "Answer: what it is, when to use it, one real example.",
      body: `        System.out.println("Q: Explain ${title}?");
        System.out.println("A: [Write your 30-second answer]");`,
      output: `Q: Explain ${title}?\nA: [Write your 30-second answer]`,
    },
    {
      title: `${title} — Output Prediction`,
      definition: `What will this print? Tests ${title} knowledge.`,
      explanation: "Cover output, predict, then Run.",
      body: `        for (int i = 1; i <= 3; i++) System.out.print(i + " ");
        System.out.println();`,
      output: "1 2 3 ",
    },
    {
      title: `${title} — Edge Cases`,
      definition: `Edge cases for ${title}: empty, zero, boundary.`,
      explanation: "Professional code handles edge cases first.",
      body: `        int[] data = {};
        System.out.println(data.length == 0 ? "Edge case OK" : "Has data");`,
      output: "Edge case OK",
    },
    {
      title: `${title} — Find the Bug`,
      definition: `Spot the logic error related to ${title}.`,
      explanation: "Read each line — debugging is daily work.",
      body: `        int sum = 0;
        for (int i = 1; i <= 5; i++) sum += i;
        System.out.println("Sum = " + sum);`,
      output: "Sum = 15",
    },
    {
      title: `${title} — Real-World Use`,
      definition: `${title} in backend / enterprise Java.`,
      explanation: "Connect to Week projects and portfolio.",
      body: `        System.out.println("Production use: ${title}");`,
      output: `Production use: ${title}`,
    },
    {
      title: `${title} — Coding Challenge`,
      definition: `Timed challenge using ${title}.`,
      explanation: "Practice under 10 minutes.",
      body: `        int n = 5, f = 1;
        for (int i = 1; i <= n; i++) f *= i;
        System.out.println(n + "! = " + f);`,
      output: "5! = 120",
    },
    {
      title: `${title} — Best Practice`,
      definition: `Best practice for ${title} in clean Java.`,
      explanation: "Small methods, clear names, tests.",
      body: `        System.out.println("DO: keep it simple");
        System.out.println("DON'T: over-engineer ${title}");`,
      output: `DO: keep it simple\nDON'T: over-engineer ${title}`,
    },
    {
      title: `${title} — Quick Quiz`,
      definition: `Self-test on ${title}.`,
      explanation: "Write answers in Notes.",
      body: `        System.out.println("1. Define ${title}");
        System.out.println("2. One example");
        System.out.println("3. One mistake");`,
      output: `1. Define ${title}\n2. One example\n3. One mistake`,
    },
    {
      title: `${title} — Compare Approaches`,
      definition: `Compare two ways to use ${title}.`,
      explanation: "Interviewers love trade-off questions.",
      body: `        System.out.println("Approach A: simpler");
        System.out.println("Approach B: more flexible");`,
      output: "Approach A: simpler\nApproach B: more flexible",
    },
    {
      title: `${title} — Trace Table`,
      definition: `Fill a trace table for this ${title} snippet.`,
      explanation: "Track variable values each line.",
      body: `        int a = 1, b = 2;
        a = a + b;
        b = a - b;
        System.out.println("a=" + a + " b=" + b);`,
      output: "a=3 b=1",
    },
    {
      title: `${title} — Dry Run`,
      definition: `Paper dry-run before executing ${title} code.`,
      explanation: "Written rounds require dry runs.",
      body: `        int x = 0;
        for (int i = 0; i < 3; i++) x += i;
        System.out.println("x = " + x);`,
      output: "x = 3",
    },
    {
      title: `${title} — MCQ Style`,
      definition: `Multiple-choice style question on ${title}.`,
      explanation: "Pick A/B/C/D, then verify with Run.",
      body: `        System.out.println("Which is valid for ${title}?");
        System.out.println("Run code to confirm your pick.");`,
      output: `Which is valid for ${title}?\nRun code to confirm your pick.`,
    },
    {
      title: `${title} — Common Mistake`,
      definition: `Top mistake beginners make with ${title}.`,
      explanation: "Learn from others' errors.",
      body: `        System.out.println("Mistake: skipping edge cases");
        System.out.println("Fix: validate input first");`,
      output: "Mistake: skipping edge cases\nFix: validate input first",
    },
    {
      title: `${title} — Refactoring`,
      definition: `Refactor messy code using ${title} properly.`,
      explanation: "Clean code reads like prose.",
      body: `        int total = 0;
        for (int i = 1; i <= 4; i++) total += i;
        System.out.println("Total = " + total);`,
      output: "Total = 10",
    },
    {
      title: `${title} — Code Review`,
      definition: `Review this snippet — what would you improve?`,
      explanation: "Think like a senior developer.",
      body: `        System.out.println("Review: naming, tests, error handling");`,
      output: "Review: naming, tests, error handling",
    },
    {
      title: `${title} — Counter Pattern`,
      definition: `Count occurrences using ${title}.`,
      explanation: "Initialize count, increment in loop.",
      body: `        int count = 0;
        for (int i = 0; i < 10; i++) if (i % 2 == 0) count++;
        System.out.println("Evens = " + count);`,
      output: "Evens = 5",
    },
    {
      title: `${title} — Accumulator Pattern`,
      definition: `Running total / product with ${title}.`,
      explanation: "sum = 0; add each value in loop.",
      body: `        int sum = 0;
        for (int i = 1; i <= 10; i++) sum += i;
        System.out.println("Sum = " + sum);`,
      output: "Sum = 55",
    },
    {
      title: `${title} — Sentinel Loop`,
      definition: `Loop until sentinel value (e.g. -1).`,
      explanation: "Common with Scanner input.",
      body: `        int[] data = {5, 3, -1, 9};
        int i = 0, sum = 0;
        while (i < data.length && data[i] != -1) { sum += data[i]; i++; }
        System.out.println("Sum before -1 = " + sum);`,
      output: "Sum before -1 = 8",
    },
    {
      title: `${title} — Flag Variable`,
      definition: `Use a boolean flag with ${title}.`,
      explanation: "found = false; set true when condition met.",
      body: `        int[] arr = {2, 4, 7, 9};
        boolean found = false;
        for (int v : arr) if (v == 7) found = true;
        System.out.println("Found 7? " + found);`,
      output: "Found 7? true",
    },
    {
      title: `${title} — Search Pattern`,
      definition: `Linear search using ${title}.`,
      explanation: "Break early when element found.",
      body: `        int[] a = {3, 8, 1, 5};
        int target = 5, idx = -1;
        for (int i = 0; i < a.length; i++) if (a[i] == target) { idx = i; break; }
        System.out.println("Index = " + idx);`,
      output: "Index = 3",
    },
    {
      title: `${title} — Min / Max Pattern`,
      definition: `Find min or max with ${title}.`,
      explanation: "Start with first element, compare rest.",
      body: `        int[] a = {4, 1, 9, 3};
        int min = a[0];
        for (int i = 1; i < a.length; i++) if (a[i] < min) min = a[i];
        System.out.println("Min = " + min);`,
      output: "Min = 1",
    },
    {
      title: `${title} — Frequency Count`,
      definition: `Count how many times a value appears.`,
      explanation: "Loop and increment counter.",
      body: `        int[] a = {1, 2, 2, 2, 3};
        int target = 2, c = 0;
        for (int v : a) if (v == target) c++;
        System.out.println("Count of 2 = " + c);`,
      output: "Count of 2 = 3",
    },
    {
      title: `${title} — Reverse Traversal`,
      definition: `Process elements from end to start.`,
      explanation: "for (i = n-1; i >= 0; i--)",
      body: `        int[] a = {1, 2, 3};
        for (int i = a.length - 1; i >= 0; i--)
            System.out.print(a[i] + " ");`,
      output: "3 2 1 ",
    },
    {
      title: `${title} — Two Pointer Intro`,
      definition: `Two indices moving through data.`,
      explanation: "Used in arrays, strings, linked lists.",
      body: `        int[] a = {1, 2, 3, 4};
        int i = 0, j = a.length - 1;
        System.out.println("Pair sum = " + (a[i] + a[j]));`,
      output: "Pair sum = 5",
    },
    {
      title: `${title} — Nested Logic`,
      definition: `Combine ${title} with inner conditions.`,
      explanation: "Outer loop + inner if is very common.",
      body: `        for (int i = 1; i <= 5; i++) {
            if (i % 2 == 0) System.out.println(i + " is even");
        }`,
      output: "2 is even\n4 is even",
    },
    {
      title: `${title} — Interview Follow-up`,
      definition: `"What if input is null?" — follow-up on ${title}.`,
      explanation: "Always discuss edge cases in interviews.",
      body: `        String input = null;
        if (input == null) System.out.println("Handle null safely");
        else System.out.println(input);`,
      output: "Handle null safely",
    },
    {
      title: `${title} — Time Complexity`,
      definition: `Big-O of this ${title} snippet.`,
      explanation: "Count loop nesting for complexity.",
      body: `        int n = 100, ops = 0;
        for (int i = 0; i < n; i++) ops++;
        System.out.println("O(n) ops = " + ops);`,
      output: "O(n) ops = 100",
    },
    {
      title: `${title} — Print Pattern Warm-up`,
      definition: `Simple row printer — base for star patterns.`,
      explanation: "Outer = rows, inner = columns.",
      body: `        for (int i = 1; i <= 4; i++) {
            for (int j = 1; j <= i; j++) System.out.print("*");
            System.out.println();
        }`,
      output: "*\n**\n***\n****",
    },
    {
      title: `${title} — Number Series`,
      definition: `Print a number series with ${title}.`,
      explanation: "Classic aptitude + coding question.",
      body: `        for (int i = 1; i <= 8; i += 2)
            System.out.print(i + " ");`,
      output: "1 3 5 7 ",
    },
    {
      title: `${title} — Table Format Output`,
      definition: `Formatted multi-line output.`,
      explanation: "Use \\n and aligned println.",
      body: `        System.out.println("ID | Name");
        System.out.println("---+-----");
        System.out.println(" 1 | Java");`,
      output: "ID | Name\n---+-----\n 1 | Java",
    },
    {
      title: `${title} — Capstone Exercise`,
      definition: `Combine everything learned about ${title}.`,
      explanation: "Try without looking at notes.",
      body: `        System.out.println("Capstone: ${title}");
        System.out.println("Build a small program using this concept.");`,
      output: `Capstone: ${title}\nBuild a small program using this concept.`,
    },
  ];

  return templates.map((p, i) => {
    const difficulty = difficultyForIndex(i);
    return {
      ...p,
      difficulty,
      title: p.title.replace(`${title} — `, ""),
      body: scalePatternBody(p.body, difficulty, title),
      output: scalePatternOutput(p.output, difficulty),
    };
  });
}

export const LOOP_TOPIC_SLUGS = new Set([
  "for-loop",
  "while-loop",
  "do-while-loop",
  "nested-loops",
  "break-continue",
  "enhanced-for-loop",
]);
