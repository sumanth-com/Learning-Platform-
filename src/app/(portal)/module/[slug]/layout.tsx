import { notFound, redirect } from "next/navigation";
import { ModuleHubShell } from "@/components/module-hub/module-hub-shell";
import { getCurrentUser } from "@/features/auth/actions/auth-actions";
import { AUTH_ROUTES } from "@/features/auth/constants";
import { loadModuleHubAction } from "@/features/curriculum/actions/module-hub-actions";

export default async function ModuleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const session = await getCurrentUser();
  if (!session) redirect(AUTH_ROUTES.login);

  const { slug } = await params;
  const result = await loadModuleHubAction(slug);
  if (!result.success) notFound();

  return (
    <ModuleHubShell moduleSlug={slug} initialData={result.data}>
      {children}
    </ModuleHubShell>
  );
}
