export type TopicDocSectionId =
  | "overview"
  | "objectives"
  | "why"
  | "examples"
  | "diagrams"
  | "explanation"
  | "code"
  | "playground"
  | "mistakes"
  | "practices"
  | "interview"
  | "references"
  | "quiz"
  | "practice"
  | "assignment"
  | "discussion"
  | "other";

export type TopicDocSection = {
  id: TopicDocSectionId;
  title: string;
  content: string;
};

const ALIASES: Array<{ id: TopicDocSectionId; title: string; match: RegExp }> = [
  { id: "overview", title: "Overview", match: /^(overview|introduction|getting started)$/i },
  { id: "objectives", title: "Learning objectives", match: /^(learning objectives?|objectives?|goals)$/i },
  { id: "why", title: "Why it matters", match: /^(why it matters|why|motivation|real[- ]?world)$/i },
  { id: "examples", title: "Real-world examples", match: /^(examples?|real[- ]?world examples?|use cases?)$/i },
  { id: "diagrams", title: "Visual diagrams", match: /^(diagrams?|visuals?|figures?)$/i },
  { id: "explanation", title: "Complete explanation", match: /^(explanation|concepts?|deep dive|theory)$/i },
  { id: "code", title: "Code examples", match: /^(code|code examples?|snippets?|implementation)$/i },
  { id: "playground", title: "Interactive playground", match: /^(playground|interactive|try it)$/i },
  { id: "mistakes", title: "Common mistakes", match: /^(common mistakes|mistakes|pitfalls|gotchas)$/i },
  { id: "practices", title: "Best practices", match: /^(best practices?|tips|guidelines)$/i },
  { id: "interview", title: "Interview questions", match: /^(interview|interview questions?|faq)$/i },
  { id: "references", title: "References", match: /^(references?|further reading|links)$/i },
  { id: "quiz", title: "Mini quiz", match: /^(quiz|mini quiz|check your understanding)$/i },
  { id: "practice", title: "Practice problems", match: /^(practice|practice problems?|exercises?|challenges?)$/i },
  { id: "assignment", title: "Assignment", match: /^(assignment|homework|deliverable)$/i },
  { id: "discussion", title: "Discussion", match: /^(discussion|reflect|talk about)$/i },
];

export function parseTopicDocSections(content: string): TopicDocSection[] {
  const raw = content?.trim() ?? "";
  if (!raw) return [];

  const parts = raw.split(/\n(?=##\s+)/);
  const sections: TopicDocSection[] = [];

  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;

    const headingMatch = trimmed.match(/^##\s+(.+?)(?:\n|$)([\s\S]*)$/);
    if (!headingMatch) {
      sections.push({ id: "overview", title: "Overview", content: trimmed });
      continue;
    }

    const heading = headingMatch[1].trim();
    const body = headingMatch[2].trim();
    const alias = ALIASES.find((a) => a.match.test(heading));
    sections.push({
      id: alias?.id ?? "other",
      title: alias?.title ?? heading,
      content: body || trimmed,
    });
  }

  return sections;
}
