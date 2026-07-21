"use client";

import { ExternalLink, FileText } from "lucide-react";
import type { ModuleHubPayload } from "@/features/curriculum/actions/module-hub-actions";

export function ModuleResources({ payload }: { payload: ModuleHubPayload }) {
  const { resources } = payload;

  const docs = resources.filter((r) =>
    ["article", "docs", "pdf"].includes(r.type)
  );
  const other = resources.filter(
    (r) => !["article", "docs", "pdf"].includes(r.type)
  );

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <h2 className="text-lg font-semibold text-zinc-50">Module resources</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Documentation and references attached to topics in this module.
        </p>
      </header>

      <ResourceGroup title="Documentation & cheatsheets" items={docs} />
      <ResourceGroup title="External references" items={other} />

      {resources.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-950/30 p-8 text-center">
          <FileText className="mx-auto h-6 w-6 text-zinc-600" />
          <p className="mt-3 text-sm text-zinc-400">
            No resources published for this module yet.
          </p>
        </div>
      ) : null}
    </div>
  );
}

function ResourceGroup({
  title,
  items,
}: {
  title: string;
  items: ModuleHubPayload["resources"];
}) {
  if (items.length === 0) return null;
  return (
    <section>
      <h3 className="mb-3 text-sm font-semibold text-zinc-100">{title}</h3>
      <ul className="space-y-2">
        {items.map((resource) => (
          <li key={resource.id}>
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 rounded-xl border border-zinc-800/80 bg-zinc-900/40 px-3.5 py-3 transition hover:border-zinc-700"
            >
              <span className="min-w-0">
                <span className="block truncate text-sm text-zinc-200">
                  {resource.title}
                </span>
                <span className="text-[11px] text-zinc-600">
                  {resource.lessonTitle} · {resource.type}
                </span>
              </span>
              <ExternalLink className="h-3.5 w-3.5 shrink-0 text-zinc-600" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
