import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/actions/auth-actions";
import { createCurriculumService } from "@/features/curriculum/lib/create-services";
import { AUTH_ROUTES } from "@/features/auth/constants";
import { CURRICULUM_ROUTES } from "@/features/curriculum/types";

type PageProps = {
  params: Promise<{ courseSlug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/**
 * Legacy Learning Path URLs redirect into the Module Hub topic experience.
 */
export default async function LearnCoursePage({
  params,
  searchParams,
}: PageProps) {
  const session = await getCurrentUser();
  if (!session) redirect(AUTH_ROUTES.login);

  const { courseSlug } = await params;
  const sp = await searchParams;
  const requestedLesson =
    typeof sp.lesson === "string" ? sp.lesson : undefined;

  const curriculum = await createCurriculumService();

  if (requestedLesson) {
    const detail = await curriculum.getLessonBySlug(
      session.user.id,
      requestedLesson
    );
    if (detail && detail.course.slug === courseSlug) {
      redirect(
        CURRICULUM_ROUTES.moduleTopic(detail.module.slug, detail.lesson.slug)
      );
    }
  }

  const journey = await curriculum.getCourseJourney(
    session.user.id,
    courseSlug
  );
  if (!journey) notFound();

  const firstModule = journey.phases[0]?.modules[0];
  if (firstModule) {
    redirect(CURRICULUM_ROUTES.module(firstModule.slug));
  }

  redirect(CURRICULUM_ROUTES.roadmap);
}
