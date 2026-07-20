import { FeatureHub } from "@/components/portal/feature-hub";
import { PORTAL_ROUTES } from "@/features/portal/types";

export const metadata = {
  title: "Resources",
};

export default function ResourcesPage() {
  return (
    <FeatureHub
      title="Resources"
      description="Curated docs, cheatsheets, and reference material linked to every module in your path."
      bullets={[
        "Official docs and deep-dive articles",
        "Cheatsheets for HTML, CSS, JS, and React",
        "Downloadable assets from lesson resources",
      ]}
      primaryHref={PORTAL_ROUTES.journey}
      primaryLabel="Explore journey"
    />
  );
}
