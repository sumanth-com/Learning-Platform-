import { PortalPage } from "@/components/portal/portal-page";
import { NotesClient } from "@/components/portal/notes-client";

export const metadata = {
  title: "Notes",
};

export default function NotesPage() {
  return (
    <PortalPage>
      <NotesClient />
    </PortalPage>
  );
}
