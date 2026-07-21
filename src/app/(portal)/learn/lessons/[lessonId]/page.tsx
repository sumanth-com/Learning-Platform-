import { redirect } from "next/navigation";
import { CURRICULUM_ROUTES } from "@/features/curriculum/types";
import { LessonsRepository } from "@/features/curriculum/repositories/lessons.repository";
import { createClient } from "@/lib/supabase/server";

/** Legacy lesson-by-id → slug-based /lesson/[slug] */
export default async function LegacyLessonRedirect({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;
  const supabase = await createClient();
  const lessons = new LessonsRepository(supabase);
  const lesson = await lessons.findById(lessonId);

  if (lesson?.slug) {
    redirect(CURRICULUM_ROUTES.lesson(lesson.slug));
  }

  redirect(CURRICULUM_ROUTES.journey);
}
