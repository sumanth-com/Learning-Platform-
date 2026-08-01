import { redirect } from "next/navigation";
import { PortalChrome } from "@/components/portal/portal-chrome";
import { ProfileWorkspace } from "@/components/profile/profile-workspace";
import { getCurrentUser } from "@/features/auth/actions/auth-actions";
import { AUTH_ROUTES } from "@/features/auth/constants";

export const metadata = {
  title: "Profile",
};

export default async function ProfilePage() {
  const session = await getCurrentUser();
  if (!session) redirect(AUTH_ROUTES.login);

  const { user, profile } = session;
  const headline =
    (typeof user.user_metadata?.headline === "string"
      ? user.user_metadata.headline
      : undefined) || "Upcoming Developer";

  return (
    <>
      <PortalChrome
        title="Profile"
        subtitle="Candidate details and your SupraBase identity card."
        fillViewport
      />
      <div className="flex h-full min-h-0 flex-col max-md:overflow-hidden md:overflow-y-auto">
        <ProfileWorkspace
          userId={user.id}
          email={user.email || profile?.email || ""}
          initialProfile={profile}
          initialHeadline={headline}
        />
      </div>
    </>
  );
}
