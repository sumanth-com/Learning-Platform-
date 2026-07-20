/**
 * Week 2 Control Flow — unique problems per index (no value-only clones).
 * Lesson ids stay `${slug}-${difficulty}-${problemType}-${index+1}` so progress is preserved.
 */
import { enrichProblem, javaSolution, clsName, defaultApproaches } from "./rich-fields.mjs";
import { estimatedMinutes as estMinutes } from "./problem-type-spec.mjs";

const WEEK2_TOPIC_SLUGS = new Set([
  "if-else",
  "switch",
  "methods",
  "arrays-1d",
  "arrays-2d",
  "while-loop",
]);

export function isWeek2ControlFlowTopic(slug) {
  return WEEK2_TOPIC_SLUGS.has(slug);
}

const TOPIC_TITLES = {
  "if-else": "If, Else If, Else",
  switch: "Switch Statement",
  methods: "Methods",
  "arrays-1d": "1D Arrays",
  "arrays-2d": "2D Arrays",
  "while-loop": "While & Do-While",
};

/** @type {Record<string, Array<{ title: string; statement: string; code: (cn: string) => string; output: string; input: string }>>} */
const TOPIC_PROBLEMS = {
  "if-else": [
    {
      title: "Even or Odd",
      statement: "Print EVEN if n is even, otherwise print ODD. Use n = 14.",
      code: (cn) =>
        javaSolution(cn, [], "", `        int n = 14;
        if (n % 2 == 0) System.out.println("EVEN");
        else System.out.println("ODD");`),
      output: "EVEN",
      input: "n = 14",
    },
    {
      title: "Larger of Two Numbers",
      statement: "Print the larger of 23 and 17 using if-else.",
      code: (cn) =>
        javaSolution(cn, [], "", `        int a = 23, b = 17;
        if (a > b) System.out.println(a);
        else System.out.println(b);`),
      output: "23",
      input: "a=23, b=17",
    },
    {
      title: "Pass or Fail",
      statement: "Print PASS if marks >= 40, else FAIL. marks = 38.",
      code: (cn) =>
        javaSolution(cn, [], "", `        int marks = 38;
        if (marks >= 40) System.out.println("PASS");
        else System.out.println("FAIL");`),
      output: "FAIL",
      input: "marks = 38",
    },
    {
      title: "Sign of a Number",
      statement: "Print POSITIVE, NEGATIVE, or ZERO for n = -5.",
      code: (cn) =>
        javaSolution(cn, [], "", `        int n = -5;
        if (n > 0) System.out.println("POSITIVE");
        else if (n < 0) System.out.println("NEGATIVE");
        else System.out.println("ZERO");`),
      output: "NEGATIVE",
      input: "n = -5",
    },
    {
      title: "Voting Eligibility",
      statement: "Print ELIGIBLE if age >= 18, else NOT ELIGIBLE. age = 20.",
      code: (cn) =>
        javaSolution(cn, [], "", `        int age = 20;
        if (age >= 18) System.out.println("ELIGIBLE");
        else System.out.println("NOT ELIGIBLE");`),
      output: "ELIGIBLE",
      input: "age = 20",
    },
    {
      title: "Leap Year Check",
      statement: "Print LEAP for year 2024, else NOT LEAP (divisible by 4, century rules).",
      code: (cn) =>
        javaSolution(cn, [], "", `        int year = 2024;
        boolean leap = (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);
        if (leap) System.out.println("LEAP");
        else System.out.println("NOT LEAP");`),
      output: "LEAP",
      input: "year = 2024",
    },
    {
      title: "Grade from Marks",
      statement: "Print grade A/B/C/D for marks = 82 (A>=90, B>=75, C>=60).",
      code: (cn) =>
        javaSolution(cn, [], "", `        int marks = 82;
        if (marks >= 90) System.out.println("A");
        else if (marks >= 75) System.out.println("B");
        else if (marks >= 60) System.out.println("C");
        else System.out.println("D");`),
      output: "B",
      input: "marks = 82",
    },
    {
      title: "Discount Tier",
      statement: "Print GOLD if amount >= 5000, SILVER if >= 2000, else BRONZE. amount = 3500.",
      code: (cn) =>
        javaSolution(cn, [], "", `        int amount = 3500;
        if (amount >= 5000) System.out.println("GOLD");
        else if (amount >= 2000) System.out.println("SILVER");
        else System.out.println("BRONZE");`),
      output: "SILVER",
      input: "amount = 3500",
    },
    {
      title: "Triangle Validity",
      statement: "Sides 3,4,8 — print VALID if sum of any two > third, else INVALID.",
      code: (cn) =>
        javaSolution(cn, [], "", `        int a = 3, b = 4, c = 8;
        if (a + b > c && a + c > b && b + c > a) System.out.println("VALID");
        else System.out.println("INVALID");`),
      output: "INVALID",
      input: "a=3, b=4, c=8",
    },
  ],
  switch: [
    {
      title: "Day Name from Number",
      statement: "Print day name for day = 3 (1=Mon ... 7=Sun).",
      code: (cn) =>
        javaSolution(cn, [], "", `        int day = 3;
        switch (day) {
            case 1 -> System.out.println("Mon");
            case 2 -> System.out.println("Tue");
            case 3 -> System.out.println("Wed");
            case 4 -> System.out.println("Thu");
            case 5 -> System.out.println("Fri");
            case 6, 7 -> System.out.println("Weekend");
            default -> System.out.println("Invalid");
        }`),
      output: "Wed",
      input: "day = 3",
    },
    {
      title: "Calculator Add",
      statement: "operator '+' with a=8, b=5 — print result using switch on char op.",
      code: (cn) =>
        javaSolution(cn, [], "", `        char op = '+';
        int a = 8, b = 5, result = 0;
        switch (op) {
            case '+' -> result = a + b;
            case '-' -> result = a - b;
            case '*' -> result = a * b;
            case '/' -> result = a / b;
            default -> result = 0;
        }
        System.out.println(result);`),
      output: "13",
      input: "op='+', a=8, b=5",
    },
    {
      title: "Traffic Light Message",
      statement: "color = 'R' — print STOP for R, SLOW for Y, GO for G.",
      code: (cn) =>
        javaSolution(cn, [], "", `        char color = 'R';
        switch (color) {
            case 'R' -> System.out.println("STOP");
            case 'Y' -> System.out.println("SLOW");
            case 'G' -> System.out.println("GO");
            default -> System.out.println("UNKNOWN");
        }`),
      output: "STOP",
      input: "color = R",
    },
    {
      title: "Month Days Count",
      statement: "month = 2, year = 2024 — print days in month (Feb leap = 29).",
      code: (cn) =>
        javaSolution(cn, [], "", `        int month = 2, year = 2024;
        int days = switch (month) {
            case 1, 3, 5, 7, 8, 10, 12 -> 31;
            case 4, 6, 9, 11 -> 30;
            case 2 -> ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) ? 29 : 28;
            default -> 0;
        };
        System.out.println(days);`),
      output: "29",
      input: "month=2, year=2024",
    },
    {
      title: "ATM Menu Choice",
      statement: "choice = 2 — print WITHDRAW for 1, DEPOSIT for 2, BALANCE for 3.",
      code: (cn) =>
        javaSolution(cn, [], "", `        int choice = 2;
        switch (choice) {
            case 1 -> System.out.println("WITHDRAW");
            case 2 -> System.out.println("DEPOSIT");
            case 3 -> System.out.println("BALANCE");
            default -> System.out.println("EXIT");
        }`),
      output: "DEPOSIT",
      input: "choice = 2",
    },
    {
      title: "Roman Numeral I to V",
      statement: "n = 4 — print Roman numeral I, II, III, IV, or V.",
      code: (cn) =>
        javaSolution(cn, [], "", `        int n = 4;
        switch (n) {
            case 1 -> System.out.println("I");
            case 2 -> System.out.println("II");
            case 3 -> System.out.println("III");
            case 4 -> System.out.println("IV");
            case 5 -> System.out.println("V");
            default -> System.out.println("?");
        }`),
      output: "IV",
      input: "n = 4",
    },
    {
      title: "Season from Month",
      statement: "month = 12 — print WINTER/DEC-SPR/SUMMER/MONSOON bucket.",
      code: (cn) =>
        javaSolution(cn, [], "", `        int month = 12;
        switch (month) {
            case 12, 1, 2 -> System.out.println("WINTER");
            case 3, 4, 5 -> System.out.println("SPRING");
            case 6, 7, 8 -> System.out.println("SUMMER");
            case 9, 10, 11 -> System.out.println("MONSOON");
            default -> System.out.println("?");
        }`),
      output: "WINTER",
      input: "month = 12",
    },
    {
      title: "Vowel or Consonant",
      statement: "ch = 'e' — print VOWEL or CONSONANT using switch.",
      code: (cn) =>
        javaSolution(cn, [], "", `        char ch = 'e';
        switch (ch) {
            case 'a', 'e', 'i', 'o', 'u' -> System.out.println("VOWEL");
            default -> System.out.println("CONSONANT");
        }`),
      output: "VOWEL",
      input: "ch = e",
    },
    {
      title: "HTTP Status Category",
      statement: "code = 404 — print class: 2xx OK, 3xx REDIRECT, 4xx CLIENT, 5xx SERVER.",
      code: (cn) =>
        javaSolution(cn, [], "", `        int code = 404;
        int bucket = code / 100;
        switch (bucket) {
            case 2 -> System.out.println("OK");
            case 3 -> System.out.println("REDIRECT");
            case 4 -> System.out.println("CLIENT");
            case 5 -> System.out.println("SERVER");
            default -> System.out.println("OTHER");
        }`),
      output: "CLIENT",
      input: "code = 404",
    },
  ],
  methods: [
    {
      title: "Square Method",
      statement: "Call square(6) and print the result.",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static int square(int x) { return x * x; }
`,
          `        System.out.println(square(6));`
        ),
      output: "36",
      input: "x = 6",
    },
    {
      title: "Add Two Integers",
      statement: "Use add(12, 30) and print sum.",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static int add(int a, int b) { return a + b; }
`,
          `        System.out.println(add(12, 30));`
        ),
      output: "42",
      input: "12, 30",
    },
    {
      title: "Is Even Helper",
      statement: "Print YES if isEven(11) is true, else NO.",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static boolean isEven(int n) { return n % 2 == 0; }
`,
          `        System.out.println(isEven(11) ? "YES" : "NO");`
        ),
      output: "NO",
      input: "n = 11",
    },
    {
      title: "Maximum of Two",
      statement: "Print max(45, 19) using a max method.",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static int max(int a, int b) { return a > b ? a : b; }
`,
          `        System.out.println(max(45, 19));`
        ),
      output: "45",
      input: "45, 19",
    },
    {
      title: "Factorial Method",
      statement: "Print factorial(5) from a recursive-style loop method.",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static int factorial(int n) {
        int f = 1;
        for (int i = 2; i <= n; i++) f *= i;
        return f;
    }
`,
          `        System.out.println(factorial(5));`
        ),
      output: "120",
      input: "n = 5",
    },
    {
      title: "Greet by Name",
      statement: "Call greet(\"Prathyu\") and print returned greeting.",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static String greet(String name) { return "Hello, " + name; }
`,
          `        System.out.println(greet("Prathyu"));`
        ),
      output: "Hello, Prathyu",
      input: "name = Prathyu",
    },
    {
      title: "Count Vowels",
      statement: "Print countVowels(\"java\") — counts a,e,i,o,u.",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static int countVowels(String s) {
        int c = 0;
        for (char ch : s.toCharArray()) {
            if ("aeiou".indexOf(ch) >= 0) c++;
        }
        return c;
    }
`,
          `        System.out.println(countVowels("java"));`
        ),
      output: "2",
      input: "java",
    },
    {
      title: "Absolute Value",
      statement: "Print abs(-17) using a method.",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static int abs(int n) { return n < 0 ? -n : n; }
`,
          `        System.out.println(abs(-17));`
        ),
      output: "17",
      input: "n = -17",
    },
    {
      title: "Method Overload Print",
      statement: "Call printVal(10) and printVal(\"code\") — overload int and String.",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static void printVal(int n) { System.out.println("int:" + n); }
    static void printVal(String s) { System.out.println("str:" + s); }
`,
          `        printVal(10);
        printVal("code");`
        ),
      output: "int:10\nstr:code",
      input: "No input",
    },
  ],
  "arrays-1d": [
    {
      title: "Find Maximum Element",
      statement: "Print max of {4, 9, 2, 7}.",
      code: (cn) =>
        javaSolution(cn, [], "", `        int[] arr = {4, 9, 2, 7};
        int max = arr[0];
        for (int v : arr) if (v > max) max = v;
        System.out.println(max);`),
      output: "9",
      input: "array values",
    },
    {
      title: "Sum All Elements",
      statement: "Print sum of {1, 2, 3, 4, 5}.",
      code: (cn) =>
        javaSolution(cn, [], "", `        int[] arr = {1, 2, 3, 4, 5};
        int sum = 0;
        for (int v : arr) sum += v;
        System.out.println(sum);`),
      output: "15",
      input: "array values",
    },
    {
      title: "Count Even Numbers",
      statement: "Count evens in {1, 2, 3, 4, 5, 6}.",
      code: (cn) =>
        javaSolution(cn, [], "", `        int[] arr = {1, 2, 3, 4, 5, 6};
        int count = 0;
        for (int v : arr) if (v % 2 == 0) count++;
        System.out.println(count);`),
      output: "3",
      input: "array values",
    },
    {
      title: "Linear Search Found",
      statement: "Search key 7 in {3, 7, 1, 9} — print index or -1.",
      code: (cn) =>
        javaSolution(cn, [], "", `        int[] arr = {3, 7, 1, 9};
        int key = 7, idx = -1;
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] == key) { idx = i; break; }
        }
        System.out.println(idx);`),
      output: "1",
      input: "key = 7",
    },
    {
      title: "Print Reversed Array",
      statement: "Print elements of {10, 20, 30} in reverse order space-separated.",
      code: (cn) =>
        javaSolution(cn, [], "", `        int[] arr = {10, 20, 30};
        for (int i = arr.length - 1; i >= 0; i--) {
            System.out.print(arr[i]);
            if (i > 0) System.out.print(" ");
        }
        System.out.println();`),
      output: "30 20 10",
      input: "array values",
    },
    {
      title: "Second Largest",
      statement: "Find second largest in {5, 12, 12, 3}.",
      code: (cn) =>
        javaSolution(cn, [], "", `        int[] arr = {5, 12, 12, 3};
        int first = Integer.MIN_VALUE, second = Integer.MIN_VALUE;
        for (int v : arr) {
            if (v > first) { second = first; first = v; }
            else if (v > second && v != first) second = v;
        }
        System.out.println(second);`),
      output: "5",
      input: "array values",
    },
    {
      title: "Copy Array Length",
      statement: "Copy {1,2,3} to new array and print new length.",
      code: (cn) =>
        javaSolution(cn, [], "", `        int[] src = {1, 2, 3};
        int[] copy = java.util.Arrays.copyOf(src, src.length);
        System.out.println(copy.length);`),
      output: "3",
      input: "array values",
    },
    {
      title: "Frequency of Target",
      statement: "Count how many times 2 appears in {2, 1, 2, 3, 2}.",
      code: (cn) =>
        javaSolution(cn, [], "", `        int[] arr = {2, 1, 2, 3, 2};
        int target = 2, freq = 0;
        for (int v : arr) if (v == target) freq++;
        System.out.println(freq);`),
      output: "3",
      input: "target = 2",
    },
    {
      title: "Merge Sum of Two Arrays",
      statement: "Print sum of all elements in {1,2} and {3,4,5}.",
      code: (cn) =>
        javaSolution(cn, [], "", `        int[] a = {1, 2}, b = {3, 4, 5};
        int sum = 0;
        for (int v : a) sum += v;
        for (int v : b) sum += v;
        System.out.println(sum);`),
      output: "15",
      input: "two arrays",
    },
  ],
  "arrays-2d": [
    {
      title: "Sum All Matrix Cells",
      statement: "Sum all values in {{1,2},{3,4}}.",
      code: (cn) =>
        javaSolution(cn, [], "", `        int[][] m = {{1, 2}, {3, 4}};
        int sum = 0;
        for (int[] row : m) for (int v : row) sum += v;
        System.out.println(sum);`),
      output: "10",
      input: "2x2 matrix",
    },
    {
      title: "Row Sum First Row",
      statement: "Print sum of first row of {{2,3,1},{4,0,5}}.",
      code: (cn) =>
        javaSolution(cn, [], "", `        int[][] m = {{2, 3, 1}, {4, 0, 5}};
        int sum = 0;
        for (int v : m[0]) sum += v;
        System.out.println(sum);`),
      output: "6",
      input: "matrix",
    },
    {
      title: "Column Sum",
      statement: "Sum column 1 of {{1,2},{3,4},{5,6}}.",
      code: (cn) =>
        javaSolution(cn, [], "", `        int[][] m = {{1, 2}, {3, 4}, {5, 6}};
        int col = 1, sum = 0;
        for (int[] row : m) sum += row[col];
        System.out.println(sum);`),
      output: "12",
      input: "column index 1",
    },
    {
      title: "Main Diagonal Sum",
      statement: "Sum main diagonal of {{1,2,3},{4,5,6},{7,8,9}}.",
      code: (cn) =>
        javaSolution(cn, [], "", `        int[][] m = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};
        int sum = 0;
        for (int i = 0; i < m.length; i++) sum += m[i][i];
        System.out.println(sum);`),
      output: "15",
      input: "3x3 matrix",
    },
    {
      title: "Print Matrix Rows",
      statement: "Print number of rows in {{9,8},{7,6},{5,4}}.",
      code: (cn) =>
        javaSolution(cn, [], "", `        int[][] m = {{9, 8}, {7, 6}, {5, 4}};
        System.out.println(m.length);`),
      output: "3",
      input: "matrix",
    },
    {
      title: "Transpose Element",
      statement: "Print element at transpose position (0,1) of {{1,2,3},{4,5,6}} i.e. m[1][0].",
      code: (cn) =>
        javaSolution(cn, [], "", `        int[][] m = {{1, 2, 3}, {4, 5, 6}};
        System.out.println(m[1][0]);`),
      output: "4",
      input: "matrix",
    },
    {
      title: "Maximum in Matrix",
      statement: "Find max value in {{1,9},{3,2}}.",
      code: (cn) =>
        javaSolution(cn, [], "", `        int[][] m = {{1, 9}, {3, 2}};
        int max = m[0][0];
        for (int[] row : m) for (int v : row) if (v > max) max = v;
        System.out.println(max);`),
      output: "9",
      input: "matrix",
    },
    {
      title: "Count Positive Values",
      statement: "Count positives in {{1,-2,0},{3,-1,4}}.",
      code: (cn) =>
        javaSolution(cn, [], "", `        int[][] m = {{1, -2, 0}, {3, -1, 4}};
        int count = 0;
        for (int[] row : m) for (int v : row) if (v > 0) count++;
        System.out.println(count);`),
      output: "3",
      input: "matrix",
    },
    {
      title: "Border Sum",
      statement: "Sum border cells of {{1,2,3},{4,5,6},{7,8,9}}.",
      code: (cn) =>
        javaSolution(cn, [], "", `        int[][] m = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};
        int sum = 0, n = m.length;
        for (int j = 0; j < n; j++) { sum += m[0][j] + m[n-1][j]; }
        for (int i = 1; i < n - 1; i++) { sum += m[i][0] + m[i][n-1]; }
        System.out.println(sum);`),
      output: "40",
      input: "3x3 matrix",
    },
  ],
  "while-loop": [
    {
      title: "Sum 1 to N with While",
      statement: "Use while to sum 1..5 and print result.",
      code: (cn) =>
        javaSolution(cn, [], "", `        int n = 5, i = 1, sum = 0;
        while (i <= n) { sum += i; i++; }
        System.out.println(sum);`),
      output: "15",
      input: "n = 5",
    },
    {
      title: "Do-While At Least Once",
      statement: "do-while prints at least once when n starts 0, runs while n < 3.",
      code: (cn) =>
        javaSolution(cn, [], "", `        int n = 0;
        do {
            System.out.print(n + " ");
            n++;
        } while (n < 3);
        System.out.println();`),
      output: "0 1 2",
      input: "n starts 0",
    },
    {
      title: "Count Digits While",
      statement: "Count digits in 5021 using while loop.",
      code: (cn) =>
        javaSolution(cn, [], "", `        int n = 5021, count = 0;
        while (n > 0) { count++; n /= 10; }
        System.out.println(count);`),
      output: "4",
      input: "n = 5021",
    },
    {
      title: "Reverse Number While",
      statement: "Reverse 1234 using while and print reversed value.",
      code: (cn) =>
        javaSolution(cn, [], "", `        int n = 1234, rev = 0;
        while (n > 0) {
            rev = rev * 10 + n % 10;
            n /= 10;
        }
        System.out.println(rev);`),
      output: "4321",
      input: "n = 1234",
    },
    {
      title: "Power by Repeated Multiply",
      statement: "Compute 2^5 using while loop.",
      code: (cn) =>
        javaSolution(cn, [], "", `        int base = 2, exp = 5, result = 1;
        while (exp-- > 0) result *= base;
        System.out.println(result);`),
      output: "32",
      input: "2^5",
    },
    {
      title: "GCD Euclidean While",
      statement: "GCD of 48 and 18 using while subtraction/Euclid.",
      code: (cn) =>
        javaSolution(cn, [], "", `        int a = 48, b = 18;
        while (b != 0) {
            int t = b;
            b = a % b;
            a = t;
        }
        System.out.println(a);`),
      output: "6",
      input: "48, 18",
    },
    {
      title: "Countdown Print",
      statement: "Print countdown 5 4 3 2 1 using while.",
      code: (cn) =>
        javaSolution(cn, [], "", `        int n = 5;
        while (n >= 1) {
            System.out.println(n);
            n--;
        }`),
      output: "5\n4\n3\n2\n1",
      input: "start 5",
    },
    {
      title: "Sentinel Sum Until Zero",
      statement: "Sum numbers until sentinel 0: values 3,4,0 — print sum.",
      code: (cn) =>
        javaSolution(cn, [], "", `        int[] data = {3, 4, 0};
        int i = 0, sum = 0;
        while (data[i] != 0) {
            sum += data[i];
            i++;
        }
        System.out.println(sum);`),
      output: "7",
      input: "3, 4, 0",
    },
    {
      title: "First N Multiples of 3",
      statement: "Print first 4 multiples of 3 using while.",
      code: (cn) =>
        javaSolution(cn, [], "", `        int count = 0, value = 3;
        while (count < 4) {
            System.out.println(value);
            value += 3;
            count++;
        }`),
      output: "3\n6\n9\n12",
      input: "4 multiples",
    },
  ],
};

function pickTemplate(slug, index) {
  const list = TOPIC_PROBLEMS[slug];
  if (!list) {
    throw new Error(`Week 2 topic "${slug}" has no dedicated problem bank`);
  }
  if (index >= list.length) {
    throw new Error(`Week 2 topic "${slug}" needs more templates (requested index ${index}, have ${list.length})`);
  }
  return list[index];
}

function injectBeginnerBug(code, index) {
  const bugs = [
    (c) => c.replace(";", ""),
    (c) => c.replace("++", ""),
    (c) => c.replace("<=", "<"),
    (c) => c.replace("break;", "continue;"),
  ];
  return bugs[index % bugs.length](code);
}

function typeSuffix(problemType) {
  if (problemType === "output-prediction") return " — Output?";
  if (problemType === "find-bug") return " — Fix the Bug";
  if (problemType === "dry-run") return " — Dry Run";
  if (problemType === "interview") return " — Practice";
  return "";
}

export function buildWeek2ControlFlowProblem(
  slug,
  topicTitle,
  category,
  difficulty,
  problemType,
  index
) {
  const className = clsName(slug, `W2${difficulty[0]}${index + 1}`);
  const tpl = pickTemplate(slug, index);
  const topicLabel = TOPIC_TITLES[slug] ?? topicTitle;

  let code = tpl.code(className);
  let output = tpl.output;
  let statement = tpl.statement;
  let title = `${tpl.title}${typeSuffix(problemType)}`;

  if (problemType === "find-bug") {
    statement = `The following ${topicLabel} program has a mistake. Fix it.\n\n${statement}`;
    title = `Fix: ${tpl.title}`;
    code = injectBeginnerBug(code, index);
  } else if (problemType === "output-prediction") {
    statement = `Predict the output for this ${topicLabel} program.\n\n${statement}`;
    title = `Output: ${tpl.title}`;
  } else if (problemType === "dry-run") {
    statement = `Dry-run this ${topicLabel} program line by line.\n\n${statement}`;
    title = `Dry Run: ${tpl.title}`;
  } else if (problemType === "interview") {
    statement = `Interview-style ${topicLabel} question:\n\n${statement}`;
    title = `Practice: ${tpl.title}`;
  }

  const base = {
    id: `${slug}-${difficulty}-${problemType}-${index + 1}`,
    title,
    description: `${topicLabel} — ${tpl.title}`,
    problemType,
    estimatedMinutes: estMinutes(difficulty, problemType),
    problemStatement: statement,
    constraints: [
      `Use only ${topicLabel} concepts from Week 2.`,
      "Program must compile and produce the expected output.",
    ],
    exampleInput: tpl.input,
    exampleOutput: output,
    explanation: `This exercise applies ${topicLabel} in a distinct scenario: ${tpl.title}.`,
    approaches: defaultApproaches(difficulty, "O(n)", "O(n)", "O(1)"),
    code,
    filename: `${className}.java`,
    expectedOutput: output,
    dryRun: `Trace the program and confirm output: ${output.split("\n")[0]}`,
    visualization: `${topicLabel} → stdout`,
    hints: [`Focus on ${topicLabel} structure.`, "Trace with the given sample values."],
    companyTags: [],
    commonMistakes: ["Wrong loop bounds", "Missing break in switch", "Off-by-one array index"],
    interviewTips: ["State complexity and edge cases aloud."],
    alternativeSolutions: ["Refactor repeated logic into a method"],
    followUpQuestions: [`How would input from Scanner change this?`],
    practiceVariations: [`Change sample values and predict new output.`],
    practiceQuestions: [`Explain ${tpl.title} without running code.`],
  };

  return { ...base, ...enrichProblem({ ...base, companyTags: [] }, { slug, difficulty, index, category }) };
}
