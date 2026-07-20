import {
  javaSolution,
  clsName,
  enrichProblem,
  defaultApproaches,
  pickCompanyTags,
} from "../lib/rich-fields.mjs";
import { estimatedMinutes } from "../lib/problem-type-spec.mjs";

const PATTERN_VARIANTS = [
  {
    id: "right-star-triangle",
    title: "Right Triangle Star Pattern",
    description: "Print a right triangle of stars with rows growing from 1 to n.",
    statement: "Given n, print n rows where row i contains i stars separated by spaces.",
    sampleN: 5,
    preview: "*\n* *\n* * *",
  },
  {
    id: "inverted-star-triangle",
    title: "Inverted Star Triangle",
    description: "Print stars in descending order from n to 1.",
    statement: "Given n, print n rows where row i has n - i + 1 stars.",
    sampleN: 5,
    preview: "* * * * *\n* * * *\n* * *",
  },
  {
    id: "number-right-triangle",
    title: "Increasing Number Triangle",
    description: "Print numbers from 1 up to row index on each row.",
    statement: "Given n, row i must print values 1..i.",
    sampleN: 5,
    preview: "1\n1 2\n1 2 3",
  },
  {
    id: "continuous-number-triangle",
    title: "Continuous Number Triangle",
    description: "Print a triangle where numbers continue globally.",
    statement: "Given n, print i numbers on row i while incrementing a global counter.",
    sampleN: 5,
    preview: "1\n2 3\n4 5 6",
  },
  {
    id: "binary-triangle",
    title: "Binary Triangle",
    description: "Print alternating 1 and 0 across each row.",
    statement: "Given n, print row i with i elements where value is (row + col) % 2.",
    sampleN: 6,
    preview: "1\n0 1\n1 0 1",
  },
  {
    id: "floyd-triangle",
    title: "Floyd Triangle",
    description: "Print Floyd's triangle for n rows.",
    statement: "Given n, print the first n rows of Floyd's triangle.",
    sampleN: 5,
    preview: "1\n2 3\n4 5 6",
  },
  {
    id: "palindrome-number-pyramid",
    title: "Palindrome Number Pyramid",
    description: "Print centered palindrome numbers in each row.",
    statement: "Given n, print row i as descending numbers i..1 then ascending 2..i.",
    sampleN: 5,
    preview: "1\n2 1 2\n3 2 1 2 3",
  },
  {
    id: "star-pyramid",
    title: "Centered Star Pyramid",
    description: "Print centered pyramid of stars with odd counts.",
    statement: "Given n, print row i with spaces then 2*i-1 stars.",
    sampleN: 5,
    preview: "    *\n   * * *\n  * * * * *",
  },
  {
    id: "inverted-star-pyramid",
    title: "Inverted Star Pyramid",
    description: "Print upside-down centered star pyramid.",
    statement: "Given n, print rows from n to 1 with centered stars.",
    sampleN: 5,
    preview: "* * * * * * * * *\n * * * * * * *\n  * * * * *",
  },
  {
    id: "diamond-stars",
    title: "Diamond Star Pattern",
    description: "Print a full diamond using stars.",
    statement: "Given n, print upper pyramid then lower inverted pyramid.",
    sampleN: 4,
    preview: "   *\n  * * *\n * * * * *",
  },
  {
    id: "hollow-square-stars",
    title: "Hollow Square",
    description: "Print hollow square border with stars.",
    statement: "Given n, print n x n square where borders are stars and inside is blank.",
    sampleN: 5,
    preview: "* * * * *\n*       *\n*       *",
  },
  {
    id: "hollow-right-triangle",
    title: "Hollow Right Triangle",
    description: "Print hollow right triangle using stars.",
    statement: "Given n, print stars on borders of right triangle.",
    sampleN: 6,
    preview: "*\n* *\n*   *",
  },
  {
    id: "hollow-pyramid",
    title: "Hollow Pyramid",
    description: "Print hollow centered pyramid.",
    statement: "Given n, print stars only on edges and base of pyramid.",
    sampleN: 5,
    preview: "    *\n   * *\n  *   *",
  },
  {
    id: "reverse-number-triangle",
    title: "Reverse Number Triangle",
    description: "Print decreasing length rows with increasing numbers.",
    statement: "Given n, row i prints numbers 1..(n-i+1).",
    sampleN: 5,
    preview: "1 2 3 4 5\n1 2 3 4\n1 2 3",
  },
  {
    id: "same-number-triangle",
    title: "Repeated Row Number Triangle",
    description: "Print row number repeated i times on row i.",
    statement: "Given n, row i should contain number i repeated i times.",
    sampleN: 5,
    preview: "1\n2 2\n3 3 3",
  },
  {
    id: "abc-triangle",
    title: "Alphabet Triangle",
    description: "Print alphabet sequence triangle.",
    statement: "Given n, print letters A.. on each row from A to current row letter.",
    sampleN: 5,
    preview: "A\nA B\nA B C",
  },
  {
    id: "pascal-triangle",
    title: "Pascal Triangle",
    description: "Print Pascal's triangle for n rows.",
    statement: "Given n, print binomial coefficients row by row.",
    sampleN: 6,
    preview: "1\n1 1\n1 2 1",
  },
  {
    id: "hourglass-stars",
    title: "Hourglass Pattern",
    description: "Print stars in hourglass shape.",
    statement: "Given n, print decreasing then increasing star triangles with indentation.",
    sampleN: 5,
    preview: "* * * * *\n * * * *\n  * * *",
  },
  {
    id: "number-square",
    title: "Concentric Number Square",
    description: "Print concentric square of numbers.",
    statement: "Given n, print 2*n-1 grid where border is n and values decrease inward.",
    sampleN: 4,
    preview: "4 4 4 4 4 4 4\n4 3 3 3 3 3 4\n4 3 2 2 2 3 4",
  },
  {
    id: "butterfly-stars",
    title: "Butterfly Pattern",
    description: "Print butterfly star pattern with spaces in the middle.",
    statement: "Given n, print mirrored wings using stars with shrinking and expanding gap.",
    sampleN: 5,
    preview: "*        *\n* *    * *\n* * *  * * *",
  },
  {
    id: "zero-one-square",
    title: "0-1 Checker Square",
    description: "Print square with alternating zero and one values.",
    statement: "Given n, print n x n matrix where cell value is (r+c)%2.",
    sampleN: 5,
    preview: "1 0 1 0 1\n0 1 0 1 0\n1 0 1 0 1",
  },
  {
    id: "x-star-pattern",
    title: "X Shape Star Pattern",
    description: "Print X shape with stars in square grid.",
    statement: "Given n, print stars when row==col or row+col==n-1.",
    sampleN: 7,
    preview: "*     *\n *   *\n  * *",
  },
  {
    id: "plus-star-pattern",
    title: "Plus Pattern",
    description: "Print plus sign using stars in odd n grid.",
    statement: "Given odd n, print stars on center row and center column.",
    sampleN: 7,
    preview: "   *\n   *\n*******",
  },
  {
    id: "rhombus-stars",
    title: "Rhombus Pattern",
    description: "Print slanted rhombus with stars.",
    statement: "Given n, print n rows of n stars with leading spaces by row.",
    sampleN: 5,
    preview: "    * * * * *\n   * * * * *\n  * * * * *",
  },
];

const LOGIC_VARIANTS = [
  { id: "sum-n", title: "Sum 1 To N", prompt: "Compute sum of first n natural numbers." },
  { id: "factorial", title: "Factorial", prompt: "Compute factorial of n using for loop." },
  { id: "prime-check", title: "Prime Check", prompt: "Check whether n is prime." },
  { id: "fibonacci-n", title: "First N Fibonacci", prompt: "Print first n Fibonacci numbers." },
  { id: "table-n", title: "Multiplication Table", prompt: "Print table of n up to 10." },
  { id: "count-digits", title: "Count Digits", prompt: "Count number of digits in n." },
  { id: "reverse-number", title: "Reverse Number", prompt: "Reverse digits of n." },
  { id: "gcd-two", title: "GCD", prompt: "Compute greatest common divisor of a and b." },
  { id: "lcm-two", title: "LCM", prompt: "Compute least common multiple of a and b." },
  { id: "perfect-number", title: "Perfect Number", prompt: "Check whether n is perfect number." },
  { id: "sum-even", title: "Sum Even 1..N", prompt: "Compute sum of even numbers from 1 to n." },
  { id: "sum-odd", title: "Sum Odd 1..N", prompt: "Compute sum of odd numbers from 1 to n." },
  { id: "power-loop", title: "Power", prompt: "Compute a^b using repeated multiplication." },
  { id: "armstrong-three", title: "Armstrong 3-Digit", prompt: "Check whether 3-digit n is Armstrong." },
  { id: "palindrome-number", title: "Palindrome Number", prompt: "Check if n is palindrome." },
  { id: "sum-digits", title: "Sum Of Digits", prompt: "Compute sum of digits in n." },
  { id: "product-digits", title: "Product Of Digits", prompt: "Compute product of digits in n." },
  { id: "count-zeros", title: "Count Zero Digits", prompt: "Count zero digits in n." },
  { id: "strong-number", title: "Strong Number", prompt: "Check if n equals sum of factorials of digits." },
  { id: "divisor-count", title: "Count Divisors", prompt: "Count positive divisors of n." },
];

const OUTPUT_PREDICTION_VARIANTS = [
  { id: "break-loop", title: "Output Prediction - break", focus: "break statement in loop" },
  { id: "continue-loop", title: "Output Prediction - continue", focus: "continue statement in loop" },
  { id: "nested-counter", title: "Output Prediction - nested", focus: "nested loops with counters" },
  { id: "step-loop", title: "Output Prediction - step", focus: "non-unit step in for loop" },
  { id: "post-pre", title: "Output Prediction - post/pre", focus: "post and pre increment behavior" },
  { id: "scope-loop", title: "Output Prediction - scope", focus: "variable scope around loop" },
  { id: "char-loop", title: "Output Prediction - char", focus: "character progression loop" },
  { id: "reverse-loop", title: "Output Prediction - reverse", focus: "reverse loop indices" },
  { id: "sum-reset", title: "Output Prediction - reset", focus: "reset variable in loop body" },
  { id: "conditional-append", title: "Output Prediction - conditional append", focus: "string build inside loop" },
];

const DRY_RUN_VARIANTS = [
  { id: "dry-sum", title: "Dry Run - Running Sum", focus: "trace sum updates" },
  { id: "dry-factorial", title: "Dry Run - Factorial", focus: "trace multiplication states" },
  { id: "dry-min", title: "Dry Run - Minimum", focus: "track current minimum" },
  { id: "dry-max", title: "Dry Run - Maximum", focus: "track current maximum" },
  { id: "dry-count-even", title: "Dry Run - Count Evens", focus: "count matches condition" },
  { id: "dry-prefix", title: "Dry Run - Prefix Sum", focus: "incremental totals" },
  { id: "dry-nested", title: "Dry Run - Nested Counter", focus: "nested loop accumulation" },
  { id: "dry-swap", title: "Dry Run - Swap By Loop", focus: "in-place swap walkthrough" },
  { id: "dry-window", title: "Dry Run - Sliding Window", focus: "fixed window sum trace" },
  { id: "dry-pattern", title: "Dry Run - Pattern Builder", focus: "string append per iteration" },
];

