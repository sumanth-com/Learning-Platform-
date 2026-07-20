/**
 * Distinct interview-style problems — each index maps to a different question,
 * not the same template with different numbers.
 */
import { defaultApproaches, pickCompanyTags, javaSolution } from "./rich-fields.mjs";
import { estimatedMinutes as estMinutes } from "./problem-type-spec.mjs";

function pick(list, index) {
  const i = ((Number(index) || 0) % list.length + list.length) % list.length;
  return { item: list[i], slot: i };
}

function trace(steps) {
  return steps.map((s, i) => ({ line: i + 1, action: s.action, state: s.state }));
}

const LEETCODE_BUILDERS = [
  {
    id: "two-sum",
    title: "Two Sum",
    statement: (nums, target, ans) =>
      `Given an integer array nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume exactly one solution exists.\n\nnums = [${nums.join(", ")}], target = ${target}`,
    build(className, index) {
      const nums = [2, 7, 11, 15];
      const target = 9;
      const code = javaSolution(
        className,
        ["java.util.*"],
        `    static int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int need = target - nums[i];
            if (map.containsKey(need)) return new int[] { map.get(need), i };
            map.put(nums[i], i);
        }
        return new int[] { -1, -1 };
    }`,
        `        int[] nums = {${nums.join(", ")}};
        int target = ${target};
        int[] ans = twoSum(nums, target);
        System.out.println(ans[0] + "," + ans[1]);`
      );
      return {
        title: "Two Sum",
        problemStatement: this.statement(nums, target, [0, 1]),
        code,
        expectedOutput: "0,1",
        exampleInput: `nums=[${nums.join(",")}], target=${target}`,
        exampleOutput: "0,1",
        explanation: "Store value→index in HashMap; for each element check if complement exists in O(1).",
        hints: ["Use HashMap for O(n) time.", "Return indices, not values."],
      };
    },
  },
  {
    id: "best-time-stock",
    title: "Best Time to Buy and Sell Stock",
    build(className) {
      const prices = [7, 1, 5, 3, 6, 4];
      const code = javaSolution(
        className,
        [],
        `    static int maxProfit(int[] prices) {
        int min = prices[0], best = 0;
        for (int i = 1; i < prices.length; i++) {
            min = Math.min(min, prices[i]);
            best = Math.max(best, prices[i] - min);
        }
        return best;
    }`,
        `        int[] prices = {${prices.join(", ")}};
        System.out.println(maxProfit(prices));`
      );
      return {
        title: "Best Time to Buy and Sell Stock",
        problemStatement:
          `You are given an array prices where prices[i] is the price of a stock on day i.\n\nReturn the maximum profit from one buy and one sell. You must buy before you sell.\n\nprices = [${prices.join(", ")}]`,
        code,
        expectedOutput: "5",
        exampleInput: `prices=[${prices.join(",")}]`,
        exampleOutput: "5",
        explanation: "Track minimum price seen so far and best profit = price - min.",
        hints: ["One pass is enough.", "Track min price and max profit separately."],
      };
    },
  },
  {
    id: "max-subarray",
    title: "Maximum Subarray",
    build(className) {
      const nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4];
      const code = javaSolution(
        className,
        [],
        `    static int maxSubArray(int[] nums) {
        int best = nums[0], cur = nums[0];
        for (int i = 1; i < nums.length; i++) {
            cur = Math.max(nums[i], cur + nums[i]);
            best = Math.max(best, cur);
        }
        return best;
    }`,
        `        int[] nums = {${nums.join(", ")}};
        System.out.println(maxSubArray(nums));`
      );
      return {
        title: "Maximum Subarray (Kadane's Algorithm)",
        problemStatement:
          `Find the contiguous subarray with the largest sum and return that sum.\n\nnums = [${nums.join(", ")}]`,
        code,
        expectedOutput: "6",
        exampleInput: `nums=[${nums.join(",")}]`,
        exampleOutput: "6",
        explanation: "Kadane: extend current subarray or start fresh at nums[i].",
        hints: ["Current sum can reset when negative contribution hurts.", "Subarray [4,-1,2,1] sums to 6."],
      };
    },
  },
  {
    id: "move-zeroes",
    title: "Move Zeroes",
    build(className) {
      const nums = [0, 1, 0, 3, 12];
      const code = javaSolution(
        className,
        [],
        `    static void moveZeroes(int[] nums) {
        int w = 0;
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] != 0) nums[w++] = nums[i];
        }
        while (w < nums.length) nums[w++] = 0;
    }`,
        `        int[] nums = {${nums.join(", ")}};
        moveZeroes(nums);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < nums.length; i++) {
            if (i > 0) sb.append(",");
            sb.append(nums[i]);
        }
        System.out.println(sb);`
      );
      return {
        title: "Move Zeroes",
        problemStatement:
          `Move all zeros to the end while maintaining relative order of non-zero elements.\n\nInput: [${nums.join(", ")}]`,
        code,
        expectedOutput: "1,3,12,0,0",
        exampleInput: `nums=[${nums.join(",")}]`,
        exampleOutput: "1,3,12,0,0",
        explanation: "Two-pointer write index places non-zeros first, then fill zeros.",
        hints: ["In-place with write pointer.", "Fill remainder with zeros."],
      };
    },
  },
  {
    id: "climbing-stairs",
    title: "Climbing Stairs",
    build(className) {
      const n = 5;
      const code = javaSolution(
        className,
        [],
        `    static int climbStairs(int n) {
        if (n <= 2) return n;
        int a = 1, b = 2;
        for (int i = 3; i <= n; i++) {
            int c = a + b;
            a = b;
            b = c;
        }
        return b;
    }`,
        `        System.out.println(climbStairs(${n}));`
      );
      return {
        title: "Climbing Stairs",
        problemStatement:
          `You can climb 1 or 2 steps at a time. How many distinct ways to reach step n?\n\nn = ${n}`,
        code,
        expectedOutput: "8",
        exampleInput: `n=${n}`,
        exampleOutput: "8",
        explanation: "Fibonacci recurrence: ways(n) = ways(n-1) + ways(n-2).",
        hints: ["This is Fibonacci.", "Use O(1) space with two variables."],
      };
    },
  },
  {
    id: "missing-number",
    title: "Missing Number",
    build(className) {
      const nums = [3, 0, 1];
      const code = javaSolution(
        className,
        [],
        `    static int missingNumber(int[] nums) {
        int n = nums.length;
        int expected = n * (n + 1) / 2;
        int actual = 0;
        for (int x : nums) actual += x;
        return expected - actual;
    }`,
        `        int[] nums = {${nums.join(", ")}};
        System.out.println(missingNumber(nums));`
      );
      return {
        title: "Missing Number",
        problemStatement:
          `Array contains n distinct numbers in range [0, n]. Find the missing number.\n\nnums = [${nums.join(", ")}]`,
        code,
        expectedOutput: "2",
        exampleInput: `nums=[${nums.join(",")}]`,
        exampleOutput: "2",
        explanation: "Sum 0..n minus array sum equals missing value.",
        hints: ["Gauss sum formula.", "XOR approach also works."],
      };
    },
  },
  {
    id: "single-number",
    title: "Single Number",
    build(className) {
      const nums = [4, 1, 2, 1, 2];
      const code = javaSolution(
        className,
        [],
        `    static int singleNumber(int[] nums) {
        int x = 0;
        for (int v : nums) x ^= v;
        return x;
    }`,
        `        int[] nums = {${nums.join(", ")}};
        System.out.println(singleNumber(nums));`
      );
      return {
        title: "Single Number",
        problemStatement:
          `Every element appears twice except one. Find that single element.\n\nnums = [${nums.join(", ")}]`,
        code,
        expectedOutput: "4",
        exampleInput: `nums=[${nums.join(",")}]`,
        exampleOutput: "4",
        explanation: "XOR pairs cancel; remaining value is the answer.",
        hints: ["a ^ a = 0.", "XOR is commutative."],
      };
    },
  },
  {
    id: "contains-duplicate",
    title: "Contains Duplicate",
    build(className) {
      const nums = [1, 2, 3, 1];
      const code = javaSolution(
        className,
        ["java.util.*"],
        `    static boolean containsDuplicate(int[] nums) {
        Set<Integer> seen = new HashSet<>();
        for (int x : nums) {
            if (seen.contains(x)) return true;
            seen.add(x);
        }
        return false;
    }`,
        `        int[] nums = {${nums.join(", ")}};
        System.out.println(containsDuplicate(nums));`
      );
      return {
        title: "Contains Duplicate",
        problemStatement:
          `Return true if any value appears at least twice in the array.\n\nnums = [${nums.join(", ")}]`,
        code,
        expectedOutput: "true",
        exampleInput: `nums=[${nums.join(",")}]`,
        exampleOutput: "true",
        explanation: "HashSet detects first repeated value in one pass.",
        hints: ["Set insertion fails on duplicate.", "Sorting also works O(n log n)."],
      };
    },
  },
  {
    id: "majority-element",
    title: "Majority Element",
    build(className) {
      const nums = [2, 2, 1, 1, 1, 2, 2];
      const code = javaSolution(
        className,
        [],
        `    static int majorityElement(int[] nums) {
        int cand = nums[0], count = 1;
        for (int i = 1; i < nums.length; i++) {
            if (count == 0) { cand = nums[i]; count = 1; }
            else if (nums[i] == cand) count++;
            else count--;
        }
        return cand;
    }`,
        `        int[] nums = {${nums.join(", ")}};
        System.out.println(majorityElement(nums));`
      );
      return {
        title: "Majority Element",
        problemStatement:
          `Find the element that appears more than n/2 times (guaranteed to exist).\n\nnums = [${nums.join(", ")}]`,
        code,
        expectedOutput: "2",
        exampleInput: `nums=[${nums.join(",")}]`,
        exampleOutput: "2",
        explanation: "Boyer-Moore voting cancels non-majority pairs.",
        hints: ["Cancel different pairs.", "Survivor is majority."],
      };
    },
  },
  {
    id: "product-except-self",
    title: "Product of Array Except Self",
    build(className) {
      const nums = [1, 2, 3, 4];
      const code = javaSolution(
        className,
        [],
        `    static int[] productExceptSelf(int[] nums) {
        int n = nums.length;
        int[] ans = new int[n];
        int prefix = 1;
        for (int i = 0; i < n; i++) { ans[i] = prefix; prefix *= nums[i]; }
        int suffix = 1;
        for (int i = n - 1; i >= 0; i--) { ans[i] *= suffix; suffix *= nums[i]; }
        return ans;
    }`,
        `        int[] nums = {${nums.join(", ")}};
        int[] ans = productExceptSelf(nums);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < ans.length; i++) {
            if (i > 0) sb.append(" ");
            sb.append(ans[i]);
        }
        System.out.println(sb);`
      );
      return {
        title: "Product of Array Except Self",
        problemStatement:
          `Return an array where ans[i] is product of all elements except nums[i]. Do not use division.\n\nnums = [${nums.join(", ")}]`,
        code,
        expectedOutput: "24 12 8 6",
        exampleInput: `nums=[${nums.join(",")}]`,
        exampleOutput: "24 12 8 6",
        explanation: "Prefix products left-to-right, multiply suffix right-to-left.",
        hints: ["Two passes.", "No division needed."],
      };
    },
  },
  {
    id: "max-consecutive-ones",
    title: "Max Consecutive Ones",
    build(className) {
      const nums = [1, 1, 0, 1, 1, 1];
      const code = javaSolution(
        className,
        [],
        `    static int findMaxConsecutiveOnes(int[] nums) {
        int best = 0, cur = 0;
        for (int x : nums) {
            if (x == 1) { cur++; best = Math.max(best, cur); }
            else cur = 0;
        }
        return best;
    }`,
        `        int[] nums = {${nums.join(", ")}};
        System.out.println(findMaxConsecutiveOnes(nums));`
      );
      return {
        title: "Max Consecutive Ones",
        problemStatement:
          `Given a binary array, find the maximum number of consecutive 1s.\n\nnums = [${nums.join(", ")}]`,
        code,
        expectedOutput: "3",
        exampleInput: `nums=[${nums.join(",")}]`,
        exampleOutput: "3",
        explanation: "Reset streak on zero, track maximum streak.",
        hints: ["Simple running count.", "Reset cur when you see 0."],
      };
    },
  },
  {
    id: "binary-search",
    title: "Binary Search",
    build(className) {
      const nums = [-1, 0, 3, 5, 9, 12];
      const target = 9;
      const code = javaSolution(
        className,
        [],
        `    static int search(int[] nums, int target) {
        int lo = 0, hi = nums.length - 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] == target) return mid;
            if (nums[mid] < target) lo = mid + 1;
            else hi = mid - 1;
        }
        return -1;
    }`,
        `        int[] nums = {${nums.join(", ")}};
        System.out.println(search(nums, ${target}));`
      );
      return {
        title: "Binary Search",
        problemStatement:
          `Search target in sorted array. Return index or -1.\n\nnums = [${nums.join(", ")}], target = ${target}`,
        code,
        expectedOutput: "4",
        exampleInput: `nums=[${nums.join(",")}], target=${target}`,
        exampleOutput: "4",
        explanation: "Halve search space each step comparing middle element.",
        hints: ["lo/hi inclusive bounds.", "Avoid overflow: mid = lo + (hi-lo)/2."],
      };
    },
  },
  {
    id: "valid-palindrome",
    title: "Valid Palindrome",
    build(className) {
      const s = "A man a plan a canal Panama";
      const code = javaSolution(
        className,
        [],
        `    static boolean isPalindrome(String s) {
        int l = 0, r = s.length() - 1;
        while (l < r) {
            while (l < r && !Character.isLetterOrDigit(s.charAt(l))) l++;
            while (l < r && !Character.isLetterOrDigit(s.charAt(r))) r--;
            if (Character.toLowerCase(s.charAt(l)) != Character.toLowerCase(s.charAt(r))) return false;
            l++; r--;
        }
        return true;
    }`,
        `        System.out.println(isPalindrome("${s}"));`
      );
      return {
        title: "Valid Palindrome",
        problemStatement:
          `Determine if a phrase is a palindrome after removing non-alphanumeric characters and ignoring case.\n\ns = "${s}"`,
        code,
        expectedOutput: "true",
        exampleInput: `s="${s}"`,
        exampleOutput: "true",
        explanation: "Two pointers skip junk chars and compare lowercase letters.",
        hints: ["Skip non-alphanumeric.", "Compare toLowerCase chars."],
      };
    },
  },
  {
    id: "reverse-string",
    title: "Reverse String",
    build(className) {
      const chars = ["h", "e", "l", "l", "o"];
      const code = javaSolution(
        className,
        [],
        `    static void reverse(char[] s) {
        int l = 0, r = s.length - 1;
        while (l < r) {
            char t = s[l]; s[l] = s[r]; s[r] = t;
            l++; r--;
        }
    }`,
        `        char[] s = {${chars.map((c) => `'${c}'`).join(", ")}};
        reverse(s);
        System.out.println(new String(s));`
      );
      return {
        title: "Reverse String",
        problemStatement:
          `Reverse a character array in-place using O(1) extra space.\n\nInput: hello`,
        code,
        expectedOutput: "olleh",
        exampleInput: "s=hello",
        exampleOutput: "olleh",
        explanation: "Swap symmetric pairs from both ends inward.",
        hints: ["Two pointers l and r.", "Swap and move inward."],
      };
    },
  },
  {
    id: "fizzbuzz",
    title: "FizzBuzz",
    build(className) {
      const n = 15;
      const code = javaSolution(
        className,
        [],
        "",
        `        for (int i = 1; i <= ${n}; i++) {
            if (i % 15 == 0) System.out.println("FizzBuzz");
            else if (i % 3 == 0) System.out.println("Fizz");
            else if (i % 5 == 0) System.out.println("Buzz");
            else System.out.println(i);
        }`
      );
      const lines = [];
      for (let i = 1; i <= n; i++) {
        if (i % 15 === 0) lines.push("FizzBuzz");
        else if (i % 3 === 0) lines.push("Fizz");
        else if (i % 5 === 0) lines.push("Buzz");
        else lines.push(String(i));
      }
      return {
        title: "FizzBuzz",
        problemStatement:
          `Print numbers 1 to n. Multiples of 3 → Fizz, 5 → Buzz, both → FizzBuzz.\n\nn = ${n}`,
        code,
        expectedOutput: lines.join("\n"),
        exampleInput: `n=${n}`,
        exampleOutput: lines.slice(0, 5).join("\n") + "\n...",
        explanation: "Check divisibility by 15 first, then 3, then 5.",
        hints: ["Order matters: 15 before 3 and 5.", "Use else-if chain."],
      };
    },
  },
];

