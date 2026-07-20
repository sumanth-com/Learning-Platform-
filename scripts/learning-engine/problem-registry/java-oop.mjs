import {
  buildJavaLessons,
  buildOopLessons,
  buildCollectionsLessons,
  buildJava8Lessons,
  buildMultithreadingLessons,
} from "../builders.mjs";
import {
  enrichProblem,
  javaSolution,
  clsName,
  defaultApproaches,
} from "../lib/rich-fields.mjs";
import { generateCuratedProblems } from "../lib/curated-engine.mjs";
import {
  buildWeek1FundamentalsProblem,
  isWeek1FundamentalsTopic,
} from "../lib/week1-fundamentals-bank.mjs";
import {
  buildWeek2ControlFlowProblem,
  isWeek2ControlFlowTopic,
} from "../lib/week2-control-flow-bank.mjs";
import {
  buildWeek3OopProblem,
  isWeek3OopTopic,
} from "../lib/week3-oop-bank.mjs";
import { maybeInjectBug } from "../lib/universal-variant-bank.mjs";
import { getQuotasForTopic, estimatedMinutes } from "../lib/problem-type-spec.mjs";

const DIFFICULTIES = ["easy", "medium", "hard"];

const CATEGORY_BY_SLUG = {
  "what-is-java": "java",
  "jdk-jre-jvm": "java",
  "variables-data-types": "java",
  operators: "java",
  "type-casting": "java",
  "scanner-input": "java",
  "first-java-program": "java",
  "if-else": "java",
  switch: "java",
  "for-loop": "java",
  "while-loop": "java",
  methods: "java",
  "arrays-1d": "java",
  "arrays-2d": "java",
  "try-catch": "java",
  "throw-throws": "java",
  "custom-exceptions": "java",
  "file-io": "java",
  packages: "java",

  "classes-objects": "oop",
  constructors: "oop",
  encapsulation: "oop",
  inheritance: "oop",
  polymorphism: "oop",
  interfaces: "oop",
  abstraction: "oop",

  arraylist: "collections",
  hashmap: "collections",
  "hashset-treeset": "collections",

  generics: "java8",
  "lambda-streams": "java8",

  "thread-basics": "multithreading",
  synchronization: "multithreading",
  deadlock: "multithreading",
  "executor-service": "multithreading",
  "completable-future": "multithreading",
};

function hashSeed(input) {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (h * 33 + input.charCodeAt(i)) >>> 0;
  return h;
}