const NESTED_PATTERN_VARIANTS = [
  { id: "np-table-row", title: "Multiplication Grid", prompt: "Print multiplication grid n x n." },
  { id: "np-pascal", title: "Pascal Triangle (Nested)", prompt: "Print Pascal triangle with nested loops." },
  { id: "np-spiral", title: "Spiral Numbers", prompt: "Print spiral filling of matrix." },
  { id: "np-zigzag", title: "Zig Zag Matrix", prompt: "Print matrix in zig-zag rows." },
  { id: "np-snake", title: "Snake Pattern", prompt: "Print numbers in snake pattern." },
  { id: "np-checker", title: "Checker Board", prompt: "Print checker board with # and ." },
  { id: "np-border", title: "Border Numbers", prompt: "Print matrix border with numbers and 0 inside." },
  { id: "np-diagonal", title: "Dual Diagonal", prompt: "Print diagonals as stars and rest dots." },
  { id: "np-lower-tri", title: "Lower Triangle Matrix", prompt: "Print lower triangular values." },
  { id: "np-upper-tri", title: "Upper Triangle Matrix", prompt: "Print upper triangular values." },
  { id: "np-row-sums", title: "Row Sums Matrix", prompt: "Print row sum after each row." },
  { id: "np-col-sums", title: "Column Sums Matrix", prompt: "Print column sums after filling matrix." },
  { id: "np-triangle-wave", title: "Triangle Wave", prompt: "Print triangle wave numbers using nested loops." },
  { id: "np-diamond-number", title: "Diamond Numbers", prompt: "Print diamond style number grid." },
  { id: "np-hollow-diamond", title: "Hollow Diamond", prompt: "Print hollow diamond with nested loops." },
  { id: "np-cross-box", title: "Cross In Box", prompt: "Print cross inside n x n border." },
  { id: "np-rhombus-num", title: "Rhombus Numbers", prompt: "Print numeric rhombus." },
  { id: "np-wave-col", title: "Wave Columns", prompt: "Print matrix in vertical wave order." },
  { id: "np-stair-grid", title: "Staircase Grid", prompt: "Print staircase markers in matrix." },
  { id: "np-shift-grid", title: "Shifted Grid", prompt: "Print cyclic shifted row values." },
];

const INTERVIEW_VARIANTS = [
  { id: "second-largest", title: "Find Second Largest", prompt: "Find second largest element in array." },
  { id: "primes-range", title: "Primes In Range", prompt: "Print primes in [L, R]." },
  { id: "armstrong-range", title: "Armstrong In Range", prompt: "Print Armstrong numbers in range." },
  { id: "perfect-range", title: "Perfect Numbers In Range", prompt: "Print perfect numbers in range." },
  { id: "palindrome-range", title: "Palindrome Numbers In Range", prompt: "Print palindrome numbers in range." },
  { id: "sum-prime-digits", title: "Sum Prime Digits", prompt: "Compute sum of prime digits in number." },
  { id: "frequency-array", title: "Frequency Count", prompt: "Count frequencies of digits 0..9." },
  { id: "missing-number", title: "Missing Number", prompt: "Find missing number from 1..n." },
  { id: "duplicate-first", title: "First Duplicate", prompt: "Find first duplicate element by order." },
  { id: "leaders-array", title: "Array Leaders", prompt: "Print leaders in array from right." },
  { id: "equilibrium", title: "Equilibrium Index", prompt: "Find equilibrium index of array." },
  { id: "subarray-sum", title: "Subarray Sum", prompt: "Find if subarray with target sum exists." },
  { id: "rotate-k", title: "Rotate Array K", prompt: "Rotate array right by k positions." },
  { id: "pair-sum", title: "Pair Sum", prompt: "Check if pair with target sum exists." },
  { id: "longest-run", title: "Longest Consecutive Run", prompt: "Find longest increasing consecutive run length." },
];

const HACKERRANK_VARIANTS = [
  { id: "hr-series-sum", title: "Series Sum", prompt: "Compute sum of custom arithmetic series." },
  { id: "hr-ap-term", title: "Nth AP Term", prompt: "Compute nth term and sum of AP." },
  { id: "hr-gp-term", title: "GP Growth", prompt: "Compute nth GP term and partial sum." },
  { id: "hr-square-series", title: "Square Series", prompt: "Sum i^2 for i=1..n." },
  { id: "hr-cube-series", title: "Cube Series", prompt: "Sum i^3 for i=1..n." },
  { id: "hr-alternate-series", title: "Alternating Series", prompt: "Compute 1-2+3-4...n." },
  { id: "hr-harmonic", title: "Harmonic Prefix", prompt: "Compute first n harmonic terms with precision." },
  { id: "hr-pattern-formula", title: "Formula Pattern", prompt: "Print formula based triangle values." },
  { id: "hr-weighted-sum", title: "Weighted Sum", prompt: "Compute weighted array sum." },
  { id: "hr-polynomial", title: "Polynomial Value", prompt: "Evaluate polynomial for given x." },
  { id: "hr-lattice", title: "Lattice Paths DP", prompt: "Count paths in n x m lattice with loops." },
  { id: "hr-stair-ways", title: "Stair Ways", prompt: "Count ways to climb stairs using loops." },
  { id: "hr-matrix-sum", title: "Matrix Hourglass", prompt: "Find max hourglass sum." },
  { id: "hr-diagonal-diff", title: "Diagonal Difference", prompt: "Compute absolute diagonal difference." },
  { id: "hr-running-median-lite", title: "Running Median Lite", prompt: "Maintain sorted list and median index." },
  { id: "hr-stock-span-lite", title: "Stock Span Lite", prompt: "Compute stock spans using nested loops." },
  { id: "hr-josephus-lite", title: "Josephus Lite", prompt: "Simulate Josephus elimination." },
  { id: "hr-prime-density", title: "Prime Density", prompt: "Compute ratio of primes in [1,n]." },
  { id: "hr-mod-series", title: "Modulo Series", prompt: "Compute sum of i % k for i=1..n." },
  { id: "hr-power-mod", title: "Power Mod", prompt: "Compute a^b % m with loop exponentiation." },
];

const LEETCODE_VARIANTS = [
  { id: "lc-container-lite", title: "Container With Most Water (Lite)", prompt: "Find max area by two pointers." },
  { id: "lc-trap-lite", title: "Trapping Rain Water (Lite)", prompt: "Compute trapped water with precomputed max arrays." },
  { id: "lc-product-except-self", title: "Product Except Self", prompt: "Compute product except self without division." },
  { id: "lc-best-time-stock", title: "Best Time To Buy Sell Stock", prompt: "Find max profit with one transaction." },
  { id: "lc-max-subarray", title: "Maximum Subarray", prompt: "Kadane loop solution." },
  { id: "lc-move-zeroes", title: "Move Zeroes", prompt: "Move zeroes to end preserving order." },
  { id: "lc-rotate-array", title: "Rotate Array", prompt: "Rotate array by k using reversal." },
  { id: "lc-majority", title: "Majority Element", prompt: "Boyer-Moore majority vote." },
  { id: "lc-two-sum-sorted", title: "Two Sum Sorted", prompt: "Two pointers on sorted array." },
  { id: "lc-remove-duplicates", title: "Remove Duplicates Sorted", prompt: "In-place unique compaction." },
  { id: "lc-longest-ones", title: "Max Consecutive Ones", prompt: "Find longest run of ones." },
  { id: "lc-max-product-subarray", title: "Max Product Subarray", prompt: "Track max and min products." },
  { id: "lc-jump-game", title: "Jump Game", prompt: "Greedy reachability check." },
  { id: "lc-gas-station", title: "Gas Station", prompt: "Find feasible starting station." },
  { id: "lc-candy-lite", title: "Candy Distribution", prompt: "Two-pass candy assignment." },
  { id: "lc-h-index-lite", title: "H-Index", prompt: "Compute H index from sorted citation counts." },
  { id: "lc-min-subarray-len", title: "Min Subarray Length", prompt: "Sliding window for target sum." },
  { id: "lc-subarray-product-k", title: "Subarray Product Less Than K", prompt: "Count windows with product < k." },
  { id: "lc-spiral-matrix", title: "Spiral Matrix Traversal", prompt: "Traverse matrix in spiral order." },
  { id: "lc-set-matrix-zeroes-lite", title: "Set Matrix Zeroes Lite", prompt: "Mark rows and cols then zero matrix." },
];

const COMPANY_VARIANTS = [
  { id: "co-amazon-delivery", title: "Amazon - Delivery Slots", company: "Amazon", prompt: "Count contiguous windows meeting capacity." },
  { id: "co-google-clicks", title: "Google - Click Spike", company: "Google", prompt: "Find peak rolling click count." },
  { id: "co-microsoft-build", title: "Microsoft - Build Duration", company: "Microsoft", prompt: "Compute weighted build score." },
  { id: "co-adobe-render", title: "Adobe - Render Batches", company: "Adobe", prompt: "Group jobs by frame budget." },
  { id: "co-meta-feed", title: "Meta - Feed Ranking", company: "Meta", prompt: "Compute top engagement index." },
  { id: "co-uber-route", title: "Uber - Route Profit", company: "Uber", prompt: "Max profit contiguous rides." },
  { id: "co-netflix-buffer", title: "Netflix - Buffer Stability", company: "Netflix", prompt: "Longest stable bitrate streak." },
  { id: "co-apple-thermal", title: "Apple - Thermal Window", company: "Apple", prompt: "Count safe windows by thermal sum." },
  { id: "co-oracle-query", title: "Oracle - Query Buckets", company: "Oracle", prompt: "Bucket query costs by thresholds." },
  { id: "co-flipkart-cart", title: "Flipkart - Cart Discount", company: "Flipkart", prompt: "Find best discount sequence." },
];

function getVariant(list, index) {
  const i = ((Number(index) || 0) % list.length + list.length) % list.length;
  return { variant: list[i], index: i };
}

function linesToTrace(lines) {
  return lines.map((item, idx) => ({
    line: idx + 1,
    action: item.action,
    state: item.state,
  }));
}

function format2D(lines) {
  return lines.join("\n");
}

