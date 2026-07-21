import { redirect } from "next/navigation";
import { PortalChrome } from "@/components/portal/portal-chrome";
import { getCurrentUser } from "@/features/auth/actions/auth-actions";
import { AUTH_ROUTES } from "@/features/auth/constants";

export const metadata = {
  title: "Profile",
};

export default async function ProfilePage() {
  const session = await getCurrentUser();
  if (!session) redirect(AUTH_ROUTES.login);

  const { user, profile } = session;
  const fields = [
    { label: "Full name", value: profile?.full_name || "—" },
    { label: "Email", value: profile?.email || user.email || "—" },
    { label: "Role", value: profile?.role ?? "student" },
    {
      label: "Member since",
      value: profile?.created_at
        ? new Date(profile.created_at).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "—",
    },
  ];

  return (
    <>
      <PortalChrome
        title="Profile"
        subtitle="Your SupraLearn account details."
      />
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600/20 text-2xl font-semibold text-indigo-300">
            {(profile?.full_name || user.email || "U").charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-lg font-semibold tracking-tight text-zinc-50">
              {profile?.full_name || "Your profile"}
            </p>
            <p className="text-sm text-zinc-400">{user.email}</p>
          </div>
        </div>

        <div className="divide-y divide-zinc-800/80 rounded-2xl border border-zinc-800/80 bg-zinc-900/40">
          {fields.map((field) => (
            <div
              key={field.label}
              className="flex items-center justify-between gap-4 px-5 py-4"
            >
              <dt className="text-sm text-zinc-500">{field.label}</dt>
              <dd className="text-sm font-medium capitalize text-zinc-200">
                {field.value}
              </dd>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
