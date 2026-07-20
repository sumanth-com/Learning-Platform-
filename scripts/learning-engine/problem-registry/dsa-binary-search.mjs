/**
 * Hand-crafted LeetCode-quality problems for Binary Search topic.
 */
import { javaSolution, clsName } from "../lib/rich-fields.mjs";

function bsEasy1(slug) {
  const cls = clsName(slug, "Easy1");
  return {
    title: "Binary Search",
    description: "Find target index in a sorted array.",
    problemStatement:
      "Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, return its index. Otherwise, return -1.\n\nYou must write an algorithm with O(log n) runtime complexity.",
    constraints: ["1 <= nums.length <= 10^4", "-10^4 <= nums[i], target <= 10^4", "All integers in nums are unique.", "nums is sorted in ascending order."],
    exampleInput: "nums = [-1,0,3,5,9,12], target = 9",
    exampleOutput: "4",
    explanation:
      "Step 1: left=0, right=5, mid=2, nums[2]=3 < 9 → search right half.\nStep 2: left=3, right=5, mid=4, nums[4]=9 == target → return 4.",
    approaches: [
      { name: "Brute Force", description: "Scan every element until found.", timeComplexity: "O(n)", spaceComplexity: "O(1)" },
      { name: "Optimal", description: "Classic binary search halving search space.", timeComplexity: "O(log n)", spaceComplexity: "O(1)" },
    ],
    code: javaSolution(
      cls,
      [],
      `    public int search(int[] nums, int target) {
        int left = 0, right = nums.length - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] == target) return mid;
            if (nums[mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        return -1;
    }`,
      `${cls} sol = new ${cls}();
        System.out.println(sol.search(new int[]{-1,0,3,5,9,12}, 9));`
    ),
    filename: `${cls}.java`,
    expectedOutput: "4",
    dryRun: "Iteration 1: left=0, right=5, mid=2, nums[2]=3 < 9 → left=3\nIteration 2: left=3, right=5, mid=4, nums[4]=9 == 9 → return 4",
    visualization: "Array: [-1, 0, 3, 5, 9, 12] — pointers narrow from both ends toward target",
    companyTags: ["Amazon", "Google", "Microsoft"],
    commonMistakes: ["Using (left+right)/2 overflow — use left+(right-left)/2", "Off-by-one with <= vs <"],
    interviewTips: ["State O(log n) before coding", "Mention sorted precondition"],
    alternativeSolutions: ["Recursive binary search", "Arrays.binarySearch"],
    followUpQuestions: ["What if duplicates exist?", "Search in rotated sorted array?"],
    practiceVariations: ["Search Insert Position", "First and last position"],
    practiceQuestions: ["LeetCode #704"],
  };
}

function bsEasy2(slug) {
  const cls = clsName(slug, "Easy2");
  return {
    title: "Sqrt(x)",
    description: "Compute integer square root using binary search.",
    problemStatement:
      "Given a non-negative integer x, compute and return the square root of x rounded down to the nearest integer.",
    constraints: ["0 <= x <= 2^31 - 1"],
    exampleInput: "x = 8",
    exampleOutput: "2",
    explanation: "Search answer space [0, x]. If mid*mid <= x, try larger; else shrink right.",
    approaches: [
      { name: "Brute Force", description: "Try i from 0 until i*i > x.", timeComplexity: "O(sqrt(x))", spaceComplexity: "O(1)" },
      { name: "Optimal", description: "Binary search on [0, x] for largest mid with mid*mid <= x.", timeComplexity: "O(log x)", spaceComplexity: "O(1)" },
    ],
    code: javaSolution(
      cls,
      [],
      `    public int mySqrt(int x) {
        if (x < 2) return x;
        int left = 1, right = x / 2;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            long sq = (long) mid * mid;
            if (sq == x) return mid;
            if (sq < x) left = mid + 1;
            else right = mid - 1;
        }
        return right;
    }`,
      `${cls} sol = new ${cls}();
        System.out.println(sol.mySqrt(8));`
    ),
    filename: `${cls}.java`,
    expectedOutput: "2",
    dryRun: "left=1, right=4, mid=2, 2*2=4<=8 → left=3\nleft=3, right=4, mid=3, 9>8 → right=2 → return 2",
    visualization: "Answer space [1..4]: try mid=2 ✓, try mid=3 ✗ → floor sqrt is 2",
    companyTags: ["Facebook", "Bloomberg", "Apple"],
    commonMistakes: ["Integer overflow in mid*mid — cast to long"],
    interviewTips: ["Binary search on answer, not array"],
    alternativeSolutions: ["Newton's method"],
    followUpQuestions: ["Exact sqrt with precision?"],
    practiceVariations: ["Perfect square check"],
    practiceQuestions: ["LeetCode #69"],
  };
}

