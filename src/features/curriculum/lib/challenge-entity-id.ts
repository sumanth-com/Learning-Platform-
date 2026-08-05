/** Pure id helper — keep out of topic-challenges so clients don't pull bundle.json. */
export function curriculumChallengeEntityId(
  moduleSlug: string,
  challenge: { weekId: number; topicSlug: string; lesson: { id: string } }
): string {
  return `curriculum-${moduleSlug}-${challenge.weekId}-${challenge.topicSlug}-${challenge.lesson.id}`;
}