const HACKERRANK_BUILDERS = [
  {
    title: "Sum of Squares 1 to N",
    build(className, index) {
      const n = 5 + (index % 4);
      const sum = (n * (n + 1) * (2 * n + 1)) / 6;
      const code = javaSolution(className, [], "", `        int n = ${n}, sum = 0;
        for (int i = 1; i <= n; i++) sum += i * i;
        System.out.println(sum);`);
      return {
        title: "Sum of Squares 1 to N",
        problemStatement: `Compute 1² + 2² + ... + n² for n = ${n}.`,
        code,
        expectedOutput: String(sum),
        exampleInput: `n=${n}`,
        exampleOutput: String(sum),
        explanation: "Loop accumulation or formula n(n+1)(2n+1)/6.",
      };
    },
  },
  {
    title: "Arithmetic Progression Sum",
    build(className, index) {
      const a = 3, d = 4, n = 6 + (index % 3);
      const sum = (n * (2 * a + (n - 1) * d)) / 2;
      const code = javaSolution(className, [], "", `        int a = ${a}, d = ${d}, n = ${n}, sum = 0;
        for (int i = 0; i < n; i++) sum += a + i * d;
        System.out.println(sum);`);
      return {
        title: "Arithmetic Progression Sum",
        problemStatement: `Sum of AP: first term a=${a}, common difference d=${d}, n=${n} terms.`,
        code,
        expectedOutput: String(sum),
        exampleInput: `a=${a}, d=${d}, n=${n}`,
        exampleOutput: String(sum),
        explanation: "Each term a + i*d summed in a loop.",
      };
    },
  },
  {
    title: "Factorial of N",
    build(className, index) {
      const n = 6 + (index % 3);
      let fact = 1;
      for (let i = 2; i <= n; i++) fact *= i;
      const code = javaSolution(className, [], "", `        int n = ${n}, fact = 1;
        for (int i = 2; i <= n; i++) fact *= i;
        System.out.println(fact);`);
      return {
        title: "Factorial of N",
        problemStatement: `Compute n! for n = ${n}.`,
        code,
        expectedOutput: String(fact),
        exampleInput: `n=${n}`,
        exampleOutput: String(fact),
        explanation: "Multiply integers 2 through n.",
      };
    },
  },
  {
    title: "Count Digits in Number",
    build(className) {
      const num = 987654;
      const code = javaSolution(className, [], "", `        int n = ${num}, count = 0;
        if (n == 0) count = 1;
        while (n != 0) { count++; n /= 10; }
        System.out.println(count);`);
      return {
        title: "Count Digits in Number",
        problemStatement: `Count how many digits are in the number ${num}.`,
        code,
        expectedOutput: "6",
        exampleInput: `n=${num}`,
        exampleOutput: "6",
        explanation: "Repeatedly divide by 10 until zero.",
      };
    },
  },
  {
    title: "Reverse a Number",
    build(className) {
      const num = 12345;
      const code = javaSolution(className, [], "", `        int n = ${num}, rev = 0;
        while (n != 0) {
            rev = rev * 10 + n % 10;
            n /= 10;
        }
        System.out.println(rev);`);
      return {
        title: "Reverse a Number",
        problemStatement: `Reverse the digits of ${num}.`,
        code,
        expectedOutput: "54321",
        exampleInput: `n=${num}`,
        exampleOutput: "54321",
        explanation: "Build reversed number digit by digit with n % 10.",
      };
    },
  },
  {
    title: "GCD of Two Numbers",
    build(className, index) {
      const a = 48 + index, b = 18;
      let x = a, y = b;
      while (y !== 0) { const t = x % y; x = y; y = t; }
      const code = javaSolution(className, [], "", `        int a = ${a}, b = ${b};
        while (b != 0) { int t = a % b; a = b; b = t; }
        System.out.println(a);`);
      return {
        title: "GCD of Two Numbers",
        problemStatement: `Find GCD of ${a} and ${b} using Euclidean algorithm.`,
        code,
        expectedOutput: String(x),
        exampleInput: `a=${a}, b=${b}`,
        exampleOutput: String(x),
        explanation: "Euclid: gcd(a,b) = gcd(b, a mod b).",
      };
    },
  },
  {
    title: "Check Prime Number",
    build(className, index) {
      const n = 17 + index * 2;
      let prime = n >= 2;
      for (let i = 2; i * i <= n; i++) if (n % i === 0) prime = false;
      const code = javaSolution(className, [], "", `        int n = ${n};
        boolean prime = n >= 2;
        for (int i = 2; i * i <= n; i++) if (n % i == 0) prime = false;
        System.out.println(prime);`);
      return {
        title: "Check Prime Number",
        problemStatement: `Determine if ${n} is a prime number.`,
        code,
        expectedOutput: String(prime),
        exampleInput: `n=${n}`,
        exampleOutput: String(prime),
        explanation: "Trial division up to sqrt(n).",
      };
    },
  },
  {
    title: "Fibonacci Nth Term",
    build(className, index) {
      const n = 8 + (index % 4);
      let a = 0, b = 1;
      for (let i = 2; i <= n; i++) { const c = a + b; a = b; b = c; }
      const code = javaSolution(className, [], "", `        int n = ${n}, a = 0, b = 1;
        for (int i = 2; i <= n; i++) { int c = a + b; a = b; b = c; }
        System.out.println(b);`);
      return {
        title: "Fibonacci Nth Term",
        problemStatement: `Print the nth Fibonacci number (0-indexed: F(0)=0, F(1)=1) for n = ${n}.`,
        code,
        expectedOutput: String(b),
        exampleInput: `n=${n}`,
        exampleOutput: String(b),
        explanation: "Iterative Fibonacci with two rolling variables.",
      };
    },
  },
  {
    title: "Sum of Even Numbers 1 to N",
    build(className, index) {
      const n = 20 + index * 2;
      let sum = 0;
      for (let i = 2; i <= n; i += 2) sum += i;
      const code = javaSolution(className, [], "", `        int n = ${n}, sum = 0;
        for (int i = 2; i <= n; i += 2) sum += i;
        System.out.println(sum);`);
      return {
        title: "Sum of Even Numbers 1 to N",
        problemStatement: `Sum all even numbers from 2 to ${n} inclusive.`,
        code,
        expectedOutput: String(sum),
        exampleInput: `n=${n}`,
        exampleOutput: String(sum),
        explanation: "Loop i += 2 from 2 to n.",
      };
    },
  },
  {
    title: "Power A to B",
    build(className) {
      const a = 2, b = 10;
      let pow = 1;
      for (let i = 0; i < b; i++) pow *= a;
      const code = javaSolution(className, [], "", `        int a = ${a}, b = ${b}, pow = 1;
        for (int i = 0; i < b; i++) pow *= a;
        System.out.println(pow);`);
      return {
        title: "Power A to B",
        problemStatement: `Compute ${a}^${b} using a loop (no Math.pow).`,
        code,
        expectedOutput: String(pow),
        exampleInput: `a=${a}, b=${b}`,
        exampleOutput: String(pow),
        explanation: "Multiply a to itself b times.",
      };
    },
  },
];

