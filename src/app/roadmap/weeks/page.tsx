import { redirect } from "next/navigation";

/** Legacy route — journey map is now the main /roadmap page */
export default function RoadmapWeeksRedirect() {
  redirect("/roadmap");
}
