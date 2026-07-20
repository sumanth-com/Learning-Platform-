"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Map, Route } from "lucide-react";
import { JAVA_ROADMAP_CURRICULUM } from "@/curriculum/java-roadmap/curriculum";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

function SectionCard({
  section,
  index,
}: {
  section: (typeof JAVA_ROADMAP_CURRICULUM)[number];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.99 }}
    >
      <Link
        href={`/roadmap/topic/${section.slug}`}
        className={cn(
          "group flex h-full flex-col rounded-xl border border-zinc-800/90 bg-zinc-900/50 p-4 transition-all duration-300",
          "hover:border-indigo-500/40 hover:bg-zinc-900/80 hover:shadow-lg hover:shadow-indigo-500/10",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        )}
      >
        <div className="mb-2 flex items-center gap-2">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-500/15 text-[11px] font-bold text-indigo-300">
            {index + 1}
          </span>
          {section.badge && (
            <span className="rounded-full bg-indigo-500/15 px-2 py-0.5 text-[10px] font-semibold text-indigo-300">
              {section.badge}
            </span>
          )}
        </div>
        <h3 className="flex flex-1 items-start justify-between gap-2 text-sm font-semibold leading-snug text-zinc-100">
          {section.title}
          <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5" />
        </h3>
        <p className="mt-2 line-clamp-2 text-xs text-zinc-500">{section.description}</p>
        <p className="mt-3 text-[10px] font-medium uppercase tracking-wider text-zinc-600">
          {section.subtopics.length} topics · click to explore
        </p>
      </Link>
    </motion.div>
  );
}

export function JavaDeveloperRoadmap() {
  const { scrollYProgress } = useScroll();
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <div className="relative min-h-screen overflow-hidden pb-24">
      <motion.div style={{ y: bgY }} className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-purple-500/8 blur-3xl" />
      </motion.div>

      <header className="relative mb-10 text-center">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm text-indigo-300">
            <Map className="h-4 w-4" />
            Java Developer Roadmap
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
            Beginner to Spring Boot &amp; Jobs
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-zinc-400">
            19 structured sections — click any section, pick a topic from the dropdown, then explore patterns with
            runnable code.
          </p>
          <div className="mt-6">
            <Link href="/roadmap/weeks">
              <Button variant="secondary" className="gap-2">
                <Route className="h-4 w-4" />
                11-Week Journey Map
              </Button>
            </Link>
          </div>
        </motion.div>
      </header>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-3 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
        {JAVA_ROADMAP_CURRICULUM.map((section, i) => (
          <SectionCard key={section.slug} section={section} index={i} />
        ))}
      </div>
    </div>
  );
}
