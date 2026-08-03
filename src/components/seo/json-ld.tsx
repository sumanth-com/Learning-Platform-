import Script from "next/script";
import {
  graphSchema,
  organizationSchema,
  websiteSchema,
} from "@/lib/seo-schema";

type JsonLdProps = {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
  id?: string;
};

/** JSON-LD via next/script for schema.org graphs. */
export function JsonLd({ data, id = "json-ld" }: JsonLdProps) {
  return (
    <Script
      id={id}
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

/** Site-wide organization + website graph for pages that opt in. */
export function OrganizationJsonLd() {
  return (
    <JsonLd
      id="json-ld-organization"
      data={graphSchema([organizationSchema(), websiteSchema()])}
    />
  );
}
