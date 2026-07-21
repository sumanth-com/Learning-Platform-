import { PortalChrome } from "@/components/portal/portal-chrome";
import { NotesClient } from "@/components/portal/notes-client";

export const metadata = {
  title: "Notes",
};

export default function NotesPage() {
  return (
    <>
      <PortalChrome fillViewport />
      <NotesClient />
    </>
  );
}
