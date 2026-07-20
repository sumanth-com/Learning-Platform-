"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, CheckCircle2, ListChecks, Sparkles, GitBranch } from "lucide-react";
import type { CurriculumProject } from "@/curriculum/types";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ChecklistRow } from "@/components/shared/checklist-row";

export interface ProjectDetailContext {
  project: CurriculumProject;
  weekId: number;
  weekTitle: string;
  progressPct: number;
  isComplete: boolean;
  locked: boolean;
  meta: {
    progress: number;
    status: "not-started" | "in-progress" | "completed";
    githubLink: string;
    notes: string;
  };
  isDone: (id: string) => boolean;
  onToggleFeature: (id: string) => void;
  onSetComplete: (complete: boolean) => void;
  onUpdateMeta: (patch: Partial<ProjectDetailContext["meta"]>) => void;
}

interface ProjectDetailPanelProps {
  context: ProjectDetailContext | null;
  onClose: () => void;
}

function SectionTitle({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
  return (
    <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
      <Icon className="h-3.5 w-3.5" />
      {children}
    </h3>
  );
}

export function ProjectDetailPanel({ context, onClose }: ProjectDetailPanelProps) {
  useEffect(() => {
    if (!context) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [context, onClose]);

  const doneFeatures = context?.project.features.filter((f) => context.isDone(f.id)).length ?? 0;
  const totalFeatures = context?.project.features.length ?? 0;

  return (
    <AnimatePresence>
      {context && (
        <>
          <motion.button
            type="button"
            aria-label="Close panel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col border-l border-zinc-800 bg-zinc-950 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-zinc-800 px-6 py-5">
              <div className="min-w-0">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <Badge variant="purple" className="text-[10px]">
                    Week {context.weekId}
                  </Badge>
                  {context.isComplete && (
                    <Badge variant="success" className="text-[10px]">
                      Completed
                    </Badge>
                  )}
                </div>
                <h2 className="text-lg font-semibold leading-snug text-zinc-50">{context.project.title}</h2>
                <p className="mt-1 text-sm text-zinc-400">{context.project.description}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              <div className="space-y-6">
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-zinc-400">Progress</span>
                    <span className="font-semibold tabular-nums text-indigo-300">{context.progressPct}%</span>
                  </div>
                  <Progress value={context.progressPct} className="h-2" />
                  <p className="mt-2 text-xs text-zinc-500">
                    {doneFeatures} of {totalFeatures} features completed
                  </p>
                </div>

                <div className="space-y-3">
                  <SectionTitle icon={ListChecks}>Features to build</SectionTitle>
                  <div className="space-y-2">
                    {context.project.features.map((feat) => (
                      <ChecklistRow
                        key={feat.id}
                        id={feat.id}
                        title={feat.title}
                        checked={context.isDone(feat.id)}
                        onToggle={() => context.onToggleFeature(feat.id)}
                      />
                    ))}
                  </div>
                </div>

                {context.project.requirements && context.project.requirements.length > 0 && (
                  <div className="space-y-3">
                    <SectionTitle icon={CheckCircle2}>Requirements</SectionTitle>
                    <ul className="space-y-2 rounded-xl border border-zinc-800 bg-zinc-900/30 p-4">
                      {context.project.requirements.map((r) => (
                        <li key={r} className="flex gap-2.5 text-sm text-zinc-300">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {context.project.bonusFeatures && context.project.bonusFeatures.length > 0 && (
                  <div className="space-y-3">
                    <SectionTitle icon={Sparkles}>Bonus features</SectionTitle>
                    <div className="flex flex-wrap gap-2">
                      {context.project.bonusFeatures.map((b) => (
                        <Badge key={b} variant="purple">
                          {b}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <SectionTitle icon={GitBranch}>GitHub & notes</SectionTitle>
                  <Input
                    value={context.meta.githubLink}
                    onChange={(e) => context.onUpdateMeta({ githubLink: e.target.value })}
                    placeholder="https://github.com/username/project"
                    className="h-10"
                  />
                  <Textarea
                    value={context.meta.notes}
                    onChange={(e) => context.onUpdateMeta({ notes: e.target.value })}
                    placeholder="Implementation notes, blockers, learnings..."
                    className="min-h-[100px] text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-zinc-800 px-6 py-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <label className="flex cursor-pointer items-center gap-2.5">
                  <Checkbox
                    checked={context.isComplete}
                    onCheckedChange={(c) => context.onSetComplete(!!c)}
                  />
                  <span className="text-sm font-medium text-zinc-200">Mark project complete</span>
                </label>
                {context.meta.githubLink && (
                  <a
                    href={context.meta.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-indigo-400 hover:text-indigo-300"
                  >
                    Open repo
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
