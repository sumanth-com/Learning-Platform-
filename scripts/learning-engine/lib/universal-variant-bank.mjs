/**
 * Universal code variants for uniqueness.
 *
 * These variants ensure that for any topic, lessons at different `index` values
 * get different algorithms (not just different numbers).
 *
 * Notes:
 * - We keep lesson IDs stable in the caller; only code / statement / outputs change.
 * - This is intentionally concept-agnostic to eliminate “same question with only values changed”.
 */
import { javaSolution } from "./rich-fields.mjs";

function hashSeed(input) {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (h * 33 + input.charCodeAt(i)) >>> 0;
  return h;
}

function toLineOutput(value) {
  return value === undefined || value === null ? "" : String(value);
}

function injectBug(code, index) {
  const bugs = [
    (c) => c.replace(";", ""),
    (c) => c.replace("++", "+="),
    (c) => c.replace(" <= ", " < "),
    (c) => c.replace("return", "// return"),
    (c) => c.replace("System.out.println", "System.out.print"),
  ];
  return bugs[index % bugs.length](code);
}

/**
 * @returns {{title:string, statement:string, input:string, output:string, explanation:string, hints:string[], code:(className:string)=>string}}
 */
export function getUniversalVariant({ slug, topicTitle, difficulty, problemType, index }) {
  const seed = hashSeed(`${slug}-${difficulty}-${topicTitle}-${problemType}-${index}`);

  const a = (seed % 37) + 3;
  const b = ((seed >>> 3) % 29) + 2;
  const c = ((seed >>> 6) % 23) + 1;

  const variant = ((index % 15) + 15) % 15;
  const classNameSeed = `V${variant}_${(seed % 1000).toString().padStart(3, "0")}`;

  // Use stable values (no randomness), but vary algorithm structure per variant.
  if (variant === 0) {
    const result = a + b;
    return {
      title: `Sum ${a}+${b}`,
      statement: `Compute the sum of ${a} and ${b} and print it.`,
      input: `a=${a}, b=${b}`,
      output: `${result}`,
      explanation: `Add the two integers: ${a} + ${b} = ${result}.`,
      hints: ["Use + operator.", "Print exactly the final number."],
      code: (cn) =>
        javaSolution(cn, [], "", `        int a = ${a}, b = ${b};\n        System.out.println(a + b);`),
    };
  }

  if (variant === 1) {
    const result = a * b;
    return {
      title: `Product ${a}×${b}`,
      statement: `Compute the product of ${a} and ${b} and print it.`,
      input: `a=${a}, b=${b}`,
      output: `${result}`,
      explanation: `Multiply: ${a} × ${b} = ${result}.`,
      hints: ["Use * operator.", "No intermediate steps required."],
      code: (cn) =>
        javaSolution(cn, [], "", `        int a = ${a}, b = ${b};\n        System.out.println(a * b);`),
    };
  }

  if (variant === 2) {
    const values = [a, b, c];
    const max = Math.max(...values);
    return {
      title: `Max of three`,
      statement: `Given three integers ${a}, ${b}, and ${c}, print the maximum.`,
      input: `x=${a}, y=${b}, z=${c}`,
      output: `${max}`,
      explanation: `Compare values and keep the largest.`,
      hints: ["Use Math.max.", "Or track a running maximum with if statements."],
      code: (cn) =>
        javaSolution(
          cn,
          [],
          "",
          `        int x = ${a}, y = ${b}, z = ${c};\n        int max = x;\n        if (y > max) max = y;\n        if (z > max) max = z;\n        System.out.println(max);`
        ),
    };
  }

  if (variant === 3) {
    const n = (a % 7) + 4; // 4..10
    let fact = 1;
    for (let i = 2; i <= n; i++) fact *= i;
    return {
      title: `Factorial of ${n}`,
      statement: `Compute n! for n = ${n} and print the result.`,
      input: `n=${n}`,
      output: `${fact}`,
      explanation: `Iteratively multiply 2..n to compute ${n}!`,
      hints: ["Loop from 2 to n.", "Initialize fact=1."],
      code: (cn) =>
        javaSolution(
          cn,
          [],
          "",
          `        int n = ${n};\n        int fact = 1;\n        for (int i = 2; i <= n; i++) fact *= i;\n        System.out.println(fact);`
        ),
    };
  }

  if (variant === 4) {
    const num = (a * 10 + b) % 9876;
    const original = num;
    let rev = 0;
    let x = original;
    if (x === 0) rev = 0;
    while (x > 0) {
      rev = rev * 10 + (x % 10);
      x = Math.floor(x / 10);
    }
    return {
      title: `Reverse ${original}`,
      statement: `Reverse digits of ${original} and print the reversed number.`,
      input: `n=${original}`,
      output: `${rev}`,
      explanation: `Read last digit with n%10, build rev, then n=n/10.`,
      hints: ["Use modulo and division.", "Update rev = rev*10 + digit."],
      code: (cn) =>
        javaSolution(
          cn,
          [],
          "",
          `        int n = ${original};\n        int rev = 0;\n        while (n > 0) {\n            rev = rev * 10 + (n % 10);\n            n = n / 10;\n        }\n        System.out.println(rev);`
        ),
    };
  }

  if (variant === 5) {
    let x = a * 3 + 10;
    let y = b * 2 + 7;
    const A = x;
    const B = y;
    while (y !== 0) {
      const t = y;
      y = x % y;
      x = t;
    }
    const gcd = x;
    return {
      title: `GCD(${A},${B})`,
      statement: `Compute the GCD of ${A} and ${B} using Euclid’s algorithm.`,
      input: `x=${A}, y=${B}`,
      output: `${gcd}`,
      explanation: `Repeatedly apply (x,y)=(y,x%y) until y becomes 0.`,
      hints: ["Use while loop.", "Use x % y for remainder."],
      code: (cn) =>
        javaSolution(
          cn,
          [],
          "",
          `        int x = ${A};\n        int y = ${B};\n        while (y != 0) {\n            int t = y;\n            y = x % y;\n            x = t;\n        }\n        System.out.println(x);`
        ),
    };
  }

  if (variant === 6) {
    const A = a + 30;
    const B = b + 20;
    const gcd = (() => {
      let x = A;
      let y = B;
      while (y !== 0) {
        const t = y;
        y = x % y;
        x = t;
      }
      return x;
    })();
    const lcm = (A * B) / gcd;
    return {
      title: `LCM(${A},${B})`,
      statement: `Compute the LCM of ${A} and ${B} using gcd.`,
      input: `x=${A}, y=${B}`,
      output: `${lcm}`,
      explanation: `LCM(a,b)=a*b/gcd(a,b).`,
      hints: ["Compute gcd first.", "Use integer multiplication carefully."],
      code: (cn) =>
        javaSolution(
          cn,
          [],
          "",
          `        int x = ${A};\n        int y = ${B};\n        int a = x, b = y;\n        while (b != 0) {\n            int t = b;\n            b = a % b;\n            a = t;\n        }\n        int gcd = a;\n        int lcm = (${A} * ${B}) / gcd;\n        System.out.println(lcm);`
        ),
    };
  }

  if (variant === 7) {
    const word = (seed % 2 === 0 ? "algorithm" : "java");
    const vowels = new Set(["a", "e", "i", "o", "u"]);
    let count = 0;
    for (const ch of word) if (vowels.has(ch)) count++;
    return {
      title: `Vowel Count`,
      statement: `Count vowels (a,e,i,o,u) in the string "${word}" and print the count.`,
      input: `s=${word}`,
      output: `${count}`,
      explanation: `Scan each character; increment if it is a vowel.`,
      hints: ["Use a vowel set.", "Remember to lowercase characters."],
      code: (cn) =>
        javaSolution(
          cn,
          [],
          "",
          `        String s = "${word}";\n        s = s.toLowerCase();\n        int count = 0;\n        for (int i = 0; i < s.length(); i++) {\n            char ch = s.charAt(i);\n            if (ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u') count++;\n        }\n        System.out.println(count);`
        ),
    };
  }

  if (variant === 8) {
    const base = seed % 2 === 0 ? "level" : "planet";
    const s = base;
    const isPal = s === s.split("").reverse().join("");
    return {
      title: `Palindrome?`,
      statement: `Check whether "${s}" is a palindrome. Print true or false.`,
      input: `s=${s}`,
      output: `${isPal}`,
      explanation: `Compare symmetric characters from both ends.`,
      hints: ["Use two pointers.", "Stop early when mismatch occurs."],
      code: (cn) =>
        javaSolution(
          cn,
          [],
          "",
          `        String s = "${s}";\n        int l = 0, r = s.length() - 1;\n        boolean ok = true;\n        while (l < r) {\n            if (s.charAt(l) != s.charAt(r)) { ok = false; break; }\n            l++; r--;\n        }\n        System.out.println(ok);`
        ),
    };
  }

  if (variant === 9) {
    const n = (a % 8) + 5; // 5..12
    let f0 = 0;
    let f1 = 1;
    for (let i = 2; i <= n; i++) {
      const fn = f0 + f1;
      f0 = f1;
      f1 = fn;
    }
    const out = n === 0 ? 0 : n === 1 ? 1 : f1;
    return {
      title: `Fibonacci(${n})`,
      statement: `Compute the nth Fibonacci number for n = ${n}. Print the result.`,
      input: `n=${n}`,
      output: `${out}`,
      explanation: `Iterate using two variables.`,
      hints: ["Start with F(0)=0, F(1)=1.", "Loop up to n."],
      code: (cn) =>
        javaSolution(
          cn,
          [],
          "",
          `        int n = ${n};\n        int a = 0, b = 1;\n        if (n == 0) System.out.println(0);\n        else if (n == 1) System.out.println(1);\n        else {\n            for (int i = 2; i <= n; i++) {\n                int t = a + b;\n                a = b;\n                b = t;\n            }\n            System.out.println(b);\n        }`
        ),
    };
  }

  if (variant === 10) {
    const arr = [a, b, c, (seed % 17) + 1];
    const sum = arr.reduce((s, v) => s + v, 0);
    return {
      title: `Sum of Array`,
      statement: `Given an array ${JSON.stringify(arr)}, compute the sum of all elements and print it.`,
      input: `arr=[${arr.join(",")}]`,
      output: `${sum}`,
      explanation: `Accumulate sum by iterating over each array element.`,
      hints: ["Initialize sum=0.", "Add every element."],
      code: (cn) =>
        javaSolution(
          cn,
          [],
          "",
          `        int[] arr = new int[]{${arr.join(",")}};\n        int sum = 0;\n        for (int i = 0; i < arr.length; i++) sum += arr[i];\n        System.out.println(sum);`
        ),
    };
  }

  if (variant === 11) {
    const arr = [c, a, (seed % 23) + 1, b];
    const max = Math.max(...arr);
    return {
      title: `Max in Array`,
      statement: `Given an array ${JSON.stringify(arr)}, print the maximum element.`,
      input: `arr=[${arr.join(",")}]`,
      output: `${max}`,
      explanation: `Track a running maximum while scanning.`,
      hints: ["Initialize max=arr[0].", "Update when you see a larger value."],
      code: (cn) =>
        javaSolution(
          cn,
          [],
          "",
          `        int[] arr = new int[]{${arr.join(",")}};\n        int max = arr[0];\n        for (int i = 1; i < arr.length; i++) if (arr[i] > max) max = arr[i];\n        System.out.println(max);`
        ),
    };
  }

  if (variant === 12) {
    const m = [
      [a % 10, (b % 10) + 1],
      [(c % 10) + 2, (seed % 10) + 3],
    ];
    const sum = m.flat().reduce((s, v) => s + v, 0);
    return {
      title: `2D Matrix Sum`,
      statement: `Given a 2x2 matrix {{${m[0][0]},${m[0][1]}},{${m[1][0]},${m[1][1]}}}, compute sum of all cells.`,
      input: `matrix=2x2`,
      output: `${sum}`,
      explanation: `Use nested loops to traverse rows and columns.`,
      hints: ["Loop rows.", "Loop columns for each row."],
      code: (cn) =>
        javaSolution(
          cn,
          [],
          "",
          `        int[][] m = new int[][]{{${m[0][0]},${m[0][1]}}, {${m[1][0]},${m[1][1]}}};\n        int sum = 0;\n        for (int r = 0; r < m.length; r++) {\n            for (int col = 0; col < m[r].length; col++) sum += m[r][col];\n        }\n        System.out.println(sum);`
        ),
    };
  }

  if (variant === 13) {
    // Missing number in 1..n+1
    const n = (a % 6) + 4; // array size n
    const full = Array.from({ length: n + 1 }, (_, i) => i + 1);
    const missing = ((b + c) % (n + 1)) + 1;
    const arr = full.filter((x) => x !== missing);
    const sumArr = arr.reduce((s, v) => s + v, 0);
    const sumFull = (n + 1) * (n + 2) / 2;
    const out = sumFull - sumArr;
    return {
      title: `Missing Number`,
      statement: `Given the array ${JSON.stringify(arr)}, where it contains numbers from 1..${n + 1} with exactly one missing, print the missing number.`,
      input: `arr=[${arr.join(",")}]`,
      output: `${out}`,
      explanation: `Use formula sum(1..n+1) - sum(array).`,
      hints: ["Use arithmetic series formula.", "Be careful with types."],
      code: (cn) =>
        javaSolution(
          cn,
          [],
          "",
          `        int[] arr = new int[]{${arr.join(",")}};\n        int n = ${n}; // array has size n, full range is 1..n+1\n        int sumFull = (n + 1) * (n + 2) / 2;\n        int sumArr = 0;\n        for (int x : arr) sumArr += x;\n        System.out.println(sumFull - sumArr);`
        ),
    };
  }

  // variant === 14
  {
    const x = (a % 20) + 3;
    const sq = x * x;
    return {
      title: `Method Call: square(${x})`,
      statement: `Create a method square(x) that returns x*x, call it with x=${x}, and print the result.`,
      input: `x=${x}`,
      output: `${sq}`,
      explanation: `Compute square via a reusable method.`,
      hints: ["Define a static method.", "Call and print its return value."],
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static int square(int x) { return x * x; }\n`,
          `        System.out.println(square(${x}));`
        ),
    };
  }
}

export function maybeInjectBug({ code, problemType, index }) {
  if (problemType !== "find-bug" && problemType !== "debugging") return code;
  return injectBug(code, index);
}