function titleCaseSlug(slug) {
  return slug
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

function buildJavaCode(slug, className, difficulty, idx) {
  const n = (hashSeed(`${slug}-${difficulty}-${idx}`) % 20) + 5;

  if (slug === "first-java-program" && difficulty === "easy" && idx === 0) {
    const output = "Hello, Java Backend!";
    return {
      code: javaSolution(
        className,
        [],
        "",
        '        System.out.println("Hello, Java Backend!");'
      ),
      expectedOutput: output,
      exampleOutput: output,
      exampleInput: "No input",
      constraints: ["Must define class and main method correctly"],
      dryRun: "Program enters main and prints the greeting.",
      visualization: "JVM -> load class -> run main -> stdout",
      explanation: "This is a complete and valid first Java program.",
    };
  }

  if (["try-catch", "throw-throws", "custom-exceptions"].includes(slug)) {
    const body =
      slug === "custom-exceptions"
        ? `    static class AgeValidationException extends Exception {
        AgeValidationException(String message) { super(message); }
    }

    static void validateAge(int age) throws AgeValidationException {
        if (age < 18) throw new AgeValidationException("Age must be >= 18");
    }`
        : `    static int safeDivide(int a, int b) ${
            slug === "throw-throws" ? "throws ArithmeticException " : ""
          }{
        if (b == 0) throw new ArithmeticException("Division by zero");
        return a / b;
    }`;
    const mainBody =
      slug === "custom-exceptions"
        ? `        try {
            validateAge(${n});
            System.out.println("Eligible");
        } catch (AgeValidationException ex) {
            System.out.println(ex.getMessage());
        }`
        : `        try {
            System.out.println(safeDivide(${n}, ${idx === 1 ? 0 : 2}));
        } catch (ArithmeticException ex) {
            System.out.println(ex.getMessage());
        }`;
    const output =
      slug === "custom-exceptions"
        ? n < 18
          ? "Age must be >= 18"
          : "Eligible"
        : idx === 1
        ? "Division by zero"
        : `${Math.floor(n / 2)}`;
    return {
      code: javaSolution(className, [], `${body}\n`, mainBody),
      expectedOutput: output,
      exampleOutput: output,
      exampleInput: "No input",
      constraints: ["Use proper exception handling flow"],
      dryRun: "Method throws exception for invalid input; catch block handles it.",
      visualization: "try -> risky call -> throw -> catch -> print message",
      explanation: "The problem demonstrates exception propagation and handling.",
    };
  }

  if (slug === "file-io") {
    const output = `${n}\n${n + 1}\n${n + 2}`;
    return {
      code: javaSolution(
        className,
        ["java.io.*"],
        "",
        `        String content = "${n}\\n${n + 1}\\n${n + 2}";
        try (BufferedReader br = new BufferedReader(new StringReader(content))) {
            String line;
            while ((line = br.readLine()) != null) {
                System.out.println(line);
            }
        } catch (IOException ex) {
            System.out.println(ex.getMessage());
        }`
      ),
      expectedOutput: output,
      exampleOutput: output,
      exampleInput: "Simulated file content in StringReader",
      constraints: ["Close resources using try-with-resources"],
      dryRun: "BufferedReader reads each line until EOF.",
      visualization: "source -> BufferedReader -> while(readLine) -> print",
      explanation: "This models file reading safely without leaking resources.",
    };
  }

  if (slug === "scanner-input") {
    const a = n;
    const b = n + 3;
    const output = `Sum = ${a + b}`;
    return {
      code: javaSolution(
        className,
        ["java.util.Scanner"],
        "",
        `        String input = "${a} ${b}";
        Scanner sc = new Scanner(input);
        int x = sc.nextInt();
        int y = sc.nextInt();
        System.out.println("Sum = " + (x + y));
        sc.close();`
      ),
      expectedOutput: output,
      exampleOutput: output,
      exampleInput: `${a} ${b}`,
      constraints: ["Read integers in correct order"],
      dryRun: "Scanner tokenizes input and nextInt parses both values.",
      visualization: "input stream -> scanner tokens -> parsed ints -> sum",
      explanation: "Scanner is used to parse user-style input tokens.",
    };
  }

  if (slug === "switch") {
    const day = (n % 5) + 1;
    const map = { 1: "Mon", 2: "Tue", 3: "Wed", 4: "Thu", 5: "Fri" };
    const output = map[day];
    return {
      code: javaSolution(
        className,
        [],
        "",
        `        int day = ${day};
        switch (day) {
            case 1 -> System.out.println("Mon");
            case 2 -> System.out.println("Tue");
            case 3 -> System.out.println("Wed");
            case 4 -> System.out.println("Thu");
            case 5 -> System.out.println("Fri");
            default -> System.out.println("Weekend");
        }`
      ),
      expectedOutput: output,
      exampleOutput: output,
      exampleInput: `${day}`,
      constraints: ["Use switch expression style safely"],
      dryRun: `day=${day} matches case ${day}.`,
      visualization: "switch(day) -> branch matched -> print",
      explanation: "Switch helps with multi-way branching over known cases.",
    };
  }

  if (slug === "if-else") {
    const mark = (n * 7) % 101;
    const grade = mark >= 90 ? "A" : mark >= 75 ? "B" : mark >= 60 ? "C" : "D";
    return {
      code: javaSolution(
        className,
        [],
        "",
        `        int mark = ${mark};
        if (mark >= 90) System.out.println("A");
        else if (mark >= 75) System.out.println("B");
        else if (mark >= 60) System.out.println("C");
        else System.out.println("D");`
      ),
      expectedOutput: grade,
      exampleOutput: grade,
      exampleInput: `${mark}`,
      constraints: ["Branching logic must be mutually exclusive"],
      dryRun: `mark=${mark} falls into grade ${grade}.`,
      visualization: "if -> else-if chain -> matched branch",
      explanation: "If-else chains model ordered decision logic.",
    };
  }

  if (slug === "for-loop" || slug === "while-loop") {
    const total = ((n + 1) * n) / 2;
    const loopCode =
      slug === "for-loop"
        ? `        int sum = 0;
        for (int i = 1; i <= ${n}; i++) sum += i;
        System.out.println(sum);`
        : `        int i = 1, sum = 0;
        while (i <= ${n}) {
            sum += i;
            i++;
        }
        System.out.println(sum);`;
    return {
      code: javaSolution(className, [], "", loopCode),
      expectedOutput: `${total}`,
      exampleOutput: `${total}`,
      exampleInput: `${n}`,
      constraints: ["Loop must terminate correctly"],
      dryRun: `Accumulate 1..${n} to get ${total}.`,
      visualization: "counter progresses -> sum updates each iteration",
      explanation: "The loop iterates from 1..N and computes a running total.",
    };
  }

  if (slug === "arrays-1d" || slug === "arrays-2d") {
    const output = slug === "arrays-1d" ? `${n + 2}` : `${3 * n}`;
    const code =
      slug === "arrays-1d"
        ? `        int[] arr = {${n - 2}, ${n}, ${n + 2}};
        int max = arr[0];
        for (int v : arr) if (v > max) max = v;
        System.out.println(max);`
        : `        int[][] grid = {{${n}, ${n + 1}}, {${n + 2}, ${n - 3}}};
        int sum = 0;
        for (int r = 0; r < grid.length; r++) {
            for (int c = 0; c < grid[r].length; c++) {
                sum += grid[r][c];
            }
        }
        System.out.println(sum);`;
    return {
      code: javaSolution(className, [], "", code),
      expectedOutput: output,
      exampleOutput: output,
      exampleInput: "Built-in sample array",
      constraints: ["Use valid indices and nested loops where needed"],
      dryRun: "Traverse all elements and aggregate required metric.",
      visualization: "array cells -> iteration pointers -> result variable",
      explanation: "Array traversal is the base operation for array interview tasks.",
    };
  }

  if (slug === "methods") {
    const output = `${n * n}`;
    return {
      code: javaSolution(
        className,
        [],
        `    static int square(int x) { return x * x; }
`,
        `        System.out.println(square(${n}));`
      ),
      expectedOutput: output,
      exampleOutput: output,
      exampleInput: `${n}`,
      constraints: ["Method should be reusable and side-effect free"],
      dryRun: `square(${n}) returns ${n * n}.`,
      visualization: "main -> method call -> return value -> print",
      explanation: "Methods encapsulate logic and make code reusable.",
    };
  }

  if (slug === "packages") {
    const output = "JAVA";
    return {
      code: javaSolution(
        className,
        ["java.util.Locale"],
        "",
        `        String lang = "java";
        System.out.println(lang.toUpperCase(Locale.ROOT));`
      ),
      expectedOutput: output,
      exampleOutput: output,
      exampleInput: "java",
      constraints: ["Use imports correctly"],
      dryRun: "Import Locale and convert string to uppercase safely.",
      visualization: "import resolved -> method call -> transformed output",
      explanation: "Packages and imports organize and reuse library classes.",
    };
  }

  const cast = Math.floor(n / 2);
  return {
    code: javaSolution(
      className,
      [],
      "",
      `        double value = ${n}.75;
        int narrowed = (int) value;
        int adjusted = narrowed + ${idx + 1};
        System.out.println(adjusted);`
    ),
    expectedOutput: `${cast + idx + 1}`,
    exampleOutput: `${cast + idx + 1}`,
    exampleInput: `${n}.75`,
    constraints: ["Handle primitive operations safely"],
    dryRun: "Cast removes decimal part, then arithmetic applies.",
    visualization: "double value -> cast to int -> compute final answer",
    explanation: "This exercise reinforces primitive operations and conversions.",
  };
}

function buildOopCode(slug, className, difficulty, idx) {
  const n = (hashSeed(`${slug}-${difficulty}-${idx}`) % 40) + 10;

  if (slug === "encapsulation") {
    const start = n;
    const deposit = idx + 15;
    return {
      code: javaSolution(
        className,
        [],
        `    static class BankAccount {
        private int balance;
        BankAccount(int balance) { this.balance = balance; }
        public void deposit(int amount) { if (amount > 0) balance += amount; }
        public int getBalance() { return balance; }
    }
`,
        `        BankAccount acc = new BankAccount(${start});
        acc.deposit(${deposit});
        System.out.println(acc.getBalance());`
      ),
      expectedOutput: `${start + deposit}`,
      exampleOutput: `${start + deposit}`,
      exampleInput: `start=${start}, deposit=${deposit}`,
      constraints: ["Keep balance private; mutate only through methods"],
      dryRun: "Constructor sets private balance; deposit updates it; getter prints final value.",
      visualization: "private field → deposit() → getBalance() → stdout",
      explanation: "Encapsulation hides balance and exposes safe deposit/getBalance APIs.",
    };
  }

  if (slug === "constructors") {
    return {
      code: javaSolution(
        className,
        [],
        `    static class Student {
        String name;
        int marks;
        Student(String name, int marks) {
            this.name = name;
            this.marks = marks;
        }
    }
`,
        `        Student s = new Student("Asha", ${n});
        System.out.println(s.name + ":" + s.marks);`
      ),
      expectedOutput: `Asha:${n}`,
      exampleOutput: `Asha:${n}`,
      exampleInput: `name=Asha, marks=${n}`,
      constraints: ["Initialize fields only through the constructor"],
      dryRun: "Constructor assigns name and marks; main prints them.",
      visualization: "new Student(...) → fields ready → stdout",
      explanation: "Parameterized constructors initialize object state at creation time.",
    };
  }

  if (slug === "classes-objects") {
    return {
      code: javaSolution(
        className,
        [],
        `    static class Car {
        int speed;
        void accelerate() { speed += 10; }
    }
`,
        `        Car c = new Car();
        c.speed = ${n};
        c.accelerate();
        System.out.println(c.speed);`
      ),
      expectedOutput: `${n + 10}`,
      exampleOutput: `${n + 10}`,
      exampleInput: `speed=${n}`,
      constraints: ["Create an object and call an instance method"],
      dryRun: "Object created, field set, method updates state, print speed.",
      visualization: "class → object → method → stdout",
      explanation: "Classes define blueprints; objects hold state and behavior.",
    };
  }

  const body = `    static class Account {
        private final String name;
        private int balance;
        Account(String name, int balance) { this.name = name; this.balance = balance; }
        void deposit(int amount) { balance += amount; }
        int getBalance() { return balance; }
        String getName() { return name; }
    }`;

  const polyBody = `    static abstract class Shape { abstract int area(); }
    static class Rectangle extends Shape {
        int w, h;
        Rectangle(int w, int h) { this.w = w; this.h = h; }
        @Override int area() { return w * h; }
    }`;

  const interfaceBody = `    interface Billable { int amount(); }
    static class Invoice implements Billable {
        private final int units;
        Invoice(int units) { this.units = units; }
        @Override public int amount() { return units * 50; }
    }`;

  let code = "";
  let output = "";

  if (["interfaces", "abstraction"].includes(slug)) {
    code = javaSolution(
      className,
      [],
      `${interfaceBody}\n${slug === "abstraction" ? `${polyBody}\n` : ""}`,
      slug === "abstraction"
        ? `        Shape s = new Rectangle(${idx + 2}, ${idx + 4});
        Billable bill = new Invoice(${idx + 3});
        System.out.println(s.area() + bill.amount());`
        : `        Billable bill = new Invoice(${idx + 3});
        System.out.println(bill.amount());`
    );
    output =
      slug === "abstraction"
        ? `${(idx + 2) * (idx + 4) + (idx + 3) * 50}`
        : `${(idx + 3) * 50}`;
  } else if (["inheritance", "polymorphism"].includes(slug)) {
    code = javaSolution(
      className,
      [],
      `${polyBody}\n`,
      `        Shape shape = new Rectangle(${idx + 3}, ${idx + 5});
        System.out.println(shape.area());`
    );
    output = `${(idx + 3) * (idx + 5)}`;
  } else {
    code = javaSolution(
      className,
      [],
      `${body}\n`,
      `        Account acc = new Account("Dev", ${n});
        acc.deposit(${idx + 5});
        System.out.println(acc.getName() + ":" + acc.getBalance());`
    );
    output = `Dev:${n + idx + 5}`;
  }

  return {
    code,
    expectedOutput: output,
    exampleOutput: output,
    exampleInput: "No input",
    constraints: ["Use object state and methods correctly"],
    dryRun: "Object is created, behavior invoked, and final state printed.",
    visualization: "Class blueprint -> object instance -> method invocation -> output",
    explanation: "The lesson applies OOP constructs to model simple domain behavior.",
  };
}

function buildCollectionsCode(slug, className, difficulty, idx) {
  const n = idx + (difficulty === "hard" ? 7 : difficulty === "medium" ? 4 : 2);
  let code = "";
  let output = "";
  if (slug === "arraylist") {
    code = javaSolution(
      className,
      ["java.util.*"],
      "",
      `        List<Integer> nums = new ArrayList<>(List.of(${n}, ${n + 1}, ${n + 2}));
        nums.remove(1);
        nums.add(${n + 5});
        System.out.println(nums);`
    );
    output = `[${n}, ${n + 2}, ${n + 5}]`;
  } else if (slug === "hashmap") {
    code = javaSolution(
      className,
      ["java.util.*"],
      "",
      `        Map<String, Integer> score = new HashMap<>();
        score.put("A", ${n});
        score.put("B", ${n + 2});
        score.put("A", score.get("A") + 1);
        System.out.println(score.get("A") + score.get("B"));`
    );
    output = `${2 * n + 3}`;
  } else {
    code = javaSolution(
      className,
      ["java.util.*"],
      "",
      `        Set<Integer> hash = new HashSet<>(List.of(${n}, ${n}, ${n + 1}));
        Set<Integer> tree = new TreeSet<>(hash);
        tree.add(${n + 3});
        System.out.println(tree);`
    );
    output = `[${n}, ${n + 1}, ${n + 3}]`;
  }
  return {
    code,
    expectedOutput: output,
    exampleOutput: output,
    exampleInput: "No input",
    constraints: ["Use the correct collection semantics for the task"],
    dryRun: "Elements are inserted and transformed through collection APIs.",
    visualization: "collection operations -> final structure state",
    explanation: "Collections simplify dynamic storage and lookup operations.",
  };
}

function buildJava8Code(slug, className, difficulty, idx) {
  const n = idx + 2;
  let code = "";
  let output = "";
  if (slug === "generics") {
    code = javaSolution(
      className,
      ["java.util.*"],
      `    static <T> T first(List<T> list) { return list.get(0); }
`,
      `        List<String> names = List.of("java", "spring", "boot");
        System.out.println(first(names).toUpperCase());`
    );
    output = "JAVA";
  } else {
    code = javaSolution(
      className,
      ["java.util.*", "java.util.stream.*"],
      "",
      `        List<Integer> nums = List.of(${n}, ${n + 1}, ${n + 2}, ${n + 3});
        int sum = nums.stream()
            .filter(x -> x % 2 == 0)
            .map(x -> x * x)
            .reduce(0, Integer::sum);
        System.out.println(sum);`
    );
    const values = [n, n + 1, n + 2, n + 3].filter((x) => x % 2 === 0).map((x) => x * x);
    output = `${values.reduce((a, b) => a + b, 0)}`;
  }
  return {
    code,
    expectedOutput: output,
    exampleOutput: output,
    exampleInput: "No input",
    constraints: ["Prefer type-safe and functional style"],
    dryRun: "Pipeline transforms source values to final aggregate.",
    visualization: "source list -> stream stages -> reduced result",
    explanation: "Java 8 features reduce boilerplate and improve readability.",
  };
}

function buildMultithreadingCode(slug, className, difficulty, idx) {
  const n = idx + 1;
  let code = "";
  let output = "";

  if (slug === "thread-basics") {
    code = javaSolution(
      className,
      [],
      "",
      `        Thread t = new Thread(() -> System.out.println("worker-" + ${n}));
        t.start();
        try { t.join(); } catch (InterruptedException ex) { Thread.currentThread().interrupt(); }
        System.out.println("done");`
    );
    output = `worker-${n}\ndone`;
  } else if (slug === "synchronization") {
    code = javaSolution(
      className,
      [],
      `    static class Counter {
        private int value = 0;
        synchronized void inc() { value++; }
        int get() { return value; }
    }
`,
      `        Counter c = new Counter();
        Thread t1 = new Thread(() -> { for (int i = 0; i < 1000; i++) c.inc(); });
        Thread t2 = new Thread(() -> { for (int i = 0; i < 1000; i++) c.inc(); });
        t1.start(); t2.start();
        try { t1.join(); t2.join(); } catch (InterruptedException ex) { Thread.currentThread().interrupt(); }
        System.out.println(c.get());`
    );
    output = "2000";
  } else if (slug === "deadlock") {
    code = javaSolution(
      className,
      [],
      "",
      `        Object left = new Object();
        Object right = new Object();
        Runnable safeTask = () -> {
            synchronized (left) {
                synchronized (right) {
                    System.out.println("acquired");
                }
            }
        };
        Thread t1 = new Thread(safeTask);
        Thread t2 = new Thread(safeTask);
        t1.start(); t2.start();
        try { t1.join(); t2.join(); } catch (InterruptedException ex) { Thread.currentThread().interrupt(); }
        System.out.println("completed");`
    );
    output = "acquired\nacquired\ncompleted";
  } else if (slug === "executor-service") {
    code = javaSolution(
      className,
      ["java.util.concurrent.*"],
      "",
      `        ExecutorService pool = Executors.newFixedThreadPool(2);
        Future<Integer> f = pool.submit(() -> ${n + 7});
        try {
            System.out.println(f.get());
        } catch (Exception ex) {
            System.out.println(ex.getMessage());
        } finally {
            pool.shutdown();
        }`
    );
    output = `${n + 7}`;
  } else {
    code = javaSolution(
      className,
      ["java.util.concurrent.*"],
      "",
      `        CompletableFuture<Integer> f1 = CompletableFuture.supplyAsync(() -> ${n + 2});
        CompletableFuture<Integer> f2 = CompletableFuture.supplyAsync(() -> ${n + 4});
        int result = f1.thenCombine(f2, Integer::sum).join();
        System.out.println(result);`
    );
    output = `${2 * n + 6}`;
  }

  return {
    code,
    expectedOutput: output,
    exampleOutput: output,
    exampleInput: "No input",
    constraints: ["Avoid unsafe shared mutable state"],
    dryRun: "Task execution order is coordinated using join/get.",
    visualization: "main thread -> worker tasks -> synchronization point -> output",
    explanation: "The problem demonstrates practical concurrency patterns.",
  };
}

function topicCodeForCategory(slug, className, category, difficulty, idx) {
  if (category === "oop") return buildOopCode(slug, className, difficulty, idx);
  if (category === "collections") return buildCollectionsCode(slug, className, difficulty, idx);
  if (category === "java8") return buildJava8Code(slug, className, difficulty, idx);
  if (category === "multithreading") return buildMultithreadingCode(slug, className, difficulty, idx);
  return buildJavaCode(slug, className, difficulty, idx);
}

function buildProblemPayload(slug, topicTitle, category, difficulty, idx, problemType) {
  const className = clsName(slug, `${difficulty[0].toUpperCase()}${idx + 1}`);
  const prompt = `${titleCaseSlug(slug)} scenario ${idx + 1} (${difficulty})`;
  const complexity =
    difficulty === "easy" ? ["O(1)", "O(1)", "O(1)"] : ["O(n)", "O(n)", "O(1)"];
  const generated = topicCodeForCategory(slug, className, category, difficulty, idx);
  const code = maybeInjectBug({ code: generated.code, problemType, index: idx });
  const output = generated.expectedOutput ?? generated.exampleOutput;

  const base = {
    title: `${prompt} Challenge`,
    description: `Practice ${topicTitle} with working, topic-matched Java code.`,
    problemStatement: `${generated.explanation} Apply ${topicTitle} and produce the expected output.`,
    constraints: [
      ...(generated.constraints ?? []),
      `Stay focused on ${topicTitle} — do not replace it with unrelated arithmetic.`,
      "Program must compile and produce the expected output.",
    ],
    exampleInput: generated.exampleInput ?? "No input",
    exampleOutput: output,
    explanation: generated.explanation,
    approaches: defaultApproaches(difficulty, complexity[0], complexity[1], complexity[2]),
    code,
    filename: `${className}.java`,
    expectedOutput: output,
    dryRun: generated.dryRun ?? `Trace and confirm output: ${String(output).split("\n")[0]}`,
    visualization: generated.visualization ?? `${topicTitle} → stdout`,
    companyTags: [],
    commonMistakes: [
      "Ignoring the topic and writing unrelated code",
      "Changing logic without re-checking expected output",
    ],
    interviewTips: [
      `Explain how this example demonstrates ${topicTitle}.`,
      "Mention real backend use-cases for this concept.",
    ],
    alternativeSolutions: ["Keep the same concept with clearer naming."],
    followUpQuestions: [`How would you extend this ${topicTitle} example?`],
    practiceVariations: ["Change sample values and predict the new output."],
    practiceQuestions: [`Explain this ${topicTitle} solution without running it.`],
  };

  return {
    ...base,
    ...enrichProblem(base, { slug, difficulty, index: idx, category }),
  };
}

function problemTypePrefix(problemType) {
  const map = {
    mcq: "MCQ",
    "output-prediction": "Output",
    "find-bug": "Fix",
    "dry-run": "Dry Run",
    interview: "Practice",
    logic: "Logic",
  };
  return map[problemType] ?? "Exercise";
}

function buildTopicAwareProblem(slug, topicTitle, category, difficulty, problemType, index) {
  if (isWeek1FundamentalsTopic(slug)) {
    return buildWeek1FundamentalsProblem(slug, topicTitle, category, difficulty, problemType, index);
  }
  if (isWeek2ControlFlowTopic(slug)) {
    return buildWeek2ControlFlowProblem(slug, topicTitle, category, difficulty, problemType, index);
  }
  if (isWeek3OopTopic(slug)) {
    return buildWeek3OopProblem(slug, topicTitle, category, difficulty, problemType, index);
  }

  const payload = buildProblemPayload(slug, topicTitle, category, difficulty, index, problemType);
  const prefix = problemTypePrefix(problemType);
  const title =
    problemType === "logic"
      ? `${topicTitle}: Exercise ${index + 1}`
      : `${prefix}: ${topicTitle} #${index + 1}`;

  return {
    ...payload,
    id: `${slug}-${difficulty}-${problemType}-${index + 1}`,
    title,
    description: `${topicTitle} — ${difficulty} level`,
    problemType,
    estimatedMinutes: estimatedMinutes(difficulty, problemType),
    problemStatement: payload.problemStatement
      ? payload.problemStatement
      : `Practice ${topicTitle} at ${difficulty} level.`,
    companyTags: [],
  };
}

function generateTopicAwareProblems(slug, topicTitle, category, topicIndex, topicCount) {
  const quotas = getQuotasForTopic(slug, category, topicIndex, topicCount);
  const out = { easy: [], medium: [], hard: [] };

  let globalIndex = 0;
  for (const difficulty of DIFFICULTIES) {
    for (const { type, count } of quotas[difficulty] ?? []) {
      for (let i = 0; i < count; i++) {
        out[difficulty].push(
          buildTopicAwareProblem(slug, topicTitle, category, difficulty, type, globalIndex)
        );
        globalIndex++;
      }
    }
  }
  return out;
}

function generateProblems(slug, topicTitle, category, topicIndex, topicCount) {
  // Only loop topics use generic pattern/leetcode banks — patterns belong there
  if (slug === "for-loop" || slug === "while-loop") {
    return generateCuratedProblems(slug, topicTitle, category, topicIndex, topicCount);
  }
  return generateTopicAwareProblems(slug, topicTitle, category, topicIndex, topicCount);
}

function buildByCategory(weekId, topic, problems) {
  if (topic.category === "java") return buildJavaLessons(weekId, topic.slug, topic.title, problems);
  if (topic.category === "oop") return buildOopLessons(weekId, topic.slug, problems);
  if (topic.category === "collections") return buildCollectionsLessons(weekId, topic.slug, problems);
  if (topic.category === "java8") return buildJava8Lessons(weekId, topic.slug, problems);
  if (topic.category === "multithreading") return buildMultithreadingLessons(weekId, topic.slug, problems);
  return [];
}

function attachRichFields(lessons, problems) {
  return lessons.map((lesson) => {
    const match = lesson.id.match(/-(easy|medium|hard)-(\d+)$/);
    if (!match) return lesson;
    const difficulty = match[1];
    const idx = Number(match[2]) - 1;
    const source = problems[difficulty]?.[idx];
    if (!source) return lesson;
    return {
      ...lesson,
      problemStatement: source.problemStatement,
      constraints: source.constraints,
      exampleInput: source.exampleInput,
      exampleOutput: source.exampleOutput,
      approaches: source.approaches,
      dryRun: source.dryRun,
      visualization: source.visualization,
      companyTags: source.companyTags,
      alternativeSolutions: source.alternativeSolutions,
      followUpQuestions: source.followUpQuestions,
      practiceVariations: source.practiceVariations,
      practiceQuestions: source.practiceQuestions,
    };
  });
}

function buildTopic(weekId, topic) {
  const topicIndex = topic.topicIndex ?? 0;
  const topicCount = topic.topicCount ?? 1;
  const problems = generateProblems(
    topic.slug,
    topic.title ?? titleCaseSlug(topic.slug),
    topic.category,
    topicIndex,
    topicCount
  );
  return buildByCategory(weekId, topic, problems);
}

export const TOPIC_HANDLERS = {
  "what-is-java": buildTopic,
  "jdk-jre-jvm": buildTopic,
  "variables-data-types": buildTopic,
  operators: buildTopic,
  "type-casting": buildTopic,
  "scanner-input": buildTopic,
  "first-java-program": buildTopic,
  "if-else": buildTopic,
  switch: buildTopic,
  "for-loop": buildTopic,
  "while-loop": buildTopic,
  methods: buildTopic,
  "arrays-1d": buildTopic,
  "arrays-2d": buildTopic,
  "try-catch": buildTopic,
  "throw-throws": buildTopic,
  "custom-exceptions": buildTopic,
  "file-io": buildTopic,
  packages: buildTopic,
  "classes-objects": buildTopic,
  constructors: buildTopic,
  encapsulation: buildTopic,
  inheritance: buildTopic,
  polymorphism: buildTopic,
  interfaces: buildTopic,
  abstraction: buildTopic,
  arraylist: buildTopic,
  hashmap: buildTopic,
  "hashset-treeset": buildTopic,
  generics: buildTopic,
  "lambda-streams": buildTopic,
  "thread-basics": buildTopic,
  synchronization: buildTopic,
  deadlock: buildTopic,
  "executor-service": buildTopic,
  "completable-future": buildTopic,
};

export function getJavaOopProblems(weekId, topic) {
  const handler = TOPIC_HANDLERS[topic?.slug];
  if (!handler) return [];
  if (CATEGORY_BY_SLUG[topic.slug] !== topic.category) return [];
  return handler(weekId, topic);
}

