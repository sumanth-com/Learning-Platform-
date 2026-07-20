/** Concise unique AI content — weeks 2–6 */

function e(answer, realWorld, code) {
  const o = { answer, realWorld };
  if (code) o.code = code;
  return o;
}

export const WEEKS_2_6 = {
  // Week 2 — Prompt engineering + debugging
  "ai-w2-t1": e(
    "Prompt engineering is writing clear instructions so AI returns useful answers. Include: goal, context, format, and limits. Vague prompts → vague or wrong code.",
    "Bad: 'fix my loop.' Good: paste method, failing input, expected output. You get a fix you can compile and test."
  ),
  "ai-w2-t2": e(
    "A strong prompt has five parts: **Role** ('Java tutor'), **Context** (JDK 21, your error), **Task** ('explain line 12'), **Format** ('bullet list'), **Constraints** ('no external libraries').",
    "Structured prompts feel like mini tickets — the same skill you use for Jira."
  ),
  "ai-w2-t3": e(
    "Context is background AI needs: language, framework, file snippet, what you already tried. Without it, AI guesses your stack wrong.",
    "Paste 15 lines around the bug, not the whole 500-line file — focused context beats noise."
  ),
  "ai-w2-t4": e(
    "Constraints bound the answer: 'Java only', 'no recursion', 'under 20 lines', 'beginner level'. They stop AI from over-engineering.",
    "'Solve without Streams' keeps Week 2 practice aligned with loops you're learning."
  ),
  "ai-w2-t5": e(
    "Examples in prompts show the pattern you want: sample input/output, or a similar solved problem. One example beats long description.",
    "Show one grade-calculation example; ask AI to write another for attendance — output matches your style."
  ),
  "ai-w2-t6": e(
    "Iterative prompting: refine in rounds. Round 1: explain. Round 2: 'What if array is empty?' Round 3: 'Add JUnit test.' Reference previous answers.",
    "Like code review threads — each message builds on the last."
  ),
  "ai-w2-t7": e(
    "To explain code: paste the snippet, ask 'trace with i=0,1,2' or 'explain in plain English'. Verify by running yourself.",
    "Use AI to understand a confusing for-loop from GitHub, then rewrite in your own words in comments."
  ),
  "ai-w2-t8": e(
    "Debug prompts need: full error message, stack trace, code, expected vs actual. Read trace bottom-up to **Caused by**.",
    "NullPointerException on line 24 — paste lines 20–30, not just 'it doesn't work.'"
  ),
  "ai-w2-t9": e(
    "Ask AI for optimization only after you have working code. Request Big-O and trade-offs. Small data: readable loops often beat clever tricks.",
    "AI suggests HashSet for duplicate check — good. For 10 elements, nested loop is fine too."
  ),
  "ai-w2-t10": e(
    "AI test ideas cover happy path well. You add: null, empty, boundary, negative. Ask 'what edge cases am I missing?'",
    "Calculator: AI lists divide-by-zero; you still write the assert yourself."
  ),
  "ai-w2-t11": e(
    "AI limits: invents APIs, wrong Java version behavior, confident nonsense. Always compile, run, and diff before trusting.",
    "AI suggests String.reverse() — doesn't exist. JDK docs + compiler catch it in seconds."
  ),
  "ai-w2-e1": e(
    "Ask AI to explain if-else with a real scenario (ticket pricing, grades). Then write your own version without looking.",
    "Prompt: 'Explain if-else using movie ticket discount for seniors and students. Java only, with println.'",
    "int age = 65;\nif (age >= 60) System.out.println(\"Senior discount\");\nelse System.out.println(\"Full price\");"
  ),
  "ai-w2-e2": e(
    "Ask AI to draw a loop as a table: iteration, i, output. Redraw the table by hand to verify.",
    "Visual trace of a for-loop printing stars — catches off-by-one errors early.",
    "for (int i = 1; i <= 3; i++) System.out.println(\"*\".repeat(i));"
  ),
  "ai-w2-e3": e(
    "Dry-run Fibonacci: track a, b each iteration on paper. Compare with AI's trace. Mismatch = learning moment.",
    "Interviewers ask dry-runs — AI is practice partner, not answer sheet.",
    "int a=0,b=1;\nfor(int i=0;i<5;i++){ System.out.print(a+\" \"); int n=a+b; a=b; b=n; }"
  ),
  "ai-w2-e4": e(
    "Ask AI to explain recursion as 'function calling itself until base case' — no code yet. Draw the call stack on paper.",
    "Preview before Week 8+ recursion deep-dive: factorial as 5! = 5 × 4!."
  ),
  "ai-w2-e5": e(
    "Paste nested loop finding duplicates. Ask for O(n) approach. Implement both; compare on array size 1000 vs 100000.",
    "Measure, don't guess — AI's Big-O advice is theory until you time it."
  ),
  "ai-w2-e6": e(
    "Find bugs yourself first (15 min). Then ask AI. Compare solutions — did you miss the same bug?",
    "Logic bug: loop uses <= length causing ArrayIndexOutOfBounds — classic AI and human catch."
  ),
  "ai-w2-e7": e(
    "Ask AI for 5 loop problems at your level. Solve without solution first. Use AI only for hints.",
    "Generating practice beats passive reading — you need reps, not paragraphs."
  ),
  "ai-w2-e8": e(
    "Calculator edge cases: divide by zero, overflow, empty input, invalid operator. List them, then write tests.",
    "AI lists cases; you own the test code — that's job-ready behavior."
  ),
  "ai-w2-e9": e(
    "Paste messy loop code. Ask: 'rename variables and add one comment per block.' Apply changes line by line.",
    "Readability refactors are safe first AI-assisted edits — behavior stays same."
  ),
  "ai-w2-e10": e(
    "Paste slow code. Ask why it's slow (complexity, repeated work). Fix one issue and re-time.",
    "Nested loop + repeated array scan — AI points to HashMap; you implement and verify."
  ),

  // Week 3 — Code review
  "ai-w3-t1": e(
    "AI code review scans for smells, naming, structure — fast first pass. You decide what to accept. It's a linter with opinions, not a senior engineer.",
    "Paste Student.java; AI flags public fields — you refactor to private + getters."
  ),
  "ai-w3-t2": e(
    "Code smells: long methods, duplicate code, magic numbers, god classes, poor names. AI spots many; you prioritize fixes.",
    "Three classes named Manager1, Manager2 — rename before feature work piles on."
  ),
  "ai-w3-t3": e(
    "Java naming: classes PascalCase, methods/variables camelCase, constants UPPER_SNAKE. Names reveal intent: calculateTotal not calc.",
    "isActive beats flag1 — boolean names answer a yes/no question."
  ),
  "ai-w3-t4": e(
    "Readable code: short methods, clear names, consistent formatting. If you need a comment to explain what, rename instead.",
    "AI suggests extracting a 40-line main() into processInput() and displayMenu()."
  ),
  "ai-w3-t5": e(
    "Maintainable code: easy to change without breaking. Small classes, single responsibility, tests. Today's shortcut is tomorrow's bug.",
    "Hardcoded tax rate in 5 places — one constant or config file saves future edits."
  ),
  "ai-w3-t6": e(
    "AI review is fast but misses business context and team conventions. Human review catches 'technically fine but wrong approach.'",
    "AI approves clever one-liner; teammate says 'we don't use Streams in legacy module.'"
  ),
  "ai-w3-t7": e(
    "Ask AI to improve class design: 'Review BankAccount for encapsulation and single responsibility.' Implement one suggestion at a time.",
    "Split Account and Transaction classes — AI draws the line; you verify domain logic."
  ),
  "ai-w3-t8": e(
    "AI drafts JavaDoc and README from code. You fix inaccuracies. Good for boilerplate, not for architecture decisions.",
    "Generate JavaDoc for public API methods; delete wrong @param names AI invented."
  ),
  "ai-w3-t9": e(
    "Refactor with AI: ask for extract method, rename, remove duplication. Run program after each small change.",
    "Extract validateInput() from main — one refactor, one test run."
  ),
  "ai-w3-t10": e(
    "AI can suggest UML from class lists. Validate relationships match your code — arrows and cardinalities often wrong.",
    "Student 1—* Course diagram — check if your code actually supports many courses."
  ),
  "ai-w3-e1": e(
    "Paste Student class. Ask: encapsulation, naming, constructor issues. Fix top 2 findings yourself.",
    "Public fields → private + getters is the most common Week 3 win."
  ),
  "ai-w3-e2": e(
    "List all single-letter variables in your file. Ask AI for better names. Rename in IDE (refactor tool).",
    "IDE rename is safer than AI find-replace — catches references."
  ),
  "ai-w3-e3": e(
    "Ask AI why encapsulation matters — then explain aloud without reading. Add private balance + deposit() to a class.",
    "Interview classic: 'Why private fields?' — control validation in one place."
  ),
  "ai-w3-e4": e(
    "List your classes and fields. Ask for PlantUML or text UML. Draw correct version by hand.",
    "Wrong multiplicity on diagram → wrong DB schema later."
  ),
  "ai-w3-e5": e(
    "Ask AI to find duplicate code blocks. Extract one shared method. Run tests.",
    "Copy-pasted validation in 3 methods → one validateAge() helper."
  ),
  "ai-w3-e6": e(
    "Paste constructors. Ask for improvements: validation, chaining, defaults. Apply one fix.",
    "Constructor setting negative age — add guard clause."
  ),
  "ai-w3-e7": e(
    "Generate JavaDoc for public methods. Edit wrong descriptions. Match team style (@param, @return).",
    "JavaDoc is contract for API consumers — worth getting right on libraries."
  ),
  "ai-w3-e8": e(
    "Ask: 'What design mistakes do you see?' — god class, tight coupling, static abuse. Pick one to fix.",
    "Utility class with 20 static methods — split by domain."
  ),
  "ai-w3-e9": e(
    "Describe two designs; ask AI to compare. You choose with reasoning — AI doesn't know your deadlines.",
    "Inheritance vs composition for Employee types — trade-off discussion for interviews."
  ),
  "ai-w3-e10": e(
    "Ask for SOLID in simple terms with Java examples. Explain one principle without notes.",
    "Single Responsibility: UserService saves users; EmailService sends mail — not one class doing both."
  ),

  // Week 4 — Debugging
  "ai-w4-t1": e(
    "AI-assisted debugging: you reproduce the bug, paste evidence, AI suggests causes. You verify — never merge blind.",
    "Stack trace + 10 lines of code → hypothesis list → test each."
  ),
  "ai-w4-t2": e(
    "Stack trace reads bottom-up. Top = where it crashed. **Caused by** = root. Your code appears with file:line.",
    "Exception at Service.java:45, caused by NullPointer at User.java:12 — fix line 12 first."
  ),
  "ai-w4-t3": e(
    "Ask AI to explain exceptions in plain English: NPE, ArrayIndexOutOfBounds, NumberFormat. Map to your line of code.",
    "'NPE at getName()' → object was null before method call."
  ),
  "ai-w4-t4": e(
    "Refactor prompts: 'Extract duplicate logic, keep behavior.' Small steps + run after each.",
    "Duplicate if-blocks in switch cases → shared helper method."
  ),
  "ai-w4-t5": e(
    "AI generates JavaDoc from signatures. Review @param names and descriptions — often wrong on complex types.",
    "Multi-line JavaDoc on public API — first draft from AI, accuracy from you."
  ),
  "ai-w4-t6": e(
    "Code review via AI: ask for bugs, not style only. Cross-check with your own read — AI misses logic errors.",
    "AI misses off-by-one; you catch it in manual review — both layers matter."
  ),
  "ai-w4-t7": e(
    "Ask for unit test **ideas**, not full suites. You implement — tests teach the code.",
    "Method parseDate — AI lists null, empty, invalid format, leap year."
  ),
  "ai-w4-t8": e(
    "AI can't run your code or see production data. Heisenbugs and race conditions need logs and debugger, not chat alone.",
    "Intermittent failure — AI guesses; you add logging and reproduce."
  ),
  "ai-w4-e1": e(
    "Trigger NPE in a small program. Paste trace. Ask AI to explain each frame. Fix with null check.",
    "String s = null; s.length() — classic first NPE lesson.",
    "if (s != null) System.out.println(s.length());"
  ),
  "ai-w4-e2": e(
    "Ask why ArrayIndexOutOfBounds happens. Relate to loop condition using array.length incorrectly.",
    "for (i=0; i<=arr.length; i++) — should be i < arr.length."
  ),
  "ai-w4-e3": e(
    "Paste full stack trace. Label: crash site, root cause, your fix line.",
    "Reading traces calmly is a skill — practice on homework bugs before on-call."
  ),
  "ai-w4-e4": e(
    "Find duplicated if/else blocks. Ask AI to extract method. Verify output unchanged.",
    "Same validation in add() and update() → validateStudent() once."
  ),
  "ai-w4-e5": e(
    "Describe inheritance hierarchy. Ask if design fits Liskov. Simplify if subclass breaks parent contract.",
    "Square extends Rectangle with setWidth breaking area — classic design smell."
  ),
  "ai-w4-e6": e(
    "Ask: interface vs abstract class for your scenario. Build tiny example of each.",
    "Multiple inheritance of type → interface. Shared base code → abstract class."
  ),
  "ai-w4-e7": e(
    "Generate JavaDoc for one class. Open in IDE preview. Fix errors.",
    "Good JavaDoc shows in IDE hover — teammates read it daily."
  ),
  "ai-w4-e8": e(
    "SOLID with examples: one principle per day. Single Responsibility first — split a fat class.",
    "Interview: name SOLID letters and one Java example each."
  ),
  "ai-w4-e9": e(
    "List your packages. Ask if structure is clear. Move one misplaced class.",
    "model classes in controller package — move to model/ for standard layout."
  ),
  "ai-w4-e10": e(
    "Full project review: bugs, structure, naming. Fix highest-impact issue before marking done.",
    "Portfolio project with one solid README + clean package structure impresses recruiters."
  ),

  // Week 5 — Optimization
  "ai-w5-t1": e(
    "Optimization = make code faster or leaner **after** it works. Measure first. Premature optimization wastes time.",
    "Working O(n²) for 100 rows ships; optimize when data grows."
  ),
  "ai-w5-t2": e(
    "Time complexity: how runtime grows with input size. O(1) constant, O(n) linear, O(n²) nested loops. Ask AI, then verify.",
    "10k users × nested loop = noticeable lag — HashMap lookup fixes it."
  ),
  "ai-w5-t3": e(
    "Space complexity: extra memory used. Trading space for time (cache, HashMap) is common and OK if memory fits.",
    "Store seen IDs in HashSet — O(n) space for O(1) lookup."
  ),
  "ai-w5-t4": e(
    "Paste slow method + input size. Ask for bottleneck and fix. Time both versions.",
    "AI identifies repeated linear scan — you add index map and benchmark."
  ),
  "ai-w5-t5": e(
    "AI suggests test cases; you write assertions. Focus on boundaries: 0, 1, max, duplicates.",
    "Collection tests: empty, single element, duplicates, null element if allowed."
  ),
  "ai-w5-t6": e(
    "Ask which collection fits: random access → ArrayList; frequent insert middle → LinkedList; fast lookup → HashMap.",
    "Counting frequencies → HashMap<String,Integer>, not nested loops."
  ),
  "ai-w5-t7": e(
    "Readable beats clever for team code. Ask AI to simplify over-nested loops if performance allows.",
    "Extract filter logic to named method — next dev thanks you."
  ),
  "ai-w5-t8": e(
    "AI review for performance smells: nested loops, boxing in tight loops, wrong collection choice.",
    "Autoboxing in hot loop — AI flags; you use primitive int array."
  ),
  "ai-w5-e1": e(
    "Describe 3 scenarios (lookup, sort, queue). Ask which Java collection. Justify each answer.",
    "LRU cache → LinkedHashMap; priority tasks → PriorityQueue."
  ),
  "ai-w5-e2": e(
    "Compare ArrayList vs LinkedList with AI. Write micro-benchmark for get(5000) on 10k list.",
    "ArrayList wins random access — measure proves textbook claim."
  ),
  "ai-w5-e3": e(
    "HashMap vs TreeMap: when need sorted keys? Write 5-line example of each.",
    "TreeMap for range queries on keys; HashMap for plain speed."
  ),
  "ai-w5-e4": e(
    "Ask how HashSet avoids duplicates internally (hashCode, equals). Implement contains duplicate check both ways.",
    "Understanding equals/hashCode contract prevents Set bugs with custom objects."
  ),
  "ai-w5-e5": e(
    "Review Student Management System for collection misuse. Fix one hot path.",
    "Linear search in list on every login → Map by studentId."
  ),
  "ai-w5-e6": e(
    "Replace nested loop duplicate-finder with HashSet. Same results, time both.",
    "Classic optimization exercise — appears in interviews and real code review."
  ),
  "ai-w5-e7": e(
    "Ask Big-O of your methods. Explain n² loop aloud in 30 seconds.",
    "Interview: 'What's complexity of this nested for?' — practice here."
  ),
  "ai-w5-e8": e(
    "List edge tests for a method using collections. Implement 3 as JUnit or main asserts.",
    "Empty list, null list, list with null element — define expected behavior."
  ),
  "ai-w5-e9": e(
    "Paste code using Vector or Hashtable. Ask for modern alternative. Migrate if safe.",
    "Legacy synchronized collections → ArrayList + Collections.synchronizedList or concurrent types."
  ),
  "ai-w5-e10": e(
    "Ask memory difference: ArrayList of 1M Integers vs int[]. Discuss boxing cost.",
    "Production lesson: primitives in tight memory paths matter at scale."
  ),

  // Week 6 — Streams & concurrency
  "ai-w6-t1": e(
    "AI converts loops to Streams: filter, map, collect. Learn the loop version first — Streams are syntax sugar, not magic.",
    "for-loop sum → stream().mapToInt().sum() — same logic, different style."
  ),
  "ai-w6-t2": e(
    "Lambdas: (x) -> x * 2. Ask AI to explain parameter, arrow, body. Rewrite as anonymous class to compare.",
    "Comparator.comparing(Student::getName) — method reference shorthand."
  ),
  "ai-w6-t3": e(
    "Complex pipeline: ask AI to label each step. Read left-to-right: source → intermediate → terminal.",
    "list.stream().filter().map().sorted().collect() — one operation per line for readability."
  ),
  "ai-w6-t4": e(
    "Inefficient: stream inside loop, repeated sorting, parallel on tiny data. AI flags; you measure.",
    "parallelStream() on 10 items — overhead wins nothing."
  ),
  "ai-w6-t5": e(
    "Thread safety: ask AI when to use synchronized, ConcurrentHashMap, atomic classes. Race conditions need reproduction.",
    "counter++ on shared int across threads — broken; AtomicInteger fixes."
  ),
  "ai-w6-t6": e(
    "Concurrency test ideas: multiple threads, same resource, assert final count. Flaky tests need careful design.",
    "AI suggests thread pool test; you run 100 iterations to spot races."
  ),
  "ai-w6-t7": e(
    "Profile before parallelizing. AI suggests ExecutorService for I/O-bound tasks — not CPU magic on one core.",
    "Blocking HTTP calls → thread pool; CPU math → maybe not more threads."
  ),
  "ai-w6-t8": e(
    "AI may suggest parallelStream everywhere — wrong for small data, shared state, or ordered requirements.",
    "Order-sensitive pipeline + parallel = subtle bugs — stick to sequential first."
  ),
  "ai-w6-e1": e(
    "Convert for-loop filtering list to stream().filter().collect(). Same output, compare readability.",
    "Team code review often debates loop vs Stream — know both.",
    "list.stream().filter(x -> x > 0).collect(Collectors.toList());"
  ),
  "ai-w6-e2": e(
    "Paste complex lambda. Ask line-by-line explanation. Rewrite in plain loop.",
    "If you can't read it as a loop, don't ship it."
  ),
  "ai-w6-e3": e(
    "Compare Streams vs loops: debugging, performance, readability. When would you choose each?",
    "Breakpoints in loops are easier for juniors — valid reason to prefer loops."
  ),
  "ai-w6-e4": e(
    "Optimize list processing: remove repeated stream passes. Combine filter+map in one pipeline.",
    "Three separate streams over same list → one pipeline, one pass."
  ),
  "ai-w6-e5": e(
    "Ask visual explanation of synchronized block. Draw two threads and lock.",
    "Only one thread inside synchronized method at a time — mutex concept."
  ),
  "ai-w6-e6": e(
    "Write buggy shared counter. Ask AI why race happens. Fix with synchronization or AtomicInteger.",
    "Classic interview: why counter++ is not atomic."
  ),
  "ai-w6-e7": e(
    "ExecutorService: submit tasks, shutdown, awaitTermination. Ask for thread pool sizing basics.",
    "Fixed pool of 4 for 4-core CPU — starting point, not law."
  ),
  "ai-w6-e8": e(
    "Review Stream code for readability. Split long pipeline or add method references.",
    "Extract .filter(this::isActive) — named predicate reads better."
  ),
  "ai-w6-e9": e(
    "Ask ExecutorService analogy (workers, queue). Implement 3 tasks printing thread name.",
    "Thread pool = limited workers pulling jobs from queue — factory floor model."
  ),
  "ai-w6-e10": e(
    "Generate concurrent test scenarios. Expect flakiness — use CountDownLatch for coordination.",
    "Multithreaded tests are hard — AI gives ideas; you stabilize with proper sync."
  ),
};