function buildPatternOutput(kind, n) {
  const rows = [];
  if (kind === "right-star-triangle") {
    for (let i = 1; i <= n; i++) rows.push(Array(i).fill("*").join(" "));
  } else if (kind === "inverted-star-triangle") {
    for (let i = n; i >= 1; i--) rows.push(Array(i).fill("*").join(" "));
  } else if (kind === "number-right-triangle") {
    for (let i = 1; i <= n; i++) rows.push(Array.from({ length: i }, (_, c) => c + 1).join(" "));
  } else if (kind === "continuous-number-triangle" || kind === "floyd-triangle") {
    let cur = 1;
    for (let i = 1; i <= n; i++) {
      const row = [];
      for (let c = 1; c <= i; c++) row.push(cur++);
      rows.push(row.join(" "));
    }
  } else if (kind === "binary-triangle") {
    for (let i = 1; i <= n; i++) {
      const row = [];
      for (let c = 1; c <= i; c++) row.push((i + c) % 2 === 0 ? "1" : "0");
      rows.push(row.join(" "));
    }
  } else if (kind === "palindrome-number-pyramid") {
    for (let i = 1; i <= n; i++) {
      const left = [];
      const right = [];
      for (let x = i; x >= 1; x--) left.push(String(x));
      for (let x = 2; x <= i; x++) right.push(String(x));
      rows.push(`${left.join(" ")}${right.length ? " " : ""}${right.join(" ")}`);
    }
  } else if (kind === "star-pyramid") {
    for (let i = 1; i <= n; i++) rows.push(`${" ".repeat(n - i)}${Array(2 * i - 1).fill("*").join(" ")}`);
  } else if (kind === "inverted-star-pyramid") {
    for (let i = n; i >= 1; i--) rows.push(`${" ".repeat(n - i)}${Array(2 * i - 1).fill("*").join(" ")}`);
  } else if (kind === "diamond-stars") {
    for (let i = 1; i <= n; i++) rows.push(`${" ".repeat(n - i)}${Array(2 * i - 1).fill("*").join(" ")}`);
    for (let i = n - 1; i >= 1; i--) rows.push(`${" ".repeat(n - i)}${Array(2 * i - 1).fill("*").join(" ")}`);
  } else if (kind === "hollow-square-stars") {
    for (let r = 1; r <= n; r++) {
      const row = [];
      for (let c = 1; c <= n; c++) row.push(r === 1 || c === 1 || r === n || c === n ? "*" : " ");
      rows.push(row.join(" "));
    }
  } else if (kind === "hollow-right-triangle") {
    for (let r = 1; r <= n; r++) {
      const row = [];
      for (let c = 1; c <= r; c++) row.push(c === 1 || c === r || r === n ? "*" : " ");
      rows.push(row.join(" "));
    }
  } else if (kind === "hollow-pyramid") {
    for (let r = 1; r <= n; r++) {
      const row = [];
      for (let c = 1; c <= 2 * n - 1; c++) {
        const left = n - r + 1;
        const right = n + r - 1;
        row.push(c === left || c === right || r === n ? "*" : " ");
      }
      rows.push(row.join(""));
    }
  } else if (kind === "reverse-number-triangle") {
    for (let r = n; r >= 1; r--) rows.push(Array.from({ length: r }, (_, c) => c + 1).join(" "));
  } else if (kind === "same-number-triangle") {
    for (let r = 1; r <= n; r++) rows.push(Array(r).fill(String(r)).join(" "));
  } else if (kind === "abc-triangle") {
    for (let r = 1; r <= n; r++) rows.push(Array.from({ length: r }, (_, c) => String.fromCharCode(65 + c)).join(" "));
  } else if (kind === "pascal-triangle") {
    for (let r = 0; r < n; r++) {
      let value = 1;
      const row = [];
      for (let c = 0; c <= r; c++) {
        row.push(String(value));
        value = Math.floor((value * (r - c)) / (c + 1));
      }
      rows.push(row.join(" "));
    }
  } else if (kind === "hourglass-stars") {
    for (let i = n; i >= 1; i--) rows.push(`${" ".repeat(n - i)}${Array(i).fill("*").join(" ")}`);
    for (let i = 2; i <= n; i++) rows.push(`${" ".repeat(n - i)}${Array(i).fill("*").join(" ")}`);
  } else if (kind === "number-square") {
    const size = 2 * n - 1;
    for (let r = 0; r < size; r++) {
      const row = [];
      for (let c = 0; c < size; c++) {
        const top = r;
        const left = c;
        const right = size - 1 - c;
        const bottom = size - 1 - r;
        row.push(String(n - Math.min(Math.min(top, bottom), Math.min(left, right))));
      }
      rows.push(row.join(" "));
    }
  } else if (kind === "butterfly-stars") {
    for (let r = 1; r <= n; r++) {
      const wing = Array(r).fill("*").join(" ");
      const gap = " ".repeat(2 * (n - r) + 1);
      rows.push(`${wing}${gap}${wing}`);
    }
    for (let r = n; r >= 1; r--) {
      const wing = Array(r).fill("*").join(" ");
      const gap = " ".repeat(2 * (n - r) + 1);
      rows.push(`${wing}${gap}${wing}`);
    }
  } else if (kind === "zero-one-square") {
    for (let r = 0; r < n; r++) {
      const row = [];
      for (let c = 0; c < n; c++) row.push((r + c) % 2 === 0 ? "1" : "0");
      rows.push(row.join(" "));
    }
  } else if (kind === "x-star-pattern") {
    for (let r = 0; r < n; r++) {
      const row = [];
      for (let c = 0; c < n; c++) row.push(r === c || r + c === n - 1 ? "*" : " ");
      rows.push(row.join(""));
    }
  } else if (kind === "plus-star-pattern") {
    const mid = Math.floor(n / 2);
    for (let r = 0; r < n; r++) {
      const row = [];
      for (let c = 0; c < n; c++) row.push(r === mid || c === mid ? "*" : " ");
      rows.push(row.join(""));
    }
  } else if (kind === "rhombus-stars") {
    for (let r = 1; r <= n; r++) rows.push(`${" ".repeat(n - r)}${Array(n).fill("*").join(" ")}`);
  }
  return rows.join("\n");
}

function buildPatternMainBody(kind, n) {
  const snippets = {
    "right-star-triangle": `        for (int row = 1; row <= n; row++) {
            StringBuilder sb = new StringBuilder();
            for (int col = 1; col <= row; col++) {
                if (col > 1) sb.append(" ");
                sb.append("*");
            }
            System.out.println(sb);
        }`,
    "inverted-star-triangle": `        for (int row = n; row >= 1; row--) {
            StringBuilder sb = new StringBuilder();
            for (int col = 1; col <= row; col++) {
                if (col > 1) sb.append(" ");
                sb.append("*");
            }
            System.out.println(sb);
        }`,
    "number-right-triangle": `        for (int row = 1; row <= n; row++) {
            StringBuilder sb = new StringBuilder();
            for (int col = 1; col <= row; col++) {
                if (col > 1) sb.append(" ");
                sb.append(col);
            }
            System.out.println(sb);
        }`,
    "continuous-number-triangle": `        int value = 1;
        for (int row = 1; row <= n; row++) {
            StringBuilder sb = new StringBuilder();
            for (int col = 1; col <= row; col++) {
                if (col > 1) sb.append(" ");
                sb.append(value++);
            }
            System.out.println(sb);
        }`,
    "binary-triangle": `        for (int row = 1; row <= n; row++) {
            StringBuilder sb = new StringBuilder();
            for (int col = 1; col <= row; col++) {
                if (col > 1) sb.append(" ");
                sb.append(((row + col) % 2 == 0) ? "1" : "0");
            }
            System.out.println(sb);
        }`,
    "floyd-triangle": `        int value = 1;
        for (int row = 1; row <= n; row++) {
            StringBuilder sb = new StringBuilder();
            for (int col = 1; col <= row; col++) {
                if (col > 1) sb.append(" ");
                sb.append(value++);
            }
            System.out.println(sb);
        }`,
    "palindrome-number-pyramid": `        for (int row = 1; row <= n; row++) {
            StringBuilder sb = new StringBuilder();
            for (int x = row; x >= 1; x--) {
                if (sb.length() > 0) sb.append(" ");
                sb.append(x);
            }
            for (int x = 2; x <= row; x++) {
                sb.append(" ").append(x);
            }
            System.out.println(sb);
        }`,
    "star-pyramid": `        for (int row = 1; row <= n; row++) {
            StringBuilder sb = new StringBuilder();
            for (int s = 1; s <= n - row; s++) sb.append(" ");
            for (int col = 1; col <= 2 * row - 1; col++) {
                if (col > 1) sb.append(" ");
                sb.append("*");
            }
            System.out.println(sb);
        }`,
    "inverted-star-pyramid": `        for (int row = n; row >= 1; row--) {
            StringBuilder sb = new StringBuilder();
            for (int s = 1; s <= n - row; s++) sb.append(" ");
            for (int col = 1; col <= 2 * row - 1; col++) {
                if (col > 1) sb.append(" ");
                sb.append("*");
            }
            System.out.println(sb);
        }`,
    "diamond-stars": `        for (int row = 1; row <= n; row++) {
            StringBuilder sb = new StringBuilder();
            for (int s = 1; s <= n - row; s++) sb.append(" ");
            for (int col = 1; col <= 2 * row - 1; col++) {
                if (col > 1) sb.append(" ");
                sb.append("*");
            }
            System.out.println(sb);
        }
        for (int row = n - 1; row >= 1; row--) {
            StringBuilder sb = new StringBuilder();
            for (int s = 1; s <= n - row; s++) sb.append(" ");
            for (int col = 1; col <= 2 * row - 1; col++) {
                if (col > 1) sb.append(" ");
                sb.append("*");
            }
            System.out.println(sb);
        }`,
    "hollow-square-stars": `        for (int row = 1; row <= n; row++) {
            StringBuilder sb = new StringBuilder();
            for (int col = 1; col <= n; col++) {
                if (col > 1) sb.append(" ");
                if (row == 1 || row == n || col == 1 || col == n) sb.append("*");
                else sb.append(" ");
            }
            System.out.println(sb);
        }`,
    "hollow-right-triangle": `        for (int row = 1; row <= n; row++) {
            StringBuilder sb = new StringBuilder();
            for (int col = 1; col <= row; col++) {
                if (col > 1) sb.append(" ");
                if (col == 1 || col == row || row == n) sb.append("*");
                else sb.append(" ");
            }
            System.out.println(sb);
        }`,
    "hollow-pyramid": `        for (int row = 1; row <= n; row++) {
            StringBuilder sb = new StringBuilder();
            for (int col = 1; col <= 2 * n - 1; col++) {
                int left = n - row + 1;
                int right = n + row - 1;
                if (col == left || col == right || row == n) sb.append("*");
                else sb.append(" ");
            }
            System.out.println(sb);
        }`,
    "reverse-number-triangle": `        for (int row = n; row >= 1; row--) {
            StringBuilder sb = new StringBuilder();
            for (int col = 1; col <= row; col++) {
                if (col > 1) sb.append(" ");
                sb.append(col);
            }
            System.out.println(sb);
        }`,
    "same-number-triangle": `        for (int row = 1; row <= n; row++) {
            StringBuilder sb = new StringBuilder();
            for (int col = 1; col <= row; col++) {
                if (col > 1) sb.append(" ");
                sb.append(row);
            }
            System.out.println(sb);
        }`,
    "abc-triangle": `        for (int row = 1; row <= n; row++) {
            StringBuilder sb = new StringBuilder();
            for (int col = 0; col < row; col++) {
                if (col > 0) sb.append(" ");
                sb.append((char) ('A' + col));
            }
            System.out.println(sb);
        }`,
    "pascal-triangle": `        for (int row = 0; row < n; row++) {
            long value = 1;
            StringBuilder sb = new StringBuilder();
            for (int col = 0; col <= row; col++) {
                if (col > 0) sb.append(" ");
                sb.append(value);
                value = value * (row - col) / (col + 1);
            }
            System.out.println(sb);
        }`,
    "hourglass-stars": `        for (int row = n; row >= 1; row--) {
            StringBuilder sb = new StringBuilder();
            for (int s = 1; s <= n - row; s++) sb.append(" ");
            for (int col = 1; col <= row; col++) {
                if (col > 1) sb.append(" ");
                sb.append("*");
            }
            System.out.println(sb);
        }
        for (int row = 2; row <= n; row++) {
            StringBuilder sb = new StringBuilder();
            for (int s = 1; s <= n - row; s++) sb.append(" ");
            for (int col = 1; col <= row; col++) {
                if (col > 1) sb.append(" ");
                sb.append("*");
            }
            System.out.println(sb);
        }`,
    "number-square": `        int size = 2 * n - 1;
        for (int row = 0; row < size; row++) {
            StringBuilder sb = new StringBuilder();
            for (int col = 0; col < size; col++) {
                int top = row;
                int left = col;
                int right = size - 1 - col;
                int bottom = size - 1 - row;
                int value = n - Math.min(Math.min(top, bottom), Math.min(left, right));
                if (col > 0) sb.append(" ");
                sb.append(value);
            }
            System.out.println(sb);
        }`,
    "butterfly-stars": `        for (int row = 1; row <= n; row++) {
            StringBuilder sb = new StringBuilder();
            for (int col = 1; col <= row; col++) {
                if (col > 1) sb.append(" ");
                sb.append("*");
            }
            int gap = 2 * (n - row) + 1;
            for (int s = 0; s < gap; s++) sb.append(" ");
            for (int col = 1; col <= row; col++) {
                if (col > 1) sb.append(" ");
                sb.append("*");
            }
            System.out.println(sb);
        }
        for (int row = n; row >= 1; row--) {
            StringBuilder sb = new StringBuilder();
            for (int col = 1; col <= row; col++) {
                if (col > 1) sb.append(" ");
                sb.append("*");
            }
            int gap = 2 * (n - row) + 1;
            for (int s = 0; s < gap; s++) sb.append(" ");
            for (int col = 1; col <= row; col++) {
                if (col > 1) sb.append(" ");
                sb.append("*");
            }
            System.out.println(sb);
        }`,
    "zero-one-square": `        for (int row = 0; row < n; row++) {
            StringBuilder sb = new StringBuilder();
            for (int col = 0; col < n; col++) {
                if (col > 0) sb.append(" ");
                sb.append((row + col) % 2 == 0 ? "1" : "0");
            }
            System.out.println(sb);
        }`,
    "x-star-pattern": `        for (int row = 0; row < n; row++) {
            StringBuilder sb = new StringBuilder();
            for (int col = 0; col < n; col++) {
                if (row == col || row + col == n - 1) sb.append("*");
                else sb.append(" ");
            }
            System.out.println(sb);
        }`,
    "plus-star-pattern": `        int mid = n / 2;
        for (int row = 0; row < n; row++) {
            StringBuilder sb = new StringBuilder();
            for (int col = 0; col < n; col++) {
                if (row == mid || col == mid) sb.append("*");
                else sb.append(" ");
            }
            System.out.println(sb);
        }`,
    "rhombus-stars": `        for (int row = 1; row <= n; row++) {
            StringBuilder sb = new StringBuilder();
            for (int s = 1; s <= n - row; s++) sb.append(" ");
            for (int col = 1; col <= n; col++) {
                if (col > 1) sb.append(" ");
                sb.append("*");
            }
            System.out.println(sb);
        }`,
  };
  const snippet = snippets[kind] ?? snippets["right-star-triangle"];
  return `        int n = ${n};
${snippet}`;
}