const COMPANY_BUILDERS = [
  { company: "Amazon", title: "Amazon — Maximum Delivery Window", build: (cn, i) => buildSlidingWindow(cn, i, "Amazon") },
  { company: "Google", title: "Google — Longest Stable Segment", build: (cn, i) => buildLongestRun(cn, i, "Google") },
  { company: "Microsoft", title: "Microsoft — Peak Build Score", build: (cn, i) => buildPeakScore(cn, i, "Microsoft") },
  { company: "Meta", title: "Meta — Top Engagement Streak", build: (cn, i) => buildLongestRun(cn, i, "Meta") },
  { company: "Uber", title: "Uber — Best Trip Profit", build: (cn, i) => buildSlidingWindow(cn, i, "Uber") },
  { company: "Flipkart", title: "Flipkart — Max Cart Value Window", build: (cn, i) => buildSlidingWindow(cn, i, "Flipkart") },
  { company: "Adobe", title: "Adobe — Render Batch Peak", build: (cn, i) => buildPeakScore(cn, i, "Adobe") },
  { company: "Oracle", title: "Oracle — Query Cost Bucket", build: (cn, i) => buildThresholdCount(cn, i, "Oracle") },
  { company: "Netflix", title: "Netflix — Longest HD Streak", build: (cn, i) => buildLongestRun(cn, i, "Netflix") },
  { company: "Apple", title: "Apple — Thermal Safe Window", build: (cn, i) => buildSlidingWindow(cn, i, "Apple") },
];

