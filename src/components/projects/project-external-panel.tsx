"use client";

import { ExternalLink } from "lucide-react";
import type { ExternalProjectDetail } from "@/curriculum/project-content/types";
import { GitHubLogoBadge, YouTubeLogoBadge } from "@/components/shared/brand-icons";
import { cn } from "@/lib/utils";
import { learnProseClass } from "@/components/shared/learn-answer-cards";

interface ProjectExternalPanelProps {
  detail: ExternalProjectDetail;
  className?: string;
}

function ResourceCard({
  href,
  brand,
  label,
  title,
  accent,
}: {
  href: string;
  brand: "github" | "youtube";
  label: string;
  title: string;
  accent: "indigo" | "red";
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group flex flex-col gap-3 rounded-xl border p-4 transition-all hover:scale-[1.01]",
        accent === "indigo"
          ? "border-indigo-500/20 bg-indigo-500/5 hover:border-indigo-500/40 hover:bg-indigo-500/10"
          : "border-red-500/20 bg-red-500/5 hover:border-red-500/40 hover:bg-red-500/10"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        {brand === "github" ? <GitHubLogoBadge /> : <YouTubeLogoBadge />}
        <ExternalLink className="h-4 w-4 shrink-0 text-zinc-600 transition-colors group-hover:text-zinc-400" />
      </div>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">{label}</p>
        <p className="mt-1 text-sm font-semibold leading-snug text-zinc-100">{title}</p>
      </div>
    </a>
  );
}

export function ProjectExternalPanel({ detail, className }: ProjectExternalPanelProps) {
  return (
    <div className={cn("flex h-full min-h-0 flex-col overflow-hidden", className)}>
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto rounded-lg border border-zinc-800 bg-[#0a0a0b] p-4 sm:p-5">
        <div className="shrink-0 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2.5">
          <p className="text-xs leading-relaxed text-amber-200/90">
            This is a larger project — study the reference repo and tutorial, then build your own version.
          </p>
        </div>

        <ResourceCard
          href={detail.githubUrl}
          brand="github"
          label="Reference GitHub Repository"
          title={detail.githubLabel}
          accent="indigo"
        />

        <ResourceCard
          href={detail.youtubeUrl}
          brand="youtube"
          label="Best Tutorial Video"
          title={detail.youtubeLabel}
          accent="red"
        />

        <section className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
          <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
            How to study
          </h3>
          <p className={cn(learnProseClass, "whitespace-pre-wrap leading-relaxed text-zinc-400")}>
            {detail.studyNote}
          </p>
        </section>
      </div>
    </div>
  );
}
