import { notFound, redirect } from "next/navigation";
import { PortalPage } from "@/components/portal/portal-page";
import { LessonView } from "@/components/curriculum/lesson-view";
import { getCurrentUser } from "@/features/auth/actions/auth-actions";
import { createCurriculumService } from "@/features/curriculum/lib/create-services";
import { createAssignmentService } from "@/features/assignments/lib/create-services";
import { extractLearningObjectives } from "@/features/assignments/lib/extract-objectives";
import { isMentorRole } from "@/features/assignments/types";
import { AUTH_ROUTES } from "@/features/auth/constants";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await getCurrentUser();
  if (!session) return { title: "Lesson" };

  const curriculum = await createCurriculumService();
  const detail = await curriculum.getLessonBySlug(session.user.id, slug);
  return { title: detail?.lesson.title ?? "Lesson" };
}

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

  const mentor = isMentorRole(session.profile?.role);
  const assignments = await createAssignmentService().then((service) =>
    service.listForLesson(detail.lesson.id, session.user.id, {
      includeUnpublished: mentor,
    })
  );

  const objectives = extractLearningObjectives(detail.lesson.content);

  return (
    <PortalPage
      title={detail.lesson.title}
      subtitle={detail.module?.title ?? "Lesson"}
    >
      <LessonView
        detail={detail}
        objectives={objectives}
        assignments={assignments}
        isMentor={mentor}
      />
    </PortalPage>
  );
}
