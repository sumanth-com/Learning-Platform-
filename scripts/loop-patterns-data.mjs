/** Loop types, control, and 30+ interview patterns for the Loops roadmap topic */

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

export const LOOP_TYPES = [
  lesson(
    "loops-intro",
    "What is a Loop?",
    "loop-types",
    "A loop repeats a block of code until a condition is met. Instead of copy-pasting the same lines 100 times, you write the logic once and let the loop run it for you.",
    "Java has three classic loops: for (when you know how many times), while (when you stop on a condition), and do-while (at least once). The enhanced for-each loop is best for arrays and collections.",
    "LoopIntro",
    `        System.out.println("Counting 1 to 5 with for:");
        for (int i = 1; i <= 5; i++) {
            System.out.println(i);
        }`,
    "Counting 1 to 5 with for:\n1\n2\n3\n4\n5"
  ),
  lesson(
    "for-loop",
    "for Loop",
    "loop-types",
    "The for loop has three parts: initialization, condition, and update. Use it when you know how many iterations you need.",
    "for (int i = 0; i < 10; i++) runs with i = 0,1,...,9. The condition is checked before each iteration.",
    "ForDemo",
    `        int sum = 0;
        for (int i = 1; i <= 10; i++) sum += i;
        System.out.println("Sum 1..10 = " + sum);`,
    "Sum 1..10 = 55"
  ),
  lesson(
    "while-loop",
    "while Loop",
    "loop-types",
    "A while loop checks the condition first. If true, it runs the body and checks again.",
    "Use when you do not know exactly how many iterations. Always ensure the condition eventually becomes false.",
    "WhileDemo",
    `        int n = 1;
        while (n <= 5) {
            System.out.println("n = " + n);
            n++;
        }`,
    "n = 1\nn = 2\nn = 3\nn = 4\nn = 5"
  ),
  lesson(
    "do-while-loop",
    "do-while Loop",
    "loop-types",
    "do-while always executes the body at least once, then checks the condition.",
    "Common in menu systems: show options, read choice, repeat until user exits.",
    "DoWhileDemo",
    `        int count = 0;
        do {
            System.out.println("Run #" + (count + 1));
            count++;
        } while (count < 3);`,
    "Run #1\nRun #2\nRun #3"
  ),
  lesson(
    "enhanced-for",
    "Enhanced for-each",
    "loop-types",
    "The enhanced for loop iterates every element in an array or Iterable without managing an index.",
    "Syntax: for (Type item : collection). Prefer it for reading all elements.",
    "ForEachDemo",
    `        String[] colors = {"red", "green", "blue"};
        for (String c : colors) {
            System.out.println(c.toUpperCase());
        }`,
    "RED\nGREEN\nBLUE"
  ),
  lesson(
    "nested-loops-intro",
    "Nested Loops",
    "loop-types",
    "A loop inside another loop. The outer loop controls rows; the inner loop runs completely for each outer iteration.",
    "Used for 2D grids, matrices, and patterns. Total iterations = outer × inner.",
    "NestedIntro",
    `        for (int i = 1; i <= 3; i++) {
            for (int j = 1; j <= 2; j++) {
                System.out.println("i=" + i + " j=" + j);
            }
        }`,
    "i=1 j=1\ni=1 j=2\ni=2 j=1\ni=2 j=2\ni=3 j=1\ni=3 j=2"
  ),
  lesson(
    "labeled-break",
    "Labeled break & continue",
    "loop-types",
    "Labels let you break or continue an outer loop from inside a nested loop.",
    "Syntax: outer: for (...) { inner: for (...) { break outer; } }. Useful for searching 2D arrays.",
    "LabeledBreak",
    `        outer:
        for (int i = 1; i <= 3; i++) {
            for (int j = 1; j <= 3; j++) {
                if (i * j == 6) {
                    System.out.println("Found 6 at i=" + i + " j=" + j);
                    break outer;
                }
            }
        }`,
    "Found 6 at i=2 j=3"
  ),
];

export const LOOP_CONTROL = [
  lesson(
    "break-continue",
    "break & continue",
    "control",
    "break exits the loop immediately. continue skips the rest of the current iteration.",
    "Use break when you find what you need. Use continue to skip invalid values (e.g., negatives).",
    "BreakContinue",
    `        for (int i = 1; i <= 8; i++) {
            if (i == 5) continue;
            if (i == 7) break;
            System.out.println(i);
        }`,
    "1\n2\n3\n4\n6"
  ),
];

