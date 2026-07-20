import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { COMMUNICATION_BANK } from "./curriculum/communication-bank.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "../src/curriculum/communication-skills/content.ts");

function escape(str) {
  return str
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/\$\{/g, "\\${");
}

function emitEntry(id, { answer, realWorld }) {
  return `  "${id}": d(\n    \`${escape(answer)}\`,\n    \`${escape(realWorld)}\`\n  ),`;
}

const entries = Object.entries(COMMUNICATION_BANK)
  .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
  .map(([id, detail]) => emitEntry(id, detail))
  .join("\n\n");

const content = `import type { AiLearnDetail } from "@/curriculum/ai-content/types";

function d(answer: string, realWorld: string): AiLearnDetail {
  return { answer, realWorld };
}

/** Short, practical communication content — all 12 weeks */
export const COMMUNICATION_CONTENT: Record<string, AiLearnDetail> = {
${entries}
};

export function getCommunicationDetail(
  id: string,
  title: string,
  kind: "topic" | "practice"
): AiLearnDetail {
  if (COMMUNICATION_CONTENT[id]) return COMMUNICATION_CONTENT[id];
  return d(
    \`\${title} — try once in writing or aloud. Keep it under 1 minute.\`,
    "Clear updates at work = same care as clean code."
  );
}
`;

fs.writeFileSync(OUT, content, "utf8");
console.log(`Wrote ${Object.keys(COMMUNICATION_BANK).length} entries to ${OUT}`);