function buildPatternProblem(difficulty, index) {
  const { variant, index: normalized } = getVariant(PATTERN_VARIANTS, index);
  const className = clsName("for-loop", `${difficulty}${variant.id.replace(/-/g, "")}${normalized}`);
  const n = variant.sampleN + (difficulty === "medium" ? 1 : 0);
  const expectedOutput = buildPatternOutput(variant.id, n);
  const code = javaSolution(
    className,
    ["java.util.*"],
    `    // Pattern rendering helper kept in main for interview readability.
`,
    buildPatternMainBody(variant.id, n)
  );
  const executionTrace = linesToTrace([
    { action: "Initialize n and enter outer loop", state: `n=${n}, row=1` },
    { action: "Build current row string using inner loop", state: `pattern=${variant.id}` },
    { action: "Print completed row", state: "stdout appends one line" },
    { action: "Increment row and continue", state: "row++ until row>n" },
    { action: "Terminate loops", state: "pattern complete" },
  ]);
  return {
    title: variant.title,
    description: variant.description,
    problemStatement: variant.statement,
    problemType: "pattern",
    constraints: [
      `1 <= n <= ${difficulty === "easy" ? 8 : 12}`,
      "Use only for-loops for row and column traversal.",
      "Maintain exact spacing and line breaks.",
    ],
    exampleInput: `n = ${n}`,
    exampleOutput: expectedOutput,
    explanation: `Use two loops: one for rows and one for columns. In each cell, decide whether to print a token based on row/column rules for ${variant.id}.`,
    approaches: defaultApproaches(difficulty, "O(n^2)", "O(n^2)", "O(1)"),
    code,
    filename: `${className}.java`,
    expectedOutput,
    dryRun: `For row=1, generate first line. Continue until row=${n}.`,
    visualization: `Grid visualization: each row computes tokens according to ${variant.id} and writes to stdout.`,
    patternPreview: variant.preview,
    executionTrace,
    hints: [
      "Write the row condition first, then token value.",
      "Use StringBuilder for predictable spacing.",
      "Test with n=1 and n=2 before larger values.",
    ],
    companyTags: pickCompanyTags("for-loop", difficulty, normalized),
    commonMistakes: [
      "Printing trailing spaces and failing output match.",
      "Using wrong loop bounds (<= vs <).",
      "Mixing row and column indices while checking conditions.",
    ],
    interviewTips: [
      "Explain the matrix view even for triangle patterns.",
      "Name conditions clearly: border, diagonal, center.",
    ],
    alternativeSolutions: [
      "Precompute each row as char array then print.",
      "Use helper methods for each pattern family.",
    ],
    followUpQuestions: [
      "How would you refactor to support custom symbols?",
      "Can you produce the same output with a single loop?",
    ],
    practiceVariations: [
      "Mirror the pattern horizontally.",
      "Replace stars with row index.",
    ],
    estimatedMinutes: estimatedMinutes(difficulty, "pattern"),
  };
}

function numberArray(seed, length, min, spread) {
  const arr = [];
  for (let i = 0; i < length; i++) {
    const value = min + ((seed * 17 + i * 11) % spread);
    arr.push(value);
  }
  return arr;
}

