import { FeatureHub } from "@/components/portal/feature-hub";
import { PORTAL_ROUTES } from "@/features/portal/types";

export const metadata = {
  title: "Practice",
};

export default function PracticePage() {
  return (
    <FeatureHub
      title="Practice"
      description="Drill coding challenges, algorithms, and hands-on exercises tied to your current modules."
      bullets={[
        "Warm-up drills matched to your active phase",
        "Timed practice sets for interview readiness",
        "Track accuracy and streak across sessions",
      ]}
      primaryHref={PORTAL_ROUTES.roadmap}
      primaryLabel="Continue learning"
    />
  );
}
