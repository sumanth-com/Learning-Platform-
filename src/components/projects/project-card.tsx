"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { ProjectListingItem } from "@/curriculum/project-catalog";
import { cn } from "@/lib/utils";

const DIFFICULTY_STYLES = {
  easy: "border-amber-500/40 bg-amber-500/15 text-amber-200",
  medium: "border-emerald-500/40 bg-emerald-500/15 text-emerald-200",
  hard: "border-sky-500/40 bg-sky-500/15 text-sky-200",
} as const;

const DIFFICULTY_LABEL = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
} as const;

interface ProjectCardProps {
  project: ProjectListingItem;
  index?: number;
  locked?: boolean;
  complete?: boolean;
  className?: string;
}

export function ProjectCard({
  project,
  index = 0,
  locked = false,
  complete = false,
  className,
}: ProjectCardProps) {
  const inner = (
    <motion.article
      whileHover={locked ? undefined : { y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className={cn(
        "flex h-full flex-col rounded-2xl border border-zinc-800/90 bg-zinc-900/50 p-5 transition-shadow duration-300",
        locked
          ? "cursor-not-allowed opacity-55"
          : "cursor-pointer hover:border-zinc-700 hover:bg-zinc-900/80 hover:shadow-lg hover:shadow-indigo-500/5",
        complete && "ring-1 ring-emerald-500/30",
        className
      )}
    >
      <div className="mb-3">
        <span
          className={cn(
            "rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
            DIFFICULTY_STYLES[project.difficulty]
          )}
        >
          {DIFFICULTY_LABEL[project.difficulty]}
        </span>
      </div>

      <h3 className="text-base font-bold leading-snug text-zinc-50">{project.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-400 line-clamp-2">
        {project.description}
      </p>

      {(project.weekId <= 11 || complete) && (
        <div className="mt-5 flex items-center justify-end gap-2 border-t border-zinc-800/60 pt-4">
          {project.weekId <= 11 && (
            <span className="mr-auto text-[10px] font-medium uppercase tracking-wider text-zinc-600">
              Week {project.weekId}
            </span>
          )}
          {complete && (
            <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
              Done
            </span>
          )}
        </div>
      )}
    </motion.article>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.025, duration: 0.35 }}
      className="h-full"
    >
      {locked ? (
        inner
      ) : (
        <Link href={project.href} className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-2xl">
          {inner}
        </Link>
      )}
    </motion.div>
  );
}
