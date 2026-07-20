import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { getAdminContext } from "@/features/admin/lib/require-admin";
import { ADMIN_ROUTES } from "@/features/admin/types";
import { Badge } from "@/components/ui/badge";

export default async function AdminSettingsPage() {
  const ctx = await getAdminContext();
  if (!ctx.ok) return null;

  const profile = ctx.profile as {
    full_name?: string | null;
    email?: string;
    role?: string;
  } | null;

  return (
    <div>
      <AdminPageHeader
        title="Settings"
        description="Admin portal preferences and account context for staff users."
      />

      <div className="mx-auto max-w-2xl space-y-6">
        <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
          <h2 className="text-sm font-medium text-zinc-200">Signed-in staff</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-zinc-500">Name</dt>
              <dd className="text-zinc-200">
                {profile?.full_name || "—"}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-zinc-500">Email</dt>
              <dd className="truncate text-zinc-200">{profile?.email || "—"}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-zinc-500">Role</dt>
              <dd>
                <Badge variant="default" className="capitalize">
                  {profile?.role || ctx.role}
                </Badge>
              </dd>
            </div>
          </dl>
        </section>

        <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
          <h2 className="text-sm font-medium text-zinc-200">Portal</h2>
          <p className="mt-2 text-sm text-zinc-500">
            The Admin Portal uses a dedicated layout and never shares the
            student navigation. Sidebar collapse preference is stored in this
            browser.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-zinc-400">
            <li>
              <Link
                href={ADMIN_ROUTES.root}
                className="text-indigo-400 hover:underline"
              >
                Dashboard
              </Link>{" "}
              — content overview
            </li>
            <li>
              <Link
                href={ADMIN_ROUTES.analytics}
                className="text-indigo-400 hover:underline"
              >
                Analytics
              </Link>{" "}
              — inventory metrics
            </li>
            <li>
              <Link href="/dashboard" className="text-indigo-400 hover:underline">
                Student app
              </Link>{" "}
              — leave admin chrome
            </li>
          </ul>
        </section>

        <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
          <h2 className="text-sm font-medium text-zinc-200">Access control</h2>
          <p className="mt-2 text-sm text-zinc-500">
            Only profiles with role <code className="text-zinc-300">admin</code>{" "}
            or <code className="text-zinc-300">instructor</code> can open{" "}
            <code className="text-zinc-300">/admin</code>. Students receive a
            403 Forbidden page.
          </p>
        </section>
      </div>
    </div>
  );
}
