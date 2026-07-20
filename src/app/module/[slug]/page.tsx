import { notFound, redirect } from "next/navigation";
import { PortalPage } from "@/components/portal/portal-page";
import { ModuleView } from "@/components/curriculum/module-view";
import { getCurrentUser } from "@/features/auth/actions/auth-actions";
import { createCurriculumService } from "@/features/curriculum/lib/create-services";
import { AUTH_ROUTES } from "@/features/auth/constants";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await getCurrentUser();
  if (!session) return { title: "Module" };

  const curriculum = await createCurriculumService();
  const detail = await curriculum.getModuleBySlug(session.user.id, slug);
  return { title: detail?.module.title ?? "Module" };
}

export default async function ModulePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const session = await getCurrentUser();
  if (!session) redirect(AUTH_ROUTES.login);

  const { slug } = await params;
  const curriculum = await createCurriculumService();
  const detail = await curriculum.getModuleBySlug(session.user.id, slug);

  if (!detail) notFound();

  return (
    <PortalPage
      title={detail.module.title}
      subtitle={detail.phase?.title ?? "Module"}
    >
      <ModuleView detail={detail} />
    </PortalPage>
  );
}
