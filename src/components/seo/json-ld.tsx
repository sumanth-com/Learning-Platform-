/** Safe JSON-LD in the initial HTML for crawlability and rich results. */
type JsonLdProps = {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
  id?: string;
};

export function JsonLd({ data, id = "json-ld" }: JsonLdProps) {
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
