import { redirect } from "next/navigation";

/** @deprecated Use /roadmap */
export default function JourneyRedirectPage() {
  redirect("/roadmap");
}
