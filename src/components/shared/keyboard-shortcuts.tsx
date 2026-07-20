"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProgressStore } from "@/store/use-progress-store";

const shortcuts: Record<string, string> = {
  "1": "/",
  "2": "/roadmap",
  "3": "/projects",
  "4": "/ai-skills",
  "5": "/communication",
  "6": "/interview",
  "7": "/notes",
  "8": "/profile",
};

export function KeyboardShortcuts() {
  const router = useRouter();
  const updateStreak = useProgressStore((s) => s.updateStreak);

  useEffect(() => { updateStreak(); }, [updateStreak]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && shortcuts[e.key]) {
        e.preventDefault();
        router.push(shortcuts[e.key]);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [router]);

  return null;
}
