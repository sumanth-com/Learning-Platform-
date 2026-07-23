import week1 from "./week-1.json";
import week2 from "./week-2.json";
import week3 from "./week-3.json";
import week4 from "./week-4.json";
import week5 from "./week-5.json";
import week6 from "./week-6.json";
import week7 from "./week-7.json";
import week8 from "./week-8.json";
import week9 from "./week-9.json";
import week10 from "./week-10.json";
import week11 from "./week-11.json";
import portfolio from "./portfolio.json";
import type { ProjectDetail } from "./types";
import type { CurriculumProject } from "@/curriculum/types";

export { isInlineProject } from "./types";
export type { ProjectDetail, InlineProjectDetail, ExternalProjectDetail } from "./types";

const CONTENT: Record<string, ProjectDetail> = {
  ...(week1 as Record<string, ProjectDetail>),
  ...(week2 as Record<string, ProjectDetail>),
  ...(week3 as Record<string, ProjectDetail>),
  ...(week4 as Record<string, ProjectDetail>),
  ...(week5 as Record<string, ProjectDetail>),
  ...(week6 as Record<string, ProjectDetail>),
  ...(week7 as Record<string, ProjectDetail>),
  ...(week8 as Record<string, ProjectDetail>),
  ...(week9 as Record<string, ProjectDetail>),
  ...(week10 as Record<string, ProjectDetail>),
  ...(week11 as Record<string, ProjectDetail>),
  ...(portfolio as Record<string, ProjectDetail>),
};

function fallbackDetail(project: CurriculumProject): ProjectDetail {
  const features = (project.features ?? [])
    .map((f, i) => `${i + 1}. ${f.title}`)
    .join("\n");
  return {
    mode: "inline",
    overview: project.description,
    explanation: [
      `Build **${project.title}** end to end.`,
      "",
      "Acceptance checklist:",
      features || "1. Core happy path works",
      "2. Clear run instructions in a README",
      "3. Invalid input handled gracefully",
    ].join("\n"),
    code: [
      `/**`,
      ` * ${project.title}`,
      ` * ${project.description}`,
      ` */`,
      ``,
      `// Start here — implement the project goals above.`,
      `// Keep functions small, name things clearly, and add a short demo path.`,
      ``,
      `function main() {`,
      `  console.log("TODO: ${project.title}");`,
      `}`,
      ``,
      `main();`,
      ``,
    ].join("\n"),
    filename: "main.js",
    sampleOutput: `TODO: ${project.title}`,
    runInstructions: "node main.js",
  };
}

export function getProjectDetail(project: CurriculumProject): ProjectDetail {
  return CONTENT[project.id] ?? fallbackDetail(project);
}
