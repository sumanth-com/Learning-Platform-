"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LearnSidebar } from "@/components/learn/learn-sidebar";
import type {
  WorkspaceLessonNode,
  WorkspaceTree,
} from "@/features/learn/lib/workspace-tree";

type LearnMobileDrawerProps = {
  open: boolean;
  onClose: () => void;
  tree: WorkspaceTree;
  activeLessonSlug: string | null;
  expandedPhases: Set<string>;
  expandedModules: Set<string>;
  onTogglePhase: (phaseId: string) => void;
  onToggleModule: (moduleId: string) => void;
  onSelectLesson: (lesson: WorkspaceLessonNode) => void;
};

export function LearnMobileDrawer({
  open,
  onClose,
  tree,
  activeLessonSlug,
  expandedPhases,
  expandedModules,
  onTogglePhase,
  onToggleModule,
  onSelectLesson,
}: LearnMobileDrawerProps) {
  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />
          <motion.div
            key="drawer"
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", stiffness: 380, damping: 36 }}
            className="fixed inset-y-0 left-0 z-50 flex lg:hidden"
          >
            <div className="relative h-full">
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="absolute right-2 top-2 z-10 h-8 w-8"
                onClick={onClose}
                aria-label="Close curriculum"
              >
                <X className="h-4 w-4" />
              </Button>
              <LearnSidebar
                tree={tree}
                activeLessonSlug={activeLessonSlug}
                expandedPhases={expandedPhases}
                expandedModules={expandedModules}
                onTogglePhase={onTogglePhase}
                onToggleModule={onToggleModule}
                onSelectLesson={(lesson) => {
                  onSelectLesson(lesson);
                  onClose();
                }}
                className="h-full shadow-2xl shadow-black/40"
              />
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