function buildSlidingWindow(className, index, company) {
  const arr = [2, 1, 5, 1, 3, 2];
  const k = 3;
  let window = 0, best = 0;
  for (let i = 0; i < k; i++) window += arr[i];
  best = window;
  for (let i = k; i < arr.length; i++) {
    window += arr[i] - arr[i - k];
    best = Math.max(best, window);
  }
  const code = javaSolution(
    className,
    [],
    `    static int maxWindow(int[] arr, int k) {
        int sum = 0;
        for (int i = 0; i < k; i++) sum += arr[i];
        int best = sum;
        for (int i = k; i < arr.length; i++) {
            sum += arr[i] - arr[i - k];
            best = Math.max(best, sum);
        }
        return best;
    }`,
    `        int[] arr = {${arr.join(", ")}};
        System.out.println(maxWindow(arr, ${k}));`
  );
  return {
    title: `${company} — Maximum Window Sum`,
    problemStatement: `[${company} interview] Given daily metrics [${arr.join(", ")}], find maximum sum of any contiguous window of size ${k}.`,
    code,
    expectedOutput: String(best),
    exampleInput: `arr=[${arr.join(",")}], k=${k}`,
    exampleOutput: String(best),
    explanation: "Sliding window: O(n) by adding incoming and removing outgoing.",
    companyTags: [company],
  };
}