function bsEasy3(slug) {
  const cls = clsName(slug, "Easy3");
  return {
    title: "Search Insert Position",
    description: "Find index where target would be inserted.",
    problemStatement:
      "Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be inserted in order.",
    constraints: ["1 <= nums.length <= 10^4", "-10^4 <= nums[i] <= 10^4", "nums contains distinct values."],
    exampleInput: "nums = [1,3,5,6], target = 5",
    exampleOutput: "2",
    explanation: "Target 5 found at index 2. If target were 2, return 1.",
    approaches: [
      { name: "Brute Force", description: "Linear scan for first nums[i] >= target.", timeComplexity: "O(n)", spaceComplexity: "O(1)" },
      { name: "Optimal", description: "Lower-bound binary search.", timeComplexity: "O(log n)", spaceComplexity: "O(1)" },
    ],
    code: javaSolution(
      cls,
      [],
      `    public int searchInsert(int[] nums, int target) {
        int left = 0, right = nums.length;
        while (left < right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] < target) left = mid + 1;
            else right = mid;
        }
        return left;
    }`,
      `${cls} sol = new ${cls}();
        System.out.println(sol.searchInsert(new int[]{1,3,5,6}, 5));`
    ),
    filename: `${cls}.java`,
    expectedOutput: "2",
    dryRun: "target=5: mid=2, nums[2]=5 >= 5 → return 2",
    visualization: "[1, 3, 5, 6] — first index where element >= target",
    companyTags: ["Google", "Adobe", "Uber"],
    commonMistakes: ["Using right = nums.length - 1 instead of nums.length"],
    interviewTips: ["Template: while left < right, lower bound"],
    alternativeSolutions: ["Arrays.binarySearch insertion point"],
    followUpQuestions: ["Duplicates allowed?"],
    practiceVariations: ["First bad version"],
    practiceQuestions: ["LeetCode #35"],
  };
}

function bsMed1(slug) {
  const cls = clsName(slug, "Med1");
  return {
    title: "Search in Rotated Sorted Array",
    description: "Find target in rotated sorted array.",
    problemStatement:
      "There is an integer array nums sorted in ascending order, rotated at an unknown pivot. Given nums and target, return index of target or -1. O(log n) required.",
    constraints: ["1 <= nums.length <= 5000", "-10^4 <= nums[i] <= 10^4", "All values unique."],
    exampleInput: "nums = [4,5,6,7,0,1,2], target = 0",
    exampleOutput: "4",
    explanation: "Identify sorted half, check if target lies there, narrow search space.",
    approaches: [
      { name: "Brute Force", description: "Linear scan.", timeComplexity: "O(n)", spaceComplexity: "O(1)" },
      { name: "Optimal", description: "Modified binary search on sorted half.", timeComplexity: "O(log n)", spaceComplexity: "O(1)" },
    ],
    code: javaSolution(
      cls,
      [],
      `    public int search(int[] nums, int target) {
        int left = 0, right = nums.length - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] == target) return mid;
            if (nums[left] <= nums[mid]) {
                if (nums[left] <= target && target < nums[mid]) right = mid - 1;
                else left = mid + 1;
            } else {
                if (nums[mid] < target && target <= nums[right]) left = mid + 1;
                else right = mid - 1;
            }
        }
        return -1;
    }`,
      `${cls} sol = new ${cls}();
        System.out.println(sol.search(new int[]{4,5,6,7,0,1,2}, 0));`
    ),
    filename: `${cls}.java`,
    expectedOutput: "4",
    dryRun: "mid=3 → left half sorted, target 0 not in [4,7] → left=4\nmid=4, nums[4]=0 → return 4",
    visualization: "[4,5,6,7 | 0,1,2] — pick sorted half each step",
    companyTags: ["Amazon", "Microsoft", "LinkedIn"],
    commonMistakes: ["Wrong boundary checks with <= vs <"],
    interviewTips: ["Draw rotated array first"],
    alternativeSolutions: ["Find pivot then standard BS"],
    followUpQuestions: ["With duplicates?"],
    practiceVariations: ["LeetCode #33"],
    practiceQuestions: ["Find minimum in rotated array"],
  };
}

