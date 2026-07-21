import { FeatureHub } from "@/components/portal/feature-hub";
import { PORTAL_ROUTES } from "@/features/portal/types";

export const metadata = {
  title: "AI Mentor",
};

export default function AiMentorPage() {
  return (
    <FeatureHub
      title="AI Mentor"
      description="Get contextual help while you learn — explanations, debugging tips, and next-step guidance."
      bullets={[
        "Ask questions grounded in your current lesson",
        "Get code review hints without spoiling solutions",
        "Plan your next study block with the mentor",
      ]}
      primaryHref={PORTAL_ROUTES.journey}
      primaryLabel="Open courses"
    />
  );
}