export const LOOP_PATTERNS = [
  lesson(
    "pat-right-triangle",
    "Right Triangle Stars",
    "patterns",
    "Print a right-angled triangle of stars. Row i has i stars.",
    "Interview classic. Outer loop = rows, inner loop = stars per row.",
    "RightTriangle",
    `        int rows = 5;
        for (int i = 1; i <= rows; i++) {
            for (int j = 1; j <= i; j++) System.out.print("* ");
            System.out.println();
        }`,
    "* \n* * \n* * * \n* * * * \n* * * * * "
  ),
  lesson(
    "pat-inverted-triangle",
    "Inverted Right Triangle",
    "patterns",
    "Stars decrease each row — common variation in coding tests.",
    "Start inner loop from i down to 1, or use (rows - i + 1) stars.",
    "InvertedTriangle",
    `        int rows = 5;
        for (int i = rows; i >= 1; i--) {
            for (int j = 1; j <= i; j++) System.out.print("* ");
            System.out.println();
        }`,
    "* * * * * \n* * * * \n* * * \n* * \n* "
  ),
  lesson(
    "pat-pyramid",
    "Centered Pyramid",
    "patterns",
    "A centered pyramid uses spaces before stars. Row i has (rows-i) spaces and (2*i-1) stars.",
    "Very common in TCS, Infosys, and campus drives. Practice spacing formula.",
    "Pyramid",
    `        int rows = 5;
        for (int i = 1; i <= rows; i++) {
            for (int s = 1; s <= rows - i; s++) System.out.print(" ");
            for (int j = 1; j <= 2 * i - 1; j++) System.out.print("*");
            System.out.println();
        }`,
    "    *\n   ***\n  *****\n *******\n*********"
  ),
  lesson(
    "pat-inverted-pyramid",
    "Inverted Pyramid",
    "patterns",
    "Upside-down centered pyramid — mirror of the pyramid pattern.",
    "Loop i from rows down to 1. Spaces increase as i decreases.",
    "InvertedPyramid",
    `        int rows = 5;
        for (int i = rows; i >= 1; i--) {
            for (int s = 1; s <= rows - i; s++) System.out.print(" ");
            for (int j = 1; j <= 2 * i - 1; j++) System.out.print("*");
            System.out.println();
        }`,
    "*********\n *******\n  *****\n   ***\n    *"
  ),
  lesson(
    "pat-diamond",
    "Diamond Pattern",
    "patterns",
    "Combine upward and downward pyramids to form a diamond.",
    "Interview favorite. Handle middle row once; watch off-by-one on the lower half.",
    "Diamond",
    `        int n = 4;
        for (int i = 1; i <= n; i++) {
            for (int s = 0; s < n - i; s++) System.out.print(" ");
            for (int j = 0; j < 2 * i - 1; j++) System.out.print("*");
            System.out.println();
        }
        for (int i = n - 1; i >= 1; i--) {
            for (int s = 0; s < n - i; s++) System.out.print(" ");
            for (int j = 0; j < 2 * i - 1; j++) System.out.print("*");
            System.out.println();
        }`,
    "   *\n  ***\n *****\n*******\n *****\n  ***\n   *"
  ),
  lesson(
    "pat-hollow-diamond",
    "Hollow Diamond",
    "patterns",
    "Print only the border stars of a diamond — tests condition logic inside loops.",
    "Print star only at edges: j==0, j==2*i-2, or similar boundary checks.",
    "HollowDiamond",
    `        int n = 5;
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= 2 * i - 1; j++) {
                if (j == 1 || j == 2 * i - 1) System.out.print("*");
                else System.out.print(" ");
            }
            System.out.println();
        }`,
    "*\n* *\n*   *\n*     *\n*       *"
  ),
  lesson(
    "pat-number-pyramid",
    "Number Pyramid (1 2 3)",
    "patterns",
    "Each row prints numbers 1 through i.",
    "Same nested loop structure as star triangle but print j instead of *.",
    "NumberPyramid",
    `        for (int i = 1; i <= 5; i++) {
            for (int j = 1; j <= i; j++) System.out.print(j + " ");
            System.out.println();
        }`,
    "1 \n1 2 \n1 2 3 \n1 2 3 4 \n1 2 3 4 5 "
  ),
  lesson(
    "pat-same-number",
    "Same Number Pyramid",
    "patterns",
    "Row i prints the number i repeated i times: 1, 2 2, 3 3 3...",
    "Frequently asked in Wipro and Capgemini pattern rounds.",
    "SameNumberPyramid",
    `        for (int i = 1; i <= 5; i++) {
            for (int j = 1; j <= i; j++) System.out.print(i + " ");
            System.out.println();
        }`,
    "1 \n2 2 \n3 3 3 \n4 4 4 4 \n5 5 5 5 5 "
  ),
  lesson(
    "pat-floyd",
    "Floyd's Triangle",
    "patterns",
    "Consecutive numbers across rows: 1; 2 3; 4 5 6...",
    "Use a counter variable incremented in the inner loop.",
    "FloydTriangle",
    `        int num = 1;
        for (int i = 1; i <= 4; i++) {
            for (int j = 1; j <= i; j++) {
                System.out.print(num++ + " ");
            }
            System.out.println();
        }`,
    "1 \n2 3 \n4 5 6 \n7 8 9 10 "
  ),
  lesson(
    "pat-pascal",
    "Pascal's Triangle",
    "patterns",
    "Each number is sum of two numbers above it. Classic interview pattern.",
    "Use combinatorics or build row-by-row with previous row values.",
    "PascalTriangle",
    `        int rows = 5;
        for (int i = 0; i < rows; i++) {
            for (int s = 0; s < rows - i - 1; s++) System.out.print(" ");
            int num = 1;
            for (int j = 0; j <= i; j++) {
                System.out.print(num + " ");
                num = num * (i - j) / (j + 1);
            }
            System.out.println();
        }`,
    "    1 \n   1 1 \n  1 2 1 \n 1 3 3 1 \n1 4 6 4 1 "
  ),
  lesson(
    "pat-square",
    "Full Square of Stars",
    "patterns",
    "Print a solid square of stars with equal rows and columns.",
    "Both loops run 1..n. Simple warm-up before hollow square.",
    "SquareStars",
    `        int n = 4;
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= n; j++) System.out.print("* ");
            System.out.println();
        }`,
    "* * * * \n* * * * \n* * * * \n* * * * "
  ),
  lesson(
    "pat-hollow-square",
    "Hollow Square",
    "patterns",
    "Print stars only on the border of a square.",
    "Star when i==1, i==n, j==1, or j==n; otherwise print space.",
    "HollowSquare",
    `        int n = 5;
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= n; j++) {
                if (i == 1 || i == n || j == 1 || j == n) System.out.print("* ");
                else System.out.print("  ");
            }
            System.out.println();
        }`,
    "* * * * * \n*         * \n*         * \n*         * \n* * * * * "
  ),
  lesson(
    "pat-rectangle",
    "Rectangle Pattern",
    "patterns",
    "Rectangle with different row and column counts.",
    "Outer loop = rows, inner loop = cols. Same logic as square with different limits.",
    "Rectangle",
    `        for (int i = 1; i <= 3; i++) {
            for (int j = 1; j <= 6; j++) System.out.print("*");
            System.out.println();
        }`,
    "******\n******\n******"
  ),
  lesson(
    "pat-right-arrow",
    "Right Arrow",
    "patterns",
    "Arrow pointing right using stars — tests asymmetric nested loops.",
    "Increase stars then decrease, or use two separate loop blocks.",
    "RightArrow",
    `        int n = 5;
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= i; j++) System.out.print("*");
            System.out.println();
        }
        for (int i = n - 1; i >= 1; i--) {
            for (int j = 1; j <= i; j++) System.out.print("*");
            System.out.println();
        }`,
    "*\n**\n***\n****\n*****\n****\n***\n**\n*"
  ),
  lesson(
    "pat-hourglass",
    "Hourglass Pattern",
    "patterns",
    "Inverted pyramid followed by upright pyramid — common visual pattern.",
    "Combine two loop blocks with shared middle row optional.",
    "Hourglass",
    `        int n = 4;
        for (int i = n; i >= 1; i--) {
            for (int s = 0; s < n - i; s++) System.out.print(" ");
            for (int j = 0; j < 2 * i - 1; j++) System.out.print("*");
            System.out.println();
        }
        for (int i = 2; i <= n; i++) {
            for (int s = 0; s < n - i; s++) System.out.print(" ");
            for (int j = 0; j < 2 * i - 1; j++) System.out.print("*");
            System.out.println();
        }`,
    " *******\n  *****\n   ***\n    *\n   ***\n  *****\n *******"
  ),
  lesson(
    "pat-butterfly",
    "Butterfly Pattern",
    "patterns",
    "Butterfly / wing pattern using stars and spaces — advanced nested loop problem.",
    "Split each row into left wing, gap, right wing with mirror logic.",
    "Butterfly",
    `        int n = 4;
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= i; j++) System.out.print("*");
            for (int j = 1; j <= 2 * (n - i); j++) System.out.print(" ");
            for (int j = 1; j <= i; j++) System.out.print("*");
            System.out.println();
        }`,
    "*      *\n**    **\n***  ***\n********"
  ),
  lesson(
    "pat-cross",
    "Plus / Cross Pattern",
    "patterns",
    "Print a plus sign shape with stars.",
    "Middle row and middle column are full; others sparse.",
    "CrossPattern",
    `        int n = 5, mid = n / 2 + 1;
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= n; j++) {
                if (i == mid || j == mid) System.out.print("* ");
                else System.out.print("  ");
            }
            System.out.println();
        }`,
    "    *     \n    *     \n* * * * * \n    *     \n    *     "
  ),
  lesson(
    "pat-alphabet-triangle",
    "Alphabet Triangle",
    "patterns",
    "Row i prints letters A through (A + i - 1).",
    "Use (char)('A' + j - 1) inside nested loops.",
    "AlphaTriangle",
    `        for (int i = 1; i <= 5; i++) {
            for (int j = 1; j <= i; j++) {
                System.out.print((char)('A' + j - 1) + " ");
            }
            System.out.println();
        }`,
    "A \nA B \nA B C \nA B C D \nA B C D E "
  ),
  lesson(
    "pat-binary",
    "Binary Number Triangle",
    "patterns",
    "Print binary sequence 1, 10, 11, 100... per row.",
    "Convert row number to binary or build with bit logic.",
    "BinaryTriangle",
    `        for (int i = 1; i <= 5; i++) {
            System.out.println(Integer.toBinaryString(i));
        }`,
    "1\n10\n11\n100\n101"
  ),
  lesson(
    "pat-fibonacci",
    "Fibonacci Series",
    "patterns",
    "Generate first N Fibonacci numbers using a loop.",
    "Interview must-know. a=0, b=1, then next = a+b, shift values each iteration.",
    "Fibonacci",
    `        int n = 10, a = 0, b = 1;
        System.out.print(a + " " + b + " ");
        for (int i = 3; i <= n; i++) {
            int next = a + b;
            System.out.print(next + " ");
            a = b;
            b = next;
        }`,
    "0 1 1 2 3 5 8 13 21 34 "
  ),
  lesson(
    "pat-factorial",
    "Factorial of N",
    "patterns",
    "Multiply numbers 1 to N in a loop.",
    "Classic loop accumulation. Watch overflow for large N.",
    "Factorial",
    `        int n = 5, fact = 1;
        for (int i = 1; i <= n; i++) fact *= i;
        System.out.println(n + "! = " + fact);`,
    "5! = 120"
  ),
  lesson(
    "pat-primes",
    "Prime Numbers in Range",
    "patterns",
    "Print all primes between 2 and N using nested loops.",
    "Outer loop tries each number; inner loop checks divisors up to sqrt(n).",
    "PrimesInRange",
    `        int n = 30;
        System.out.print("Primes up to " + n + ": ");
        for (int num = 2; num <= n; num++) {
            boolean prime = true;
            for (int d = 2; d * d <= num; d++) {
                if (num % d == 0) { prime = false; break; }
            }
            if (prime) System.out.print(num + " ");
        }`,
    "Primes up to 30: 2 3 5 7 11 13 17 19 23 29 "
  ),
  lesson(
    "pat-armstrong",
    "Armstrong Number Check",
    "patterns",
    "An Armstrong number equals sum of its digits raised to the power of digit count (e.g. 153).",
    "Extract digits with % 10 and n/=10 in a loop. Very common interview question.",
    "ArmstrongCheck",
    `        int num = 153, temp = num, sum = 0;
        int digits = String.valueOf(num).length();
        while (temp > 0) {
            int d = temp % 10;
            sum += Math.pow(d, digits);
            temp /= 10;
        }
        System.out.println(num + " is Armstrong? " + (sum == num));`,
    "153 is Armstrong? true"
  ),
  lesson(
    "pat-reverse-number",
    "Reverse a Number",
    "patterns",
    "Build reversed number digit by digit using while loop.",
    "rev = rev * 10 + digit. Asked in almost every Java fresher interview.",
    "ReverseNumber",
    `        int n = 12345, rev = 0;
        while (n > 0) {
            rev = rev * 10 + n % 10;
            n /= 10;
        }
        System.out.println("Reversed = " + rev);`,
    "Reversed = 54321"
  ),
  lesson(
    "pat-palindrome",
    "Palindrome Number",
    "patterns",
    "Check if a number reads the same forwards and backwards.",
    "Reverse the number and compare with original. Also test with strings.",
    "PalindromeCheck",
    `        int n = 121, temp = n, rev = 0;
        while (temp > 0) {
            rev = rev * 10 + temp % 10;
            temp /= 10;
        }
        System.out.println(n + " is palindrome? " + (n == rev));`,
    "121 is palindrome? true"
  ),
  lesson(
    "pat-sum-digits",
    "Sum of Digits",
    "patterns",
    "Add all digits of a number using a while loop.",
    "sum += n % 10; n /= 10; until n becomes 0.",
    "SumDigits",
    `        int n = 98765, sum = 0;
        while (n > 0) {
            sum += n % 10;
            n /= 10;
        }
        System.out.println("Sum of digits = " + sum);`,
    "Sum of digits = 35"
  ),
  lesson(
    "pat-count-digits",
    "Count Digits",
    "patterns",
    "Count how many digits a number has.",
    "Divide by 10 repeatedly until number becomes 0.",
    "CountDigits",
    `        int n = 987654321, count = 0, temp = n;
        while (temp > 0) {
            count++;
            temp /= 10;
        }
        System.out.println(n + " has " + count + " digits");`,
    "987654321 has 9 digits"
  ),
  lesson(
    "pat-mult-table",
    "Multiplication Table",
    "patterns",
    "Print multiplication table of N using nested loops.",
    "Outer loop = multiplier 1..10, or nested for full table grid.",
    "MultTable",
    `        int n = 7;
        for (int i = 1; i <= 10; i++) {
            System.out.println(n + " x " + i + " = " + (n * i));
        }`,
    "7 x 1 = 7\n7 x 2 = 14\n7 x 3 = 21\n7 x 4 = 28\n7 x 5 = 35\n7 x 6 = 42\n7 x 7 = 49\n7 x 8 = 56\n7 x 9 = 63\n7 x 10 = 70"
  ),
  lesson(
    "pat-gcd",
    "GCD (Euclidean Algorithm)",
    "patterns",
    "Find greatest common divisor using a while loop.",
    "while (b != 0) { temp = b; b = a % b; a = temp; }",
    "GcdLoop",
    `        int a = 48, b = 18;
        while (b != 0) {
            int t = b;
            b = a % b;
            a = t;
        }
        System.out.println("GCD = " + a);`,
    "GCD = 6"
  ),
  lesson(
    "pat-max-array",
    "Find Largest in Array",
    "patterns",
    "Loop through array to find maximum element.",
    "Initialize max = arr[0], compare each element. Same pattern for min and sum.",
    "MaxInArray",
    `        int[] arr = {3, 9, 1, 7, 5};
        int max = arr[0];
        for (int i = 1; i < arr.length; i++) {
            if (arr[i] > max) max = arr[i];
        }
        System.out.println("Max = " + max);`,
    "Max = 9"
  ),
  lesson(
    "pat-sum-n",
    "Sum of 1 to N",
    "patterns",
    "Accumulate running total from 1 to N — foundation for averages and statistics.",
    "sum = 0; for i 1..n sum += i. Formula n*(n+1)/2 gives same answer.",
    "SumN",
    `        int n = 100, sum = 0;
        for (int i = 1; i <= n; i++) sum += i;
        System.out.println("Sum 1.." + n + " = " + sum);`,
    "Sum 1..100 = 5050"
  ),
  lesson(
    "pat-perfect-number",
    "Perfect Number Check",
    "patterns",
    "A perfect number equals the sum of its proper divisors (e.g. 6 = 1+2+3).",
    "Loop i from 1 to n/2, add if n % i == 0. Compare sum with n.",
    "PerfectNumber",
    `        int n = 28, sum = 0;
        for (int i = 1; i < n; i++) {
            if (n % i == 0) sum += i;
        }
        System.out.println(n + " is perfect? " + (sum == n));`,
    "28 is perfect? true"
  ),
  lesson(
    "pat-power",
    "Power of a Number",
    "patterns",
    "Compute base^exp using a loop instead of Math.pow.",
    "result = 1; multiply by base exp times. Handle negative exp separately.",
    "PowerLoop",
    `        int base = 2, exp = 10, result = 1;
        for (int i = 0; i < exp; i++) result *= base;
        System.out.println(base + "^" + exp + " = " + result);`,
    "2^10 = 1024"
  ),
];

export function buildLoopsLessons() {
  return {
    slug: "loops",
    categories: [
      { id: "loop-types", label: "Loop Types" },
      { id: "patterns", label: "Patterns" },
      { id: "control", label: "Control" },
    ],
    subtopics: [...LOOP_TYPES, ...LOOP_PATTERNS, ...LOOP_CONTROL],
  };
}