function bsMed2(slug) {
  const cls = clsName(slug, "Med2");
  return {
    title: "Find Peak Element",
    description: "Find any peak index in O(log n).",
    problemStatement:
      "A peak element is strictly greater than its neighbors. Return any peak index. O(log n) required.",
    constraints: ["1 <= nums.length <= 1000", "nums[i] != nums[i+1] for valid i"],
    exampleInput: "nums = [1,2,3,1]",
    exampleOutput: "2",
    explanation: "If nums[mid] < nums[mid+1], peak is on right; else on left including mid.",
    approaches: [
      { name: "Brute Force", description: "Linear scan.", timeComplexity: "O(n)", spaceComplexity: "O(1)" },
      { name: "Optimal", description: "Binary search on slope.", timeComplexity: "O(log n)", spaceComplexity: "O(1)" },
    ],
    code: javaSolution(
      cls,
      [],
      `    public int findPeakElement(int[] nums) {
        int left = 0, right = nums.length - 1;
        while (left < right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] < nums[mid + 1]) left = mid + 1;
            else right = mid;
        }
        return left;
    }`,
      `${cls} sol = new ${cls}();
        System.out.println(sol.findPeakElement(new int[]{1,2,3,1}));`
    ),
    filename: `${cls}.java`,
    expectedOutput: "2",
    dryRun: "mid=1, nums[1]=2 < nums[2]=3 → left=2 → peak at index 2",
    visualization: "Walk uphill — move toward higher neighbor",
    companyTags: ["Google", "Atlassian", "Oracle"],
    commonMistakes: ["Wrong boundary on right"],
    interviewTips: ["Treat nums[-1] and nums[n] as -infinity"],
    alternativeSolutions: ["Linear scan if O(n) allowed"],
    followUpQuestions: ["2D peak finding?"],
    practiceVariations: ["LeetCode #162"],
    practiceQuestions: ["Explain why log n works"],
  };
}

function bsMed3(slug) {
  const cls = clsName(slug, "Med3");
  return {
    title: "Koko Eating Bananas",
    description: "Binary search on minimum eating speed.",
    problemStatement:
      "Return minimum integer k (bananas per hour) so Koko can finish all piles within h hours.",
    constraints: ["1 <= piles.length <= 10^4", "piles.length <= h <= 10^9", "1 <= piles[i] <= 10^9"],
    exampleInput: "piles = [3,6,7,11], h = 8",
    exampleOutput: "4",
    explanation: "Binary search k in [1, max(piles)]. Check total hours = sum(ceil(pile/k)).",
    approaches: [
      { name: "Brute Force", description: "Try every k.", timeComplexity: "O(n * max)", spaceComplexity: "O(1)" },
      { name: "Optimal", description: "Binary search on k with feasibility check.", timeComplexity: "O(n log max)", spaceComplexity: "O(1)" },
    ],
    code: javaSolution(
      cls,
      [],
      `    public int minEatingSpeed(int[] piles, int h) {
        int left = 1, right = 0;
        for (int p : piles) right = Math.max(right, p);
        while (left < right) {
            int mid = left + (right - left) / 2;
            long hours = 0;
            for (int p : piles) hours += (p + mid - 1L) / mid;
            if (hours <= h) right = mid;
            else left = mid + 1;
        }
        return left;
    }`,
      `${cls} sol = new ${cls}();
        System.out.println(sol.minEatingSpeed(new int[]{3,6,7,11}, 8));`
    ),
    filename: `${cls}.java`,
    expectedOutput: "4",
    dryRun: "k=4: hours=1+2+2+3=8 ≤ 8 ✓; k=3: 11 hours ✗ → answer 4",
    visualization: "Answer space [1..11] — binary search smallest feasible speed",
    companyTags: ["Google", "Flipkart", "Amazon"],
    commonMistakes: ["Use long for hours sum"],
    interviewTips: ["Classic binary search on answer"],
    alternativeSolutions: ["Linear scan on k"],
    followUpQuestions: ["Split array largest sum?"],
    practiceVariations: ["LeetCode #875"],
    practiceQuestions: ["Identify monotonic predicate"],
  };
}

