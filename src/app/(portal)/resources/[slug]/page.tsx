import { notFound } from "next/navigation";
import { HubResourceReader } from "@/components/developer-hub/hub-resource-reader";
import {
  getHubResource,
  HUB_CATALOG,
} from "@/features/developer-hub/data/catalog";

export function generateStaticParams() {
  return HUB_CATALOG.map((r) => ({ slug: r.slug }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return params.then(({ slug }) => {
    const resource = getHubResource(slug);
    return {
      title: resource ? `${resource.title} · Developer Hub` : "Developer Hub",
      description: resource?.description,
    };
  });
}

export default async function ResourceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const resource = getHubResource(slug);
  if (!resource) notFound();
  return <HubResourceReader resource={resource} />;
}
