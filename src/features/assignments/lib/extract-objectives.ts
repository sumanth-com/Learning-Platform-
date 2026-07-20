/**
 * Extracts learning objectives from lesson markdown content.
 * Looks for Goals / Focus / Objectives / Checklist sections.
 */
export function extractLearningObjectives(content: string): string[] {
  const lines = content.split("\n");
  const objectives: string[] = [];
  let capturing = false;

  for (const raw of lines) {
    const line = raw.trim();
    if (/^###?\s+(goals|focus|objectives|checklist)\b/i.test(line)) {
      capturing = true;
      continue;
    }
    if (capturing && /^###?\s+/.test(line)) break;
    if (capturing && line.startsWith("- ")) {
      objectives.push(line.replace(/^-\s+/, ""));
    }
  }

  return objectives;
}