function bsHard1(slug) {
  const cls = clsName(slug, "Hard1");
  return {
    title: "Median of Two Sorted Arrays",
    description: "O(log(m+n)) median of two sorted arrays.",
    problemStatement:
      "Given two sorted arrays nums1 and nums2, return the median. Overall runtime must be O(log(m+n)).",
    constraints: ["0 <= m, n <= 1000", "1 <= m + n <= 2000"],
    exampleInput: "nums1 = [1,3], nums2 = [2]",
    exampleOutput: "2.0",
    explanation: "Binary search partition on smaller array so left halves contain (m+n+1)/2 smallest elements.",
    approaches: [
      { name: "Brute Force", description: "Merge and pick middle.", timeComplexity: "O(m+n)", spaceComplexity: "O(m+n)" },
      { name: "Better", description: "Merge in-place pointers.", timeComplexity: "O(m+n)", spaceComplexity: "O(1)" },
      { name: "Optimal", description: "Partition binary search.", timeComplexity: "O(log(min(m,n)))", spaceComplexity: "O(1)" },
    ],
    code: javaSolution(
      cls,
      [],
      `    public double findMedianSortedArrays(int[] a, int[] b) {
        if (a.length > b.length) return findMedianSortedArrays(b, a);
        int m = a.length, n = b.length;
        int left = 0, right = m;
        while (left <= right) {
            int pa = left + (right - left) / 2;
            int pb = (m + n + 1) / 2 - pa;
            int maxLeftA = pa == 0 ? Integer.MIN_VALUE : a[pa - 1];
            int minRightA = pa == m ? Integer.MAX_VALUE : a[pa];
            int maxLeftB = pb == 0 ? Integer.MIN_VALUE : b[pb - 1];
            int minRightB = pb == n ? Integer.MAX_VALUE : b[pb];
            if (maxLeftA <= minRightB && maxLeftB <= minRightA) {
                if (((m + n) & 1) == 1) return Math.max(maxLeftA, maxLeftB);
                return (Math.max(maxLeftA, maxLeftB) + Math.min(minRightA, minRightB)) / 2.0;
            } else if (maxLeftA > minRightB) right = pa - 1;
            else left = pa + 1;
        }
        throw new IllegalArgumentException("Invalid input");
    }`,
      `${cls} sol = new ${cls}();
        System.out.println(sol.findMedianSortedArrays(new int[]{1,3}, new int[]{2}));`
    ),
    filename: `${cls}.java`,
    expectedOutput: "2.0",
    dryRun: "pa=1,pb=1: maxLeftA=1, maxLeftB=2, minRightA=3 → median = max(1,2) = 2",
    visualization: "Partition: [1|3] and [2| ] — valid split → median 2",
    companyTags: ["Google", "Amazon", "Microsoft", "Adobe"],
    commonMistakes: ["Binary search on values not partition index"],
    interviewTips: ["Google favorite — explain partition invariant"],
    alternativeSolutions: ["Two-pointer merge"],
    followUpQuestions: ["Kth element of two arrays?"],
    practiceVariations: ["LeetCode #4"],
    practiceQuestions: ["Draw partition on whiteboard"],
  };
}

