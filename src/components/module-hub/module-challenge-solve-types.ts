import type { TopicChallenge } from "@/features/curriculum/lib/topic-challenges";

export type ModuleChallengeSolveProps = {
  moduleSlug: string;
  topicSlug: string;
  topicTitle: string;
  moduleTitle: string;
  challenge: TopicChallenge;
};
