/**
 * Distinct logic & pattern problems — different question per index.
 */
import { javaSolution } from "./rich-fields.mjs";

export function buildDistinctLogicProblem(className, index, n, topicTitle) {
  const problems = [
    () => {
      const sum = (n * (n + 1)) / 2;
      return {
        title: "Sum 1 to N",
        problemStatement: `Given n = ${n}, compute 1 + 2 + ... + n using a loop.`,
        code: javaSolution(className, [], "", `        int n = ${n}, total = 0;
        for (int i = 1; i <= n; i++) total += i;
        System.out.println(total);`),
        expectedOutput: `${sum}`,
        explanation: `Accumulate ${Array.from({ length: Math.min(n, 5) }, (_, i) => i + 1).join("+")}${n > 5 ? "+..." : ""} = ${sum}.`,
      };
    },
    () => {
      let fact = 1;
      for (let i = 2; i <= n; i++) fact *= i;
      return {
        title: "Factorial of N",
        problemStatement: `Compute n! for n = ${n}.`,
        code: javaSolution(className, [], "", `        int n = ${n}, fact = 1;
        for (int i = 2; i <= n; i++) fact *= i;
        System.out.println(fact);`),
        expectedOutput: `${fact}`,
        explanation: `Multiply 2 × 3 × ... × ${n} = ${fact}.`,
      };
    },
    () => {
      let count = 0;
      for (let i = 1; i <= n; i++) if (i % 2 === 0) count++;
      return {
        title: "Count Even Numbers 1 to N",
        problemStatement: `Count how many even numbers exist between 1 and ${n} inclusive.`,
        code: javaSolution(className, [], "", `        int n = ${n}, count = 0;
        for (int i = 1; i <= n; i++) if (i % 2 == 0) count++;
        System.out.println(count);`),
        expectedOutput: `${count}`,
        explanation: `Even integers in [1,${n}] counted with i % 2 == 0.`,
      };
    },
    () => {
      const num = 1000 + n * 111;
      let sum = 0, x = num;
      while (x > 0) { sum += x % 10; x /= 10; }
      return {
        title: "Sum of Digits",
        problemStatement: `Find the sum of digits of ${num}.`,
        code: javaSolution(className, [], "", `        int n = ${num}, sum = 0;
        while (n > 0) { sum += n % 10; n /= 10; }
        System.out.println(sum);`),
        expectedOutput: `${sum}`,
        explanation: "Extract last digit with n % 10, then n /= 10.",
      };
    },
    () => {
      const a = n + 3, b = n + 7, c = n + 11;
      const max = Math.max(a, b, c);
      return {
        title: "Maximum of Three Numbers",
        problemStatement: `Find the maximum among ${a}, ${b}, and ${c}.`,
        code: javaSolution(className, [], "", `        int a = ${a}, b = ${b}, c = ${c};
        int max = a;
        if (b > max) max = b;
        if (c > max) max = c;
        System.out.println(max);`),
        expectedOutput: `${max}`,
        explanation: "Compare each value against running maximum.",
      };
    },
    () => {
      const num = n + 10;
      let count = 0;
      for (let i = 1; i <= num; i++) if (num % i === 0) count++;
      return {
        title: "Count Divisors",
        problemStatement: `Count the number of divisors of ${num}.`,
        code: javaSolution(className, [], "", `        int n = ${num}, count = 0;
        for (int i = 1; i <= n; i++) if (n % i == 0) count++;
        System.out.println(count);`),
        expectedOutput: `${count}`,
        explanation: `Loop i from 1 to ${num}; count when n % i == 0.`,
      };
    },
    () => {
      let a = 0, b = 1;
      for (let i = 2; i <= n; i++) { const c = a + b; a = b; b = c; }
      return {
        title: "Nth Fibonacci Number",
        problemStatement: `Print the ${n}th Fibonacci number (F(0)=0, F(1)=1).`,
        code: javaSolution(className, [], "", `        int n = ${n}, a = 0, b = 1;
        for (int i = 2; i <= n; i++) { int c = a + b; a = b; b = c; }
        System.out.println(b);`),
        expectedOutput: `${b}`,
        explanation: "Iterative Fibonacci with two variables.",
      };
    },
    () => {
      const num = 10 + n;
      let rev = 0, x = num;
      while (x > 0) { rev = rev * 10 + x % 10; x = Math.floor(x / 10); }
      return {
        title: "Reverse a Number",
        problemStatement: `Reverse the digits of ${num} and print the result.`,
        code: javaSolution(className, [], "", `        int n = ${num}, rev = 0;
        while (n > 0) { rev = rev * 10 + n % 10; n /= 10; }
        System.out.println(rev);`),
        expectedOutput: `${rev}`,
        explanation: "Build reversed number digit by digit.",
      };
    },
    () => {
      const num = n + 5;
      const isPrime = num >= 2 && Array.from({ length: num - 1 }, (_, i) => i + 2).every((d) => num % d !== 0);
      return {
        title: "Check Prime Number",
        problemStatement: `Determine if ${num} is prime. Print true or false.`,
        code: javaSolution(className, [], "", `        int n = ${num};
        boolean prime = n >= 2;
        for (int i = 2; i * i <= n; i++) if (n % i == 0) prime = false;
        System.out.println(prime);`),
        expectedOutput: `${isPrime}`,
        explanation: "Trial division up to sqrt(n).",
      };
    },
    () => {
      let sum = 0;
      for (let i = 1; i <= n; i++) sum += i * i;
      return {
        title: "Sum of Squares 1 to N",
        problemStatement: `Compute 1² + 2² + ... + ${n}².`,
        code: javaSolution(className, [], "", `        int n = ${n}, sum = 0;
        for (int i = 1; i <= n; i++) sum += i * i;
        System.out.println(sum);`),
        expectedOutput: `${sum}`,
        explanation: "Accumulate i*i in a loop.",
      };
    },
  ];

  const slot = ((index % problems.length) + problems.length) % problems.length;
  const core = problems[slot]();
  return {
    ...core,
    exampleInput: `n=${n}`,
    exampleOutput: core.expectedOutput,
    hints: ["Initialize variables before the loop.", "Check loop bounds carefully."],
    dryRun: `Trace with given input → output ${core.expectedOutput}`,
    visualization: `${core.title} step-by-step trace`,
  };
}

