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
import type { GitHubFileDetail } from "./types";

const CONTENT: Record<string, GitHubFileDetail> = {
  ...(week1 as Record<string, GitHubFileDetail>),
  ...(week2 as Record<string, GitHubFileDetail>),
  ...(week3 as Record<string, GitHubFileDetail>),
  ...(week4 as Record<string, GitHubFileDetail>),
  ...(week5 as Record<string, GitHubFileDetail>),
  ...(week6 as Record<string, GitHubFileDetail>),
  ...(week7 as Record<string, GitHubFileDetail>),
  ...(week8 as Record<string, GitHubFileDetail>),
  ...(week9 as Record<string, GitHubFileDetail>),
  ...(week10 as Record<string, GitHubFileDetail>),
  ...(week11 as Record<string, GitHubFileDetail>),
};

export function getGitHubFileDetail(id: string, title: string, repo = ""): GitHubFileDetail {
  const found = CONTENT[id];
  if (found) return found;

  const repoLabel = repo || "your repository";
  return {
    answer: `Create ${title} for this week. Write the program in your IDE, test it locally, and make sure the filename matches the public class name (for .java files).`,
    realWorld: `Compile with javac ${title}, run with java (class name without .java), then push to ${repoLabel}:\ngit add ${title}\ngit commit -m "Add ${title}"\ngit push`,
  };
}