function buildLogicProblem(difficulty, index) {
  const { variant, index: normalized } = getVariant(LOGIC_VARIANTS, index);
  const className = clsName("for-loop", `${difficulty}${variant.id}${normalized}`);
  const n = 6 + (normalized % 7);
  const a = 12 + (normalized % 8);
  const b = 18 + (normalized % 10);
  let expectedOutput = "";
  let statement = variant.prompt;
  let mainBody = "";

  if (variant.id === "sum-n") {
    expectedOutput = String((n * (n + 1)) / 2);
    mainBody = `        int n = ${n};
        int sum = 0;
        for (int i = 1; i <= n; i++) {
            sum += i;
        }
        System.out.println(sum);`;
  } else if (variant.id === "factorial") {
    let fact = 1;
    for (let i = 2; i <= n; i++) fact *= i;
    expectedOutput = String(fact);
    mainBody = `        int n = ${n};
        long fact = 1;
        for (int i = 2; i <= n; i++) {
            fact *= i;
        }
        System.out.println(fact);`;
  } else if (variant.id === "prime-check") {
    const x = 29 + normalized;
    let prime = x > 1;
    for (let d = 2; d * d <= x; d++) if (x % d === 0) prime = false;
    expectedOutput = prime ? "PRIME" : "NOT PRIME";
    statement = `Check whether n=${x} is prime.`;
    mainBody = `        int n = ${x};
        boolean prime = n > 1;
        for (int d = 2; d * d <= n; d++) {
            if (n % d == 0) {
                prime = false;
                break;
            }
        }
        System.out.println(prime ? "PRIME" : "NOT PRIME");`;
  } else if (variant.id === "fibonacci-n") {
    const terms = 8;
    const seq = [];
    let x = 0;
    let y = 1;
    for (let i = 0; i < terms; i++) {
      seq.push(String(x));
      const next = x + y;
      x = y;
      y = next;
    }
    expectedOutput = seq.join(" ");
    mainBody = `        int terms = ${terms};
        int a = 0, b = 1;
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < terms; i++) {
            if (i > 0) sb.append(" ");
            sb.append(a);
            int next = a + b;
            a = b;
            b = next;
        }
        System.out.println(sb);`;
  } else if (variant.id === "table-n") {
    const t = 7 + (normalized % 4);
    const lines = [];
    for (let i = 1; i <= 10; i++) lines.push(`${t} x ${i} = ${t * i}`);
    expectedOutput = lines.join("\n");
    mainBody = `        int n = ${t};
        for (int i = 1; i <= 10; i++) {
            System.out.println(n + " x " + i + " = " + (n * i));
        }`;
  } else if (variant.id === "count-digits") {
    const val = 10000 + normalized * 73;
    expectedOutput = String(String(val).length);
    mainBody = `        int n = ${val};
        int count = 0;
        for (int x = n; x > 0; x /= 10) {
            count++;
        }
        System.out.println(count);`;
  } else if (variant.id === "reverse-number") {
    const val = 12340 + normalized * 11;
    const rev = Number(String(val).split("").reverse().join(""));
    expectedOutput = String(rev);
    mainBody = `        int n = ${val};
        int rev = 0;
        for (int x = n; x > 0; x /= 10) {
            rev = rev * 10 + (x % 10);
        }
        System.out.println(rev);`;
  } else if (variant.id === "gcd-two") {
    const g = gcd(a, b);
    expectedOutput = String(g);
    mainBody = `        int a = ${a};
        int b = ${b};
        int gcd = 1;
        for (int i = 1; i <= Math.min(a, b); i++) {
            if (a % i == 0 && b % i == 0) gcd = i;
        }
        System.out.println(gcd);`;
  } else if (variant.id === "lcm-two") {
    const l = (a * b) / gcd(a, b);
    expectedOutput = String(l);
    mainBody = `        int a = ${a};
        int b = ${b};
        int gcd = 1;
        for (int i = 1; i <= Math.min(a, b); i++) {
            if (a % i == 0 && b % i == 0) gcd = i;
        }
        int lcm = (a * b) / gcd;
        System.out.println(lcm);`;
  } else if (variant.id === "perfect-number") {
    const target = 28;
    expectedOutput = "PERFECT";
    mainBody = `        int n = ${target};
        int sum = 0;
        for (int i = 1; i < n; i++) {
            if (n % i == 0) sum += i;
        }
        System.out.println(sum == n ? "PERFECT" : "NOT PERFECT");`;
  } else if (variant.id === "sum-even") {
    let sum = 0;
    for (let i = 2; i <= n * 2; i += 2) sum += i;
    expectedOutput = String(sum);
    mainBody = `        int n = ${n * 2};
        int sum = 0;
        for (int i = 2; i <= n; i += 2) sum += i;
        System.out.println(sum);`;
  } else if (variant.id === "sum-odd") {
    let sum = 0;
    for (let i = 1; i <= n * 2; i += 2) sum += i;
    expectedOutput = String(sum);
    mainBody = `        int n = ${n * 2};
        int sum = 0;
        for (int i = 1; i <= n; i += 2) sum += i;
        System.out.println(sum);`;
  } else if (variant.id === "power-loop") {
    const base = 3;
    const exp = 6 + (normalized % 3);
    let p = 1;
    for (let i = 0; i < exp; i++) p *= base;
    expectedOutput = String(p);
    mainBody = `        int a = ${base};
        int b = ${exp};
        long result = 1;
        for (int i = 0; i < b; i++) result *= a;
        System.out.println(result);`;
  } else if (variant.id === "armstrong-three") {
    const val = 153;
    expectedOutput = "ARMSTRONG";
    mainBody = `        int n = ${val};
        int sum = 0;
        for (int x = n; x > 0; x /= 10) {
            int d = x % 10;
            sum += d * d * d;
        }
        System.out.println(sum == n ? "ARMSTRONG" : "NOT ARMSTRONG");`;
  } else if (variant.id === "palindrome-number") {
    const val = 1331;
    expectedOutput = "PALINDROME";
    mainBody = `        int n = ${val};
        int rev = 0;
        for (int x = n; x > 0; x /= 10) rev = rev * 10 + (x % 10);
        System.out.println(rev == n ? "PALINDROME" : "NOT PALINDROME");`;
  } else if (variant.id === "sum-digits") {
    const val = 987654;
    expectedOutput = "39";
    mainBody = `        int n = ${val};
        int sum = 0;
        for (int x = n; x > 0; x /= 10) sum += x % 10;
        System.out.println(sum);`;
  } else if (variant.id === "product-digits") {
    const val = 2345;
    expectedOutput = "120";
    mainBody = `        int n = ${val};
        int product = 1;
        for (int x = n; x > 0; x /= 10) product *= (x % 10);
        System.out.println(product);`;
  } else if (variant.id === "count-zeros") {
    const val = 100200300;
    expectedOutput = "6";
    mainBody = `        int n = ${val};
        int count = 0;
        if (n == 0) count = 1;
        for (int x = n; x > 0; x /= 10) if (x % 10 == 0) count++;
        System.out.println(count);`;
  } else if (variant.id === "strong-number") {
    const val = 145;
    expectedOutput = "STRONG";
    mainBody = `        int n = ${val};
        int sum = 0;
        for (int x = n; x > 0; x /= 10) {
            int d = x % 10;
            int fact = 1;
            for (int i = 2; i <= d; i++) fact *= i;
            sum += fact;
        }
        System.out.println(sum == n ? "STRONG" : "NOT STRONG");`;
  } else {
    const val = 36 + normalized;
    let count = 0;
    for (let i = 1; i <= val; i++) if (val % i === 0) count++;
    expectedOutput = String(count);
    mainBody = `        int n = ${val};
        int count = 0;
        for (int i = 1; i <= n; i++) if (n % i == 0) count++;
        System.out.println(count);`;
  }

  const code = javaSolution(
    className,
    ["java.util.*"],
    `    // Logic task solved using explicit loop operations.
`,
    mainBody
  );
  return {
    title: variant.title,
    description: `Easy logic problem: ${variant.prompt}`,
    problemStatement: statement,
    problemType: "logic",
    constraints: [
      "1 <= input values <= 10^6",
      "Use for-loop based computation.",
      "Avoid library shortcuts that hide iteration.",
    ],
    exampleInput: `indexSeed = ${normalized}`,
    exampleOutput: expectedOutput,
    explanation: "Track state variables carefully and update them inside each iteration.",
    approaches: defaultApproaches(difficulty, "O(n^2)", "O(n)", "O(1)"),
    code,
    filename: `${className}.java`,
    expectedOutput,
    dryRun: "Initialize accumulators, iterate with for loop, then print result.",
    visualization: "Counter moves across range while state variables evolve.",
    patternPreview: "",
    executionTrace: linesToTrace([
      { action: "Initialize variables", state: `variant=${variant.id}` },
      { action: "Start for loop", state: "i at first value" },
      { action: "Apply update rule", state: "accumulator changes" },
      { action: "Loop terminates", state: "i crossed bound" },
      { action: "Print answer", state: `expected=${expectedOutput.split("\n")[0]}` },
    ]),
    hints: [
      "Write sample iterations on paper first.",
      "Handle edge cases like n=0 or n=1.",
      "Use long if intermediate values can overflow int.",
    ],
    companyTags: pickCompanyTags("for-loop", difficulty, normalized + 100),
    commonMistakes: [
      "Incorrect loop bounds causing off-by-one errors.",
      "Resetting accumulator accidentally inside loop.",
      "Ignoring special edge cases.",
    ],
    interviewTips: [
      "State time and space complexity before coding.",
      "Name loop variables by role, not single letters everywhere.",
    ],
    alternativeSolutions: [
      "Use direct math formula where applicable.",
      "Use while loop equivalent and compare readability.",
    ],
    followUpQuestions: [
      "How would you optimize for very large input?",
      "Can you generalize this into a reusable method?",
    ],
    practiceVariations: [
      "Add input validation and error handling.",
      "Convert output from scalar to formatted report.",
    ],
    estimatedMinutes: estimatedMinutes(difficulty, "logic"),
  };
}

function buildOutputPredictionProblem(difficulty, index) {
  const { variant, index: normalized } = getVariant(OUTPUT_PREDICTION_VARIANTS, index);
  const className = clsName("for-loop", `${difficulty}${variant.id}${normalized}`);
  const n = 5 + (normalized % 4);
  let expectedOutput = "";
  let mainBody = "";
  let statement = `Predict the output of this loop snippet focusing on ${variant.focus}.`;

  if (variant.id === "break-loop") {
    expectedOutput = "1 2 3";
    mainBody = `        StringBuilder sb = new StringBuilder();
        for (int i = 1; i <= ${n}; i++) {
            if (i == 4) break;
            if (sb.length() > 0) sb.append(" ");
            sb.append(i);
        }
        System.out.println(sb);`;
  } else if (variant.id === "continue-loop") {
    expectedOutput = "1 3 5";
    mainBody = `        StringBuilder sb = new StringBuilder();
        for (int i = 1; i <= 6; i++) {
            if (i % 2 == 0) continue;
            if (sb.length() > 0) sb.append(" ");
            sb.append(i);
        }
        System.out.println(sb);`;
  } else if (variant.id === "nested-counter") {
    expectedOutput = "18";
    mainBody = `        int count = 0;
        for (int i = 1; i <= 3; i++) {
            for (int j = 1; j <= i + 1; j++) {
                count += i + j;
            }
        }
        System.out.println(count);`;
  } else if (variant.id === "step-loop") {
    expectedOutput = "2 5 8 11";
    mainBody = `        StringBuilder sb = new StringBuilder();
        for (int i = 2; i <= 11; i += 3) {
            if (sb.length() > 0) sb.append(" ");
            sb.append(i);
        }
        System.out.println(sb);`;
  } else if (variant.id === "post-pre") {
    expectedOutput = "7";
    mainBody = `        int x = 2;
        for (int i = 0; i < 3; i++) {
            x += i++;
        }
        System.out.println(x);`;
  } else if (variant.id === "scope-loop") {
    expectedOutput = "15";
    mainBody = `        int total = 0;
        for (int i = 1; i <= 5; i++) {
            int temp = i * 2;
            total += temp / 2;
        }
        System.out.println(total);`;
  } else if (variant.id === "char-loop") {
    expectedOutput = "A C E";
    mainBody = `        StringBuilder sb = new StringBuilder();
        for (char ch = 'A'; ch <= 'E'; ch += 2) {
            if (sb.length() > 0) sb.append(" ");
            sb.append(ch);
        }
        System.out.println(sb);`;
  } else if (variant.id === "reverse-loop") {
    expectedOutput = "5 4 3 2 1";
    mainBody = `        StringBuilder sb = new StringBuilder();
        for (int i = 5; i >= 1; i--) {
            if (sb.length() > 0) sb.append(" ");
            sb.append(i);
        }
        System.out.println(sb);`;
  } else if (variant.id === "sum-reset") {
    expectedOutput = "6";
    mainBody = `        int sum = 0;
        for (int i = 1; i <= 3; i++) {
            int local = i;
            local += i;
            sum += local;
        }
        System.out.println(sum);`;
  } else {
    expectedOutput = "A0 B2 C4";
    mainBody = `        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 3; i++) {
            if (i > 0) sb.append(" ");
            sb.append((char)('A' + i)).append(i * 2);
        }
        System.out.println(sb);`;
  }

  const code = javaSolution(className, ["java.util.*"], "", mainBody);
  return {
    title: variant.title,
    description: `Predict exact output: ${variant.focus}.`,
    problemStatement: statement,
    problemType: "output-prediction",
    constraints: [
      "Do not run mentally with assumptions; trace each iteration.",
      "Output spacing must be exact.",
      "Follow Java evaluation order.",
    ],
    exampleInput: "No runtime input.",
    exampleOutput: expectedOutput,
    explanation: "Trace loop variable and side effects line by line to determine exact print sequence.",
    approaches: defaultApproaches(difficulty, "O(n)", "O(n)", "O(1)"),
    code,
    filename: `${className}.java`,
    expectedOutput,
    dryRun: "Create a table with i, condition checks, and printed tokens per iteration.",
    visualization: "Timeline of iterations and output buffer content.",
    patternPreview: "",
    executionTrace: linesToTrace([
      { action: "Initialize loop state", state: `variant=${variant.id}` },
      { action: "Evaluate condition", state: "enter/skip body" },
      { action: "Mutate variables", state: "state changes based on body rules" },
      { action: "Append output", state: "buffer grows token by token" },
      { action: "Print final output", state: expectedOutput },
    ]),
    hints: [
      "Track each variable after every statement.",
      "Remember continue skips remaining body.",
      "Break exits only the nearest loop.",
    ],
    companyTags: pickCompanyTags("for-loop", difficulty, normalized + 200),
    commonMistakes: [
      "Ignoring increment side effects in expressions.",
      "Forgetting that StringBuilder appends spaces conditionally.",
      "Assuming loop runs one extra iteration.",
    ],
    interviewTips: [
      "Speak while tracing to demonstrate control-flow clarity.",
      "Mark state transitions explicitly in a trace table.",
    ],
    alternativeSolutions: [
      "Rewrite snippet with explicit while loop and compare behavior.",
      "Annotate each line with expected state changes.",
    ],
    followUpQuestions: [
      "How would output change if ++i replaces i++?",
      "What if break is replaced with continue?",
    ],
    practiceVariations: [
      "Add one nested loop and re-predict output.",
      "Introduce a boolean flag and trace its state.",
    ],
    estimatedMinutes: estimatedMinutes(difficulty, "output-prediction"),
  };
}

