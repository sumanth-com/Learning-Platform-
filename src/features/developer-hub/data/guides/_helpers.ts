import type { HubSection } from "../../types";

export function sec(
  id: string,
  title: string,
  body: string,
  extra?: Partial<HubSection>
): HubSection {
  return { id, title, body, kind: "content", ...extra };
}
