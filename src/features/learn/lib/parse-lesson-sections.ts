export type LessonDocSectionId =
  | "introduction"
  | "concepts"
  | "examples"
  | "code"
  | "exercises"
  | "other";

export type LessonDocSection = {
  id: LessonDocSectionId;
  title: string;
  content: string;
};

const SECTION_ALIASES: Array<{ id: LessonDocSectionId; title: string; match: RegExp }> = [
  {
    id: "introduction",
    title: "Introduction",
    match: /^(introduction|overview|getting started)$/i,
  },
  {
    id: "concepts",
    title: "Concept explanation",
    match: /^(concept|concepts|concept explanation|explanation|theory|core ideas?)$/i,
  },
  {
    id: "examples",
    title: "Examples",
    match: /^(examples?|worked examples?|walkthrough)$/i,
  },
  {
    id: "code",
    title: "Code snippets",
    match: /^(code|code snippets?|snippet|implementation)$/i,
  },
  {
    id: "exercises",
    title: "Interactive exercises",
    match: /^(exercises?|interactive exercises?|practice|try it|challenge)$/i,
  },
  {
    id: "other",
    title: "Best practices",
    match: /^(best practices?|tips|guidelines|dos and don'?ts)$/i,
  },
];

/**
 * Split lesson markdown into documentation sections by ## headings.
 * Unmatched leading content becomes Introduction.
 */
export function parseLessonDocSections(content: string): LessonDocSection[] {
  const raw = content?.trim() ?? "";
  if (!raw) return [];

  const parts = raw.split(/\n(?=##\s+)/);
  const sections: LessonDocSection[] = [];

  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;

    const headingMatch = trimmed.match(/^##\s+(.+?)(?:\n|$)([\s\S]*)$/);
    if (!headingMatch) {
      sections.push({
        id: "introduction",
        title: "Introduction",
        content: trimmed,
      });
      continue;
    }

    const heading = headingMatch[1].trim();
    const body = headingMatch[2].trim();
    const alias = SECTION_ALIASES.find((a) => a.match.test(heading));

    sections.push({
      id: alias?.id ?? "other",
      title: alias?.title ?? heading,
      content: body || trimmed,
    });
  }

  return mergeDuplicateSections(sections);
}

function mergeDuplicateSections(sections: LessonDocSection[]): LessonDocSection[] {
  const order: LessonDocSectionId[] = [
    "introduction",
    "concepts",
    "examples",
    "code",
    "exercises",
    "other",
  ];
  const buckets = new Map<string, LessonDocSection>();

  for (const section of sections) {
    const key =
      section.id === "other" ? `other:${section.title}` : section.id;
    const existing = buckets.get(key);
    if (existing) {
      existing.content = `${existing.content}\n\n${section.content}`.trim();
    } else {
      buckets.set(key, { ...section });
    }
  }

  const known = order
    .filter((id) => id !== "other")
    .map((id) => buckets.get(id))
    .filter(Boolean) as LessonDocSection[];

  const others = [...buckets.values()].filter((s) => s.id === "other");
  return [...known, ...others];
}
