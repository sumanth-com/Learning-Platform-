export interface ProjectDetailBase {
  overview: string;
  explanation: string;
}

export interface InlineProjectDetail extends ProjectDetailBase {
  mode: "inline";
  code: string;
  filename: string;
  sampleInput?: string;
  sampleOutput: string;
  runInstructions: string;
}

export interface ExternalProjectDetail extends ProjectDetailBase {
  mode: "external";
  githubUrl: string;
  githubLabel: string;
  youtubeUrl: string;
  youtubeLabel: string;
  studyNote: string;
}

export type ProjectDetail = InlineProjectDetail | ExternalProjectDetail;

export function isInlineProject(detail: ProjectDetail): detail is InlineProjectDetail {
  return detail.mode === "inline";
}
