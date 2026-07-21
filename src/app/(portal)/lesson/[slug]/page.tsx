import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/actions/auth-actions";
import { createCurriculumService } from "@/features/curriculum/lib/create-services";
import { AUTH_ROUTES } from "@/features/auth/constants";
import { CURRICULUM_ROUTES } from "@/features/curriculum/types";

/**
 * Legacy lesson URL → Module Hub topic page.
 */
export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const session = await getCurrentUser();
  if (!session) redirect(AUTH_ROUTES.login);

  const { slug } = await params;
  const curriculum = await createCurriculumService();
  const detail = await curriculum.getLessonBySlug(session.user.id, slug);
  if (!detail) notFound();

  redirect(
    CURRICULUM_ROUTES.moduleTopic(detail.module.slug, detail.lesson.slug)
  );
}