function buildDryRunProblem(difficulty, index) {
  const { variant, index: normalized } = getVariant(DRY_RUN_VARIANTS, index);
  const className = clsName("for-loop", `${difficulty}${variant.id}${normalized}`);
  const arr = numberArray(11 + normalized, 6, 2, 9);
  let expectedOutput = "";
  let mainBody = "";

  if (variant.id === "dry-sum") {
    expectedOutput = String(arr.reduce((x, y) => x + y, 0));
    mainBody = `        int[] arr = {${arr.join(", ")}};
        int sum = 0;
        for (int i = 0; i < arr.length; i++) {
            sum += arr[i];
        }
        System.out.println(sum);`;
  } else if (variant.id === "dry-factorial") {
    expectedOutput = "720";
    mainBody = `        int n = 6;
        int fact = 1;
        for (int i = 2; i <= n; i++) {
            fact *= i;
        }
        System.out.println(fact);`;
  } else if (variant.id === "dry-min") {
    expectedOutput = String(Math.min(...arr));
    mainBody = `        int[] arr = {${arr.join(", ")}};
        int min = arr[0];
        for (int i = 1; i < arr.length; i++) {
            if (arr[i] < min) min = arr[i];
        }
        System.out.println(min);`;
  } else if (variant.id === "dry-max") {
    expectedOutput = String(Math.max(...arr));
    mainBody = `        int[] arr = {${arr.join(", ")}};
        int max = arr[0];
        for (int i = 1; i < arr.length; i++) {
            if (arr[i] > max) max = arr[i];
        }
        System.out.println(max);`;
  } else if (variant.id === "dry-count-even") {
    expectedOutput = String(arr.filter((x) => x % 2 === 0).length);
    mainBody = `        int[] arr = {${arr.join(", ")}};
        int count = 0;
        for (int value : arr) {
            if (value % 2 == 0) count++;
        }
        System.out.println(count);`;
  } else if (variant.id === "dry-prefix") {
    const prefix = [];
    let run = 0;
    for (const v of arr) {
      run += v;
      prefix.push(String(run));
    }
    expectedOutput = prefix.join(" ");
    mainBody = `        int[] arr = {${arr.join(", ")}};
        int run = 0;
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < arr.length; i++) {
            run += arr[i];
            if (i > 0) sb.append(" ");
            sb.append(run);
        }
        System.out.println(sb);`;
  } else if (variant.id === "dry-nested") {
    expectedOutput = "46";
    mainBody = `        int score = 0;
        for (int i = 1; i <= 4; i++) {
            for (int j = 1; j <= i; j++) {
                score += i + j;
            }
        }
        System.out.println(score);`;
  } else if (variant.id === "dry-swap") {
    expectedOutput = "5 4 3 2 1";
    mainBody = `        int[] arr = {1, 2, 3, 4, 5};
        for (int i = 0, j = arr.length - 1; i < j; i++, j--) {
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < arr.length; i++) {
            if (i > 0) sb.append(" ");
            sb.append(arr[i]);
        }
        System.out.println(sb);`;
  } else if (variant.id === "dry-window") {
    expectedOutput = "18";
    mainBody = `        int[] arr = {3, 4, 5, 6, 7, 2};
        int k = 3;
        int window = 0;
        for (int i = 0; i < k; i++) window += arr[i];
        int best = window;
        for (int i = k; i < arr.length; i++) {
            window += arr[i] - arr[i - k];
            if (window > best) best = window;
        }
        System.out.println(best);`;
  } else {
    expectedOutput = "*\n* *\n* * *";
    mainBody = `        for (int row = 1; row <= 3; row++) {
            StringBuilder sb = new StringBuilder();
            for (int col = 1; col <= row; col++) {
                if (col > 1) sb.append(" ");
                sb.append("*");
            }
            System.out.println(sb);
        }`;
  }

  const code = javaSolution(className, ["java.util.*"], "", mainBody);
  return {
    title: variant.title,
    description: `Dry-run practice for ${variant.focus}.`,
    problemStatement: `Trace each loop iteration and report final output for ${variant.title}.`,
    problemType: "dry-run",
    constraints: [
      "Show variable updates for every iteration.",
      "Include loop index values.",
      "Explain termination condition.",
    ],
    exampleInput: "No external input; use code constants.",
    exampleOutput: expectedOutput,
    explanation: "Dry run requires step-wise state tracking and final value verification.",
    approaches: defaultApproaches(difficulty, "O(n^2)", "O(n)", "O(1)"),
    code,
    filename: `${className}.java`,
    expectedOutput,
    dryRun: "Construct trace table with columns: i, current values, decision, updated state.",
    visualization: "State table evolves row by row until loop ends.",
    patternPreview: "",
    executionTrace: linesToTrace([
      { action: "Start with initialized state", state: `variant=${variant.id}` },
      { action: "Enter loop and evaluate condition", state: "condition true for early iterations" },
      { action: "Update tracked variables", state: "state transitions captured in table" },
      { action: "Condition fails", state: "exit loop" },
      { action: "Print final result", state: expectedOutput.split("\n")[0] },
    ]),
    hints: [
      "Track all mutable variables, not only loop index.",
      "Use one row in trace table per iteration.",
      "Verify final output from traced state.",
    ],
    companyTags: pickCompanyTags("for-loop", difficulty, normalized + 300),
    commonMistakes: [
      "Skipping updates for temporary variables.",
      "Misreading nested loop entry/exit order.",
      "Forgetting initial state before first iteration.",
    ],
    interviewTips: [
      "Narrate loop invariant while dry-running.",
      "Highlight where state changes and why.",
    ],
    alternativeSolutions: [
      "Instrument code with debug prints and compare with manual trace.",
      "Use spreadsheet style trace for large loops.",
    ],
    followUpQuestions: [
      "How would complexity change with one more nested loop?",
      "What invariant proves correctness for this loop?",
    ],
    practiceVariations: [
      "Modify bound and redo dry run.",
      "Replace accumulator update formula and trace again.",
    ],
    estimatedMinutes: estimatedMinutes(difficulty, "dry-run"),
  };
}

function buildNestedPatternProblem(difficulty, index) {
  const { variant, index: normalized } = getVariant(NESTED_PATTERN_VARIANTS, index);
  const className = clsName("for-loop", `${difficulty}${variant.id}${normalized}`);
  const n = 4 + (normalized % 3);
  let expectedOutput = "";
  let mainBody = "";

  if (variant.id === "np-table-row") {
    const lines = [];
    for (let r = 1; r <= n; r++) {
      const row = [];
      for (let c = 1; c <= n; c++) row.push(String(r * c));
      lines.push(row.join(" "));
    }
    expectedOutput = lines.join("\n");
    mainBody = `        int n = ${n};
        for (int r = 1; r <= n; r++) {
            StringBuilder sb = new StringBuilder();
            for (int c = 1; c <= n; c++) {
                if (c > 1) sb.append(" ");
                sb.append(r * c);
            }
            System.out.println(sb);
        }`;
  } else if (variant.id === "np-pascal") {
    expectedOutput = buildPatternOutput("pascal-triangle", n);
    mainBody = `        int n = ${n};
        for (int r = 0; r < n; r++) {
            long value = 1;
            StringBuilder sb = new StringBuilder();
            for (int c = 0; c <= r; c++) {
                if (c > 0) sb.append(" ");
                sb.append(value);
                value = value * (r - c) / (c + 1);
            }
            System.out.println(sb);
        }`;
  } else if (variant.id === "np-spiral") {
    const size = n;
    const grid = Array.from({ length: size }, () => Array(size).fill(0));
    let top = 0;
    let bottom = size - 1;
    let left = 0;
    let right = size - 1;
    let val = 1;
    while (top <= bottom && left <= right) {
      for (let c = left; c <= right; c++) grid[top][c] = val++;
      top++;
      for (let r = top; r <= bottom; r++) grid[r][right] = val++;
      right--;
      if (top <= bottom) for (let c = right; c >= left; c--) grid[bottom][c] = val++;
      bottom--;
      if (left <= right) for (let r = bottom; r >= top; r--) grid[r][left] = val++;
      left++;
    }
    expectedOutput = format2D(grid.map((row) => row.join(" ")));
    mainBody = `        int n = ${size};
        int[][] grid = new int[n][n];
        int top = 0, bottom = n - 1, left = 0, right = n - 1, value = 1;
        while (top <= bottom && left <= right) {
            for (int c = left; c <= right; c++) grid[top][c] = value++;
            top++;
            for (int r = top; r <= bottom; r++) grid[r][right] = value++;
            right--;
            if (top <= bottom) {
                for (int c = right; c >= left; c--) grid[bottom][c] = value++;
                bottom--;
            }
            if (left <= right) {
                for (int r = bottom; r >= top; r--) grid[r][left] = value++;
                left++;
            }
        }
        for (int r = 0; r < n; r++) {
            StringBuilder sb = new StringBuilder();
            for (int c = 0; c < n; c++) {
                if (c > 0) sb.append(" ");
                sb.append(grid[r][c]);
            }
            System.out.println(sb);
        }`;
  } else if (variant.id === "np-zigzag" || variant.id === "np-snake") {
    const lines = [];
    let value = 1;
    for (let r = 0; r < n; r++) {
      const row = [];
      for (let c = 0; c < n; c++) row.push(value++);
      if (r % 2 === 1) row.reverse();
      lines.push(row.join(" "));
    }
    expectedOutput = lines.join("\n");
    mainBody = `        int n = ${n};
        int value = 1;
        for (int r = 0; r < n; r++) {
            int[] row = new int[n];
            for (int c = 0; c < n; c++) row[c] = value++;
            if (r % 2 == 1) {
                for (int l = 0, h = n - 1; l < h; l++, h--) {
                    int t = row[l];
                    row[l] = row[h];
                    row[h] = t;
                }
            }
            StringBuilder sb = new StringBuilder();
            for (int c = 0; c < n; c++) {
                if (c > 0) sb.append(" ");
                sb.append(row[c]);
            }
            System.out.println(sb);
        }`;
  } else {
    expectedOutput = buildPatternOutput("number-square", n - 1);
    mainBody = `        int n = ${n - 1};
        int size = 2 * n - 1;
        for (int r = 0; r < size; r++) {
            StringBuilder sb = new StringBuilder();
            for (int c = 0; c < size; c++) {
                int top = r, left = c, right = size - 1 - c, bottom = size - 1 - r;
                int value = n - Math.min(Math.min(top, bottom), Math.min(left, right));
                if (c > 0) sb.append(" ");
                sb.append(value);
            }
            System.out.println(sb);
        }`;
  }

  const code = javaSolution(className, ["java.util.*"], "", mainBody);
  return {
    title: variant.title,
    description: `Medium nested-loop pattern: ${variant.prompt}`,
    problemStatement: variant.prompt,
    problemType: "nested-pattern",
    constraints: [
      "1 <= n <= 8 for readable output.",
      "Use nested loops for row/column traversal.",
      "Print exact spacing per row.",
    ],
    exampleInput: `n = ${n}`,
    exampleOutput: expectedOutput,
    explanation: "Nested loops control two-dimensional output construction and ordering.",
    approaches: defaultApproaches(difficulty, "O(n^3)", "O(n^2)", "O(n^2)"),
    code,
    filename: `${className}.java`,
    expectedOutput,
    dryRun: "Trace row and column indices and watch how each cell is decided.",
    visualization: "2D matrix perspective with index boundaries.",
    patternPreview: expectedOutput.split("\n").slice(0, 3).join("\n"),
    executionTrace: linesToTrace([
      { action: "Initialize dimension and counters", state: `n=${n}` },
      { action: "Enter outer loop", state: "row selected" },
      { action: "Enter inner loop", state: "column selected" },
      { action: "Update cell or append token", state: `pattern=${variant.id}` },
      { action: "Print row and continue", state: "next row" },
    ]),
    hints: [
      "Visualize coordinates (r,c).",
      "Write conditions for edges and diagonals separately.",
      "Use StringBuilder per row to control spaces.",
    ],
    companyTags: pickCompanyTags("for-loop", difficulty, normalized + 400),
    commonMistakes: [
      "Swapping row and column bounds.",
      "Forgetting to reset row-level builder.",
      "Incorrectly handling transitions between loops.",
    ],
    interviewTips: [
      "Discuss shape symmetry before coding.",
      "State nested loop complexity clearly.",
    ],
    alternativeSolutions: [
      "Store output in matrix first then print.",
      "Split generation and rendering into two methods.",
    ],
    followUpQuestions: [
      "How can you reduce auxiliary space?",
      "Can you mirror this pattern with minimal code changes?",
    ],
    practiceVariations: [
      "Scale to rectangular matrix n x m.",
      "Print with custom symbols instead of numbers.",
    ],
    estimatedMinutes: estimatedMinutes(difficulty, "nested-pattern"),
  };
}

