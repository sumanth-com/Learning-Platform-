import {
  graphSchema,
  organizationSchema,
  websiteSchema,
} from "@/lib/seo-schema";

type JsonLdProps = {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
};

/** Safe JSON-LD script tag for schema.org graphs. */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

/** Site-wide organization + website graph for pages that opt in. */
export function OrganizationJsonLd() {
  return (
    <JsonLd data={graphSchema([organizationSchema(), websiteSchema()])} />
  );
}
