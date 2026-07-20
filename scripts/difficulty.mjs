/** LeetCode-style difficulty tiers for roadmap patterns */

export const DIFFICULTIES = ["easy", "medium", "hard"];

export function difficultyForIndex(index) {
  if (index < 11) return "easy";
  if (index < 22) return "medium";
  return "hard";
}

export function difficultyLabel(d) {
  return d.charAt(0).toUpperCase() + d.slice(1);
}

/** Scale code complexity by tier — easy stays simple, hard adds structure */
export function scalePatternBody(body, difficulty, title) {
  if (difficulty === "easy") {
    return body;
  }
  if (difficulty === "medium") {
    return `${body}
        System.out.println("--- Medium ---");
        System.out.println("Validate & handle edge cases for ${title}");`;
  }
  return `${body}
        System.out.println("--- Hard ---");
        int[] stress = {1, 2, 3, 4, 5};
        int acc = 0;
        for (int v : stress) acc += v;
        System.out.println("Stress test sum = " + acc + " | ${title}");`;
}

export function scalePatternOutput(output, difficulty) {
  if (difficulty === "easy") return output;
  if (difficulty === "medium") return `${output}\n--- Medium ---\nValidate & handle edge cases`;
  return `${output}\n--- Hard ---\nStress test sum = 15`;
}
