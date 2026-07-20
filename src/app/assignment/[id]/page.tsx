import { notFound, redirect } from "next/navigation";
import { PortalPage } from "@/components/portal/portal-page";
import { AssignmentView } from "@/components/assignments/assignment-view";
import { getCurrentUser } from "@/features/auth/actions/auth-actions";
import { createAssignmentService } from "@/features/assignments/lib/create-services";
import { isMentorRole } from "@/features/assignments/types";
import { AUTH_ROUTES } from "@/features/auth/constants";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getCurrentUser();
  if (!session) return { title: "Assignment" };

  const mentor = isMentorRole(session.profile?.role);
  const detail = await createAssignmentService().then((s) =>
    s.getDetail(id, session.user.id, { isMentor: mentor })
  );
  return { title: detail?.assignment.title ?? "Assignment" };
}

export default async function AssignmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getCurrentUser();
  if (!session) redirect(AUTH_ROUTES.login);

  const { id } = await params;
  const mentor = isMentorRole(session.profile?.role);
  const detail = await createAssignmentService().then((s) =>
    s.getDetail(id, session.user.id, { isMentor: mentor })
  );

  if (!detail) notFound();

  return (
    <PortalPage
      title={detail.assignment.title}
      subtitle="Assignment"
    >
      <AssignmentView detail={detail} isMentor={mentor} />
    </PortalPage>
  );
}
