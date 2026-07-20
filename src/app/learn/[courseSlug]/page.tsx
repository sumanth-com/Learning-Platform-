import { notFound, redirect } from "next/navigation";
import { LearningWorkspace } from "@/components/learn/learning-workspace";
import { getCurrentUser } from "@/features/auth/actions/auth-actions";
import { createCurriculumService } from "@/features/curriculum/lib/create-services";
import { createAssignmentService } from "@/features/assignments/lib/create-services";
import { isMentorRole } from "@/features/assignments/types";
import { AUTH_ROUTES } from "@/features/auth/constants";
import {
  buildWorkspaceTree,
  resolveInitialLessonSlug,
  type WorkspaceLessonPayload,
} from "@/features/learn/lib/workspace-tree";
import { resolveLessonObjectives } from "@/features/learn/lib/objectives";

type PageProps = {
  params: Promise<{ courseSlug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: PageProps) {
  const { courseSlug } = await params;
  const session = await getCurrentUser();
  if (!session) return { title: "Learn" };

  const curriculum = await createCurriculumService();
  const journey = await curriculum.getCourseJourney(
    session.user.id,
    courseSlug
  );
  return {
    title: journey ? `Learn · ${journey.course.title}` : "Learn",
  };
}

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
  const journey = await curriculum.getCourseJourney(
    session.user.id,
    courseSlug
  );
  if (!journey) notFound();

  const tree = buildWorkspaceTree(journey, requestedLesson);
  const initialLessonSlug = resolveInitialLessonSlug(tree, requestedLesson);

  let initialPayload: WorkspaceLessonPayload | null = null;
  if (initialLessonSlug) {
    const detail = await curriculum.getLessonBySlug(
      session.user.id,
      initialLessonSlug
    );
    if (detail && detail.course.slug === courseSlug) {
      const mentor = isMentorRole(session.profile?.role);
      const assignments = await createAssignmentService().then((service) =>
        service.listForLesson(detail.lesson.id, session.user.id, {
          includeUnpublished: mentor,
        })
      );
      initialPayload = {
        detail,
        objectives: resolveLessonObjectives(
          detail.lesson.learning_objectives,
          detail.lesson.content
        ),
        assignments,
        isMentor: mentor,
      };
    }
  }

  return (
    <LearningWorkspace
      courseSlug={courseSlug}
      journey={journey}
      initialLessonSlug={initialLessonSlug}
      initialPayload={initialPayload}
    />
  );
}