function buildLongestRun(className, index, company) {
  const arr = [1, 1, 0, 1, 1, 1, 0, 1, 1];
  let best = 0, cur = 0;
  for (const x of arr) {
    if (x === 1) { cur++; best = Math.max(best, cur); } else cur = 0;
  }
  const code = javaSolution(
    className,
    [],
    `    static int longestRun(int[] arr) {
        int best = 0, cur = 0;
        for (int x : arr) {
            if (x == 1) { cur++; best = Math.max(best, cur); }
            else cur = 0;
        }
        return best;
    }`,
    `        int[] arr = {${arr.join(", ")}};
        System.out.println(longestRun(arr));`
  );
  return {
    title: `${company} — Longest Consecutive Streak`,
    problemStatement: `[${company} interview] In binary activity log [${arr.join(", ")}] (1=active), find longest consecutive active streak.`,
    code,
    expectedOutput: String(best),
    exampleInput: `arr=[${arr.join(",")}]`,
    exampleOutput: String(best),
    explanation: "Track current streak and reset on inactive day.",
    companyTags: [company],
  };
}

function buildPeakScore(className, index, company) {
  const arr = [3, 2, 1, 4, 7, 5, 2];
  let peak = arr[0];
  for (const x of arr) if (x > peak) peak = x;
  const code = javaSolution(
    className,
    [],
    `    static int peak(int[] arr) {
        int best = arr[0];
        for (int x : arr) if (x > best) best = x;
        return best;
    }`,
    `        int[] arr = {${arr.join(", ")}};
        System.out.println(peak(arr));`
  );
  return {
    title: `${company} — Peak Score`,
    problemStatement: `[${company} interview] Find the peak score from batch results [${arr.join(", ")}].`,
    code,
    expectedOutput: String(peak),
    exampleInput: `arr=[${arr.join(",")}]`,
    exampleOutput: String(peak),
    explanation: "Single pass maximum scan.",
    companyTags: [company],
  };
}