function bsHard2(slug) {
  const cls = clsName(slug, "Hard2");
  return {
    title: "Split Array Largest Sum",
    description: "Minimize largest subarray sum with k splits.",
    problemStatement:
      "Split nums into k non-empty contiguous subarrays minimizing the largest subarray sum.",
    constraints: ["1 <= nums.length <= 1000", "0 <= nums[i] <= 10^6", "1 <= k <= min(50, nums.length)"],
    exampleInput: "nums = [7,2,5,10,8], k = 2",
    exampleOutput: "18",
    explanation: "Binary search max sum cap. Greedily count splits needed.",
    approaches: [
      { name: "Brute Force", description: "Try all split positions.", timeComplexity: "O(n^k)", spaceComplexity: "O(n)" },
      { name: "Optimal", description: "Binary search + greedy validation.", timeComplexity: "O(n log S)", spaceComplexity: "O(1)" },
    ],
    code: javaSolution(
      cls,
      [],
      `    public int splitArray(int[] nums, int k) {
        int left = 0, right = 0;
        for (int n : nums) right += n;
        while (left < right) {
            int mid = left + (right - left) / 2;
            int parts = 1, current = 0;
            for (int n : nums) {
                if (current + n > mid) { parts++; current = n; }
                else current += n;
            }
            if (parts <= k) right = mid;
            else left = mid + 1;
        }
        return left;
    }`,
      `${cls} sol = new ${cls}();
        System.out.println(sol.splitArray(new int[]{7,2,5,10,8}, 2));`
    ),
    filename: `${cls}.java`,
    expectedOutput: "18",
    dryRun: "max=18: [7,2,5|10,8] → 2 parts ✓",
    visualization: "Answer space [max..sum] — binary search minimum feasible cap",
    companyTags: ["Google", "Uber", "Atlassian"],
    commonMistakes: ["Greedy split count off-by-one"],
    interviewTips: ["Monotonic feasibility predicate"],
    alternativeSolutions: ["DP for small n"],
    followUpQuestions: ["Painter's partition?"],
    practiceVariations: ["LeetCode #410"],
    practiceQuestions: ["Prove greedy count correct"],
  };
}

function bsHard3(slug) {
  const cls = clsName(slug, "Hard3");
  return {
    title: "Minimum Limit of Balls in a Bag",
    description: "Binary search on max bag size after splits.",
    problemStatement:
      "Split bags with at most maxOperations. Return minimum possible maximum balls in any bag.",
    constraints: ["1 <= nums.length <= 10^5", "1 <= maxOperations, nums[i] <= 10^9"],
    exampleInput: "nums = [9], maxOperations = 2",
    exampleOutput: "3",
    explanation: "Binary search penalty p. Ops to reduce bag n to <= p is (n-1)/p.",
    approaches: [
      { name: "Brute Force", description: "Simulate all splits.", timeComplexity: "Exponential", spaceComplexity: "O(n)" },
      { name: "Optimal", description: "Binary search + op count.", timeComplexity: "O(n log max)", spaceComplexity: "O(1)" },
    ],
    code: javaSolution(
      cls,
      [],
      `    public int minimumSize(int[] nums, int maxOperations) {
        int left = 1, right = 0;
        for (int n : nums) right = Math.max(right, n);
        while (left < right) {
            int mid = left + (right - left) / 2;
            long ops = 0;
            for (int n : nums) {
                ops += (n - 1) / mid;
                if (ops > maxOperations) break;
            }
            if (ops <= maxOperations) right = mid;
            else left = mid + 1;
        }
        return left;
    }`,
      `${cls} sol = new ${cls}();
        System.out.println(sol.minimumSize(new int[]{9}, 2));`
    ),
    filename: `${cls}.java`,
    expectedOutput: "3",
    dryRun: "penalty=3: (9-1)/3=2 ops → bags [3,3,3] ✓",
    visualization: "Binary search max bag size after optimal splits",
    companyTags: ["Google", "Amazon", "Netflix"],
    commonMistakes: ["Wrong ops formula — use (n-1)/mid"],
    interviewTips: ["Same template as Koko bananas"],
    alternativeSolutions: ["Heap simulation for small n"],
    followUpQuestions: ["Generalize split cost?"],
    practiceVariations: ["LeetCode #1760"],
    practiceQuestions: ["Derive ops count formula"],
  };
}

export function getBinarySearchHandcrafted(slug) {
  return {
    easy: [bsEasy1(slug), bsEasy2(slug), bsEasy3(slug)],
    medium: [bsMed1(slug), bsMed2(slug), bsMed3(slug)],
    hard: [bsHard1(slug), bsHard2(slug), bsHard3(slug)],
  };
}