export function buildDistinctPatternProblem(className, index, rows, topicTitle, nested) {
  const kinds = [
    {
      title: "Right Star Triangle",
      build(rows) {
        const lines = Array.from({ length: rows }, (_, i) => "*".repeat(i + 1));
        const code = nested
          ? `        for (int r = 1; r <= ${rows}; r++) {
            for (int c = 1; c <= r; c++) System.out.print("*");
            System.out.println();
        }`
          : `        for (int r = 1; r <= ${rows}; r++) System.out.println("*".repeat(r));`;
        return { lines, code, stmt: `Print a right-aligned star triangle with ${rows} rows.` };
      },
    },
    {
      title: "Inverted Star Triangle",
      build(rows) {
        const lines = Array.from({ length: rows }, (_, i) => "*".repeat(rows - i));
        const code = `        for (int r = ${rows}; r >= 1; r--) {
            for (int c = 1; c <= r; c++) System.out.print("*");
            System.out.println();
        }`;
        return { lines, code, stmt: `Print an inverted star triangle with ${rows} rows.` };
      },
    },
    {
      title: "Number Triangle",
      build(rows) {
        const lines = Array.from({ length: rows }, (_, i) =>
          Array.from({ length: i + 1 }, (_, c) => c + 1).join(" ")
        );
        const code = `        for (int r = 1; r <= ${rows}; r++) {
            for (int c = 1; c <= r; c++) {
                if (c > 1) System.out.print(" ");
                System.out.print(c);
            }
            System.out.println();
        }`;
        return { lines, code, stmt: `Print a number triangle: row i contains 1..i.` };
      },
    },
    {
      title: "Floyd's Triangle",
      build(rows) {
        const lines = [];
        let cur = 1;
        for (let r = 1; r <= rows; r++) {
          const row = [];
          for (let c = 1; c <= r; c++) row.push(cur++);
          lines.push(row.join(" "));
        }
        const code = `        int num = 1;
        for (int r = 1; r <= ${rows}; r++) {
            for (int c = 1; c <= r; c++) {
                if (c > 1) System.out.print(" ");
                System.out.print(num++);
            }
            System.out.println();
        }`;
        return { lines, code, stmt: `Print Floyd's triangle with ${rows} rows.` };
      },
    },
    {
      title: "Pyramid Stars",
      build(rows) {
        const lines = Array.from({ length: rows }, (_, i) => {
          const stars = 2 * (i + 1) - 1;
          return " ".repeat(rows - i - 1) + "*".repeat(stars);
        });
        const code = `        for (int r = 1; r <= ${rows}; r++) {
            for (int s = 1; s <= ${rows} - r; s++) System.out.print(" ");
            for (int c = 1; c <= 2 * r - 1; c++) System.out.print("*");
            System.out.println();
        }`;
        return { lines, code, stmt: `Print a centered star pyramid with ${rows} rows.` };
      },
    },
    {
      title: "Hollow Square Stars",
      build(rows) {
        const lines = Array.from({ length: rows }, (_, r) =>
          Array.from({ length: rows }, (_, c) =>
            r === 0 || c === 0 || r === rows - 1 || c === rows - 1 ? "*" : " "
          ).join("")
        );
        const code = `        for (int r = 0; r < ${rows}; r++) {
            for (int c = 0; c < ${rows}; c++) {
                if (r == 0 || c == 0 || r == ${rows - 1} || c == ${rows - 1}) System.out.print("*");
                else System.out.print(" ");
            }
            System.out.println();
        }`;
        return { lines, code, stmt: `Print a hollow square of stars with side ${rows}.` };
      },
    },
    {
      title: "Binary Triangle",
      build(rows) {
        const lines = Array.from({ length: rows }, (_, r) =>
          Array.from({ length: r + 1 }, (_, c) => ((r + c) % 2 === 0 ? "1" : "0")).join(" ")
        );
        const code = `        for (int r = 0; r < ${rows}; r++) {
            for (int c = 0; c <= r; c++) {
                if (c > 0) System.out.print(" ");
                System.out.print((r + c) % 2 == 0 ? "1" : "0");
            }
            System.out.println();
        }`;
        return { lines, code, stmt: `Print a binary triangle of ${rows} rows.` };
      },
    },
    {
      title: "Even Number Row",
      build(rows) {
        const lines = Array.from({ length: rows }, (_, r) =>
          Array.from({ length: r + 1 }, () => (2 * (r + 1)).toString()).join(" ")
        );
        const code = `        for (int r = 1; r <= ${rows}; r++) {
            for (int c = 1; c <= r; c++) {
                if (c > 1) System.out.print(" ");
                System.out.print(2 * r);
            }
            System.out.println();
        }`;
        return { lines, code, stmt: `Row i prints the even number 2i repeated i times.` };
      },
    },
  ];

  const slot = index % kinds.length;
  const kind = kinds[slot];
  const { lines, code: loopCode, stmt } = kind.build(rows);
  const output = lines.join("\n");
  const prefix = nested ? "Nested " : "";
  return {
    title: `${prefix}${kind.title}`,
    problemStatement: stmt,
    code: javaSolution(className, [], "", loopCode),
    expectedOutput: output,
    exampleInput: `rows=${rows}`,
    exampleOutput: output,
    explanation: `Pattern type: ${kind.title}. Outer loop controls rows; inner logic fills each row.`,
    dryRun: lines.map((l, i) => `Row ${i + 1}: ${l}`).join("\n"),
    visualization: output,
    patternPreview: output,
    hints: ["Identify row and column rules.", "Use nested loops for complex patterns."],
    executionTrace: lines.map((l, i) => ({ line: i + 1, action: `print row ${i + 1}`, state: l })),
  };
}