function buildInterviewProblem(difficulty, index) {
  const { variant, index: normalized } = getVariant(INTERVIEW_VARIANTS, index);
  const className = clsName("for-loop", `${difficulty}${variant.id}${normalized}`);
  const arr = numberArray(55 + normalized, 8, 2, 20);
  let expectedOutput = "";
  let mainBody = "";

  if (variant.id === "second-largest") {
    const sorted = [...arr].sort((x, y) => y - x);
    expectedOutput = String(sorted.find((x) => x < sorted[0]) ?? -1);
    mainBody = `        int[] arr = {${arr.join(", ")}};
        int first = Integer.MIN_VALUE;
        int second = Integer.MIN_VALUE;
        for (int v : arr) {
            if (v > first) {
                second = first;
                first = v;
            } else if (v > second && v < first) {
                second = v;
            }
        }
        System.out.println(second);`;
  } else if (variant.id === "primes-range") {
    const L = 10;
    const R = 30;
    const out = [];
    for (let x = L; x <= R; x++) {
      let p = x > 1;
      for (let d = 2; d * d <= x; d++) if (x % d === 0) p = false;
      if (p) out.push(String(x));
    }
    expectedOutput = out.join(" ");
    mainBody = `        int L = 10, R = 30;
        StringBuilder sb = new StringBuilder();
        for (int x = L; x <= R; x++) {
            boolean prime = x > 1;
            for (int d = 2; d * d <= x; d++) {
                if (x % d == 0) {
                    prime = false;
                    break;
                }
            }
            if (prime) {
                if (sb.length() > 0) sb.append(" ");
                sb.append(x);
            }
        }
        System.out.println(sb);`;
  } else if (variant.id === "armstrong-range") {
    expectedOutput = "153 370 371 407";
    mainBody = `        StringBuilder sb = new StringBuilder();
        for (int x = 100; x <= 500; x++) {
            int sum = 0;
            for (int t = x; t > 0; t /= 10) {
                int d = t % 10;
                sum += d * d * d;
            }
            if (sum == x) {
                if (sb.length() > 0) sb.append(" ");
                sb.append(x);
            }
        }
        System.out.println(sb);`;
  } else {
    const best = Math.max(...arr);
    expectedOutput = String(best);
    mainBody = `        int[] arr = {${arr.join(", ")}};
        int answer = arr[0];
        for (int i = 1; i < arr.length; i++) {
            if (arr[i] > answer) answer = arr[i];
        }
        System.out.println(answer);`;
  }

  const code = javaSolution(className, ["java.util.*"], "", mainBody);
  return {
    title: variant.title,
    description: `Interview-oriented loop problem: ${variant.prompt}`,
    problemStatement: variant.prompt,
    problemType: "interview",
    constraints: [
      "Input size up to 10^5 for array-based variants.",
      "Prefer O(n) or O(n log n) when possible.",
      "Use clear variable naming for interview communication.",
    ],
    exampleInput: `seedIndex = ${normalized}`,
    exampleOutput: expectedOutput,
    explanation: "Use loop invariants to maintain best candidate values while scanning input.",
    approaches: defaultApproaches(difficulty, "O(n^2)", "O(n)", "O(1)"),
    code,
    filename: `${className}.java`,
    expectedOutput,
    dryRun: "Trace candidate updates each iteration and verify final answer.",
    visualization: "Array scan timeline with running best values.",
    patternPreview: "",
    executionTrace: linesToTrace([
      { action: "Initialize candidate variables", state: `variant=${variant.id}` },
      { action: "Iterate through input elements", state: "compare and update candidates" },
      { action: "Handle special condition", state: "e.g., prime/duplicate checks" },
      { action: "Finalize result", state: "candidate stable" },
      { action: "Print final output", state: expectedOutput.split("\n")[0] },
    ]),
    hints: [
      "State the invariant before coding.",
      "Handle duplicates and boundaries explicitly.",
      "Confirm complexity target early.",
    ],
    companyTags: pickCompanyTags("for-loop", difficulty, normalized + 500),
    commonMistakes: [
      "Missing edge cases with repeated values.",
      "Using nested loops when linear scan is enough.",
      "Failing to initialize sentinel values properly.",
    ],
    interviewTips: [
      "Explain trade-offs between readability and optimality.",
      "Verify with one normal and one edge test.",
    ],
    alternativeSolutions: [
      "Sort then derive answer if constraints allow.",
      "Use hash map for counting based variants.",
    ],
    followUpQuestions: [
      "How does solution change for streaming data?",
      "Can this be parallelized safely?",
    ],
    practiceVariations: [
      "Return indices instead of values.",
      "Extend logic to handle negative numbers robustly.",
    ],
    estimatedMinutes: estimatedMinutes(difficulty, "interview"),
  };
}

function buildHardMathSeries(index) {
  const n = 8 + (index % 5);
  let sum = 0;
  for (let i = 1; i <= n; i++) sum += i * i + 3 * i + 2;
  return { n, sum };
}

function buildHackerrankProblem(difficulty, index) {
  const { variant, index: normalized } = getVariant(HACKERRANK_VARIANTS, index);
  const className = clsName("for-loop", `${difficulty}${variant.id}${normalized}`);
  const { n, sum } = buildHardMathSeries(normalized);
  let expectedOutput = "";
  let mainBody = "";

  if (variant.id === "hr-series-sum") {
    expectedOutput = String(sum);
    mainBody = `        int n = ${n};
        long total = 0;
        for (int i = 1; i <= n; i++) {
            total += (long) i * i + 3L * i + 2;
        }
        System.out.println(total);`;
  } else if (variant.id === "hr-ap-term") {
    const a = 4;
    const d = 7;
    const term = a + (n - 1) * d;
    const s = (n * (2 * a + (n - 1) * d)) / 2;
    expectedOutput = `${term}\n${s}`;
    mainBody = `        int a = ${a}, d = ${d}, n = ${n};
        int term = 0;
        int sum = 0;
        for (int i = 1; i <= n; i++) {
            term = a + (i - 1) * d;
            sum += term;
        }
        System.out.println(term);
        System.out.println(sum);`;
  } else if (variant.id === "hr-gp-term") {
    const a = 3;
    const r = 2;
    let term = a;
    let s = 0;
    for (let i = 1; i <= 6; i++) {
      if (i === 1) term = a;
      else term *= r;
      s += term;
    }
    expectedOutput = `${term}\n${s}`;
    mainBody = `        int a = 3, r = 2, n = 6;
        long term = a;
        long sum = 0;
        for (int i = 1; i <= n; i++) {
            if (i == 1) term = a;
            else term *= r;
            sum += term;
        }
        System.out.println(term);
        System.out.println(sum);`;
  } else {
    expectedOutput = String(sum + normalized);
    mainBody = `        int n = ${n};
        long score = ${normalized};
        for (int i = 1; i <= n; i++) {
            score += (long) i * i + i;
        }
        System.out.println(score);`;
  }

  const code = javaSolution(className, ["java.util.*"], "", mainBody);
  return {
    title: variant.title,
    description: `HackerRank style hard loop challenge: ${variant.prompt}`,
    problemStatement: variant.prompt,
    problemType: "hackerrank",
    constraints: [
      "n can be up to 10^5; use efficient iteration.",
      "Use long for large cumulative sums.",
      "Avoid floating-point when integer math is enough.",
    ],
    exampleInput: `seedIndex = ${normalized}`,
    exampleOutput: expectedOutput,
    explanation: "Translate formula into iterative accumulation with overflow-safe types.",
    approaches: defaultApproaches(difficulty, "O(n^2)", "O(n)", "O(1)"),
    code,
    filename: `${className}.java`,
    expectedOutput,
    dryRun: "Track current term and running total over each loop iteration.",
    visualization: "Series timeline with term(i) and cumulative sum(i).",
    patternPreview: "",
    executionTrace: linesToTrace([
      { action: "Initialize constants and accumulators", state: `variant=${variant.id}` },
      { action: "Loop through term indices", state: "compute term each iteration" },
      { action: "Accumulate into total", state: "running sum updates" },
      { action: "Loop exits at n", state: "final sum ready" },
      { action: "Print answer", state: expectedOutput.split("\n")[0] },
    ]),
    hints: [
      "Choose long for sums and products.",
      "Write recurrence relation before code.",
      "Verify first 3 terms manually.",
    ],
    companyTags: pickCompanyTags("for-loop", difficulty, normalized + 600),
    commonMistakes: [
      "Integer overflow from int multiplication.",
      "Wrong recurrence update order.",
      "Misreading inclusive upper bounds.",
    ],
    interviewTips: [
      "Discuss numeric limits and type choice.",
      "Mention formula shortcut when relevant.",
    ],
    alternativeSolutions: [
      "Use closed-form equations where derivable.",
      "Use modular arithmetic for very large constraints.",
    ],
    followUpQuestions: [
      "How do you handle modulo 1e9+7 variants?",
      "Can you derive closed form for this series?",
    ],
    practiceVariations: [
      "Swap AP with GP and recompute.",
      "Add alternating signs to the series.",
    ],
    estimatedMinutes: estimatedMinutes(difficulty, "hackerrank"),
  };
}

