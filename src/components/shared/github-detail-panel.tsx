"use client";

import { GitBranch, FolderOpen, ExternalLink } from "lucide-react";
import type { CurriculumGitHubTasks } from "@/curriculum/types";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChecklistRow } from "@/components/shared/checklist-row";
import { SlideOverPanel, SectionTitle } from "@/components/shared/slide-over-panel";

export interface GitHubDetailContext {
  tasks: CurriculumGitHubTasks;
  weekId: number;
  progressPct: number;
  locked: boolean;
  repoLink: string;
  isDone: (id: string) => boolean;
  onToggle: (id: string) => void;
  onRepoLinkChange: (link: string) => void;
}

interface GitHubDetailPanelProps {
  context: GitHubDetailContext | null;
  onClose: () => void;
}

export function GitHubDetailPanel({ context, onClose }: GitHubDetailPanelProps) {
  if (!context) return null;

  const { tasks, weekId, progressPct, locked, repoLink, isDone, onToggle, onRepoLinkChange } = context;
  const filesDone = tasks.files.filter((f) => isDone(f.id)).length;

  return (
    <SlideOverPanel
      open={!!context}
      onClose={onClose}
      title={tasks.repository}
      description={tasks.description}
      badges={
        <>
          <Badge variant="purple" className="text-[10px]">
            Week {weekId}
          </Badge>
          {progressPct === 100 && (
            <Badge variant="success" className="text-[10px]">
              Complete
            </Badge>
          )}
        </>
      }
      footer={
        repoLink ? (
          <a
            href={repoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-indigo-400 hover:text-indigo-300"
          >
            Open repository
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        ) : undefined
      }
    >
      <div className="space-y-6">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-zinc-400">Upload progress</span>
            <span className="font-semibold tabular-nums text-indigo-300">{progressPct}%</span>
          </div>
          <Progress value={progressPct} className="h-2" />
          <p className="mt-2 text-xs text-zinc-500">
            {filesDone} of {tasks.files.length} files pushed
          </p>
        </div>

        <div className="space-y-3">
          <SectionTitle icon={GitBranch}>Repository URL</SectionTitle>
          <div className="flex gap-2">
            <Input
              value={repoLink}
              onChange={(e) => onRepoLinkChange(e.target.value)}
              placeholder="https://github.com/username/repo"
              disabled={locked}
            />
            {repoLink && (
              <Button variant="secondary" size="icon" asChild>
                <a href={repoLink} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <SectionTitle icon={FolderOpen}>Files to push</SectionTitle>
          <div className="space-y-2">
            {tasks.files.map((file) => (
              <ChecklistRow
                key={file.id}
                id={file.id}
                title={file.path}
                checked={isDone(file.id)}
                onToggle={() => !locked && onToggle(file.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </SlideOverPanel>
  );
}
