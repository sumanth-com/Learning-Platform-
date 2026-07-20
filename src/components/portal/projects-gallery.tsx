"use client";

import { useMemo } from "react";
import { getAllProjectListings } from "@/curriculum/project-catalog";
import { ProjectCard } from "@/components/projects/project-card";
import { useProgressStore } from "@/store/use-progress-store";

export function ProjectsGallery() {
  const projects = useMemo(() => getAllProjectListings(), []);
  const isDone = useProgressStore((s) => s.isDone);
  const isLocked = useProgressStore((s) => s.isModuleWeekLocked);

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {projects.map((project, index) => {
        const locked =
          project.weekId <= 11
            ? isLocked("projects", project.weekId)
            : false;
        const complete = isDone(`${project.id}-complete`);

        return (
          <ProjectCard
            key={project.id}
            project={project}
            index={index}
            locked={locked}
            complete={complete}
          />
        );
      })}
    </div>
  );
}
