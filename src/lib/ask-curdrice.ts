const WHATSAPP_NUMBER = "918074241025";

function describePath(pathname: string): string {
  if (pathname === "/") return "Dashboard";

  const segments = pathname.split("/").filter(Boolean);
  const [root, second, third, fourth] = segments;

  switch (root) {
    case "roadmap":
      if (second === "week" && third) {
        return fourth === "learn"
          ? `Roadmap Week ${third} (Learn)`
          : `Roadmap Week ${third}`;
      }
      if (second === "topic" && third) return `Roadmap Topic (${third})`;
      if (second === "weeks") return "Roadmap Weeks";
      if (second && !Number.isNaN(Number(second))) return `Roadmap Week ${second}`;
      return "Roadmap";
    case "projects":
      if (second && third) return `Projects Week ${second} / ${third}`;
      if (second) return `Projects Week ${second}`;
      return "Projects";
    case "ai-skills":
      if (second) return `AI Skills (${second})`;
      return "AI Skills";
    case "communication":
      if (second) return `Communication (${second})`;
      return "Communication";
    case "interview":
      if (second) return `Interview Question ${second}`;
      return "Interview";
    case "notes":
      return "Notes";
    case "profile":
      return "Profile";
    default:
      return pathname;
  }
}

export function getAskCurdriceWhatsAppUrl(pathname: string): string {
  const context = describePath(pathname);
  const message = `Hi Curdrice! I have a question about SupraCodez — ${context}.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
