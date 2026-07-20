"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { JavaRoadmapTopic } from "@/curriculum/java-roadmap";
import { cn } from "@/lib/utils";

interface RoadmapTopicNodeProps {
  topic: JavaRoadmapTopic;
  index?: number;
  className?: string;
}

export function RoadmapTopicNode({ topic, index = 0, className }: RoadmapTopicNodeProps) {
  const isMilestone = topic.kind === "milestone";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.35,
        delay: index * 0.03,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      className={cn("relative h-full", className)}
    >
      <Link
        href={`/roadmap/topic/${topic.slug}`}
        className={cn(
          "group flex h-full flex-col rounded-xl border px-4 py-3 text-left transition-all duration-300",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
          isMilestone
            ? "border-indigo-500/40 bg-gradient-to-br from-indigo-500/15 via-purple-500/10 to-indigo-600/5 hover:border-indigo-400/50 hover:shadow-lg hover:shadow-indigo-500/10"
            : "border-zinc-800/90 bg-zinc-900/50 hover:border-zinc-700 hover:bg-zinc-900/80 hover:shadow-md hover:shadow-indigo-500/5"
        )}
      >
        <span
          className={cn(
            "mb-2 inline-flex w-fit rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
            isMilestone ? "bg-indigo-500/20 text-indigo-200" : "bg-zinc-800 text-zinc-400"
          )}
        >
          {isMilestone ? "Milestone" : "Topic"}
        </span>
        <span
          className={cn(
            "flex flex-1 items-center justify-between gap-2 text-sm font-semibold leading-snug",
            isMilestone ? "text-indigo-100" : "text-zinc-100"
          )}
        >
          {topic.title}
          <ArrowRight className="h-3.5 w-3.5 shrink-0 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5" />
        </span>
      </Link>
    </motion.div>
  );
}