function buildLeetcodeProblem(difficulty, index) {
  const { variant, index: normalized } = getVariant(LEETCODE_VARIANTS, index);
  const className = clsName("for-loop", `${difficulty}${variant.id}${normalized}`);
  const arr = [1, 8, 6, 2, 5, 4, 8, 3, 7];
  let expectedOutput = "";
  let bodyPrefix = "";
  let mainBody = "";

  if (variant.id === "lc-container-lite") {
    let l = 0;
    let r = arr.length - 1;
    let best = 0;
    while (l < r) {
      best = Math.max(best, Math.min(arr[l], arr[r]) * (r - l));
      if (arr[l] < arr[r]) l++;
      else r--;
    }
    expectedOutput = String(best);
    bodyPrefix = `    static int solve(int[] h) {
        int l = 0, r = h.length - 1, best = 0;
        while (l < r) {
            int area = Math.min(h[l], h[r]) * (r - l);
            if (area > best) best = area;
            if (h[l] < h[r]) l++;
            else r--;
        }
        return best;
    }
`;
    mainBody = `        int[] h = {${arr.join(", ")}};
        System.out.println(solve(h));`;
  } else if (variant.id === "lc-product-except-self") {
    const nums = [1, 2, 3, 4];
    const out = [24, 12, 8, 6];
    expectedOutput = out.join(" ");
    bodyPrefix = `    static int[] solve(int[] nums) {
        int n = nums.length;
        int[] ans = new int[n];
        int prefix = 1;
        for (int i = 0; i < n; i++) {
            ans[i] = prefix;
            prefix *= nums[i];
        }
        int suffix = 1;
        for (int i = n - 1; i >= 0; i--) {
            ans[i] *= suffix;
            suffix *= nums[i];
        }
        return ans;
    }
`;
    mainBody = `        int[] nums = {${nums.join(", ")}};
        int[] ans = solve(nums);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < ans.length; i++) {
            if (i > 0) sb.append(" ");
            sb.append(ans[i]);
        }
        System.out.println(sb);`;
  } else {
    const nums = numberArray(71 + normalized, 8, 1, 9);
    const max = Math.max(...nums);
    expectedOutput = String(max);
    bodyPrefix = `    static int solve(int[] nums) {
        int best = nums[0];
        for (int i = 1; i < nums.length; i++) {
            if (nums[i] > best) best = nums[i];
        }
        return best;
    }
`;
    mainBody = `        int[] nums = {${nums.join(", ")}};
        System.out.println(solve(nums));`;
  }

  const code = javaSolution(className, ["java.util.*"], bodyPrefix, mainBody);
  return {
    title: variant.title,
    description: `LeetCode hard-style loop problem: ${variant.prompt}`,
    problemStatement: variant.prompt,
    problemType: "leetcode",
    constraints: [
      "n can be up to 2 * 10^5",
      "Target linear or near-linear solutions.",
      "Avoid unnecessary nested loops for large constraints.",
    ],
    exampleInput: `seedIndex = ${normalized}`,
    exampleOutput: expectedOutput,
    explanation: "Use loop invariants and auxiliary arrays/pointers for optimal complexity.",
    approaches: defaultApproaches(difficulty, "O(n^2)", "O(n)", "O(n)"),
    code,
    filename: `${className}.java`,
    expectedOutput,
    dryRun: "Step through pointers or running arrays and monitor invariant maintenance.",
    visualization: "Pointer movement or prefix/suffix accumulation chart.",
    patternPreview: "",
    executionTrace: linesToTrace([
      { action: "Initialize data structures", state: `variant=${variant.id}` },
      { action: "Iterate input once or twice", state: "maintain invariant" },
      { action: "Update best/answer state", state: "candidate optimized" },
      { action: "Complete traversal", state: "answer finalized" },
      { action: "Print result", state: expectedOutput.split("\n")[0] },
    ]),
    hints: [
      "Identify invariant before coding.",
      "Prefer one pass if possible.",
      "Use helper arrays only when needed.",
    ],
    companyTags: pickCompanyTags("for-loop", difficulty, normalized + 700),
    commonMistakes: [
      "Using brute-force nested loops on large input.",
      "Incorrect pointer move decisions.",
      "Ignoring overflow in intermediate products.",
    ],
    interviewTips: [
      "Explain why optimal approach is correct.",
      "Mention trade-offs between space and simplicity.",
    ],
    alternativeSolutions: [
      "Start from brute force then optimize.",
      "Use prefix/suffix or monotonic structures where relevant.",
    ],
    followUpQuestions: [
      "Can you reduce extra space to O(1)?",
      "How would solution adapt to streaming input?",
    ],
    practiceVariations: [
      "Return indices instead of value.",
      "Add negative and zero-heavy test cases.",
    ],
    estimatedMinutes: estimatedMinutes(difficulty, "leetcode"),
  };
}

function buildCompanyProblem(difficulty, index) {
  const { variant, index: normalized } = getVariant(COMPANY_VARIANTS, index);
  const className = clsName("for-loop", `${difficulty}${variant.id}${normalized}`);
  const arr = numberArray(101 + normalized, 10, 1, 15);
  const window = 3 + (normalized % 3);
  let best = 0;
  for (let i = 0; i + window <= arr.length; i++) {
    let sum = 0;
    for (let j = i; j < i + window; j++) sum += arr[j];
    if (sum > best) best = sum;
  }
  const expectedOutput = String(best);
  const code = javaSolution(
    className,
    ["java.util.*"],
    `    static int maxWindow(int[] arr, int k) {
        int window = 0;
        for (int i = 0; i < k; i++) window += arr[i];
        int best = window;
        for (int i = k; i < arr.length; i++) {
            window += arr[i] - arr[i - k];
            if (window > best) best = window;
        }
        return best;
    }
`,
    `        int[] arr = {${arr.join(", ")}};
        int k = ${window};
        System.out.println(maxWindow(arr, k));`
  );
  return {
    title: variant.title,
    description: `Company-tagged hard loop challenge from ${variant.company}.`,
    problemStatement: `${variant.prompt} Given array values, print best window score.`,
    problemType: "company",
    constraints: [
      "1 <= arr.length <= 2 * 10^5",
      "Use O(n) sliding-window whenever applicable.",
      "Document assumptions before implementation.",
    ],
    exampleInput: `arr=${arr.join(",")}, k=${window}`,
    exampleOutput: expectedOutput,
    explanation: "Convert brute-force window summation into rolling update for O(n).",
    approaches: defaultApproaches(difficulty, "O(n*k)", "O(n)", "O(1)"),
    code,
    filename: `${className}.java`,
    expectedOutput,
    dryRun: `Compute first window sum, then slide one index at a time and update best.`,
    visualization: "Sliding window chart over index axis with running sum values.",
    patternPreview: "",
    executionTrace: linesToTrace([
      { action: "Initialize first window", state: `k=${window}` },
      { action: "Set initial best", state: "best=windowSum" },
      { action: "Slide window right", state: "add incoming, remove outgoing" },
      { action: "Update best if needed", state: "best stores max window sum" },
      { action: "Print best", state: expectedOutput },
    ]),
    hints: [
      "Compute first window separately.",
      "At each step update by delta, not full recomputation.",
      "Track best after every slide.",
    ],
    companyTags: [variant.company, ...pickCompanyTags("for-loop", difficulty, normalized + 800)].slice(0, 4),
    commonMistakes: [
      "Using nested loops despite sliding-window applicability.",
      "Not handling k equal to array length.",
      "Off-by-one errors in window boundaries.",
    ],
    interviewTips: [
      "Explain how rolling sum avoids recomputation.",
      "State complexity improvement from O(nk) to O(n).",
    ],
    alternativeSolutions: [
      "Prefix sums for static range queries.",
      "Deque based solution for max-in-window variants.",
    ],
    followUpQuestions: [
      "How do you handle dynamic updates to array values?",
      "Can this be extended to 2D windows?",
    ],
    practiceVariations: [
      "Find minimum window sum instead of maximum.",
      "Track top-2 window sums with indices.",
    ],
    estimatedMinutes: estimatedMinutes(difficulty, "company"),
  };
}

function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x;
}

function generateByType(difficulty, problemType, index) {
  if (problemType === "pattern") return buildPatternProblem(difficulty, index);
  if (problemType === "logic") return buildLogicProblem(difficulty, index);
  if (problemType === "output-prediction") return buildOutputPredictionProblem(difficulty, index);
  if (problemType === "dry-run") return buildDryRunProblem(difficulty, index);
  if (problemType === "nested-pattern") return buildNestedPatternProblem(difficulty, index);
  if (problemType === "interview") return buildInterviewProblem(difficulty, index);
  if (problemType === "hackerrank") return buildHackerrankProblem(difficulty, index);
  if (problemType === "leetcode") return buildLeetcodeProblem(difficulty, index);
  if (problemType === "company") return buildCompanyProblem(difficulty, index);
  return buildLogicProblem(difficulty, index);
}

export function generateForLoopProblem(difficulty, problemType, index) {
  const generated = generateByType(difficulty, problemType, index);
  const enriched = enrichProblem(generated, {
    slug: "for-loop",
    difficulty,
    index: Number(index) || 0,
    category: "java",
  });
  return {
    ...generated,
    ...enriched,
    problemType: generated.problemType,
    patternPreview: generated.patternPreview ?? "",
    executionTrace: generated.executionTrace ?? [],
    hints: generated.hints ?? [],
    companyTags: generated.companyTags ?? pickCompanyTags("for-loop", difficulty, Number(index) || 0),
    commonMistakes: generated.commonMistakes ?? [],
    interviewTips: generated.interviewTips ?? [],
    alternativeSolutions: generated.alternativeSolutions ?? [],
    followUpQuestions: generated.followUpQuestions ?? [],
    practiceVariations: generated.practiceVariations ?? [],
    estimatedMinutes: generated.estimatedMinutes ?? estimatedMinutes(difficulty, problemType),
  };
}
