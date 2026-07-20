"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { ProgressService } from "@/features/curriculum/services/progress.service";
import { LessonsRepository } from "@/features/curriculum/repositories/lessons.repository";
import { ModulesRepository } from "@/features/curriculum/repositories/modules.repository";
import { CURRICULUM_ROUTES } from "@/features/curriculum/types";

export type ProgressActionResult =
  | { success: true; completed: boolean }
  | { success: false; error: string };

export async function toggleLessonCompleteAction(
  lessonId: string,
  currentlyCompleted: boolean
): Promise<ProgressActionResult> {
  if (!lessonId) {
    return { success: false, error: "Lesson id is required." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "You must be signed in." };
  }

  try {
    const progress = new ProgressService(supabase);
    const next = !currentlyCompleted;
    if (next) {
      await progress.markComplete(user.id, lessonId);
    } else {
      await progress.markIncomplete(user.id, lessonId);
    }

    const lessonsRepo = new LessonsRepository(supabase);
    const modulesRepo = new ModulesRepository(supabase);
    const lesson = await lessonsRepo.findById(lessonId);

    revalidatePath(CURRICULUM_ROUTES.journey);
    revalidatePath("/dashboard");
    revalidatePath("/learn", "layout");
    if (lesson) {
      revalidatePath(CURRICULUM_ROUTES.lesson(lesson.slug));
      const module = await modulesRepo.findById(lesson.module_id);
      if (module) {
        revalidatePath(CURRICULUM_ROUTES.module(module.slug));
      }
    }

    return { success: true, completed: next };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to update progress.";
    return { success: false, error: message };
  }
}
