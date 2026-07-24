import Link from "next/link";
import { redirect } from "next/navigation";
import { PortalChrome } from "@/components/portal/portal-chrome";
import { ProfileCertificates } from "@/components/certifications/profile-certificates";
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
        subtitle="Your SupraBase account, certificates, and skill badges."
      />
      <div className="mx-auto max-w-3xl space-y-8 px-1 pb-12">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600/20 text-2xl font-semibold text-indigo-300">
            {(profile?.full_name || user.email || "U").charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-lg font-semibold tracking-tight text-foreground">
              {profile?.full_name || "Your profile"}
            </p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <Link
              href="/certifications"
              className="mt-1 inline-block text-[13px] font-medium text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
            >
              View certifications →
            </Link>
          </div>
        </div>

        <div className="divide-y divide-border/60 rounded-2xl border border-border/60 bg-card">
          {fields.map((field) => (
            <div
              key={field.label}
              className="flex items-center justify-between gap-4 px-5 py-4"
            >
              <dt className="text-sm text-muted-foreground">{field.label}</dt>
              <dd className="text-sm font-medium capitalize text-foreground">
                {field.value}
              </dd>
            </div>
          ))}
        </div>

        <ProfileCertificates />
      </div>
    </>
  );
}