function buildThresholdCount(className, index, company) {
  const arr = [12, 45, 7, 89, 23, 56];
  const threshold = 30;
  let count = 0;
  for (const x of arr) if (x >= threshold) count++;
  const code = javaSolution(
    className,
    [],
    `    static int countAbove(int[] arr, int t) {
        int c = 0;
        for (int x : arr) if (x >= t) c++;
        return c;
    }`,
    `        int[] arr = {${arr.join(", ")}};
        System.out.println(countAbove(arr, ${threshold}));`
  );
  return {
    title: `${company} — Threshold Bucket Count`,
    problemStatement: `[${company} interview] Count values >= ${threshold} in [${arr.join(", ")}].`,
    code,
    expectedOutput: String(count),
    exampleInput: `arr=[${arr.join(",")}], threshold=${threshold}`,
    exampleOutput: String(count),
    explanation: "Linear scan with counter.",
    companyTags: [company],
  };
}

function wrapProblem(slug, topicTitle, category, difficulty, problemType, index, className, core, typeLabel) {
  return {
    title: core.title,
    description: core.problemStatement?.slice(0, 120) ?? core.title,
    problemStatement: core.problemStatement,
    code: core.code,
    expectedOutput: core.expectedOutput,
    exampleInput: core.exampleInput ?? "",
    exampleOutput: core.exampleOutput ?? core.expectedOutput,
    explanation: core.explanation ?? "",
    dryRun: core.dryRun ?? "Trace the algorithm on the given example.",
    visualization: core.visualization ?? "Step through input with pointers or accumulators.",
    hints: core.hints ?? ["State brute force first.", "Then optimize."],
    executionTrace: core.executionTrace ?? trace([
      { action: "Initialize", state: core.title },
      { action: "Process input", state: "loop / map / pointers" },
      { action: "Return result", state: core.expectedOutput?.split("\n")[0] ?? "" },
    ]),
    companyTags: core.companyTags ?? pickCompanyTags(slug, difficulty, index),
    approaches: defaultApproaches(
      difficulty,
      problemType === "leetcode" ? "O(n²)" : "O(n²)",
      problemType === "leetcode" ? "O(n)" : "O(n)",
      "O(1)"
    ),
    problemType,
    estimatedMinutes: estMinutes(difficulty, problemType),
    typeLabel,
  };
}

export function buildDistinctLeetcodeProblem(slug, topicTitle, category, difficulty, index, className) {
  const { item, slot } = pick(LEETCODE_BUILDERS, index);
  const core = item.build(className, slot);
  return wrapProblem(slug, topicTitle, category, difficulty, "leetcode", index, className, core, "LeetCode Style");
}

export function buildDistinctHackerrankProblem(slug, topicTitle, category, difficulty, index, className) {
  const { item, slot } = pick(HACKERRANK_BUILDERS, index);
  const core = item.build(className, slot);
  return wrapProblem(slug, topicTitle, category, difficulty, "hackerrank", index, className, core, "HackerRank Style");
}

export function buildDistinctCompanyProblem(slug, topicTitle, category, difficulty, index, className) {
  const { item, slot } = pick(COMPANY_BUILDERS, index);
  const core = item.build(className, slot);
  return wrapProblem(slug, topicTitle, category, difficulty, "company", index, className, core, "Company Questions");
}
